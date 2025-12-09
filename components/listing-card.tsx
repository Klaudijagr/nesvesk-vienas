"use client";

import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "matched"
  | "self";

interface ProfileWithStatus extends Doc<"profiles"> {
  connectionStatus?: ConnectionStatus;
}

type ListingCardProps = {
  profile: ProfileWithStatus;
  onClick?: () => void;
};

export function ListingCard({ profile, onClick }: ListingCardProps) {
  const isHost = profile.role === "host" || profile.role === "both";
  const isGuest = profile.role === "guest" || profile.role === "both";
  const profileUrl = profile.username
    ? `/people/${profile.username}`
    : `/profile/${profile.userId}`;
  const photoUrl =
    profile.photoUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`;

  const card = (
    <div className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm transition-all hover:shadow-md">
      {/* Image - h-32 matching reference */}
      <div className="relative h-32">
        <Image
          alt={profile.firstName}
          className="h-full w-full object-cover"
          fill
          sizes="200px"
          src={photoUrl}
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Name and location overlay */}
        <div className="absolute bottom-2 left-3 text-white">
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

        {/* Role badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isHost && (
            <span className="rounded bg-purple-600 px-1.5 py-0.5 font-medium text-[9px] text-white">
              Host{profile.capacity ? ` · ${profile.capacity}` : ""}
            </span>
          )}
          {isGuest && !isHost && (
            <span className="rounded bg-blue-600 px-1.5 py-0.5 font-medium text-[9px] text-white">
              Guest
            </span>
          )}
        </div>
      </div>

      {/* Content - compact like reference */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          {/* Status badge + dates */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {profile.availableDates.slice(0, 2).map((d) => (
                <span
                  className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-[9px] text-red-700"
                  key={d}
                >
                  {d}
                </span>
              ))}
              {profile.availableDates.length > 2 && (
                <span className="text-[9px] text-gray-400">
                  +{profile.availableDates.length - 2}
                </span>
              )}
            </div>
            {profile.concept && (
              <span className="text-[9px] text-gray-400">
                {profile.concept}
              </span>
            )}
          </div>

          {/* Bio - like reference */}
          <p className="line-clamp-2 text-[11px] text-gray-600 leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Footer stats - like reference */}
        <div className="mt-3 border-gray-100 border-t pt-2">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="font-semibold text-gray-700">
              {profile.languages.slice(0, 2).join(", ")}
            </span>
            {profile.vibes && profile.vibes.length > 0 && (
              <span className="text-gray-400">{profile.vibes[0]}</span>
            )}
          </div>
        </div>
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
