import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { createTestUser } from './testUtils';

describe('invitations', () => {
  it('allows sending and responding to invitations', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: hostUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Create profiles
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host',
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
    });

    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Guest',
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

    // Host sends invitation to guest
    await asHost.mutation(api.invitations.send, {
      toUserId: hostUserId,
      date: '24 Dec',
    });

    // Guest sees the invitation
    const guestInvitations = await asGuest.query(api.invitations.getMyInvitations);
    expect(guestInvitations.received.length).toBe(1);
    expect(guestInvitations.received[0]?.status).toBe('pending');
    expect(guestInvitations.received[0]?.date).toBe('24 Dec');

    // Host sees sent invitation
    const hostInvitations = await asHost.query(api.invitations.getMyInvitations);
    expect(hostInvitations.sent.length).toBe(1);

    // Guest accepts
    await asGuest.mutation(api.invitations.respond, {
      invitationId: guestInvitations.received[0]!._id,
      accept: true,
    });

    // Check status updated
    const updatedInvitations = await asGuest.query(api.invitations.getMyInvitations);
    expect(updatedInvitations.received[0]?.status).toBe('accepted');

    // Check they are matched
    const areMatched = await asHost.query(api.invitations.areMatched, {
      otherUserId: hostUserId,
    });
    expect(areMatched).toBe(true);
  });

  it('prevents duplicate invitations', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Create profiles
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host',
      city: 'Vilnius',
      bio: 'Host',
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

    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Guest',
      city: 'Vilnius',
      bio: 'Guest',
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

    // Send first invitation
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    // Try to send duplicate
    await expect(
      asHost.mutation(api.invitations.send, {
        toUserId: guestUserId,
        date: '25 Dec',
      }),
    ).rejects.toThrow('Invitation already sent');
  });

  it('tracks pending invitation count', async () => {
    const t = convexTest(schema);

    const { asUser: asHost1 } = await createTestUser(t, 'Host1');
    const { asUser: asHost2 } = await createTestUser(t, 'Host2');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Create profiles
    await asHost1.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host1',
      city: 'Vilnius',
      bio: 'Host1',
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

    await asHost2.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host2',
      city: 'Vilnius',
      bio: 'Host2',
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

    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Guest',
      city: 'Vilnius',
      bio: 'Guest',
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

    // Both hosts send invitations
    await asHost1.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });
    await asHost2.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '25 Dec',
    });

    // Check pending count
    const pendingCount = await asGuest.query(api.invitations.getPendingCount);
    expect(pendingCount).toBe(2);
  });
});
