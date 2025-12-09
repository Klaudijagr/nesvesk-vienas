"use client";

import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { ProfileView } from "@/components/profile-view";
import type { Doc, Id } from "@/convex/_generated/dataModel";

// Mock profile data to preview the component
const mockProfile: Doc<"profiles"> = {
  _id: "mock-id" as Id<"profiles">,
  _creationTime: Date.now(),
  userId: "mock-user-id" as Id<"users">,
  username: "jonas",
  role: "both",
  hostingStatus: "can-host",
  guestStatus: "looking",
  hostingDates: ["24 Dec", "25 Dec", "26 Dec"],
  guestDates: ["31 Dec", "1 Jan"],
  firstName: "Jonas",
  lastName: "Jonaitis",
  age: 28,
  city: "Vilnius",
  bio: "I love hosting holiday dinners! My specialty is traditional Lithuanian kugelis and cepelinai. Looking forward to meeting new friends this holiday season.",
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  verified: true,
  languages: ["Lithuanian", "English"],
  availableDates: ["24 Dec", "25 Dec", "26 Dec", "31 Dec", "1 Jan"],
  dietaryInfo: ["Vegetarian options", "Gluten-free options"],
  concept: "Dinner",
  capacity: 6,
  amenities: ["Parking", "Wi-Fi", "Board games"],
  houseRules: ["No shoes inside", "Quiet after 11pm"],
  vibes: ["Cozy", "Traditional", "Family-friendly"],
  smokingAllowed: false,
  drinkingAllowed: true,
  petsAllowed: false,
  hasPets: true,
  lastActive: Date.now() - 1000 * 60 * 30, // 30 mins ago
};

// Mock profile with "maybe" statuses
const mockMaybeProfile: Doc<"profiles"> = {
  ...mockProfile,
  _id: "mock-id-2" as Id<"profiles">,
  firstName: "Ona",
  lastName: "Onaitė",
  hostingStatus: "may-host",
  guestStatus: "maybe-guest",
  hostingDates: ["25 Dec", "26 Dec"],
  guestDates: ["24 Dec"],
  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  bio: "Not sure yet if I'll be hosting or joining someone else. Flexible and open to anything!",
};

// Mock profile - host only
const mockHostOnly: Doc<"profiles"> = {
  ...mockProfile,
  _id: "mock-id-3" as Id<"profiles">,
  firstName: "Petras",
  hostingStatus: "can-host",
  guestStatus: "not-looking",
  hostingDates: ["24 Dec", "25 Dec"],
  guestDates: [],
  role: "host",
  photoUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  bio: "Hosting a big Christmas dinner! Have space for 8 guests.",
  capacity: 8,
};

// Mock profile - guest only
const mockGuestOnly: Doc<"profiles"> = {
  ...mockProfile,
  _id: "mock-id-4" as Id<"profiles">,
  firstName: "Marija",
  hostingStatus: "cant-host",
  guestStatus: "looking",
  hostingDates: [],
  guestDates: ["24 Dec", "25 Dec", "31 Dec"],
  role: "guest",
  photoUrl:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  bio: "New to the city and looking to spend the holidays with friendly people!",
  capacity: undefined,
  concept: undefined,
  amenities: [],
  houseRules: [],
};

export default function Profile8Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 font-bold text-2xl text-gray-900">
          Profile View Experiments
        </h1>

        {/* Profile 1: Both host and guest (definite) */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            1. Both Host & Guest (Definite)
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <ProfileView isOwnProfile profile={mockProfile} />
          </div>
        </section>

        {/* Profile 2: Maybe statuses */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            2. Maybe Host & Maybe Guest
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <ProfileView profile={mockMaybeProfile} />
          </div>
        </section>

        {/* Profile 3: Host only */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            3. Host Only
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <ProfileView profile={mockHostOnly} />
          </div>
        </section>

        {/* Profile 4: Guest only */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            4. Guest Only
          </h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <ProfileView profile={mockGuestOnly} />
          </div>
        </section>

        {/* Profile 5: Compact Card - Dates inside pill, all info in sidebar */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            5. Compact Card (dates in pill, centered verification)
          </h2>
          <CompactProfileCard profile={mockProfile} />
        </section>

        {/* Profile 6: Compact Card - Maybe status */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            6. Compact Card (maybe status)
          </h2>
          <CompactProfileCard profile={mockMaybeProfile} />
        </section>

        {/* Profile 7: Compact Card - Guest only */}
        <section className="mb-12">
          <h2 className="mb-4 font-semibold text-gray-700 text-lg">
            7. Compact Card (guest only)
          </h2>
          <CompactProfileCard profile={mockGuestOnly} />
        </section>
      </div>
    </div>
  );
}

// Compact profile card with dates inside pill and centered verification
function CompactProfileCard({ profile }: { profile: Doc<"profiles"> }) {
  const hostingDates = profile.hostingDates || [];
  const guestDates = profile.guestDates || [];

  return (
    <div className="mx-auto w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Avatar + Name */}
      <div className="p-6 text-center">
        <div className="relative mx-auto mb-4 h-28 w-28">
          <Image
            alt={profile.firstName}
            className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
            fill
            src={
              profile.photoUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
            }
          />
        </div>

        <h2 className="font-bold text-gray-900 text-xl">
          {profile.firstName}
          {profile.lastName && ` ${profile.lastName}`}
          {profile.age && (
            <span className="font-normal text-gray-500">, {profile.age}</span>
          )}
        </h2>

        <div className="mt-1 flex items-center justify-center gap-1 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>{profile.city}</span>
        </div>

        {/* Status Pills with Dates Inside */}
        <div className="mt-4 space-y-2">
          {/* Hosting pill with dates */}
          {profile.hostingStatus &&
            profile.hostingStatus !== "cant-host" &&
            hostingDates.length > 0 && (
              <div
                className={`rounded-lg p-3 ${
                  profile.hostingStatus === "can-host"
                    ? "border border-green-200 bg-green-50"
                    : "border border-amber-200 bg-amber-50"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-center gap-1.5">
                  <Users
                    className={
                      profile.hostingStatus === "can-host"
                        ? "text-green-600"
                        : "text-amber-600"
                    }
                    size={14}
                  />
                  <span
                    className={`font-semibold text-sm ${
                      profile.hostingStatus === "can-host"
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {profile.hostingStatus === "can-host"
                      ? "Can Host"
                      : "Maybe Host"}
                    {profile.capacity && ` · ${profile.capacity} guests`}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {hostingDates.map((date) => (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${
                        profile.hostingStatus === "can-host"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                      key={date}
                    >
                      <Calendar size={10} />
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Guest pill with dates */}
          {profile.guestStatus &&
            profile.guestStatus !== "not-looking" &&
            guestDates.length > 0 && (
              <div
                className={`rounded-lg p-3 ${
                  profile.guestStatus === "looking"
                    ? "border border-blue-200 bg-blue-50"
                    : "border border-amber-200 bg-amber-50"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-center gap-1.5">
                  <User
                    className={
                      profile.guestStatus === "looking"
                        ? "text-blue-600"
                        : "text-amber-600"
                    }
                    size={14}
                  />
                  <span
                    className={`font-semibold text-sm ${
                      profile.guestStatus === "looking"
                        ? "text-blue-700"
                        : "text-amber-700"
                    }`}
                  >
                    {profile.guestStatus === "looking"
                      ? "Looking for Host"
                      : "Maybe Guest"}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {guestDates.map((date) => (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${
                        profile.guestStatus === "looking"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                      key={date}
                    >
                      <Calendar size={10} />
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Languages */}
        <div className="mt-4 flex flex-wrap justify-center gap-1">
          {profile.languages.map((lang) => (
            <span
              className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600 text-xs"
              key={lang}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Centered Verification Section */}
      <div className="border-gray-100 border-t bg-gray-50 p-4">
        <p className="mb-3 text-center font-medium text-gray-500 text-xs uppercase tracking-wider">
          Verified
        </p>
        <div className="flex justify-center gap-3">
          <VerificationBadge icon={ShieldCheck} label="ID" verified />
          <VerificationBadge icon={Mail} label="Email" verified />
          <VerificationBadge icon={Phone} label="Phone" verified />
          <VerificationBadge
            icon={CheckCircle2}
            label="Photo"
            verified={false}
          />
        </div>
      </div>
    </div>
  );
}

function VerificationBadge({
  icon: Icon,
  label,
  verified,
}: {
  icon: typeof ShieldCheck;
  label: string;
  verified: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`rounded-full p-2 ${verified ? "bg-green-100" : "bg-gray-200"}`}
      >
        <Icon
          className={verified ? "text-green-600" : "text-gray-400"}
          size={16}
        />
      </div>
      <span
        className={`font-medium text-[10px] ${verified ? "text-green-600" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
