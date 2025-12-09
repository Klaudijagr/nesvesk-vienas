"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
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

  const [isSending, setIsSending] = useState(false);

  const isOwnProfile = myProfile?.userId === id;

  // Pick the first available date from their profile
  const defaultDate = profile?.availableDates?.[0] as
    | "24 Dec"
    | "25 Dec"
    | "26 Dec"
    | "31 Dec"
    | undefined;

  const handleSendRequest = async () => {
    if (!(id && defaultDate)) return;

    setIsSending(true);
    try {
      await sendInvitation({
        toUserId: id as Id<"users">,
        date: defaultDate,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleRespond = async (accept: boolean) => {
    if (!connectionStatus?.invitationId) return;
    setIsSending(true);
    try {
      await respondToInvitation({
        invitationId: connectionStatus.invitationId,
        accept,
      });
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

  // Render action button based on connection status
  const renderActionButton = () => {
    if (isOwnProfile || !isAuthenticated) return null;

    const status = connectionStatus?.status;

    // Already connected
    if (status === "matched") {
      return (
        <Link
          className="w-full"
          href={`/messages?chat=${id}&type=conversation`}
        >
          <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
            <MessageCircle size={18} />
            Message
          </Button>
        </Link>
      );
    }

    // Request sent, waiting for response
    if (status === "pending_sent") {
      return (
        <Button className="w-full gap-2" disabled variant="secondary">
          <Clock size={18} />
          Request Sent
        </Button>
      );
    }

    // They sent us a request
    if (status === "pending_received") {
      return (
        <div className="flex w-full gap-2">
          <Button
            className="flex-1 gap-1"
            disabled={isSending}
            onClick={() => handleRespond(false)}
            variant="outline"
          >
            <X size={16} />
            Decline
          </Button>
          <Button
            className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
            disabled={isSending}
            onClick={() => handleRespond(true)}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check size={16} />
                Accept
              </>
            )}
          </Button>
        </div>
      );
    }

    // Declined states
    if (status === "declined_by_them" || status === "declined_by_me") {
      return (
        <Button className="w-full gap-2" disabled variant="secondary">
          <X size={18} />
          {status === "declined_by_them" ? "Request Declined" : "You Declined"}
        </Button>
      );
    }

    // No connection yet - show connect button
    if (!defaultDate) {
      return (
        <Button className="w-full gap-2" disabled variant="secondary">
          No dates available
        </Button>
      );
    }

    return (
      <Button
        className="w-full gap-2 bg-red-500 hover:bg-red-600"
        disabled={isSending}
        onClick={handleSendRequest}
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send size={18} />
            Connect
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Action Button - prominent at top for other users */}
      {!isOwnProfile && isAuthenticated && (
        <div className="mb-4 px-4">{renderActionButton()}</div>
      )}

      {/* Sign in prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mx-4 mb-4 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="mb-3 text-gray-600">
            Sign in to connect with {profile.firstName}
          </p>
          <Link href={`/sign-in?redirect=/profile/${id}`}>
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      )}

      {/* Connection Status Banner */}
      {!isOwnProfile && connectionStatus?.status === "pending_received" && (
        <div className="mx-4 mb-4 rounded-lg bg-blue-50 p-4 text-center">
          <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
          <p className="font-medium text-blue-700">
            {profile.firstName} wants to connect!
          </p>
          <p className="mt-1 text-blue-600 text-sm">
            For {connectionStatus.date}
          </p>
        </div>
      )}

      <ProfileView isOwnProfile={isOwnProfile} profile={profile} />
    </div>
  );
}
