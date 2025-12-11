import { Button, Heading, Section, Text } from "@react-email/components";
import {
  BaseLayout,
  colors,
  getTranslations,
  type Locale,
} from "./base-layout";

type NewMessageEmailProps = {
  senderName?: string;
  locale?: Locale;
};

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

export const NewMessageEmail = ({
  senderName = "Jonas Jonaitis",
  locale = "lt",
}: NewMessageEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout locale={locale} preview={`${t.newMessage} - ${senderName}`}>
      <Section style={iconContainer}>
        <Text style={iconText}>💬</Text>
      </Section>

      <Heading style={heading}>{t.newMessage}</Heading>

      <Text style={paragraphCenter}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.sentYouMessage}
      </Text>

      <Section style={buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={buttonAmber}>
          {t.readMessage}
        </Button>
      </Section>

      <Text style={tipBox}>
        <strong>💡</strong> {t.messageTip}
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

const paragraphCenter = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "28px",
  margin: "0 0 16px",
  textAlign: "center" as const,
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
  textAlign: "center" as const,
  border: `1px solid ${colors.border}`,
};

export default NewMessageEmail;
