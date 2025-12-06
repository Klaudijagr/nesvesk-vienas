import type { convexTest } from 'convex-test';
import { api } from '../_generated/api';
import type { Id } from '../_generated/dataModel';

type TestContext = ReturnType<typeof convexTest>;

/**
 * Create a test user in the database and return an authenticated test client
 */
export async function createTestUser(t: TestContext, name: string) {
  // Generate a unique clerkId for the test user
  const clerkId = `test_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

  // Create user in the users table
  const userId = await t.run(
    async (ctx) =>
      await ctx.db.insert('users', {
        clerkId,
        name,
      }),
  );

  // Return client with identity using clerkId as tokenIdentifier
  // The getCurrentUserId function looks up by identity.tokenIdentifier
  return {
    userId: userId as Id<'users'>,
    asUser: t.withIdentity({
      tokenIdentifier: clerkId,
      name,
    }),
  };
}

/**
 * Create a test user with a profile
 */
export async function createTestUserWithProfile(
  t: TestContext,
  name: string,
  profileOverrides: Partial<{
    role: 'host' | 'guest';
    city: 'Vilnius' | 'Kaunas' | 'Klaipėda' | 'Šiauliai' | 'Panevėžys' | 'Other';
    photoUrl: string;
    photos: string[];
  }> = {},
) {
  const { userId, asUser } = await createTestUser(t, name);

  await asUser.mutation(api.profiles.upsertProfile, {
    role: profileOverrides.role ?? 'guest',
    firstName: name,
    city: profileOverrides.city ?? 'Vilnius',
    bio: `Test profile for ${name}`,
    languages: ['Lithuanian'],
    availableDates: ['24 Dec'],
    dietaryInfo: [],
    amenities: [],
    houseRules: [],
    vibes: [],
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: false,
    hasPets: false,
    photoUrl: profileOverrides.photoUrl,
    photos: profileOverrides.photos,
  });

  return { userId, asUser };
}
