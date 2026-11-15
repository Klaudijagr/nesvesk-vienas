"use client";

import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const IN_APP_BROWSER_RE =
  /FBAN|FBAV|Instagram|Messenger|LinkedIn|TikTok|Snapchat|Pinterest|Twitter|Line|WeChat|MicroMessenger/iu;
const ANDROID_RE = /Android/iu;

// Common in-app browser identifiers (Instagram/FB/TikTok/etc).
const detectInAppBrowser = (userAgent: string): boolean =>
  IN_APP_BROWSER_RE.test(userAgent);

const buildChromeIntentUrl = (currentUrl: string): string | null => {
  try {
    const u = new URL(currentUrl);
    const scheme = u.protocol.replace(":", "");
    return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=${scheme};package=com.android.chrome;end`;
  } catch {
    return null;
  }
};

const isAndroid = (userAgent: string): boolean => ANDROID_RE.test(userAgent);

const subscribeToNothing = () => () => {
  // The browser identity and the entry URL do not change while the gate is shown.
};
const getIsInApp = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || "";
  const params = new URLSearchParams(window.location.search);
  const forceGate = params.get("forceGate") === "true";
  return forceGate || detectInAppBrowser(ua);
};
const getCurrentUrl = (): string => window.location.href;
const getServerSnapshot = (): null => null;

type Mode = "sign-in" | "sign-up";

export const InAppBrowserGate = ({
  mode,
  children,
}: {
  mode: Mode;
  children: React.ReactElement;
}) => {
  // Both values are null on the server and during hydration, then resolve in
  // the browser.
  const isInApp = useSyncExternalStore<boolean | null>(
    subscribeToNothing,
    getIsInApp,
    getServerSnapshot
  );
  const currentUrl = useSyncExternalStore<string | null>(
    subscribeToNothing,
    getCurrentUrl,
    getServerSnapshot
  );

  const copyLink = async () => {
    if (currentUrl === null) {
      return;
    }
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied. Paste it into Safari/Chrome.");
    } catch {
      toast.error("Couldn’t copy automatically. Copy it manually.");
    }
  };

  const copyLabel = useMemo(
    () => (mode === "sign-in" ? "Copy sign-in link" : "Copy sign-up link"),
    [mode]
  );

  // Important: we intentionally avoid rendering `children` until the browser
  // has been identified on the client. Some in-app browsers (notably Facebook on iOS)
  // can crash during auth widget initialization (e.g. `postMessage`) and we
  // want to gate those browsers before mounting Clerk.
  if (isInApp === null || currentUrl === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Checking your browser…</CardTitle>
            <CardDescription>
              Preparing a safe sign-in experience.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isInApp) {
    return children;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Open in your browser</CardTitle>
          <CardDescription>
            Social apps use an in-app browser that can break secure sign-in.
            Open this page in Safari/Chrome to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              If the button doesn&apos;t work, tap the menu (•••) in the top
              corner and choose{" "}
              <span className="font-medium">Open in browser</span>.
            </p>
          </div>

          <div className="space-y-2">
            <Input readOnly value={currentUrl} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  const ua = navigator.userAgent || navigator.vendor || "";

                  // Best-effort:
                  // - Android: try Chrome intent (often escapes in-app webviews)
                  // - Otherwise: open a new tab/window (some in-app browsers hand off to Safari)
                  if (isAndroid(ua)) {
                    const intentUrl = buildChromeIntentUrl(currentUrl);
                    if (intentUrl !== null) {
                      window.location.href = intentUrl;
                      return;
                    }
                  }

                  window.open(currentUrl, "_blank", "noopener,noreferrer");
                }}
                type="button"
              >
                <ExternalLink className="h-4 w-4" />
                Open in browser
              </Button>

              <Button
                className="w-full"
                onClick={() => {
                  void copyLink();
                }}
                type="button"
                variant="outline"
              >
                <LinkIcon className="h-4 w-4" />
                {copyLabel}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
