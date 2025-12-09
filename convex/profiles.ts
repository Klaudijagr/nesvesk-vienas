import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

type Language = "Lithuanian" | "English" | "Ukrainian" | "Russian";
type HolidayDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";

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

// List profiles with filters
export const listProfiles = query({
  args: {
    city: v.optional(v.string()),
    role: v.optional(v.string()),
    language: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    let profiles = await ctx.db.query("profiles").collect();

    // Only show visible profiles (unless it's the current user's profile)
    profiles = profiles.filter(
      (p) => p.isVisible !== false || p.userId === currentUserId
    );

    // Apply filters
    if (args.city) {
      profiles = profiles.filter((p) => p.city === args.city);
    }
    if (args.role) {
      profiles = profiles.filter(
        (p) => p.role === args.role || p.role === "both"
      );
    }
    if (args.language) {
      profiles = profiles.filter((p) =>
        p.languages.includes(args.language as Language)
      );
    }
    if (args.date) {
      profiles = profiles.filter((p) =>
        p.availableDates.includes(args.date as HolidayDate)
      );
    }

    // Get connection status for each profile if user is logged in
    const profilesWithStatus = await Promise.all(
      profiles.map(async (p) => {
        let connectionStatus:
          | "none"
          | "pending_sent"
          | "pending_received"
          | "matched"
          | "self" = "none";

        if (currentUserId) {
          if (p.userId === currentUserId) {
            connectionStatus = "self";
          } else {
            // Check invitations I sent
            const sentInv = await ctx.db
              .query("invitations")
              .withIndex("by_from", (q) => q.eq("fromUserId", currentUserId))
              .filter((q) => q.eq(q.field("toUserId"), p.userId))
              .first();

            // Check invitations I received
            const receivedInv = await ctx.db
              .query("invitations")
              .withIndex("by_to", (q) => q.eq("toUserId", currentUserId))
              .filter((q) => q.eq(q.field("fromUserId"), p.userId))
              .first();

            if (
              sentInv?.status === "accepted" ||
              receivedInv?.status === "accepted"
            ) {
              connectionStatus = "matched";
            } else if (sentInv?.status === "pending") {
              connectionStatus = "pending_sent";
            } else if (receivedInv?.status === "pending") {
              connectionStatus = "pending_received";
            }
          }
        }

        return {
          ...p,
          lastName: undefined,
          phone: undefined,
          address: undefined,
          connectionStatus,
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
    firstName: v.string(),
    lastName: v.optional(v.string()),
    age: v.optional(v.number()),
    city: v.union(
      v.literal("Vilnius"),
      v.literal("Kaunas"),
      v.literal("Klaipėda"),
      v.literal("Šiauliai"),
      v.literal("Panevėžys"),
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
        v.literal("24 Dec"),
        v.literal("25 Dec"),
        v.literal("26 Dec"),
        v.literal("31 Dec")
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
  },
  handler: async (ctx, args) => {
    // Get or create user from Clerk identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Look up or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.tokenIdentifier,
        email: identity.email,
        name: identity.name,
        imageUrl: identity.pictureUrl,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error("Failed to create user");
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
      userId: user._id,
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
  if (!/^[a-z0-9-]+$/.test(normalized)) {
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

// Auto-generate usernames for existing profiles without one
export const generateMissingUsernames = mutation({
  args: {},
  handler: async (ctx) => {
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
