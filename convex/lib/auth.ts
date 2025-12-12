import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

function normalizeEmail(email: string | null | undefined): string | undefined {
  const trimmed = email?.trim();
  if (!trimmed) {
    return;
  }
  return trimmed.toLowerCase();
}

async function patchUserFromIdentity(args: {
  ctx: MutationCtx;
  userId: Id<"users">;
  clerkUserId: string;
  tokenIdentifier: string;
  email: string | null | undefined;
  name: string | null | undefined;
  pictureUrl: string | null | undefined;
}) {
  const emailLower = normalizeEmail(args.email);
  await args.ctx.db.patch(args.userId, {
    clerkId: args.tokenIdentifier,
    clerkUserId: args.clerkUserId,
    email: args.email ?? undefined,
    emailLower,
    name: args.name ?? undefined,
    imageUrl: args.pictureUrl ?? undefined,
  });
}

async function moveUserReferences(args: {
  ctx: MutationCtx;
  fromUserId: Id<"users">;
  toUserId: Id<"users">;
}) {
  // Profile: keep existing profile if present; otherwise move.
  const keepProfile = await args.ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", args.toUserId))
    .unique();
  const removeProfile = await args.ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", args.fromUserId))
    .unique();

  if (!keepProfile && removeProfile) {
    await args.ctx.db.patch(removeProfile._id, { userId: args.toUserId });
  } else if (keepProfile && removeProfile) {
    // Avoid two profiles for one user; keep the "toUserId" one.
    await args.ctx.db.delete(removeProfile._id);
  }

  const guestConversations = await args.ctx.db
    .query("conversations")
    .withIndex("by_guest", (q) => q.eq("guestId", args.fromUserId))
    .collect();
  for (const conv of guestConversations) {
    await args.ctx.db.patch(conv._id, { guestId: args.toUserId });
  }

  const hostConversations = await args.ctx.db
    .query("conversations")
    .withIndex("by_host", (q) => q.eq("hostId", args.fromUserId))
    .collect();
  for (const conv of hostConversations) {
    await args.ctx.db.patch(conv._id, { hostId: args.toUserId });
  }

  const sentMessages = await args.ctx.db
    .query("messages")
    .withIndex("by_sender", (q) => q.eq("senderId", args.fromUserId))
    .collect();
  for (const msg of sentMessages) {
    await args.ctx.db.patch(msg._id, { senderId: args.toUserId });
  }

  const sentInvitations = await args.ctx.db
    .query("invitations")
    .withIndex("by_from", (q) => q.eq("fromUserId", args.fromUserId))
    .collect();
  for (const inv of sentInvitations) {
    await args.ctx.db.patch(inv._id, { fromUserId: args.toUserId });
  }

  const receivedInvitations = await args.ctx.db
    .query("invitations")
    .withIndex("by_to", (q) => q.eq("toUserId", args.fromUserId))
    .collect();
  for (const inv of receivedInvitations) {
    await args.ctx.db.patch(inv._id, { toUserId: args.toUserId });
  }

  const blocksByBlocker = await args.ctx.db
    .query("blocks")
    .withIndex("by_blocker", (q) => q.eq("blockerId", args.fromUserId))
    .collect();
  for (const block of blocksByBlocker) {
    await args.ctx.db.patch(block._id, { blockerId: args.toUserId });
  }

  const blocksByBlocked = await args.ctx.db
    .query("blocks")
    .withIndex("by_blocked", (q) => q.eq("blockedId", args.fromUserId))
    .collect();
  for (const block of blocksByBlocked) {
    await args.ctx.db.patch(block._id, { blockedId: args.toUserId });
  }

  const reportsByReporter = await args.ctx.db
    .query("reports")
    .withIndex("by_reporter", (q) => q.eq("reporterId", args.fromUserId))
    .collect();
  for (const report of reportsByReporter) {
    await args.ctx.db.patch(report._id, { reporterId: args.toUserId });
  }

  const reportsByReported = await args.ctx.db
    .query("reports")
    .withIndex("by_reported", (q) => q.eq("reportedUserId", args.fromUserId))
    .collect();
  for (const report of reportsByReported) {
    await args.ctx.db.patch(report._id, { reportedUserId: args.toUserId });
  }

  const consents = await args.ctx.db
    .query("userConsents")
    .withIndex("by_userId", (q) => q.eq("userId", args.fromUserId))
    .collect();
  for (const consent of consents) {
    await args.ctx.db.patch(consent._id, { userId: args.toUserId });
  }
}

async function prefersUserWithProfile(args: {
  ctx: MutationCtx;
  a: Id<"users">;
  b: Id<"users">;
}): Promise<Id<"users">> {
  const profileA = await args.ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", args.a))
    .unique();
  const profileB = await args.ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", args.b))
    .unique();

  if (profileA && !profileB) {
    return args.a;
  }
  if (!profileA && profileB) {
    return args.b;
  }
  return args.a;
}

/**
 * Extract the Clerk user id from a token identifier.
 * Token identifiers are typically "issuer|userId".
 * Falls back to the whole string if it doesn't match the expected format.
 */
export function extractClerkUserId(tokenIdentifier: string): string {
  const parts = tokenIdentifier.split("|");
  const last = parts.at(-1);
  return parts.length > 1 && last ? last : tokenIdentifier;
}

/**
 * Get the current user's ID from the Clerk auth context.
 * Creates a user record if one doesn't exist for this Clerk user.
 */
export async function getCurrentUserId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  // Prefer exact lookup by full token identifier.
  const userByToken = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
    .unique();

  if (userByToken) {
    return userByToken._id;
  }

  // Fallback: lookup by stable Clerk user id (used by webhooks).
  const clerkUserId = extractClerkUserId(identity.tokenIdentifier);
  const userByClerkUserId = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();

  if (userByClerkUserId) {
    return userByClerkUserId._id;
  }

  return null;
}

/**
 * Get or create a user from the Clerk identity.
 * Use this in mutations where you need to ensure the user exists.
 */
export async function getOrCreateUser(
  ctx: MutationCtx
): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const clerkUserId = extractClerkUserId(identity.tokenIdentifier);
  const emailLower = normalizeEmail(identity.email);

  // Look up existing user
  const existingByToken = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.tokenIdentifier))
    .unique();

  if (existingByToken) {
    return existingByToken._id;
  }

  // Fallback: user created by webhook sync (or by other flows) using the stable Clerk user id.
  const existingByClerkUserId = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .unique();

  // If we have an email, try to find an existing Convex user record by emailLower.
  // This is critical for migrations where the Clerk issuer/user id changed but we
  // want to keep the existing Convex user _id (so profiles/messages remain linked).
  const existingByEmailLower = emailLower
    ? await ctx.db
        .query("users")
        .withIndex("by_emailLower", (q) => q.eq("emailLower", emailLower))
        .unique()
    : null;

  // If both exist but are different records, merge them.
  if (
    existingByClerkUserId &&
    existingByEmailLower &&
    existingByClerkUserId._id !== existingByEmailLower._id
  ) {
    // Prefer keeping the record that already owns a profile (i.e. has most data).
    const keepId = await prefersUserWithProfile({
      ctx,
      a: existingByEmailLower._id,
      b: existingByClerkUserId._id,
    });
    const removeId =
      keepId === existingByEmailLower._id
        ? existingByClerkUserId._id
        : existingByEmailLower._id;

    await patchUserFromIdentity({
      ctx,
      userId: keepId,
      clerkUserId,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
    });
    await moveUserReferences({ ctx, fromUserId: removeId, toUserId: keepId });
    await ctx.db.delete(removeId);
    return keepId;
  }

  if (existingByEmailLower) {
    // Re-link the existing Convex user record to the current Clerk identity.
    await patchUserFromIdentity({
      ctx,
      userId: existingByEmailLower._id,
      clerkUserId,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
    });
    return existingByEmailLower._id;
  }

  if (existingByClerkUserId) {
    // Normalize the record to store the full token identifier.
    await patchUserFromIdentity({
      ctx,
      userId: existingByClerkUserId._id,
      clerkUserId,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
    });
    return existingByClerkUserId._id;
  }

  // Create new user from Clerk identity
  const userId = await ctx.db.insert("users", {
    clerkId: identity.tokenIdentifier,
    clerkUserId,
    email: identity.email,
    emailLower,
    name: identity.name,
    imageUrl: identity.pictureUrl,
  });

  return userId;
}
