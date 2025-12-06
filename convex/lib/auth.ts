import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

/**
 * Get the current user's ID from the Clerk auth context.
 * Creates a user record if one doesn't exist for this Clerk user.
 */
export async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  // Look up user by Clerk token identifier
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.tokenIdentifier))
    .unique();

  if (user) return user._id;

  return null;
}

/**
 * Get or create a user from the Clerk identity.
 * Use this in mutations where you need to ensure the user exists.
 */
export async function getOrCreateUser(ctx: MutationCtx): Promise<Id<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  // Look up existing user
  const existingUser = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.tokenIdentifier))
    .unique();

  if (existingUser) return existingUser._id;

  // Create new user from Clerk identity
  const userId = await ctx.db.insert('users', {
    clerkId: identity.tokenIdentifier,
    email: identity.email,
    name: identity.name,
    imageUrl: identity.pictureUrl,
  });

  return userId;
}
