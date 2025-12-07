import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Enums as literals for type safety
const userRole = v.union(
  v.literal("host"),
  v.literal("guest"),
  v.literal("both")
);
const city = v.union(
  v.literal("Vilnius"),
  v.literal("Kaunas"),
  v.literal("Klaipėda"),
  v.literal("Šiauliai"),
  v.literal("Panevėžys"),
  v.literal("Other")
);
const language = v.union(
  v.literal("Lithuanian"),
  v.literal("English"),
  v.literal("Ukrainian"),
  v.literal("Russian")
);
const holidayDate = v.union(
  v.literal("24 Dec"),
  v.literal("25 Dec"),
  v.literal("26 Dec"),
  v.literal("31 Dec")
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

// Message types
const messageType = v.union(
  v.literal("message"),
  v.literal("invitation_card"),
  v.literal("system")
);

// Moderation status (async - always send, flag later if needed)
const moderationStatus = v.union(
  v.literal("pending"),
  v.literal("clean"),
  v.literal("flagged"),
  v.literal("blocked")
);

// Event status
const eventStatus = v.union(
  v.literal("upcoming"),
  v.literal("completed"),
  v.literal("cancelled")
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

    // Basic info
    role: userRole,
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
    availableDates: v.array(holidayDate),
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
    .index("by_city", ["city"])
    .index("by_role", ["role"]),

  // Conversations between users (replaces simple invitations)
  conversations: defineTable({
    // Participants (guest is always participant1, host is participant2)
    guestId: v.id("users"),
    hostId: v.id("users"),

    // State
    status: conversationStatus,

    // Context - which event date is this about
    eventDate: holidayDate,

    // Timestamps for sorting
    lastMessageAt: v.optional(v.number()),
    createdAt: v.number(),

    // Request message (initial message from guest)
    requestMessage: v.optional(v.string()),
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

    // Message type
    type: v.optional(messageType), // defaults to "message"

    // Moderation (async - send first, moderate after)
    moderationStatus: v.optional(moderationStatus),
    moderationReason: v.optional(v.string()),

    // Optional event card for hosts to share event details
    eventCard: v.optional(
      v.object({
        date: holidayDate,
        time: v.optional(v.string()),
        address: v.optional(v.string()),
        phone: v.optional(v.string()),
        note: v.optional(v.string()),
        whatToBring: v.optional(v.string()),
      })
    ),

    // Timestamp
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"])
    .index("by_moderation", ["moderationStatus"]),

  // Events (confirmed gatherings)
  events: defineTable({
    hostId: v.id("users"),
    conversationId: v.optional(v.id("conversations")), // Link back to conversation

    // Event details
    eventDate: holidayDate,
    title: v.optional(v.string()),
    time: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),

    // Guests
    guestIds: v.array(v.id("users")),

    // Status
    status: eventStatus,

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_host", ["hostId"])
    .index("by_date", ["eventDate"])
    .index("by_status", ["status"]),

  // Keep invitations for backwards compatibility (can remove later)
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
