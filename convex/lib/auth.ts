import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { auth } from '../auth';

/**
 * Get the current user's ID from the auth context.
 * This helper works with both real auth (@convex-dev/auth) and test identities (convex-test).
 *
 * In production: Uses auth.getUserId() from @convex-dev/auth
 * In tests: Falls back to using identity subject if it's a valid user ID
 */
export async function getCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<'users'> | null> {
  // Try the standard auth method first
  try {
    const userId = await auth.getUserId(ctx);
    if (userId) return userId;
  } catch {
    // Auth lookup failed, fall through to fallback for tests
  }

  // Fallback for tests: use identity subject if it matches a user in the database
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.subject) {
    try {
      // Check if the subject is a valid user ID that exists in the database
      const user = await ctx.db.get(identity.subject as Id<'users'>);
      if (user) return identity.subject as Id<'users'>;
    } catch {
      // Not a valid user ID format or user doesn't exist
    }
  }

  return null;
}
