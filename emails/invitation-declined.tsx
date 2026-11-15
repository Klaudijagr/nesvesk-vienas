import { Button, Heading, Section, Text } from "@react-email/components";

import { BaseLayout, baseUrl } from "./base-layout";
import { colors, styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

interface InvitationDeclinedEmailProps {
  declinerName: string;
  date: string;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

export const InvitationDeclinedEmail = ({
  declinerName,
  date,
  year,
  locale = "lt",
}: InvitationDeclinedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${t.invitationUpdate}: ${date}`}
      year={year}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>💫</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.textMuted }}>
        {t.invitationUpdate}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{declinerName}</strong>{" "}
        {t.unableToJoin}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.thisTime}
      </Text>
      <Text style={styles.paragraph}>{t.declinedIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={styles.buttonAmber}>
          {t.browseMore}
        </Button>
      </Section>
      <Text style={styles.encouragementBox}>{t.encouragement}</Text>
    </BaseLayout>
  );
};

// Sample data for React Email's preview (`bun run email`).
InvitationDeclinedEmail.PreviewProps = {
  date: "24 Dec",
  declinerName: "Jonas Jonaitis",
  locale: "lt",
  year: new Date().getFullYear(),
} satisfies InvitationDeclinedEmailProps;

export default InvitationDeclinedEmail;
