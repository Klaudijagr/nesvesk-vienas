import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";

import { styles } from "./styles";
import { getTranslations } from "./translations";
import type { Locale } from "./translations";

// An unset or empty SITE_URL falls back to the production site.
const siteUrl = process.env.SITE_URL;
export const baseUrl =
  siteUrl === undefined || siteUrl === ""
    ? "https://nesveskvienas.lt"
    : siteUrl;

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
  /** Copyright year shown in the footer. */
  year: number;
  locale?: Locale;
}

// Shared frame around every template. It has named exports only, so React
// Email's preview does not list this file as a template of its own.
export const BaseLayout = ({
  preview,
  children,
  year,
  locale = "lt",
}: BaseLayoutProps) => {
  const t = getTranslations(locale);

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logo}>Nešvęsk vienas</Text>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Section style={styles.footer}>
            <Text style={styles.footerTagline}>{t.tagline}</Text>
            <Text style={styles.footerLinks}>
              <Link href={`${baseUrl}/settings`} style={styles.footerLink}>
                {t.notificationSettings}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/privacy`} style={styles.footerLink}>
                {t.privacyPolicy}
              </Link>
              {" • "}
              <Link href={`${baseUrl}/terms`} style={styles.footerLink}>
                {t.terms}
              </Link>
            </Text>
            <Text style={styles.copyright}>
              © {year} Nešvęsk vienas. {t.copyright}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
