"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  MessageCircle,
  Send,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileView } from "@/components/profile-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type ConnectionStatus = {
  status: string;
  date?: string;
  invitationId?: Id<"invitations">;
} | null;

// Connection card component
function ConnectionCard({
  status,
  profile,
  selectedDate,
  isSending,
  onDateChange,
  onSendRequest,
  onRespond,
}: {
  status: ConnectionStatus;
  profile: { firstName: string; userId: string; availableDates: string[] };
  selectedDate: string;
  isSending: boolean;
  onDateChange: (date: string) => void;
  onSendRequest: () => void;
  onRespond: (accept: boolean) => void;
}) {
  if (status?.status === "matched") {
    return (
      <>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <Check className="mx-auto mb-2 h-8 w-8 text-green-600" />
          <p className="font-medium text-green-700">You&apos;re connected!</p>
          <p className="mt-1 text-green-600 text-sm">
            You can now message each other
          </p>
        </div>
        <Link href={`/messages?chat=${profile.userId}&type=conversation`}>
          <Button className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Go to Messages
          </Button>
        </Link>
      </>
    );
  }

  if (status?.status === "pending_sent") {
    return (
      <div className="rounded-lg bg-amber-50 p-4 text-center">
        <Clock className="mx-auto mb-2 h-8 w-8 text-amber-600" />
        <p className="font-medium text-amber-700">Request Pending</p>
        <p className="mt-1 text-amber-600 text-sm">
          Waiting for {profile.firstName} to respond
        </p>
        <p className="mt-2 rounded bg-amber-100 px-2 py-1 font-medium text-amber-700 text-xs">
          {status.date}
        </p>
      </div>
    );
  }

  if (status?.status === "pending_received") {
    return (
      <div className="space-y-3">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
          <p className="font-medium text-blue-700">
            {profile.firstName} wants to connect!
          </p>
          <p className="mt-1 text-blue-600 text-sm">For {status.date}</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={isSending}
            onClick={() => onRespond(false)}
            variant="outline"
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
          <Button
            className="flex-1"
            disabled={isSending}
            onClick={() => onRespond(true)}
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
    );
  }

  if (status?.status === "none") {
    return (
      <div className="space-y-2">
        <p className="text-gray-600 text-sm">Request to connect for:</p>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          onChange={(e) => onDateChange(e.target.value)}
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
          onClick={onSendRequest}
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
    );
  }

  if (status?.status === "declined_by_them") {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <X className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="font-medium text-gray-600">Request Declined</p>
        <p className="mt-1 text-gray-500 text-sm">
          {profile.firstName} declined your request
        </p>
      </div>
    );
  }

  if (status?.status === "declined_by_me") {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center">
        <X className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="font-medium text-gray-600">You declined this request</p>
      </div>
    );
  }

  return null;
}

export default function UsernamePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { isAuthenticated } = useConvexAuth();

  const profile = useQuery(
    api.profiles.getProfileByUsername,
    username ? { username } : "skip"
  );
  const myProfile = useQuery(api.profiles.getMyProfile);
  const connectionStatus = useQuery(
    api.invitations.getConnectionStatus,
    profile?.userId ? { otherUserId: profile.userId as Id<"users"> } : "skip"
  );

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const isOwnProfile = myProfile?.userId === profile?.userId;

  const handleSendInvitation = async () => {
    if (!(profile?.userId && selectedDate)) {
      return;
    }

    setIsSending(true);
    try {
      await sendInvitation({
        toUserId: profile.userId as Id<"users">,
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
        <p className="text-gray-600">
          No user found with username &quot;{username}&quot;
        </p>
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
            <ProfileView profile={profile} />
          </div>

          <div className="space-y-6">
            {!isOwnProfile && isAuthenticated && (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConnectionCard
                    isSending={isSending}
                    onDateChange={setSelectedDate}
                    onRespond={async (accept) => {
                      if (!connectionStatus?.invitationId) {
                        return;
                      }
                      setIsSending(true);
                      try {
                        await respondToInvitation({
                          invitationId: connectionStatus.invitationId,
                          accept,
                        });
                      } finally {
                        setIsSending(false);
                      }
                    }}
                    onSendRequest={handleSendInvitation}
                    profile={profile}
                    selectedDate={selectedDate}
                    status={connectionStatus}
                  />
                </CardContent>
              </Card>
            )}

            {!isAuthenticated && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">
                    Sign in to connect with {profile.firstName}
                  </p>
                  <Link href={`/sign-in?redirect=/people/${username}`}>
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
