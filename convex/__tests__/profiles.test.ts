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

  it('hides profiles with isVisible=false from listings', async () => {
    const t = convexTest(schema);

    // Create a visible profile
    const { asUser: asVisible } = await createTestUser(t, 'Visible');
    await asVisible.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Visible User',
      city: 'Vilnius',
      bio: 'I am visible',
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
      isVisible: true,
    });

    // Create a hidden profile
    const { asUser: asHidden } = await createTestUser(t, 'Hidden');
    await asHidden.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Hidden User',
      city: 'Vilnius',
      bio: 'I am hidden',
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
      isVisible: false,
    });

    // List profiles - should only see visible one
    const allProfiles = await t.query(api.profiles.listProfiles, {});
    expect(allProfiles.length).toBe(1);
    expect(allProfiles[0]?.firstName).toBe('Visible User');
  });

  it('allows updating an existing profile', async () => {
    const t = convexTest(schema);

    const { asUser } = await createTestUser(t, 'Test User');

    // Create initial profile
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Original Name',
      city: 'Vilnius',
      bio: 'Original bio',
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

    // Update profile
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Updated Name',
      city: 'Kaunas',
      bio: 'Updated bio with more info',
      languages: ['Lithuanian', 'English'],
      availableDates: ['24 Dec', '25 Dec'],
      dietaryInfo: ['Vegetarian'],
      amenities: ['WiFi'],
      houseRules: ['No smoking'],
      vibes: ['Cozy'],
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: true,
      hasPets: false,
    });

    // Verify update
    const profile = await asUser.query(api.profiles.getMyProfile);
    expect(profile?.firstName).toBe('Updated Name');
    expect(profile?.city).toBe('Kaunas');
    expect(profile?.bio).toBe('Updated bio with more info');
    expect(profile?.languages).toContain('English');
    expect(profile?.drinkingAllowed).toBe(true);
  });

  it('can toggle profile visibility', async () => {
    const t = convexTest(schema);

    const { asUser } = await createTestUser(t, 'Toggle User');

    // Create visible profile
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Toggle User',
      city: 'Vilnius',
      bio: 'Testing visibility',
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
      isVisible: true,
    });

    // Should be visible initially
    let profiles = await t.query(api.profiles.listProfiles, {});
    expect(profiles.length).toBe(1);

    // Toggle to hidden
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Toggle User',
      city: 'Vilnius',
      bio: 'Testing visibility',
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
      isVisible: false,
    });

    // Should now be hidden
    profiles = await t.query(api.profiles.listProfiles, {});
    expect(profiles.length).toBe(0);
  });

  it('returns profile by userId via getProfile', async () => {
    const t = convexTest(schema);

    const { userId, asUser } = await createTestUser(t, 'Profile Owner');

    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Jonas',
      lastName: 'Jonaitis',
      city: 'Vilnius',
      bio: 'Hosting Christmas dinner',
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
      phone: '+370 612 34567',
      address: 'Pilies g. 1, Vilnius',
    });

    // Query the profile by userId
    const profile = await t.query(api.profiles.getProfile, { userId });
    expect(profile).not.toBeNull();
    expect(profile?.firstName).toBe('Jonas');
  });

  it('hides sensitive info from non-matched users viewing profile', async () => {
    const t = convexTest(schema);

    // Create host with sensitive info
    const { userId: hostUserId, asUser: asHost } = await createTestUser(t, 'Host');
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Marius',
      lastName: 'Kazlauskas',
      city: 'Vilnius',
      bio: 'Hosting dinner',
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
      phone: '+370 612 34567',
      address: 'Secret Address 123',
    });

    // Create a stranger (not matched)
    const { asUser: asStranger } = await createTestUser(t, 'Stranger');
    await asStranger.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Stranger',
      city: 'Kaunas',
      bio: 'Just browsing',
      languages: ['English'],
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

    // Stranger views host's profile - should NOT see sensitive info
    const profileAsStranger = await asStranger.query(api.profiles.getProfile, {
      userId: hostUserId,
    });

    expect(profileAsStranger?.firstName).toBe('Marius');
    expect(profileAsStranger?.lastName).toBeUndefined();
    expect(profileAsStranger?.phone).toBeUndefined();
    expect(profileAsStranger?.address).toBeUndefined();
  });

  it('shows sensitive info to matched users viewing profile', async () => {
    const t = convexTest(schema);

    // Create host with sensitive info
    const { userId: hostUserId, asUser: asHost } = await createTestUser(t, 'Host');
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Marius',
      lastName: 'Kazlauskas',
      city: 'Vilnius',
      bio: 'Hosting dinner',
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
      phone: '+370 612 34567',
      address: 'Pilies g. 1, Vilnius',
    });

    // Create guest
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');
    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Egle',
      city: 'Vilnius',
      bio: 'Looking for dinner',
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

    // Create and accept invitation (become matched)
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    await asGuest.mutation(api.invitations.respond, {
      invitationId: invitations.received[0]!._id,
      accept: true,
    });

    // Guest views host's profile - SHOULD see sensitive info now
    const profileAsGuest = await asGuest.query(api.profiles.getProfile, {
      userId: hostUserId,
    });

    expect(profileAsGuest?.firstName).toBe('Marius');
    expect(profileAsGuest?.lastName).toBe('Kazlauskas');
    expect(profileAsGuest?.phone).toBe('+370 612 34567');
    expect(profileAsGuest?.address).toBe('Pilies g. 1, Vilnius');
  });

  it('owner can see their own full profile info', async () => {
    const t = convexTest(schema);

    const { userId, asUser } = await createTestUser(t, 'Owner');
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Jonas',
      lastName: 'MyLastName',
      city: 'Vilnius',
      bio: 'My profile',
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
      phone: '+370 999 88877',
      address: 'My Secret Address',
    });

    // Owner views their own profile via getProfile
    const myProfile = await asUser.query(api.profiles.getProfile, { userId });

    expect(myProfile?.firstName).toBe('Jonas');
    expect(myProfile?.lastName).toBe('MyLastName');
    expect(myProfile?.phone).toBe('+370 999 88877');
    expect(myProfile?.address).toBe('My Secret Address');
  });
});
