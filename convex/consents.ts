import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

// Current policy version - update this when T&Cs change
const CURRENT_POLICY_VERSION = "2024-12-01";

// Consent purpose type for args
const consentPurposeArg = v.union(
  v.literal("terms_of_service"),
  v.literal("privacy_policy"),
  v.literal("marketing_emails"),
  v.literal("analytics_cookies")
);

const consentMethodArg = v.union(
  v.literal("checkbox"),
  v.literal("button"),
  v.literal("cookie_banner")
);

// Record a single consent
export const recordConsent = mutation({
  args: {
    purpose: consentPurposeArg,
    consentMethod: consentMethodArg,
    policyVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    // Check if consent already exists for this purpose
    const existing = await ctx.db
      .query("userConsents")
      .withIndex("by_purpose", (q) =>
        q.eq("userId", userId).eq("purpose", args.purpose)
      )
      .first();

    if (existing && existing.status === "active") {
      // Already have active consent, no need to re-record
      return existing._id;
    }

    // Record new consent
    return await ctx.db.insert("userConsents", {
      userId,
      purpose: args.purpose,
      policyVersion: args.policyVersion ?? CURRENT_POLICY_VERSION,
      status: "active",
      consentMethod: args.consentMethod,
      consentTimestamp: now,
      createdAt: now,
    });
  },
});

// Record multiple consents at once (for onboarding)
export const recordMultipleConsents = mutation({
  args: {
    consents: v.array(
      v.object({
        purpose: consentPurposeArg,
        consentMethod: consentMethodArg,
      })
    ),
    policyVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    const version = args.policyVersion ?? CURRENT_POLICY_VERSION;
    const insertedIds: string[] = [];

    for (const consent of args.consents) {
      // Check if consent already exists
      const existing = await ctx.db
        .query("userConsents")
        .withIndex("by_purpose", (q) =>
          q.eq("userId", userId).eq("purpose", consent.purpose)
        )
        .first();

      if (existing && existing.status === "active") {
        // Already have active consent
        insertedIds.push(existing._id);
        continue;
      }

      // Record new consent
      const id = await ctx.db.insert("userConsents", {
        userId,
        purpose: consent.purpose,
        policyVersion: version,
        status: "active",
        consentMethod: consent.consentMethod,
        consentTimestamp: now,
        createdAt: now,
      });
      insertedIds.push(id);
    }

    return insertedIds;
  },
});

// Withdraw consent
export const withdrawConsent = mutation({
  args: {
    purpose: consentPurposeArg,
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("userConsents")
      .withIndex("by_purpose", (q) =>
        q.eq("userId", userId).eq("purpose", args.purpose)
      )
      .first();

    if (!existing) {
      throw new Error("No consent record found");
    }

    if (existing.status === "withdrawn") {
      return existing._id; // Already withdrawn
    }

    await ctx.db.patch(existing._id, {
      status: "withdrawn",
      withdrawnAt: Date.now(),
    });

    return existing._id;
  },
});

// Get user's consent status for all purposes
export const getMyConsents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("userConsents")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Check if user has active consent for a specific purpose
export const hasActiveConsent = query({
  args: {
    purpose: consentPurposeArg,
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) {
      return false;
    }

    const consent = await ctx.db
      .query("userConsents")
      .withIndex("by_purpose", (q) =>
        q.eq("userId", userId).eq("purpose", args.purpose)
      )
      .first();

    return consent?.status === "active";
  },
});

// Get current policy version (for frontend reference)
export const getCurrentPolicyVersion = query({
  args: {},
  handler: () => CURRENT_POLICY_VERSION,
});
