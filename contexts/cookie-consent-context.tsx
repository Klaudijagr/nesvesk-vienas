"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  hasConsented: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  updateConsent: (consent: CookieConsent) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(
  null
);

const COOKIE_CONSENT_KEY = "cookie_consent";

// The stored consent lives in localStorage; these listeners re-render the
// provider when this tab changes it.
const consentListeners = new Set<() => void>();

const subscribeToConsent = (listener: () => void) => {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
};

const getStoredConsent = () => localStorage.getItem(COOKIE_CONSENT_KEY);

// The server (and the hydration render) has no stored consent.
const getServerStoredConsent = () => null;

const isCookieConsent = (value: unknown): value is CookieConsent =>
  typeof value === "object" &&
  value !== null &&
  "necessary" in value &&
  typeof value.necessary === "boolean" &&
  "analytics" in value &&
  typeof value.analytics === "boolean" &&
  "marketing" in value &&
  typeof value.marketing === "boolean";

const parseConsent = (stored: string | null): CookieConsent | null => {
  if (stored === null || stored === "") {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(stored);
    return isCookieConsent(parsed) ? parsed : null;
  } catch {
    // Invalid stored value, will show banner
    return null;
  }
};

export const CookieConsentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    getServerStoredConsent
  );
  const consent = useMemo(() => parseConsent(storedConsent), [storedConsent]);
  const hasConsented = consent !== null;

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    for (const listener of consentListeners) {
      listener();
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }, [saveConsent]);

  const acceptNecessary = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }, [saveConsent]);

  const updateConsent = useCallback(
    (newConsent: CookieConsent) => {
      saveConsent(newConsent);
    },
    [saveConsent]
  );

  const value = useMemo(
    () => ({
      consent,
      hasConsented,
      acceptAll,
      acceptNecessary,
      updateConsent,
    }),
    [consent, hasConsented, acceptAll, acceptNecessary, updateConsent]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};
