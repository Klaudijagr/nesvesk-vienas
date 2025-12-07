import type { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";

// Type alias for user IDs (keeps the import "used" according to linter)
type UserId = Id<"users">;
type ConversationStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "invited"
  | "confirmed";

// Type definitions matching schema (only types that are actually used)
type Language = "Lithuanian" | "English" | "Ukrainian" | "Russian";
type HolidayDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";
type Concept = "Party" | "Dinner" | "Hangout";

// Seed data for testing - 10 Lithuanian users
const seedUsers = [
  {
    name: "Marius Kazlauskas",
    email: "marius@test.lt",
    clerkId: "seed_marius_001",
  },
  {
    name: "Eglė Jonaitis",
    email: "egle@test.lt",
    clerkId: "seed_egle_002",
  },
  {
    name: "Tomas Petrauskas",
    email: "tomas@test.lt",
    clerkId: "seed_tomas_003",
  },
  {
    name: "Rūta Barkus",
    email: "ruta@test.lt",
    clerkId: "seed_ruta_004",
  },
  {
    name: "Andrius Šimkus",
    email: "andrius@test.lt",
    clerkId: "seed_andrius_005",
  },
  {
    name: "Gintarė Latvėnaitė",
    email: "gintare@test.lt",
    clerkId: "seed_gintare_006",
  },
  {
    name: "Paulius Rimkus",
    email: "paulius@test.lt",
    clerkId: "seed_paulius_007",
  },
  {
    name: "Simona Vaitkutė",
    email: "simona@test.lt",
    clerkId: "seed_simona_008",
  },
  {
    name: "Jonas Norvilas",
    email: "jonas@test.lt",
    clerkId: "seed_jonas_009",
  },
  {
    name: "Lina Mockutė",
    email: "lina@test.lt",
    clerkId: "seed_lina_010",
  },
];

const seedProfiles = [
  {
    role: "host" as const,
    firstName: "Marius",
    lastName: "Kazlauskas",
    age: 35,
    city: "Vilnius" as const,
    bio: "Šeimos tėvas, mylintis Kalėdas! Turime didelį butą senamiestyje ir mėgstame priimti svečius. Mūsų durys visada atviros tiems, kurie neturi su kuo švęsti.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English"] as Language[],
    availableDates: ["24 Dec", "25 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: "Dinner" as Concept,
    capacity: 6,
    preferredGuestAgeMin: 20,
    preferredGuestAgeMax: 60,
    amenities: ["Parking", "WiFi", "Kids friendly"],
    houseRules: ["No smoking inside", "Pets welcome"],
    vibes: ["Family-friendly", "Traditional", "Cozy"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: "guest" as const,
    firstName: "Eglė",
    lastName: "Jonaitis",
    age: 28,
    city: "Vilnius" as const,
    bio: "Studentė iš Ukrainos, studijuoju Vilniaus universitete. Šiais metais negaliu grįžti namo, tad ieškau šiltos kompanijos Kalėdoms. Moku gaminti ukrainietiškus patiekalus!",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Ukrainian", "Lithuanian", "English"] as Language[],
    availableDates: ["24 Dec", "25 Dec", "31 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ["Friendly", "Creative"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: "host" as const,
    firstName: "Tomas",
    lastName: "Petrauskas",
    age: 42,
    city: "Kaunas" as const,
    bio: "IT specialistas, gyvenu vienas dideliame name. Kalėdos mano mėgstamiausia šventė, bet neturiu su kuo švęsti. Ieškau draugijos tradicinei Kūčių vakarienei.",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English", "Russian"] as Language[],
    availableDates: ["24 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: "Dinner" as Concept,
    capacity: 4,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 55,
    amenities: ["Parking", "WiFi", "Garden"],
    houseRules: ["No smoking", "Quiet after 11pm"],
    vibes: ["Traditional", "Intellectual", "Relaxed"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: true,
    isVisible: true,
  },
  {
    role: "guest" as const,
    firstName: "Rūta",
    lastName: "Barkus",
    age: 67,
    city: "Klaipėda" as const,
    bio: "Pensinininkė, vaikai gyvena užsienyje. Labai pasiilgstu šeimyniškos atmosferos per šventes. Galiu pasidalinti senovinėmis lietuviškomis receptais!",
    photoUrl:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face",
    verified: false,
    languages: ["Lithuanian", "Russian"] as Language[],
    availableDates: ["24 Dec", "25 Dec"] as HolidayDate[],
    dietaryInfo: ["No spicy food"] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ["Traditional", "Caring"],
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: true,
    hasPets: false,
    isVisible: false,
  },
  {
    role: "both" as const,
    firstName: "Andrius",
    lastName: "Šimkus",
    age: 31,
    city: "Vilnius" as const,
    bio: "Jaunas profesionalas, persikėlęs į Vilnių dėl darbo. Galiu priimti svečius savo bute arba prisijungti prie kitų šventimo. Mėgstu žaidimus ir gerą bendravimą!",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English"] as Language[],
    availableDates: ["25 Dec", "31 Dec"] as HolidayDate[],
    dietaryInfo: ["Vegetarian"] as string[],
    concept: "Hangout" as Concept,
    capacity: 3,
    preferredGuestAgeMin: 20,
    preferredGuestAgeMax: 40,
    amenities: ["WiFi", "Board games", "PlayStation"],
    houseRules: ["BYOB", "Music until midnight"],
    vibes: ["Fun", "Casual", "Gaming"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: false,
    isVisible: true,
  },
  {
    role: "host" as const,
    firstName: "Gintarė",
    lastName: "Latvėnaitė",
    age: 45,
    city: "Šiauliai" as const,
    bio: "Mokytoja, auginu dvi dukras. Mūsų namai visada pilni juoko ir šilumos. Kviečiame prisijungti tuos, kurie neturi su kuo švęsti!",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian"] as Language[],
    availableDates: ["24 Dec", "25 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: "Dinner" as Concept,
    capacity: 8,
    preferredGuestAgeMin: 0,
    preferredGuestAgeMax: 99,
    amenities: ["Parking", "Kids friendly", "Garden"],
    houseRules: ["Family atmosphere"],
    vibes: ["Family-friendly", "Warm", "Traditional"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: true,
    isVisible: true,
  },
  {
    role: "guest" as const,
    firstName: "Paulius",
    lastName: "Rimkus",
    age: 24,
    city: "Vilnius" as const,
    bio: "Studentas medicinos, šiais metais lieku Vilniuje dėl praktikos. Ieškau šiltos kompanijos Naujųjų metų vakarui. Atnešiu šampano!",
    photoUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English"] as Language[],
    availableDates: ["31 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ["Fun", "Outgoing", "Social"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: "host" as const,
    firstName: "Simona",
    lastName: "Vaitkutė",
    age: 38,
    city: "Kaunas" as const,
    bio: "Dailininkė, gyvenu erdviame loft tipe bute Kauno centre. Organizuoju kūrybingą Naujųjų metų šventę su menu ir pokalbiais apie kultūrą.",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English", "Russian"] as Language[],
    availableDates: ["31 Dec"] as HolidayDate[],
    dietaryInfo: ["Pescatarian"] as string[],
    concept: "Party" as Concept,
    capacity: 12,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 50,
    amenities: ["WiFi", "Art studio", "Rooftop access"],
    houseRules: ["Creative dress code welcome", "Bring your art!"],
    vibes: ["Creative", "Artistic", "Bohemian"],
    smokingAllowed: true,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: false,
    isVisible: true,
  },
  {
    role: "guest" as const,
    firstName: "Jonas",
    lastName: "Norvilas",
    age: 55,
    city: "Panevėžys" as const,
    bio: "Vienišius po skyrybų, vaikai su buvusia žmona. Pirmą kartą per daugelį metų švęsiu vienas. Ieškau draugiškos kompanijos, galiu padėti su maistu.",
    photoUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
    verified: false,
    languages: ["Lithuanian", "Russian"] as Language[],
    availableDates: ["24 Dec", "25 Dec"] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ["Friendly", "Helpful", "Traditional"] as string[],
    smokingAllowed: true,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: false,
  },
  {
    role: "both" as const,
    firstName: "Lina",
    lastName: "Mockutė",
    age: 33,
    city: "Vilnius" as const,
    bio: "HR specialistė, aistringai myliu šventes ir naujas pažintis! Galiu priimti svečius mano jaukiame bute arba prisijungti prie kitų. Mėgstu žaidimus ir gerą maistą.",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    verified: true,
    languages: ["Lithuanian", "English"] as Language[],
    availableDates: ["24 Dec", "31 Dec"] as HolidayDate[],
    dietaryInfo: ["Gluten-free"] as string[],
    concept: "Hangout" as Concept,
    capacity: 4,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 45,
    amenities: ["WiFi", "Netflix", "Board games"],
    houseRules: ["Cozy vibes only"],
    vibes: ["Cozy", "Fun", "Social"],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: true,
    isVisible: true,
  },
];

// Seed the database
export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingUsers = await ctx.db.query("users").collect();
    const seedUserIds = seedUsers.map((u) => u.clerkId);
    const alreadySeeded = existingUsers.some((u) =>
      seedUserIds.includes(u.clerkId)
    );

    if (alreadySeeded) {
      return { message: "Database already seeded", created: 0 };
    }

    const userIds: UserId[] = [];

    // Create users and profiles
    for (let i = 0; i < seedUsers.length; i++) {
      const userData = seedUsers[i];
      const profileData = seedProfiles[i];

      // Create user
      const userId = await ctx.db.insert("users", {
        clerkId: userData.clerkId,
        email: userData.email,
        name: userData.name,
        imageUrl: profileData.photoUrl,
      });

      userIds.push(userId);

      // Create profile
      await ctx.db.insert("profiles", {
        userId,
        ...profileData,
        lastActive:
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    const now = Date.now();

    // Create conversations instead of invitations
    const conv1 = await ctx.db.insert("conversations", {
      guestId: userIds[1], // Eglė (guest)
      hostId: userIds[0], // Marius (host)
      status: "accepted",
      eventDate: "24 Dec",
      createdAt: now - 2 * 24 * 60 * 60 * 1000,
      lastMessageAt: now - 1 * 60 * 60 * 1000,
      requestMessage: "Labas! Norėčiau prisijungti prie jūsų Kūčių vakarienės.",
    });

    const _conv2 = await ctx.db.insert("conversations", {
      guestId: userIds[6], // Paulius (guest)
      hostId: userIds[7], // Simona (host)
      status: "accepted",
      eventDate: "31 Dec",
      createdAt: now - 3 * 24 * 60 * 60 * 1000,
      lastMessageAt: now - 2 * 60 * 60 * 1000,
    });

    const _conv3 = await ctx.db.insert("conversations", {
      guestId: userIds[8], // Jonas (guest)
      hostId: userIds[2], // Tomas (host)
      status: "requested",
      eventDate: "24 Dec",
      createdAt: now - 1 * 60 * 60 * 1000,
      requestMessage: "Ieškau ramios Kūčių vakarienės.",
    });

    // Create messages for conversations
    await ctx.db.insert("messages", {
      conversationId: conv1,
      senderId: userIds[1],
      content: "Labas! Norėčiau prisijungti prie jūsų Kūčių vakarienės.",
      read: true,
      type: "message",
      createdAt: now - 2 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("messages", {
      conversationId: conv1,
      senderId: userIds[0],
      content:
        "Labas Egle! Džiaugiuosi, kad prisijungsite prie mūsų Kūčių vakarienės.",
      read: true,
      type: "message",
      createdAt: now - 1.5 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.insert("messages", {
      conversationId: conv1,
      senderId: userIds[1],
      content:
        "Labas Mariau! Ačiū už kvietimą! Ar galiu atnešti ukrainietišką borsčą?",
      read: true,
      type: "message",
      createdAt: now - 1 * 60 * 60 * 1000,
    });

    return {
      message: "Database seeded successfully",
      created: {
        users: 10,
        profiles: 10,
        invitations: 5,
        messages: 2,
      },
    };
  },
});

// Mark seed users as test users
export const markSeedUsersAsTest = internalMutation({
  args: {},
  handler: async (ctx) => {
    const seedClerkIds = seedUsers.map((u) => u.clerkId);
    const users = await ctx.db.query("users").collect();
    let updated = 0;

    for (const user of users) {
      if (seedClerkIds.includes(user.clerkId) && !user.isAiTestUser) {
        await ctx.db.patch(user._id, { isAiTestUser: true });
        updated++;
      }
    }

    return { message: `Marked ${updated} seed users as test users` };
  },
});

// Clear all non-test users (real user data)
export const clearRealUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const seedClerkIds = seedUsers.map((u) => u.clerkId);

    // Find non-seed users
    const realUsers = users.filter(
      (u) => !(seedClerkIds.includes(u.clerkId) || u.isAiTestUser)
    );
    const realUserIds = realUsers.map((u) => u._id);

    let deletedProfiles = 0;
    let deletedConvs = 0;
    let deletedMsgs = 0;
    let deletedInvs = 0;

    // Delete profiles
    for (const userId of realUserIds) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      if (profile) {
        await ctx.db.delete(profile._id);
        deletedProfiles++;
      }
    }

    // Delete conversations involving real users
    const conversations = await ctx.db.query("conversations").collect();
    for (const conv of conversations) {
      if (
        realUserIds.includes(conv.guestId) ||
        realUserIds.includes(conv.hostId)
      ) {
        // Delete messages first
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();
        for (const msg of messages) {
          await ctx.db.delete(msg._id);
          deletedMsgs++;
        }
        await ctx.db.delete(conv._id);
        deletedConvs++;
      }
    }

    // Delete invitations
    const invitations = await ctx.db.query("invitations").collect();
    for (const inv of invitations) {
      if (
        realUserIds.includes(inv.fromUserId) ||
        realUserIds.includes(inv.toUserId)
      ) {
        await ctx.db.delete(inv._id);
        deletedInvs++;
      }
    }

    // Delete users
    for (const user of realUsers) {
      await ctx.db.delete(user._id);
    }

    return {
      message: `Cleared ${realUsers.length} real users`,
      deleted: {
        users: realUsers.length,
        profiles: deletedProfiles,
        conversations: deletedConvs,
        messages: deletedMsgs,
        invitations: deletedInvs,
      },
    };
  },
});

// Get all test users for dev mode switcher
export const getTestUsers = query({
  args: {},
  handler: async (ctx) => {
    const seedClerkIds = seedUsers.map((u) => u.clerkId);
    const users = await ctx.db.query("users").collect();
    const testUsers = users.filter(
      (u) => seedClerkIds.includes(u.clerkId) || u.isAiTestUser
    );

    const profiles = await Promise.all(
      testUsers.map(async (user) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();
        return {
          userId: user._id,
          name: user.name || profile?.firstName || "Unknown",
          photoUrl: profile?.photoUrl || user.imageUrl,
          role: profile?.role,
          city: profile?.city,
          verified: profile?.verified,
        };
      })
    );

    return profiles;
  },
});

// Clear seed data (for development)
export const clearSeedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const seedClerkIds = seedUsers.map((u) => u.clerkId);

    const users = await ctx.db.query("users").collect();
    const seedUserRecords = users.filter((u) =>
      seedClerkIds.includes(u.clerkId)
    );
    const seedUserIdList = seedUserRecords.map((u) => u._id);

    // Delete profiles
    for (const userId of seedUserIdList) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
      if (profile) {
        await ctx.db.delete(profile._id);
      }
    }

    // Find conversations involving seed users
    const conversations = await ctx.db.query("conversations").collect();
    const seedConversationIds: Id<"conversations">[] = [];
    for (const conv of conversations) {
      if (
        seedUserIdList.includes(conv.guestId) ||
        seedUserIdList.includes(conv.hostId)
      ) {
        seedConversationIds.push(conv._id);
      }
    }

    // Delete messages belonging to seed conversations
    const messages = await ctx.db.query("messages").collect();
    for (const msg of messages) {
      if (seedConversationIds.includes(msg.conversationId)) {
        await ctx.db.delete(msg._id);
      }
    }

    // Delete conversations
    for (const convId of seedConversationIds) {
      await ctx.db.delete(convId);
    }

    // Delete events involving seed users
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      if (
        seedUserIdList.includes(event.hostId) ||
        event.guestIds.some((gId) => seedUserIdList.includes(gId))
      ) {
        await ctx.db.delete(event._id);
      }
    }

    // Delete invitations (legacy table)
    const invitations = await ctx.db.query("invitations").collect();
    for (const inv of invitations) {
      if (
        seedUserIdList.includes(inv.fromUserId) ||
        seedUserIdList.includes(inv.toUserId)
      ) {
        await ctx.db.delete(inv._id);
      }
    }

    // Delete users
    for (const user of seedUserRecords) {
      await ctx.db.delete(user._id);
    }

    return { message: "Seed data cleared", deleted: seedUserRecords.length };
  },
});

/**
 * Create test conversations for the current logged-in user.
 * Call this from the browser to get sample conversations to test with.
 */
export const createTestConversations = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated - please log in first");
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
      .first();

    if (!currentUser) {
      throw new Error("User not found - please complete registration first");
    }

    const now = Date.now();

    // First, make sure seed data exists
    const seedClerkIds = seedUsers.map((u) => u.clerkId);
    const existingSeeds = await ctx.db.query("users").collect();
    const seedsExist = existingSeeds.some((u) =>
      seedClerkIds.includes(u.clerkId)
    );

    if (!seedsExist) {
      // Create seed users first
      const userIds: UserId[] = [];
      for (let i = 0; i < seedUsers.length; i++) {
        const userData = seedUsers[i];
        const profileData = seedProfiles[i];

        const userId = await ctx.db.insert("users", {
          clerkId: userData.clerkId,
          email: userData.email,
          name: userData.name,
          imageUrl: profileData.photoUrl,
        });
        userIds.push(userId);

        await ctx.db.insert("profiles", {
          userId,
          ...profileData,
          lastActive: now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
      }
    }

    // Get seed users to create conversations with
    const seedUserRecords = await ctx.db
      .query("users")
      .collect()
      .then((users) => users.filter((u) => seedClerkIds.includes(u.clerkId)));

    // Check for existing conversations
    const existingConvs = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", currentUser._id))
      .collect();

    if (existingConvs.length > 0) {
      return {
        success: true,
        message: "Test conversations already exist",
        conversationCount: existingConvs.length,
      };
    }

    // Find hosts from seed data
    const _hosts = seedUserRecords.filter((u) => {
      const profile = seedProfiles.find(
        (_p) =>
          seedUsers.find((su) => su.clerkId === u.clerkId)?.clerkId ===
          u.clerkId
      );
      return profile?.role === "host" || profile?.role === "both";
    });

    const conversationsCreated: string[] = [];

    // Create conversation 1: "Accepted" status with Marius (host)
    const marius = seedUserRecords.find((u) => u.clerkId === "seed_marius_001");
    if (marius) {
      const conv1 = await ctx.db.insert("conversations", {
        guestId: currentUser._id,
        hostId: marius._id,
        status: "accepted" as ConversationStatus,
        eventDate: "24 Dec" as HolidayDate,
        createdAt: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        lastMessageAt: now - 30 * 60 * 1000, // 30 min ago
        requestMessage:
          "Labas! Norėčiau prisijungti prie jūsų Kūčių vakarienės.",
      });

      // Add messages
      await ctx.db.insert("messages", {
        conversationId: conv1,
        senderId: currentUser._id,
        content:
          "Labas Mariau! Norėčiau prisijungti prie jūsų Kūčių vakarienės. Esu naujas Vilniuje ir ieškau šiltos kompanijos šventėms.",
        read: true,
        type: "message",
        createdAt: now - 2 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("messages", {
        conversationId: conv1,
        senderId: marius._id,
        content:
          "Sveiki! Džiaugiamės, kad norite prisijungti. Ar turite kokių nors maisto apribojimų?",
        read: true,
        type: "message",
        createdAt: now - 1.5 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("messages", {
        conversationId: conv1,
        senderId: currentUser._id,
        content:
          "Ačiū už kvietimą! Ne, jokių apribojimų neturiu. Ar galiu ką nors atnešti?",
        read: true,
        type: "message",
        createdAt: now - 1 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("messages", {
        conversationId: conv1,
        senderId: marius._id,
        content:
          "Puiku! Jei norite, galite atnešti desertą arba vyną. Laukiame jūsų gruodžio 24 d. 18:00! 🎄",
        read: false,
        type: "message",
        createdAt: now - 30 * 60 * 1000,
      });

      conversationsCreated.push("Marius (Dec 24 - accepted)");
    }

    // Create conversation 2: "Requested" status with Simona (host)
    const simona = seedUserRecords.find((u) => u.clerkId === "seed_simona_008");
    if (simona) {
      const conv2 = await ctx.db.insert("conversations", {
        guestId: currentUser._id,
        hostId: simona._id,
        status: "requested" as ConversationStatus,
        eventDate: "31 Dec" as HolidayDate,
        createdAt: now - 1 * 60 * 60 * 1000, // 1 hour ago
        requestMessage: "Labas! Jūsų Naujųjų metų vakarėlis skamba nuostabiai!",
      });

      await ctx.db.insert("messages", {
        conversationId: conv2,
        senderId: currentUser._id,
        content:
          "Labas Simona! Jūsų Naujųjų metų vakarėlis skamba nuostabiai. Ar dar yra vietos?",
        read: false,
        type: "message",
        createdAt: now - 1 * 60 * 60 * 1000,
      });

      conversationsCreated.push("Simona (Dec 31 - requested)");
    }

    // Create conversation 3: "Invited" status with Tomas (host)
    const tomas = seedUserRecords.find((u) => u.clerkId === "seed_tomas_003");
    if (tomas) {
      const conv3 = await ctx.db.insert("conversations", {
        guestId: currentUser._id,
        hostId: tomas._id,
        status: "invited" as ConversationStatus,
        eventDate: "24 Dec" as HolidayDate,
        createdAt: now - 3 * 24 * 60 * 60 * 1000,
        lastMessageAt: now - 2 * 60 * 60 * 1000,
        requestMessage: "Ieškau ramios Kūčių vakarienės.",
      });

      await ctx.db.insert("messages", {
        conversationId: conv3,
        senderId: currentUser._id,
        content:
          "Labas Tomai! Ieškau ramios Kūčių vakarienės. Jūsų aprašymas skamba puikiai.",
        read: true,
        type: "message",
        createdAt: now - 3 * 24 * 60 * 60 * 1000,
      });

      await ctx.db.insert("messages", {
        conversationId: conv3,
        senderId: tomas._id,
        content: "Sveiki! Mielai priimsiu. Papasakokite daugiau apie save.",
        read: true,
        type: "message",
        createdAt: now - 2.5 * 24 * 60 * 60 * 1000,
      });

      // Invitation card message
      await ctx.db.insert("messages", {
        conversationId: conv3,
        senderId: tomas._id,
        content: "Štai oficialus kvietimas!",
        read: false,
        type: "invitation_card",
        eventCard: {
          date: "24 Dec" as HolidayDate,
          time: "17:00",
          address: "Laisvės al. 50, Kaunas",
          phone: "+370 600 54321",
          note: "Ateikite alkani - bus daug maisto!",
          whatToBring: "Desertą arba gėrimą",
        },
        createdAt: now - 2 * 60 * 60 * 1000,
      });

      conversationsCreated.push("Tomas (Dec 24 - invited, has event card!)");
    }

    return {
      success: true,
      message: `Created ${conversationsCreated.length} test conversations`,
      conversations: conversationsCreated,
      hint: "Go to /messages to see your test conversations!",
    };
  },
});
