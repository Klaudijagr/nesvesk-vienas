import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import schema from "./schema";

const SECRET_KEY = "nesvesk-webhook-test-key";
const SIGNING_SECRET = `whsec_${btoa(SECRET_KEY)}`;
const WEBHOOK_PATH = "/clerk-users-webhook";
const MESSAGE_ID = "msg_test_1";
const MS_PER_SECOND = 1000;

const sign = async (payload: string, timestamp: string): Promise<string> => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${MESSAGE_ID}.${timestamp}.${payload}`)
  );
  return btoa(String.fromCodePoint(...new Uint8Array(signature)));
};

const webhookRequest = async (payload: string, signedPayload = payload) => {
  const timestamp = String(Math.floor(Date.now() / MS_PER_SECOND));
  return {
    body: payload,
    headers: {
      "content-type": "application/json",
      "svix-id": MESSAGE_ID,
      "svix-signature": `v1,${await sign(signedPayload, timestamp)}`,
      "svix-timestamp": timestamp,
    },
    method: "POST",
  };
};

const userCreated = JSON.stringify({
  data: {
    email_addresses: [{ email_address: "guest@example.com" }],
    first_name: "Guest",
    id: "user_test_1",
    image_url: "",
    last_name: "Example",
  },
  object: "event",
  type: "user.created",
});

describe("clerk webhook", () => {
  beforeEach(() => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", SIGNING_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a correctly signed event and syncs the user", async () => {
    const t = convexTest(schema);

    const response = await t.fetch(
      WEBHOOK_PATH,
      await webhookRequest(userCreated)
    );

    expect(response.status).toBe(200);
    const users = await t.run(
      async (ctx) => await ctx.db.query("users").collect()
    );
    expect(users).toHaveLength(1);
    expect(users[0]?.clerkId).toBe("user_test_1");
  });

  it("rejects a payload that does not match its signature", async () => {
    const t = convexTest(schema);
    const tampered = userCreated.replace("user_test_1", "user_attacker");

    const response = await t.fetch(
      WEBHOOK_PATH,
      await webhookRequest(tampered, userCreated)
    );

    expect(response.status).toBe(400);
    const users = await t.run(
      async (ctx) => await ctx.db.query("users").collect()
    );
    expect(users).toHaveLength(0);
  });

  it("rejects every event when the signing secret is not configured", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", "");
    const t = convexTest(schema);

    const response = await t.fetch(
      WEBHOOK_PATH,
      await webhookRequest(userCreated)
    );

    expect(response.status).toBe(400);
  });
});
