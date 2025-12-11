import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

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

// Check banned words in content
export const checkContent = query({
  args: { content: v.string() },
  handler: async (ctx, args) => {
    const bannedWords = await ctx.db.query("bannedWords").collect();

    const lowerContent = args.content.toLowerCase();

    for (const banned of bannedWords) {
      if (banned.isRegex) {
        try {
          const regex = new RegExp(banned.word, "i");
          if (regex.test(args.content)) {
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
  },
});

// Seed some basic banned words (call once)
export const seedBannedWords = mutation({
  args: {},
  handler: async (ctx) => {
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

    for (const word of words) {
      await ctx.db.insert("bannedWords", word);
    }

    return { message: "Seeded banned words", count: words.length };
  },
});
