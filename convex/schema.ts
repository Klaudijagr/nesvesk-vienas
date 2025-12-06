import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Enums as literals for type safety
const userRole = v.union(v.literal('host'), v.literal('guest'), v.literal('both'));
const city = v.union(
  v.literal('Vilnius'),
  v.literal('Kaunas'),
  v.literal('Klaipėda'),
  v.literal('Šiauliai'),
  v.literal('Panevėžys'),
  v.literal('Other'),
);
const language = v.union(
  v.literal('Lithuanian'),
  v.literal('English'),
  v.literal('Ukrainian'),
  v.literal('Russian'),
);
const holidayDate = v.union(
  v.literal('24 Dec'),
  v.literal('25 Dec'),
  v.literal('26 Dec'),
  v.literal('31 Dec'),
);
const concept = v.union(v.literal('Party'), v.literal('Dinner'), v.literal('Hangout'));
const invitationStatus = v.union(
  v.literal('pending'),
  v.literal('accepted'),
  v.literal('declined'),
);

export default defineSchema({
  // Users table (linked to Clerk via tokenIdentifier)
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index('by_clerkId', ['clerkId']),

  // User profiles (extends user)
  profiles: defineTable({
    // Link to user
    userId: v.id('users'),

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
    .index('by_userId', ['userId'])
    .index('by_city', ['city'])
    .index('by_role', ['role']),

  // Messages between users
  messages: defineTable({
    senderId: v.id('users'),
    receiverId: v.id('users'),
    content: v.string(),
    read: v.boolean(),
    // Optional event card for hosts to share event details
    eventCard: v.optional(
      v.object({
        date: holidayDate,
        address: v.optional(v.string()),
        phone: v.optional(v.string()),
        note: v.optional(v.string()),
      }),
    ),
  })
    .index('by_sender', ['senderId'])
    .index('by_receiver', ['receiverId'])
    .index('by_participants', ['senderId', 'receiverId']),

  // Invitations (host invites guest or guest requests to join)
  invitations: defineTable({
    fromUserId: v.id('users'),
    toUserId: v.id('users'),
    status: invitationStatus,
    date: holidayDate,
  })
    .index('by_from', ['fromUserId'])
    .index('by_to', ['toUserId'])
    .index('by_status', ['status']),
});
