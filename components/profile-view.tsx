"use client";

import { useMutation } from "convex/react";
import {
  Calendar,
  Camera,
  Check,
  Cigarette,
  Dog,
  Edit2,
  Globe,
  Home,
  Info,
  Loader2,
  MapPin,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  Wine,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  AMENITIES_OPTIONS,
  CITIES,
  CONCEPT_OPTIONS,
  DIETARY_OPTIONS,
  HOLIDAY_DATES,
  HOUSE_RULES_OPTIONS,
  LANGUAGES,
  VIBES_OPTIONS,
} from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

type ProfileViewProps = {
  profile: Doc<"profiles">;
  isOwnProfile?: boolean;
};

type HostingStatus = "can-host" | "may-host" | "cant-host";
type GuestStatus = "looking" | "maybe-guest" | "not-looking";

type EditableProfile = {
  firstName: string;
  lastName: string;
  age: number | "";
  city: (typeof CITIES)[number];
  bio: string;
  role: "host" | "guest" | "both";
  hostingStatus: HostingStatus;
  guestStatus: GuestStatus;
  hostingDates: (typeof HOLIDAY_DATES)[number][];
  guestDates: (typeof HOLIDAY_DATES)[number][];
  languages: (typeof LANGUAGES)[number][];
  availableDates: (typeof HOLIDAY_DATES)[number][];
  dietaryInfo: (typeof DIETARY_OPTIONS)[number][];
  concept: (typeof CONCEPT_OPTIONS)[number] | "";
  capacity: number | "";
  amenities: (typeof AMENITIES_OPTIONS)[number][];
  vibes: (typeof VIBES_OPTIONS)[number][];
  houseRules: (typeof HOUSE_RULES_OPTIONS)[number][];
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  hasPets: boolean;
};

// Helper to derive role from statuses
function statusesToRole(
  hostingStatus: HostingStatus,
  guestStatus: GuestStatus
): "host" | "guest" | "both" {
  const isHost = hostingStatus === "can-host" || hostingStatus === "may-host";
  const isGuest = guestStatus === "looking" || guestStatus === "maybe-guest";
  if (isHost && isGuest) return "both";
  if (isHost) return "host";
  return "guest";
}

export function ProfileView({ profile, isOwnProfile }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"about" | "home">("about");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const upsertProfile = useMutation(api.profiles.upsertProfile);

  // Editable form state
  const [formData, setFormData] = useState<EditableProfile>({
    firstName: profile.firstName,
    lastName: profile.lastName || "",
    age: profile.age || "",
    city: profile.city,
    bio: profile.bio,
    role: profile.role,
    hostingStatus: (profile.hostingStatus || "cant-host") as HostingStatus,
    guestStatus: (profile.guestStatus || "not-looking") as GuestStatus,
    hostingDates: (profile.hostingDates ||
      []) as (typeof HOLIDAY_DATES)[number][],
    guestDates: (profile.guestDates || []) as (typeof HOLIDAY_DATES)[number][],
    languages: profile.languages as (typeof LANGUAGES)[number][],
    availableDates: profile.availableDates as (typeof HOLIDAY_DATES)[number][],
    dietaryInfo: (profile.dietaryInfo ||
      []) as (typeof DIETARY_OPTIONS)[number][],
    concept: (profile.concept || "") as (typeof CONCEPT_OPTIONS)[number] | "",
    capacity: profile.capacity || "",
    amenities: (profile.amenities ||
      []) as (typeof AMENITIES_OPTIONS)[number][],
    vibes: (profile.vibes || []) as (typeof VIBES_OPTIONS)[number][],
    houseRules: (profile.houseRules ||
      []) as (typeof HOUSE_RULES_OPTIONS)[number][],
    smokingAllowed: profile.smokingAllowed,
    drinkingAllowed: profile.drinkingAllowed,
    petsAllowed: profile.petsAllowed,
    hasPets: profile.hasPets,
  });

  // Photo upload refs
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const isHost = formData.role === "host" || formData.role === "both";
  const isGuest = formData.role === "guest" || formData.role === "both";

  // Build photos array
  const photos = useMemo(() => {
    const allPhotos: string[] = [];
    if (profile.photoUrl) allPhotos.push(profile.photoUrl);
    if (profile.photos) allPhotos.push(...profile.photos);
    return allPhotos.length > 0
      ? allPhotos
      : [
          `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}&backgroundColor=f87171`,
        ];
  }, [profile.photoUrl, profile.photos, profile.firstName]);

  // Save handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Derive role from hosting/guest statuses
      const derivedRole = statusesToRole(
        formData.hostingStatus,
        formData.guestStatus
      );

      // Combine dates for backwards compat
      const combinedDates = [
        ...new Set([...formData.hostingDates, ...formData.guestDates]),
      ] as (typeof HOLIDAY_DATES)[number][];

      await upsertProfile({
        role: derivedRole,
        hostingStatus: formData.hostingStatus,
        guestStatus: formData.guestStatus,
        hostingDates: formData.hostingDates,
        guestDates: formData.guestDates,
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        age: typeof formData.age === "number" ? formData.age : undefined,
        city: formData.city,
        bio: formData.bio,
        languages: formData.languages,
        availableDates: combinedDates,
        dietaryInfo: formData.dietaryInfo,
        concept: formData.concept || undefined,
        capacity:
          typeof formData.capacity === "number" ? formData.capacity : undefined,
        amenities: formData.amenities,
        vibes: formData.vibes,
        houseRules: formData.houseRules,
        smokingAllowed: formData.smokingAllowed,
        drinkingAllowed: formData.drinkingAllowed,
        petsAllowed: formData.petsAllowed,
        hasPets: formData.hasPets,
      });
      setIsEditing(false);
      toast.success("Profile saved!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }, [formData, upsertProfile]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName || "",
      age: profile.age || "",
      city: profile.city,
      bio: profile.bio,
      role: profile.role,
      hostingStatus: (profile.hostingStatus || "cant-host") as HostingStatus,
      guestStatus: (profile.guestStatus || "not-looking") as GuestStatus,
      hostingDates: (profile.hostingDates ||
        []) as (typeof HOLIDAY_DATES)[number][],
      guestDates: (profile.guestDates ||
        []) as (typeof HOLIDAY_DATES)[number][],
      languages: profile.languages as (typeof LANGUAGES)[number][],
      availableDates:
        profile.availableDates as (typeof HOLIDAY_DATES)[number][],
      dietaryInfo: (profile.dietaryInfo ||
        []) as (typeof DIETARY_OPTIONS)[number][],
      concept: (profile.concept || "") as (typeof CONCEPT_OPTIONS)[number] | "",
      capacity: profile.capacity || "",
      amenities: (profile.amenities ||
        []) as (typeof AMENITIES_OPTIONS)[number][],
      vibes: (profile.vibes || []) as (typeof VIBES_OPTIONS)[number][],
      houseRules: (profile.houseRules ||
        []) as (typeof HOUSE_RULES_OPTIONS)[number][],
      smokingAllowed: profile.smokingAllowed,
      drinkingAllowed: profile.drinkingAllowed,
      petsAllowed: profile.petsAllowed,
      hasPets: profile.hasPets,
    });
    setIsEditing(false);
  }, [profile]);

  // Toggle helpers
  const toggleArrayItem = <T extends string>(
    field: keyof EditableProfile,
    item: T
  ) => {
    setFormData((prev) => {
      const arr = prev[field] as T[];
      return {
        ...prev,
        [field]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });
  };

  // Input classes for edit mode
  const inputClass =
    "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500";
  const textareaClass =
    "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-y min-h-[100px]";

  return (
    <div className="pb-20">
      {/* Hidden file input */}
      <input
        accept="image/*"
        className="hidden"
        ref={avatarInputRef}
        type="file"
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 md:flex-row">
        {/* LEFT SIDEBAR - Identity Card */}
        <aside className="w-full flex-shrink-0 md:w-80">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Avatar Section */}
            <div className="p-6 text-center">
              <div className="group relative mx-auto mb-4 h-36 w-36">
                <Image
                  alt={profile.firstName}
                  className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
                  fill
                  src={photos[0]}
                />
                {isOwnProfile && isEditing && (
                  <button
                    className="absolute right-1 bottom-1 rounded-full bg-red-500 p-2 text-white shadow-md transition-colors hover:bg-red-600"
                    onClick={() => avatarInputRef.current?.click()}
                    type="button"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>

              {/* Name */}
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    className={`${inputClass} text-center font-bold`}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="First name"
                    value={formData.firstName}
                  />
                  <input
                    className={`${inputClass} text-center`}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Last name (optional)"
                    value={formData.lastName}
                  />
                </div>
              ) : (
                <h1 className="font-bold text-2xl text-gray-900">
                  {profile.firstName}
                  {profile.lastName && ` ${profile.lastName}`}
                  {profile.age && (
                    <span className="font-normal text-gray-500">
                      , {profile.age}
                    </span>
                  )}
                </h1>
              )}

              {/* Location */}
              <div className="mt-2 flex items-center justify-center gap-1 text-gray-500">
                <MapPin size={16} />
                {isEditing ? (
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
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
                ) : (
                  <span>{profile.city}</span>
                )}
              </div>

              {/* Age (edit mode only) */}
              {isEditing && (
                <div className="mt-2">
                  <input
                    className={`${inputClass} mx-auto w-24 text-center`}
                    max={120}
                    min={18}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        age: e.target.value ? Number(e.target.value) : "",
                      }))
                    }
                    placeholder="Age"
                    type="number"
                    value={formData.age}
                  />
                </div>
              )}

              {/* Role Badges / Selector */}
              <div className="mt-4">
                {isEditing ? (
                  <div className="flex justify-center gap-2">
                    {(["guest", "host", "both"] as const).map((r) => (
                      <button
                        className={`rounded-full px-3 py-1.5 font-medium text-xs transition-colors ${
                          formData.role === r
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        key={r}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: r }))
                        }
                        type="button"
                      >
                        {r === "guest"
                          ? "Guest"
                          : r === "host"
                            ? "Host"
                            : "Both"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {/* Hosting status + dates */}
                    {profile.hostingStatus &&
                      profile.hostingStatus !== "cant-host" && (
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-xs ${
                              profile.hostingStatus === "can-host"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <Users size={14} />
                            {profile.hostingStatus === "can-host"
                              ? "Can Host"
                              : "Maybe Host"}
                            {profile.capacity && ` · ${profile.capacity}`}
                          </span>
                          {profile.hostingDates &&
                            profile.hostingDates.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-1">
                                {profile.hostingDates.map((date) => (
                                  <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                                      profile.hostingStatus === "can-host"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-amber-50 text-amber-600"
                                    }`}
                                    key={date}
                                  >
                                    {date}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    {/* Guest status + dates */}
                    {profile.guestStatus &&
                      profile.guestStatus !== "not-looking" && (
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-xs ${
                              profile.guestStatus === "looking"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <User size={14} />
                            {profile.guestStatus === "looking"
                              ? "Looking for Host"
                              : "Maybe Guest"}
                          </span>
                          {profile.guestDates &&
                            profile.guestDates.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-1">
                                {profile.guestDates.map((date) => (
                                  <span
                                    className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                                      profile.guestStatus === "looking"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-amber-50 text-amber-600"
                                    }`}
                                    key={date}
                                  >
                                    {date}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    {/* Fallback to old role display if no new fields */}
                    {!profile.hostingStatus && !profile.guestStatus && (
                      <div className="flex gap-2">
                        {isHost && (
                          <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1.5 font-medium text-purple-700 text-xs">
                            <Users size={14} />
                            Host{profile.capacity && ` · ${profile.capacity}`}
                          </span>
                        )}
                        {isGuest && (
                          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 font-medium text-blue-700 text-xs">
                            <User size={14} />
                            Guest
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-gray-100 border-t">
              <div className="p-4 text-center">
                <div className="font-bold text-gray-900 text-xl">
                  {profile.languages.length}
                </div>
                <div className="font-medium text-[10px] text-gray-400 uppercase tracking-wider">
                  Languages
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="font-bold text-gray-900 text-xl">
                  {profile.availableDates.length}
                </div>
                <div className="font-medium text-[10px] text-gray-400 uppercase tracking-wider">
                  Dates
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="border-gray-100 border-t p-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-1.5 ${profile.verified ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <ShieldCheck
                    className={
                      profile.verified ? "text-green-600" : "text-gray-400"
                    }
                    size={16}
                  />
                </div>
                <span
                  className={`font-medium text-sm ${profile.verified ? "text-green-700" : "text-gray-500"}`}
                >
                  {profile.verified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            {/* Last Active */}
            {profile.lastActive && (
              <div className="border-gray-100 border-t bg-gray-50 p-3 text-center">
                <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {formatRelativeTime(profile.lastActive)}
                </span>
              </div>
            )}

            {/* Edit/Save Toggle */}
            {isOwnProfile && (
              <div className="border-gray-100 border-t">
                {isEditing ? (
                  <div className="flex">
                    <button
                      className="flex flex-1 items-center justify-center gap-2 py-3 font-medium text-gray-500 text-sm transition-colors hover:bg-gray-50"
                      disabled={isSaving}
                      onClick={handleCancel}
                      type="button"
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-2 bg-green-50 py-3 font-medium text-green-600 text-sm transition-colors hover:bg-green-100"
                      disabled={isSaving}
                      onClick={handleSave}
                      type="button"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex w-full items-center justify-center gap-2 py-3 font-medium text-gray-600 text-sm transition-colors hover:bg-gray-50"
                    onClick={() => setIsEditing(true)}
                    type="button"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          {/* Tab Navigation */}
          {(isHost || isEditing) && (
            <div className="mb-4 flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-colors ${
                  activeTab === "about"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("about")}
                type="button"
              >
                <Info size={18} />
                About
              </button>
              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-colors ${
                  activeTab === "home"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("home")}
                type="button"
              >
                <Home size={18} />
                My Home
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "about" && (
              <>
                {/* Bio */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 font-semibold text-gray-900">About Me</h2>
                  {isEditing ? (
                    <textarea
                      className={textareaClass}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell others about yourself..."
                      value={formData.bio}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                      {profile.bio || "No bio yet."}
                    </p>
                  )}
                </div>

                {/* Hosting Status & Dates */}
                {(isEditing ||
                  (profile.hostingDates &&
                    profile.hostingDates.length > 0)) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="text-green-500" size={18} />
                      <h2 className="font-semibold text-gray-900">Hosting</h2>
                    </div>

                    {/* Hosting Status Selector (edit mode) */}
                    {isEditing && (
                      <div className="mb-4">
                        <p className="mb-2 font-medium text-gray-600 text-sm">
                          Can you host?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              {
                                value: "can-host",
                                label: "Yes, I Can Host",
                                color: "green",
                              },
                              {
                                value: "may-host",
                                label: "Maybe",
                                color: "amber",
                              },
                              {
                                value: "cant-host",
                                label: "Not Hosting",
                                color: "gray",
                              },
                            ] as const
                          ).map(({ value, label, color }) => (
                            <button
                              className={`rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                                formData.hostingStatus === value
                                  ? color === "green"
                                    ? "bg-green-500 text-white"
                                    : color === "amber"
                                      ? "bg-amber-500 text-white"
                                      : "bg-gray-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              key={value}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  hostingStatus: value,
                                }))
                              }
                              type="button"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show status badge in view mode */}
                    {!isEditing && profile.hostingStatus === "may-host" && (
                      <span className="mb-3 inline-block rounded bg-amber-100 px-2 py-0.5 text-amber-700 text-xs">
                        Maybe
                      </span>
                    )}

                    {/* Hosting Dates */}
                    {(isEditing ||
                      (formData.hostingStatus !== "cant-host" &&
                        formData.hostingDates.length > 0)) && (
                      <>
                        {isEditing &&
                          formData.hostingStatus !== "cant-host" && (
                            <p className="mb-2 font-medium text-gray-600 text-sm">
                              Which dates?
                            </p>
                          )}
                        <div className="flex flex-wrap gap-2">
                          {(isEditing && formData.hostingStatus !== "cant-host"
                            ? HOLIDAY_DATES
                            : profile.hostingDates || []
                          ).map((date) => {
                            const isSelected = isEditing
                              ? formData.hostingDates.includes(
                                  date as (typeof HOLIDAY_DATES)[number]
                                )
                              : true;
                            const statusColor =
                              formData.hostingStatus === "can-host"
                                ? "green"
                                : "amber";
                            return (
                              <button
                                className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                                  isSelected
                                    ? statusColor === "green"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                                disabled={!isEditing}
                                key={date}
                                onClick={() =>
                                  isEditing &&
                                  toggleArrayItem(
                                    "hostingDates",
                                    date as (typeof HOLIDAY_DATES)[number]
                                  )
                                }
                                type="button"
                              >
                                {date}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {isEditing && formData.hostingStatus === "cant-host" && (
                      <p className="text-gray-500 text-sm">
                        Not hosting this season
                      </p>
                    )}
                  </div>
                )}

                {/* Guest Status & Dates */}
                {(isEditing ||
                  (profile.guestDates && profile.guestDates.length > 0)) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="text-blue-500" size={18} />
                      <h2 className="font-semibold text-gray-900">
                        Looking to Join
                      </h2>
                    </div>

                    {/* Guest Status Selector (edit mode) */}
                    {isEditing && (
                      <div className="mb-4">
                        <p className="mb-2 font-medium text-gray-600 text-sm">
                          Are you looking to be a guest?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              {
                                value: "looking",
                                label: "Yes, Looking",
                                color: "blue",
                              },
                              {
                                value: "maybe-guest",
                                label: "Maybe",
                                color: "amber",
                              },
                              {
                                value: "not-looking",
                                label: "Not Looking",
                                color: "gray",
                              },
                            ] as const
                          ).map(({ value, label, color }) => (
                            <button
                              className={`rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                                formData.guestStatus === value
                                  ? color === "blue"
                                    ? "bg-blue-500 text-white"
                                    : color === "amber"
                                      ? "bg-amber-500 text-white"
                                      : "bg-gray-500 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              key={value}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  guestStatus: value,
                                }))
                              }
                              type="button"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show status badge in view mode */}
                    {!isEditing && profile.guestStatus === "maybe-guest" && (
                      <span className="mb-3 inline-block rounded bg-amber-100 px-2 py-0.5 text-amber-700 text-xs">
                        Maybe
                      </span>
                    )}

                    {/* Guest Dates */}
                    {(isEditing ||
                      (formData.guestStatus !== "not-looking" &&
                        formData.guestDates.length > 0)) && (
                      <>
                        {isEditing &&
                          formData.guestStatus !== "not-looking" && (
                            <p className="mb-2 font-medium text-gray-600 text-sm">
                              Which dates?
                            </p>
                          )}
                        <div className="flex flex-wrap gap-2">
                          {(isEditing && formData.guestStatus !== "not-looking"
                            ? HOLIDAY_DATES
                            : profile.guestDates || []
                          ).map((date) => {
                            const isSelected = isEditing
                              ? formData.guestDates.includes(
                                  date as (typeof HOLIDAY_DATES)[number]
                                )
                              : true;
                            const statusColor =
                              formData.guestStatus === "looking"
                                ? "blue"
                                : "amber";
                            return (
                              <button
                                className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                                  isSelected
                                    ? statusColor === "blue"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                                disabled={!isEditing}
                                key={date}
                                onClick={() =>
                                  isEditing &&
                                  toggleArrayItem(
                                    "guestDates",
                                    date as (typeof HOLIDAY_DATES)[number]
                                  )
                                }
                                type="button"
                              >
                                {date}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                    {isEditing && formData.guestStatus === "not-looking" && (
                      <p className="text-gray-500 text-sm">
                        Not looking this season
                      </p>
                    )}
                  </div>
                )}

                {/* Fallback: Available Dates (for old profiles without new fields) */}
                {!isEditing &&
                  (!profile.hostingDates ||
                    profile.hostingDates.length === 0) &&
                  (!profile.guestDates || profile.guestDates.length === 0) &&
                  profile.availableDates.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center gap-2">
                        <Calendar className="text-gray-400" size={18} />
                        <h2 className="font-semibold text-gray-900">
                          Available Dates
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.availableDates.map((date) => (
                          <span
                            className="rounded-lg bg-red-100 px-3 py-1.5 font-medium text-red-700 text-sm"
                            key={date}
                          >
                            {date}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Languages */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Globe className="text-gray-400" size={18} />
                    <h2 className="font-semibold text-gray-900">Languages</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? LANGUAGES : profile.languages).map((lang) => {
                      const isSelected = isEditing
                        ? formData.languages.includes(
                            lang as (typeof LANGUAGES)[number]
                          )
                        : true;
                      return (
                        <button
                          className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                          disabled={!isEditing}
                          key={lang}
                          onClick={() =>
                            isEditing &&
                            toggleArrayItem(
                              "languages",
                              lang as (typeof LANGUAGES)[number]
                            )
                          }
                          type="button"
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vibes */}
                {(isEditing || profile.vibes.length > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="text-purple-500" size={18} />
                      <h2 className="font-semibold text-gray-900">Vibes</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? VIBES_OPTIONS : profile.vibes).map(
                        (vibe) => {
                          const isSelected = isEditing
                            ? formData.vibes.includes(
                                vibe as (typeof VIBES_OPTIONS)[number]
                              )
                            : true;
                          return (
                            <button
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                isSelected
                                  ? "border-purple-200 bg-purple-50 text-purple-700"
                                  : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
                              } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!isEditing}
                              key={vibe}
                              onClick={() =>
                                isEditing &&
                                toggleArrayItem(
                                  "vibes",
                                  vibe as (typeof VIBES_OPTIONS)[number]
                                )
                              }
                              type="button"
                            >
                              {vibe}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Dietary */}
                {(isEditing || profile.dietaryInfo.length > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <UtensilsCrossed className="text-orange-500" size={18} />
                      <h2 className="font-semibold text-gray-900">Dietary</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? DIETARY_OPTIONS : profile.dietaryInfo).map(
                        (diet) => {
                          const isSelected = isEditing
                            ? formData.dietaryInfo.includes(
                                diet as (typeof DIETARY_OPTIONS)[number]
                              )
                            : true;
                          return (
                            <button
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                isSelected
                                  ? "border-orange-200 bg-orange-50 text-orange-700"
                                  : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
                              } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!isEditing}
                              key={diet}
                              onClick={() =>
                                isEditing &&
                                toggleArrayItem(
                                  "dietaryInfo",
                                  diet as (typeof DIETARY_OPTIONS)[number]
                                )
                              }
                              type="button"
                            >
                              {diet}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 font-semibold text-gray-900">
                    Preferences
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <PreferenceItem
                      allowed={
                        isEditing
                          ? formData.drinkingAllowed
                          : profile.drinkingAllowed
                      }
                      icon={Wine}
                      isEditing={isEditing}
                      label="Alcohol"
                      onToggle={() =>
                        setFormData((prev) => ({
                          ...prev,
                          drinkingAllowed: !prev.drinkingAllowed,
                        }))
                      }
                    />
                    <PreferenceItem
                      allowed={
                        isEditing
                          ? formData.smokingAllowed
                          : profile.smokingAllowed
                      }
                      icon={Cigarette}
                      isEditing={isEditing}
                      label="Smoking"
                      onToggle={() =>
                        setFormData((prev) => ({
                          ...prev,
                          smokingAllowed: !prev.smokingAllowed,
                        }))
                      }
                    />
                    <PreferenceItem
                      allowed={
                        isEditing ? formData.petsAllowed : profile.petsAllowed
                      }
                      icon={Dog}
                      isEditing={isEditing}
                      label="Pets Welcome"
                      onToggle={() =>
                        setFormData((prev) => ({
                          ...prev,
                          petsAllowed: !prev.petsAllowed,
                        }))
                      }
                    />
                    <PreferenceItem
                      allowed={isEditing ? formData.hasPets : profile.hasPets}
                      icon={Dog}
                      isEditing={isEditing}
                      label="Has Pets"
                      onToggle={() =>
                        setFormData((prev) => ({
                          ...prev,
                          hasPets: !prev.hasPets,
                        }))
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "home" && (isHost || isEditing) && (
              <>
                {/* Event Details */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 font-semibold text-gray-900">
                    Event Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="mb-1 font-medium text-[10px] text-gray-400 uppercase tracking-wider">
                        Event Type
                      </p>
                      {isEditing ? (
                        <select
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1 font-semibold text-gray-900 text-sm"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              concept: e.target
                                .value as (typeof CONCEPT_OPTIONS)[number],
                            }))
                          }
                          value={formData.concept}
                        >
                          <option value="">Select...</option>
                          {CONCEPT_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="font-semibold text-gray-900">
                          {profile.concept || "Not set"}
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="mb-1 font-medium text-[10px] text-gray-400 uppercase tracking-wider">
                        Capacity
                      </p>
                      {isEditing ? (
                        <input
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1 font-semibold text-gray-900 text-sm"
                          max={50}
                          min={1}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              capacity: e.target.value
                                ? Number(e.target.value)
                                : "",
                            }))
                          }
                          placeholder="e.g. 6"
                          type="number"
                          value={formData.capacity}
                        />
                      ) : (
                        <p className="font-semibold text-gray-900">
                          {profile.capacity
                            ? `${profile.capacity} guests`
                            : "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {(isEditing || profile.amenities.length > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 font-semibold text-gray-900">
                      Amenities
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? AMENITIES_OPTIONS : profile.amenities).map(
                        (amenity) => {
                          const isSelected = isEditing
                            ? formData.amenities.includes(
                                amenity as (typeof AMENITIES_OPTIONS)[number]
                              )
                            : true;
                          return (
                            <button
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                isSelected
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
                              } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!isEditing}
                              key={amenity}
                              onClick={() =>
                                isEditing &&
                                toggleArrayItem(
                                  "amenities",
                                  amenity as (typeof AMENITIES_OPTIONS)[number]
                                )
                              }
                              type="button"
                            >
                              {amenity}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* House Rules */}
                {(isEditing || profile.houseRules.length > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 font-semibold text-gray-900">
                      House Rules
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing
                        ? HOUSE_RULES_OPTIONS
                        : profile.houseRules
                      ).map((rule) => {
                        const isSelected = isEditing
                          ? formData.houseRules.includes(
                              rule as (typeof HOUSE_RULES_OPTIONS)[number]
                            )
                          : true;
                        return (
                          <button
                            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                              isSelected
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
                            } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                            disabled={!isEditing}
                            key={rule}
                            onClick={() =>
                              isEditing &&
                              toggleArrayItem(
                                "houseRules",
                                rule as (typeof HOUSE_RULES_OPTIONS)[number]
                              )
                            }
                            type="button"
                          >
                            {rule}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Preference item component with edit support
function PreferenceItem({
  icon: Icon,
  label,
  allowed,
  isEditing,
  onToggle,
}: {
  icon: typeof Wine;
  label: string;
  allowed: boolean;
  isEditing?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        allowed ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
      } ${isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
      disabled={!isEditing}
      onClick={onToggle}
      type="button"
    >
      <Icon size={16} />
      <span className="flex-1 text-left">{label}</span>
      {allowed ? <Check size={16} /> : <X size={16} />}
    </button>
  );
}
