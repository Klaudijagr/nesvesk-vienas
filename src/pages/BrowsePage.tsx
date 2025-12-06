import { useMutation, useQuery } from 'convex/react';
import {
  Calendar,
  ChevronDown,
  Globe,
  Grid,
  List,
  MapPin,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ListingCard } from '../components/ListingCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CITIES, HOLIDAY_DATES, LANGUAGES } from '../lib/types';

export function BrowsePage() {
  const [activeTab, setActiveTab] = useState<'host' | 'guest'>('host');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Query profiles from Convex
  const profiles = useQuery(api.profiles.listProfiles, {
    city: selectedCity || undefined,
    role: activeTab,
    language: selectedLanguage || undefined,
    date: selectedDate || undefined,
  });

  const sendInvitation = useMutation(api.invitations.send);

  const handleInvite = async (userId: Id<'users'>) => {
    try {
      await sendInvitation({
        toUserId: userId,
        date: '24 Dec', // TODO: Let user pick date
      });
      alert('Request sent!');
    } catch {
      alert('Failed to send request. Please try again.');
    }
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedDate('');
    setSelectedLanguage('');
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar / Search Widget */}
      <div className="sticky top-16 z-40 border-gray-200 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Mode Toggle */}
            <div className="flex flex-shrink-0 rounded-lg bg-gray-100 p-1">
              <button
                className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === 'host'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('host')}
                type="button"
              >
                Find a Host
              </button>
              <button
                className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === 'guest'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('guest')}
                type="button"
              >
                Find Guests
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex w-full flex-1 flex-col items-center gap-2 md:flex-row lg:w-auto">
              {/* City Select */}
              <Select
                onValueChange={(v) => setSelectedCity(v === '__all__' ? '' : v)}
                value={selectedCity || '__all__'}
              >
                <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Anywhere in Lithuania" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Anywhere in Lithuania</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Select */}
              <Select
                onValueChange={(v) => setSelectedDate(v === '__all__' ? '' : v)}
                value={selectedDate || '__all__'}
              >
                <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Any Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any Dates</SelectItem>
                  {HOLIDAY_DATES.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Language Select */}
              <Select
                onValueChange={(v) => setSelectedLanguage(v === '__all__' ? '' : v)}
                value={selectedLanguage || '__all__'}
              >
                <SelectTrigger className="h-12 w-full flex-1 rounded-lg border-gray-200 bg-white shadow-sm hover:border-gray-300">
                  <Globe className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Any Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any Language</SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Button */}
              {(selectedCity || selectedDate || selectedLanguage) && (
                <button
                  className="flex h-12 items-center justify-center rounded-lg border border-transparent px-4 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={clearFilters}
                  title="Clear Filters"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-xl">
            {isLoading
              ? 'Loading...'
              : `${filteredProfiles.length} ${activeTab === 'host' ? 'Hosts' : 'Guests'} found`}
          </h2>

          <div className="flex items-center gap-3">
            <div className="group relative">
              <button
                className="flex items-center gap-2 font-medium text-gray-700 text-sm hover:text-black"
                type="button"
              >
                Sort by: <span className="font-bold text-black capitalize">{sortBy}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute right-0 z-50 mt-2 hidden w-40 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg group-hover:block">
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
                  onClick={() => setSortBy('recommended')}
                  type="button"
                >
                  Recommended
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
                  onClick={() => setSortBy('newest')}
                  type="button"
                >
                  Newest
                </button>
              </div>
            </div>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                className={`rounded-md p-2 ${
                  viewMode === 'grid'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => setViewMode('grid')}
                type="button"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                className={`rounded-md p-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => setViewMode('list')}
                type="button"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
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
        )}

        {/* Grid View */}
        {!isLoading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProfiles.map((profile) => (
              <ListingCard
                key={profile._id}
                onInvite={() => handleInvite(profile.userId)}
                profile={profile}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <div
                className="group flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md md:flex-row"
                key={profile._id}
              >
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    alt={profile.firstName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                        {profile.role !== 'host' && profile.age && `, ${profile.age}`}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin className="h-3 w-3" /> {profile.city}
                      </p>
                    </div>
                    <span
                      className={`inline-block rounded-md border px-2 py-1 font-bold text-xs uppercase tracking-wide ${
                        profile.verified
                          ? 'border-green-100 bg-green-50 text-green-700'
                          : 'border-gray-100 bg-gray-50 text-gray-500'
                      }`}
                    >
                      {profile.verified ? 'Verified' : 'Unverified'}
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
                      Availability
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
                      to={`/profile/${profile.userId}`}
                    >
                      View Profile
                    </Link>
                    <button
                      className="block w-full rounded-lg bg-red-600 px-3 py-2 text-center font-medium text-white text-xs transition-colors hover:bg-red-700"
                      onClick={() => handleInvite(profile.userId)}
                      type="button"
                    >
                      {activeTab === 'host' ? 'Request to Join' : 'Send Request'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProfiles.length === 0 && (
          <div className="rounded-xl border border-gray-300 border-dashed bg-white py-20 text-center">
            <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 font-medium text-gray-900 text-sm">No matches found</h3>
            <p className="mt-1 text-gray-500 text-sm">Try adjusting your filters or dates.</p>
            <button
              className="mt-4 font-medium text-red-600 text-sm hover:underline"
              onClick={clearFilters}
              type="button"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
