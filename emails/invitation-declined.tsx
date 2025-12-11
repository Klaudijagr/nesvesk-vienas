import { Button, Heading, Section, Text } from "@react-email/components";
import {
  BaseLayout,
  colors,
  getTranslations,
  type Locale,
} from "./base-layout";

type InvitationDeclinedEmailProps = {
  declinerName?: string;
  date?: string;
  locale?: Locale;
};

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

export const InvitationDeclinedEmail = ({
  declinerName = "Jonas Jonaitis",
  date = "24 Dec",
  locale = "lt",
}: InvitationDeclinedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout locale={locale} preview={`${t.invitationUpdate}: ${date}`}>
      <Section style={iconContainer}>
        <Text style={iconText}>💫</Text>
      </Section>

      <Heading style={heading}>{t.invitationUpdate}</Heading>

      <Text style={paragraph}>
        <strong style={{ color: colors.textLight }}>{declinerName}</strong>{" "}
        {t.unableToJoin}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.thisTime}
      </Text>

      <Text style={paragraph}>{t.declinedIntro}</Text>

      <Section style={buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={buttonAmber}>
          {t.browseMore}
        </Button>
      </Section>

      <Text style={encouragementBox}>{t.encouragement}</Text>
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
  color: colors.textMuted,
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
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonAmber = {
  backgroundColor: colors.amber,
  borderRadius: "8px",
  color: colors.background,
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const encouragementBox = {
  backgroundColor: "rgba(245, 158, 11, 0.1)",
  borderRadius: "8px",
  color: colors.amberLight,
  fontSize: "14px",
  lineHeight: "22px",
  padding: "16px",
  margin: "24px 0 0",
  textAlign: "center" as const,
  border: `1px solid ${colors.amber}`,
};

export default InvitationDeclinedEmail;
