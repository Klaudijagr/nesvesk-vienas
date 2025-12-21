import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { assertAdmin } from "./lib/admin";
import { getCurrentUserId, getOrCreateUser } from "./lib/auth";

type Language = "Lithuanian" | "English" | "Ukrainian" | "Russian";
type HolidayDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";
type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "matched"
  | "self";

function isProfileCompleteForBrowse(
  profile: Partial<Doc<"profiles">>
): boolean {
  const firstNameOk = (profile.firstName ?? "").trim().length > 0;
  const bioOk = (profile.bio ?? "").trim().length > 0;
  const languagesOk = (profile.languages?.length ?? 0) > 0;
  return firstNameOk && bioOk && languagesOk;
}

// Top-level regex for username validation
const USERNAME_REGEX = /^[a-z0-9-]+$/;

// Helper: Get connection status between two users
async function getConnectionStatusBetween(
  ctx: QueryCtx,
  currentUserId: Id<"users">,
  otherUserId: Id<"users">
): Promise<ConnectionStatus> {
  if (currentUserId === otherUserId) {
    return "self";
  }

  const sentInv = await ctx.db
    .query("invitations")
    .withIndex("by_from", (q) => q.eq("fromUserId", currentUserId))
    .filter((q) => q.eq(q.field("toUserId"), otherUserId))
    .first();

  const receivedInv = await ctx.db
    .query("invitations")
    .withIndex("by_to", (q) => q.eq("toUserId", currentUserId))
    .filter((q) => q.eq(q.field("fromUserId"), otherUserId))
    .first();

  if (sentInv?.status === "accepted" || receivedInv?.status === "accepted") {
    return "matched";
  }
  if (sentInv?.status === "pending") {
    return "pending_sent";
  }
  if (receivedInv?.status === "pending") {
    return "pending_received";
  }
  return "none";
}

// Get current user's profile
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Get a profile by user ID (public info only)
export const getProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) {
      return null;
    }

    // Hide sensitive info unless matched
    const currentUserId = await getCurrentUserId(ctx);
    const isOwner = currentUserId === args.userId;

    // Check if matched (accepted invitation exists in either direction)
    let isMatched = false;
    if (currentUserId && currentUserId !== args.userId) {
      // Check if current user sent an accepted invitation to this profile's owner
      const sentAccepted = await ctx.db
        .query("invitations")
        .withIndex("by_from", (q) => q.eq("fromUserId", currentUserId))
        .filter((q) =>
          q.and(
            q.eq(q.field("toUserId"), args.userId),
            q.eq(q.field("status"), "accepted")
          )
        )
        .first();

      if (sentAccepted) {
        isMatched = true;
      } else {
        // Check if this profile's owner sent an accepted invitation to current user
        const receivedAccepted = await ctx.db
          .query("invitations")
          .withIndex("by_to", (q) => q.eq("toUserId", currentUserId))
          .filter((q) =>
            q.and(
              q.eq(q.field("fromUserId"), args.userId),
              q.eq(q.field("status"), "accepted")
            )
          )
          .first();

        isMatched = !!receivedAccepted;
      }
    }

    if (!(isOwner || isMatched)) {
      return {
        ...profile,
        lastName: undefined,
        phone: undefined,
        address: undefined,
      };
    }

    return profile;
  },
});

// List profiles with filters - optimized with pagination
export const listProfiles = query({
  args: {
    city: v.optional(v.string()),
    role: v.optional(v.string()),
    language: v.optional(v.string()),
    date: v.optional(v.string()),
    limit: v.optional(v.number()), // Pagination limit (default 20)
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    const limit = args.limit ?? 50; // Default limit to reduce bandwidth

    // Get blocked user IDs (both directions) if logged in - do this first
    let blockedUserIds = new Set<Id<"users">>();
    if (currentUserId) {
      const [myBlocks, blockedMe] = await Promise.all([
        ctx.db
          .query("blocks")
          .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
          .collect(),
        ctx.db
          .query("blocks")
          .withIndex("by_blocked", (q) => q.eq("blockedId", currentUserId))
          .collect(),
      ]);
      blockedUserIds = new Set([
        ...myBlocks.map((b) => b.blockedId),
        ...blockedMe.map((b) => b.blockerId),
      ]);
    }

    // Build query - use index when city filter is provided
    const profileQuery = args.city
      ? ctx.db
          .query("profiles")
          .withIndex("by_city", (q) =>
            q.eq("city", args.city as typeof args.city & string)
          )
      : ctx.db.query("profiles");

    // Collect with server-side filtering
    const allProfiles = await profileQuery.collect();

    // Filter profiles - combine all conditions for efficiency
    const filteredProfiles = allProfiles.filter((p) => {
      // Basic visibility and completeness checks
      if (p.isVisible === false) {
        return false;
      }
      if (!isProfileCompleteForBrowse(p)) {
        return false;
      }
      if (p.userId === currentUserId) {
        return false;
      }
      if (blockedUserIds.has(p.userId)) {
        return false;
      }

      // Apply role filter
      if (args.role && p.role !== args.role && p.role !== "both") {
        return false;
      }

      // Apply language filter
      if (args.language && !p.languages.includes(args.language as Language)) {
        return false;
      }

      // Apply date filter
      if (args.date && !p.availableDates.includes(args.date as HolidayDate)) {
        return false;
      }

      return true;
    });

    // Apply limit after filtering
    const limitedProfiles = filteredProfiles.slice(0, limit);

    // Get connection status for each profile if user is logged in
    // Batch the invitation queries for better performance
    const profilesWithStatus = await Promise.all(
      limitedProfiles.map(async (p) => {
        const connectionStatus = currentUserId
          ? await getConnectionStatusBetween(ctx, currentUserId, p.userId)
          : ("none" as ConnectionStatus);

        // Return slim profile - exclude large fields not needed in list view
        return {
          _id: p._id,
          _creationTime: p._creationTime,
          userId: p.userId,
          username: p.username,
          firstName: p.firstName,
          age: p.age,
          city: p.city,
          bio: p.bio,
          photoUrl: p.photoUrl, // Only main photo, not the full photos array
          role: p.role,
          hostingStatus: p.hostingStatus,
          guestStatus: p.guestStatus,
          languages: p.languages,
          availableDates: p.availableDates,
          hostingDates: p.hostingDates,
          guestDates: p.guestDates,
          verified: p.verified,
          vibes: p.vibes,
          dietaryInfo: p.dietaryInfo,
          concept: p.concept,
          capacity: p.capacity,
          lastActive: p.lastActive,
          connectionStatus,
          // Explicitly excluded: photos array, lastName, phone, address, amenities, houseRules
        };
      })
    );

    return profilesWithStatus;
  },
});

// Create or update profile
export const upsertProfile = mutation({
  args: {
    role: v.union(v.literal("host"), v.literal("guest"), v.literal("both")),
    // New granular status fields
    hostingStatus: v.optional(
      v.union(
        v.literal("can-host"),
        v.literal("may-host"),
        v.literal("cant-host")
      )
    ),
    guestStatus: v.optional(
      v.union(
        v.literal("looking"),
        v.literal("maybe-guest"),
        v.literal("not-looking")
      )
    ),
    hostingDates: v.optional(
      v.array(
        v.union(
          v.literal("23 Dec"),
          v.literal("24 Dec"),
          v.literal("25 Dec"),
          v.literal("26 Dec"),
          v.literal("27 Dec"),
          v.literal("28 Dec"),
          v.literal("29 Dec"),
          v.literal("30 Dec"),
          v.literal("31 Dec"),
          v.literal("1 Jan"),
          v.literal("2 Jan")
        )
      )
    ),
    guestDates: v.optional(
      v.array(
        v.union(
          v.literal("23 Dec"),
          v.literal("24 Dec"),
          v.literal("25 Dec"),
          v.literal("26 Dec"),
          v.literal("27 Dec"),
          v.literal("28 Dec"),
          v.literal("29 Dec"),
          v.literal("30 Dec"),
          v.literal("31 Dec"),
          v.literal("1 Jan"),
          v.literal("2 Jan")
        )
      )
    ),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    age: v.number(), // Required, must be 18+
    city: v.union(
      v.literal("Vilnius"),
      v.literal("Kaunas"),
      v.literal("Klaipėda"),
      v.literal("Šiauliai"),
      v.literal("Panevėžys"),
      v.literal("Alytus"),
      v.literal("Marijampolė"),
      v.literal("Mažeikiai"),
      v.literal("Utena"),
      v.literal("Jonava"),
      v.literal("Kėdainiai"),
      v.literal("Telšiai"),
      v.literal("Tauragė"),
      v.literal("Ukmergė"),
      v.literal("Visaginas"),
      v.literal("Palanga"),
      v.literal("Plungė"),
      v.literal("Kretinga"),
      v.literal("Šilutė"),
      v.literal("Gargždai"),
      v.literal("Radviliškis"),
      v.literal("Druskininkai"),
      v.literal("Elektrėnai"),
      v.literal("Jurbarkas"),
      v.literal("Rokiškis"),
      v.literal("Kuršėnai"),
      v.literal("Biržai"),
      v.literal("Vilkaviškis"),
      v.literal("Garliava"),
      v.literal("Grigiškės"),
      v.literal("Lentvaris"),
      v.literal("Raseiniai"),
      v.literal("Prienai"),
      v.literal("Anykščiai"),
      v.literal("Kaišiadorys"),
      v.literal("Joniškis"),
      v.literal("Naujoji Akmenė"),
      v.literal("Varėna"),
      v.literal("Kelmė"),
      v.literal("Šalčininkai"),
      v.literal("Pasvalys"),
      v.literal("Kupiškis"),
      v.literal("Zarasai"),
      v.literal("Skuodas"),
      v.literal("Kazlų Rūda"),
      v.literal("Širvintos"),
      v.literal("Molėtai"),
      v.literal("Švenčionys"),
      v.literal("Ignalina"),
      v.literal("Pabradė"),
      v.literal("Šilalė"),
      v.literal("Neringa"),
      v.literal("Pagėgiai"),
      v.literal("Other")
    ),
    bio: v.string(),
    photoUrl: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    languages: v.array(
      v.union(
        v.literal("Lithuanian"),
        v.literal("English"),
        v.literal("Ukrainian"),
        v.literal("Russian")
      )
    ),
    availableDates: v.array(
      v.union(
        v.literal("23 Dec"),
        v.literal("24 Dec"),
        v.literal("25 Dec"),
        v.literal("26 Dec"),
        v.literal("27 Dec"),
        v.literal("28 Dec"),
        v.literal("29 Dec"),
        v.literal("30 Dec"),
        v.literal("31 Dec"),
        v.literal("1 Jan"),
        v.literal("2 Jan")
      )
    ),
    dietaryInfo: v.array(v.string()),
    concept: v.optional(
      v.union(v.literal("Party"), v.literal("Dinner"), v.literal("Hangout"))
    ),
    capacity: v.optional(v.number()),
    preferredGuestAgeMin: v.optional(v.number()),
    preferredGuestAgeMax: v.optional(v.number()),
    amenities: v.array(v.string()),
    houseRules: v.array(v.string()),
    vibes: v.array(v.string()),
    smokingAllowed: v.boolean(),
    drinkingAllowed: v.boolean(),
    petsAllowed: v.boolean(),
    hasPets: v.boolean(),
    isVisible: v.optional(v.boolean()),
    // Notification preferences
    marketingEmails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      // Update existing profile - preserve verified status and merge photos
      const updateData = {
        ...args,
        photos: args.photos ?? existing.photos ?? [],
        isVisible: args.isVisible ?? existing.isVisible ?? true,
        lastActive: Date.now(),
      };
      await ctx.db.patch(existing._id, updateData);
      return existing._id;
    }

    // Create new profile
    const profileData = {
      ...args,
      userId,
      photos: args.photos ?? [],
      verified: false,
      isVisible: args.isVisible ?? true,
      lastActive: Date.now(),
    };
    return await ctx.db.insert("profiles", profileData);
  },
});

// Update verification status
export const updateVerification = mutation({
  args: { verified: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, { verified: args.verified });
  },
});

// Update last active timestamp
export const updateLastActive = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { lastActive: Date.now() });
    }
  },
});

// ===== USERNAME ROUTING =====

// Reserved usernames that can't be used
const RESERVED_USERNAMES = [
  "admin",
  "api",
  "people",
  "profile",
  "settings",
  "browse",
  "messages",
  "about",
  "help",
  "contact",
  "terms",
  "privacy",
  "safety",
  "guidelines",
  "policies",
  "faq",
  "support",
  "null",
  "undefined",
];

// Validate username format: 3-30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphens
function isValidUsernameFormat(username: string): boolean {
  const normalized = username.toLowerCase().trim();
  if (normalized.length < 3 || normalized.length > 30) {
    return false;
  }
  if (!USERNAME_REGEX.test(normalized)) {
    return false;
  }
  if (normalized.startsWith("-") || normalized.endsWith("-")) {
    return false;
  }
  if (normalized.includes("--")) {
    return false;
  }
  return true;
}

// Generate a username from firstName and lastName
function generateUsername(firstName: string, lastName?: string): string {
  const first = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const last = lastName ? lastName.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return last ? `${first}-${last}` : first;
}

// Get profile by username (public route)
export const getProfileByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.username.toLowerCase().trim();

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    if (!profile) {
      return null;
    }

    // Hide sensitive info unless owner or matched
    const currentUserId = await getCurrentUserId(ctx);
    const isOwner = currentUserId === profile.userId;

    // Check if matched
    let isMatched = false;
    if (currentUserId && currentUserId !== profile.userId) {
      const sentAccepted = await ctx.db
        .query("invitations")
        .withIndex("by_from", (q) => q.eq("fromUserId", currentUserId))
        .filter((q) =>
          q.and(
            q.eq(q.field("toUserId"), profile.userId),
            q.eq(q.field("status"), "accepted")
          )
        )
        .first();

      if (sentAccepted) {
        isMatched = true;
      } else {
        const receivedAccepted = await ctx.db
          .query("invitations")
          .withIndex("by_to", (q) => q.eq("toUserId", currentUserId))
          .filter((q) =>
            q.and(
              q.eq(q.field("fromUserId"), profile.userId),
              q.eq(q.field("status"), "accepted")
            )
          )
          .first();
        isMatched = !!receivedAccepted;
      }
    }

    if (!(isOwner || isMatched)) {
      return {
        ...profile,
        lastName: undefined,
        phone: undefined,
        address: undefined,
      };
    }

    return profile;
  },
});

// Check if a username is available
export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const normalized = args.username.toLowerCase().trim();

    // Check format
    if (!isValidUsernameFormat(normalized)) {
      return { available: false, reason: "invalid_format" };
    }

    // Check reserved
    if (RESERVED_USERNAMES.includes(normalized)) {
      return { available: false, reason: "reserved" };
    }

    // Check if taken
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    if (existing) {
      return { available: false, reason: "taken" };
    }

    return { available: true };
  },
});

// Set or update username
export const setUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const normalized = args.username.toLowerCase().trim();

    // Validate format
    if (!isValidUsernameFormat(normalized)) {
      throw new Error(
        "Invalid username format. Use 3-30 lowercase letters, numbers, and hyphens."
      );
    }

    // Check reserved
    if (RESERVED_USERNAMES.includes(normalized)) {
      throw new Error("This username is reserved.");
    }

    // Check if taken by someone else
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    if (existing && existing.userId !== userId) {
      throw new Error("This username is already taken.");
    }

    // Get user's profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found. Complete onboarding first.");
    }

    // Update username
    await ctx.db.patch(profile._id, { username: normalized });
    return normalized;
  },
});

// Update just role and available dates (for settings page)
export const updatePreferences = mutation({
  args: {
    role: v.union(v.literal("host"), v.literal("guest"), v.literal("both")),
    availableDates: v.array(
      v.union(
        v.literal("23 Dec"),
        v.literal("24 Dec"),
        v.literal("25 Dec"),
        v.literal("26 Dec"),
        v.literal("27 Dec"),
        v.literal("28 Dec"),
        v.literal("29 Dec"),
        v.literal("30 Dec"),
        v.literal("31 Dec"),
        v.literal("1 Jan"),
        v.literal("2 Jan")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      role: args.role,
      availableDates: args.availableDates,
      lastActive: Date.now(),
    });
  },
});

// Update notification preferences
export const updateNotificationPreferences = mutation({
  args: {
    emailNotifications: v.optional(v.boolean()),
    notifyOnInvitation: v.optional(v.boolean()),
    notifyOnMessage: v.optional(v.boolean()),
    notifyOnMatch: v.optional(v.boolean()),
    marketingEmails: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      emailNotifications: args.emailNotifications,
      notifyOnInvitation: args.notifyOnInvitation,
      notifyOnMessage: args.notifyOnMessage,
      notifyOnMatch: args.notifyOnMatch,
      marketingEmails: args.marketingEmails,
    });
  },
});

// Auto-generate usernames for existing profiles without one
export const generateMissingUsernames = mutation({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const profiles = await ctx.db.query("profiles").collect();
    let updated = 0;

    for (const profile of profiles) {
      if (profile.username) {
        continue; // Already has username
      }

      let baseUsername = generateUsername(profile.firstName, profile.lastName);

      // If too short, pad it
      if (baseUsername.length < 3) {
        baseUsername = `user-${baseUsername}`;
      }

      // Find unique username
      let username = baseUsername;
      let suffix = 1;

      while (true) {
        const existing = await ctx.db
          .query("profiles")
          .withIndex("by_username", (q) => q.eq("username", username))
          .first();

        if (!(existing || RESERVED_USERNAMES.includes(username))) {
          break;
        }

        username = `${baseUsername}-${suffix}`;
        suffix++;
      }

      await ctx.db.patch(profile._id, { username });
      updated++;
    }

    return { updated };
  },
});

// Helper: Count occurrences and return sorted array
function countToSortedArray(map: Map<string, number>, sort = true) {
  const arr = Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
  }));
  return sort ? arr.sort((a, b) => b.count - a.count) : arr;
}

// Helper: Get dates for a profile based on role filter
function getProfileDates(
  profile: {
    availableDates: string[];
    hostingDates?: string[];
    guestDates?: string[];
  },
  roleFilter?: string
) {
  if (roleFilter === "host") {
    return profile.hostingDates || profile.availableDates;
  }
  if (roleFilter === "guest") {
    return profile.guestDates || profile.availableDates;
  }
  return profile.availableDates;
}

// Helper: Count occurrences of a single value
function incrementCount(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}

// Helper: Count all languages from profiles
function countLanguages(
  profiles: { languages: string[] }[]
): Map<string, number> {
  const langMap = new Map<string, number>();
  for (const p of profiles) {
    for (const lang of p.languages) {
      incrementCount(langMap, lang);
    }
  }
  return langMap;
}

/**
 * Aggregate occurrence counts for calendar dates across a list of profiles.
 *
 * @param profiles - Array of profile-like objects containing date arrays to count
 * @param roleFilter - Optional role filter ("host" or "guest") that selects which date set to use per profile
 * @returns A map where keys are date strings and values are the number of profiles that include that date
 */
function countDates(
  profiles: {
    availableDates: string[];
    hostingDates?: string[];
    guestDates?: string[];
  }[],
  roleFilter?: string
): Map<string, number> {
  const dateMap = new Map<string, number>();
  for (const p of profiles) {
    for (const date of getProfileDates(p, roleFilter)) {
      incrementCount(dateMap, date);
    }
  }
  return dateMap;
}

/**
 * Filter a list of profiles to those that should appear in browse results for a requester and optional role.
 *
 * @param allProfiles - The profiles to filter.
 * @param currentUserId - The requesting user's id, or `null` for anonymous requests.
 * @param roleFilter - Optional role to require; profiles with this role or `"both"` will match.
 * @returns The subset of `allProfiles` that match the role filter, are marked visible, and (unless they belong to the requester) are complete for browsing.
 */
function filterVisibleProfiles(
  allProfiles: Doc<"profiles">[],
  currentUserId: Id<"users"> | null,
  roleFilter?: string
): Doc<"profiles">[] {
  // Optimized: Skip user existence check - trust referential integrity
  // Orphaned profiles are rare and will be cleaned up eventually
  return allProfiles.filter((p) => {
    const isOwner = p.userId === currentUserId;
    const isVisible = p.isVisible !== false;
    const matchesRole =
      !roleFilter || p.role === roleFilter || p.role === "both";
    // For browse filter counts, only count profiles that would actually show up.
    // (But keep owner visibility logic intact for safety/backwards-compat.)
    const isCountable = isProfileCompleteForBrowse(p) && isVisible;
    return matchesRole && (isOwner || isCountable);
  });
}

// Helper: Count cities from profiles
function countCities(profiles: { city?: string }[]): Map<string, number> {
  const cityMap = new Map<string, number>();
  for (const p of profiles) {
    if (p.city) {
      incrementCount(cityMap, p.city);
    }
  }
  return cityMap;
}

// Get filter counts for browse page (cities, languages, dates with actual profile counts)
// Returns arrays instead of objects because Convex doesn't allow non-ASCII chars in object keys
export const getFilterCounts = query({
  args: {
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    const allProfiles = await ctx.db.query("profiles").collect();
    const profiles = filterVisibleProfiles(
      allProfiles,
      currentUserId,
      args.role
    );

    return {
      cities: countToSortedArray(countCities(profiles)),
      languages: countToSortedArray(countLanguages(profiles)),
      dates: countToSortedArray(countDates(profiles, args.role), false),
      totalProfiles: profiles.length,
    };
  },
});

// ===== DEV ONLY =====

// Get all users with their profiles for dev switcher
// This should only be used in development mode
export const devGetAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const users = await ctx.db.query("users").collect();

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        return {
          userId: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
          profile: profile
            ? {
                firstName: profile.firstName,
                lastName: profile.lastName,
                role: profile.role,
                city: profile.city,
                username: profile.username,
              }
            : null,
        };
      })
    );

    return usersWithProfiles;
  },
});