"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Calendar,
  ChevronDown,
  Globe,
  Grid,
  List,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { posthog } from "posthog-js";
import { useState } from "react";
import { toast } from "sonner";

import { ProfileActionButton } from "@/components/profile-action-button";
import { ProfileCard } from "@/components/profile-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

// PostHog event names - centralized for consistency and typo prevention
const POSTHOG_EVENTS = {
  INVITATION_SENT: "invitation_sent",
  BROWSE_TAB_SWITCHED: "browse_tab_switched",
} as const;

type InvitationDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";

// Invitations can only be sent for these dates (see convex/invitations.ts `send`).
const INVITATION_DATES: ReadonlySet<string> = new Set([
  "24 Dec",
  "25 Dec",
  "26 Dec",
  "31 Dec",
]);

const isInvitationDate = (value: string): value is InvitationDate =>
  INVITATION_DATES.has(value);

type Profile = NonNullable<
  ReturnType<typeof useQuery<typeof api.profiles.listProfiles>>
>[number];

// Sort and view mode controls
const ResultsHeader = ({
  isLoading,
  count,
  activeTab,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  t,
}: {
  isLoading: boolean;
  count: number;
  activeTab: "host" | "guest";
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  t: ReturnType<typeof useLocale>["t"];
}) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-foreground text-xl font-bold">
      {isLoading
        ? t.loading
        : `${count} ${activeTab === "host" ? t.hostsFound : t.guestsFound}`}
    </h2>

    <div className="flex items-center gap-3">
      <div className="group relative">
        <button
          className="text-foreground/80 flex items-center gap-2 text-sm font-medium hover:text-black"
          type="button"
        >
          {t.sortBy}{" "}
          <span className="font-bold text-black capitalize">
            {sortBy === "recommended" ? t.recommended : t.newest}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="border-border/60 absolute right-0 z-50 mt-2 hidden w-40 overflow-hidden rounded-lg border bg-white shadow-lg group-hover:block">
          <button
            className="text-foreground/80 hover:bg-muted block w-full px-4 py-2 text-left text-sm"
            onClick={() => {
              onSortChange("recommended");
            }}
            type="button"
          >
            {t.recommended}
          </button>
          <button
            className="text-foreground/80 hover:bg-muted block w-full px-4 py-2 text-left text-sm"
            onClick={() => {
              onSortChange("newest");
            }}
            type="button"
          >
            {t.newest}
          </button>
        </div>
      </div>

      <div className="bg-border mx-2 h-6 w-px" />

      <div className="bg-muted flex rounded-lg p-0.5">
        <button
          className={`rounded-md p-2 ${
            viewMode === "grid"
              ? "bg-white text-black shadow-sm"
              : "text-muted-foreground/70 hover:text-muted-foreground"
          }`}
          onClick={() => {
            onViewModeChange("grid");
          }}
          type="button"
        >
          <Grid className="h-4 w-4" />
        </button>
        <button
          className={`rounded-md p-2 ${
            viewMode === "list"
              ? "bg-white text-black shadow-sm"
              : "text-muted-foreground/70 hover:text-muted-foreground"
          }`}
          onClick={() => {
            onViewModeChange("list");
          }}
          type="button"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

/**
 * Renders the filter bar with city, date, and language select controls and an optional "Clear" button.
 *
 * The selects display counts when provided and map a special `"__all__"` option to an empty string via change handlers.
 *
 * @param filterCounts - Optional counts for cities, languages, dates, and totalProfiles used to show option counts and disable empty options.
 * @param t - Localization function used for all visible labels and placeholders.
 * @param citySelectOpen - Controlled open state for the city select.
 * @param dateSelectOpen - Controlled open state for the date select.
 * @param languageSelectOpen - Controlled open state for the language select.
 * @param onCitySelectOpenChange - Callback invoked when the city select open state should change.
 * @param onDateSelectOpenChange - Callback invoked when the date select open state should change.
 * @param onLanguageSelectOpenChange - Callback invoked when the language select open state should change.
 * @returns A JSX element containing three Select controls (city, date, language) and a Clear button when any filter is active.
 */
const FilterBar = ({
  selectedCity,
  selectedDate,
  selectedLanguage,
  onCityChange,
  onDateChange,
  onLanguageChange,
  onClear,
  filterCounts,
  t,
  citySelectOpen,
  dateSelectOpen,
  languageSelectOpen,
  onCitySelectOpenChange,
  onDateSelectOpenChange,
  onLanguageSelectOpenChange,
}: {
  selectedCity: string;
  selectedDate: string;
  selectedLanguage: string;
  onCityChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onLanguageChange: (v: string) => void;
  onClear: () => void;
  filterCounts?: {
    cities: { name: string; count: number }[];
    languages: { name: string; count: number }[];
    dates: { name: string; count: number }[];
    totalProfiles: number;
  };
  t: ReturnType<typeof useLocale>["t"];
  citySelectOpen: boolean;
  dateSelectOpen: boolean;
  languageSelectOpen: boolean;
  onCitySelectOpenChange: (open: boolean) => void;
  onDateSelectOpenChange: (open: boolean) => void;
  onLanguageSelectOpenChange: (open: boolean) => void;
}) => {
  const hasFilters = selectedCity || selectedDate || selectedLanguage;

  // Get cities with profiles (already sorted by count from backend)
  const citiesWithProfiles = filterCounts
    ? filterCounts.cities
    : CITIES.map((name) => ({ name, count: 0 }));

  // Get languages with profiles (already sorted by count from backend)
  const languagesWithProfiles = filterCounts
    ? filterCounts.languages
    : LANGUAGES.map((name) => ({ name, count: 0 }));

  // Get dates with profiles (map to keep HOLIDAY_DATES order)
  const dateCountMap = new Map(
    filterCounts?.dates.map((d) => [d.name, d.count])
  );
  const datesWithProfiles = HOLIDAY_DATES.map((name) => ({
    name,
    count: dateCountMap.get(name) ?? 0,
  }));

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 md:flex-row lg:w-auto">
      <Select
        onOpenChange={onCitySelectOpenChange}
        onValueChange={(v) => {
          onCityChange(v === "__all__" ? "" : v);
        }}
        open={citySelectOpen}
        value={selectedCity || "__all__"}
      >
        <SelectTrigger className="w-full flex-1" size="lg">
          <MapPin className="text-muted-foreground/70 mr-2 h-4 w-4" />
          <SelectValue placeholder={t.anywhereInLithuania} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">
            {t.anywhereInLithuania}
            {filterCounts && (
              <span className="text-muted-foreground/70 ml-auto pl-2">
                {filterCounts.totalProfiles}
              </span>
            )}
          </SelectItem>
          {citiesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-muted-foreground" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-muted-foreground/50" : "text-muted-foreground/70"}`}
                >
                  {count}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onOpenChange={onDateSelectOpenChange}
        onValueChange={(v) => {
          onDateChange(v === "__all__" ? "" : v);
        }}
        open={dateSelectOpen}
        value={selectedDate || "__all__"}
      >
        <SelectTrigger className="w-full flex-1" size="lg">
          <Calendar className="text-muted-foreground/70 mr-2 h-4 w-4" />
          <SelectValue placeholder={t.anyDates} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyDates}</SelectItem>
          {datesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-muted-foreground" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-muted-foreground/50" : "text-muted-foreground/70"}`}
                >
                  {count}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onOpenChange={onLanguageSelectOpenChange}
        onValueChange={(v) => {
          onLanguageChange(v === "__all__" ? "" : v);
        }}
        open={languageSelectOpen}
        value={selectedLanguage || "__all__"}
      >
        <SelectTrigger className="w-full flex-1" size="lg">
          <Globe className="text-muted-foreground/70 mr-2 h-4 w-4" />
          <SelectValue placeholder={t.anyLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyLanguage}</SelectItem>
          {languagesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-muted-foreground" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-muted-foreground/50" : "text-muted-foreground/70"}`}
                >
                  {count}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-12 items-center justify-center rounded-lg border border-transparent px-4 transition-colors"
          onClick={onClear}
          title={t.clearFilters}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

// Connection action buttons for list view
const ConnectionActions = ({
  profile,
  activeTab,
  onAccept,
  onInvite,
  t,
}: {
  profile: Profile;
  activeTab: "host" | "guest";
  onAccept: () => void;
  onInvite: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) => {
  if (profile.connectionStatus === "matched") {
    return (
      <Link
        className="bg-success hover:bg-success-strong block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-white transition-colors"
        href="/messages"
      >
        {t.message}
      </Link>
    );
  }
  if (profile.connectionStatus === "pending_sent") {
    return (
      <span className="border-gold-rich bg-gold-soft/50 text-gold-strong block w-full rounded-lg border px-3 py-2 text-center text-xs font-medium">
        {t.pending}
      </span>
    );
  }
  if (profile.connectionStatus === "pending_received") {
    return (
      <button
        className="bg-info hover:bg-info-strong block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-white transition-colors"
        onClick={onAccept}
        type="button"
      >
        {t.accept}
      </button>
    );
  }
  return (
    <button
      className="bg-brand hover:bg-brand-strong block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-white transition-colors"
      onClick={onInvite}
      type="button"
    >
      {activeTab === "host" ? t.requestToJoin : t.sendRequest}
    </button>
  );
};

// List view item component
const ListViewItem = ({
  profile,
  activeTab,
  onAccept,
  onInvite,
  t,
}: {
  profile: Profile;
  activeTab: "host" | "guest";
  onAccept: () => void;
  onInvite: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) => (
  <div className="group border-border flex flex-col gap-6 rounded-xl border bg-white p-4 transition-all hover:shadow-md md:flex-row">
    <div className="bg-muted relative h-32 w-32 shrink-0 overflow-hidden rounded-lg">
      <Image
        alt={profile.firstName}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        fill
        sizes="128px"
        src={
          profile.photoUrl !== undefined && profile.photoUrl !== ""
            ? profile.photoUrl
            : `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
        }
      />
    </div>
    <div className="flex-1 py-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-foreground text-lg font-bold">
            {profile.firstName}
            {profile.role !== "host" && profile.age && `, ${profile.age}`}
          </h3>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3" /> {profile.city}
          </p>
        </div>
        <span
          className={`inline-block rounded-md border px-2 py-1 text-xs font-bold tracking-wide uppercase ${
            profile.verified
              ? "border-success/10 bg-success/5 text-success-strong"
              : "border-border/60 bg-muted/50 text-muted-foreground"
          }`}
        >
          {profile.verified ? t.verified : t.unverified}
        </span>
      </div>
      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
        {profile.bio}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.languages.map((l) => (
          <span
            className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs"
            key={l}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
    <div className="border-border/60 flex w-full flex-col justify-between gap-3 border-t py-1 pl-0 md:w-48 md:border-t-0 md:border-l md:pl-6">
      <div>
        <p className="text-foreground text-xs font-semibold tracking-wide uppercase">
          {t.availability}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {profile.availableDates.map((d) => (
            <span
              className="bg-brand/5 text-brand rounded px-1.5 py-0.5 text-xs"
              key={d}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <Link
          className="bg-muted text-foreground hover:bg-border block w-full rounded-lg px-3 py-2 text-center text-xs font-medium transition-colors"
          href={
            profile.username === undefined || profile.username === ""
              ? `/profile/${profile.userId}`
              : `/people/${profile.username}`
          }
        >
          {t.viewProfile}
        </Link>
        <ConnectionActions
          activeTab={activeTab}
          onAccept={onAccept}
          onInvite={onInvite}
          profile={profile}
          t={t}
        />
      </div>
    </div>
  </div>
);

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <div
        className="border-border animate-pulse rounded-lg border bg-white"
        key={i}
      >
        <div className="bg-border h-32 rounded-t-lg" />
        <div className="space-y-2 p-3">
          <div className="bg-border h-2 w-1/2 rounded" />
          <div className="bg-border h-2 w-3/4 rounded" />
          <div className="border-border/60 mt-3 border-t pt-2">
            <div className="bg-border h-2 w-1/3 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state
const EmptyState = ({
  onClear,
  t,
}: {
  onClear: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) => (
  <div className="border-border rounded-xl border border-dashed bg-white py-20 text-center">
    <SlidersHorizontal className="text-muted-foreground/50 mx-auto h-12 w-12" />
    <h3 className="text-foreground mt-2 text-sm font-medium">
      {t.noMatchesFound}
    </h3>
    <p className="text-muted-foreground mt-1 text-sm">
      {t.tryAdjustingFilters}
    </p>
    <button
      className="text-brand mt-4 text-sm font-medium hover:underline"
      onClick={onClear}
      type="button"
    >
      {t.clearAllFilters}
    </button>
  </div>
);

/**
 * Renders the Browse page containing filters, results (grid or list), and a profile detail modal.
 *
 * Renders a tabbed mode toggle (find hosts / find guests), a FilterBar with controlled open states,
 * a ResultsHeader with sorting and view-mode controls, a results area that shows a loading skeleton,
 * empty state, grid of listing cards or list items, and a slide-in profile modal with invitation/respond actions.
 *
 * The component manages UI state for active tab, view mode, selected filters, controlled select dropdown
 * visibility, selected profile, and invitation sending state. It issues Convex queries/mutations to
 * fetch profiles, filter counts, pending invitations, and connection status, and it shows toast feedback
 * for invite/respond workflows.
 *
 * @returns The rendered Browse page React element
 */
export default function BrowsePage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"host" | "guest">("host");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Select dropdown open states to prevent portal cleanup issues
  const [citySelectOpen, setCitySelectOpen] = useState(false);
  const [dateSelectOpen, setDateSelectOpen] = useState(false);
  const [languageSelectOpen, setLanguageSelectOpen] = useState(false);

  // Query profiles from Convex
  const profiles = useQuery(api.profiles.listProfiles, {
    city: selectedCity || undefined,
    role: activeTab,
    language: selectedLanguage || undefined,
    date: selectedDate || undefined,
  });

  // Get filter counts for dynamic filter options
  const filterCounts = useQuery(api.profiles.getFilterCounts, {
    role: activeTab,
  });

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  // Get my pending invitations to find invitation IDs for Accept
  const myInvitations = useQuery(api.invitations.getMyInvitations);

  // Get connection status for selected profile
  const connectionStatus = useQuery(
    api.invitations.getConnectionStatus,
    selectedProfile?.userId ? { otherUserId: selectedProfile.userId } : "skip"
  );

  const handleInvite = async (userId: Id<"users">) => {
    try {
      await sendInvitation({
        toUserId: userId,
        date: "24 Dec",
      });
      posthog.capture(POSTHOG_EVENTS.INVITATION_SENT, {
        to_user_id: userId,
        from_view: "list",
      });
      toast.success(t.requestSent);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("already sent")) {
        toast.error(t.alreadySentRequest);
      } else {
        toast.error(`${t.failedToSendRequest}: ${message}`);
      }
    }
  };

  const handleSheetInvite = async () => {
    if (!selectedProfile) {
      return;
    }
    setIsSending(true);
    // Find first available date that matches the valid invitation dates
    const firstValidDate =
      selectedProfile.availableDates?.find(isInvitationDate) ?? "24 Dec";
    try {
      await sendInvitation({
        toUserId: selectedProfile.userId,
        date: firstValidDate,
      });
      posthog.capture(POSTHOG_EVENTS.INVITATION_SENT, {
        to_user_id: selectedProfile.userId,
        from_view: "profile_modal",
      });
      toast.success(t.requestSent);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("already sent")) {
        toast.error(t.alreadySentRequest);
      } else {
        toast.error(`${t.failedToSendRequest}: ${message}`);
      }
    }
    setIsSending(false);
  };

  const handleSheetRespond = async (accept: boolean) => {
    if (!connectionStatus?.invitationId) {
      return;
    }
    setIsSending(true);
    try {
      await respondToInvitation({
        invitationId: connectionStatus.invitationId,
        accept,
      });
      if (accept) {
        toast.success(t.youreMatched);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`${t.failedToAccept}: ${message}`);
    }
    setIsSending(false);
  };

  const handleAccept = async (userId: Id<"users">) => {
    // Find the pending invitation from this user
    const invitation = myInvitations?.received.find(
      (inv) => inv.fromUserId === userId && inv.status === "pending"
    );
    if (!invitation) {
      toast.error(t.invitationNotFound);
      return;
    }
    try {
      await respondToInvitation({ invitationId: invitation._id, accept: true });
      toast.success(t.youreMatched);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`${t.failedToAccept}: ${message}`);
    }
  };

  const clearFilters = () => {
    setSelectedCity("");
    setSelectedDate("");
    setSelectedLanguage("");
  };

  // Close all select dropdowns when modal opens/closes to prevent portal cleanup issues
  const changeSelectedProfile = (profile: Profile | null) => {
    setSelectedProfile(profile);
    setCitySelectOpen(false);
    setDateSelectOpen(false);
    setLanguageSelectOpen(false);
  };

  // Remember the last loaded profiles (per tab) to avoid showing the skeleton or a
  // "0 found" flash while a filter change is loading. A tab switch starts empty again.
  const [lastLoaded, setLastLoaded] = useState<{
    tab: "host" | "guest";
    profiles: Profile[];
  }>({ tab: activeTab, profiles: [] });
  if (
    profiles !== undefined &&
    (lastLoaded.profiles !== profiles || lastLoaded.tab !== activeTab)
  ) {
    setLastLoaded({ tab: activeTab, profiles });
  }
  const previousProfiles =
    lastLoaded.tab === activeTab ? lastLoaded.profiles : [];

  // Show loading on initial load OR when tab just changed and data isn't ready
  const isLoading = profiles === undefined && previousProfiles.length === 0;
  // Use previous profiles while loading to avoid "0 found" flash (only for same tab)
  const filteredProfiles = profiles ?? previousProfiles;

  // Render results content
  const renderResults = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (filteredProfiles.length === 0) {
      return <EmptyState onClear={clearFilters} t={t} />;
    }
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile._id}
              onClick={() => {
                changeSelectedProfile(profile);
              }}
              profile={profile}
              variant="compact"
            />
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {filteredProfiles.map((profile) => (
          <ListViewItem
            activeTab={activeTab}
            key={profile._id}
            onAccept={() => {
              void handleAccept(profile.userId);
            }}
            onInvite={() => {
              void handleInvite(profile.userId);
            }}
            profile={profile}
            t={t}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-muted/50 min-h-screen pb-20">
      {/* Top Bar / Search Widget */}
      <div className="border-border sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Mode Toggle */}
            <div className="bg-muted flex shrink-0 rounded-lg p-1">
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "host"
                    ? "text-foreground bg-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveTab("host");
                  posthog.capture(POSTHOG_EVENTS.BROWSE_TAB_SWITCHED, {
                    active_tab: "host",
                  });
                }}
                type="button"
              >
                {t.findAHost}
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "guest"
                    ? "text-foreground bg-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setActiveTab("guest");
                  posthog.capture(POSTHOG_EVENTS.BROWSE_TAB_SWITCHED, {
                    active_tab: "guest",
                  });
                }}
                type="button"
              >
                {t.findGuests}
              </button>
            </div>

            <FilterBar
              citySelectOpen={citySelectOpen}
              dateSelectOpen={dateSelectOpen}
              filterCounts={filterCounts ?? undefined}
              languageSelectOpen={languageSelectOpen}
              onCityChange={setSelectedCity}
              onCitySelectOpenChange={setCitySelectOpen}
              onClear={clearFilters}
              onDateChange={setSelectedDate}
              onDateSelectOpenChange={setDateSelectOpen}
              onLanguageChange={setSelectedLanguage}
              onLanguageSelectOpenChange={setLanguageSelectOpen}
              selectedCity={selectedCity}
              selectedDate={selectedDate}
              selectedLanguage={selectedLanguage}
              t={t}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <ResultsHeader
          activeTab={activeTab}
          count={filteredProfiles.length}
          isLoading={isLoading}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          t={t}
          viewMode={viewMode}
        />

        {renderResults()}
      </div>

      {/* Profile Card Modal */}
      {selectedProfile && (
        <dialog
          aria-label="Profile modal"
          aria-modal="true"
          className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-none bg-black/50 p-4 text-inherit"
          open
        >
          {/* Backdrop button for closing */}
          <button
            aria-label="Close modal"
            className="absolute inset-0 h-full w-full cursor-default bg-transparent"
            onClick={() => {
              changeSelectedProfile(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                changeSelectedProfile(null);
              }
            }}
            type="button"
          />
          <div className="slide-in-from-right-full animate-in relative duration-300">
            <ProfileCard
              actionButton={
                <ProfileActionButton
                  hasAvailableDates={
                    (selectedProfile.availableDates?.length ?? 0) > 0
                  }
                  isSending={isSending}
                  onAccept={() => {
                    void handleSheetRespond(true);
                  }}
                  onConnect={() => {
                    void handleSheetInvite();
                  }}
                  onDecline={() => {
                    void handleSheetRespond(false);
                  }}
                  status={connectionStatus?.status}
                  userId={selectedProfile.userId}
                />
              }
              profile={selectedProfile}
              variant="full"
            />
          </div>
        </dialog>
      )}
    </div>
  );
}
