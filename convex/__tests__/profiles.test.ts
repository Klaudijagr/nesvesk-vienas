import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { createTestUser } from './testUtils';

describe('profiles', () => {
  it('returns null for unauthenticated user on getMyProfile', async () => {
    const t = convexTest(schema);
    const profile = await t.query(api.profiles.getMyProfile);
    expect(profile).toBeNull();
  });

  it('allows authenticated user to create a profile', async () => {
    const t = convexTest(schema);

    const { asUser } = await createTestUser(t, 'Test User');

    // Create profile
    const profileId = await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Ieva',
      lastName: 'Test',
      city: 'Vilnius',
      bio: 'Hosting a cozy dinner!',
      languages: ['Lithuanian', 'English'],
      availableDates: ['24 Dec', '25 Dec'],
      dietaryInfo: ['Vegetarian'],
      concept: 'Dinner',
      capacity: 4,
      amenities: ['Board Games'],
      houseRules: [],
      vibes: ['Cozy'],
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: true,
      hasPets: false,
    });

    expect(profileId).toBeDefined();

    // Verify profile exists
    const myProfile = await asUser.query(api.profiles.getMyProfile);
    expect(myProfile).not.toBeNull();
    expect(myProfile?.firstName).toBe('Ieva');
    expect(myProfile?.role).toBe('host');
  });

  it('lists profiles with filters', async () => {
    const t = convexTest(schema);

    // Create some profiles
    const { asUser: asHost } = await createTestUser(t, 'Host');
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host User',
      city: 'Vilnius',
      bio: 'I am a host',
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
    });

    const { asUser: asGuest } = await createTestUser(t, 'Guest');
    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Guest User',
      city: 'Kaunas',
      bio: 'I am a guest',
      languages: ['English'],
      availableDates: ['31 Dec'],
      dietaryInfo: [],
      amenities: [],
      houseRules: [],
      vibes: [],
      smokingAllowed: false,
      drinkingAllowed: false,
      petsAllowed: false,
      hasPets: false,
    });

    // List all
    const allProfiles = await t.query(api.profiles.listProfiles, {});
    expect(allProfiles.length).toBe(2);

    // Filter by city
    const vilniusProfiles = await t.query(api.profiles.listProfiles, {
      city: 'Vilnius',
    });
    expect(vilniusProfiles.length).toBe(1);
    expect(vilniusProfiles[0]?.firstName).toBe('Host User');

    // Filter by role
    const guests = await t.query(api.profiles.listProfiles, {
      role: 'guest',
    });
    expect(guests.length).toBe(1);
    expect(guests[0]?.firstName).toBe('Guest User');
  });
});
