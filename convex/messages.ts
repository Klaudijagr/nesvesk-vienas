import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

// Holiday date type for reuse
const holidayDate = v.union(
  v.literal("24 Dec"),
  v.literal("25 Dec"),
  v.literal("26 Dec"),
  v.literal("31 Dec")
);

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

    // Get conversations where user is guest
    const asGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .collect();

    // Get conversations where user is host
    const asHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();

    const allConversations = [...asGuest, ...asHost];

    // Build conversation summaries with profiles
    const summaries = await Promise.all(
      allConversations.map(async (conv) => {
        // Get the other person's ID
        const otherId = conv.guestId === userId ? conv.hostId : conv.guestId;
        const isHost = conv.hostId === userId;

        // Get their profile
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

        // Count unread (messages from other person that aren't read)
        const unreadCount = messages.filter(
          (m) => m.senderId === otherId && !m.read
        ).length;

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

    // Sort by last message time (most recent first)
    return summaries.sort(
      (a, b) =>
        (b.conversation.lastMessageAt ?? b.conversation.createdAt) -
        (a.conversation.lastMessageAt ?? a.conversation.createdAt)
    );
  },
});

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
    if (conversation.guestId !== userId && conversation.hostId !== userId) {
      throw new Error("Not authorized");
    }

    // Check conversation status - only allow messaging if accepted or higher
    if (
      conversation.status === "requested" ||
      conversation.status === "declined"
    ) {
      // Only host can respond to requests
      if (
        conversation.status === "requested" &&
        conversation.hostId === userId
      ) {
        // Host responding - this is okay, but should use accept/decline
      } else if (conversation.status === "declined") {
        throw new Error("This conversation has been declined");
      }
    }

    const now = Date.now();

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: userId,
      content: args.content,
      read: false,
      type: "message",
      createdAt: now,
    });

    // Update conversation's lastMessageAt
    await ctx.db.patch(args.conversationId, { lastMessageAt: now });

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

    await Promise.all(messages.map((m) => ctx.db.patch(m._id, { read: true })));
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

    // Get all conversations for user
    const asGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .collect();

    const asHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();

    const allConversationIds = [...asGuest, ...asHost].map((c) => c._id);

    let totalUnread = 0;

    for (const convId of allConversationIds) {
      const unreadMessages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", convId))
        .filter((q) =>
          q.and(
            q.neq(q.field("senderId"), userId),
            q.eq(q.field("read"), false)
          )
        )
        .collect();

      totalUnread += unreadMessages.length;
    }

    return totalUnread;
  },
});

// Request to join a host's event (creates a new conversation)
export const requestToJoin = mutation({
  args: {
    hostId: v.id("users"),
    eventDate: holidayDate,
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("hostId"), args.hostId),
          q.eq(q.field("eventDate"), args.eventDate)
        )
      )
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
      eventDate: args.eventDate,
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
      type: "message",
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
      type: "system",
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

// Send an invitation card (host sends event details)
export const sendInvitationCard = mutation({
  args: {
    conversationId: v.id("conversations"),
    date: holidayDate,
    time: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    note: v.optional(v.string()),
    whatToBring: v.optional(v.string()),
  },
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
      throw new Error("Only host can send invitation cards");
    }
    if (conversation.status !== "accepted") {
      throw new Error("Must accept request before sending invitation");
    }

    const now = Date.now();

    // Update conversation status to "invited"
    await ctx.db.patch(args.conversationId, {
      status: "invited",
      lastMessageAt: now,
    });

    // Create invitation card message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: userId,
      content: "📋 Invitation sent!",
      read: false,
      type: "invitation_card",
      eventCard: {
        date: args.date,
        time: args.time,
        address: args.address,
        phone: args.phone,
        note: args.note,
        whatToBring: args.whatToBring,
      },
      createdAt: now,
    });

    return messageId;
  },
});

// Confirm invitation (guest accepts the event invitation)
export const confirmInvitation = mutation({
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
    if (conversation.guestId !== userId) {
      throw new Error("Only guest can confirm invitation");
    }
    if (conversation.status !== "invited") {
      throw new Error("No pending invitation to confirm");
    }

    const now = Date.now();

    // Update conversation status
    await ctx.db.patch(args.conversationId, {
      status: "confirmed",
      lastMessageAt: now,
    });

    // Get the last invitation card to create an event
    const invitationMessage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("type"), "invitation_card"))
      .order("desc")
      .first();

    // Create an event
    if (invitationMessage?.eventCard) {
      await ctx.db.insert("events", {
        hostId: conversation.hostId,
        conversationId: args.conversationId,
        eventDate: conversation.eventDate,
        time: invitationMessage.eventCard.time,
        address: invitationMessage.eventCard.address,
        notes: invitationMessage.eventCard.note,
        guestIds: [userId],
        status: "upcoming",
        createdAt: now,
      });
    }

    // Add system message
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: userId,
      content: "🎉 Invitation confirmed! See you there!",
      read: false,
      type: "system",
      createdAt: now,
    });

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
