"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PhotoGallery } from "@/components/PhotoGallery";
import {
  GUEST_OPTIONS,
  HOSTING_OPTIONS,
  PreferenceCard,
} from "@/components/preference-card";
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
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const profile = useQuery(api.profiles.getMyProfile);
  const upsertProfile = useMutation(api.profiles.upsertProfile);
  const syncGooglePhoto = useMutation(api.files.syncGooglePhoto);

  const [step, setStep] = useState<Step>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Step 1: Preferences
  const [hostingStatus, setHostingStatus] = useState("cant-host");
  const [guestStatus, setGuestStatus] = useState("looking");
  const [hostingDates, setHostingDates] = useState<
    (typeof HOLIDAY_DATES)[number][]
  >([]);
  const [guestDates, setGuestDates] = useState<
    (typeof HOLIDAY_DATES)[number][]
  >([]);

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
  const getAvailableDates = (): (typeof HOLIDAY_DATES)[number][] => {
    const combined = new Set([...hostingDates, ...guestDates]);
    return Array.from(combined) as (typeof HOLIDAY_DATES)[number][];
  };

  const toggleHostingDate = (date: (typeof HOLIDAY_DATES)[number]) => {
    setHostingDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleGuestDate = (date: (typeof HOLIDAY_DATES)[number]) => {
    setGuestDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const toggleLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
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

      await upsertProfile({
        role: getRole(),
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age:
          typeof formData.age === "number"
            ? formData.age
            : Number.parseInt(formData.age as string, 10) || undefined,
        city: formData.city,
        bio,
        languages,
        availableDates,
        dietaryInfo: [],
        amenities: [],
        houseRules: [],
        vibes: [],
        smokingAllowed: false,
        drinkingAllowed: true,
        petsAllowed: false,
        hasPets: false,
      });
      setCompleted(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Validation
  const isStep1Valid =
    (hostingStatus !== "cant-host" ? hostingDates.length > 0 : true) ||
    (guestStatus !== "not-looking" ? guestDates.length > 0 : true);
  const isStep2Valid = formData.firstName.length > 0;
  const isStep3Valid = bio.length >= 10;
  const isStep4Valid = languages.length > 0;

  const showHostingDates =
    hostingStatus === "can-host" || hostingStatus === "may-host";
  const showGuestDates =
    guestStatus === "looking" || guestStatus === "maybe-guest";

  if (completed) {
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
          <Button onClick={() => router.push("/browse")} variant="outline">
            Skip for now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Nešvęsk vienas</CardTitle>
        <CardDescription>
          {step === 1 && "What brings you here this holiday season?"}
          {step === 2 && "Tell us about yourself"}
          {step === 3 && "Write a short bio"}
          {step === 4 && "Almost done! Select your languages"}
        </CardDescription>

        {/* Step indicator */}
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              className={`h-2 w-8 rounded-full transition-colors ${
                s <= step ? "bg-red-500" : "bg-gray-200"
              }`}
              key={s}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Preference Cards */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Hosting Status */}
            <div className="space-y-3">
              <Label className="font-medium text-base">
                Are you open to hosting?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {HOSTING_OPTIONS.map((option) => (
                  <PreferenceCard
                    isSelected={hostingStatus === option.id}
                    key={option.id}
                    onSelect={setHostingStatus}
                    option={option}
                  />
                ))}
              </div>

              {/* Hosting Dates Dropdown */}
              {showHostingDates && (
                <div className="mt-4 rounded-lg bg-red-50 p-4">
                  <Label className="font-medium text-red-900 text-sm">
                    Which dates can you host?
                  </Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {HOLIDAY_DATES.map((date) => (
                      <Button
                        key={date}
                        onClick={() => toggleHostingDate(date)}
                        size="sm"
                        type="button"
                        variant={
                          hostingDates.includes(date) ? "default" : "outline"
                        }
                      >
                        {date}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guest Status */}
            <div className="space-y-3">
              <Label className="font-medium text-base">
                Are you looking to be a guest?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {GUEST_OPTIONS.map((option) => (
                  <PreferenceCard
                    isSelected={guestStatus === option.id}
                    key={option.id}
                    onSelect={setGuestStatus}
                    option={option}
                  />
                ))}
              </div>

              {/* Guest Dates Dropdown */}
              {showGuestDates && (
                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                  <Label className="font-medium text-blue-900 text-sm">
                    Which dates are you free?
                  </Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {HOLIDAY_DATES.map((date) => (
                      <Button
                        key={date}
                        onClick={() => toggleGuestDate(date)}
                        size="sm"
                        type="button"
                        variant={
                          guestDates.includes(date) ? "default" : "outline"
                        }
                      >
                        {date}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info + Photo */}
        {step === 2 && (
          <div className="space-y-4">
            <PhotoGallery fallbackPhotoUrl={user?.imageUrl} />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="Your first name"
                  value={formData.firstName}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: e.target.value,
                    }))
                  }
                  placeholder="18+"
                  type="number"
                  value={formData.age}
                />
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
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
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
        )}

        {/* Step 4: Languages */}
        {step === 4 && (
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
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button onClick={handleBack} type="button" variant="outline">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
              onClick={handleNext}
              type="button"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              disabled={!isStep4Valid || isSaving}
              onClick={handleComplete}
              type="button"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Complete Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
