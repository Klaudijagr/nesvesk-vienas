import type { Event } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";

import {
  isClerkScriptLoadFailure,
  isFacebookAndroidBridgeError,
  isInAppBrowserNoise,
} from "./sentry-event-filters";

const FACEBOOK_ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 16; SM-A556B Build/BP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/586.0.0.0.0;]";
const CHROME_DESKTOP_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

const INJECTED_SCRIPT = "app://navigation_performance_logger_android";
const BRIDGE_MESSAGE = "Error invoking postMessage: Java object is gone";

const errorEvent = (
  value: string,
  filenames: string[],
  type = "Error"
): Event => ({
  exception: {
    values: [
      {
        stacktrace: { frames: filenames.map((filename) => ({ filename })) },
        type,
        value,
      },
    ],
  },
});

describe(isFacebookAndroidBridgeError, () => {
  it("drops the reported NESVESK-VIENAS-1Q event", () => {
    const event = errorEvent(BRIDGE_MESSAGE, [
      INJECTED_SCRIPT,
      INJECTED_SCRIPT,
      INJECTED_SCRIPT,
    ]);
    expect(
      isFacebookAndroidBridgeError(event, FACEBOOK_ANDROID_UA)
    ).toBeTruthy();
    expect(isInAppBrowserNoise(event, FACEBOOK_ANDROID_UA)).toBeTruthy();
  });

  it("drops injected-script errors even when the user agent is not recognised", () => {
    const event = errorEvent(BRIDGE_MESSAGE, [INJECTED_SCRIPT]);
    expect(isFacebookAndroidBridgeError(event, CHROME_DESKTOP_UA)).toBeTruthy();
  });

  it("drops the bridge message inside an in-app browser when frames are missing", () => {
    const event = errorEvent(BRIDGE_MESSAGE, []);
    expect(
      isFacebookAndroidBridgeError(event, FACEBOOK_ANDROID_UA)
    ).toBeTruthy();
  });

  it("keeps the same message raised from app code in a normal browser", () => {
    const event = errorEvent(BRIDGE_MESSAGE, [
      "app:///_next/static/chunks/main.js",
    ]);
    expect(isFacebookAndroidBridgeError(event, CHROME_DESKTOP_UA)).toBeFalsy();
  });

  it("keeps real application errors inside the Facebook browser", () => {
    const event = errorEvent(
      "Cannot read properties of undefined (reading 'name')",
      ["app:///_next/static/chunks/main.js"],
      "TypeError"
    );
    expect(isInAppBrowserNoise(event, FACEBOOK_ANDROID_UA)).toBeFalsy();
  });

  it("keeps errors whose stack mixes app code with the injected script", () => {
    const event = errorEvent("Something else failed", [
      "app:///_next/static/chunks/main.js",
      INJECTED_SCRIPT,
    ]);
    expect(
      isFacebookAndroidBridgeError(event, FACEBOOK_ANDROID_UA)
    ).toBeFalsy();
  });
});

describe(isClerkScriptLoadFailure, () => {
  const event = errorEvent("Clerk: Failed to load Clerk JS", []);

  it("matches inside an in-app browser", () => {
    expect(isClerkScriptLoadFailure(event, FACEBOOK_ANDROID_UA)).toBeTruthy();
  });

  it("still reports the failure from a normal browser", () => {
    expect(isClerkScriptLoadFailure(event, CHROME_DESKTOP_UA)).toBeFalsy();
  });
});
