"use client";

import { useCallback, useState } from "react";

import { HOLIDAY_DATES } from "@/lib/types";
import type {
  HolidayDate,
  CITIES,
  DIETARY_OPTIONS,
  LANGUAGES,
  VIBES_OPTIONS,
} from "@/lib/types";

export interface OnboardingFormData {
  // Step 0: GDPR Consent
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
  // Step 1: Preferences
  hostingStatus: "can-host" | "may-host" | "cant-host";
  guestStatus: "looking" | "maybe-guest" | "not-looking";
  hostingDates: HolidayDate[];
  guestDates: HolidayDate[];
  // Step 2: Basic Info
  firstName: string;
  lastName: string;
  age: string | number;
  city: (typeof CITIES)[number];
  // Step 3: Bio
  bio: string;
  // Step 4: Languages
  languages: (typeof LANGUAGES)[number][];
  // Step 5: Dietary & Vibes
  dietaryInfo: (typeof DIETARY_OPTIONS)[number][];
  vibes: (typeof VIBES_OPTIONS)[number][];
  // Step 6: Lifestyle
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  hasPets: boolean;
}

const initialFormData: OnboardingFormData = {
  termsAccepted: false,
  privacyAccepted: false,
  marketingConsent: false,
  hostingStatus: "cant-host",
  guestStatus: "looking",
  hostingDates: [],
  guestDates: [],
  firstName: "",
  lastName: "",
  age: "",
  city: "Vilnius",
  bio: "",
  languages: [],
  dietaryInfo: [],
  vibes: [],
  smokingAllowed: false,
  drinkingAllowed: true,
  petsAllowed: false,
  hasPets: false,
};

const toggleItem = <T>(items: readonly T[], item: T): T[] =>
  items.includes(item)
    ? items.filter((existing) => existing !== item)
    : [...items, item];

const parseAge = (age: string | number): number =>
  typeof age === "number" ? age : Math.trunc(Number(age));

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  // Generic updater for any field
  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      field: K,
      value: OnboardingFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Toggle functions for array fields
  const toggleHostingDate = useCallback((date: HolidayDate) => {
    setFormData((prev) => ({
      ...prev,
      hostingDates: toggleItem(prev.hostingDates, date),
    }));
  }, []);

  const toggleGuestDate = useCallback((date: HolidayDate) => {
    setFormData((prev) => ({
      ...prev,
      guestDates: toggleItem(prev.guestDates, date),
    }));
  }, []);

  const toggleLanguage = useCallback((lang: (typeof LANGUAGES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      languages: toggleItem(prev.languages, lang),
    }));
  }, []);

  const toggleDietary = useCallback(
    (diet: (typeof DIETARY_OPTIONS)[number]) => {
      setFormData((prev) => ({
        ...prev,
        dietaryInfo: toggleItem(prev.dietaryInfo, diet),
      }));
    },
    []
  );

  const toggleVibe = useCallback((vibe: (typeof VIBES_OPTIONS)[number]) => {
    setFormData((prev) => ({ ...prev, vibes: toggleItem(prev.vibes, vibe) }));
  }, []);

  // Derived values
  const getRole = useCallback((): "host" | "guest" | "both" => {
    const canHost =
      formData.hostingStatus === "can-host" ||
      formData.hostingStatus === "may-host";
    const isGuest =
      formData.guestStatus === "looking" ||
      formData.guestStatus === "maybe-guest";

    if (canHost && isGuest) {
      return "both";
    }
    if (canHost) {
      return "host";
    }
    return "guest";
  }, [formData.hostingStatus, formData.guestStatus]);

  const getAvailableDates = useCallback((): HolidayDate[] => {
    const combined = new Set([
      ...formData.hostingDates,
      ...formData.guestDates,
    ]);
    return [...combined] as HolidayDate[];
  }, [formData.hostingDates, formData.guestDates]);

  // Validation
  const isStep0Valid = formData.termsAccepted && formData.privacyAccepted;

  const isStep1Valid =
    (formData.hostingStatus === "cant-host"
      ? true
      : formData.hostingDates.length > 0) ||
    (formData.guestStatus === "not-looking"
      ? true
      : formData.guestDates.length > 0);

  const ageValue = parseAge(formData.age);

  const isStep2Valid =
    formData.firstName.length > 0 && !Number.isNaN(ageValue) && ageValue >= 18;

  const isStep3Valid = formData.bio.length >= 10;

  const isStep4Valid = formData.languages.length > 0;

  // Pre-fill from external data (e.g., Clerk user)
  const prefillFromUser = useCallback(
    (user: { firstName?: string | null; lastName?: string | null }) => {
      if (formData.firstName === "") {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
        }));
      }
    },
    [formData.firstName]
  );

  // Get submit data with defaults
  const getSubmitData = useCallback(() => {
    let availableDates = getAvailableDates();
    if (availableDates.length === 0) {
      availableDates = [...HOLIDAY_DATES];
    }

    return {
      role: getRole(),
      hostingStatus: formData.hostingStatus,
      guestStatus: formData.guestStatus,
      hostingDates: formData.hostingDates,
      guestDates: formData.guestDates,
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      age: parseAge(formData.age),
      city: formData.city,
      bio: formData.bio,
      languages: formData.languages,
      availableDates,
      dietaryInfo: formData.dietaryInfo,
      amenities: [] as string[],
      houseRules: [] as string[],
      vibes: formData.vibes,
      smokingAllowed: formData.smokingAllowed,
      drinkingAllowed: formData.drinkingAllowed,
      petsAllowed: formData.petsAllowed,
      hasPets: formData.hasPets,
      marketingEmails: formData.marketingConsent,
      isVisible: true,
    };
  }, [formData, getRole, getAvailableDates]);

  return {
    formData,
    updateField,
    // Toggle functions
    toggleHostingDate,
    toggleGuestDate,
    toggleLanguage,
    toggleDietary,
    toggleVibe,
    // Derived values
    getRole,
    getAvailableDates,
    // Validation
    isStep0Valid,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    // Helpers
    prefillFromUser,
    getSubmitData,
  };
};
