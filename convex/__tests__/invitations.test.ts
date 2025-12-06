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

  it('allows declining invitations', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Create profiles
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Host',
      city: 'Vilnius',
      bio: 'Hosting',
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
      bio: 'Looking',
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

    // Send invitation
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    // Guest declines
    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    await asGuest.mutation(api.invitations.respond, {
      invitationId: invitations.received[0]!._id,
      accept: false,
    });

    // Verify status is declined
    const updated = await asGuest.query(api.invitations.getMyInvitations);
    expect(updated.received[0]?.status).toBe('declined');

    // Not matched after declining
    const areMatched = await asHost.query(api.invitations.areMatched, {
      otherUserId: guestUserId,
    });
    expect(areMatched).toBe(false);
  });

  it('prevents responding to invitations sent to others', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');
    const { asUser: asOther } = await createTestUser(t, 'Other');

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

    // Host sends to guest
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    // Get invitation ID
    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    const invitationId = invitations.received[0]!._id;

    // Other user tries to respond - should fail
    await expect(
      asOther.mutation(api.invitations.respond, {
        invitationId,
        accept: true,
      }),
    ).rejects.toThrow('Not authorized to respond to this invitation');
  });

  it('returns full contact info in getMatches for accepted invitations', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Host creates profile with contact info
    await asHost.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Jonas',
      lastName: 'Jonaitis',
      phone: '+37061234567',
      address: 'Gedimino pr. 1, Vilnius',
      city: 'Vilnius',
      bio: 'Hosting Christmas dinner',
      languages: ['Lithuanian', 'English'],
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

    // Guest creates profile
    await asGuest.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Petras',
      lastName: 'Petraitis',
      phone: '+37069876543',
      city: 'Kaunas',
      bio: 'Looking for a host',
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

    // Host sends invitation
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    // Guest accepts
    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    await asGuest.mutation(api.invitations.respond, {
      invitationId: invitations.received[0]!._id,
      accept: true,
    });

    // Guest can see host's full info via getMatches
    const guestMatches = await asGuest.query(api.invitations.getMatches);
    expect(guestMatches.length).toBe(1);
    expect(guestMatches[0]?.otherUser?.firstName).toBe('Jonas');
    expect(guestMatches[0]?.otherUser?.lastName).toBe('Jonaitis');
    expect(guestMatches[0]?.otherUser?.phone).toBe('+37061234567');
    expect(guestMatches[0]?.otherUser?.address).toBe('Gedimino pr. 1, Vilnius');
    expect(guestMatches[0]?.date).toBe('24 Dec');

    // Host can also see guest's full info
    const hostMatches = await asHost.query(api.invitations.getMatches);
    expect(hostMatches.length).toBe(1);
    expect(hostMatches[0]?.otherUser?.firstName).toBe('Petras');
    expect(hostMatches[0]?.otherUser?.lastName).toBe('Petraitis');
    expect(hostMatches[0]?.otherUser?.phone).toBe('+37069876543');
  });

  it('areMatched returns true for both sender and receiver of accepted invitation', async () => {
    const t = convexTest(schema);

    const { userId: hostUserId, asUser: asHost } = await createTestUser(t, 'Host');
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

    // Host sends, guest accepts
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    await asGuest.mutation(api.invitations.respond, {
      invitationId: invitations.received[0]!._id,
      accept: true,
    });

    // Host checks if matched with guest (sent direction)
    const hostSees = await asHost.query(api.invitations.areMatched, {
      otherUserId: guestUserId,
    });
    expect(hostSees).toBe(true);

    // Guest checks if matched with host (received direction)
    const guestSees = await asGuest.query(api.invitations.areMatched, {
      otherUserId: hostUserId,
    });
    expect(guestSees).toBe(true);
  });

  it('getMatches returns empty for unauthenticated users', async () => {
    const t = convexTest(schema);

    // Query without authentication
    const matches = await t.query(api.invitations.getMatches);
    expect(matches).toEqual([]);
  });

  it('areMatched returns false for pending invitations', async () => {
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

    // Send invitation but don't accept
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    // Not matched yet (still pending)
    const areMatched = await asHost.query(api.invitations.areMatched, {
      otherUserId: guestUserId,
    });
    expect(areMatched).toBe(false);
  });
});
