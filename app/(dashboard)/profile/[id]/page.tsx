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
import type { Id } from "@/convex/_generated/dataModel";

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

const isUserId = (value: string): value is Id<"users"> => value !== "";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { id } = params;
  const { isAuthenticated } = useConvexAuth();

  const profile = useQuery(
    api.profiles.getProfile,
    isUserId(id) ? { userId: id } : "skip"
  );
  const myProfile = useQuery(api.profiles.getMyProfile);
  const connectionStatus = useQuery(
    api.invitations.getConnectionStatus,
    isUserId(id) ? { otherUserId: id } : "skip"
  );

  const sendInvitation = useMutation(api.invitations.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  const [isSending, setIsSending] = useState(false);

  const isOwnProfile = myProfile?.userId === id;

  const defaultDate = profile?.availableDates[0];

  const handleSendRequest = async () => {
    if (!(isUserId(id) && defaultDate) || !isInvitationDate(defaultDate)) {
      return;
    }
    setIsSending(true);
    await sendInvitation({
      toUserId: id,
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
        <Loader2 className="text-brand h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-foreground text-2xl font-bold">
          Profile not found
        </h1>
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
            userId={id}
          />
        </div>
      )}

      {/* Sign in prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="border-border mb-4 rounded-xl border bg-white p-4 text-center shadow-sm">
          <p className="text-muted-foreground mb-3">
            Sign in to connect with {profile.firstName}
          </p>
          <Link href={`/sign-in?redirect=/profile/${id}`}>
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Connection Status Banner */}
      {!isOwnProfile && connectionStatus?.status === "pending_received" && (
        <div className="bg-info/5 mb-4 rounded-lg p-4 text-center">
          <Users className="text-info mx-auto mb-2 h-6 w-6" />
          <p className="text-info-strong font-medium">
            {profile.firstName} wants to connect!
          </p>
          <p className="text-info mt-1 text-sm">For {connectionStatus.date}</p>
        </div>
      )}

      <ProfileCard profile={profile} variant="full" />
    </div>
  );
}
