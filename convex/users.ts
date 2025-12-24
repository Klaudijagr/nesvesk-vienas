import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { extractClerkUserId, getCurrentUserId } from "./lib/auth";

/**
 * Upsert user from Clerk webhook (user.created / user.updated)
 */
export const upsertFromClerk = internalMutation({
  args: {
    data: v.object({
      id: v.string(),
      email_addresses: v.optional(
        v.array(
          v.object({
            email_address: v.string(),
            // Allow additional fields that Clerk might send
            id: v.optional(v.string()),
            linked_to: v.optional(
              v.array(
                v.object({
                  id: v.optional(v.string()),
                  type: v.optional(v.string()),
                })
              )
            ),
            verification: v.optional(
              v.union(
                v.object({
                  attempts: v.optional(v.union(v.number(), v.null())),
                  expire_at: v.optional(v.union(v.number(), v.null())),
                  object: v.optional(v.string()),
                  status: v.optional(v.string()),
                  strategy: v.optional(v.string()),
                }),
                v.null() // Allow null for verification field
              )
            ),
            // Add other potential fields as optional
            created_at: v.optional(v.union(v.number(), v.string())),
            updated_at: v.optional(v.union(v.number(), v.string())),
            object: v.optional(v.string()),
            matches_sso_connection: v.optional(v.boolean()),
            reserved: v.optional(v.boolean()),
          })
        )
      ),
      first_name: v.optional(v.union(v.string(), v.null())),
      last_name: v.optional(v.union(v.string(), v.null())),
      image_url: v.optional(v.string()),
    }),
  },
  async handler(ctx, { data }) {
    const clerkUserId = data.id;

    // Fast lookup by stable Clerk user id.
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    const email = data.email_addresses?.[0]?.email_address;
    const emailLower = email?.trim().toLowerCase() || undefined;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        // Keep existingUser.clerkId if it's already the full tokenIdentifier.
        // (We cannot derive it from webhook payload.)
        email,
        emailLower,
        name: name || existingUser.name,
        imageUrl: data.image_url,
      });
      console.log("Updated user from Clerk:", existingUser._id);
    } else {
      const userId = await ctx.db.insert("users", {
        clerkId: clerkUserId,
        clerkUserId,
        email,
        emailLower,
        name: name || undefined,
        imageUrl: data.image_url,
      });
      console.log("Created user from Clerk webhook:", userId);
    }
  },
});

/**
 * Delete user from Clerk webhook (user.deleted)
 * Cascades to delete all related data
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) {
      console.warn("No user found for Clerk ID:", clerkUserId);
      return;
    }

    const userId = user._id;
    console.log("Deleting user and all related data:", userId);

    // 1. Delete profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // 2. Delete conversations where user is guest or host
    const guestConversations = await ctx.db
      .query("conversations")
      .withIndex("by_guest", (q) => q.eq("guestId", userId))
      .collect();
    const hostConversations = await ctx.db
      .query("conversations")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();

    const allConversations = [...guestConversations, ...hostConversations];
    for (const conv of allConversations) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
        .collect();
      for (const msg of messages) {
        await ctx.db.delete(msg._id);
      }
      await ctx.db.delete(conv._id);
    }

    // 3. Delete invitations where user is sender or recipient
    const sentInvitations = await ctx.db
      .query("invitations")
      .withIndex("by_from", (q) => q.eq("fromUserId", userId))
      .collect();
    const receivedInvitations = await ctx.db
      .query("invitations")
      .withIndex("by_to", (q) => q.eq("toUserId", userId))
      .collect();

    for (const inv of [...sentInvitations, ...receivedInvitations]) {
      await ctx.db.delete(inv._id);
    }

    // 4. Finally, delete the user
    await ctx.db.delete(userId);
    console.log("User deleted successfully:", userId);
  },
});

/**
 * Get current authenticated user
 */
export const current = query({
  args: {},
  async handler(ctx) {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

/**
 * Internal query to get user by ID (for actions)
 */
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    return await ctx.db.get(userId);
  },
});

/**
 * Internal query to get user by Clerk token identifier.
 * Useful for actions (which can't use getCurrentUserId).
 */
export const getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

/**
 * Internal query to get user by stable Clerk user id.
 */
export const getUserByClerkUserId = internalQuery({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();
  },
});

export const listUsersForMigration = internalQuery({
  args: { paginationOpts: paginationOptsValidator },
  async handler(ctx, { paginationOpts }) {
    return await ctx.db.query("users").order("desc").paginate(paginationOpts);
  },
});

export const patchUserClerkLink = internalMutation({
  args: {
    userId: v.id("users"),
    clerkUserId: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),
  },
  async handler(ctx, { userId, clerkUserId, clerkId, email }) {
    await ctx.db.patch(userId, {
      clerkUserId,
      clerkId,
      ...(email !== undefined && {
        email,
        emailLower: email.trim().toLowerCase(),
      }),
    });
  },
});

/**
 * Delete a user from both Convex and Clerk (bi-directional delete)
 * Call this from the app to delete a user everywhere
 */
export const deleteUser = action({
  args: { userId: v.id("users") },
  async handler(
    ctx,
    { userId }
  ): Promise<{ success: boolean; error?: string }> {
    // Authorization: only allow a user to delete themselves.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { success: false, error: "Not authenticated" };
    }

    // Resolve the current Convex user from identity.
    const currentUserByToken = await ctx.runQuery(
      internal.users.getUserByClerkId,
      {
        clerkId: identity.tokenIdentifier,
      }
    );

    const clerkUserIdFromToken = extractClerkUserId(identity.tokenIdentifier);
    const currentUserByClerkUserId = await ctx.runQuery(
      internal.users.getUserByClerkUserId,
      { clerkUserId: clerkUserIdFromToken }
    );

    const currentUser = currentUserByToken ?? currentUserByClerkUserId;
    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    // Only allow deleting yourself.
    if (currentUser._id !== userId) {
      return { success: false, error: "Not authorized" };
    }

    const user = await ctx.runQuery(internal.users.getUserById, { userId });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const clerkUserId = user.clerkUserId;

    // If user has no clerkUserId (legacy user), just delete from Convex directly
    if (!clerkUserId) {
      await ctx.runMutation(internal.users.deleteFromClerk, {
        clerkUserId: user.clerkId, // Fall back to clerkId for cleanup
      });
      return { success: true };
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      return { success: false, error: "CLERK_SECRET_KEY not configured" };
    }

    try {
      const response = await fetch(
        `https://api.clerk.com/v1/users/${clerkUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${clerkSecretKey}`,
          },
        }
      );

      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        console.error("Clerk API error:", errorText);
        return { success: false, error: `Clerk API error: ${response.status}` };
      }

      // Always clean up Convex after Clerk deletion (works with or without webhooks)
      await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
