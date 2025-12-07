"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useConvexAuth();

  const profile = useQuery(
    api.profiles.getProfile,
    id ? { userId: id as Id<"users"> } : "skip"
  );
  const myProfile = useQuery(api.profiles.getMyProfile);
  const connectionStatus = useQuery(
    api.invitations.getConnectionStatus,
    id ? { otherUserId: id as Id<"users"> } : "skip"
  );

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const isOwnProfile = myProfile?.userId === id;
  const isHost = profile?.role === "host" || profile?.role === "both";

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

  const handleSendInvitation = async () => {
    if (!(id && selectedDate)) {
      return;
    }

    setIsSending(true);
    try {
      await sendInvitation({
        toUserId: id as Id<"users">,
        date: selectedDate as "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec",
      });
      setSelectedDate("");
    } finally {
      setIsSending(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl text-gray-900">Profile not found</h1>
        <Button onClick={() => router.push("/browse")}>Browse profiles</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="!py-0 overflow-hidden">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-red-100 to-orange-100">
                <Image
                  alt={`${profile.firstName} - Photo ${currentPhotoIndex + 1}`}
                  className="h-full w-full object-cover"
                  fill
                  src={photos[currentPhotoIndex]}
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
                            index === currentPhotoIndex
                              ? "bg-white"
                              : "bg-white/50"
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

                <p className="mt-4 text-gray-700 leading-relaxed">
                  {profile.bio}
                </p>
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
                          <h4 className="mb-1 text-gray-500 text-sm">
                            Event Type
                          </h4>
                          <p className="font-medium">{profile.concept}</p>
                        </div>
                      )}
                      {profile.capacity && (
                        <div>
                          <h4 className="mb-1 text-gray-500 text-sm">
                            Capacity
                          </h4>
                          <p className="font-medium">
                            {profile.capacity} guests
                          </p>
                        </div>
                      )}
                    </div>

                    {profile.amenities.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-gray-500 text-sm">
                          Amenities
                        </h4>
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
                        <h4 className="mb-2 text-gray-500 text-sm">
                          House Rules
                        </h4>
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

          <div className="space-y-6">
            {!isOwnProfile && isAuthenticated && (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Matched - show success + message link */}
                  {connectionStatus?.status === "matched" && (
                    <>
                      <div className="rounded-lg bg-green-50 p-4 text-center">
                        <Check className="mx-auto mb-2 h-8 w-8 text-green-600" />
                        <p className="font-medium text-green-700">
                          You&apos;re connected!
                        </p>
                        <p className="mt-1 text-green-600 text-sm">
                          You can now message each other
                        </p>
                      </div>
                      <Link href={`/messages?chat=${id}&type=conversation`}>
                        <Button className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Go to Messages
                        </Button>
                      </Link>
                    </>
                  )}

                  {/* Pending sent - show waiting state */}
                  {connectionStatus?.status === "pending_sent" && (
                    <div className="rounded-lg bg-amber-50 p-4 text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-amber-600" />
                      <p className="font-medium text-amber-700">
                        Request Pending
                      </p>
                      <p className="mt-1 text-amber-600 text-sm">
                        Waiting for {profile.firstName} to respond
                      </p>
                      <p className="mt-2 rounded bg-amber-100 px-2 py-1 font-medium text-amber-700 text-xs">
                        {connectionStatus.date}
                      </p>
                    </div>
                  )}

                  {/* Pending received - show accept/decline */}
                  {connectionStatus?.status === "pending_received" && (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-blue-50 p-4 text-center">
                        <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                        <p className="font-medium text-blue-700">
                          {profile.firstName} wants to connect!
                        </p>
                        <p className="mt-1 text-blue-600 text-sm">
                          For {connectionStatus.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          disabled={isSending}
                          onClick={async () => {
                            if (!connectionStatus.invitationId) {
                              return;
                            }
                            setIsSending(true);
                            try {
                              await respondToInvitation({
                                invitationId: connectionStatus.invitationId,
                                accept: false,
                              });
                            } finally {
                              setIsSending(false);
                            }
                          }}
                          variant="outline"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                        <Button
                          className="flex-1"
                          disabled={isSending}
                          onClick={async () => {
                            if (!connectionStatus.invitationId) {
                              return;
                            }
                            setIsSending(true);
                            try {
                              await respondToInvitation({
                                invitationId: connectionStatus.invitationId,
                                accept: true,
                              });
                            } finally {
                              setIsSending(false);
                            }
                          }}
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-1 h-4 w-4" />
                              Accept
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* No connection - show request form */}
                  {connectionStatus?.status === "none" && (
                    <div className="space-y-2">
                      <p className="text-gray-600 text-sm">
                        Request to connect for:
                      </p>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        value={selectedDate}
                      >
                        <option value="">Select a date...</option>
                        {profile.availableDates.map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                      <Button
                        className="w-full"
                        disabled={!selectedDate || isSending}
                        onClick={handleSendInvitation}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Declined states */}
                  {connectionStatus?.status === "declined_by_them" && (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <X className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="font-medium text-gray-600">
                        Request Declined
                      </p>
                      <p className="mt-1 text-gray-500 text-sm">
                        {profile.firstName} declined your request
                      </p>
                    </div>
                  )}

                  {connectionStatus?.status === "declined_by_me" && (
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <X className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="font-medium text-gray-600">
                        You declined this request
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!isAuthenticated && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">
                    Sign in to connect with {profile.firstName}
                  </p>
                  <Link href={`/sign-in?redirect=/profile/${id}`}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {isOwnProfile && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">This is your profile</p>
                  <Link href="/settings">
                    <Button className="w-full" variant="outline">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
