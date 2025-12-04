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
});
