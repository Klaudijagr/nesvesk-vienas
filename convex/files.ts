import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserId, getOrCreateUser } from './lib/auth';

// Generate upload URL for profile photos
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Use getOrCreateUser since this may be called during registration
    // before the user record exists in Convex
    const userId = await getOrCreateUser(ctx);
    if (!userId) throw new Error('Not authenticated');

    return await ctx.storage.generateUploadUrl();
  },
});

// Store the uploaded file and update profile
export const saveProfilePhoto = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Get the URL for the uploaded file
    const photoUrl = await ctx.storage.getUrl(args.storageId);
    if (!photoUrl) throw new Error('Failed to get file URL');

    // Update the profile with the new photo URL
    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { photoUrl });
    }

    return photoUrl;
  },
});

// Get URL for a storage ID
export const getUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => await ctx.storage.getUrl(args.storageId),
});

// Get URL for a storage ID (mutation version for use in sequences)
export const getStorageUrl = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    return await ctx.storage.getUrl(args.storageId);
  },
});

const MAX_PHOTOS = 5;

// Add a photo to the profile gallery
export const addProfilePhoto = mutation({
  args: {
    storageId: v.id('_storage'),
    setAsMain: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const photoUrl = await ctx.storage.getUrl(args.storageId);
    if (!photoUrl) throw new Error('Failed to get file URL');

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!profile) throw new Error('Profile not found');

    const currentPhotos = profile.photos ?? [];

    // Check photo limit
    if (currentPhotos.length >= MAX_PHOTOS) {
      throw new Error(`Maximum ${MAX_PHOTOS} photos allowed`);
    }

    // Add to photos array
    const updatedPhotos = [...currentPhotos, photoUrl];

    // If setAsMain or no main photo yet, set as main
    const updates: { photos: string[]; photoUrl?: string } = { photos: updatedPhotos };
    if (args.setAsMain || !profile.photoUrl) {
      updates.photoUrl = photoUrl;
    }

    await ctx.db.patch(profile._id, updates);

    return { photoUrl, totalPhotos: updatedPhotos.length };
  },
});

// Remove a photo from the profile gallery
export const removeProfilePhoto = mutation({
  args: {
    photoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!profile) throw new Error('Profile not found');

    const currentPhotos = profile.photos ?? [];
    const updatedPhotos = currentPhotos.filter((p) => p !== args.photoUrl);

    // If we're removing the main photo, set the first remaining photo as main
    const updates: { photos: string[]; photoUrl?: string } = { photos: updatedPhotos };
    if (profile.photoUrl === args.photoUrl) {
      updates.photoUrl = updatedPhotos[0] ?? undefined;
    }

    await ctx.db.patch(profile._id, updates);

    return { totalPhotos: updatedPhotos.length };
  },
});

// Set a photo as the main profile photo
export const setMainPhoto = mutation({
  args: {
    photoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!profile) throw new Error('Profile not found');

    const currentPhotos = profile.photos ?? [];

    // Verify the photo exists in the gallery
    if (!currentPhotos.includes(args.photoUrl)) {
      throw new Error('Photo not found in gallery');
    }

    await ctx.db.patch(profile._id, { photoUrl: args.photoUrl });

    return { photoUrl: args.photoUrl };
  },
});

// Get all profile photos
export const getProfilePhotos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!profile) return null;

    return {
      mainPhoto: profile.photoUrl ?? null,
      photos: profile.photos ?? [],
      maxPhotos: MAX_PHOTOS,
    };
  },
});
