"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useCookieConsent } from "@/contexts/cookie-consent-context";

/**
 * Only mounts analytics after the user has opted in.
 *
 * NOTE: This is privacy/compliance oriented, but also reduces client-side noise and risk.
 */
export const AnalyticsGate = () => {
  const { consent } = useCookieConsent();

  if (consent?.analytics !== true) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};
