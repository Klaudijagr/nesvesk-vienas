import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import schema from "./schema";

describe("consents", () => {
  test("recordMultipleConsents records terms and privacy", async () => {
    const t = convexTest(schema);

    // Create a test user first
    const _userId = await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "test-clerk-id",
          clerkUserId: "test-clerk-id",
          email: "test@example.com",
          name: "Test User",
        })
    );

    // Record consents as the user
    const asUser = t.withIdentity({ tokenIdentifier: "test-clerk-id" });

    await asUser.mutation(api.consents.recordMultipleConsents, {
      consents: [
        { purpose: "terms_of_service", consentMethod: "checkbox" },
        { purpose: "privacy_policy", consentMethod: "checkbox" },
      ],
    });

    // Verify consents were recorded
    const consents = await asUser.query(api.consents.getMyConsents, {});

    expect(consents).toHaveLength(2);
    expect(consents.map((c: Doc<"userConsents">) => c.purpose)).toContain(
      "terms_of_service"
    );
    expect(consents.map((c: Doc<"userConsents">) => c.purpose)).toContain(
      "privacy_policy"
    );
    expect(
      consents.every((c: Doc<"userConsents">) => c.status === "active")
    ).toBe(true);
  });

  test("recordMultipleConsents with marketing consent", async () => {
    const t = convexTest(schema);

    // Create a test user
    await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "test-clerk-id-2",
          clerkUserId: "test-clerk-id-2",
          email: "test2@example.com",
          name: "Test User 2",
        })
    );

    const asUser = t.withIdentity({ tokenIdentifier: "test-clerk-id-2" });

    await asUser.mutation(api.consents.recordMultipleConsents, {
      consents: [
        { purpose: "terms_of_service", consentMethod: "checkbox" },
        { purpose: "privacy_policy", consentMethod: "checkbox" },
        { purpose: "marketing_emails", consentMethod: "checkbox" },
      ],
    });

    const consents = await asUser.query(api.consents.getMyConsents, {});

    expect(consents).toHaveLength(3);
    expect(consents.map((c: Doc<"userConsents">) => c.purpose)).toContain(
      "marketing_emails"
    );
  });

  test("withdrawConsent changes status to withdrawn", async () => {
    const t = convexTest(schema);

    // Create a test user
    await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "test-clerk-id-3",
          clerkUserId: "test-clerk-id-3",
          email: "test3@example.com",
          name: "Test User 3",
        })
    );

    const asUser = t.withIdentity({ tokenIdentifier: "test-clerk-id-3" });

    // Record consent first
    await asUser.mutation(api.consents.recordMultipleConsents, {
      consents: [{ purpose: "marketing_emails", consentMethod: "checkbox" }],
    });

    // Withdraw it
    await asUser.mutation(api.consents.withdrawConsent, {
      purpose: "marketing_emails",
    });

    // Check it's withdrawn
    const consents = await asUser.query(api.consents.getMyConsents, {});
    const marketingConsent = consents.find(
      (c: Doc<"userConsents">) => c.purpose === "marketing_emails"
    );

    expect(marketingConsent?.status).toBe("withdrawn");
    expect(marketingConsent?.withdrawnAt).toBeDefined();
  });

  test("hasActiveConsent returns correct status", async () => {
    const t = convexTest(schema);

    // Create a test user
    await t.run(
      async (ctx) =>
        await ctx.db.insert("users", {
          clerkId: "test-clerk-id-4",
          clerkUserId: "test-clerk-id-4",
          email: "test4@example.com",
          name: "Test User 4",
        })
    );

    const asUser = t.withIdentity({ tokenIdentifier: "test-clerk-id-4" });

    // Should be false before recording
    const beforeConsent = await asUser.query(api.consents.hasActiveConsent, {
      purpose: "terms_of_service",
    });
    expect(beforeConsent).toBe(false);

    // Record consent
    await asUser.mutation(api.consents.recordMultipleConsents, {
      consents: [{ purpose: "terms_of_service", consentMethod: "checkbox" }],
    });

    // Should be true after recording
    const afterConsent = await asUser.query(api.consents.hasActiveConsent, {
      purpose: "terms_of_service",
    });
    expect(afterConsent).toBe(true);
  });

  test("getCurrentPolicyVersion returns version string", async () => {
    const t = convexTest(schema);

    const version = await t.query(api.consents.getCurrentPolicyVersion, {});

    expect(version).toBe("2024-12-01");
  });
});
