import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserId } from './lib/auth';

type Language = 'Lithuanian' | 'English' | 'Ukrainian' | 'Russian';
type HolidayDate = '24 Dec' | '25 Dec' | '26 Dec' | '31 Dec';

// Get current user's profile
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();
  },
});

// Get a profile by user ID (public info only)
export const getProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!profile) return null;

    // Hide sensitive info unless matched
    const currentUserId = await getCurrentUserId(ctx);
    const isOwner = currentUserId === args.userId;

    // TODO: Check if matched to show contact info
    const isMatched = false;

    if (!isOwner && !isMatched) {
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
    let profiles = await ctx.db.query('profiles').collect();

    // Apply filters
    if (args.city) {
      profiles = profiles.filter((p) => p.city === args.city);
    }
    if (args.role) {
      profiles = profiles.filter((p) => p.role === args.role || p.role === 'both');
    }
    if (args.language) {
      profiles = profiles.filter((p) => p.languages.includes(args.language as Language));
    }
    if (args.date) {
      profiles = profiles.filter((p) => p.availableDates.includes(args.date as HolidayDate));
    }

    // Hide sensitive info
    return profiles.map((p) => ({
      ...p,
      lastName: undefined,
      phone: undefined,
      address: undefined,
    }));
  },
});

// Create or update profile
export const upsertProfile = mutation({
  args: {
    role: v.union(v.literal('host'), v.literal('guest'), v.literal('both')),
    firstName: v.string(),
    lastName: v.optional(v.string()),
    age: v.optional(v.number()),
    city: v.union(
      v.literal('Vilnius'),
      v.literal('Kaunas'),
      v.literal('Klaipėda'),
      v.literal('Šiauliai'),
      v.literal('Panevėžys'),
      v.literal('Other'),
    ),
    bio: v.string(),
    photoUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    languages: v.array(
      v.union(
        v.literal('Lithuanian'),
        v.literal('English'),
        v.literal('Ukrainian'),
        v.literal('Russian'),
      ),
    ),
    availableDates: v.array(
      v.union(v.literal('24 Dec'), v.literal('25 Dec'), v.literal('26 Dec'), v.literal('31 Dec')),
    ),
    dietaryInfo: v.array(v.string()),
    concept: v.optional(v.union(v.literal('Party'), v.literal('Dinner'), v.literal('Hangout'))),
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
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const existing = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    const profileData = {
      ...args,
      userId,
      verified: false,
      lastActive: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, profileData);
      return existing._id;
    } else {
      return await ctx.db.insert('profiles', profileData);
    }
  },
});

// Update last active timestamp
export const updateLastActive = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return;

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { lastActive: Date.now() });
    }
  },
});
