"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { Locale } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)["en"];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_KEY = "locale";
const DEFAULT_LOCALE: Locale = "lt";
const SUPPORTED_LOCALES: readonly Locale[] = ["lt", "en", "ua", "ru"];

const isLocale = (value: string | null): value is Locale =>
  SUPPORTED_LOCALES.some((supported) => supported === value);

// The saved locale lives in localStorage; these listeners re-render the
// provider when this tab changes it.
const localeListeners = new Set<() => void>();

const subscribeToLocale = (listener: () => void) => {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
};

const getSavedLocale = () => localStorage.getItem(LOCALE_KEY);

// The server (and the hydration render) has no saved locale.
const getServerSavedLocale = () => null;

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const savedLocale = useSyncExternalStore(
    subscribeToLocale,
    getSavedLocale,
    getServerSavedLocale
  );
  const locale = isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem(LOCALE_KEY, newLocale);
    for (const listener of localeListeners) {
      listener();
    }
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
