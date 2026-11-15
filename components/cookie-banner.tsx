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
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
        {showSettings ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cookie Settings</h3>
              <button
                className="p-1 text-slate-500 hover:text-slate-700"
                onClick={() => {
                  setShowSettings(false);
                }}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
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
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-muted-foreground text-sm">
                    Help us improve our website
                  </p>
                </div>
                <input
                  checked={analytics}
                  className="h-5 w-5 rounded text-amber-500 focus:ring-amber-500"
                  onChange={(e) => {
                    setAnalytics(e.target.checked);
                  }}
                  type="checkbox"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-muted-foreground text-sm">
                    Personalized content and updates
                  </p>
                </div>
                <input
                  checked={marketing}
                  className="h-5 w-5 rounded text-amber-500 focus:ring-amber-500"
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
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600"
                onClick={acceptAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Cookie className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm">
                  We use cookies to enhance your experience. By continuing to
                  visit this site you agree to our use of cookies.{" "}
                  <Link
                    className="text-amber-600 underline hover:text-amber-700"
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
              <Button
                className="bg-amber-500 hover:bg-amber-600"
                onClick={acceptAll}
                size="sm"
              >
                Accept All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
