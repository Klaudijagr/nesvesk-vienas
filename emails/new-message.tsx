import { Button, Heading, Section, Text } from "@react-email/components";

import { BaseLayout, baseUrl } from "./base-layout";
import { colors, styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

interface NewMessageEmailProps {
  senderName: string;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

export const NewMessageEmail = ({
  senderName,
  year,
  locale = "lt",
}: NewMessageEmailProps) => {
  const t = getTranslations(locale);

  return (
    <BaseLayout
      locale={locale}
      preview={`${t.newMessage} - ${senderName}`}
      year={year}
    >
      <Section style={styles.iconContainer}>
        <Text style={styles.iconText}>💬</Text>
      </Section>
      <Heading style={{ ...styles.heading, color: colors.amber }}>
        {t.newMessage}
      </Heading>
      <Text style={styles.paragraphCenter}>
        <strong style={{ color: colors.textLight }}>{senderName}</strong>{" "}
        {t.sentYouMessage}
      </Text>
      <Section style={styles.buttonContainer}>
        <Button href={`${baseUrl}/messages`} style={styles.buttonAmber}>
          {t.readMessage}
        </Button>
      </Section>
      <Text style={{ ...styles.tipBox, textAlign: "center" as const }}>
        <strong>💡</strong> {t.messageTip}
      </Text>
    </BaseLayout>
  );
};

// Sample data for React Email's preview (`bun run email`).
NewMessageEmail.PreviewProps = {
  locale: "lt",
  senderName: "Jonas Jonaitis",
  year: new Date().getFullYear(),
} satisfies NewMessageEmailProps;

export default NewMessageEmail;
