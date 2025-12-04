import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserId } from './lib/auth';

// Generate upload URL for profile photos
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
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
