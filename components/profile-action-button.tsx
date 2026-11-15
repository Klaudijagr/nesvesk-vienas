"use client";

import { Check, Clock, Loader2, MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ConnectionStatus =
  | "matched"
  | "pending_sent"
  | "pending_received"
  | "declined_by_them"
  | "declined_by_me"
  | "none"
  | "not_authenticated";

interface ProfileActionButtonProps {
  status: ConnectionStatus | undefined;
  userId: string;
  hasAvailableDates: boolean;
  isSending: boolean;
  onConnect: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export const ProfileActionButton = ({
  status,
  userId,
  hasAvailableDates,
  isSending,
  onConnect,
  onAccept,
  onDecline,
}: ProfileActionButtonProps) => {
  if (status === "matched") {
    return (
      <Link
        className="w-full"
        href={`/messages?chat=${userId}&type=conversation`}
      >
        <Button className="w-full" variant="success">
          <MessageCircle size={18} />
          Message
        </Button>
      </Link>
    );
  }

  if (status === "pending_sent") {
    return (
      <Button className="w-full" disabled variant="secondary">
        <Clock size={18} />
        Request Sent
      </Button>
    );
  }

  if (status === "pending_received") {
    return (
      <div className="flex w-full gap-2">
        <Button
          className="flex-1 gap-1"
          disabled={isSending}
          onClick={onDecline}
          variant="outline"
        >
          <X size={16} />
          Decline
        </Button>
        <Button
          className="flex-1 gap-1"
          disabled={isSending}
          onClick={onAccept}
          variant="success"
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

  if (status === "declined_by_them") {
    return (
      <Button className="w-full" disabled variant="secondary">
        <X size={18} />
        Request Declined
      </Button>
    );
  }

  if (status === "declined_by_me") {
    return (
      <Button className="w-full" disabled variant="secondary">
        <X size={18} />
        You Declined
      </Button>
    );
  }

  if (!hasAvailableDates) {
    return (
      <Button className="w-full" disabled variant="secondary">
        No dates available
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={isSending}
      onClick={onConnect}
      variant="brand"
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
