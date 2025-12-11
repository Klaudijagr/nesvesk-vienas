import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId, getOrCreateUser } from "./lib/auth";

// Helper to check if user wants invitation notifications
async function shouldSendInvitationEmail(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<{ shouldSend: boolean; email: string | null }> {
  const user = await ctx.db.get(userId);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  // Check if user wants invitation notifications (default true)
  const wantsNotifications =
    profile?.emailNotifications !== false &&
    profile?.notifyOnInvitation !== false;

  return {
    shouldSend: wantsNotifications && !!user?.email,
    email: user?.email || null,
  };
}

// Helper to check if user wants match notifications
async function shouldSendMatchEmail(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<{ shouldSend: boolean; email: string | null }> {
  const user = await ctx.db.get(userId);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  // Check if user wants match notifications (default true)
  const wantsNotifications =
    profile?.emailNotifications !== false && profile?.notifyOnMatch !== false;

  return {
    shouldSend: wantsNotifications && !!user?.email,
    email: user?.email || null,
  };
}

// Get invitations for current user (both sent and received)
export const getMyInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return { sent: [], received: [] };
    }

    const sent = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .collect();

    const received = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .collect();

    // Enrich with profile data
    const enrichInvitation = async (inv: (typeof sent)[0], isFrom: boolean) => {
      const otherUserId = isFrom ? inv.toUserId : inv.fromUserId;
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", otherUserId))
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
      received: await Promise.all(
        received.map((inv) => enrichInvitation(inv, false))
      ),
    };
  },
});

// Send an invitation
export const send = mutation({
  args: {
    toUserId: v.id("users"),
    date: v.union(
      v.literal("24 Dec"),
      v.literal("25 Dec"),
      v.literal("26 Dec"),
      v.literal("31 Dec")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Prevent self-invitation
    if (userId === args.toUserId) {
      throw new Error("Cannot send invitation to yourself");
    }

    // Check if invitation already exists
    const existing = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .filter((q) => q.eq(q.field("toUserId"), args.toUserId))
      .first();

    if (existing) {
      throw new Error("Invitation already sent");
    }

    const invitationId = await ctx.db.insert("invitations", {
      fromUserId: userId,
      toUserId: args.toUserId,
      status: "pending",
      date: args.date,
    });

    // Send email notification to recipient (if they want it)
    const recipientCheck = await shouldSendInvitationEmail(ctx, args.toUserId);
    const senderProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (recipientCheck.shouldSend && recipientCheck.email && senderProfile) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: recipientCheck.email,
        type: "invitationReceived",
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
    invitationId: v.id("invitations"),
    accept: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.toUserId !== userId) {
      throw new Error("Not authorized to respond to this invitation");
    }

    await ctx.db.patch(args.invitationId, {
      status: args.accept ? "accepted" : "declined",
    });

    // If accepted, create a conversation for messaging
    if (args.accept) {
      const now = Date.now();

      // Check if conversation already exists
      const existingConv = await ctx.db
        .query("conversations")
        .withIndex("by_guest", (q) => q.eq("guestId", invitation.fromUserId))
        .filter((q) => q.eq(q.field("hostId"), userId))
        .first();

      if (!existingConv) {
        // Create new conversation - the person who sent the invitation is the guest
        const conversationId = await ctx.db.insert("conversations", {
          guestId: invitation.fromUserId,
          hostId: userId,
          status: "accepted",
          createdAt: now,
          lastMessageAt: now,
        });

        // Add a system message
        await ctx.db.insert("messages", {
          conversationId,
          senderId: userId,
          content: "Connection accepted! You can now chat freely.",
          read: false,
          createdAt: now,
        });
      }
    }

    // Send email notification to the sender (if they want it)
    // Use match notification preference for accepted, invitation preference for declined
    const senderCheck = args.accept
      ? await shouldSendMatchEmail(ctx, invitation.fromUserId)
      : await shouldSendInvitationEmail(ctx, invitation.fromUserId);

    const responderProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (senderCheck.shouldSend && senderCheck.email && responderProfile) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: senderCheck.email,
        type: args.accept ? "invitationAccepted" : "invitationDeclined",
        senderName: responderProfile.firstName,
        date: invitation.date,
      });
    }
  },
});

// Cancel a sent invitation (withdraw request)
export const cancel = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const userId = await getOrCreateUser(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Only the sender can cancel
    if (invitation.fromUserId !== userId) {
      throw new Error("Not authorized to cancel this invitation");
    }

    // Can only cancel pending invitations
    if (invitation.status !== "pending") {
      throw new Error("Can only cancel pending invitations");
    }

    await ctx.db.delete(args.invitationId);
  },
});

// Get pending invitation count
export const getPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return 0;
    }

    const pending = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return pending.length;
  },
});

// Get all matches (accepted invitations) with FULL contact info revealed
export const getMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get accepted invitations where user is sender or receiver
    const sentMatches = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const receivedMatches = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Combine and enrich with FULL profile data (including hidden fields)
    const allMatches = [...sentMatches, ...receivedMatches];

    const enrichedMatches = await Promise.all(
      allMatches.map(async (inv) => {
        const otherUserId =
          inv.fromUserId === userId ? inv.toUserId : inv.fromUserId;
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", otherUserId))
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
      })
    );

    // Sort by match date (most recent first)
    return enrichedMatches.sort(
      (a, b) => (b.matchedAt ?? 0) - (a.matchedAt ?? 0)
    );
  },
});

// Check if users are matched (accepted invitation exists)
export const areMatched = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return false;
    }

    // Check both directions
    const sentAccepted = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("toUserId"), args.otherUserId),
          q.eq(q.field("status"), "accepted")
        )
      )
      .first();

    if (sentAccepted) {
      return true;
    }

    const receivedAccepted = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("fromUserId"), args.otherUserId),
          q.eq(q.field("status"), "accepted")
        )
      )
      .first();

    return !!receivedAccepted;
  },
});

// Get full connection status with another user
export const getConnectionStatus = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return { status: "not_authenticated" as const };
    }

    // Check invitations I sent to them
    const sentInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .filter((q) => q.eq(q.field("toUserId"), args.otherUserId))
      .first();

    // Check invitations they sent to me
    const receivedInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .filter((q) => q.eq(q.field("fromUserId"), args.otherUserId))
      .first();

    // Determine status
    if (
      sentInvitation?.status === "accepted" ||
      receivedInvitation?.status === "accepted"
    ) {
      return {
        status: "matched" as const,
        date: sentInvitation?.date || receivedInvitation?.date,
      };
    }

    if (sentInvitation?.status === "pending") {
      return { status: "pending_sent" as const, date: sentInvitation.date };
    }

    if (receivedInvitation?.status === "pending") {
      return {
        status: "pending_received" as const,
        date: receivedInvitation.date,
        invitationId: receivedInvitation._id,
      };
    }

    if (sentInvitation?.status === "declined") {
      return { status: "declined_by_them" as const };
    }

    if (receivedInvitation?.status === "declined") {
      return { status: "declined_by_me" as const };
    }

    return { status: "none" as const };
  },
});
