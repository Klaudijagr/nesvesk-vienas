import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { createTestUser, createTestUserWithProfile } from './testUtils';

describe('files', () => {
  it('generates upload URL for authenticated user with existing record', async () => {
    const t = convexTest(schema);

    const { asUser } = await createTestUser(t, 'Existing User');

    // Should return an upload URL string
    const uploadUrl = await asUser.mutation(api.files.generateUploadUrl);
    expect(uploadUrl).toBeDefined();
    expect(typeof uploadUrl).toBe('string');
  });

  it('creates user record and generates upload URL for new Clerk user', async () => {
    const t = convexTest(schema);

    // Simulate a brand new user who has signed in via Clerk
    // but doesn't have a Convex user record yet (during onboarding)
    const newClerkId = `clerk_new_user_${Date.now()}`;

    const asNewUser = t.withIdentity({
      tokenIdentifier: newClerkId,
      name: 'New Onboarding User',
      email: 'new@example.com',
    });

    // This should create the user record via getOrCreateUser and return upload URL
    const uploadUrl = await asNewUser.mutation(api.files.generateUploadUrl);
    expect(uploadUrl).toBeDefined();
    expect(typeof uploadUrl).toBe('string');

    // Verify user was created in the database
    const users = await t.run(async (ctx) =>
      ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', newClerkId))
        .collect(),
    );

    expect(users.length).toBe(1);
    expect(users[0]?.name).toBe('New Onboarding User');
    expect(users[0]?.email).toBe('new@example.com');
  });

  it('rejects upload URL generation for unauthenticated users', async () => {
    const t = convexTest(schema);

    // Unauthenticated request should throw
    await expect(t.mutation(api.files.generateUploadUrl)).rejects.toThrow('Not authenticated');
  });

  // Note: saveProfilePhoto, addProfilePhoto, removeProfilePhoto require real storage IDs
  // which can't be easily created in unit tests. Auth checks are tested above.
  // Full photo upload flow should be tested via e2e tests.
});

describe('multiple photos', () => {
  it('creates profile with multiple photos via upsertProfile', async () => {
    const t = convexTest(schema);

    const photos = [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ];

    const { asUser } = await createTestUserWithProfile(t, 'Photo User', {
      photoUrl: photos[0],
      photos,
    });

    const profile = await asUser.query(api.profiles.getMyProfile);
    expect(profile).not.toBeNull();
    expect(profile?.photoUrl).toBe(photos[0]);
    expect(profile?.photos).toEqual(photos);
    expect(profile?.photos?.length).toBe(3);
  });

  it('preserves photos when updating profile', async () => {
    const t = convexTest(schema);

    const photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];

    const { asUser } = await createTestUserWithProfile(t, 'Update User', {
      photoUrl: photos[0],
      photos,
    });

    // Update profile without explicitly passing photos
    await asUser.mutation(api.profiles.upsertProfile, {
      role: 'host', // Changed from guest to host
      firstName: 'Updated Name',
      city: 'Kaunas',
      bio: 'Updated bio for testing',
      languages: ['Lithuanian', 'English'],
      availableDates: ['24 Dec', '25 Dec'],
      dietaryInfo: [],
      amenities: [],
      houseRules: [],
      vibes: [],
      smokingAllowed: false,
      drinkingAllowed: true,
      petsAllowed: false,
      hasPets: false,
    });

    const profile = await asUser.query(api.profiles.getMyProfile);
    expect(profile?.firstName).toBe('Updated Name');
    expect(profile?.role).toBe('host');
    // Photos should be preserved
    expect(profile?.photos).toEqual(photos);
  });

  it('returns photos info via getProfilePhotos query', async () => {
    const t = convexTest(schema);

    const photos = ['https://example.com/a.jpg', 'https://example.com/b.jpg'];

    const { asUser } = await createTestUserWithProfile(t, 'Gallery User', {
      photoUrl: photos[0],
      photos,
    });

    const photosInfo = await asUser.query(api.files.getProfilePhotos);
    expect(photosInfo).not.toBeNull();
    expect(photosInfo?.mainPhoto).toBe(photos[0]);
    expect(photosInfo?.photos).toEqual(photos);
    expect(photosInfo?.maxPhotos).toBe(5);
  });

  it('returns null for getProfilePhotos when not authenticated', async () => {
    const t = convexTest(schema);

    const photosInfo = await t.query(api.files.getProfilePhotos);
    expect(photosInfo).toBeNull();
  });

  it('returns null for getProfilePhotos when user has no profile', async () => {
    const t = convexTest(schema);

    // User exists but no profile
    const { asUser } = await createTestUser(t, 'No Profile User');

    const photosInfo = await asUser.query(api.files.getProfilePhotos);
    expect(photosInfo).toBeNull();
  });

  it('initializes empty photos array for new profiles', async () => {
    const t = convexTest(schema);

    // Create profile without photos
    const { asUser } = await createTestUserWithProfile(t, 'No Photos User');

    const profile = await asUser.query(api.profiles.getMyProfile);
    expect(profile?.photos).toEqual([]);
  });
});
