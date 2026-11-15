"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileActionButton } from "@/components/profile-action-button";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

type InvitationDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";

// Invitations can only be sent for these dates (see convex/invitations.ts `send`).
const INVITATION_DATES: ReadonlySet<string> = new Set([
  "24 Dec",
  "25 Dec",
  "26 Dec",
  "31 Dec",
]);

const isInvitationDate = (value: string): value is InvitationDate =>
  INVITATION_DATES.has(value);

export default function UsernamePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const { username } = params;
  const { isAuthenticated } = useConvexAuth();

  const profile = useQuery(
    api.profiles.getProfileByUsername,
    username ? { username } : "skip"
  );
  const myProfile = useQuery(api.profiles.getMyProfile);
  const connectionStatus = useQuery(
    api.invitations.getConnectionStatus,
    profile?.userId ? { otherUserId: profile.userId } : "skip"
  );

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  const [isSending, setIsSending] = useState(false);

  const isOwnProfile = myProfile?.userId === profile?.userId;

  // Pick the first available date from their profile
  const defaultDate = profile?.availableDates[0];

  const handleSendRequest = async () => {
    if (!(profile?.userId && defaultDate) || !isInvitationDate(defaultDate)) {
      return;
    }

    setIsSending(true);
    await sendInvitation({
      toUserId: profile.userId,
      date: defaultDate,
    }).finally(() => {
      setIsSending(false);
    });
  };

  const handleRespond = async (accept: boolean) => {
    if (!connectionStatus?.invitationId) {
      return;
    }
    setIsSending(true);
    await respondToInvitation({
      invitationId: connectionStatus.invitationId,
      accept,
    }).finally(() => {
      setIsSending(false);
    });
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
        <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
        <p className="text-gray-600">
          No user found with username &quot;{username}&quot;
        </p>
        <Button
          onClick={() => {
            router.push("/browse");
          }}
        >
          Browse profiles
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Action Button - prominent at top for other users */}
      {!isOwnProfile && isAuthenticated && (
        <div className="mb-4">
          <ProfileActionButton
            hasAvailableDates={!!defaultDate}
            isSending={isSending}
            onAccept={() => {
              void handleRespond(true);
            }}
            onConnect={() => {
              void handleSendRequest();
            }}
            onDecline={() => {
              void handleRespond(false);
            }}
            status={connectionStatus?.status}
            userId={profile.userId}
          />
        </div>
      )}

      {/* Sign in prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="mb-3 text-gray-600">
            Sign in to connect with {profile.firstName}
          </p>
          <Link href={`/sign-in?redirect=/people/${username}`}>
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Connection Status Banner */}
      {!isOwnProfile && connectionStatus?.status === "pending_received" && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-center">
          <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
          <p className="font-medium text-blue-700">
            {profile.firstName} wants to connect!
          </p>
          <p className="mt-1 text-sm text-blue-600">
            For {connectionStatus.date}
          </p>
        </div>
      )}

      <ProfileCard profile={profile} variant="full" />
    </div>
  );
}
