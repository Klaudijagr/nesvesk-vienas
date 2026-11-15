import { Button, Heading, Section, Text } from "@react-email/components";

import { BaseLayout, baseUrl } from "./base-layout";
import { colors, styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

interface InvitationAcceptedEmailProps {
  accepterName: string;
  date: string;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

export const InvitationAcceptedEmail = ({
  accepterName,
  date,
  year,
  locale = "lt",
}: InvitationAcceptedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${accepterName} ${t.acceptedYour} ${date}!`}
      year={year}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>🎉</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.green }}>
        {t.youHaveMatch}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{accepterName}</strong>{" "}
        {t.acceptedYour}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>
      <Text style={styles.paragraph}>{t.matchIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={styles.buttonGreen}>
          {t.startChatting}
        </Button>
      </Section>
      <Section style={styles.nextStepsBox}>
        <Text style={styles.nextStepsTitle}>{t.nextSteps}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step1}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step2}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step3}</Text>
        <Text style={styles.nextStepsItem}>✓ {t.step4}</Text>
      </Section>
    </BaseLayout>
  );
};

// Sample data for React Email's preview (`bun run email`).
InvitationAcceptedEmail.PreviewProps = {
  accepterName: "Jonas Jonaitis",
  date: "24 Dec",
  locale: "lt",
  year: new Date().getFullYear(),
} satisfies InvitationAcceptedEmailProps;

export default InvitationAcceptedEmail;
