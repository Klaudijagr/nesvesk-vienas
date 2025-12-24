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
import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ListingCard } from "@/components/listing-card";
import { ProfileActionButton } from "@/components/profile-action-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnifiedProfileCard } from "@/components/unified-profile-card";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CITIES, HOLIDAY_DATES, LANGUAGES } from "@/lib/types";

// PostHog event names - centralized for consistency and typo prevention
const POSTHOG_EVENTS = {
  INVITATION_SENT: "invitation_sent",
  BROWSE_TAB_SWITCHED: "browse_tab_switched",
} as const;

type Profile = NonNullable<
  ReturnType<typeof useQuery<typeof api.profiles.listProfiles>>
>[number];

// Sort and view mode controls
function ResultsHeader({
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
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-bold text-gray-900 text-xl">
        {isLoading
          ? t.loading
          : `${count} ${activeTab === "host" ? t.hostsFound : t.guestsFound}`}
      </h2>

      <div className="flex items-center gap-3">
        <div className="group relative">
          <button
            className="flex items-center gap-2 font-medium text-gray-700 text-sm hover:text-black"
            type="button"
          >
            {t.sortBy}{" "}
            <span className="font-bold text-black capitalize">
              {sortBy === "recommended" ? t.recommended : t.newest}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="absolute right-0 z-50 mt-2 hidden w-40 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg group-hover:block">
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
              onClick={() => onSortChange("recommended")}
              type="button"
            >
              {t.recommended}
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
              onClick={() => onSortChange("newest")}
              type="button"
            >
              {t.newest}
            </button>
          </div>
        </div>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        <div className="flex rounded-lg bg-gray-100 p-0.5">
          <button
            className={`rounded-md p-2 ${
              viewMode === "grid"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => onViewModeChange("grid")}
            type="button"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            className={`rounded-md p-2 ${
              viewMode === "list"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => onViewModeChange("list")}
            type="button"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

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
function FilterBar({
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
    cities: Array<{ name: string; count: number }>;
    languages: Array<{ name: string; count: number }>;
    dates: Array<{ name: string; count: number }>;
    totalProfiles: number;
  };
  t: ReturnType<typeof useLocale>["t"];
  citySelectOpen: boolean;
  dateSelectOpen: boolean;
  languageSelectOpen: boolean;
  onCitySelectOpenChange: (open: boolean) => void;
  onDateSelectOpenChange: (open: boolean) => void;
  onLanguageSelectOpenChange: (open: boolean) => void;
}) {
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
    filterCounts?.dates.map((d) => [d.name, d.count]) ?? []
  );
  const datesWithProfiles = HOLIDAY_DATES.map((name) => ({
    name,
    count: dateCountMap.get(name) ?? 0,
  }));

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 md:flex-row lg:w-auto">
      <Select
        onOpenChange={onCitySelectOpenChange}
        onValueChange={(v) => onCityChange(v === "__all__" ? "" : v)}
        open={citySelectOpen}
        value={selectedCity || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anywhereInLithuania} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">
            {t.anywhereInLithuania}
            {filterCounts && (
              <span className="ml-auto pl-2 text-gray-400">
                {filterCounts.totalProfiles}
              </span>
            )}
          </SelectItem>
          {citiesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-gray-400" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-gray-300" : "text-gray-400"}`}
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
        onValueChange={(v) => onDateChange(v === "__all__" ? "" : v)}
        open={dateSelectOpen}
        value={selectedDate || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anyDates} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyDates}</SelectItem>
          {datesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-gray-400" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-gray-300" : "text-gray-400"}`}
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
        onValueChange={(v) => onLanguageChange(v === "__all__" ? "" : v)}
        open={languageSelectOpen}
        value={selectedLanguage || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <Globe className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anyLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyLanguage}</SelectItem>
          {languagesWithProfiles.map(({ name, count }) => (
            <SelectItem
              className={count === 0 ? "text-gray-400" : ""}
              disabled={count === 0}
              key={name}
              value={name}
            >
              <span className="flex w-full items-center justify-between">
                <span>{name}</span>
                <span
                  className={`ml-auto pl-2 ${count === 0 ? "text-gray-300" : "text-gray-400"}`}
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
          className="flex h-12 items-center justify-center rounded-lg border border-transparent px-4 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          onClick={onClear}
          title={t.clearFilters}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

// Connection action buttons for list view
function ConnectionActions({
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
}) {
  if (profile.connectionStatus === "matched") {
    return (
      <Link
        className="block w-full rounded-lg bg-green-600 px-3 py-2 text-center font-medium text-white text-xs transition-colors hover:bg-green-700"
        href="/messages"
      >
        {t.message}
      </Link>
    );
  }
  if (profile.connectionStatus === "pending_sent") {
    return (
      <span className="block w-full rounded-lg border border-amber-500 bg-amber-50 px-3 py-2 text-center font-medium text-amber-600 text-xs">
        {t.pending}
      </span>
    );
  }
  if (profile.connectionStatus === "pending_received") {
    return (
      <button
        className="block w-full rounded-lg bg-blue-600 px-3 py-2 text-center font-medium text-white text-xs transition-colors hover:bg-blue-700"
        onClick={onAccept}
        type="button"
      >
        {t.accept}
      </button>
    );
  }
  return (
    <button
      className="block w-full rounded-lg bg-red-600 px-3 py-2 text-center font-medium text-white text-xs transition-colors hover:bg-red-700"
      onClick={onInvite}
      type="button"
    >
      {activeTab === "host" ? t.requestToJoin : t.sendRequest}
    </button>
  );
}

// List view item component
function ListViewItem({
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
}) {
  return (
    <div className="group flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md md:flex-row">
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={profile.firstName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="128px"
          src={
            profile.photoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
          }
        />
      </div>
      <div className="flex-1 py-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {profile.firstName}
              {profile.role !== "host" && profile.age && `, ${profile.age}`}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-gray-500 text-xs">
              <MapPin className="h-3 w-3" /> {profile.city}
            </p>
          </div>
          <span
            className={`inline-block rounded-md border px-2 py-1 font-bold text-xs uppercase tracking-wide ${
              profile.verified
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-gray-100 bg-gray-50 text-gray-500"
            }`}
          >
            {profile.verified ? t.verified : t.unverified}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-gray-600 text-sm">{profile.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.languages.map((l) => (
            <span
              className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 text-xs"
              key={l}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col justify-between gap-3 border-gray-100 border-t py-1 pl-0 md:w-48 md:border-t-0 md:border-l md:pl-6">
        <div>
          <p className="font-semibold text-gray-900 text-xs uppercase tracking-wide">
            {t.availability}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {profile.availableDates.map((d) => (
              <span
                className="rounded bg-red-50 px-1.5 py-0.5 text-red-600 text-xs"
                key={d}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto space-y-2">
          <Link
            className="block w-full rounded-lg bg-gray-100 px-3 py-2 text-center font-medium text-gray-900 text-xs transition-colors hover:bg-gray-200"
            href={
              profile.username
                ? `/people/${profile.username}`
                : `/profile/${profile.userId}`
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
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div
          className="animate-pulse rounded-lg border border-gray-200 bg-white"
          key={i}
        >
          <div className="h-32 rounded-t-lg bg-gray-200" />
          <div className="space-y-2 p-3">
            <div className="h-2 w-1/2 rounded bg-gray-200" />
            <div className="h-2 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 border-gray-100 border-t pt-2">
              <div className="h-2 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({
  onClear,
  t,
}: {
  onClear: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) {
  return (
    <div className="rounded-xl border border-gray-300 border-dashed bg-white py-20 text-center">
      <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-2 font-medium text-gray-900 text-sm">
        {t.noMatchesFound}
      </h3>
      <p className="mt-1 text-gray-500 text-sm">{t.tryAdjustingFilters}</p>
      <button
        className="mt-4 font-medium text-red-600 text-sm hover:underline"
        onClick={onClear}
        type="button"
      >
        {t.clearAllFilters}
      </button>
    </div>
  );
}

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
    selectedProfile?.userId
      ? { otherUserId: selectedProfile.userId as Id<"users"> }
      : "skip"
  );

  const handleInvite = async (userId: Id<"users">) => {
    try {
      await sendInvitation({
        toUserId: userId,
        date: "24 Dec", // TODO: Let user pick date
      });
      posthog.capture(POSTHOG_EVENTS.INVITATION_SENT, {
        to_user_id: userId,
        from_view: "list",
      });
      toast.success(t.requestSent);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
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
    const validDates = ["24 Dec", "25 Dec", "26 Dec", "31 Dec"] as const;
    const firstValidDate =
      selectedProfile.availableDates?.find((d) =>
        validDates.includes(d as (typeof validDates)[number])
      ) || "24 Dec";
    try {
      await sendInvitation({
        toUserId: selectedProfile.userId as Id<"users">,
        date: firstValidDate as "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec",
      });
      posthog.capture(POSTHOG_EVENTS.INVITATION_SENT, {
        to_user_id: selectedProfile.userId,
        from_view: "profile_modal",
      });
      toast.success(t.requestSent);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message.includes("already sent")) {
        toast.error(t.alreadySentRequest);
      } else {
        toast.error(`${t.failedToSendRequest}: ${message}`);
      }
    } finally {
      setIsSending(false);
    }
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`${t.failedToAccept}: ${message}`);
    } finally {
      setIsSending(false);
    }
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`${t.failedToAccept}: ${message}`);
    }
  };

  const clearFilters = () => {
    setSelectedCity("");
    setSelectedDate("");
    setSelectedLanguage("");
  };

  // Close all select dropdowns when modal opens/closes to prevent portal cleanup issues
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedProfile is intentionally used as trigger
  useEffect(() => {
    setCitySelectOpen(false);
    setDateSelectOpen(false);
    setLanguageSelectOpen(false);
  }, [selectedProfile]);

  // Track if we've loaded at least once to avoid showing skeleton on tab switch
  const hasLoadedOnce = useRef(false);
  const previousProfiles = useRef<Profile[]>([]);
  const previousTab = useRef(activeTab);

  // Reset previous profiles when tab changes to avoid showing wrong count
  useEffect(() => {
    if (previousTab.current !== activeTab) {
      previousProfiles.current = [];
      previousTab.current = activeTab;
    }
  }, [activeTab]);

  useEffect(() => {
    if (profiles !== undefined) {
      hasLoadedOnce.current = true;
      previousProfiles.current = profiles;
    }
  }, [profiles]);

  // Show loading on initial load OR when tab just changed and data isn't ready
  const isLoading =
    profiles === undefined &&
    (!hasLoadedOnce.current || previousProfiles.current.length === 0);
  // Use previous profiles while loading to avoid "0 found" flash (only for same tab)
  const filteredProfiles = profiles ?? previousProfiles.current;

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
            <ListingCard
              key={profile._id}
              onClick={() => setSelectedProfile(profile)}
              profile={profile}
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
            onAccept={() => handleAccept(profile.userId)}
            onInvite={() => handleInvite(profile.userId)}
            profile={profile}
            t={t}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar / Search Widget */}
      <div className="sticky top-0 z-40 border-gray-200 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Mode Toggle */}
            <div className="flex shrink-0 rounded-lg bg-gray-100 p-1">
              <button
                className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === "host"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
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
                className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === "guest"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
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
        <div
          aria-label="Profile modal"
          aria-modal="true"
          className="fixed inset-0 z-50 m-0 flex h-full w-full max-w-none items-center justify-center border-none bg-black/50 p-4"
          role="dialog"
        >
          {/* Backdrop button for closing */}
          <button
            aria-label="Close modal"
            className="absolute inset-0 h-full w-full cursor-default bg-transparent"
            onClick={() => setSelectedProfile(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSelectedProfile(null);
              }
            }}
            type="button"
          />
          <div className="slide-in-from-right-full relative animate-in duration-300">
            <UnifiedProfileCard
              actionButton={
                <ProfileActionButton
                  hasAvailableDates={
                    (selectedProfile.availableDates?.length ?? 0) > 0
                  }
                  isSending={isSending}
                  onAccept={() => handleSheetRespond(true)}
                  onConnect={handleSheetInvite}
                  onDecline={() => handleSheetRespond(false)}
                  status={connectionStatus?.status}
                  userId={selectedProfile.userId}
                />
              }
              profile={selectedProfile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
