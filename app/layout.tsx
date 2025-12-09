import type { Metadata } from "next";
import {
  Courier_Prime,
  Geist,
  Geist_Mono,
  Playfair_Display,
} from "next/font/google";
import { DevPanel } from "@/components/DevPanel";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";

import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/contexts/locale-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export const metadata: Metadata = {
  title: "Nešvęsk vienas - Don't Celebrate Alone",
  description:
    "A non-profit initiative connecting people for the holidays. Find hosts or guests for holiday celebrations in Lithuania.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Pinyon Script for vintage accent text */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${courierPrime.variable} antialiased`}
      >
        <ConvexClientProvider>
          <LocaleProvider>{children}</LocaleProvider>
          <DevPanel />
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
