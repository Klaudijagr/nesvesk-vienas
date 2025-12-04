import type { convexTest } from 'convex-test';
import type { Id } from '../_generated/dataModel';

type TestContext = ReturnType<typeof convexTest>;

/**
 * Create a test user in the database and return an authenticated test client
 */
export async function createTestUser(t: TestContext, name: string) {
  // Create user in the users table
  const userId = await t.run(async (ctx) => {
    return await ctx.db.insert('users', {});
  });

  // Return client with identity using the user's actual ID as subject
  return {
    userId: userId as Id<'users'>,
    asUser: t.withIdentity({
      subject: userId,
      name,
    }),
  };
}
