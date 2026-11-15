import { Heading, Section, Text } from "@react-email/components";

import { BaseLayout, colors, getTranslations } from "./base-layout";
import type { Locale } from "./base-layout";

interface TestEmailProps {
  locale?: Locale;
  /** ISO timestamp shown in the email; defaults to the render time. */
  sentAt?: string;
}

// Emails are rendered once per send, so the send time is read here when the
// caller does not pass one.
const getCurrentTimestamp = (): string => new Date().toISOString();

export const TestEmail = ({ locale = "lt", sentAt }: TestEmailProps) => {
  const t = getTranslations(locale);
  const sentAtLabel = sentAt ?? getCurrentTimestamp();

  return (
    <BaseLayout locale={locale} preview={t.testSuccess}>
      <Section style={iconContainer}>
        <Text style={iconText}>✅</Text>
      </Section>

      <Heading style={heading}>{t.testSuccess}</Heading>

      <Text style={paragraph}>{t.testMessage}</Text>

      <Text style={paragraph}>{t.testWorking}</Text>

      <Text style={timestamp}>
        {t.sentAt} {sentAtLabel}
      </Text>
    </BaseLayout>
  );
};

// Styles - Dark theme
const iconContainer = {
  textAlign: "center" as const,
  marginBottom: "16px",
};

const iconText = {
  fontSize: "56px",
  margin: "0",
};

const heading = {
  color: colors.green,
  fontSize: "28px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  margin: "0 0 24px",
  fontFamily: "Georgia, serif",
};

const paragraph = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "28px",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const timestamp = {
  color: colors.textMuted,
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "24px 0 0",
};

export default TestEmail;
