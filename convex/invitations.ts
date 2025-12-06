import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';
import { mutation, query } from './_generated/server';
import { getCurrentUserId, getOrCreateUser } from './lib/auth';

// Helper to get user email from users table
async function getUserEmail(ctx: MutationCtx, userId: Id<'users'>): Promise<string | null> {
  const user = await ctx.db.get(userId);
  return user?.email || null;
}

// Get invitations for current user (both sent and received)
export const getMyInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return { sent: [], received: [] };

    const sent = await ctx.db
      .query('invitations')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .collect();

    const received = await ctx.db
      .query('invitations')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .collect();

    // Enrich with profile data
    const enrichInvitation = async (inv: (typeof sent)[0], isFrom: boolean) => {
      const otherUserId = isFrom ? inv.toUserId : inv.fromUserId;
      const profile = await ctx.db
        .query('profiles')
        .withIndex('by_userId', (q) => q.eq('userId', otherUserId))
        .first();

      return {
        ...inv,
        otherUser: profile
          ? {
              id: otherUserId,
              firstName: profile.firstName,
              photoUrl: profile.photoUrl,
              city: profile.city,
            }
          : null,
      };
    };

    return {
      sent: await Promise.all(sent.map((inv) => enrichInvitation(inv, true))),
      received: await Promise.all(received.map((inv) => enrichInvitation(inv, false))),
    };
  },
});

// Send an invitation
export const send = mutation({
  args: {
    toUserId: v.id('users'),
    date: v.union(
      v.literal('24 Dec'),
      v.literal('25 Dec'),
      v.literal('26 Dec'),
      v.literal('31 Dec'),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Check if invitation already exists
    const existing = await ctx.db
      .query('invitations')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .filter((q) => q.eq(q.field('toUserId'), args.toUserId))
      .first();

    if (existing) {
      throw new Error('Invitation already sent');
    }

    const invitationId = await ctx.db.insert('invitations', {
      fromUserId: userId,
      toUserId: args.toUserId,
      status: 'pending',
      date: args.date,
    });

    // Send email notification to recipient
    const recipientEmail = await getUserEmail(ctx, args.toUserId);
    const senderProfile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (recipientEmail && senderProfile) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: recipientEmail,
        type: 'invitationReceived',
        senderName: senderProfile.firstName,
        date: args.date,
      });
    }

    return invitationId;
  },
});

// Respond to an invitation
export const respond = mutation({
  args: {
    invitationId: v.id('invitations'),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) throw new Error('Not authenticated');

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error('Invitation not found');

    if (invitation.toUserId !== userId) {
      throw new Error('Not authorized to respond to this invitation');
    }

    await ctx.db.patch(args.invitationId, {
      status: args.accept ? 'accepted' : 'declined',
    });

    // Send email notification to the sender
    const senderEmail = await getUserEmail(ctx, invitation.fromUserId);
    const responderProfile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (senderEmail && responderProfile) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: senderEmail,
        type: args.accept ? 'invitationAccepted' : 'invitationDeclined',
        senderName: responderProfile.firstName,
        date: invitation.date,
      });
    }
  },
});

// Get pending invitation count
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return 0;

    const pending = await ctx.db
      .query('invitations')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();

    return pending.length;
  },
});

// Get all matches (accepted invitations) with FULL contact info revealed
export const getMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    // Get accepted invitations where user is sender or receiver
    const sentMatches = await ctx.db
      .query('invitations')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .filter((q) => q.eq(q.field('status'), 'accepted'))
      .collect();

    const receivedMatches = await ctx.db
      .query('invitations')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .filter((q) => q.eq(q.field('status'), 'accepted'))
      .collect();

    // Combine and enrich with FULL profile data (including hidden fields)
    const allMatches = [...sentMatches, ...receivedMatches];

    const enrichedMatches = await Promise.all(
      allMatches.map(async (inv) => {
        const otherUserId = inv.fromUserId === userId ? inv.toUserId : inv.fromUserId;
        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_userId', (q) => q.eq('userId', otherUserId))
          .first();

        return {
          _id: inv._id,
          date: inv.date,
          matchedAt: inv._creationTime,
          isSender: inv.fromUserId === userId,
          otherUser: profile
            ? {
                userId: otherUserId,
                firstName: profile.firstName,
                lastName: profile.lastName, // REVEALED
                age: profile.age,
                city: profile.city,
                bio: profile.bio,
                photoUrl: profile.photoUrl,
                phone: profile.phone, // REVEALED
                address: profile.address, // REVEALED
                languages: profile.languages,
                role: profile.role,
                concept: profile.concept,
                capacity: profile.capacity,
              }
            : null,
        };
      }),
    );

    // Sort by match date (most recent first)
    return enrichedMatches.sort((a, b) => (b.matchedAt ?? 0) - (a.matchedAt ?? 0));
  },
});

// Check if users are matched (accepted invitation exists)
export const areMatched = query({
  args: { otherUserId: v.id('users') },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return false;

    // Check both directions
    const sentAccepted = await ctx.db
      .query('invitations')
      .withIndex('by_from', (q) => q.eq('fromUserId', userId))
      .filter((q) =>
        q.and(q.eq(q.field('toUserId'), args.otherUserId), q.eq(q.field('status'), 'accepted')),
      )
      .first();

    if (sentAccepted) return true;

    const receivedAccepted = await ctx.db
      .query('invitations')
      .withIndex('by_to', (q) => q.eq('toUserId', userId))
      .filter((q) =>
        q.and(q.eq(q.field('fromUserId'), args.otherUserId), q.eq(q.field('status'), 'accepted')),
      )
      .first();

    return !!receivedAccepted;
  },
});
