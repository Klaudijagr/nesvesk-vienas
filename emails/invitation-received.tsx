import { Button, Heading, Section, Text } from "@react-email/components";

import { BaseLayout, baseUrl } from "./base-layout";
import { colors, styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

interface InvitationReceivedEmailProps {
  senderName: string;
  date: string;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

export const InvitationReceivedEmail = ({
  senderName,
  date,
  year,
  locale = "lt",
}: InvitationReceivedEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${senderName} ${t.invitedYou} ${date}!`}
      year={year}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>🎄</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.amber }}>
        {t.newInvitation}
      </Heading>
      <Text style={styles.paragraph}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.invitedYou}{" "}
        <strong style={{ color: colors.amberLight }}>{date}</strong>{" "}
        {t.together}
      </Text>
      <Text style={styles.paragraph}>{t.invitationIntro}</Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/browse`} style={styles.buttonAmber}>
          {t.viewInvitation}
        </Button>
      </Section>
      <Text style={styles.tipBox}>
        <strong>💡 {t.invitationTip.split(":")[0]}:</strong>
        {t.invitationTip.split(":")[1]}
      </Text>
    </BaseLayout>
  );
};

// Sample data for React Email's preview (`bun run email`).
InvitationReceivedEmail.PreviewProps = {
  date: "24 Dec",
  locale: "lt",
  senderName: "Jonas Jonaitis",
  year: new Date().getFullYear(),
} satisfies InvitationReceivedEmailProps;

export default InvitationReceivedEmail;
