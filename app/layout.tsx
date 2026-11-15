import type { Metadata } from "next";
import {
  Courier_Prime,
  Pinyon_Script,
  Playfair_Display,
} from "next/font/google";

import { AnalyticsGate } from "@/components/analytics-gate";
import { CookieBanner } from "@/components/cookie-banner";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import { LocaleProvider } from "@/contexts/locale-context";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const DEFAULT_SITE_URL = "https://nesveskvienas.lt";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
// An unset or empty variable falls back to the production URL.
// Pinyon Script for vintage accent text
const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // Only the .font-pinyon accent class uses it, so it is fetched on demand.
  preload: false,
});

const siteUrl =
  configuredSiteUrl === undefined || configuredSiteUrl === ""
    ? DEFAULT_SITE_URL
    : configuredSiteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nešvęsk vienas - Don't Celebrate Alone",
    template: "%s | Nešvęsk vienas",
  },
  description:
    "A non-profit initiative connecting people for the holidays. Find hosts or guests for holiday celebrations in Lithuania.",
  keywords: [
    "Lithuania",
    "holidays",
    "Christmas",
    "New Year",
    "hospitality",
    "hosting",
    "guests",
    "community",
    "non-profit",
    "Lietuva",
    "Kalėdos",
    "Naujieji metai",
  ],
  authors: [{ name: "Nešvęsk vienas" }],
  creator: "Nešvęsk vienas",
  openGraph: {
    type: "website",
    locale: "lt_LT",
    alternateLocale: ["en_US", "uk_UA", "ru_RU"],
    url: siteUrl,
    siteName: "Nešvęsk vienas",
    title: "Nešvęsk vienas - Don't Celebrate Alone",
    description:
      "A non-profit initiative connecting people for the holidays. Find hosts or guests for holiday celebrations in Lithuania.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nešvęsk vienas - Don't Celebrate Alone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nešvęsk vienas - Don't Celebrate Alone",
    description:
      "A non-profit initiative connecting people for the holidays. Find hosts or guests for holiday celebrations in Lithuania.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here after registering with search engines
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${courierPrime.variable} ${pinyonScript.variable} antialiased`}
      >
        <ConvexClientProvider>
          <CookieConsentProvider>
            <LocaleProvider>{children}</LocaleProvider>
            <Toaster />
            <CookieBanner />
            <AnalyticsGate />
          </CookieConsentProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
