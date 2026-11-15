"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
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
import { posthog } from "posthog-js";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";

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
import type { City, HolidayDate } from "@/lib/types";
import {
  CITIES,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  LANGUAGES,
  VIBES_OPTIONS,
} from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS: readonly Step[] = [1, 2, 3, 4, 5, 6];

const isStep = (value: number): value is Step => STEPS.some((s) => s === value);

type HostingStatus = "can-host" | "may-host" | "cant-host";
type GuestStatus = "looking" | "maybe-guest" | "not-looking";

const isHostingStatus = (value: string): value is HostingStatus =>
  value === "can-host" || value === "may-host" || value === "cant-host";

const isGuestStatus = (value: string): value is GuestStatus =>
  value === "looking" || value === "maybe-guest" || value === "not-looking";

const isCity = (value: string): value is City =>
  CITIES.some((city) => city === value);

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string | number;
  city: City;
}

// Type for profile from getMyProfile query
type ProfileData = NonNullable<
  ReturnType<typeof useQuery<typeof api.profiles.getMyProfile>>
>;

// Default values for profile initialization
const DEFAULT_HOSTING_STATUS = "cant-host";
const DEFAULT_GUEST_STATUS = "looking";
const DEFAULT_CITY = "Vilnius";

// Whole-number age from the form field. An empty field stays NaN, as before.
const parseAge = (age: string | number): number => {
  if (typeof age === "number") {
    return age;
  }
  return age === "" ? Number.NaN : Math.trunc(Number(age));
};

// Helper to extract form data from profile
const getFormDataFromProfile = (profile: ProfileData): ProfileFormData => ({
  firstName: profile.firstName ?? "",
  lastName: profile.lastName ?? "",
  age: profile.age ?? "",
  city: profile.city ?? DEFAULT_CITY,
});

// Helper to extract profile state initialization
const getInitialStateFromProfile = (profile: ProfileData) => ({
  hostingStatus: profile.hostingStatus ?? DEFAULT_HOSTING_STATUS,
  guestStatus: profile.guestStatus ?? DEFAULT_GUEST_STATUS,
  hostingDates: (profile.hostingDates ?? []) as HolidayDate[],
  guestDates: (profile.guestDates ?? []) as HolidayDate[],
  formData: getFormDataFromProfile(profile),
  bio: profile.bio ?? "",
  languages: (profile.languages ?? []) as (typeof LANGUAGES)[number][],
  dietaryInfo: profile.dietaryInfo ?? [],
  vibes: profile.vibes ?? [],
  smokingAllowed: profile.smokingAllowed ?? false,
  drinkingAllowed: profile.drinkingAllowed ?? true,
  petsAllowed: profile.petsAllowed ?? false,
  hasPets: profile.hasPets ?? false,
});

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

// Heading for a group of buttons. Looks like a form label, but renders a <span>
// because it does not belong to a single control.
const GroupLabel = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Label asChild className={className}>
    <span>{children}</span>
  </Label>
);

// Step 1: Preferences
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
  hostingStatus: string;
  setHostingStatus: (v: string) => void;
  guestStatus: string;
  setGuestStatus: (v: string) => void;
  hostingDates: HolidayDate[];
  toggleHostingDate: (d: HolidayDate) => void;
  guestDates: HolidayDate[];
  toggleGuestDate: (d: HolidayDate) => void;
}) => (
  <div className="space-y-8">
    <div className="space-y-3">
      <GroupLabel className="text-base font-medium">
        Are you open to hosting?
      </GroupLabel>
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
      <GroupLabel className="text-base font-medium">
        Are you looking to be a guest?
      </GroupLabel>
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

// Step 2: Basic Info
const Step2BasicInfo = ({
  formData,
  setFormData,
  userImageUrl,
}: {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  userImageUrl?: string;
}) => (
  <div className="space-y-4">
    <PhotoGallery fallbackPhotoUrl={userImageUrl} />
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, firstName: e.target.value }));
          }}
          placeholder="Your first name"
          value={formData.firstName}
        />
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
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          max={120}
          min={18}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, age: e.target.value }));
          }}
          placeholder="18+"
          type="number"
          value={formData.age}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="city">City</Label>
        <select
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          id="city"
          onChange={(e) => {
            const city = e.target.value;
            if (isCity(city)) {
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
      <GroupLabel>Languages you speak *</GroupLabel>
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
  dietaryInfo: string[];
  toggleDietary: (d: string) => void;
  vibes: string[];
  toggleVibe: (v: string) => void;
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <GroupLabel>Dietary preferences</GroupLabel>
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
      <GroupLabel>What vibe are you looking for?</GroupLabel>
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
      <GroupLabel className="text-base">Lifestyle preferences</GroupLabel>
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

const EditProfileForm = ({
  initial,
}: {
  // Form state starts from the profile as it was when the editor opened
  initial: ReturnType<typeof getInitialStateFromProfile>;
}) => {
  const router = useRouter();
  const { user } = useUser();
  const upsertProfile = useMutation(api.profiles.upsertProfile);

  const [step, setStep] = useState<Step>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Preferences
  const [hostingStatus, setHostingStatus] = useState<HostingStatus>(
    initial.hostingStatus
  );
  const [guestStatus, setGuestStatus] = useState<GuestStatus>(
    initial.guestStatus
  );
  const [hostingDates, setHostingDates] = useState<HolidayDate[]>(
    initial.hostingDates
  );
  const [guestDates, setGuestDates] = useState<HolidayDate[]>(
    initial.guestDates
  );

  // Step 2: Basic Info
  const [formData, setFormData] = useState<ProfileFormData>(initial.formData);

  // Step 3: Bio
  const [bio, setBio] = useState(initial.bio);

  // Step 4: Languages
  const [languages, setLanguages] = useState<(typeof LANGUAGES)[number][]>(
    initial.languages
  );

  // Step 5: Dietary & Vibes
  const [dietaryInfo, setDietaryInfo] = useState<string[]>(initial.dietaryInfo);
  const [vibes, setVibes] = useState<string[]>(initial.vibes);

  // Step 6: Lifestyle
  const [smokingAllowed, setSmokingAllowed] = useState(initial.smokingAllowed);
  const [drinkingAllowed, setDrinkingAllowed] = useState(
    initial.drinkingAllowed
  );
  const [petsAllowed, setPetsAllowed] = useState(initial.petsAllowed);
  const [hasPets, setHasPets] = useState(initial.hasPets);

  const selectHostingStatus = (id: string) => {
    if (isHostingStatus(id)) {
      setHostingStatus(id);
    }
  };

  const selectGuestStatus = (id: string) => {
    if (isGuestStatus(id)) {
      setGuestStatus(id);
    }
  };

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
    return [...combined] as HolidayDate[];
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

  const toggleDietary = (diet: string) => {
    setDietaryInfo((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const toggleVibe = (vibe: string) => {
    setVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleNext = () => {
    const nextStep = step + 1;
    if (isStep(nextStep)) {
      posthog.capture("profile_edit_step_completed", {
        step_completed: step,
        next_step: nextStep,
      });
      setStep(nextStep);
    }
  };

  const handleBack = () => {
    const previousStep = step - 1;
    if (isStep(previousStep)) {
      setStep(previousStep);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const availableDates = getAvailableDates();
      if (availableDates.length === 0) {
        availableDates.push(...HOLIDAY_DATES);
      }

      await upsertProfile({
        role: getRole(),
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
        availableDates,
        dietaryInfo,
        amenities: [],
        houseRules: [],
        vibes,
        smokingAllowed,
        drinkingAllowed,
        petsAllowed,
        hasPets,
      });
      posthog.capture("profile_updated", {
        role: getRole(),
        hosting_status: hostingStatus,
        guest_status: guestStatus,
        city: formData.city,
        languages_count: languages.length,
        vibes_count: vibes.length,
        has_pets: hasPets,
      });
      toast.success("Profile updated successfully!");
      router.push("/settings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
    setIsSaving(false);
  };

  // Validation
  const isStep1Valid =
    (hostingStatus === "cant-host" ? true : hostingDates.length > 0) ||
    (guestStatus === "not-looking" ? true : guestDates.length > 0);
  const isStep2Valid = formData.firstName.length > 0;
  const isStep3Valid = bio.length >= 10;
  const isStep4Valid = languages.length > 0;

  // Step descriptions
  const stepDescriptions: Record<Step, string> = {
    1: "Update your hosting and guest preferences",
    2: "Update your basic information",
    3: "Update your bio",
    4: "Update your languages",
    5: "Update dietary preferences & vibes",
    6: "Update lifestyle preferences",
  };

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1: {
        return (
          <Step1Preferences
            guestDates={guestDates}
            guestStatus={guestStatus}
            hostingDates={hostingDates}
            hostingStatus={hostingStatus}
            setGuestStatus={selectGuestStatus}
            setHostingStatus={selectHostingStatus}
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

  // Check if current step is valid
  const isCurrentStepValid = () => {
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
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-between">
              <Link href="/settings">
                <Button size="sm" variant="ghost">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Settings
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <CardDescription>{stepDescriptions[step]}</CardDescription>
            <div className="mt-4 flex justify-center gap-2">
              {STEPS.map((s) => (
                <button
                  aria-label={`Go to step ${s}`}
                  className={`h-2 w-6 rounded-full transition-colors ${
                    s <= step ? "bg-red-500" : "bg-gray-200"
                  }`}
                  key={s}
                  onClick={() => {
                    setStep(s);
                  }}
                  type="button"
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
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
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  disabled={isSaving}
                  onClick={() => {
                    void handleSave();
                  }}
                  type="button"
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EditProfilePage = () => {
  const router = useRouter();
  const profile = useQuery(api.profiles.getMyProfile);

  // Show loading while profile is loading
  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  // Redirect if no profile exists
  if (profile === null) {
    router.push("/onboarding");
    return null;
  }

  return <EditProfileForm initial={getInitialStateFromProfile(profile)} />;
};

export default EditProfilePage;
