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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ListingCard } from "@/components/listing-card";
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

type Profile = NonNullable<
  ReturnType<typeof useQuery<typeof api.profiles.listProfiles>>
>[number];

// Filter bar component
function FilterBar({
  selectedCity,
  selectedDate,
  selectedLanguage,
  onCityChange,
  onDateChange,
  onLanguageChange,
  onClear,
  t,
}: {
  selectedCity: string;
  selectedDate: string;
  selectedLanguage: string;
  onCityChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onLanguageChange: (v: string) => void;
  onClear: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const hasFilters = selectedCity || selectedDate || selectedLanguage;

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 md:flex-row lg:w-auto">
      <Select
        onValueChange={(v) => onCityChange(v === "__all__" ? "" : v)}
        value={selectedCity || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anywhereInLithuania} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anywhereInLithuania}</SelectItem>
          {CITIES.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(v) => onDateChange(v === "__all__" ? "" : v)}
        value={selectedDate || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anyDates} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyDates}</SelectItem>
          {HOLIDAY_DATES.map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(v) => onLanguageChange(v === "__all__" ? "" : v)}
        value={selectedLanguage || "__all__"}
      >
        <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
          <Globe className="mr-2 h-4 w-4 text-gray-400" />
          <SelectValue placeholder={t.anyLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">{t.anyLanguage}</SelectItem>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
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
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          className="h-80 animate-pulse rounded-xl border border-gray-100 bg-white"
          key={i}
        >
          <div className="h-48 rounded-t-xl bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
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

export default function BrowsePage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<"host" | "guest">("host");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Query profiles from Convex
  const profiles = useQuery(api.profiles.listProfiles, {
    city: selectedCity || undefined,
    role: activeTab,
    language: selectedLanguage || undefined,
    date: selectedDate || undefined,
  });

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  // Get my pending invitations to find invitation IDs for Accept
  const myInvitations = useQuery(api.invitations.getMyInvitations);

  const handleInvite = async (userId: Id<"users">) => {
    try {
      await sendInvitation({
        toUserId: userId,
        date: "24 Dec", // TODO: Let user pick date
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

  // Track if we've loaded at least once to avoid showing skeleton on tab switch
  const hasLoadedOnce = useRef(false);
  const previousProfiles = useRef<typeof profiles>([]);

  useEffect(() => {
    if (profiles !== undefined) {
      hasLoadedOnce.current = true;
      previousProfiles.current = profiles;
    }
  }, [profiles]);

  // Only show skeleton on initial load, not on tab/filter switches
  const isLoading = profiles === undefined && !hasLoadedOnce.current;
  // Use previous profiles while loading to avoid "0 found" flash
  const filteredProfiles = profiles ?? previousProfiles.current ?? [];

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProfiles.map((profile) => (
            <ListingCard
              key={profile._id}
              onAccept={() => handleAccept(profile.userId)}
              onInvite={() => handleInvite(profile.userId)}
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
            <div className="flex flex-shrink-0 rounded-lg bg-gray-100 p-1">
              <button
                className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === "host"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("host")}
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
                onClick={() => setActiveTab("guest")}
                type="button"
              >
                {t.findGuests}
              </button>
            </div>

            <FilterBar
              onCityChange={setSelectedCity}
              onClear={clearFilters}
              onDateChange={setSelectedDate}
              onLanguageChange={setSelectedLanguage}
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-xl">
            {isLoading
              ? t.loading
              : `${filteredProfiles.length} ${activeTab === "host" ? t.hostsFound : t.guestsFound}`}
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
                  onClick={() => setSortBy("recommended")}
                  type="button"
                >
                  {t.recommended}
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
                  onClick={() => setSortBy("newest")}
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
                onClick={() => setViewMode("grid")}
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
                onClick={() => setViewMode("list")}
                type="button"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {renderResults()}
      </div>
    </div>
  );
}
