import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { assertAdmin } from "./lib/admin";
import { getCurrentUserId } from "./lib/auth";
import { mapSequential } from "./lib/helpers";

// Block a user
export const blockUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    if (currentUserId === args.userId) {
      throw new Error("Cannot block yourself");
    }

    // Check if already blocked
    const existing = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .filter((q) => q.eq(q.field("blockedId"), args.userId))
      .first();

    if (existing) {
      return { alreadyBlocked: true };
    }

    await ctx.db.insert("blocks", {
      blockerId: currentUserId,
      blockedId: args.userId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Unblock a user
export const unblockUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const block = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .filter((q) => q.eq(q.field("blockedId"), args.userId))
      .first();

    if (block) {
      await ctx.db.delete(block._id);
    }

    return { success: true };
  },
});

// Check if a user is blocked
export const isBlocked = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      return { blockedByMe: false, blockedMe: false };
    }

    // Check if I blocked them
    const blockedByMe = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .filter((q) => q.eq(q.field("blockedId"), args.userId))
      .first();

    // Check if they blocked me
    const blockedMe = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", args.userId))
      .filter((q) => q.eq(q.field("blockedId"), currentUserId))
      .first();

    return {
      blockedByMe: !!blockedByMe,
      blockedMe: !!blockedMe,
    };
  },
});

// Get list of blocked users
export const getBlockedUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      return [];
    }

    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .collect();

    const blockedUsers = await Promise.all(
      blocks.map(async (block) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", block.blockedId))
          .first();

        return {
          blockId: block._id,
          userId: block.blockedId,
          blockedAt: block.createdAt,
          profile: profile
            ? {
                firstName: profile.firstName,
                photoUrl: profile.photoUrl,
                city: profile.city,
              }
            : null,
        };
      })
    );

    return blockedUsers;
  },
});

// Report a user - also auto-blocks them
export const reportUser = mutation({
  args: {
    userId: v.id("users"),
    reason: v.union(
      v.literal("spam"),
      v.literal("harassment"),
      v.literal("inappropriate"),
      v.literal("fake_profile"),
      v.literal("other")
    ),
    details: v.optional(v.string()),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    if (currentUserId === args.userId) {
      throw new Error("Cannot report yourself");
    }

    // Check for existing pending report
    const existing = await ctx.db
      .query("reports")
      .withIndex("by_reporter", (q) => q.eq("reporterId", currentUserId))
      .filter((q) =>
        q.and(
          q.eq(q.field("reportedUserId"), args.userId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existing) {
      throw new Error("You already have a pending report for this user");
    }

    // Create the report
    await ctx.db.insert("reports", {
      reporterId: currentUserId,
      reportedUserId: args.userId,
      conversationId: args.conversationId,
      reason: args.reason,
      details: args.details,
      status: "pending",
      createdAt: Date.now(),
    });

    // Auto-block the reported user (if not already blocked)
    const existingBlock = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .filter((q) => q.eq(q.field("blockedId"), args.userId))
      .first();

    if (!existingBlock) {
      await ctx.db.insert("blocks", {
        blockerId: currentUserId,
        blockedId: args.userId,
        createdAt: Date.now(),
      });
    }

    return { success: true, autoBlocked: !existingBlock };
  },
});

// Get combined archived conversations and blocked users for archive view
export const getArchivedAndBlocked = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) {
      return [];
    }

    // Get archived conversations where user is guest
    const archivedAsGuest = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", currentUserId))
      .filter((q) => q.eq(q.field("isArchivedByGuest"), true))
      .collect();

    // Get archived conversations where user is host
    const archivedAsHost = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", currentUserId))
      .filter((q) => q.eq(q.field("isArchivedByHost"), true))
      .collect();

    // Get blocked users
    const blocks = await ctx.db
      .query("blocks")
      .withIndex("by_blocker", (q) => q.eq("blockerId", currentUserId))
      .collect();

    // Build archived conversation items
    const archivedItems = await Promise.all(
      [...archivedAsGuest, ...archivedAsHost].map(async (conv) => {
        const isGuest = conv.guestId === currentUserId;
        const otherId = isGuest ? conv.hostId : conv.guestId;
        const archivedAt = isGuest
          ? conv.archivedByGuestAt
          : conv.archivedByHostAt;

        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", otherId))
          .first();

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
          sortDate: archivedAt ?? conv.lastMessageAt ?? conv.createdAt,
        };
      })
    );

    // Build blocked user items
    const blockedItems = await Promise.all(
      blocks.map(async (block) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", block.blockedId))
          .first();

        return {
          type: "blocked" as const,
          oderId: block.blockedId,
          blockId: block._id,
          profile: profile
            ? {
                firstName: profile.firstName,
                photoUrl: profile.photoUrl,
                city: profile.city,
              }
            : null,
          sortDate: block.createdAt,
        };
      })
    );

    // Combine and sort by date (most recent first)
    const allItems = [...archivedItems, ...blockedItems];
    return allItems.toSorted((a, b) => (b.sortDate ?? 0) - (a.sortDate ?? 0));
  },
});

// Check banned words in content
export const checkContent = query({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const bannedWords = await ctx.db.query("bannedWords").collect();

    const lowerContent = args.content.toLowerCase();

    for (const banned of bannedWords) {
      if (banned.isRegex === true) {
        try {
          const regex = new RegExp(banned.word, "iu");
          if (regex.test(args.content)) {
            return { flagged: true, category: banned.category };
          }
        } catch (error) {
          console.error(
            "Skipping invalid banned-word pattern",
            banned.word,
            error
          );
        }
      } else if (lowerContent.includes(banned.word.toLowerCase())) {
        return { flagged: true, category: banned.category };
      }
    }

    return { flagged: false };
  },
});

// Seed some basic banned words (call once)
export const seedBannedWords = mutation({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);

    const existing = await ctx.db.query("bannedWords").first();
    if (existing) {
      return { message: "Already seeded" };
    }

    const words = [
      // Contact info patterns (to prevent sharing too early)
      {
        word: "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",
        category: "contact_info",
        isRegex: true,
      },
      // Common spam patterns
      { word: "click here", category: "spam", isRegex: false },
      { word: "free money", category: "spam", isRegex: false },
      { word: "wire transfer", category: "spam", isRegex: false },
      // Harassment indicators
      { word: "kill yourself", category: "harassment", isRegex: false },
      { word: "kys", category: "harassment", isRegex: false },
    ];

    await mapSequential(words, async (word) => {
      await ctx.db.insert("bannedWords", word);
    });

    return { message: "Seeded banned words", count: words.length };
  },
});
