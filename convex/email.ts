"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import { action, internalAction } from "./_generated/server";

// Initialize Resend with API key from environment
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY environment variable not set - emails disabled"
    );
    return null;
  }
  return new Resend(apiKey);
};

// Email templates
const templates = {
  invitationReceived: (senderName: string, date: string) => ({
    subject: `${senderName} wants to celebrate ${date} with you!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">You have a new invitation!</h1>
        <p><strong>${senderName}</strong> has invited you to celebrate <strong>${date}</strong> together.</p>
        <p>Log in to Nešvęsk Vienas to view the invitation and respond:</p>
        <a href="${process.env.SITE_URL || "http://localhost:3000"}/dashboard"
           style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Invitation
        </a>
        <p style="color: #666; font-size: 14px;">Don't celebrate alone this holiday season!</p>
      </div>
    `,
  }),

  invitationAccepted: (accepterName: string, date: string) => ({
    subject: `${accepterName} accepted your invitation for ${date}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Great news! You have a match!</h1>
        <p><strong>${accepterName}</strong> has accepted your invitation to celebrate <strong>${date}</strong> together.</p>
        <p>You can now see their full contact details and coordinate your celebration!</p>
        <a href="${process.env.SITE_URL || "http://localhost:3000"}/matches"
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Match Details
        </a>
        <p style="color: #666; font-size: 14px;">Don't celebrate alone this holiday season!</p>
      </div>
    `,
  }),

  invitationDeclined: (declinerName: string, date: string) => ({
    subject: `Update on your ${date} invitation`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6b7280;">Invitation Update</h1>
        <p><strong>${declinerName}</strong> is unable to join you for <strong>${date}</strong> this time.</p>
        <p>Don't worry! There are many other people looking for company. Keep browsing!</p>
        <a href="${process.env.SITE_URL || "http://localhost:3000"}/browse"
           style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Browse More Profiles
        </a>
        <p style="color: #666; font-size: 14px;">Don't celebrate alone this holiday season!</p>
      </div>
    `,
  }),

  newMessage: (senderName: string) => ({
    subject: `New message from ${senderName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">You have a new message!</h1>
        <p><strong>${senderName}</strong> sent you a message.</p>
        <a href="${process.env.SITE_URL || "http://localhost:3000"}/dashboard"
           style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Read Message
        </a>
        <p style="color: #666; font-size: 14px;">Don't celebrate alone this holiday season!</p>
      </div>
    `,
  }),
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
      const resend = getResend();

      if (!resend) {
        console.log("Email would be sent to:", args.to, "type:", args.type);
        return { success: true, skipped: true };
      }

      let template: { subject: string; html: string };

      switch (args.type) {
        case "invitationReceived":
          template = templates.invitationReceived(
            args.senderName,
            args.date || ""
          );
          break;
        case "invitationAccepted":
          template = templates.invitationAccepted(
            args.senderName,
            args.date || ""
          );
          break;
        case "invitationDeclined":
          template = templates.invitationDeclined(
            args.senderName,
            args.date || ""
          );
          break;
        case "newMessage":
          template = templates.newMessage(args.senderName);
          break;
        default:
          throw new Error(`Unknown email type: ${args.type}`);
      }

      const { error } = await resend.emails.send({
        from: "Nešvęsk Vienas <noreply@nesvesk-vienas.lt>",
        to: args.to,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Email error:", error);
      return { success: false, error: String(error) };
    }
  },
});

// Public action for testing (remove in production)
export const testEmail = action({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    const resend = getResend();

    if (!resend) {
      console.log("Test email would be sent to:", args.to);
      return { success: true, skipped: true };
    }

    const { data, error } = await resend.emails.send({
      from: "Nešvęsk Vienas <noreply@nesvesk-vienas.lt>",
      to: args.to,
      subject: "Test Email from Nešvęsk Vienas",
      html: "<h1>Test email!</h1><p>If you received this, email is working.</p>",
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, id: data?.id };
  },
});
