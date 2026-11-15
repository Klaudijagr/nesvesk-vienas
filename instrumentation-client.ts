// Client-side Sentry and PostHog setup. Runs whenever a page loads in the browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  captureRouterTransitionStart,
  init,
  replayIntegration,
} from "@sentry/nextjs";
import type { Event } from "@sentry/nextjs";
import { posthog } from "posthog-js";

import {
  isClerkScriptLoadFailure,
  isInAppBrowserNoise,
  isInAppBrowserUserAgent,
} from "@/lib/sentry-event-filters";

const FIRST_HTTP_URL_RE = /https?:\/\/[^\s]+/u;
const CLERK_ERROR_CODE_RE = /code="(?<code>[^"]+)"/u;
const TRAILING_PUNCTUATION_RE = /[),.]+$/u;
const MAX_MESSAGE_LENGTH = 500;

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

const currentUserAgent = (): string => {
  try {
    return navigator.userAgent;
  } catch {
    return "";
  }
};

const captureClerkScriptLoadFailureToPosthog = (event: Event): void => {
  if (posthogKey === "") {
    return;
  }

  try {
    const rawMessages = (event.exception?.values ?? [])
      .map((exception) => exception.value ?? "")
      .filter((value) => value !== "");

    const scriptUrl = rawMessages
      .map((value) => FIRST_HTTP_URL_RE.exec(value)?.[0])
      .find((value) => value !== undefined)
      ?.replace(TRAILING_PUNCTUATION_RE, "");
    const clerkErrorCode = rawMessages
      .map((value) => CLERK_ERROR_CODE_RE.exec(value)?.groups?.code)
      .find((value) => value !== undefined);

    posthog.capture("clerk_js_failed_to_load_in_app_browser", {
      clerkErrorCode,
      inAppBrowserUaMatch: isInAppBrowserUserAgent(currentUserAgent()),
      message: rawMessages.join(" | ").slice(0, MAX_MESSAGE_LENGTH),
      referrer: typeof document === "undefined" ? undefined : document.referrer,
      scriptUrl,
      sentryEventId: event.event_id,
      sentryRelease: event.release,
      sentryTransaction: event.transaction,
      url: typeof window === "undefined" ? undefined : window.location.href,
    });
  } catch {
    // Never let telemetry capture break app error handling.
  }
};

/** Reads the analytics choice the cookie banner stores in localStorage. */
const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (raw === null || raw === "") {
      return false;
    }
    const parsed: unknown = JSON.parse(raw);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      "analytics" in parsed &&
      parsed.analytics === true
    );
  } catch {
    return false;
  }
};

const enableReplay = hasAnalyticsConsent();

init({
  beforeSend(event) {
    const userAgent = currentUserAgent();

    if (isInAppBrowserNoise(event, userAgent)) {
      return null;
    }

    if (isClerkScriptLoadFailure(event, userAgent)) {
      captureClerkScriptLoadFailureToPosthog(event);
      return null;
    }

    return event;
  },

  // Keep personal data out of Sentry: no user fields, cookies or request/response bodies.
  dataCollection: {
    cookies: false,
    httpBodies: [],
    userInfo: false,
  },

  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Session replay only runs for visitors who accepted analytics cookies.
  integrations: enableReplay ? [replayIntegration()] : [],
  replaysOnErrorSampleRate: enableReplay ? 1 : 0,
  replaysSessionSampleRate: enableReplay ? 0.1 : 0,

  tracesSampleRate: 0.1,
});

if (posthogKey !== "") {
  posthog.init(posthogKey, {
    api_host: "/ingest",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    defaults: "2025-05-24",
    ui_host: "https://us.posthog.com",
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
