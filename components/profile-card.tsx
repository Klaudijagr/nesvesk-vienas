"use client";

import {
  Calendar,
  Check,
  CheckCircle,
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
import Link from "next/link";

import type { SlimProfile } from "@/lib/types";

// ============================================================================
// Shared utilities
// ============================================================================

const getStatusStyles = (type: "host" | "guest", isDefinite: boolean) => {
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
};

const getStatusLabel = (
  type: "host" | "guest",
  isDefinite: boolean
): string => {
  if (type === "host") {
    return isDefinite ? "Can Host" : "Might Host";
  }
  return isDefinite ? "Looking to Join" : "Might Join";
};

// A removed photo is stored as an empty string, which also gets the avatar.
const getPhotoUrl = (profile: SlimProfile): string =>
  profile.photoUrl === undefined || profile.photoUrl === ""
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
    : profile.photoUrl;

const formatLastActive = (lastActive: number | undefined): string | null => {
  if (lastActive === undefined || lastActive === 0) {
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
};

// ============================================================================
// Compact variant components (for grid view / browse)
// ============================================================================

const CompactStatusBadge = ({
  type,
  status,
  dates,
}: {
  type: "host" | "guest";
  status: string;
  dates: string[];
}) => {
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
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.pillColorClass}`}
      >
        <Icon className={styles.iconColorClass} size={10} />
        {label}
      </span>
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
};

const CompactLanguagesPills = ({ languages }: { languages: string[] }) => (
  <div className="mb-2">
    <div className="flex flex-wrap gap-1">
      {languages.slice(0, 3).map((lang) => (
        <span
          className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-700"
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

const CompactVibesPills = ({ vibes }: { vibes: string[] }) => {
  if (vibes.length === 0) {
    return null;
  }
  return (
    <div className="mb-2">
      <div className="flex flex-wrap gap-1">
        {vibes.slice(0, 2).map((vibe) => (
          <span
            className="rounded-full border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[9px] font-medium text-purple-700"
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
};

const CompactLifestyleIndicator = ({
  allowed,
  label,
}: {
  allowed: boolean;
  label: string;
}) => (
  <span
    className={`flex items-center gap-0.5 ${allowed ? "text-green-600" : "text-red-500"}`}
  >
    {allowed ? <Check size={10} /> : <X size={10} />}
    {label}
  </span>
);

const CompactLifestylePreferences = ({
  drinkingAllowed,
  smokingAllowed,
  petsAllowed,
}: {
  drinkingAllowed: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
}) => (
  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-[9px]">
    <CompactLifestyleIndicator allowed={drinkingAllowed} label="Alcohol" />
    <CompactLifestyleIndicator allowed={smokingAllowed} label="Smoke" />
    <CompactLifestyleIndicator allowed={petsAllowed} label="Pets" />
  </div>
);

const CompactStatusSection = ({ profile }: { profile: SlimProfile }) => {
  const hostingDates = profile.hostingDates ?? [];
  const guestDates = profile.guestDates ?? [];
  const canHost =
    profile.hostingStatus === "can-host" ||
    profile.hostingStatus === "may-host";
  const isGuest =
    profile.guestStatus === "looking" || profile.guestStatus === "maybe-guest";

  if (!(canHost || isGuest)) {
    return (
      <div className="mb-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          Not available
        </span>
      </div>
    );
  }

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {canHost && (
        <CompactStatusBadge
          dates={hostingDates}
          status={profile.hostingStatus ?? "cant-host"}
          type="host"
        />
      )}
      {isGuest && (
        <CompactStatusBadge
          dates={guestDates}
          status={profile.guestStatus ?? "not-looking"}
          type="guest"
        />
      )}
    </div>
  );
};

const CompactImageHeader = ({ profile }: { profile: SlimProfile }) => (
  <div className="relative h-28">
    <Image
      alt={profile.firstName}
      className="h-full w-full object-cover"
      fill
      sizes="200px"
      src={getPhotoUrl(profile)}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    <div className="absolute bottom-2 left-2.5 text-white">
      <h3 className="text-sm font-bold drop-shadow-md">
        {profile.firstName}
        {profile.age ? `, ${profile.age}` : ""}
      </h3>
      <p className="flex items-center gap-1 text-[10px] opacity-90">
        <MapPin size={10} /> {profile.city}
      </p>
    </div>

    {profile.verified && (
      <div className="absolute top-2 right-2">
        <div className="rounded-full bg-white p-0.5">
          <CheckCircle className="text-green-600" size={12} />
        </div>
      </div>
    )}
  </div>
);

const CompactCard = ({
  profile,
  onClick,
}: {
  profile: SlimProfile;
  onClick?: () => void;
}) => {
  const profileUrl =
    profile.username === undefined || profile.username === ""
      ? `/profile/${profile.userId}`
      : `/people/${profile.username}`;

  const card = (
    <div className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:shadow-md">
      <CompactImageHeader profile={profile} />

      <div className="flex flex-1 flex-col p-2.5">
        <CompactStatusSection profile={profile} />
        <CompactLanguagesPills languages={profile.languages} />
        <CompactVibesPills vibes={profile.vibes ?? []} />
        <CompactLifestylePreferences
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
};

// ============================================================================
// Full variant components (for profile pages / modal)
// ============================================================================

const FullProfileHeader = ({ profile }: { profile: SlimProfile }) => {
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
              src={getPhotoUrl(profile)}
            />
          </div>
          {isOnline && (
            <div className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">
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

          <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={13} />
            <span>{profile.city}</span>
          </div>

          {lastActive !== null && !isOnline && (
            <p className="mt-1 text-xs text-gray-400">{lastActive}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const FullStatusBadge = ({
  type,
  status,
  dates,
  capacity,
}: {
  type: "host" | "guest";
  status: string;
  dates: string[];
  capacity?: number;
}) => {
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
      <div className="flex items-center gap-2">
        <Icon className={styles.iconColorClass} size={16} />
        <span className={`text-sm font-semibold ${styles.textColorClass}`}>
          {label}
        </span>
      </div>
      {capacity !== undefined && capacity > 0 && (
        <p className={`mt-1 text-xs ${styles.textColorClass} opacity-80`}>
          Up to {capacity} guests
        </p>
      )}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {dates.map((date) => (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${styles.pillColorClass}`}
            key={date}
          >
            <Calendar size={9} />
            {date}
          </span>
        ))}
      </div>
    </div>
  );
};

const FullAboutSection = ({ profile }: { profile: SlimProfile }) => (
  <div className="space-y-4 px-5 py-4">
    <div className="flex gap-6">
      <div className="flex-1">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
          <Globe size={12} />
          Languages
        </p>
        <div className="flex flex-wrap gap-1.5">
          {profile.languages.map((lang) => (
            <span
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              key={lang}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {(profile.vibes?.length ?? 0) > 0 && (
        <div className="flex-1">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
            <Sparkles size={12} />
            Vibes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.vibes ?? []).map((vibe) => (
              <span
                className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
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
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
          <UtensilsCrossed size={12} />
          Dietary
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(profile.dietaryInfo ?? []).map((diet) => (
            <span
              className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
              key={diet}
            >
              {diet}
            </span>
          ))}
        </div>
      </div>
    )}

    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
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

const VerificationDot = ({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) => (
  <div className="flex items-center gap-1">
    <div
      className={`h-2 w-2 rounded-full ${verified ? "bg-green-500" : "bg-gray-300"}`}
    />
    <span className={`text-xs ${verified ? "text-gray-600" : "text-gray-400"}`}>
      {label}
    </span>
  </div>
);

const FullCard = ({
  profile,
  className = "",
  actionButton,
}: {
  profile: SlimProfile;
  className?: string;
  actionButton?: React.ReactNode;
}) => {
  const hostingDates = profile.hostingDates ?? [];
  const guestDates = profile.guestDates ?? [];
  const canHost =
    profile.hostingStatus === "can-host" ||
    profile.hostingStatus === "may-host";
  const isGuest =
    profile.guestStatus === "looking" || profile.guestStatus === "maybe-guest";

  return (
    <div
      className={`w-96 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <FullProfileHeader profile={profile} />

      <div className="border-b border-gray-100 px-5 py-3">
        <div className="flex justify-center gap-2">
          {canHost && (
            <FullStatusBadge
              capacity={profile.capacity}
              dates={hostingDates}
              status={profile.hostingStatus ?? "cant-host"}
              type="host"
            />
          )}
          {isGuest && (
            <FullStatusBadge
              dates={guestDates}
              status={profile.guestStatus ?? "not-looking"}
              type="guest"
            />
          )}
        </div>
      </div>

      {profile.bio && (
        <div className="border-b border-gray-100 px-5 py-3">
          <p className="text-sm leading-relaxed text-gray-700">{profile.bio}</p>
        </div>
      )}

      <FullAboutSection profile={profile} />

      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VerificationDot label="Email" verified />
            <VerificationDot label="Photo" verified={profile.verified} />
          </div>
        </div>
      </div>

      {Boolean(actionButton) && (
        <div className="border-t border-gray-100 px-5 py-3">{actionButton}</div>
      )}
    </div>
  );
};

// ============================================================================
// Main ProfileCard component
// ============================================================================

type ProfileCardProps =
  | {
      variant: "compact";
      profile: SlimProfile;
      onClick?: () => void;
    }
  | {
      variant: "full";
      profile: SlimProfile;
      className?: string;
      actionButton?: React.ReactNode;
    };

export const ProfileCard = (props: ProfileCardProps) => {
  if (props.variant === "compact") {
    return <CompactCard onClick={props.onClick} profile={props.profile} />;
  }
  return (
    <FullCard
      actionButton={props.actionButton}
      className={props.className}
      profile={props.profile}
    />
  );
};

// Re-export for backwards compatibility during migration
export { CompactCard as ListingCard };
export { FullCard as UnifiedProfileCard };
