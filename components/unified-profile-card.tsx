"use client";

import {
  Calendar,
  Check,
  Dog,
  Globe,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

// Slim profile type matching what listProfiles returns (excludes large arrays like photos, amenities, houseRules)
type SlimProfile = {
  _id: Id<"profiles">;
  userId: Id<"users">;
  username?: string;
  firstName: string;
  age: number;
  city: string;
  bio: string;
  photoUrl?: string;
  role: "host" | "guest" | "both";
  hostingStatus?: "can-host" | "may-host" | "cant-host";
  guestStatus?: "looking" | "maybe-guest" | "not-looking";
  languages: string[];
  availableDates: string[];
  hostingDates?: string[];
  guestDates?: string[];
  verified: boolean;
  vibes?: string[];
  dietaryInfo?: string[];
  concept?: "Party" | "Dinner" | "Hangout";
  capacity?: number;
  lastActive?: number;
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  hasPets: boolean;
};

// Helper to format last active time
function formatLastActive(lastActive: number | undefined): string | null {
  if (!lastActive) {
    return null;
  }
  const diff = Date.now() - lastActive;
  const mins = Math.floor(diff / 60_000);
  if (mins < 5) {
    return "Online now";
  }
  if (mins < 60) {
    return `Active ${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `Active ${hours}h ago`;
  }
  return `Active ${Math.floor(hours / 24)}d ago`;
}

// Profile Header component
function ProfileHeader({ profile }: { profile: SlimProfile }) {
  const lastActive = formatLastActive(profile.lastActive);
  const isOnline = lastActive === "Online now";

  return (
    <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-5 pb-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="relative h-20 w-20">
            <Image
              alt={profile.firstName}
              className="h-full w-full rounded-2xl border-4 border-white object-cover shadow-lg"
              fill
              src={
                profile.photoUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
              }
            />
          </div>
          {isOnline && (
            <div className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900 text-lg">
              {profile.firstName}
              {profile.age && (
                <span className="font-normal text-gray-500">
                  , {profile.age}
                </span>
              )}
            </h2>
            {profile.verified && (
              <ShieldCheck className="text-green-600" size={16} />
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-gray-600 text-sm">
            <MapPin size={13} />
            <span>{profile.city}</span>
          </div>

          {lastActive && !isOnline && (
            <p className="mt-1 text-gray-400 text-xs">{lastActive}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Get styles for status badge based on type and whether it's definite
function getStatusStyles(type: "host" | "guest", isDefinite: boolean) {
  if (!isDefinite) {
    return {
      colorClass: "border-amber-200 bg-amber-50",
      textColorClass: "text-amber-700",
      iconColorClass: "text-amber-600",
      pillColorClass: "bg-amber-100 text-amber-700",
    };
  }
  if (type === "host") {
    return {
      colorClass: "border-green-200 bg-green-50",
      textColorClass: "text-green-700",
      iconColorClass: "text-green-600",
      pillColorClass: "bg-green-100 text-green-700",
    };
  }
  return {
    colorClass: "border-blue-200 bg-blue-50",
    textColorClass: "text-blue-700",
    iconColorClass: "text-blue-600",
    pillColorClass: "bg-blue-100 text-blue-700",
  };
}

// Get label for status badge
function getStatusLabel(type: "host" | "guest", isDefinite: boolean): string {
  if (type === "host") {
    return isDefinite ? "Can Host" : "Might Host";
  }
  return isDefinite ? "Looking to Join" : "Might Join";
}

// Status badge for hosting/guest
function StatusBadge({
  type,
  status,
  dates,
  capacity,
}: {
  type: "host" | "guest";
  status: string;
  dates: string[];
  capacity?: number;
}) {
  if (dates.length === 0) {
    return null;
  }

  const isDefinite =
    type === "host" ? status === "can-host" : status === "looking";
  const styles = getStatusStyles(type, isDefinite);
  const Icon = type === "host" ? Users : User;
  const label = getStatusLabel(type, isDefinite);

  return (
    <div className={`rounded-xl border p-3 ${styles.colorClass}`}>
      {/* Row 1: Icon + Label */}
      <div className="flex items-center gap-2">
        <Icon className={styles.iconColorClass} size={16} />
        <span className={`font-semibold text-sm ${styles.textColorClass}`}>
          {label}
        </span>
      </div>
      {/* Row 2: Capacity */}
      {capacity && (
        <p className={`mt-1 text-xs ${styles.textColorClass} opacity-80`}>
          Up to {capacity} guests
        </p>
      )}
      {/* Row 3+: Dates in 2 columns */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {dates.map((date) => (
          <span
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-medium text-[11px] ${styles.pillColorClass}`}
            key={date}
          >
            <Calendar size={9} />
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}

// About section component
function AboutSection({ profile }: { profile: SlimProfile }) {
  return (
    <div className="space-y-4 px-5 py-4">
      {/* Languages & Vibes - side by side */}
      <div className="flex gap-6">
        <div className="flex-1">
          <p className="mb-2 flex items-center gap-1.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
            <Globe size={12} />
            Languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.languages.map((lang) => (
              <span
                className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700 text-xs"
                key={lang}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {(profile.vibes?.length ?? 0) > 0 && (
          <div className="flex-1">
            <p className="mb-2 flex items-center gap-1.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
              <Sparkles size={12} />
              Vibes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.vibes ?? []).map((vibe) => (
                <span
                  className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-purple-700 text-xs"
                  key={vibe}
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {(profile.dietaryInfo?.length ?? 0) > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-medium text-gray-400 text-xs uppercase tracking-wider">
            <UtensilsCrossed size={12} />
            Dietary
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.dietaryInfo ?? []).map((diet) => (
              <span
                className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-medium text-orange-700 text-xs"
                key={diet}
              >
                {diet}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Simple inline preferences */}
      <div className="flex items-center justify-between border-gray-100 border-t pt-3 text-sm">
        <span
          className={`flex items-center gap-1 ${profile.drinkingAllowed ? "text-green-600" : "text-gray-400"}`}
        >
          {profile.drinkingAllowed ? <Check size={14} /> : <X size={14} />}
          Alcohol
        </span>
        <span
          className={`flex items-center gap-1 ${profile.smokingAllowed ? "text-green-600" : "text-gray-400"}`}
        >
          {profile.smokingAllowed ? <Check size={14} /> : <X size={14} />}
          Smoking
        </span>
        <span
          className={`flex items-center gap-1 ${profile.petsAllowed ? "text-green-600" : "text-gray-400"}`}
        >
          {profile.petsAllowed ? <Check size={14} /> : <X size={14} />}
          Pets OK
        </span>
        {profile.hasPets && (
          <span className="flex items-center gap-1 text-amber-600">
            <Dog size={14} />
            Has pets
          </span>
        )}
      </div>
    </div>
  );
}

// Simplified verification indicator
function VerificationDot({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <div
        className={`h-2 w-2 rounded-full ${verified ? "bg-green-500" : "bg-gray-300"}`}
      />
      <span
        className={`text-xs ${verified ? "text-gray-600" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

// Unified Profile Card - All info in one clean card
export function UnifiedProfileCard({
  profile,
  className = "",
  actionButton,
}: {
  profile: SlimProfile;
  className?: string;
  actionButton?: React.ReactNode;
}) {
  const hostingDates = profile.hostingDates || [];
  const guestDates = profile.guestDates || [];
  const canHost =
    profile.hostingStatus === "can-host" ||
    profile.hostingStatus === "may-host";
  const isGuest =
    profile.guestStatus === "looking" || profile.guestStatus === "maybe-guest";

  return (
    <div
      className={`w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <ProfileHeader profile={profile} />

      {/* Status Section - Host & Guest side by side, compact */}
      <div className="border-gray-100 border-b px-5 py-3">
        <div className="flex justify-center gap-2">
          {canHost && (
            <StatusBadge
              capacity={profile.capacity}
              dates={hostingDates}
              status={profile.hostingStatus || "cant-host"}
              type="host"
            />
          )}
          {isGuest && (
            <StatusBadge
              dates={guestDates}
              status={profile.guestStatus || "not-looking"}
              type="guest"
            />
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="border-gray-100 border-b px-5 py-3">
          <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* About Section */}
      <AboutSection profile={profile} />

      {/* Verification Footer - Email & Photo only */}
      <div className="border-gray-100 border-t bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VerificationDot label="Email" verified />
            <VerificationDot label="Photo" verified={profile.verified} />
          </div>
        </div>
      </div>

      {/* Optional Action Button */}
      {actionButton && (
        <div className="border-gray-100 border-t px-5 py-3">{actionButton}</div>
      )}
    </div>
  );
}
