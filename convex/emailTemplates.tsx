"use node";

import { render } from "@react-email/render";

import { InvitationAcceptedEmail } from "../emails/invitation-accepted";
import { InvitationDeclinedEmail } from "../emails/invitation-declined";
import { InvitationReceivedEmail } from "../emails/invitation-received";
import { NewMessageEmail } from "../emails/new-message";
import { TestEmail } from "../emails/test-email";
import type { Locale } from "../emails/translations";

// The templates live in `emails/`, where React Email previews them
// (`bun run email`). These functions render them to the HTML that is sent.

export const renderTestEmail = async (
  locale: Locale = "lt"
): Promise<string> => {
  const sentAt = new Date();
  return await render(
    <TestEmail
      locale={locale}
      sentAt={sentAt.toISOString()}
      year={sentAt.getFullYear()}
    />
  );
};

export const renderInvitationReceived = async (
  senderName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> =>
  await render(
    <InvitationReceivedEmail
      date={date}
      locale={locale}
      senderName={senderName}
      year={new Date().getFullYear()}
    />
  );

export const renderInvitationAccepted = async (
  accepterName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> =>
  await render(
    <InvitationAcceptedEmail
      accepterName={accepterName}
      date={date}
      locale={locale}
      year={new Date().getFullYear()}
    />
  );

export const renderInvitationDeclined = async (
  declinerName: string,
  date: string,
  locale: Locale = "lt"
): Promise<string> =>
  await render(
    <InvitationDeclinedEmail
      date={date}
      declinerName={declinerName}
      locale={locale}
      year={new Date().getFullYear()}
    />
  );

export const renderNewMessage = async (
  senderName: string,
  locale: Locale = "lt"
): Promise<string> =>
  await render(
    <NewMessageEmail
      locale={locale}
      senderName={senderName}
      year={new Date().getFullYear()}
    />
  );
