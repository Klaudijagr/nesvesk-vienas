"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const profile = useQuery(api.profiles.getMyProfile);
  const upsertProfile = useMutation(api.profiles.upsertProfile);
  const syncGooglePhoto = useMutation(api.files.syncGooglePhoto);

  const [step, setStep] = useState<Step>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    role: "guest" as "host" | "guest" | "both",
    firstName: "",
    lastName: "",
    age: "" as string | number,
    city: "Vilnius" as (typeof CITIES)[number],
    bio: "",
    languages: [] as (typeof LANGUAGES)[number][],
    availableDates: [] as (typeof HOLIDAY_DATES)[number][],
  });

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

  // Sync Google photo on mount if user has one and no profile photos
  useEffect(() => {
    if (user?.imageUrl && profile === null) {
      syncGooglePhoto({ googlePhotoUrl: user.imageUrl }).catch(() => {
        // Ignore - profile might not exist yet
      });
    }
  }, [user?.imageUrl, profile, syncGooglePhoto]);

  // If profile already complete, redirect to browse
  useEffect(() => {
    if (profile?.firstName && profile?.bio && profile?.languages.length > 0) {
      router.push("/browse");
    }
  }, [profile, router]);

  const toggleLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleDate = (date: (typeof HOLIDAY_DATES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.includes(date)
        ? prev.availableDates.filter((d) => d !== date)
        : [...prev.availableDates, date],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
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
      await upsertProfile({
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age:
          typeof formData.age === "number"
            ? formData.age
            : Number.parseInt(formData.age as string, 10) || undefined,
        city: formData.city,
        bio: formData.bio,
        languages: formData.languages,
        availableDates: formData.availableDates,
        dietaryInfo: [],
        amenities: [],
        houseRules: [],
        vibes: [],
        smokingAllowed: false,
        drinkingAllowed: true,
        petsAllowed: false,
        hasPets: false,
      });
      router.push("/browse");
    } finally {
      setIsSaving(false);
    }
  };

  const isStep1Valid = formData.firstName.length > 0;
  const isStep2Valid = formData.bio.length > 10;
  const isStep3Valid =
    formData.languages.length > 0 && formData.availableDates.length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Nešvęsk Vienas</CardTitle>
          <CardDescription>
            Let's set up your profile so you can start connecting
          </CardDescription>
          {/* Step indicator */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
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
          {/* Step 1: Basic Info + Photo */}
          {step === 1 && (
            <div className="space-y-4">
              <PhotoGallery fallbackPhotoUrl={user?.imageUrl} />

              <div className="space-y-1">
                <Label>I want to be a</Label>
                <div className="flex gap-2">
                  {(["guest", "host", "both"] as const).map((r) => (
                    <Button
                      className="flex-1 capitalize"
                      key={r}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: r }))
                      }
                      type="button"
                      variant={formData.role === r ? "default" : "outline"}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

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

          {/* Step 2: Bio */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="bio">Tell others about yourself *</Label>
                <Textarea
                  className="min-h-[150px]"
                  id="bio"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  placeholder="Share a bit about yourself, your interests, and what kind of holiday experience you're looking for..."
                  value={formData.bio}
                />
                <p className="text-muted-foreground text-xs">
                  Minimum 10 characters ({formData.bio.length}/10+)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Languages & Dates */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Languages you speak *</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      size="sm"
                      type="button"
                      variant={
                        formData.languages.includes(lang)
                          ? "default"
                          : "outline"
                      }
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available dates *</Label>
                <p className="text-muted-foreground text-xs">
                  Select all dates you're available for holiday gatherings
                </p>
                <div className="flex flex-wrap gap-2">
                  {HOLIDAY_DATES.map((date) => (
                    <Button
                      key={date}
                      onClick={() => toggleDate(date)}
                      size="sm"
                      type="button"
                      variant={
                        formData.availableDates.includes(date)
                          ? "default"
                          : "outline"
                      }
                    >
                      {date}
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
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                disabled={
                  (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
                }
                onClick={handleNext}
                type="button"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled={!isStep3Valid || isSaving}
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
    </div>
  );
}
