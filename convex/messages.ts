import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

// Helper to check if messaging is blocked between users
async function isMessagingBlocked(
  ctx: MutationCtx,
  userId: Id<"users">,
  otherId: Id<"users">
): Promise<boolean> {
  const blockedByMe = await ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
    .filter((q) => q.eq(q.field("blockedId"), otherId))
    .first();

  const blockedMe = await ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", otherId))
    .filter((q) => q.eq(q.field("blockedId"), userId))
    .first();

  return !!(blockedByMe || blockedMe);
}

// Helper to validate conversation status for messaging
function canSendMessageInConversation(
  conversation: Doc<"conversations">,
  userId: Id<"users">
): { allowed: boolean; error?: string } {
  const isDeclined = conversation.status === "declined";
  const isRequested = conversation.status === "requested";
  const isHost = conversation.hostId === userId;

  if (isDeclined) {
    return { allowed: false, error: "This conversation has been declined" };
  }
  // For requested status, only host can respond (but should use accept/decline)
  if (isRequested && !isHost) {
    return { allowed: true }; // Guest can't send but won't throw
  }
  return { allowed: true };
}

// Helper to get user email and check notification preferences
async function shouldSendMessageEmail(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<{ shouldSend: boolean; email: string | null; firstName: string }> {
  const user = await ctx.db.get(userId);
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  // Check if user wants message notifications (default true)
  const wantsNotifications =
    profile?.emailNotifications !== false && profile?.notifyOnMessage !== false;

  return {
    shouldSend: wantsNotifications && !!user?.email,
    email: user?.email || null,
    firstName: profile?.firstName || "Someone",
  };
}

// Get messages for a specific conversation
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify user is part of this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return [];
    }
    if (conversation.guestId !== userId && conversation.hostId !== userId) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Get all conversations for current user
export const getMyConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get users I've blocked
    const myBlocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", userId))
      .collect();
    const blockedByMeIds = new Set(myBlocks.map((b) => b.blockedId));

    // Get users who blocked me
    const blockedMe = await ctx.db
      .query("blocks")
      .withIndex("by_blocked", (q) => q.eq("blockedId", userId))
      .collect();
    const blockedMeIds = new Set(blockedMe.map((b) => b.blockerId));

    // Get conversations where user is guest (exclude archived)
    const asGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .filter((q) => q.neq(q.field("isArchivedByGuest"), true))
      .collect();

    // Get conversations where user is host (exclude archived)
    const asHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.neq(q.field("isArchivedByHost"), true))
      .collect();

    const allConversations = [...asGuest, ...asHost];

    // Build conversation summaries with profiles (filtering out blocked users)
    const summaries = await Promise.all(
      allConversations.map(async (conv) => {
        // Get the other person's ID
        const otherId = conv.guestId === userId ? conv.hostId : conv.guestId;
        const isHost = conv.hostId === userId;

        // Skip if blocked (either direction)
        if (blockedByMeIds.has(otherId) || blockedMeIds.has(otherId)) {
          return null;
        }

        // Get their profile
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", otherId))
          .first();

        // Get last message - use order + first instead of collecting all
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .order("desc")
          .first();

        // Use denormalized unread count (O(1) instead of querying messages)
        const unreadCount = isHost
          ? (conv.unreadCountForHost ?? 0)
          : (conv.unreadCountForGuest ?? 0);

        return {
          conversation: conv,
          otherUserId: otherId,
          oderId: otherId, // Alias for frontend compatibility
          profile,
          lastMessage,
          unreadCount,
          isHost, // Whether current user is the host in this conversation
        };
      })
    );

    // Filter out nulls (blocked conversations) and sort by last message time
    return summaries
      .filter((s) => s !== null)
      .sort(
        (a, b) =>
          (b.conversation.lastMessageAt ?? b.conversation.createdAt) -
          (a.conversation.lastMessageAt ?? a.conversation.createdAt)
      );
  },
});

// Helper to check banned words
async function checkBannedWords(
  ctx: {
    db: {
      query: (table: "bannedWords") => {
        collect: () => Promise<
          Array<{ word: string; category: string; isRegex?: boolean }>
        >;
      };
    };
  },
  content: string
): Promise<{ flagged: boolean; category?: string }> {
  const bannedWords = await ctx.db.query("bannedWords").collect();
  const lowerContent = content.toLowerCase();

  for (const banned of bannedWords) {
    if (banned.isRegex) {
      try {
        const regex = new RegExp(banned.word, "i");
        if (regex.test(content)) {
          return { flagged: true, category: banned.category };
        }
      } catch {
        // Invalid regex, skip
      }
    } else if (lowerContent.includes(banned.word.toLowerCase())) {
      return { flagged: true, category: banned.category };
    }
  }
  return { flagged: false };
}

// Send a message in a conversation
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify user is part of this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const isParticipant =
      conversation.guestId === userId || conversation.hostId === userId;
    if (!isParticipant) {
      throw new Error("Not authorized");
    }

    // Get the other user in the conversation
    const otherId =
      conversation.guestId === userId
        ? conversation.hostId
        : conversation.guestId;

    // Check blocking status
    const blocked = await isMessagingBlocked(ctx, userId, otherId);
    if (blocked) {
      throw new Error("Cannot send messages in this conversation");
    }

    // Check conversation status
    const statusCheck = canSendMessageInConversation(conversation, userId);
    if (!statusCheck.allowed && statusCheck.error) {
      throw new Error(statusCheck.error);
    }

    // Check for banned words
    const moderationCheck = await checkBannedWords(ctx, args.content);

    const now = Date.now();

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: userId,
      content: args.content,
      read: false,
      createdAt: now,
      moderationStatus: moderationCheck.flagged ? "flagged" : "clean",
      moderationReason: moderationCheck.category,
    });

    // Update conversation's lastMessageAt and increment recipient's unread count
    const isHost = conversation.hostId === userId;
    const currentUnread = isHost
      ? (conversation.unreadCountForGuest ?? 0)
      : (conversation.unreadCountForHost ?? 0);

    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
      ...(isHost
        ? { unreadCountForGuest: currentUnread + 1 }
        : { unreadCountForHost: currentUnread + 1 }),
    });

    // Send email notification to the recipient
    const senderProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const recipientCheck = await shouldSendMessageEmail(ctx, otherId);
    if (recipientCheck.shouldSend && recipientCheck.email && senderProfile) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: recipientCheck.email,
        type: "newMessage" as const,
        senderName: senderProfile.firstName,
      });
    }

    return messageId;
  },
});

// Mark messages as read in a conversation
export const markAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return;
    }

    // Get conversation to determine role
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      return;
    }

    // Get unread messages from the other person
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(q.neq(q.field("senderId"), userId), q.eq(q.field("read"), false))
      )
      .collect();

    // Mark messages as read
    await Promise.all(messages.map((m) => ctx.db.patch(m._id, { read: true })));

    // Reset the user's unread count to 0
    const isHost = conversation.hostId === userId;
    await ctx.db.patch(args.conversationId, {
      ...(isHost ? { unreadCountForHost: 0 } : { unreadCountForGuest: 0 }),
    });
  },
});

// Get total unread count for current user
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return 0;
    }

    // Get all conversations for user in parallel
    const [asGuest, asHost] = await Promise.all([
      ctx.db
        .query("conversations")
        .withIndex("by_guest", (q) => q.eq("guestId", userId))
        .collect(),
      ctx.db
        .query("conversations")
        .withIndex("by_host", (q) => q.eq("hostId", userId))
        .collect(),
    ]);

    // Sum denormalized unread counts directly (O(1) per conversation, no message queries)
    let totalUnread = 0;
    for (const conv of asGuest) {
      totalUnread += conv.unreadCountForGuest ?? 0;
    }
    for (const conv of asHost) {
      totalUnread += conv.unreadCountForHost ?? 0;
    }

    return totalUnread;
  },
});

// Request to connect with a host (creates a new conversation)
export const requestToJoin = mutation({
  args: {
    hostId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Prevent self-connection
    if (userId === args.hostId) {
      throw new Error("Cannot request to join yourself");
    }

    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .filter((q) => q.eq(q.field("hostId"), args.hostId))
      .first();

    if (existing) {
      return existing._id; // Return existing conversation
    }

    const now = Date.now();

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      guestId: userId,
      hostId: args.hostId,
      status: "requested",
      createdAt: now,
      lastMessageAt: now,
      requestMessage: args.message,
    });

    // Add the initial message
    await ctx.db.insert("messages", {
      conversationId,
      senderId: userId,
      content: args.message,
      read: false,
      createdAt: now,
    });

    return conversationId;
  },
});

// Accept a request (host accepts guest)
export const acceptRequest = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if (conversation.hostId !== userId) {
      throw new Error("Only host can accept");
    }
    if (conversation.status !== "requested") {
      throw new Error("Request already processed");
    }

    await ctx.db.patch(args.conversationId, { status: "accepted" });

    // Add system message
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: userId,
      content: "Request accepted! You can now chat freely.",
      read: false,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Decline a request
export const declineRequest = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    if (conversation.hostId !== userId) {
      throw new Error("Only host can decline");
    }

    await ctx.db.patch(args.conversationId, { status: "declined" });

    return { success: true };
  },
});

// Get pending requests for host
export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    const pending = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.eq(q.field("status"), "requested"))
      .collect();

    // Get profiles for each requester
    return Promise.all(
      pending.map(async (conv) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", conv.guestId))
          .first();

        return {
          conversation: conv,
          guestProfile: profile,
        };
      })
    );
  },
});

// Archive a conversation
export const archiveConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Check user is part of conversation
    const isGuest = conversation.guestId === userId;
    const isHost = conversation.hostId === userId;
    if (!(isGuest || isHost)) {
      throw new Error("Not authorized");
    }

    const now = Date.now();
    if (isGuest) {
      await ctx.db.patch(args.conversationId, {
        isArchivedByGuest: true,
        archivedByGuestAt: now,
      });
    } else {
      await ctx.db.patch(args.conversationId, {
        isArchivedByHost: true,
        archivedByHostAt: now,
      });
    }

    return { success: true };
  },
});

// Unarchive a conversation
export const unarchiveConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Check user is part of conversation
    const isGuest = conversation.guestId === userId;
    const isHost = conversation.hostId === userId;
    if (!(isGuest || isHost)) {
      throw new Error("Not authorized");
    }

    if (isGuest) {
      await ctx.db.patch(args.conversationId, {
        isArchivedByGuest: false,
        archivedByGuestAt: undefined,
      });
    } else {
      await ctx.db.patch(args.conversationId, {
        isArchivedByHost: false,
        archivedByHostAt: undefined,
      });
    }

    return { success: true };
  },
});

// Get archived conversations for current user
export const getArchivedConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get conversations where user is guest and archived
    const asGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .filter((q) => q.eq(q.field("isArchivedByGuest"), true))
      .collect();

    // Get conversations where user is host and archived
    const asHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.eq(q.field("isArchivedByHost"), true))
      .collect();

    const allArchived = [...asGuest, ...asHost];

    // Build summaries with profiles
    const summaries = await Promise.all(
      allArchived.map(async (conv) => {
        const isGuest = conv.guestId === userId;
        const otherId = isGuest ? conv.hostId : conv.guestId;
        const archivedAt = isGuest
          ? conv.archivedByGuestAt
          : conv.archivedByHostAt;

        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", otherId))
          .first();

        // Get last message
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();

        const lastMessage = messages.sort(
          (a, b) => b.createdAt - a.createdAt
        )[0];

        return {
          type: "archived" as const,
          oderId: otherId,
          conversationId: conv._id,
          profile: profile
            ? {
                firstName: profile.firstName,
                photoUrl: profile.photoUrl,
                city: profile.city,
              }
            : null,
          lastMessage,
          archivedAt: archivedAt ?? conv.lastMessageAt ?? conv.createdAt,
        };
      })
    );

    // Sort by archived date (most recent first)
    return summaries.sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0));
  },
});

// Aliases for backwards compatibility with frontend
export const getConversations = getMyConversations;

// Legacy function - frontend calls getConversation with otherUserId
// This bridges to the new conversation-based system
export const getConversation = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    // Find conversation with this user
    const asGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .filter((q) => q.eq(q.field("hostId"), args.otherUserId))
      .first();

    const asHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .filter((q) => q.eq(q.field("guestId"), args.otherUserId))
      .first();

    const conversation = asGuest ?? asHost;
    if (!conversation) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .collect();

    return messages.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Internal: Backfill unread counts for existing conversations
// Run once after deploying the schema change to populate counts for old conversations
// Use internalMutation so it can be run from Convex dashboard without auth
export const backfillUnreadCounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const conversations = await ctx.db.query("conversations").collect();
    let updated = 0;

    for (const conv of conversations) {
      // Count unread messages for guest (messages from host that are unread)
      const unreadForGuest = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("senderId"), conv.hostId),
            q.eq(q.field("read"), false)
          )
        )
        .collect();

      // Count unread messages for host (messages from guest that are unread)
      const unreadForHost = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("senderId"), conv.guestId),
            q.eq(q.field("read"), false)
          )
        )
        .collect();

      await ctx.db.patch(conv._id, {
        unreadCountForGuest: unreadForGuest.length,
        unreadCountForHost: unreadForHost.length,
      });
      updated++;
    }

    return {
      updated,
      message: `Backfilled unread counts for ${updated} conversations`,
    };
  },
});
