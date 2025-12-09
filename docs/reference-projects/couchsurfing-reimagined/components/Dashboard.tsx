import {
  ArrowUpDown,
  CheckCircle,
  Grid,
  List,
  MapPin,
  Search,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { MOCK_USERS } from "../constants";
import type { User } from "../types";

interface DashboardProps {
  onViewProfile: (userId: string) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ onViewProfile }) => {
  const [viewMode, setViewMode] = useState<"travelers" | "hosts">("hosts");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [location, setLocation] = useState("West Virginia, USA");

  // Filters State
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<"lastLogin" | "references" | "name">(
    "lastLogin"
  );

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const getFilteredUsers = () => {
    let users = MOCK_USERS;

    // 1. Filter by View Mode (Host vs Traveler)
    if (viewMode === "hosts") {
      users = users.filter((u) =>
        ["accepting_guests", "maybe_accepting_guests"].includes(u.status)
      );
    } else {
      users = users.filter((u) =>
        ["wants_to_meet_up", "not_accepting_guests"].includes(u.status)
      );
    }

    // 2. Apply Custom Filters
    if (activeFilters.includes("Verified")) {
      users = users.filter(
        (u) => u.verification.payment || u.verification.governmentId
      );
    }
    if (activeFilters.includes("With References")) {
      users = users.filter((u) => u.referencesCount > 0);
    }

    // 3. Sorting
    return users.sort((a, b) => {
      if (sortMode === "references")
        return b.referencesCount - a.referencesCount;
      if (sortMode === "name") return a.name.localeCompare(b.name);
      // Default: Last Login (mock logic)
      return 0;
    });
  };

  const displayedUsers = getFilteredUsers();

  const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const handleClick = () => onViewProfile(user.id);

    if (layoutMode === "list") {
      return (
        <div
          className="group flex h-24 cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-4 shadow-sm transition-all hover:bg-gray-50"
          onClick={handleClick}
        >
          {/* Avatar */}
          <img
            alt={user.name}
            className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover"
            src={user.avatarUrl}
          />

          {/* Main Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-bold text-gray-900 text-sm">
                {user.name}
              </h3>
              {user.verification.payment && (
                <CheckCircle className="text-green-500" size={14} />
              )}
            </div>
            <p className="mb-1 flex items-center gap-1 text-gray-500 text-xs">
              <MapPin size={12} /> {user.location}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 font-bold text-[10px] uppercase ${
                  user.status === "accepting_guests"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.status === "accepting_guests"
                  ? "Accepting"
                  : user.status.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-gray-400">
                • {user.responseTime}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden w-32 shrink-0 flex-col items-end gap-1 text-gray-500 text-xs md:flex">
            <span className="font-semibold text-gray-700">
              {user.referencesCount} References
            </span>
            <span>{user.friendsCount} Friends</span>
            <span className="text-gray-400 italic">
              Active {user.lastLogin}
            </span>
          </div>
        </div>
      );
    }

    // Grid Card (Compact)
    return (
      <div
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        onClick={handleClick}
      >
        <div className="relative h-32">
          <img
            alt={user.name}
            className="h-full w-full object-cover"
            src={user.avatarUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 text-white">
            <h3 className="font-bold text-sm shadow-black drop-shadow-md">
              {user.name}
            </h3>
            <p className="flex items-center gap-1 text-[10px] opacity-90">
              <MapPin size={10} /> {user.location}
            </p>
          </div>
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {user.verification.payment && (
              <div className="rounded-full bg-white p-0.5">
                <CheckCircle className="text-green-600" size={12} />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span
                className={`rounded border px-1.5 py-0.5 font-bold text-[9px] uppercase ${
                  user.status === "accepting_guests"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              >
                {user.status === "accepting_guests"
                  ? "Accepting"
                  : user.status.replace(/_/g, " ")}
              </span>
              <span className="text-[9px] text-gray-400">
                {user.responseTime}
              </span>
            </div>
            <p className="line-clamp-2 text-[11px] text-gray-600 leading-relaxed">
              I'm a {user.occupation} who speaks {user.languages[0]}.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3 border-gray-50 border-t pt-2 text-[10px] text-gray-500">
            <span className="font-semibold text-gray-700">
              {user.referencesCount} Refs
            </span>
            <span>{user.friendsCount} Friends</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12">
      {/* Attached Search Header */}
      <div className="-mt-1 sticky top-16 z-40 mx-auto mb-6 max-w-7xl rounded-b-xl border-gray-200 border-x border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-3 md:flex-row">
            {/* Toggle Switch */}
            <div className="flex w-full shrink-0 rounded-lg bg-gray-100 p-1 md:w-auto">
              <button
                className={`flex-1 rounded-md px-4 py-1.5 font-bold text-xs transition-all md:flex-none ${viewMode === "hosts" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setViewMode("hosts")}
              >
                Find Hosts
              </button>
              <button
                className={`flex-1 rounded-md px-4 py-1.5 font-bold text-xs transition-all md:flex-none ${viewMode === "travelers" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setViewMode("travelers")}
              >
                Find Travelers
              </button>
            </div>

            {/* Main Search Bar */}
            <div className="relative flex w-full flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 hover:border-gray-300">
              <Search className="ml-3 shrink-0 text-gray-400" size={16} />
              <input
                className="w-full bg-transparent px-3 py-2 font-medium text-gray-800 text-sm placeholder-gray-400 outline-none"
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where do you want to go?"
                type="text"
                value={location}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-bold text-gray-400 text-xs uppercase">
                Filter:
              </span>

              {["Verified", "With References", "Accepting Guests"].map(
                (filter) => (
                  <button
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 font-bold text-xs transition-colors ${
                      activeFilters.includes(filter)
                        ? "border-orange-200 bg-orange-50 text-orange-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                    {activeFilters.includes(filter) && <X size={12} />}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown (Simulated) */}
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <ArrowUpDown size={14} />
                <select
                  className="cursor-pointer bg-transparent font-medium text-gray-700 outline-none"
                  onChange={(e) => setSortMode(e.target.value as any)}
                  value={sortMode}
                >
                  <option value="lastLogin">Last Login</option>
                  <option value="references">References</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-0.5">
                <button
                  className={`rounded p-1.5 ${layoutMode === "grid" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                  onClick={() => setLayoutMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`rounded p-1.5 ${layoutMode === "list" ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                  onClick={() => setLayoutMode("list")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div
        className={
          layoutMode === "grid"
            ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            : "flex flex-col gap-2"
        }
      >
        {displayedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {displayedUsers.length > 0 ? (
        <div className="mt-8 text-center">
          <button className="rounded-full border border-gray-300 bg-white px-8 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50">
            Load More Results
          </button>
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-400">
          <p>No results found for your filters.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
