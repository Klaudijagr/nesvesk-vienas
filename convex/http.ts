import { verifyWebhook } from "@clerk/backend/webhooks";
import type { WebhookEvent } from "@clerk/backend/webhooks";
import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { isNonEmptyString } from "./lib/helpers";

const http = httpRouter();

const validateRequest = async (
  request: Request
): Promise<WebhookEvent | null> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!isNonEmptyString(webhookSecret)) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return null;
  }

  try {
    return await verifyWebhook(request, { signingSecret: webhookSecret });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return null;
  }
};

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: {
          id: event.data.id,
          email_addresses: event.data.email_addresses,
          first_name: event.data.first_name,
          last_name: event.data.last_name,
          image_url: event.data.image_url,
        },
      });
    } else if (event.type === "user.deleted") {
      const clerkUserId = event.data.id;
      if (isNonEmptyString(clerkUserId)) {
        await ctx.runMutation(internal.users.deleteFromClerk, {
          clerkUserId,
        });
      }
    } else {
      console.log("Ignored Clerk webhook event:", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
