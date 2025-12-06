import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';
import { createTestUser } from './testUtils';

describe('messages', () => {
  it('allows sending and receiving messages between users', async () => {
    const t = convexTest(schema);

    // Create two users with profiles
    const { userId: aliceUserId, asUser: asAlice } = await createTestUser(t, 'Alice');
    const { userId: bobUserId, asUser: asBob } = await createTestUser(t, 'Bob');

    // Create profiles for both users
    await asAlice.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Alice',
      city: 'Vilnius',
      bio: 'Host',
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

    await asBob.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Bob',
      city: 'Vilnius',
      bio: 'Guest',
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

    // Alice sends a message to Bob
    await asAlice.mutation(api.messages.send, {
      receiverId: bobUserId,
      content: 'Hello Bob!',
    });

    // Bob can see the message
    const bobConversation = await asBob.query(api.messages.getConversation, {
      otherUserId: aliceUserId,
    });

    expect(bobConversation.length).toBe(1);
    expect(bobConversation[0]?.content).toBe('Hello Bob!');

    // Bob replies
    await asBob.mutation(api.messages.send, {
      receiverId: aliceUserId,
      content: 'Hi Alice!',
    });

    // Alice sees both messages
    const aliceConversation = await asAlice.query(api.messages.getConversation, {
      otherUserId: bobUserId,
    });

    expect(aliceConversation.length).toBe(2);
  });

  it('tracks unread message count', async () => {
    const t = convexTest(schema);

    const { userId: senderUserId, asUser: asSender } = await createTestUser(t, 'Sender');
    const { userId: receiverUserId, asUser: asReceiver } = await createTestUser(t, 'Receiver');

    // Create profiles
    await asSender.mutation(api.profiles.upsertProfile, {
      role: 'host',
      firstName: 'Sender',
      city: 'Vilnius',
      bio: 'Sender',
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

    await asReceiver.mutation(api.profiles.upsertProfile, {
      role: 'guest',
      firstName: 'Receiver',
      city: 'Vilnius',
      bio: 'Receiver',
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

    // Send multiple messages
    await asSender.mutation(api.messages.send, {
      receiverId: receiverUserId,
      content: 'Message 1',
    });
    await asSender.mutation(api.messages.send, {
      receiverId: receiverUserId,
      content: 'Message 2',
    });

    // Check unread count
    const unreadCount = await asReceiver.query(api.messages.getUnreadCount);
    expect(unreadCount).toBe(2);

    // Mark as read
    await asReceiver.mutation(api.messages.markAsRead, {
      senderId: senderUserId,
    });

    const newUnreadCount = await asReceiver.query(api.messages.getUnreadCount);
    expect(newUnreadCount).toBe(0);
  });

  it('lists all conversations for a user', async () => {
    const t = convexTest(schema);

    const { userId: user1Id, asUser: asUser1 } = await createTestUser(t, 'User1');
    const { userId: user2Id, asUser: asUser2 } = await createTestUser(t, 'User2');
    const { userId: user3Id, asUser: asUser3 } = await createTestUser(t, 'User3');

    // Create profiles
    for (const { asUser, name } of [
      { asUser: asUser1, name: 'User1' },
      { asUser: asUser2, name: 'User2' },
      { asUser: asUser3, name: 'User3' },
    ]) {
      await asUser.mutation(api.profiles.upsertProfile, {
        role: 'host',
        firstName: name,
        city: 'Vilnius',
        bio: name,
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
    }

    // User1 messages User2 and User3
    await asUser1.mutation(api.messages.send, {
      receiverId: user2Id,
      content: 'Hello User2!',
    });
    await asUser1.mutation(api.messages.send, {
      receiverId: user3Id,
      content: 'Hello User3!',
    });

    // User1 should see 2 conversations
    const conversations = await asUser1.query(api.messages.getConversations);
    expect(conversations.length).toBe(2);

    // Each conversation should have the last message
    expect(conversations.some((c) => c.lastMessage?.content === 'Hello User2!')).toBe(true);
    expect(conversations.some((c) => c.lastMessage?.content === 'Hello User3!')).toBe(true);
  });

  it('allows hosts to send event cards to matched guests', async () => {
    const t = convexTest(schema);

    const { userId: hostUserId, asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

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

    // Create and accept invitation (to become matched)
    await asHost.mutation(api.invitations.send, {
      toUserId: guestUserId,
      date: '24 Dec',
    });

    const invitations = await asGuest.query(api.invitations.getMyInvitations);
    await asGuest.mutation(api.invitations.respond, {
      invitationId: invitations.received[0]!._id,
      accept: true,
    });

    // Now host can send event card
    await asHost.mutation(api.messages.sendEventCard, {
      receiverId: guestUserId,
      date: '24 Dec',
      address: 'Pilies g. 12, Vilnius',
      phone: '+370 612 34567',
      note: 'Ring doorbell twice!',
    });

    // Guest should see the event card message
    const conversation = await asGuest.query(api.messages.getConversation, {
      otherUserId: hostUserId,
    });

    expect(conversation.length).toBe(1);
    expect(conversation[0]?.eventCard).toBeDefined();
    expect(conversation[0]?.eventCard?.address).toBe('Pilies g. 12, Vilnius');
    expect(conversation[0]?.eventCard?.phone).toBe('+370 612 34567');
    expect(conversation[0]?.eventCard?.note).toBe('Ring doorbell twice!');
  });

  it('prevents sending event cards to non-matched users', async () => {
    const t = convexTest(schema);

    const { asUser: asHost } = await createTestUser(t, 'Host');
    const { userId: guestUserId, asUser: asGuest } = await createTestUser(t, 'Guest');

    // Create profiles but NO invitation/match
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

    // Try to send event card without being matched
    await expect(
      asHost.mutation(api.messages.sendEventCard, {
        receiverId: guestUserId,
        date: '24 Dec',
        address: 'Some address',
      }),
    ).rejects.toThrow('You must be matched to share event details');
  });
});
