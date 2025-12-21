"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { HolidayDate } from "@/lib/types";
import {
  CITIES,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  LANGUAGES,
  VIBES_OPTIONS,
} from "@/lib/types";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type IconType = "check" | "question" | "x";
type ColorType = "green" | "amber" | "red";

type PreferenceOption = {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
  colorType: ColorType;
  showDates: boolean;
};

// Step 0: GDPR Consent
function Step0Consent({
  termsAccepted,
  setTermsAccepted,
  privacyAccepted,
  setPrivacyAccepted,
  marketingConsent,
  setMarketingConsent,
}: {
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (v: boolean) => void;
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-800 text-sm">
          Before you continue, please review and accept our Terms of Service and
          Privacy Policy. This is required to use our platform.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
          <input
            checked={termsAccepted}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            onChange={(e) => setTermsAccepted(e.target.checked)}
            type="checkbox"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Terms of Service</p>
            <p className="mt-1 text-gray-600 text-sm">
              I have read and agree to the{" "}
              <Link
                className="font-medium text-red-600 underline hover:text-red-700"
                href="/terms"
                target="_blank"
              >
                Terms of Service
              </Link>
              , including the community guidelines and acceptable use policy.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
          <input
            checked={privacyAccepted}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            type="checkbox"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Privacy Policy</p>
            <p className="mt-1 text-gray-600 text-sm">
              I have read and agree to the{" "}
              <Link
                className="font-medium text-red-600 underline hover:text-red-700"
                href="/privacy"
                target="_blank"
              >
                Privacy Policy
              </Link>
              , and I consent to the processing of my personal data as described
              therein.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
          <input
            checked={termsAccepted && privacyAccepted}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
            disabled
            type="checkbox"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Safety Guidelines</p>
            <p className="mt-1 text-gray-600 text-sm">
              I understand and agree to follow the{" "}
              <Link
                className="font-medium text-red-600 underline hover:text-red-700"
                href="/safety"
                target="_blank"
              >
                Safety Guidelines
              </Link>{" "}
              when meeting other users.
            </p>
          </div>
        </label>

        <div className="mt-6 border-t pt-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 border-dashed p-4 transition-colors hover:bg-gray-50">
            <input
              checked={marketingConsent}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              onChange={(e) => setMarketingConsent(e.target.checked)}
              type="checkbox"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                Marketing Communications{" "}
                <span className="font-normal text-gray-500">(optional)</span>
              </p>
              <p className="mt-1 text-gray-600 text-sm">
                I would like to receive occasional updates about new features,
                community events, and holiday celebration tips. You can
                unsubscribe at any time.
              </p>
            </div>
          </label>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs">
        By continuing, you confirm you are at least 18 years old.
      </p>
    </div>
  );
}

const HOSTING_OPTIONS: PreferenceOption[] = [
  {
    id: "can-host",
    title: "I Can Host",
    description: "I'm eager to welcome guests",
    iconType: "check",
    colorType: "green",
    showDates: true,
  },
  {
    id: "may-host",
    title: "Maybe",
    description: "Depending on circumstances",
    iconType: "question",
    colorType: "amber",
    showDates: true,
  },
  {
    id: "cant-host",
    title: "Not Hosting",
    description: "Not able to host this season",
    iconType: "x",
    colorType: "red",
    showDates: false,
  },
];

const GUEST_OPTIONS: PreferenceOption[] = [
  {
    id: "looking",
    title: "Looking for Host",
    description: "Looking for somewhere to celebrate",
    iconType: "check",
    colorType: "green",
    showDates: true,
  },
  {
    id: "maybe-guest",
    title: "Open to It",
    description: "Might be interested",
    iconType: "question",
    colorType: "amber",
    showDates: true,
  },
  {
    id: "not-looking",
    title: "Not Looking",
    description: "Not looking for a host",
    iconType: "x",
    colorType: "red",
    showDates: false,
  },
];

const COLOR_SCHEMES = {
  green: {
    border: "border-green-500",
    bg: "bg-green-50",
    iconBg: "bg-green-600",
    title: "text-green-900",
    desc: "text-green-700",
    dateSelected: "bg-green-600 text-white border-green-600",
    dateUnselected:
      "bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400",
  },
  amber: {
    border: "border-amber-500",
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
    title: "text-amber-900",
    desc: "text-amber-700",
    dateSelected: "bg-amber-500 text-white border-amber-500",
    dateUnselected:
      "bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400",
  },
  red: {
    border: "border-red-500",
    bg: "bg-red-50",
    iconBg: "bg-red-600",
    title: "text-red-900",
    desc: "text-red-700",
    dateSelected: "bg-red-600 text-white border-red-600",
    dateUnselected:
      "bg-white border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400",
  },
} as const;

// Memoized icon component
const IconBadge = memo(function IconBadgeInner({
  type,
  colorType,
  isSelected,
}: {
  type: IconType;
  colorType: ColorType;
  isSelected: boolean;
}) {
  const bgColor = isSelected ? COLOR_SCHEMES[colorType].iconBg : "bg-gray-400";

  return (
    <div className={`rounded-full p-2.5 ${bgColor} transition-colors`}>
      {type === "check" && (
        <Check className="h-5 w-5 text-white" strokeWidth={3} />
      )}
      {type === "question" && (
        <HelpCircle className="h-5 w-5 text-white" strokeWidth={3} />
      )}
      {type === "x" && <X className="h-5 w-5 text-white" strokeWidth={3} />}
    </div>
  );
});

// Memoized date button
const DateButton = memo(function DateButtonInner({
  date,
  isSelected,
  colorType,
  onToggle,
}: {
  date: HolidayDate;
  isSelected: boolean;
  colorType: ColorType;
  onToggle: (date: HolidayDate) => void;
}) {
  const c = COLOR_SCHEMES[colorType];

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-md border px-2 py-1 font-medium text-xs transition-colors ${
        isSelected ? c.dateSelected : c.dateUnselected
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(date);
      }}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {date}
    </motion.button>
  );
});

// Memoized preference card with inline dates
const PreferenceCardWithDates = memo(function PreferenceCardInner({
  option,
  isSelected,
  onSelect,
  selectedDates,
  onToggleDate,
}: {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedDates: HolidayDate[];
  onToggleDate: (date: HolidayDate) => void;
}) {
  const c = COLOR_SCHEMES[option.colorType];
  const showDates = isSelected && option.showDates;

  const handleSelect = useCallback(() => {
    onSelect(option.id);
  }, [onSelect, option.id]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-colors duration-200 ${
        isSelected
          ? `${c.border} ${c.bg} shadow-md`
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <button
        className="flex w-full cursor-pointer flex-col items-center p-4 text-center"
        onClick={handleSelect}
        type="button"
      >
        <div className="mb-2">
          <IconBadge
            colorType={option.colorType}
            isSelected={isSelected}
            type={option.iconType}
          />
        </div>
        <h3
          className={`mb-1 font-bold text-sm ${
            isSelected ? c.title : "text-gray-800"
          }`}
        >
          {option.title}
        </h3>
        <p className={`text-xs ${isSelected ? c.desc : "text-gray-500"}`}>
          {option.description}
        </p>
      </button>

      <AnimatePresence initial={false}>
        {showDates && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className={`border-t ${c.border} px-3 pb-3`}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -10, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <p className={`mb-2 pt-2 font-medium text-xs ${c.title}`}>
                Select dates:
              </p>
              <div className="flex flex-wrap gap-1">
                {HOLIDAY_DATES.map((date, index) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    key={date}
                    transition={{ delay: 0.03 * index, duration: 0.15 }}
                  >
                    <DateButton
                      colorType={option.colorType}
                      date={date}
                      isSelected={selectedDates.includes(date)}
                      onToggle={onToggleDate}
                    />
                  </motion.div>
                ))}
              </div>
              {selectedDates.length > 0 && (
                <motion.p
                  animate={{ opacity: 1 }}
                  className={`mt-2 text-xs ${c.desc}`}
                  initial={{ opacity: 0 }}
                >
                  {selectedDates.length} date
                  {selectedDates.length !== 1 ? "s" : ""} selected
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Step 1: Preferences with animated cards
function Step1Preferences({
  hostingStatus,
  setHostingStatus,
  guestStatus,
  setGuestStatus,
  hostingDates,
  toggleHostingDate,
  guestDates,
  toggleGuestDate,
}: {
  hostingStatus: string;
  setHostingStatus: (v: string) => void;
  guestStatus: string;
  setGuestStatus: (v: string) => void;
  hostingDates: HolidayDate[];
  toggleHostingDate: (d: HolidayDate) => void;
  guestDates: HolidayDate[];
  toggleGuestDate: (d: HolidayDate) => void;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label className="font-medium text-base">
          Are you open to hosting?
        </Label>
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {HOSTING_OPTIONS.map((option) => (
            <PreferenceCardWithDates
              isSelected={hostingStatus === option.id}
              key={option.id}
              onSelect={setHostingStatus}
              onToggleDate={toggleHostingDate}
              option={option}
              selectedDates={hostingDates}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="font-medium text-base">
          Are you looking to be a guest?
        </Label>
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {GUEST_OPTIONS.map((option) => (
            <PreferenceCardWithDates
              isSelected={guestStatus === option.id}
              key={option.id}
              onSelect={setGuestStatus}
              onToggleDate={toggleGuestDate}
              option={option}
              selectedDates={guestDates}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 2: Basic Info
function Step2BasicInfo({
  formData,
  setFormData,
  userImageUrl,
}: {
  formData: {
    firstName: string;
    lastName: string;
    age: string | number;
    city: (typeof CITIES)[number];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      age: string | number;
      city: (typeof CITIES)[number];
    }>
  >;
  userImageUrl?: string;
}) {
  const [touched, setTouched] = useState<{ firstName: boolean; age: boolean }>({
    firstName: false,
    age: false,
  });

  const ageValue =
    typeof formData.age === "number"
      ? formData.age
      : Number.parseInt(formData.age as string, 10);

  const firstNameError = touched.firstName && formData.firstName.length === 0;
  const ageEmpty = formData.age === "" || formData.age === undefined;
  const ageError =
    touched.age && (ageEmpty || Number.isNaN(ageValue) || ageValue < 18);
  const getAgeErrorMessage = () => {
    if (ageEmpty) {
      return "Age is required";
    }
    if (ageValue < 18) {
      return "You must be 18 or older";
    }
    return "";
  };
  const ageErrorMessage = getAgeErrorMessage();

  return (
    <div className="space-y-4">
      <PhotoGallery fallbackPhotoUrl={userImageUrl} />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            className={firstNameError ? "border-red-500" : ""}
            id="firstName"
            onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="Your first name"
            value={formData.firstName}
          />
          {firstNameError && (
            <p className="text-red-500 text-xs">First name is required</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Optional"
            value={formData.lastName}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="age">Age *</Label>
          <Input
            className={ageError ? "border-red-500" : ""}
            id="age"
            max={120}
            min={18}
            onBlur={() => setTouched((prev) => ({ ...prev, age: true }))}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, age: e.target.value }))
            }
            placeholder="18+"
            type="number"
            value={formData.age}
          />
          {ageError && (
            <p className="text-red-500 text-xs">{ageErrorMessage}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            id="city"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                city: e.target.value as (typeof CITIES)[number],
              }))
            }
            value={formData.city}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Step 3: Bio
function Step3Bio({
  bio,
  setBio,
}: {
  bio: string;
  setBio: (v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="bio">Tell others about yourself *</Label>
        <Textarea
          className="min-h-[150px]"
          id="bio"
          onChange={(e) => setBio(e.target.value)}
          placeholder="Share a bit about yourself, your interests, and what kind of holiday experience you're looking for..."
          value={bio}
        />
        <p className="text-muted-foreground text-xs">
          Minimum 10 characters ({bio.length}/10+)
        </p>
      </div>
    </div>
  );
}

// Step 4: Languages
function Step4Languages({
  languages,
  toggleLanguage,
}: {
  languages: (typeof LANGUAGES)[number][];
  toggleLanguage: (l: (typeof LANGUAGES)[number]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Languages you speak *</Label>
        <p className="text-muted-foreground text-sm">
          Select all languages you're comfortable communicating in
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              size="lg"
              type="button"
              variant={languages.includes(lang) ? "default" : "outline"}
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 5: Dietary & Vibes
function Step5DietaryVibes({
  dietaryInfo,
  toggleDietary,
  vibes,
  toggleVibe,
}: {
  dietaryInfo: (typeof DIETARY_OPTIONS)[number][];
  toggleDietary: (d: (typeof DIETARY_OPTIONS)[number]) => void;
  vibes: (typeof VIBES_OPTIONS)[number][];
  toggleVibe: (v: (typeof VIBES_OPTIONS)[number]) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Dietary preferences</Label>
        <p className="text-muted-foreground text-sm">
          Let hosts know about your dietary needs (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((diet) => (
            <Button
              key={diet}
              onClick={() => toggleDietary(diet)}
              size="sm"
              type="button"
              variant={dietaryInfo.includes(diet) ? "default" : "outline"}
            >
              {diet}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>What vibe are you looking for?</Label>
        <p className="text-muted-foreground text-sm">
          Help others understand what kind of gathering you prefer
        </p>
        <div className="flex flex-wrap gap-2">
          {VIBES_OPTIONS.map((vibe) => (
            <Button
              key={vibe}
              onClick={() => toggleVibe(vibe)}
              size="sm"
              type="button"
              variant={vibes.includes(vibe) ? "default" : "outline"}
            >
              {vibe}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 6: Lifestyle preferences
function Step6Lifestyle({
  smokingAllowed,
  setSmokingAllowed,
  drinkingAllowed,
  setDrinkingAllowed,
  petsAllowed,
  setPetsAllowed,
  hasPets,
  setHasPets,
}: {
  smokingAllowed: boolean;
  setSmokingAllowed: (v: boolean) => void;
  drinkingAllowed: boolean;
  setDrinkingAllowed: (v: boolean) => void;
  petsAllowed: boolean;
  setPetsAllowed: (v: boolean) => void;
  hasPets: boolean;
  setHasPets: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">Lifestyle preferences</Label>
        <p className="text-muted-foreground text-sm">
          These help match you with compatible hosts and guests
        </p>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alcohol</p>
              <p className="text-muted-foreground text-sm">
                Are you okay with alcohol at gatherings?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setDrinkingAllowed(true)}
                size="sm"
                type="button"
                variant={drinkingAllowed ? "default" : "outline"}
              >
                Yes
              </Button>
              <Button
                onClick={() => setDrinkingAllowed(false)}
                size="sm"
                type="button"
                variant={drinkingAllowed ? "outline" : "default"}
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Smoking</p>
              <p className="text-muted-foreground text-sm">
                Are you okay with smoking?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSmokingAllowed(true)}
                size="sm"
                type="button"
                variant={smokingAllowed ? "default" : "outline"}
              >
                Yes
              </Button>
              <Button
                onClick={() => setSmokingAllowed(false)}
                size="sm"
                type="button"
                variant={smokingAllowed ? "outline" : "default"}
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pets welcome</p>
              <p className="text-muted-foreground text-sm">
                Are you okay with pets at gatherings?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPetsAllowed(true)}
                size="sm"
                type="button"
                variant={petsAllowed ? "default" : "outline"}
              >
                Yes
              </Button>
              <Button
                onClick={() => setPetsAllowed(false)}
                size="sm"
                type="button"
                variant={petsAllowed ? "outline" : "default"}
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">I have pets</p>
              <p className="text-muted-foreground text-sm">
                Do you have pets that might be present?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setHasPets(true)}
                size="sm"
                type="button"
                variant={hasPets ? "default" : "outline"}
              >
                Yes
              </Button>
              <Button
                onClick={() => setHasPets(false)}
                size="sm"
                type="button"
                variant={hasPets ? "outline" : "default"}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Completed state
function CompletedState({ onSkip }: { onSkip: () => void }) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">All set!</CardTitle>
        <CardDescription>
          Your profile is saved. Verify your identity to build trust, or skip
          for now.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:justify-center">
        <Button asChild>
          <Link href="/verify">Verify identity</Link>
        </Button>
        <Button onClick={onSkip} variant="outline">
          Skip for now
        </Button>
      </CardContent>
    </Card>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();

  // Only query profile after Convex auth is ready
  const profile = useQuery(
    api.profiles.getMyProfile,
    isAuthLoading || !isAuthenticated ? "skip" : undefined
  );
  const upsertProfile = useMutation(api.profiles.upsertProfile);
  const syncGooglePhoto = useMutation(api.files.syncGooglePhoto);
  const recordConsents = useMutation(api.consents.recordMultipleConsents);

  const [step, setStep] = useState<Step>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [completed, _setCompleted] = useState(false);

  // Step 0: GDPR Consent
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Step 1: Preferences
  const [hostingStatus, setHostingStatus] = useState("cant-host");
  const [guestStatus, setGuestStatus] = useState("looking");
  const [hostingDates, setHostingDates] = useState<HolidayDate[]>([]);
  const [guestDates, setGuestDates] = useState<HolidayDate[]>([]);

  // Step 2: Basic Info
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "" as string | number,
    city: "Vilnius" as (typeof CITIES)[number],
  });

  // Step 3: Bio
  const [bio, setBio] = useState("");

  // Step 4: Languages
  const [languages, setLanguages] = useState<(typeof LANGUAGES)[number][]>([]);

  // Step 5: Dietary & Vibes
  const [dietaryInfo, setDietaryInfo] = useState<
    (typeof DIETARY_OPTIONS)[number][]
  >([]);
  const [vibes, setVibes] = useState<(typeof VIBES_OPTIONS)[number][]>([]);

  // Step 6: Lifestyle
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [drinkingAllowed, setDrinkingAllowed] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [hasPets, setHasPets] = useState(false);

  // Pre-fill from Clerk user data
  useEffect(() => {
    if (user && !formData.firstName) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [user, formData.firstName]);

  // Sync Google photo on mount
  // Sync Google photo on mount
  useEffect(() => {
    if (user?.imageUrl && profile === null) {
      syncGooglePhoto({ googlePhotoUrl: user.imageUrl }).catch(() => {
        // Ignore errors if photo sync fails
      });
    }
  }, [user?.imageUrl, profile, syncGooglePhoto]);

  // If profile already complete, redirect to browse
  useEffect(() => {
    if (
      !completed &&
      profile?.firstName &&
      profile?.bio &&
      profile?.languages.length > 0
    ) {
      router.push("/browse");
    }
  }, [completed, profile, router]);

  // Derive role from statuses
  const getRole = (): "host" | "guest" | "both" => {
    const canHost =
      hostingStatus === "can-host" || hostingStatus === "may-host";
    const isGuest = guestStatus === "looking" || guestStatus === "maybe-guest";

    if (canHost && isGuest) {
      return "both";
    }
    if (canHost) {
      return "host";
    }
    return "guest";
  };

  // Get combined available dates
  const getAvailableDates = (): HolidayDate[] => {
    const combined = new Set([...hostingDates, ...guestDates]);
    return Array.from(combined) as HolidayDate[];
  };

  const toggleHostingDate = (date: HolidayDate) => {
    setHostingDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleGuestDate = (date: HolidayDate) => {
    setGuestDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleDietary = (diet: (typeof DIETARY_OPTIONS)[number]) => {
    setDietaryInfo((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const toggleVibe = (vibe: (typeof VIBES_OPTIONS)[number]) => {
    setVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleNext = () => {
    if (step < 6) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((step - 1) as Step);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const availableDates = getAvailableDates();
      if (availableDates.length === 0) {
        // Default to all dates if none selected
        availableDates.push(...HOLIDAY_DATES);
      }

      // Record GDPR consents first
      const consentsToRecord: {
        purpose:
          | "terms_of_service"
          | "privacy_policy"
          | "marketing_emails"
          | "analytics_cookies";
        consentMethod: "checkbox" | "button" | "cookie_banner";
      }[] = [
        { purpose: "terms_of_service", consentMethod: "checkbox" },
        { purpose: "privacy_policy", consentMethod: "checkbox" },
      ];

      // Only record marketing consent if user opted in
      if (marketingConsent) {
        consentsToRecord.push({
          purpose: "marketing_emails",
          consentMethod: "checkbox",
        });
      }

      await recordConsents({ consents: consentsToRecord });

      await upsertProfile({
        role: getRole(),
        // Save the actual granular status and dates
        hostingStatus: hostingStatus as "can-host" | "may-host" | "cant-host",
        guestStatus: guestStatus as "looking" | "maybe-guest" | "not-looking",
        hostingDates,
        guestDates,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age:
          typeof formData.age === "number"
            ? formData.age
            : Number.parseInt(formData.age as string, 10),
        city: formData.city,
        bio,
        languages,
        availableDates, // Keep for backwards compat
        dietaryInfo,
        amenities: [],
        houseRules: [],
        vibes,
        smokingAllowed,
        drinkingAllowed,
        petsAllowed,
        hasPets,
        // Also save marketing preference to profile
        marketingEmails: marketingConsent,
        // Make profile visible now that onboarding is complete
        isVisible: true,
      });
      // Skip verification step and go directly to browse
      router.push("/browse");
    } finally {
      setIsSaving(false);
    }
  };

  // Validation
  const isStep0Valid = termsAccepted && privacyAccepted;
  const isStep1Valid =
    (hostingStatus !== "cant-host" ? hostingDates.length > 0 : true) ||
    (guestStatus !== "not-looking" ? guestDates.length > 0 : true);
  const ageValue =
    typeof formData.age === "number"
      ? formData.age
      : Number.parseInt(formData.age as string, 10);
  const isStep2Valid =
    formData.firstName.length > 0 && !Number.isNaN(ageValue) && ageValue >= 18;
  const isStep3Valid = bio.length >= 10;
  const isStep4Valid = languages.length > 0;

  // Step descriptions
  const stepDescriptions: Record<Step, string> = {
    0: "Review and accept our policies",
    1: "What brings you here this holiday season?",
    2: "Tell us about yourself",
    3: "Write a short bio",
    4: "Select your languages",
    5: "Dietary preferences & vibes",
    6: "Almost done! Lifestyle preferences",
  };

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Step0Consent
            marketingConsent={marketingConsent}
            privacyAccepted={privacyAccepted}
            setMarketingConsent={setMarketingConsent}
            setPrivacyAccepted={setPrivacyAccepted}
            setTermsAccepted={setTermsAccepted}
            termsAccepted={termsAccepted}
          />
        );
      case 1:
        return (
          <Step1Preferences
            guestDates={guestDates}
            guestStatus={guestStatus}
            hostingDates={hostingDates}
            hostingStatus={hostingStatus}
            setGuestStatus={setGuestStatus}
            setHostingStatus={setHostingStatus}
            toggleGuestDate={toggleGuestDate}
            toggleHostingDate={toggleHostingDate}
          />
        );
      case 2:
        return (
          <Step2BasicInfo
            formData={formData}
            setFormData={setFormData}
            userImageUrl={user?.imageUrl}
          />
        );
      case 3:
        return <Step3Bio bio={bio} setBio={setBio} />;
      case 4:
        return (
          <Step4Languages
            languages={languages}
            toggleLanguage={toggleLanguage}
          />
        );
      case 5:
        return (
          <Step5DietaryVibes
            dietaryInfo={dietaryInfo}
            toggleDietary={toggleDietary}
            toggleVibe={toggleVibe}
            vibes={vibes}
          />
        );
      case 6:
        return (
          <Step6Lifestyle
            drinkingAllowed={drinkingAllowed}
            hasPets={hasPets}
            petsAllowed={petsAllowed}
            setDrinkingAllowed={setDrinkingAllowed}
            setHasPets={setHasPets}
            setPetsAllowed={setPetsAllowed}
            setSmokingAllowed={setSmokingAllowed}
            smokingAllowed={smokingAllowed}
          />
        );
      default:
        return null;
    }
  };

  // Check if current step is valid for next button
  const isCurrentStepValid = () => {
    if (step === 0) {
      return isStep0Valid;
    }
    if (step === 1) {
      return isStep1Valid;
    }
    if (step === 2) {
      return isStep2Valid;
    }
    if (step === 3) {
      return isStep3Valid;
    }
    if (step === 4) {
      return isStep4Valid;
    }
    // Steps 5 and 6 are optional, always valid
    return true;
  };

  // Show loading while auth is initializing or checking profile
  if (isAuthLoading || profile === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  // If profile already complete, show loading while redirecting (prevents flash)
  if (
    !completed &&
    profile?.firstName &&
    profile?.bio &&
    profile?.languages.length > 0
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (completed) {
    return <CompletedState onSkip={() => router.push("/browse")} />;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Nešvęsk vienas</CardTitle>
        <CardDescription>{stepDescriptions[step]}</CardDescription>
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((s) => (
            <div
              className={`h-2 w-6 rounded-full transition-colors ${
                s <= step ? "bg-red-500" : "bg-gray-200"
              }`}
              key={s}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex flex-col gap-2 pt-4">
          <div className="flex justify-between">
            {step > 0 ? (
              <Button onClick={handleBack} type="button" variant="outline">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button
                disabled={!isCurrentStepValid()}
                onClick={handleNext}
                type="button"
              >
                {step === 0 ? "I Agree & Continue" : "Next"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={isSaving}
                onClick={handleComplete}
                type="button"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            )}
          </div>
          {!isCurrentStepValid() && step < 6 && (
            <p className="text-center text-amber-600 text-sm">
              {step === 0 &&
                "Please accept the Terms of Service and Privacy Policy to continue"}
              {step === 1 &&
                "Please select at least one date for hosting or visiting"}
              {step === 2 &&
                "Please enter your first name and age (must be 18+)"}
              {step === 3 && "Please write at least 10 characters in your bio"}
              {step === 4 && "Please select at least one language"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
