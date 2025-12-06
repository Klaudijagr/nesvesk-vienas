import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getCurrentUserId } from './lib/auth';

// Get messages between current user and another user
export const getConversation = query({
  args: { otherUserId: v.id('users') },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const sent = await ctx.db
      .query('messages')
      .withIndex('by_participants', (q) =>
        q.eq('senderId', userId).eq('receiverId', args.otherUserId),
      )
      .collect();

    const received = await ctx.db
      .query('messages')
      .withIndex('by_participants', (q) =>
        q.eq('senderId', args.otherUserId).eq('receiverId', userId),
      )
      .collect();

    // Combine and sort by creation time
    return [...sent, ...received].sort((a, b) => a._creationTime - b._creationTime);
  },
});

// Get all conversations for current user
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    // Get all messages involving current user
    const sent = await ctx.db
      .query('messages')
      .withIndex('by_sender', (q) => q.eq('senderId', userId))
      .collect();

    const received = await ctx.db
      .query('messages')
      .withIndex('by_receiver', (q) => q.eq('receiverId', userId))
      .collect();

    // Get unique conversation partners
    const partnerIds = new Set<string>();
    for (const m of sent) {
      partnerIds.add(m.receiverId);
    }
    for (const m of received) {
      partnerIds.add(m.senderId);
    }

    // Build conversation summaries
    const conversations = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_userId', (q) => q.eq('userId', partnerId as Id<'users'>))
          .first();

        const allMessages = [...sent, ...received].filter(
          (m) => m.senderId === partnerId || m.receiverId === partnerId,
        );

        const lastMessage = allMessages.sort((a, b) => b._creationTime - a._creationTime)[0];
        const unreadCount = allMessages.filter((m) => m.senderId === partnerId && !m.read).length;

        return {
          oderId: partnerId,
          profile,
          lastMessage,
          unreadCount,
        };
      }),
    );

    // Sort by last message time
    return conversations.sort(
      (a, b) => (b.lastMessage?._creationTime ?? 0) - (a.lastMessage?._creationTime ?? 0),
    );
  },
});

// Send a message
export const send = mutation({
  args: {
    receiverId: v.id('users'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    return await ctx.db.insert('messages', {
      senderId: userId,
      receiverId: args.receiverId,
      content: args.content,
      read: false,
    });
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: { senderId: v.id('users') },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return;

    const unread = await ctx.db
      .query('messages')
      .withIndex('by_participants', (q) => q.eq('senderId', args.senderId).eq('receiverId', userId))
      .filter((q) => q.eq(q.field('read'), false))
      .collect();

    await Promise.all(unread.map((m) => ctx.db.patch(m._id, { read: true })));
  },
});

// Get unread count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return 0;

    const unread = await ctx.db
      .query('messages')
      .withIndex('by_receiver', (q) => q.eq('receiverId', userId))
      .filter((q) => q.eq(q.field('read'), false))
      .collect();

    return unread.length;
  },
});

// Send an event card (host shares event details with guest)
export const sendEventCard = mutation({
  args: {
    receiverId: v.id('users'),
    date: v.union(
      v.literal('24 Dec'),
      v.literal('25 Dec'),
      v.literal('26 Dec'),
      v.literal('31 Dec'),
    ),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Verify the users are matched (have an accepted invitation)
    const sentMatch = await ctx.db
      .query('invitations')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .filter((q) =>
        q.and(q.eq(q.field('toUserId'), args.receiverId), q.eq(q.field('status'), 'accepted')),
      )
      .first();

    const receivedMatch = await ctx.db
      .query('invitations')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .filter((q) =>
        q.and(q.eq(q.field('fromUserId'), args.receiverId), q.eq(q.field('status'), 'accepted')),
      )
      .first();

    if (!(sentMatch || receivedMatch)) {
      throw new Error('You must be matched to share event details');
    }

    return await ctx.db.insert('messages', {
      senderId: userId,
      receiverId: args.receiverId,
      content: '📍 Shared event details',
      read: false,
      eventCard: {
        date: args.date,
        address: args.address,
        phone: args.phone,
        note: args.note,
      },
    });
  },
});
