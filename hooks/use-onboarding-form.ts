"use client";

import { useCallback, useState } from "react";
import type { HolidayDate } from "@/lib/types";
import { CITIES, DIETARY_OPTIONS, HOLIDAY_DATES, LANGUAGES, VIBES_OPTIONS } from "@/lib/types";

export type OnboardingFormData = {
  // Step 0: GDPR Consent
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
  // Step 1: Preferences
  hostingStatus: string;
  guestStatus: string;
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
};

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

export function useOnboardingForm() {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  // Generic updater for any field
  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Toggle functions for array fields
  const toggleArrayItem = useCallback(
    <T>(field: keyof OnboardingFormData, item: T) => {
      setFormData((prev) => {
        const arr = prev[field] as T[];
        const newArr = arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item];
        return { ...prev, [field]: newArr };
      });
    },
    []
  );

  const toggleHostingDate = useCallback(
    (date: HolidayDate) => toggleArrayItem("hostingDates", date),
    [toggleArrayItem]
  );

  const toggleGuestDate = useCallback(
    (date: HolidayDate) => toggleArrayItem("guestDates", date),
    [toggleArrayItem]
  );

  const toggleLanguage = useCallback(
    (lang: (typeof LANGUAGES)[number]) => toggleArrayItem("languages", lang),
    [toggleArrayItem]
  );

  const toggleDietary = useCallback(
    (diet: (typeof DIETARY_OPTIONS)[number]) => toggleArrayItem("dietaryInfo", diet),
    [toggleArrayItem]
  );

  const toggleVibe = useCallback(
    (vibe: (typeof VIBES_OPTIONS)[number]) => toggleArrayItem("vibes", vibe),
    [toggleArrayItem]
  );

  // Derived values
  const getRole = useCallback((): "host" | "guest" | "both" => {
    const canHost =
      formData.hostingStatus === "can-host" || formData.hostingStatus === "may-host";
    const isGuest =
      formData.guestStatus === "looking" || formData.guestStatus === "maybe-guest";

    if (canHost && isGuest) return "both";
    if (canHost) return "host";
    return "guest";
  }, [formData.hostingStatus, formData.guestStatus]);

  const getAvailableDates = useCallback((): HolidayDate[] => {
    const combined = new Set([...formData.hostingDates, ...formData.guestDates]);
    return Array.from(combined) as HolidayDate[];
  }, [formData.hostingDates, formData.guestDates]);

  // Validation
  const isStep0Valid = formData.termsAccepted && formData.privacyAccepted;

  const isStep1Valid =
    (formData.hostingStatus !== "cant-host" ? formData.hostingDates.length > 0 : true) ||
    (formData.guestStatus !== "not-looking" ? formData.guestDates.length > 0 : true);

  const ageValue =
    typeof formData.age === "number"
      ? formData.age
      : Number.parseInt(formData.age as string, 10);

  const isStep2Valid =
    formData.firstName.length > 0 && !Number.isNaN(ageValue) && ageValue >= 18;

  const isStep3Valid = formData.bio.length >= 10;

  const isStep4Valid = formData.languages.length > 0;

  // Pre-fill from external data (e.g., Clerk user)
  const prefillFromUser = useCallback(
    (user: { firstName?: string | null; lastName?: string | null }) => {
      if (user && !formData.firstName) {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
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
      hostingStatus: formData.hostingStatus as "can-host" | "may-host" | "cant-host",
      guestStatus: formData.guestStatus as "looking" | "maybe-guest" | "not-looking",
      hostingDates: formData.hostingDates,
      guestDates: formData.guestDates,
      firstName: formData.firstName,
      lastName: formData.lastName || undefined,
      age:
        typeof formData.age === "number"
          ? formData.age
          : Number.parseInt(formData.age as string, 10),
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
}
