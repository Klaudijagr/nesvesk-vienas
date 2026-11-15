"use client";

import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCookieConsent } from "@/contexts/cookie-consent-context";

import { Button } from "./ui/button";

export const CookieBanner = () => {
  const { hasConsented, acceptAll, acceptNecessary, updateConsent } =
    useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  if (hasConsented) {
    return null;
  }

  const handleSavePreferences = () => {
    updateConsent({
      necessary: true,
      analytics,
      marketing,
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="border-border mx-auto max-w-4xl rounded-xl border bg-white p-4 shadow-lg sm:p-6">
        {showSettings ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cookie Settings</h3>
              <button
                className="text-muted-foreground hover:text-foreground/80 p-1"
                onClick={() => {
                  setShowSettings(false);
                }}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                <div>
                  <p className="font-medium">Necessary</p>
                  <p className="text-muted-foreground text-sm">
                    Required for the website to function
                  </p>
                </div>
                <span className="text-muted-foreground text-sm">
                  Always active
                </span>
              </div>
              <label className="bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-3">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-muted-foreground text-sm">
                    Help us improve our website
                  </p>
                </div>
                <input
                  checked={analytics}
                  className="text-gold-strong focus:ring-gold-rich h-5 w-5 rounded"
                  onChange={(e) => {
                    setAnalytics(e.target.checked);
                  }}
                  type="checkbox"
                />
              </label>
              <label className="bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-3">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-muted-foreground text-sm">
                    Personalized content and updates
                  </p>
                </div>
                <input
                  checked={marketing}
                  className="text-gold-strong focus:ring-gold-rich h-5 w-5 rounded"
                  onChange={(e) => {
                    setMarketing(e.target.checked);
                  }}
                  type="checkbox"
                />
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                className="flex-1"
                onClick={handleSavePreferences}
                variant="outline"
              >
                Save Preferences
              </Button>
              <Button className="flex-1" onClick={acceptAll} variant="warning">
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:flex-1">
              <div className="bg-gold-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Cookie className="text-gold-strong h-5 w-5" />
              </div>
              <div>
                <p className="text-sm">
                  We use cookies to enhance your experience. By continuing to
                  visit this site you agree to our use of cookies.{" "}
                  <Link
                    className="text-gold-strong hover:text-gold-deep underline"
                    href="/cookies"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button
                onClick={() => {
                  setShowSettings(true);
                }}
                size="sm"
                variant="ghost"
              >
                Settings
              </Button>
              <Button onClick={acceptNecessary} size="sm" variant="outline">
                Necessary Only
              </Button>
              <Button onClick={acceptAll} size="sm" variant="warning">
                Accept All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
