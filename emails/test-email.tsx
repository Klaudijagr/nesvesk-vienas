import { Heading, Section, Text } from "@react-email/components";

import { BaseLayout } from "./base-layout";
import { colors, styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

interface TestEmailProps {
  /** Send time as an ISO timestamp, shown as is. */
  sentAt: string;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

export const TestEmail = ({ sentAt, year, locale = "lt" }: TestEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout locale={locale} preview={t.testSuccess} year={year}>
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>✅</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.green }}>
        {t.testSuccess}
      </Heading>
      <Text style={styles.paragraphCenter}>{t.testMessage}</Text>
      <Text style={styles.paragraphCenter}>{t.testWorking}</Text>
      <Text style={styles.timestamp}>
        {t.sentAt} {sentAt}
      </Text>
    </BaseLayout>
  );
};

// Sample data for React Email's preview (`bun run email`).
const previewSentAt = new Date();
TestEmail.PreviewProps = {
  locale: "lt",
  sentAt: previewSentAt.toISOString(),
  year: previewSentAt.getFullYear(),
} satisfies TestEmailProps;

export default TestEmail;
