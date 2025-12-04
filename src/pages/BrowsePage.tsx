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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ListingCard } from '../components/ListingCard';
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
      alert('Invitation sent! Check your inbox.');
    } catch {
      alert('Failed to send invitation. Please try again.');
    }
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedDate('');
    setSelectedLanguage('');
  };

  const isLoading = profiles === undefined;
  const filteredProfiles = profiles ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar / Search Widget */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('host')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'host'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Find a Host
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guest')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'guest'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Find Guests
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex-1 w-full lg:w-auto flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all overflow-hidden h-12 shadow-sm">
                <div className="pl-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <select
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-800"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Anywhere in Lithuania</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full flex items-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all overflow-hidden h-12 shadow-sm">
                <div className="pl-3 text-gray-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <select
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-800"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Any Dates</option>
                  {HOLIDAY_DATES.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full flex items-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all overflow-hidden h-12 shadow-sm">
                <div className="pl-3 text-gray-400">
                  <Globe className="w-5 h-5" />
                </div>
                <select
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-800"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Any Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Button */}
              {(selectedCity || selectedDate || selectedLanguage) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-12 px-4 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent"
                  title="Clear Filters"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isLoading
              ? 'Loading...'
              : `${filteredProfiles.length} ${activeTab === 'host' ? 'Hosts' : 'Guests'} found`}
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                Sort by: <span className="text-black font-bold capitalize">{sortBy}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden hidden group-hover:block z-50">
                <button
                  type="button"
                  onClick={() => setSortBy('recommended')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  Recommended
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  Newest
                </button>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 h-80 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <ListingCard
                key={profile._id}
                profile={profile}
                onInvite={() => handleInvite(profile.userId)}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all group"
              >
                <div className="w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={
                      profile.photoUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
                    }
                    alt={profile.firstName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {profile.firstName}
                        {profile.role !== 'host' && profile.age && `, ${profile.age}`}
                      </h3>
                      <p className="text-gray-500 flex items-center gap-1 text-xs mt-1">
                        <MapPin className="w-3 h-3" /> {profile.city}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-md border ${
                        profile.verified
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-gray-50 text-gray-500 border-gray-100'
                      }`}
                    >
                      {profile.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{profile.bio}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.languages.map((l) => (
                      <span
                        key={l}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-48 flex flex-col justify-between py-1 border-t md:border-t-0 md:border-l border-gray-100 pl-0 md:pl-6 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                      Availability
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.availableDates.map((d) => (
                        <span
                          key={d}
                          className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 mt-auto">
                    <Link
                      to={`/profile/${profile.userId}`}
                      className="block w-full text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-xs font-medium transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleInvite(profile.userId)}
                      className="block w-full text-center py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {activeTab === 'host' ? 'Request to Join' : 'Send Invite'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProfiles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or dates.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-red-600 hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
