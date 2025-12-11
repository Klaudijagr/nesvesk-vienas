"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import {
  renderInvitationAccepted,
  renderInvitationDeclined,
  renderInvitationReceived,
  renderNewMessage,
  renderTestEmail,
} from "./emailTemplates";

// Maileroo API configuration
const MAILEROO_API_URL = "https://smtp.maileroo.com/api/v2/emails";

// Regex patterns for parsing email addresses (top-level for performance)
const EMAIL_ADDRESS_REGEX = /<(.+)>/;
const EMAIL_NAME_REGEX = /^(.+)\s*</;

// Get Maileroo API key from environment
const getMailerooKey = () => {
  const apiKey = process.env.MAILEROO_API_KEY;
  if (!apiKey) {
    console.warn(
      "MAILEROO_API_KEY environment variable not set - emails disabled"
    );
    return null;
  }
  return apiKey;
};

// Send email via Maileroo API
async function sendMailerooEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const apiKey = getMailerooKey();
  if (!apiKey) {
    return { success: false, error: "API key not configured" };
  }

  const fromAddress =
    params.from || "Nešvęsk vienas <noreply@nesveskvienas.lt>";

  try {
    const response = await fetch(MAILEROO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        from: {
          address: fromAddress.match(EMAIL_ADDRESS_REGEX)?.[1] || fromAddress,
          name:
            fromAddress.match(EMAIL_NAME_REGEX)?.[1]?.trim() ||
            "Nešvęsk vienas",
        },
        to: [{ address: params.to }],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Maileroo API error:", response.status, errorText);
      return { success: false, error: `API error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error("Maileroo request failed:", error);
    return { success: false, error: String(error) };
  }
}

// Email subject lines
const subjects = {
  invitationReceived: (senderName: string, date: string) =>
    `${senderName} wants to celebrate ${date} with you!`,
  invitationAccepted: (accepterName: string, date: string) =>
    `${accepterName} accepted your invitation for ${date}!`,
  invitationDeclined: (_declinerName: string, date: string) =>
    `Update on your ${date} invitation`,
  newMessage: (senderName: string) => `New message from ${senderName}`,
  test: () => "Test Email from Nešvęsk vienas",
};

// Internal action to send emails (called from mutations)
export const sendEmail = internalAction({
  args: {
    to: v.string(),
    type: v.union(
      v.literal("invitationReceived"),
      v.literal("invitationAccepted"),
      v.literal("invitationDeclined"),
      v.literal("newMessage")
    ),
    senderName: v.string(),
    date: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    try {
      const apiKey = getMailerooKey();

      if (!apiKey) {
        console.log("Email would be sent to:", args.to, "type:", args.type);
        return { success: true, skipped: true };
      }

      let subject: string;
      let html: string;
      const date = args.date || "the holidays";

      switch (args.type) {
        case "invitationReceived":
          subject = subjects.invitationReceived(args.senderName, date);
          html = await renderInvitationReceived(args.senderName, date);
          break;
        case "invitationAccepted":
          subject = subjects.invitationAccepted(args.senderName, date);
          html = await renderInvitationAccepted(args.senderName, date);
          break;
        case "invitationDeclined":
          subject = subjects.invitationDeclined(args.senderName, date);
          html = await renderInvitationDeclined(args.senderName, date);
          break;
        case "newMessage":
          subject = subjects.newMessage(args.senderName);
          html = await renderNewMessage(args.senderName);
          break;
        default:
          throw new Error(`Unknown email type: ${args.type}`);
      }

      const result = await sendMailerooEmail({
        to: args.to,
        subject,
        html,
      });

      if (!result.success) {
        console.error("Failed to send email:", result.error);
        return { success: false, error: result.error };
      }

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Email error:", error);
      return { success: false, error: String(error) };
    }
  },
});

// Test action to verify email sending works (DEV ONLY)
export const testEmail = action({
  args: {
    to: v.string(),
    type: v.optional(
      v.union(
        v.literal("test"),
        v.literal("invitationReceived"),
        v.literal("invitationAccepted"),
        v.literal("invitationDeclined"),
        v.literal("newMessage")
      )
    ),
  },
  handler: async (_ctx, args) => {
    const emailType = args.type || "test";

    let subject: string;
    let html: string;

    switch (emailType) {
      case "test":
        subject = subjects.test();
        html = await renderTestEmail();
        break;
      case "invitationReceived":
        subject = subjects.invitationReceived("Test User", "24 Dec");
        html = await renderInvitationReceived("Test User", "24 Dec");
        break;
      case "invitationAccepted":
        subject = subjects.invitationAccepted("Test User", "24 Dec");
        html = await renderInvitationAccepted("Test User", "24 Dec");
        break;
      case "invitationDeclined":
        subject = subjects.invitationDeclined("Test User", "24 Dec");
        html = await renderInvitationDeclined("Test User", "24 Dec");
        break;
      case "newMessage":
        subject = subjects.newMessage("Test User");
        html = await renderNewMessage("Test User");
        break;
      default:
        subject = subjects.test();
        html = await renderTestEmail();
    }

    const result = await sendMailerooEmail({
      to: args.to,
      subject,
      html,
    });
    return { ...result, type: emailType };
  },
});
