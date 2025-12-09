import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Enums as literals for type safety
const userRole = v.union(
  v.literal("host"),
  v.literal("guest"),
  v.literal("both")
);
const hostingStatus = v.union(
  v.literal("can-host"),
  v.literal("may-host"),
  v.literal("cant-host")
);
const guestStatus = v.union(
  v.literal("looking"),
  v.literal("maybe-guest"),
  v.literal("not-looking")
);
const city = v.union(
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
);
const language = v.union(
  v.literal("Lithuanian"),
  v.literal("English"),
  v.literal("Ukrainian"),
  v.literal("Russian")
);
const holidayDate = v.union(
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
);
const concept = v.union(
  v.literal("Party"),
  v.literal("Dinner"),
  v.literal("Hangout")
);

// Conversation states:
// requested - guest sent request, waiting for host
// accepted - host accepted, chat unlocked
// declined - host declined
// invited - host sent formal invitation card
// confirmed - guest accepted invitation, event is set
const conversationStatus = v.union(
  v.literal("requested"),
  v.literal("accepted"),
  v.literal("declined"),
  v.literal("invited"),
  v.literal("confirmed")
);

// Moderation status (async - always send, flag later if needed)
const moderationStatus = v.union(
  v.literal("pending"),
  v.literal("clean"),
  v.literal("flagged"),
  v.literal("blocked")
);

export default defineSchema({
  // Users table (linked to Clerk via tokenIdentifier)
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isAiTestUser: v.optional(v.boolean()), // For AI test users
  }).index("by_clerkId", ["clerkId"]),

  // User profiles (extends user)
  profiles: defineTable({
    // Link to user
    userId: v.id("users"),

    // Username for /people/[username] route
    username: v.optional(v.string()), // Unique, lowercase, alphanumeric + hyphens

    // Basic info
    role: userRole, // Derived from hostingStatus + guestStatus for backwards compat
    hostingStatus: v.optional(hostingStatus), // "can-host" | "may-host" | "cant-host"
    guestStatus: v.optional(guestStatus), // "looking" | "maybe-guest" | "not-looking"
    firstName: v.string(),
    lastName: v.optional(v.string()),
    age: v.optional(v.number()),
    city,
    bio: v.string(),
    photoUrl: v.optional(v.string()), // Main/primary photo (first in gallery)
    photos: v.optional(v.array(v.string())), // Additional photos (up to 5 total)
    verified: v.boolean(),
    isVisible: v.optional(v.boolean()), // Whether profile appears in search

    // Contact (hidden until match)
    phone: v.optional(v.string()),
    address: v.optional(v.string()),

    // Preferences
    languages: v.array(language),
    availableDates: v.array(holidayDate), // Combined dates for backwards compat
    hostingDates: v.optional(v.array(holidayDate)), // Dates when user can host
    guestDates: v.optional(v.array(holidayDate)), // Dates when user wants to be a guest
    dietaryInfo: v.array(v.string()),

    // Host-specific
    concept: v.optional(concept),
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

    // Timestamps
    lastActive: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"])
    .index("by_city", ["city"])
    .index("by_role", ["role"]),

  // Conversations between users
  conversations: defineTable({
    // Participants (guest is always participant1, host is participant2)
    guestId: v.id("users"),
    hostId: v.id("users"),

    // State
    status: conversationStatus,

    // Timestamps for sorting
    lastMessageAt: v.optional(v.number()),
    createdAt: v.number(),

    // Request message (initial message from guest)
    requestMessage: v.optional(v.string()),

    // Event date (for confirmed events)
    eventDate: v.optional(holidayDate),
  })
    .index("by_guest", ["guestId"])
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_lastMessage", ["lastMessageAt"]),

  // Messages between users
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    read: v.boolean(),

    // Message type (for special messages like invitations)
    type: v.optional(v.string()),

    // Moderation (async - send first, moderate after)
    moderationStatus: v.optional(moderationStatus),
    moderationReason: v.optional(v.string()),

    // Timestamp
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"])
    .index("by_moderation", ["moderationStatus"]),

  // Invitations (connection requests)
  invitations: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined")
    ),
    date: holidayDate,
  })
    .index("by_from", ["fromUserId"])
    .index("by_to", ["toUserId"])
    .index("by_status", ["status"]),

  // Banned words for content moderation (regex first pass)
  bannedWords: defineTable({
    word: v.string(),
    category: v.string(), // profanity, spam, harassment, etc.
    isRegex: v.optional(v.boolean()),
  }).index("by_category", ["category"]),
});
