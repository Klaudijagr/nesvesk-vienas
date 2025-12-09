import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

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
    const clerkId = data.id;

    // Find existing user by clerkId (partial match since tokenIdentifier includes issuer)
    const existingUsers = await ctx.db.query("users").collect();
    const existingUser = existingUsers.find((u) => u.clerkId.includes(clerkId));

    const email = data.email_addresses?.[0]?.email_address;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email,
        name: name || existingUser.name,
        imageUrl: data.image_url,
      });
      console.log("Updated user from Clerk:", existingUser._id);
    } else {
      const userId = await ctx.db.insert("users", {
        clerkId,
        email,
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
    // Find user by Clerk ID (partial match for tokenIdentifier format)
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find((u) => u.clerkId.includes(clerkUserId));

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
 * Delete a user from both Convex and Clerk (bi-directional delete)
 * Call this from the app to delete a user everywhere
 */
export const deleteUser = action({
  args: { userId: v.id("users") },
  async handler(
    ctx,
    { userId }
  ): Promise<{ success: boolean; error?: string }> {
    const user = await ctx.runQuery(internal.users.getUserById, { userId });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Extract Clerk user ID from tokenIdentifier (format: "issuer|user_id")
    const clerkUserId = user.clerkId.includes("|")
      ? user.clerkId.split("|")[1]
      : user.clerkId;

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

      // If user not in Clerk (404), still clean up Convex
      if (response.status === 404) {
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
      }
      // Otherwise, Clerk webhook will handle Convex cleanup

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
