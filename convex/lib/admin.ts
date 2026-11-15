import { extractClerkUserId } from "./auth";

interface Identity {
  tokenIdentifier: string;
}

const parseAdminList = (value: string | undefined): Set<string> => {
  if (value === undefined || value === "") {
    return new Set();
  }
  return new Set(
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
};

/**
 * Guard for admin-only Convex functions.
 *
 * Production behavior:
 * - Requires auth
 * - Requires ADMIN_CLERK_USER_IDS to be set
 * - Requires current Clerk user id to be in that list
 */
export const assertAdmin = async (ctx: {
  auth: { getUserIdentity: () => Promise<Identity | null> };
}) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const admins = parseAdminList(process.env.ADMIN_CLERK_USER_IDS);

  // In non-production environments, allow any authenticated identity if admins aren't configured.
  if (process.env.NODE_ENV !== "production" && admins.size === 0) {
    return;
  }

  if (admins.size === 0) {
    throw new Error("Admin list not configured");
  }

  const clerkUserId = extractClerkUserId(identity.tokenIdentifier);
  if (!admins.has(clerkUserId)) {
    throw new Error("Not authorized");
  }
};
