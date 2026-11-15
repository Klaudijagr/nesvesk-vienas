import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";
import { action } from "./_generated/server";
import { assertAdmin } from "./lib/admin";
import { isNonEmptyString, mapSequential } from "./lib/helpers";

// Read the string `id` field of a Clerk API user object, if there is one.
const readClerkUserId = (value: unknown): string | undefined =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "string"
    ? value.id
    : undefined;

const clerkGetFirstUserIdByEmail = async (args: {
  clerkSecretKey: string;
  email: string;
}): Promise<string | undefined> => {
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

  const matches: unknown = await lookup.json();
  return Array.isArray(matches) ? readClerkUserId(matches[0]) : undefined;
};

const clerkCreateUserFromEmail = async (args: {
  clerkSecretKey: string;
  email: string;
  externalId: string;
  name?: string;
}): Promise<string | undefined> => {
  const [firstName, ...otherNames] = args.name?.split(" ") ?? [];
  const lastName = otherNames.join(" ");

  const create = await fetch("https://api.clerk.com/v1/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.clerkSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: [args.email],
      external_id: args.externalId,
      first_name: isNonEmptyString(firstName) ? firstName : undefined,
      last_name: isNonEmptyString(lastName) ? lastName : undefined,
    }),
  });

  if (!create.ok) {
    const text = await create.text();
    throw new Error(`Clerk create failed (${create.status}): ${text}`);
  }

  const createdUser: unknown = await create.json();
  return readClerkUserId(createdUser);
};

type RelinkResult =
  | { status: "skipped_no_email" }
  | { status: "skipped_no_clerk_match" }
  | { status: "relinked"; created: boolean };

interface RelinkError {
  userId: string;
  email?: string;
  error: string;
}

type RelinkOutcome = RelinkResult | { status: "failed"; failure: RelinkError };

interface RelinkSummary {
  relinked: number;
  created: number;
  skippedNoEmail: number;
  skippedNoClerkMatch: number;
  errors: RelinkError[];
  isDone: boolean;
  continueCursor: string | null;
}

const relinkOneUserByEmail = async (args: {
  ctx: ActionCtx;
  user: { _id: Id<"users">; email?: string; name?: string };
  clerkSecretKey: string;
  issuer: string;
  createMissing?: boolean;
  dryRun?: boolean;
}): Promise<RelinkResult> => {
  const email = args.user.email?.trim();
  if (!isNonEmptyString(email)) {
    return { status: "skipped_no_email" };
  }

  let clerkUserId = await clerkGetFirstUserIdByEmail({
    clerkSecretKey: args.clerkSecretKey,
    email,
  });

  let created = false;
  if (!isNonEmptyString(clerkUserId) && args.createMissing === true) {
    clerkUserId = await clerkCreateUserFromEmail({
      clerkSecretKey: args.clerkSecretKey,
      email,
      externalId: args.user._id,
      name: args.user.name,
    });
    created = true;
  }

  if (!isNonEmptyString(clerkUserId)) {
    return { status: "skipped_no_clerk_match" };
  }

  if (args.dryRun !== true) {
    const clerkId = `${args.issuer}|${clerkUserId}`;
    await args.ctx.runMutation(internal.users.patchUserClerkLink, {
      userId: args.user._id,
      clerkUserId,
      clerkId,
      email,
    });
  }

  return { status: "relinked", created };
};

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
    if (!isNonEmptyString(clerkSecretKey)) {
      throw new Error("CLERK_SECRET_KEY not configured");
    }

    const issuer = process.env.CLERK_ISSUER_DOMAIN;
    if (!isNonEmptyString(issuer)) {
      throw new Error("CLERK_ISSUER_DOMAIN not configured");
    }

    const page = await ctx.runQuery(internal.users.listUsersForMigration, {
      paginationOpts,
    });

    // Sequential on purpose: one user at a time keeps the Clerk API calls
    // within its rate limit, as the original loop did.
    const outcomes = await mapSequential(
      page.page,
      async (user): Promise<RelinkOutcome> => {
        try {
          return await relinkOneUserByEmail({
            ctx,
            user,
            clerkSecretKey,
            issuer,
            createMissing,
            dryRun,
          });
        } catch (error) {
          return {
            status: "failed",
            failure: {
              userId: user._id,
              email: user.email,
              error: error instanceof Error ? error.message : String(error),
            },
          };
        }
      }
    );

    const relinked = outcomes.filter(
      (outcome) => outcome.status === "relinked"
    );

    return {
      relinked: relinked.length,
      created: relinked.filter((outcome) => outcome.created).length,
      skippedNoEmail: outcomes.filter(
        (outcome) => outcome.status === "skipped_no_email"
      ).length,
      skippedNoClerkMatch: outcomes.filter(
        (outcome) => outcome.status === "skipped_no_clerk_match"
      ).length,
      errors: outcomes.flatMap((outcome) =>
        outcome.status === "failed" ? [outcome.failure] : []
      ),
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
