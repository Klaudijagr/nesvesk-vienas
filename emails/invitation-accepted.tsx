import { Button, Heading, Section, Text } from "@react-email/components";
import {
  BaseLayout,
  colors,
  getTranslations,
  type Locale,
} from "./base-layout";

type InvitationAcceptedEmailProps = {
  accepterName?: string;
  date?: string;
  locale?: Locale;
};

const baseUrl = process.env.SITE_URL || "https://nesveskvienas.lt";

export const InvitationAcceptedEmail = ({
  accepterName = "Jonas Jonaitis",
  date = "24 Dec",
  locale = "lt",
}: InvitationAcceptedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${accepterName} ${t.acceptedYour} ${date}!`}
    >
      <Section style={iconContainer}>
        <Text style={iconText}>🎉</Text>
      </Section>

      <Heading style={heading}>{t.youHaveMatch}</Heading>

      <Text style={paragraph}>
        <strong style={{ color: colors.textLight }}>{accepterName}</strong>{" "}
        {t.acceptedYour}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>

      <Text style={paragraph}>{t.matchIntro}</Text>

      <Section style={buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={buttonGreen}>
          {t.startChatting}
        </Button>
      </Section>

      <Section style={nextStepsBox}>
        <Text style={nextStepsTitle}>{t.nextSteps}</Text>
        <Text style={nextStepsItem}>✓ {t.step1}</Text>
        <Text style={nextStepsItem}>✓ {t.step2}</Text>
        <Text style={nextStepsItem}>✓ {t.step3}</Text>
        <Text style={nextStepsItem}>✓ {t.step4}</Text>
      </Section>
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
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonGreen = {
  backgroundColor: colors.green,
  borderRadius: "8px",
  color: colors.background,
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const nextStepsBox = {
  backgroundColor: "rgba(34, 197, 94, 0.1)",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
  border: `1px solid ${colors.green}`,
};

const nextStepsTitle = {
  color: colors.greenLight,
  fontSize: "14px",
  fontWeight: "bold" as const,
  margin: "0 0 12px",
};

const nextStepsItem = {
  color: colors.text,
  fontSize: "14px",
  lineHeight: "26px",
  margin: "0",
};

export default InvitationAcceptedEmail;
