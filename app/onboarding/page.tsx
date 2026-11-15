"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
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

import { PhotoGallery } from "@/components/photo-gallery";
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

const STEPS = [0, 1, 2, 3, 4, 5, 6] as const;
type Step = (typeof STEPS)[number];

const HOSTING_STATUSES = ["can-host", "may-host", "cant-host"] as const;
type HostingStatus = (typeof HOSTING_STATUSES)[number];
const GUEST_STATUSES = ["looking", "maybe-guest", "not-looking"] as const;
type GuestStatus = (typeof GUEST_STATUSES)[number];
type City = (typeof CITIES)[number];

// Same classes the shared Label renders, for headings of button groups
// (a <label> needs a single form control to point at).
const GROUP_LABEL_CLASS =
  "flex items-center gap-2 text-sm leading-none font-medium select-none";
// What Label resolves to with a text-base override (the size drops leading-none).
const GROUP_HEADING_CLASS =
  "flex items-center gap-2 text-base font-medium select-none";

const toggleItem = <T,>(items: readonly T[], item: T): T[] =>
  items.includes(item)
    ? items.filter((existing) => existing !== item)
    : [...items, item];

// The age field is a number input, so its value is "" or a numeric string.
const parseAge = (age: string | number): number =>
  typeof age === "number" ? age : Math.trunc(Number(age));

type IconType = "check" | "question" | "x";
type ColorType = "green" | "amber" | "red";

interface PreferenceOption {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
  colorType: ColorType;
  showDates: boolean;
}

// Step 0: GDPR Consent
const Step0Consent = ({
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
}) => (
  <div className="space-y-6">
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-800">
        Before you continue, please review and accept our Terms of Service and
        Privacy Policy. This is required to use our platform.
      </p>
    </div>

    <div className="space-y-4">
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
        <input
          checked={termsAccepted}
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
          }}
          type="checkbox"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Terms of Service</p>
          <p className="mt-1 text-sm text-gray-600">
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
          onChange={(e) => {
            setPrivacyAccepted(e.target.checked);
          }}
          type="checkbox"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Privacy Policy</p>
          <p className="mt-1 text-sm text-gray-600">
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
          readOnly
          type="checkbox"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">Safety Guidelines</p>
          <p className="mt-1 text-sm text-gray-600">
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
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-dashed border-gray-300 p-4 transition-colors hover:bg-gray-50">
          <input
            checked={marketingConsent}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            onChange={(e) => {
              setMarketingConsent(e.target.checked);
            }}
            type="checkbox"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              Marketing Communications{" "}
              <span className="font-normal text-gray-500">(optional)</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              I would like to receive occasional updates about new features,
              community events, and holiday celebration tips. You can
              unsubscribe at any time.
            </p>
          </div>
        </label>
      </div>
    </div>

    <p className="text-center text-xs text-gray-500">
      By continuing, you confirm you are at least 18 years old.
    </p>
  </div>
);

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
const IconBadge = memo(
  ({
    type,
    colorType,
    isSelected,
  }: {
    type: IconType;
    colorType: ColorType;
    isSelected: boolean;
  }) => {
    const bgColor = isSelected
      ? COLOR_SCHEMES[colorType].iconBg
      : "bg-gray-400";

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
  }
);

IconBadge.displayName = "IconBadge";

// Memoized date button
const DateButton = memo(
  ({
    date,
    isSelected,
    colorType,
    onToggle,
  }: {
    date: HolidayDate;
    isSelected: boolean;
    colorType: ColorType;
    onToggle: (date: HolidayDate) => void;
  }) => {
    const c = COLOR_SCHEMES[colorType];

    return (
      <motion.button
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
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
  }
);

DateButton.displayName = "DateButton";

// Memoized preference card with inline dates
const PreferenceCardWithDates = memo(
  ({
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
  }) => {
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
            className={`mb-1 text-sm font-bold ${
              isSelected ? c.title : "text-gray-800"
            }`}
          >
            {option.title}
          </h3>
          <p className={`text-xs ${isSelected ? c.desc : "text-gray-500"}`}>
            {option.description}
          </p>
        </button>

        {showDates && (
          <motion.div
            animate={{ opacity: 1 }}
            className={`border-t ${c.border} px-3 pb-3`}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -10, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <p className={`mb-2 pt-2 text-xs font-medium ${c.title}`}>
                Select dates:
              </p>
              <div className="flex flex-wrap gap-1">
                {HOLIDAY_DATES.map((date, index) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 10 }}
                    key={`${option.id}-${date}`}
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
                  {selectedDates.length === 1 ? "" : "s"} selected
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }
);

PreferenceCardWithDates.displayName = "PreferenceCardWithDates";

// Step 1: Preferences with animated cards
const Step1Preferences = ({
  hostingStatus,
  setHostingStatus,
  guestStatus,
  setGuestStatus,
  hostingDates,
  toggleHostingDate,
  guestDates,
  toggleGuestDate,
}: {
  hostingStatus: HostingStatus;
  setHostingStatus: (v: HostingStatus) => void;
  guestStatus: GuestStatus;
  setGuestStatus: (v: GuestStatus) => void;
  hostingDates: HolidayDate[];
  toggleHostingDate: (d: HolidayDate) => void;
  guestDates: HolidayDate[];
  toggleGuestDate: (d: HolidayDate) => void;
}) => {
  const handleHostingSelect = (id: string) => {
    const status = HOSTING_STATUSES.find((candidate) => candidate === id);
    if (status !== undefined) {
      setHostingStatus(status);
    }
  };
  const handleGuestSelect = (id: string) => {
    const status = GUEST_STATUSES.find((candidate) => candidate === id);
    if (status !== undefined) {
      setGuestStatus(status);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className={GROUP_HEADING_CLASS}>Are you open to hosting?</div>
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {HOSTING_OPTIONS.map((option) => (
            <PreferenceCardWithDates
              isSelected={hostingStatus === option.id}
              key={option.id}
              onSelect={handleHostingSelect}
              onToggleDate={toggleHostingDate}
              option={option}
              selectedDates={hostingDates}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className={GROUP_HEADING_CLASS}>
          Are you looking to be a guest?
        </div>
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3">
          {GUEST_OPTIONS.map((option) => (
            <PreferenceCardWithDates
              isSelected={guestStatus === option.id}
              key={option.id}
              onSelect={handleGuestSelect}
              onToggleDate={toggleGuestDate}
              option={option}
              selectedDates={guestDates}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Step 2: Basic Info
const Step2BasicInfo = ({
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
}) => {
  const [touched, setTouched] = useState<{ firstName: boolean; age: boolean }>({
    firstName: false,
    age: false,
  });

  const ageValue = parseAge(formData.age);

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
            onBlur={() => {
              setTouched((prev) => ({ ...prev, firstName: true }));
            }}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, firstName: e.target.value }));
            }}
            placeholder="Your first name"
            value={formData.firstName}
          />
          {firstNameError && (
            <p className="text-xs text-red-500">First name is required</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, lastName: e.target.value }));
            }}
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
            onBlur={() => {
              setTouched((prev) => ({ ...prev, age: true }));
            }}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, age: e.target.value }));
            }}
            placeholder="18+"
            type="number"
            value={formData.age}
          />
          {ageError && (
            <p className="text-xs text-red-500">{ageErrorMessage}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <select
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            id="city"
            onChange={(e) => {
              const city = CITIES.find(
                (candidate) => candidate === e.target.value
              );
              if (city !== undefined) {
                setFormData((prev) => ({ ...prev, city }));
              }
            }}
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
};

// Step 3: Bio
const Step3Bio = ({
  bio,
  setBio,
}: {
  bio: string;
  setBio: (v: string) => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <Label htmlFor="bio">Tell others about yourself *</Label>
      <Textarea
        className="min-h-[150px]"
        id="bio"
        onChange={(e) => {
          setBio(e.target.value);
        }}
        placeholder="Share a bit about yourself, your interests, and what kind of holiday experience you're looking for..."
        value={bio}
      />
      <p className="text-muted-foreground text-xs">
        Minimum 10 characters ({bio.length}/10+)
      </p>
    </div>
  </div>
);

// Step 4: Languages
const Step4Languages = ({
  languages,
  toggleLanguage,
}: {
  languages: (typeof LANGUAGES)[number][];
  toggleLanguage: (l: (typeof LANGUAGES)[number]) => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <div className={GROUP_LABEL_CLASS}>Languages you speak *</div>
      <p className="text-muted-foreground text-sm">
        Select all languages you&apos;re comfortable communicating in
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang}
            onClick={() => {
              toggleLanguage(lang);
            }}
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

// Step 5: Dietary & Vibes
const Step5DietaryVibes = ({
  dietaryInfo,
  toggleDietary,
  vibes,
  toggleVibe,
}: {
  dietaryInfo: (typeof DIETARY_OPTIONS)[number][];
  toggleDietary: (d: (typeof DIETARY_OPTIONS)[number]) => void;
  vibes: (typeof VIBES_OPTIONS)[number][];
  toggleVibe: (v: (typeof VIBES_OPTIONS)[number]) => void;
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className={GROUP_LABEL_CLASS}>Dietary preferences</div>
      <p className="text-muted-foreground text-sm">
        Let hosts know about your dietary needs (optional)
      </p>
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((diet) => (
          <Button
            key={diet}
            onClick={() => {
              toggleDietary(diet);
            }}
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
      <div className={GROUP_LABEL_CLASS}>What vibe are you looking for?</div>
      <p className="text-muted-foreground text-sm">
        Help others understand what kind of gathering you prefer
      </p>
      <div className="flex flex-wrap gap-2">
        {VIBES_OPTIONS.map((vibe) => (
          <Button
            key={vibe}
            onClick={() => {
              toggleVibe(vibe);
            }}
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

// Step 6: Lifestyle preferences
const Step6Lifestyle = ({
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
}) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <div className={GROUP_HEADING_CLASS}>Lifestyle preferences</div>
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
              onClick={() => {
                setDrinkingAllowed(true);
              }}
              size="sm"
              type="button"
              variant={drinkingAllowed ? "default" : "outline"}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                setDrinkingAllowed(false);
              }}
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
              onClick={() => {
                setSmokingAllowed(true);
              }}
              size="sm"
              type="button"
              variant={smokingAllowed ? "default" : "outline"}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                setSmokingAllowed(false);
              }}
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
              onClick={() => {
                setPetsAllowed(true);
              }}
              size="sm"
              type="button"
              variant={petsAllowed ? "default" : "outline"}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                setPetsAllowed(false);
              }}
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
              onClick={() => {
                setHasPets(true);
              }}
              size="sm"
              type="button"
              variant={hasPets ? "default" : "outline"}
            >
              Yes
            </Button>
            <Button
              onClick={() => {
                setHasPets(false);
              }}
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

const getRole = (
  hostingStatus: HostingStatus,
  guestStatus: GuestStatus
): "host" | "guest" | "both" => {
  const canHost = hostingStatus === "can-host" || hostingStatus === "may-host";
  const isGuest = guestStatus === "looking" || guestStatus === "maybe-guest";

  if (canHost && isGuest) {
    return "both";
  }
  if (canHost) {
    return "host";
  }
  return "guest";
};

// A profile with a name, bio and language has already finished onboarding.
const isProfileComplete = (
  profile:
    | { firstName: string; bio: string; languages: readonly unknown[] }
    | null
    | undefined
): boolean =>
  profile !== null &&
  profile !== undefined &&
  profile.firstName !== "" &&
  profile.bio !== "" &&
  profile.languages.length > 0;

// Step descriptions
const STEP_DESCRIPTIONS: Record<Step, string> = {
  0: "Review and accept our policies",
  1: "What brings you here this holiday season?",
  2: "Tell us about yourself",
  3: "Write a short bio",
  4: "Select your languages",
  5: "Dietary preferences & vibes",
  6: "Almost done! Lifestyle preferences",
};

// Shown under the Next button while a required step is incomplete
// (steps 5 and 6 are optional).
const STEP_INVALID_MESSAGES: Partial<Record<Step, string>> = {
  0: "Please accept the Terms of Service and Privacy Policy to continue",
  1: "Please select at least one date for hosting or visiting",
  2: "Please enter your first name and age (must be 18+)",
  3: "Please write at least 10 characters in your bio",
  4: "Please select at least one language",
};

interface PrefillSource {
  hasUser: boolean;
  clerkFirstName: string;
  clerkLastName: string;
  firstName: string;
}

// Pre-fill the name from the Clerk user whenever the Clerk user or the first
// name changes while the first name is empty. The trigger values are compared
// during render (instead of in an effect) so the prefill lands without an
// extra paint.
const useClerkNamePrefill = <T extends { firstName: string; lastName: string }>(
  user:
    | { firstName: string | null; lastName: string | null }
    | null
    | undefined,
  firstName: string,
  setFormData: React.Dispatch<React.SetStateAction<T>>
) => {
  const hasUser = user !== null && user !== undefined;
  const clerkFirstName = user?.firstName ?? "";
  const clerkLastName = user?.lastName ?? "";
  const [prefillSource, setPrefillSource] = useState<PrefillSource | null>(
    null
  );
  if (
    prefillSource?.hasUser !== hasUser ||
    prefillSource.clerkFirstName !== clerkFirstName ||
    prefillSource.clerkLastName !== clerkLastName ||
    prefillSource.firstName !== firstName
  ) {
    setPrefillSource({ hasUser, clerkFirstName, clerkLastName, firstName });
    if (hasUser && firstName === "") {
      setFormData((prev) => ({
        ...prev,
        firstName: clerkFirstName,
        lastName: clerkLastName,
      }));
    }
  }
};

const OnboardingPage = () => {
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

  // Step 0: GDPR Consent
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Step 1: Preferences
  const [hostingStatus, setHostingStatus] =
    useState<HostingStatus>("cant-host");
  const [guestStatus, setGuestStatus] = useState<GuestStatus>("looking");
  const [hostingDates, setHostingDates] = useState<HolidayDate[]>([]);
  const [guestDates, setGuestDates] = useState<HolidayDate[]>([]);

  // Step 2: Basic Info
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "" as string | number,
    city: "Vilnius" as City,
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

  useClerkNamePrefill(user, formData.firstName, setFormData);

  // Sync Google photo on mount
  const googlePhotoUrl = user?.imageUrl;
  useEffect(() => {
    if (
      googlePhotoUrl !== undefined &&
      googlePhotoUrl !== "" &&
      profile === null
    ) {
      syncGooglePhoto({ googlePhotoUrl }).catch(() => {
        // Ignore errors if photo sync fails
      });
    }
  }, [googlePhotoUrl, profile, syncGooglePhoto]);

  // If profile already complete, redirect to browse
  const shouldRedirectToBrowse = isProfileComplete(profile);
  useEffect(() => {
    if (shouldRedirectToBrowse) {
      router.push("/browse");
    }
  }, [shouldRedirectToBrowse, router]);

  // Get combined available dates
  const getAvailableDates = (): HolidayDate[] => {
    const combined = new Set([...hostingDates, ...guestDates]);
    return [...combined] as HolidayDate[];
  };

  const toggleHostingDate = (date: HolidayDate) => {
    setHostingDates((prev) => toggleItem(prev, date));
  };

  const toggleGuestDate = (date: HolidayDate) => {
    setGuestDates((prev) => toggleItem(prev, date));
  };

  const toggleLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setLanguages((prev) => toggleItem(prev, lang));
  };

  const toggleDietary = (diet: (typeof DIETARY_OPTIONS)[number]) => {
    setDietaryInfo((prev) => toggleItem(prev, diet));
  };

  const toggleVibe = (vibe: (typeof VIBES_OPTIONS)[number]) => {
    setVibes((prev) => toggleItem(prev, vibe));
  };

  const handleNext = () => {
    const next = STEPS.find((candidate) => candidate === step + 1);
    if (next !== undefined) {
      setStep(next);
    }
  };

  const handleBack = () => {
    const previous = STEPS.find((candidate) => candidate === step - 1);
    if (previous !== undefined) {
      setStep(previous);
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
        role: getRole(hostingStatus, guestStatus),
        // Save the actual granular status and dates
        hostingStatus,
        guestStatus,
        hostingDates,
        guestDates,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age: parseAge(formData.age),
        city: formData.city,
        bio,
        languages,
        // Keep for backwards compat
        availableDates,
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
    } catch (error) {
      setIsSaving(false);
      throw error;
    }
    setIsSaving(false);
  };

  // Validation
  const isStep0Valid = termsAccepted && privacyAccepted;
  const isStep1Valid =
    (hostingStatus === "cant-host" ? true : hostingDates.length > 0) ||
    (guestStatus === "not-looking" ? true : guestDates.length > 0);
  const ageValue = parseAge(formData.age);
  const isStep2Valid =
    formData.firstName.length > 0 && !Number.isNaN(ageValue) && ageValue >= 18;
  const isStep3Valid = bio.length >= 10;
  const isStep4Valid = languages.length > 0;

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 0: {
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
      }
      case 1: {
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
      }
      case 2: {
        return (
          <Step2BasicInfo
            formData={formData}
            setFormData={setFormData}
            userImageUrl={user?.imageUrl}
          />
        );
      }
      case 3: {
        return <Step3Bio bio={bio} setBio={setBio} />;
      }
      case 4: {
        return (
          <Step4Languages
            languages={languages}
            toggleLanguage={toggleLanguage}
          />
        );
      }
      case 5: {
        return (
          <Step5DietaryVibes
            dietaryInfo={dietaryInfo}
            toggleDietary={toggleDietary}
            toggleVibe={toggleVibe}
            vibes={vibes}
          />
        );
      }
      case 6: {
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
      }
      default: {
        return null;
      }
    }
  };

  // Check if current step is valid for next button
  // (steps 5 and 6 are optional, always valid)
  const stepValidity: Record<Step, boolean> = {
    0: isStep0Valid,
    1: isStep1Valid,
    2: isStep2Valid,
    3: isStep3Valid,
    4: isStep4Valid,
    5: true,
    6: true,
  };
  const isCurrentStepValid = stepValidity[step];

  // Show loading while auth is initializing or checking profile
  if (isAuthLoading || profile === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  // If profile already complete, show loading while redirecting (prevents flash)
  if (shouldRedirectToBrowse) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Nešvęsk vienas</CardTitle>
        <CardDescription>{STEP_DESCRIPTIONS[step]}</CardDescription>
        <div className="mt-4 flex justify-center gap-2">
          {STEPS.map((s) => (
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
                disabled={!isCurrentStepValid}
                onClick={handleNext}
                type="button"
              >
                {step === 0 ? "I Agree & Continue" : "Next"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={isSaving}
                onClick={() => {
                  void handleComplete();
                }}
                type="button"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>
            )}
          </div>
          {!isCurrentStepValid && step < 6 && (
            <p className="text-center text-sm text-amber-600">
              {STEP_INVALID_MESSAGES[step]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingPage;
