"use client";

import {
  Calendar,
  Check,
  CheckCircle,
  MapPin,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";

type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "matched"
  | "self";

// Slim profile type matching what listProfiles returns (excludes large arrays like photos, amenities, houseRules)
interface ProfileWithStatus {
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
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  connectionStatus?: ConnectionStatus;
}

type ListingCardProps = {
  profile: ProfileWithStatus;
  onClick?: () => void;
};

// Get styles for status badge (same as UnifiedProfileCard)
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

// Get label for status badge (same as UnifiedProfileCard)
function getStatusLabel(type: "host" | "guest", isDefinite: boolean): string {
  if (type === "host") {
    return isDefinite ? "Can Host" : "Might Host";
  }
  return isDefinite ? "Looking to Join" : "Might Join";
}

// Compact status badge - pill style
function MiniStatusBadge({
  type,
  status,
  dates,
}: {
  type: "host" | "guest";
  status: string;
  dates: string[];
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
    <div className="flex-1">
      {/* Status pill */}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-[10px] ${styles.pillColorClass}`}
      >
        <Icon className={styles.iconColorClass} size={10} />
        {label}
      </span>
      {/* Dates as simple text */}
      <div className="mt-1 flex flex-wrap gap-1">
        {dates.slice(0, 3).map((date) => (
          <span
            className={`inline-flex items-center gap-0.5 text-[9px] ${styles.textColorClass}`}
            key={date}
          >
            <Calendar size={8} />
            {date}
          </span>
        ))}
        {dates.length > 3 && (
          <span className={`text-[9px] ${styles.textColorClass}`}>
            +{dates.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

// Languages pills section
function LanguagesPills({ languages }: { languages: string[] }) {
  return (
    <div className="mb-2">
      <div className="flex flex-wrap gap-1">
        {languages.slice(0, 3).map((lang) => (
          <span
            className="rounded-full bg-blue-50 px-1.5 py-0.5 font-medium text-[9px] text-blue-700"
            key={lang}
          >
            {lang}
          </span>
        ))}
        {languages.length > 3 && (
          <span className="text-[9px] text-gray-400">
            +{languages.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

// Vibes pills section
function VibesPills({ vibes }: { vibes: string[] }) {
  if (vibes.length === 0) {
    return null;
  }
  return (
    <div className="mb-2">
      <div className="flex flex-wrap gap-1">
        {vibes.slice(0, 2).map((vibe) => (
          <span
            className="rounded-full border border-purple-200 bg-purple-50 px-1.5 py-0.5 font-medium text-[9px] text-purple-700"
            key={vibe}
          >
            {vibe}
          </span>
        ))}
        {vibes.length > 2 && (
          <span className="text-[9px] text-gray-400">+{vibes.length - 2}</span>
        )}
      </div>
    </div>
  );
}

// Lifestyle preference indicator
function LifestyleIndicator({
  allowed,
  label,
}: {
  allowed: boolean;
  label: string;
}) {
  return (
    <span
      className={`flex items-center gap-0.5 ${allowed ? "text-green-600" : "text-red-500"}`}
    >
      {allowed ? <Check size={10} /> : <X size={10} />}
      {label}
    </span>
  );
}

// Lifestyle preferences row
function LifestylePreferences({
  drinkingAllowed,
  smokingAllowed,
  petsAllowed,
}: {
  drinkingAllowed: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
}) {
  return (
    <div className="mt-auto flex items-center justify-between border-gray-100 border-t pt-2 text-[9px]">
      <LifestyleIndicator allowed={drinkingAllowed} label="Alcohol" />
      <LifestyleIndicator allowed={smokingAllowed} label="Smoke" />
      <LifestyleIndicator allowed={petsAllowed} label="Pets" />
    </div>
  );
}

// Status badges section
function StatusBadgesSection({ profile }: { profile: ProfileWithStatus }) {
  const hostingDates = profile.hostingDates || [];
  const guestDates = profile.guestDates || [];
  const canHost =
    profile.hostingStatus === "can-host" ||
    profile.hostingStatus === "may-host";
  const isGuest =
    profile.guestStatus === "looking" || profile.guestStatus === "maybe-guest";

  if (!(canHost || isGuest)) {
    return (
      <div className="mb-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-medium text-[10px] text-gray-500">
          Not available
        </span>
      </div>
    );
  }

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {canHost && (
        <MiniStatusBadge
          dates={hostingDates}
          status={profile.hostingStatus || "cant-host"}
          type="host"
        />
      )}
      {isGuest && (
        <MiniStatusBadge
          dates={guestDates}
          status={profile.guestStatus || "not-looking"}
          type="guest"
        />
      )}
    </div>
  );
}

// Card image header
function CardImageHeader({ profile }: { profile: ProfileWithStatus }) {
  const photoUrl =
    profile.photoUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`;

  return (
    <div className="relative h-28">
      <Image
        alt={profile.firstName}
        className="h-full w-full object-cover"
        fill
        sizes="200px"
        src={photoUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Name and location overlay */}
      <div className="absolute bottom-2 left-2.5 text-white">
        <h3 className="font-bold text-sm drop-shadow-md">
          {profile.firstName}
          {profile.age ? `, ${profile.age}` : ""}
        </h3>
        <p className="flex items-center gap-1 text-[10px] opacity-90">
          <MapPin size={10} /> {profile.city}
        </p>
      </div>

      {/* Verified badge */}
      {profile.verified && (
        <div className="absolute top-2 right-2">
          <div className="rounded-full bg-white p-0.5">
            <CheckCircle className="text-green-600" size={12} />
          </div>
        </div>
      )}
    </div>
  );
}

export function ListingCard({ profile, onClick }: ListingCardProps) {
  const profileUrl = profile.username
    ? `/people/${profile.username}`
    : `/profile/${profile.userId}`;

  const card = (
    <div className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:shadow-md">
      <CardImageHeader profile={profile} />

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5">
        <StatusBadgesSection profile={profile} />
        <LanguagesPills languages={profile.languages} />
        <VibesPills vibes={profile.vibes || []} />
        <LifestylePreferences
          drinkingAllowed={profile.drinkingAllowed}
          petsAllowed={profile.petsAllowed}
          smokingAllowed={profile.smokingAllowed}
        />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        className="h-full w-full text-left"
        onClick={onClick}
        type="button"
      >
        {card}
      </button>
    );
  }

  return (
    <Link className="h-full w-full" href={profileUrl}>
      {card}
    </Link>
  );
}
