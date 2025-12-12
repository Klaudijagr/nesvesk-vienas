import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";
import { action } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

async function clerkGetFirstUserIdByEmail(args: {
  clerkSecretKey: string;
  email: string;
}): Promise<string | undefined> {
  const lookup = await fetch(
    `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(
      args.email
    )}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${args.clerkSecretKey}` },
    }
  );

  if (!lookup.ok) {
    const text = await lookup.text();
    throw new Error(`Clerk lookup failed (${lookup.status}): ${text}`);
  }

  const matches = (await lookup.json()) as Array<{ id: string }>;
  return matches?.[0]?.id;
}

async function clerkCreateUserFromEmail(args: {
  clerkSecretKey: string;
  email: string;
  externalId: string;
  name?: string;
}): Promise<string> {
  const create = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.clerkSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: [args.email],
      external_id: args.externalId,
      first_name: args.name?.split(" ").at(0) || undefined,
      last_name: args.name?.split(" ").slice(1).join(" ") || undefined,
    }),
  });

  if (!create.ok) {
    const text = await create.text();
    throw new Error(`Clerk create failed (${create.status}): ${text}`);
  }

  const createdUser = (await create.json()) as { id: string };
  return createdUser.id;
}

type RelinkResult =
  | { status: "skipped_no_email" }
  | { status: "skipped_no_clerk_match" }
  | { status: "relinked"; created: boolean };

type RelinkSummary = {
  relinked: number;
  created: number;
  skippedNoEmail: number;
  skippedNoClerkMatch: number;
  errors: Array<{ userId: string; email?: string; error: string }>;
  isDone: boolean;
  continueCursor: string | null;
};

async function relinkOneUserByEmail(args: {
  ctx: ActionCtx;
  user: { _id: Id<"users">; email?: string; name?: string };
  clerkSecretKey: string;
  issuer: string;
  createMissing?: boolean;
  dryRun?: boolean;
}): Promise<RelinkResult> {
  const email = args.user.email?.trim();
  if (!email) {
    return { status: "skipped_no_email" };
  }

  let clerkUserId = await clerkGetFirstUserIdByEmail({
    clerkSecretKey: args.clerkSecretKey,
    email,
  });

  let created = false;
  if (!clerkUserId && args.createMissing) {
    clerkUserId = await clerkCreateUserFromEmail({
      clerkSecretKey: args.clerkSecretKey,
      email,
      externalId: args.user._id,
      name: args.user.name,
    });
    created = true;
  }

  if (!clerkUserId) {
    return { status: "skipped_no_clerk_match" };
  }

  if (!args.dryRun) {
    const clerkId = `${args.issuer}|${clerkUserId}`;
    await args.ctx.runMutation(internal.users.patchUserClerkLink, {
      userId: args.user._id,
      clerkUserId,
      clerkId,
      email,
    });
  }

  return { status: "relinked", created };
}

/**
 * Admin tool: Relink existing Convex users to the current Clerk instance by email.
 *
 * Use this after switching Clerk instances / issuer domains, to preserve the existing
 * Convex user _ids (and therefore profiles/messages) while updating clerkUserId.
 *
 * By default it does NOT create missing Clerk users; it will only relink those that
 * already exist in Clerk.
 */
export const relinkUsersByEmailToClerk: unknown = action({
  args: {
    paginationOpts: paginationOptsValidator,
    createMissing: v.optional(v.boolean()),
    dryRun: v.optional(v.boolean()),
  },
  async handler(
    ctx,
    { paginationOpts, createMissing, dryRun }
  ): Promise<RelinkSummary> {
    await assertAdmin(ctx);

    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("CLERK_SECRET_KEY not configured");
    }
    const clerkSecretKeyValue = clerkSecretKey;

    const issuer = process.env.CLERK_ISSUER_DOMAIN;
    if (!issuer) {
      throw new Error("CLERK_ISSUER_DOMAIN not configured");
    }
    const issuerValue = issuer;

    const page = (await ctx.runQuery(internal.users.listUsersForMigration, {
      paginationOpts,
    })) as unknown as {
      page: Array<{ _id: Id<"users">; email?: string; name?: string }>;
      isDone: boolean;
      continueCursor: string | null;
    };

    let relinked = 0;
    let skippedNoEmail = 0;
    let skippedNoClerkMatch = 0;
    let created = 0;
    const errors: Array<{ userId: string; email?: string; error: string }> = [];

    for (const user of page.page) {
      try {
        const result = await relinkOneUserByEmail({
          ctx,
          user,
          clerkSecretKey: clerkSecretKeyValue,
          issuer: issuerValue,
          createMissing,
          dryRun,
        });

        if (result.status === "skipped_no_email") {
          skippedNoEmail++;
          continue;
        }
        if (result.status === "skipped_no_clerk_match") {
          skippedNoClerkMatch++;
          continue;
        }

        if (result.created) {
          created++;
        }
        relinked++;
      } catch (e) {
        errors.push({
          userId: user._id,
          email: user.email,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return {
      relinked,
      created,
      skippedNoEmail,
      skippedNoClerkMatch,
      errors,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
