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
      colorClass: "border-gold/50 bg-gold-soft/50",
      textColorClass: "text-gold-deep",
      iconColorClass: "text-gold-strong",
      pillColorClass: "bg-gold-soft text-gold-deep",
    };
  }
  if (type === "host") {
    return {
      colorClass: "border-success/20 bg-success/5",
      textColorClass: "text-success-strong",
      iconColorClass: "text-success",
      pillColorClass: "bg-success/10 text-success-strong",
    };
  }
  return {
    colorClass: "border-info/20 bg-info/5",
    textColorClass: "text-info-strong",
    iconColorClass: "text-info",
    pillColorClass: "bg-info/10 text-info-strong",
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
        className={`text-2xs inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${styles.pillColorClass}`}
      >
        <Icon className={styles.iconColorClass} size={10} />
        {label}
      </span>
      <div className="mt-1 flex flex-wrap gap-1">
        {dates.slice(0, 3).map((date) => (
          <span
            className={`text-3xs inline-flex items-center gap-0.5 ${styles.textColorClass}`}
            key={date}
          >
            <Calendar size={8} />
            {date}
          </span>
        ))}
        {dates.length > 3 && (
          <span className={`text-3xs ${styles.textColorClass}`}>
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
          className="bg-info/5 text-3xs text-info-strong rounded-full px-1.5 py-0.5 font-medium"
          key={lang}
        >
          {lang}
        </span>
      ))}
      {languages.length > 3 && (
        <span className="text-3xs text-muted-foreground/70">
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
            className="border-plum/20 bg-plum/5 text-3xs text-plum rounded-full border px-1.5 py-0.5 font-medium"
            key={vibe}
          >
            {vibe}
          </span>
        ))}
        {vibes.length > 2 && (
          <span className="text-3xs text-muted-foreground/70">
            +{vibes.length - 2}
          </span>
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
    className={`flex items-center gap-0.5 ${allowed ? "text-success" : "text-destructive"}`}
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
  <div className="border-border/60 text-3xs mt-auto flex items-center justify-between border-t pt-2">
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
        <span className="bg-muted text-2xs text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 font-medium">
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
    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

    <div className="absolute bottom-2 left-2.5 text-white">
      <h3 className="text-sm font-bold drop-shadow-md">
        {profile.firstName}
        {profile.age ? `, ${profile.age}` : ""}
      </h3>
      <p className="text-2xs flex items-center gap-1 opacity-90">
        <MapPin size={10} /> {profile.city}
      </p>
    </div>

    {profile.verified && (
      <div className="absolute top-2 right-2">
        <div className="rounded-full bg-white p-0.5">
          <CheckCircle className="text-success" size={12} />
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
    <div className="group border-border flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all hover:shadow-md">
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
    <div className="from-brand/5 to-ember/5 relative bg-linear-to-br p-5 pb-4">
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
            <div className="bg-success absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-lg font-bold">
              {profile.firstName}
              {profile.age && (
                <span className="text-muted-foreground font-normal">
                  , {profile.age}
                </span>
              )}
            </h2>
            {profile.verified && (
              <ShieldCheck className="text-success" size={16} />
            )}
          </div>

          <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-sm">
            <MapPin size={13} />
            <span>{profile.city}</span>
          </div>

          {lastActive !== null && !isOnline && (
            <p className="text-muted-foreground/70 mt-1 text-xs">
              {lastActive}
            </p>
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
            className={`text-2xs inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${styles.pillColorClass}`}
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
        <p className="text-muted-foreground/70 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
          <Globe size={12} />
          Languages
        </p>
        <div className="flex flex-wrap gap-1.5">
          {profile.languages.map((lang) => (
            <span
              className="bg-info/5 text-info-strong rounded-full px-2.5 py-1 text-xs font-medium"
              key={lang}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {(profile.vibes?.length ?? 0) > 0 && (
        <div className="flex-1">
          <p className="text-muted-foreground/70 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
            <Sparkles size={12} />
            Vibes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.vibes ?? []).map((vibe) => (
              <span
                className="border-plum/20 bg-plum/5 text-plum rounded-full border px-2.5 py-1 text-xs font-medium"
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
        <p className="text-muted-foreground/70 mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
          <UtensilsCrossed size={12} />
          Dietary
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(profile.dietaryInfo ?? []).map((diet) => (
            <span
              className="border-ember/20 bg-ember/5 text-ember rounded-full border px-2.5 py-1 text-xs font-medium"
              key={diet}
            >
              {diet}
            </span>
          ))}
        </div>
      </div>
    )}

    <div className="border-border/60 flex items-center justify-between border-t pt-3 text-sm">
      <span
        className={`flex items-center gap-1 ${profile.drinkingAllowed ? "text-success" : "text-muted-foreground/70"}`}
      >
        {profile.drinkingAllowed ? <Check size={14} /> : <X size={14} />}
        Alcohol
      </span>
      <span
        className={`flex items-center gap-1 ${profile.smokingAllowed ? "text-success" : "text-muted-foreground/70"}`}
      >
        {profile.smokingAllowed ? <Check size={14} /> : <X size={14} />}
        Smoking
      </span>
      <span
        className={`flex items-center gap-1 ${profile.petsAllowed ? "text-success" : "text-muted-foreground/70"}`}
      >
        {profile.petsAllowed ? <Check size={14} /> : <X size={14} />}
        Pets OK
      </span>
      {profile.hasPets && (
        <span className="text-gold-strong flex items-center gap-1">
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
      className={`h-2 w-2 rounded-full ${verified ? "bg-success" : "bg-border"}`}
    />
    <span
      className={`text-xs ${verified ? "text-muted-foreground" : "text-muted-foreground/70"}`}
    >
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
      className={`border-border w-96 overflow-hidden rounded-2xl border bg-white shadow-sm ${className}`}
    >
      <FullProfileHeader profile={profile} />

      <div className="border-border/60 border-b px-5 py-3">
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
        <div className="border-border/60 border-b px-5 py-3">
          <p className="text-foreground/80 text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      <FullAboutSection profile={profile} />

      <div className="border-border/60 bg-muted/50 border-t px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VerificationDot label="Email" verified />
            <VerificationDot label="Photo" verified={profile.verified} />
          </div>
        </div>
      </div>

      {Boolean(actionButton) && (
        <div className="border-border/60 border-t px-5 py-3">
          {actionButton}
        </div>
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
