import type { Event } from "@sentry/nextjs";

const IN_APP_BROWSER_UA_RE =
  /FBAN|FBAV|Instagram|Messenger|LinkedIn|TikTok|Snapchat|Pinterest|Twitter|Line|WeChat|MicroMessenger/iu;

/**
 * Script the Facebook Android in-app browser injects into every page. Its
 * frames show up as `app://navigation_performance_logger_android`.
 */
const INJECTED_ANDROID_SCRIPT = "navigation_performance_logger_android";

/** Android WebView message when a page calls a JS bridge whose Java side was torn down. */
const ANDROID_BRIDGE_GONE_MESSAGE = "Java object is gone";

export const isInAppBrowserUserAgent = (userAgent: string): boolean =>
  IN_APP_BROWSER_UA_RE.test(userAgent);

const exceptionValues = (event: Event) => event.exception?.values ?? [];

/**
 * Facebook iOS in-app browser: `InvalidAccessError` thrown by its own
 * postMessage bridge.
 */
export const isFacebookIosPostMessageError = (
  event: Event,
  userAgent: string
): boolean => {
  const [first] = exceptionValues(event);
  return (
    first?.type === "InvalidAccessError" &&
    (first.value ?? "").includes(
      "The object does not support the operation or argument"
    ) &&
    isInAppBrowserUserAgent(userAgent)
  );
};

/**
 * Facebook iOS in-app browser: its injected code reads
 * `window.webkit.messageHandlers` when it does not exist.
 */
export const isFacebookIosMessageHandlerError = (
  event: Event,
  userAgent: string
): boolean => {
  const [first] = exceptionValues(event);
  const value = first?.value ?? "";
  return (
    first?.type === "TypeError" &&
    value.includes("undefined is not an object") &&
    value.includes("window.webkit.messageHandlers") &&
    isInAppBrowserUserAgent(userAgent)
  );
};

/**
 * Facebook Android in-app browser (Sentry NESVESK-VIENAS-1Q): the performance
 * logger Facebook injects calls its native bridge after the WebView dropped
 * it, throwing "Error invoking postMessage: Java object is gone". None of the
 * stack belongs to this app.
 *
 * Dropped when the error comes from the injected script itself, or when the
 * bridge message appears inside a known in-app browser. An error with the same
 * text raised from our own bundle in a normal browser is still reported.
 */
export const isFacebookAndroidBridgeError = (
  event: Event,
  userAgent: string
): boolean =>
  exceptionValues(event).some((exception) => {
    const frames = exception.stacktrace?.frames ?? [];
    const fromInjectedScript =
      frames.length > 0 &&
      frames.every((frame) =>
        (frame.filename ?? "").includes(INJECTED_ANDROID_SCRIPT)
      );
    if (fromInjectedScript) {
      return true;
    }
    return (
      (exception.value ?? "").includes(ANDROID_BRIDGE_GONE_MESSAGE) &&
      isInAppBrowserUserAgent(userAgent)
    );
  });

/**
 * Clerk's script failing to load inside an in-app browser, which commonly
 * blocks third-party scripts.
 */
export const isClerkScriptLoadFailure = (
  event: Event,
  userAgent: string
): boolean => {
  const failed = exceptionValues(event).some((exception) => {
    const value = (exception.value ?? "").toLowerCase();
    return value.includes("failed to load") && value.includes("clerk");
  });
  return failed && isInAppBrowserUserAgent(userAgent);
};

/** Errors raised by an in-app browser's own injected code rather than this app. */
export const isInAppBrowserNoise = (event: Event, userAgent: string): boolean =>
  isFacebookIosPostMessageError(event, userAgent) ||
  isFacebookIosMessageHandlerError(event, userAgent) ||
  isFacebookAndroidBridgeError(event, userAgent);
