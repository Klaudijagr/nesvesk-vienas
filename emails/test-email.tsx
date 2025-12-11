import { Heading, Section, Text } from "@react-email/components";
import {
  BaseLayout,
  colors,
  getTranslations,
  type Locale,
} from "./base-layout";

type TestEmailProps = {
  locale?: Locale;
};

export const TestEmail = ({ locale = "lt" }: TestEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout locale={locale} preview={t.testSuccess}>
      <Section style={iconContainer}>
        <Text style={iconText}>✅</Text>
      </Section>

      <Heading style={heading}>{t.testSuccess}</Heading>

      <Text style={paragraph}>{t.testMessage}</Text>

      <Text style={paragraph}>{t.testWorking}</Text>

      <Text style={timestamp}>
        {t.sentAt} {new Date().toISOString()}
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
