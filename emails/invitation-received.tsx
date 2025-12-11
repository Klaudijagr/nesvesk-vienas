import { Button, Heading, Section, Text } from "@react-email/components";
import {
  BaseLayout,
  colors,
  getTranslations,
  type Locale,
} from "./base-layout";

type InvitationReceivedEmailProps = {
  senderName?: string;
  date?: string;
  locale?: Locale;
};

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

export const InvitationReceivedEmail = ({
  senderName = "Jonas Jonaitis",
  date = "24 Dec",
  locale = "lt",
}: InvitationReceivedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${senderName} ${t.invitedYou} ${date}!`}
    >
      <Section style={iconContainer}>
        <Text style={iconText}>🎄</Text>
      </Section>

      <Heading style={heading}>{t.newInvitation}</Heading>

      <Text style={paragraph}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.invitedYou}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>

      <Text style={paragraph}>{t.invitationIntro}</Text>

      <Section style={buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={buttonAmber}>
          {t.viewInvitation}
        </Button>
      </Section>

      <Text style={tipBox}>
        <strong>💡 {t.invitationTip.split(":")[0]}:</strong>
        {t.invitationTip.split(":")[1]}
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
  color: colors.amber,
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

const tipBox = {
  backgroundColor: colors.background,
  borderRadius: "8px",
  color: colors.text,
  fontSize: "14px",
  lineHeight: "22px",
  padding: "16px",
  margin: "24px 0 0",
  border: `1px solid ${colors.border}`,
};

export default InvitationReceivedEmail;
