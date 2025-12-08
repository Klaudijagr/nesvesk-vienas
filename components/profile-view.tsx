"use client";

import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";

type ProfileViewProps = {
  profile: Doc<"profiles">;
};

export function ProfileView({ profile }: ProfileViewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const isHost = profile.role === "host" || profile.role === "both";

  // Build photos array from photoUrl + additional photos
  const photos = useMemo(() => {
    if (!profile) {
      return [];
    }
    const allPhotos: string[] = [];
    if (profile.photoUrl) {
      allPhotos.push(profile.photoUrl);
    }
    if (profile.photos) {
      allPhotos.push(...profile.photos);
    }
    return allPhotos.length > 0
      ? allPhotos
      : [
          `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}&backgroundColor=f87171`,
        ];
  }, [profile]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-6">
      <Card className="!py-0 overflow-hidden">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-red-100 to-orange-100">
          <Image
            alt={`${profile.firstName} - Photo ${currentPhotoIndex + 1}`}
            className="h-full w-full object-cover"
            fill
            src={photos[currentPhotoIndex] || "/placeholder.svg"}
          />
          {profile.verified && (
            <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 font-medium text-green-700 text-sm shadow backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Verified
            </div>
          )}

          {/* Photo navigation arrows - only show if multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                className="-translate-y-1/2 absolute top-1/2 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                onClick={prevPhoto}
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="-translate-y-1/2 absolute top-1/2 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                onClick={nextPhoto}
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Photo indicators */}
              <div className="-translate-x-1/2 absolute bottom-4 left-1/2 flex gap-1.5">
                {photos.map((_, index) => (
                  <button
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                    }`}
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900">
                {profile.firstName}
                {profile.lastName && ` ${profile.lastName}`}
                {profile.age && (
                  <span className="font-normal text-gray-500">
                    , {profile.age}
                  </span>
                )}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.city}
                </span>
                {profile.lastActive && (
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    Active recently
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isHost && (
                <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700 text-sm">
                  <Users className="h-4 w-4" />
                  Host
                </span>
              )}
              {(profile.role === "guest" || profile.role === "both") && (
                <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                  Guest
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed">{profile.bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
              <Globe className="h-4 w-4 text-gray-500" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <span
                  className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-sm"
                  key={lang}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
              <Calendar className="h-4 w-4 text-gray-500" />
              Available Dates
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.availableDates.map((date) => (
                <span
                  className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 text-sm"
                  key={date}
                >
                  {date}
                </span>
              ))}
            </div>
          </div>

          {profile.dietaryInfo.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-900">
                Dietary Requirements
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.dietaryInfo.map((diet) => (
                  <span
                    className="rounded-full bg-orange-50 px-3 py-1 text-orange-700 text-sm"
                    key={diet}
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.vibes.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-900">Vibes</h3>
              <div className="flex flex-wrap gap-2">
                {profile.vibes.map((vibe) => (
                  <span
                    className="rounded-full bg-purple-50 px-3 py-1 text-purple-700 text-sm"
                    key={vibe}
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              {profile.smokingAllowed ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              Smoking
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              {profile.drinkingAllowed ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              Alcohol
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              {profile.petsAllowed ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              Pets welcome
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              {profile.hasPets ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-gray-400" />
              )}
              Has pets
            </div>
          </div>
        </CardContent>
      </Card>

      {isHost &&
        (profile.concept ||
          profile.capacity ||
          profile.amenities.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Host Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {profile.concept && (
                  <div>
                    <h4 className="mb-1 text-gray-500 text-sm">Event Type</h4>
                    <p className="font-medium">{profile.concept}</p>
                  </div>
                )}
                {profile.capacity && (
                  <div>
                    <h4 className="mb-1 text-gray-500 text-sm">Capacity</h4>
                    <p className="font-medium">{profile.capacity} guests</p>
                  </div>
                )}
              </div>

              {profile.amenities.length > 0 && (
                <div>
                  <h4 className="mb-2 text-gray-500 text-sm">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.amenities.map((amenity) => (
                      <span
                        className="rounded-full bg-green-50 px-3 py-1 text-green-700 text-sm"
                        key={amenity}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.houseRules.length > 0 && (
                <div>
                  <h4 className="mb-2 text-gray-500 text-sm">House Rules</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.houseRules.map((rule) => (
                      <span
                        className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-sm"
                        key={rule}
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
