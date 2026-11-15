"use client";

import { cn } from "cn";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  CheckCircle,
  Flag,
  MapPin,
  MessageCircle,
  MoreVertical,
  Search,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { HOLIDAY_DATES } from "@/lib/types";

// Report reasons
const REPORT_REASONS = [
  { value: "spam" as const, label: "Spam or scam" },
  { value: "harassment" as const, label: "Harassment or bullying" },
  { value: "inappropriate" as const, label: "Inappropriate content" },
  { value: "fake_profile" as const, label: "Fake profile" },
  { value: "other" as const, label: "Other" },
];

// Role styling helpers
const getRoleBadgeVariant = (role: string): "success" | "info" | "plum" => {
  if (role === "host") {
    return "success";
  }
  if (role === "guest") {
    return "info";
  }
  return "plum";
};

const getRoleLabel = (role: string): string => {
  if (role === "host") {
    return "Hosting";
  }
  if (role === "guest") {
    return "Looking for host";
  }
  return "Host & Guest";
};

// Types
interface ProfileInfo {
  firstName: string;
  photoUrl?: string;
  city: string;
  username?: string;
}

type SidebarItem =
  | {
      type: "conversation";
      oderId: Id<"users">;
      profile: ProfileInfo | null;
      lastMessage?: { content: string; createdAt: number };
      unreadCount: number;
    }
  | {
      type: "request";
      oderId: Id<"users">;
      invitationId: Id<"invitations">;
      profile: ProfileInfo | null;
      date: string;
      createdAt: number;
    }
  | {
      type: "sent_request";
      oderId: Id<"users">;
      invitationId: Id<"invitations">;
      profile: ProfileInfo | null;
      date: string;
      createdAt: number;
    };

// Type for conversation from getConversations query
type ConversationsResult = FunctionReturnType<
  typeof api.messages.getConversations
>;
type ConversationSummary = NonNullable<ConversationsResult>[number];

// True for a string that is present and not empty
const hasText = (value: string | null | undefined): value is string =>
  value !== undefined && value !== null && value !== "";

// Helper to resolve active items from URL params
const resolveActiveItems = (
  activeId: string | null,
  activeType: "conversation" | "request" | null,
  sidebarItems: SidebarItem[],
  conversations: ConversationSummary[]
) => {
  const activeItem = sidebarItems.find((item) => item.oderId === activeId);

  const activeConversation =
    activeItem?.type === "conversation" || activeType === "conversation"
      ? (conversations.find((c) => c.oderId === activeId) ?? null)
      : null;

  const activeRequest = activeItem?.type === "request" ? activeItem : null;

  const activeSentRequest =
    activeItem?.type === "sent_request" ? activeItem : null;

  const otherUserId =
    activeConversation?.otherUserId ??
    activeRequest?.oderId ??
    activeSentRequest?.oderId;

  return {
    activeItem,
    activeConversation,
    activeConversationId: activeConversation?.conversation?._id,
    activeRequest,
    activeSentRequest,
    otherUserId,
  };
};

// Name shown for the other person, with a fallback when it is missing or empty
const getDisplayName = (
  profile: { firstName?: string } | null | undefined
): string => (hasText(profile?.firstName) ? profile.firstName : "User");

// Utility functions
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (hours < 168) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatShortTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

// Sub-components
const SidebarItemComponent = ({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
}) => {
  const renderTimestamp = () => {
    if (item.type === "request") {
      return (
        <Badge className="shrink-0" variant="warning-solid">
          Request
        </Badge>
      );
    }
    if (item.type === "sent_request") {
      return (
        <Badge className="shrink-0" variant="info-solid">
          Sent
        </Badge>
      );
    }
    // Explicitly check for conversation type for TypeScript narrowing
    if (item.type === "conversation" && item.lastMessage) {
      return (
        <span className="text-muted-foreground shrink-0 text-xs">
          {formatTime(item.lastMessage.createdAt)}
        </span>
      );
    }
    return null;
  };

  const renderSubtext = () => {
    if (item.type === "request") {
      return <p className="truncate">Wants to connect for {item.date}</p>;
    }
    if (item.type === "sent_request") {
      return <p className="truncate">Waiting for response ({item.date})</p>;
    }
    return (
      <p className="truncate">
        {item.lastMessage?.content ?? "No messages yet"}
      </p>
    );
  };

  return (
    <button
      className={cn(
        "hover:bg-muted flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors",
        isActive && "bg-muted"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="relative">
        <Avatar>
          <AvatarImage
            alt={item.profile?.firstName}
            src={item.profile?.photoUrl}
          />
          <AvatarFallback>
            {item.profile?.firstName?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        {item.type === "request" && (
          <div className="bg-gold-rich absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
            <UserPlus className="h-3 w-3 text-white" />
          </div>
        )}
        {item.type === "sent_request" && (
          <div className="bg-info absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">
            {item.profile?.firstName ?? "Unknown"}
          </span>
          {renderTimestamp()}
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          {renderSubtext()}
          {item.type === "conversation" && item.unreadCount > 0 && (
            <span className="bg-brand ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-medium text-white">
              {item.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const MessageBubble = ({
  content,
  isOwn,
  timestamp,
}: {
  content: string;
  isOwn: boolean;
  timestamp: number;
}) => (
  <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
    <div
      className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2",
        isOwn ? "bg-brand rounded-br-sm text-white" : "bg-muted rounded-bl-sm"
      )}
    >
      <p className="text-sm">{content}</p>
      <p
        className={cn(
          "mt-1 text-xs",
          isOwn ? "text-white/70" : "text-muted-foreground"
        )}
      >
        {formatShortTime(timestamp)}
      </p>
    </div>
  </div>
);

const EmptyConversationsList = () => (
  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
    <MessageCircle className="text-muted-foreground/50 mb-4 h-12 w-12" />
    <p className="text-muted-foreground">No messages yet</p>
    <p className="text-muted-foreground mt-1 text-sm">
      Connect with hosts or guests to start chatting
    </p>
    <Link href="/browse">
      <Button className="mt-4" size="sm" variant="outline">
        <UserPlus className="mr-2 h-4 w-4" />
        Browse People
      </Button>
    </Link>
  </div>
);

const RequestView = ({
  request,
  profileUsername,
  isResponding,
  onRespond,
}: {
  request: Extract<SidebarItem, { type: "request" }>;
  profileUsername: string | undefined;
  isResponding: boolean;
  onRespond: (accept: boolean) => void;
}) => (
  <>
    <div className="flex h-[72px] items-center gap-3 border-b px-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={request.profile?.photoUrl} />
        <AvatarFallback>
          {request.profile?.firstName?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-semibold">{request.profile?.firstName}</h2>
        <p className="text-muted-foreground text-sm">{request.profile?.city}</p>
      </div>
      {hasText(profileUsername) && (
        <Link href={`/people/${profileUsername}`}>
          <Button size="sm" variant="outline">
            View Profile
          </Button>
        </Link>
      )}
    </div>

    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="bg-gold-soft mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <UserPlus className="text-gold-strong h-12 w-12" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Connection Request</h2>
      <p className="text-muted-foreground mb-2 max-w-md text-center">
        <span className="text-foreground font-medium">
          {request.profile?.firstName}
        </span>{" "}
        wants to connect with you for{" "}
        <span className="text-foreground font-medium">{request.date}</span>.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md text-center text-sm">
        If you accept, you&apos;ll be able to message each other and share
        contact information.
      </p>
      <div className="flex gap-3">
        <Button
          disabled={isResponding}
          onClick={() => {
            onRespond(false);
          }}
          size="lg"
          variant="outline"
        >
          <X className="h-4 w-4" />
          Decline
        </Button>
        <Button
          disabled={isResponding}
          onClick={() => {
            onRespond(true);
          }}
          size="lg"
          variant="brand"
        >
          <Check className="h-4 w-4" />
          Accept
        </Button>
      </div>
    </div>
  </>
);

// Sent request view - shows status of your outgoing request
const SentRequestView = ({
  request,
  profileUsername,
  onCancel,
  isCancelling,
}: {
  request: Extract<SidebarItem, { type: "sent_request" }>;
  profileUsername: string | undefined;
  onCancel: () => void;
  isCancelling: boolean;
}) => (
  <>
    <div className="flex h-[72px] items-center gap-3 border-b px-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={request.profile?.photoUrl} />
        <AvatarFallback>
          {request.profile?.firstName?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-semibold">{request.profile?.firstName}</h2>
        <p className="text-muted-foreground text-sm">{request.profile?.city}</p>
      </div>
      {hasText(profileUsername) && (
        <Link href={`/people/${profileUsername}`}>
          <Button size="sm" variant="outline">
            View Profile
          </Button>
        </Link>
      )}
    </div>

    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="bg-info/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <ArrowRight className="text-info h-12 w-12" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">Request Sent</h2>
      <p className="text-muted-foreground mb-2 max-w-md text-center">
        You sent a connection request to{" "}
        <span className="text-foreground font-medium">
          {request.profile?.firstName}
        </span>{" "}
        for <span className="text-foreground font-medium">{request.date}</span>.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md text-center text-sm">
        They&apos;ll be notified and can accept or decline your request.
        You&apos;ll be able to message once they accept.
      </p>
      <Button
        disabled={isCancelling}
        onClick={onCancel}
        size="lg"
        variant="outline"
      >
        <X className="h-4 w-4" />
        {isCancelling ? "Cancelling..." : "Cancel Request"}
      </Button>
    </div>
  </>
);

const ShareDetailsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    address: string;
    phone: string;
    note: string;
  }) => void;
  isSending: boolean;
}) => {
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit({ date, address, phone, note });
    setDate("");
    setAddress("");
    setPhone("");
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold">Share Event Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareDate">Date *</Label>
            <select
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              id="shareDate"
              onChange={(e) => {
                setDate(e.target.value);
              }}
              value={date}
            >
              <option value="">Select a date...</option>
              {HOLIDAY_DATES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shareAddress">Address</Label>
            <Input
              id="shareAddress"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              placeholder="Where should they come?"
              value={address}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharePhone">Phone</Label>
            <Input
              id="sharePhone"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="Your contact number"
              value={phone}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shareNote">Note</Label>
            <Input
              id="shareNote"
              onChange={(e) => {
                setNote(e.target.value);
              }}
              placeholder="Any additional info..."
              value={note}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!date || isSending}
            onClick={handleSubmit}
            variant="festive"
          >
            {isSending ? "Sending..." : "Send Details"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
    <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
      <MessageCircle className="text-muted-foreground h-10 w-10" />
    </div>
    <h2 className="mb-2 text-xl font-semibold">Your Messages</h2>
    <p className="text-muted-foreground max-w-sm">
      Select a conversation to start chatting, or respond to connection requests
      from hosts and guests.
    </p>
  </div>
);

// Archive View - displays archived conversations and blocked users
interface ArchivedItem {
  type: "archived" | "blocked";
  oderId: Id<"users">;
  conversationId?: Id<"conversations">;
  blockId?: Id<"blocks">;
  profile: {
    firstName: string;
    photoUrl?: string;
    city: string;
  } | null;
  sortDate: number;
}

const ArchiveView = ({
  items,
  isLoading,
  onBack,
  onUnarchive,
  onUnblock,
}: {
  items: ArchivedItem[];
  isLoading: boolean;
  onBack: () => void;
  onUnarchive: (conversationId: Id<"conversations">) => void;
  onUnblock: (userId: Id<"users">) => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="border-muted border-t-brand h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-[72px] items-center gap-3 border-b px-4">
        <Button onClick={onBack} size="icon" variant="ghost">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Archived</h2>
          <p className="text-muted-foreground text-sm">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <Archive className="text-muted-foreground h-10 w-10" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No archived items</h2>
          <p className="text-muted-foreground max-w-sm">
            Archived conversations and blocked users will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div
                className="flex items-center gap-3 rounded-lg border bg-white p-3"
                key={`${item.type}-${item.oderId}`}
              >
                <div
                  className={cn(
                    "shrink-0",
                    item.type === "blocked" && "opacity-50"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={item.profile?.photoUrl} />
                    <AvatarFallback>
                      {item.profile?.firstName?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {item.type === "blocked" && (
                      <Ban className="text-destructive h-4 w-4 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "truncate font-medium",
                        item.type === "blocked" &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {item.profile?.firstName ?? "Unknown"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.type === "blocked" ? "Blocked" : "Archived"} •{" "}
                    {item.profile?.city}
                  </p>
                </div>
                {item.type === "archived" && item.conversationId && (
                  <Button
                    onClick={() => {
                      if (item.conversationId) {
                        onUnarchive(item.conversationId);
                      }
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Unarchive
                  </Button>
                )}
                {item.type === "blocked" && (
                  <Button
                    onClick={() => {
                      onUnblock(item.oderId);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Unblock
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Heading for a group of controls. Looks like a form label, but renders a <span>
// because it does not belong to a single control.
const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <Label asChild>
    <span>{children}</span>
  </Label>
);

// Report Modal
const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    reason: (typeof REPORT_REASONS)[number]["value"],
    details?: string
  ) => void;
  isSubmitting: boolean;
  userName: string;
}) => {
  const [reason, setReason] = useState<
    (typeof REPORT_REASONS)[number]["value"] | ""
  >("");
  const [details, setDetails] = useState("");

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      aria-label="Report user modal"
      aria-modal="true"
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-none bg-black/50 p-4 text-inherit"
      open
    >
      {/* Backdrop button for closing */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
        type="button"
      />
      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Flag className="text-destructive h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Report {userName}</h3>
              <p className="text-muted-foreground text-sm">
                Help us keep the community safe
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <GroupLabel>Reason for report *</GroupLabel>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      reason === r.value
                        ? "border-destructive bg-destructive/5"
                        : "hover:bg-muted"
                    )}
                    key={r.value}
                  >
                    <input
                      checked={reason === r.value}
                      className="text-destructive h-4 w-4"
                      name="report-reason"
                      onChange={() => {
                        setReason(r.value);
                      }}
                      type="radio"
                    />
                    <span className="text-sm">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportDetails">
                Additional details (optional)
              </Label>
              <textarea
                className="border-input bg-background min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                id="reportDetails"
                onChange={(e) => {
                  setDetails(e.target.value);
                }}
                placeholder="Provide any additional context..."
                value={details}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!reason || isSubmitting}
              onClick={() => {
                if (reason !== "") {
                  onSubmit(reason, details || undefined);
                }
              }}
              variant="destructive"
            >
              {isSubmitting ? "Reporting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

// Profile Sidebar Panel
const ProfileSidebar = ({
  userId,
  onBlock,
  onReport,
  isBlocked,
}: {
  userId: Id<"users">;
  onBlock: () => void;
  onReport: () => void;
  isBlocked: boolean;
}) => {
  const profile = useQuery(api.profiles.getProfile, { userId });

  if (!profile) {
    return (
      <div className="bg-muted/50 hidden w-80 shrink-0 border-l p-4 xl:block">
        <div className="flex h-full items-center justify-center">
          <div className="border-muted border-t-brand h-6 w-6 animate-spin rounded-full border-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 hidden w-80 shrink-0 flex-col border-l xl:flex">
      {/* Profile Header */}
      <div className="border-b bg-white p-4">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-3 h-20 w-20">
            <AvatarImage src={profile.photoUrl} />
            <AvatarFallback className="text-2xl">
              {profile.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{profile.firstName}</h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3" />
            {profile.city}
          </div>
          {profile.verified && (
            <Badge className="mt-2" variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Bio */}
        {profile.bio && (
          <div className="mb-4">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              About
            </h4>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}

        {/* Languages */}
        {profile.languages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Languages
            </h4>
            <div className="flex flex-wrap gap-1">
              {profile.languages.map((lang) => (
                <Badge key={lang} variant="info">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Role / Status */}
        <div className="mb-4">
          <h4 className="text-muted-foreground mb-2 text-sm font-medium">
            Status
          </h4>
          <Badge variant={getRoleBadgeVariant(profile.role)}>
            {getRoleLabel(profile.role)}
          </Badge>
        </div>

        {/* Available Dates */}
        {profile.availableDates.length > 0 && (
          <div className="mb-4">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Available
            </h4>
            <div className="flex flex-wrap gap-1">
              {profile.availableDates.slice(0, 5).map((date) => (
                <Badge key={date} variant="warning">
                  {date}
                </Badge>
              ))}
              {profile.availableDates.length > 5 && (
                <Badge variant="muted">
                  +{profile.availableDates.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* View Full Profile Link */}
        {hasText(profile.username) && (
          <Link
            className="hover:bg-muted mb-4 block w-full rounded-lg border bg-white px-4 py-2 text-center text-sm font-medium transition-colors"
            href={`/people/${profile.username}`}
          >
            View Full Profile
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="border-t bg-white p-4">
        <div className="space-y-2">
          <Button
            className="w-full justify-start"
            onClick={onBlock}
            size="sm"
            variant="ghost-warning"
          >
            <Ban className="mr-2 h-4 w-4" />
            {isBlocked ? "Unblock User" : "Block User"}
          </Button>
          <Button
            className="w-full justify-start"
            onClick={onReport}
            size="sm"
            variant="ghost-destructive"
          >
            <Flag className="mr-2 h-4 w-4" />
            Report User
          </Button>
        </div>
      </div>
    </div>
  );
};

// Sidebar component
const MessagesSidebar = ({
  items,
  activeId,
  isLoading,
  archivedCount,
  searchQuery,
  onSearchChange,
  onItemClick,
  onOpenArchive,
}: {
  items: SidebarItem[];
  activeId: string | null;
  isLoading: boolean;
  archivedCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onItemClick: (
    id: string,
    type: "conversation" | "request" | "sent_request"
  ) => void;
  onOpenArchive: () => void;
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="border-muted border-t-brand h-8 w-8 animate-spin rounded-full border-4" />
        </div>
      );
    }
    if (items.length === 0) {
      return <EmptyConversationsList />;
    }
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItemComponent
            isActive={item.oderId === activeId}
            item={item}
            key={`${item.type}-${item.oderId}`}
            onClick={() => {
              onItemClick(item.oderId, item.type);
            }}
          />
        ))}
      </div>
    );
  };

  const hasActiveChat = activeId !== null;

  return (
    <div
      className={cn(
        "bg-background flex w-full shrink-0 flex-col border-r md:w-80",
        // Hide on mobile when chat is active
        hasActiveChat && "hidden md:flex"
      )}
    >
      <div className="flex h-[72px] items-center border-b px-4">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            placeholder="Search conversations..."
            value={searchQuery}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">{renderContent()}</div>
      {/* Archive button at bottom */}
      <div className="border-t p-2">
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors"
          onClick={onOpenArchive}
          type="button"
        >
          <span className="flex items-center gap-2 text-sm">
            <Archive className="h-4 w-4" />
            Archived
          </span>
          {archivedCount > 0 && (
            <span className="text-muted-foreground text-xs">
              {archivedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

// Conversation view component
const ConversationView = ({
  conversation,
  messages,
  myProfile,
  messagesContainerRef,
  messageInput,
  onMessageInputChange,
  onSend,
  isHost,
  showShareModal,
  onShowShareModal,
  onCloseShareModal,
  onShareEventDetails,
  isSendingCard,
  isBlocked,
  otherUserVerified,
  onBlock,
  onReport,
  onBack,
}: {
  conversation: ConversationSummary;
  messages:
    | ReturnType<typeof useQuery<typeof api.messages.getConversationMessages>>
    | undefined;
  myProfile: ReturnType<typeof useQuery<typeof api.profiles.getMyProfile>>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSend: () => void;
  isHost: boolean;
  showShareModal: boolean;
  onShowShareModal: () => void;
  onCloseShareModal: () => void;
  onShareEventDetails: (data: {
    date: string;
    address: string;
    phone: string;
    note: string;
  }) => void;
  isSendingCard: boolean;
  isBlocked: boolean;
  otherUserVerified?: boolean;
  onBlock: () => void;
  onReport: () => void;
  onBack: () => void;
}) => (
  <>
    {/* Conversation header */}
    <div className="flex h-[72px] items-center gap-2 border-b px-2 sm:gap-3 sm:px-4">
      {/* Back button - mobile only */}
      <Button
        className="shrink-0 md:hidden"
        onClick={onBack}
        size="icon"
        variant="ghost"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Avatar className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
        <AvatarImage src={conversation.profile?.photoUrl} />
        <AvatarFallback>
          {conversation.profile?.firstName?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{conversation.profile?.firstName}</h2>
          {otherUserVerified === true && (
            <Badge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {conversation.profile?.city}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Share Details - hide on small screens */}
        {isHost && !isBlocked && (
          <Button
            className="hidden sm:inline-flex"
            onClick={onShowShareModal}
            size="sm"
            variant="outline"
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share Details
          </Button>
        )}
        {/* View Profile - hide on small screens */}
        {hasText(conversation.profile?.username) && (
          <Link
            className="hidden sm:inline-flex"
            href={`/people/${conversation.profile.username}`}
          >
            <Button size="sm" variant="ghost">
              View Profile
            </Button>
          </Link>
        )}
        {/* 3-dot menu - always visible */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Mobile-only items */}
            {isHost && !isBlocked && (
              <DropdownMenuItem
                className="sm:hidden"
                onClick={onShowShareModal}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Details
              </DropdownMenuItem>
            )}
            {hasText(conversation.profile?.username) && (
              <DropdownMenuItem asChild className="sm:hidden">
                <Link href={`/people/${conversation.profile.username}`}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="sm:hidden" />
            {/* Always visible items */}
            <DropdownMenuItem onClick={onBlock} variant="warning">
              <Ban className="mr-2 h-4 w-4" />
              {isBlocked ? "Unblock User" : "Block User"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReport} variant="destructive">
              <Flag className="mr-2 h-4 w-4" />
              Report User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Messages */}
    <div
      className="flex-1 space-y-4 overflow-y-auto p-4"
      ref={messagesContainerRef}
    >
      {messages?.map((message) => (
        <MessageBubble
          content={message.content}
          isOwn={message.senderId === myProfile?.userId}
          key={message._id}
          timestamp={message.createdAt}
        />
      ))}
    </div>

    {/* Input */}
    <div className="border-t p-4">
      {isBlocked ? (
        <div className="text-muted-foreground bg-muted flex items-center justify-center gap-2 rounded-lg py-3">
          <Ban className="h-4 w-4" />
          <span className="text-sm">Messaging is disabled</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Input
            className="flex-1"
            onChange={(e) => {
              onMessageInputChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Type a message..."
            value={messageInput}
          />
          <Button
            disabled={!messageInput.trim()}
            onClick={onSend}
            variant="brand"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>

    <ShareDetailsModal
      isOpen={showShareModal}
      isSending={isSendingCard}
      onClose={onCloseShareModal}
      onSubmit={onShareEventDetails}
    />
  </>
);

// Main content area component
const MainContentArea = ({
  activeRequest,
  activeSentRequest,
  activeConversation,
  activeRequestProfileUsername,
  activeSentRequestProfileUsername,
  isResponding,
  isCancelling,
  onRespond,
  onCancelRequest,
  messages,
  myProfile,
  messagesContainerRef,
  messageInput,
  onMessageInputChange,
  onSend,
  isHost,
  showShareModal,
  onShowShareModal,
  onCloseShareModal,
  onShareEventDetails,
  isSendingCard,
  isBlocked,
  otherUserVerified,
  onBlock,
  onReport,
  onBack,
}: {
  activeRequest: Extract<SidebarItem, { type: "request" }> | null;
  activeSentRequest: Extract<SidebarItem, { type: "sent_request" }> | null;
  activeConversation: ConversationSummary | null | undefined;
  activeRequestProfileUsername: string | undefined;
  activeSentRequestProfileUsername: string | undefined;
  isResponding: boolean;
  isCancelling: boolean;
  onRespond: (accept: boolean) => void;
  onCancelRequest: () => void;
  messages:
    | ReturnType<typeof useQuery<typeof api.messages.getConversationMessages>>
    | undefined;
  myProfile: ReturnType<typeof useQuery<typeof api.profiles.getMyProfile>>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSend: () => void;
  isHost: boolean;
  showShareModal: boolean;
  onShowShareModal: () => void;
  onCloseShareModal: () => void;
  onShareEventDetails: (data: {
    date: string;
    address: string;
    phone: string;
    note: string;
  }) => void;
  isSendingCard: boolean;
  isBlocked: boolean;
  otherUserVerified?: boolean;
  onBlock: () => void;
  onReport: () => void;
  onBack: () => void;
}) => {
  if (activeRequest) {
    return (
      <RequestView
        isResponding={isResponding}
        onRespond={onRespond}
        profileUsername={activeRequestProfileUsername}
        request={activeRequest}
      />
    );
  }

  if (activeSentRequest) {
    return (
      <SentRequestView
        isCancelling={isCancelling}
        onCancel={onCancelRequest}
        profileUsername={activeSentRequestProfileUsername}
        request={activeSentRequest}
      />
    );
  }

  if (activeConversation) {
    return (
      <ConversationView
        conversation={activeConversation}
        isBlocked={isBlocked}
        isHost={isHost}
        isSendingCard={isSendingCard}
        messageInput={messageInput}
        messages={messages}
        messagesContainerRef={messagesContainerRef}
        myProfile={myProfile}
        onBack={onBack}
        onBlock={onBlock}
        onCloseShareModal={onCloseShareModal}
        onMessageInputChange={onMessageInputChange}
        onReport={onReport}
        onSend={onSend}
        onShareEventDetails={onShareEventDetails}
        onShowShareModal={onShowShareModal}
        otherUserVerified={otherUserVerified}
        showShareModal={showShareModal}
      />
    );
  }

  return <EmptyState />;
};

// Helper to get sort date from a sidebar item
const getSortDate = (item: SidebarItem): number => {
  if (item.type === "conversation") {
    return item.lastMessage?.createdAt ?? 0;
  }
  return item.createdAt;
};

// Helper to build sidebar items
const buildSidebarItems = (
  invitations: ReturnType<
    typeof useQuery<typeof api.invitations.getMyInvitations>
  >,
  conversations: NonNullable<
    ReturnType<typeof useQuery<typeof api.messages.getConversations>>
  >
): SidebarItem[] => {
  const items: SidebarItem[] = [];
  // Add received pending requests
  for (const inv of invitations?.received ?? []) {
    if (inv.status === "pending" && inv.otherUser) {
      items.push({
        type: "request",
        oderId: inv.otherUser.id,
        invitationId: inv._id,
        profile: {
          firstName: inv.otherUser.firstName,
          photoUrl: inv.otherUser.photoUrl,
          city: inv.otherUser.city,
        },
        date: inv.date,
        createdAt: inv._creationTime,
      });
    }
  }
  // Add sent pending requests
  for (const inv of invitations?.sent ?? []) {
    if (inv.status === "pending" && inv.otherUser) {
      items.push({
        type: "sent_request",
        oderId: inv.otherUser.id,
        invitationId: inv._id,
        profile: {
          firstName: inv.otherUser.firstName,
          photoUrl: inv.otherUser.photoUrl,
          city: inv.otherUser.city,
        },
        date: inv.date,
        createdAt: inv._creationTime,
      });
    }
  }
  // Add conversations
  for (const conv of conversations) {
    items.push({
      type: "conversation",
      ...conv,
      // Convert null to undefined to match SidebarItem type
      lastMessage: conv.lastMessage ?? undefined,
    });
  }
  // Sort all items by most recent activity
  return items.toSorted((a, b) => getSortDate(b) - getSortDate(a));
};

// Custom hook for scroll management
const useMessagesScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  conversationId: Id<"conversations"> | undefined,
  messages: unknown[] | undefined
) => {
  const prevConversationId = useRef(conversationId);
  const prevMessagesLength = useRef(messages?.length ?? 0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    if (conversationId !== prevConversationId.current) {
      container.scrollTop = container.scrollHeight;
      prevConversationId.current = conversationId;
      prevMessagesLength.current = messages?.length ?? 0;
    }
  }, [conversationId, messages, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!(container && messages)) {
      return;
    }
    const currentLength = messages.length;
    if (
      conversationId === prevConversationId.current &&
      currentLength > prevMessagesLength.current
    ) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
    prevMessagesLength.current = currentLength;
  }, [messages, conversationId, containerRef]);
};

// Custom hook for mark as read
const useMarkAsRead = (
  conversationId: Id<"conversations"> | undefined,
  unreadCount: number | undefined
) => {
  const markAsRead = useMutation(api.messages.markAsRead);
  useEffect(() => {
    if (conversationId && unreadCount !== undefined && unreadCount > 0) {
      void markAsRead({ conversationId });
    }
  }, [conversationId, unreadCount, markAsRead]);
};

// Active chat selection from the URL (?chat=<userId>&type=<kind>)
const useChatSelection = (): {
  activeId: string | null;
  activeType: "conversation" | "request" | null;
} => {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  return {
    activeId: searchParams.get("chat"),
    activeType:
      typeParam === "conversation" || typeParam === "request"
        ? typeParam
        : null,
  };
};

// Queries that depend on the active chat
const useActiveChatData = ({
  conversationId,
  request,
  sentRequest,
  otherUserId,
}: {
  conversationId: Id<"conversations"> | undefined;
  request: Extract<SidebarItem, { type: "request" }> | null;
  sentRequest: Extract<SidebarItem, { type: "sent_request" }> | null;
  otherUserId: Id<"users"> | undefined;
}) => {
  const messages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );
  const activeRequestProfile = useQuery(
    api.profiles.getProfile,
    request ? { userId: request.oderId } : "skip"
  );
  const activeSentRequestProfile = useQuery(
    api.profiles.getProfile,
    sentRequest ? { userId: sentRequest.oderId } : "skip"
  );
  const otherUserProfile = useQuery(
    api.profiles.getProfile,
    otherUserId ? { userId: otherUserId } : "skip"
  );
  const blockStatus = useQuery(
    api.moderation.isBlocked,
    otherUserId ? { userId: otherUserId } : "skip"
  );
  return {
    messages,
    activeRequestProfile,
    activeSentRequestProfile,
    otherUserProfile,
    blockStatus,
  };
};

// Main component
const MessagesPageContent = () => {
  const router = useRouter();
  const { activeId, activeType } = useChatSelection();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [isSendingCard, setIsSendingCard] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Queries
  const conversationsQuery = useQuery(api.messages.getConversations);
  const conversations = conversationsQuery ?? [];
  const invitations = useQuery(api.invitations.getMyInvitations);
  const myProfile = useQuery(api.profiles.getMyProfile);
  const archivedAndBlockedQuery = useQuery(
    api.moderation.getArchivedAndBlocked
  );
  const archivedAndBlocked = archivedAndBlockedQuery ?? [];
  const isLoading =
    conversationsQuery === undefined || invitations === undefined;

  // Build sidebar items and resolve active items
  const sidebarItems = buildSidebarItems(invitations, conversations);
  const {
    activeConversation,
    activeConversationId,
    activeRequest,
    activeSentRequest,
    otherUserId,
  } = resolveActiveItems(activeId, activeType, sidebarItems, conversations);

  const {
    messages,
    activeRequestProfile,
    activeSentRequestProfile,
    otherUserProfile,
    blockStatus,
  } = useActiveChatData({
    conversationId: activeConversationId,
    request: activeRequest,
    sentRequest: activeSentRequest,
    otherUserId,
  });

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const respondToInvitation = useMutation(api.invitations.respond);
  const cancelInvitation = useMutation(api.invitations.cancel);
  const blockUser = useMutation(api.moderation.blockUser);
  const unblockUser = useMutation(api.moderation.unblockUser);
  const reportUser = useMutation(api.moderation.reportUser);
  const unarchiveConversation = useMutation(api.messages.unarchiveConversation);

  // Scroll and read management via hooks
  useMessagesScroll(messagesContainerRef, activeConversationId, messages);
  useMarkAsRead(activeConversationId, activeConversation?.unreadCount);

  // Derived state
  const blockedByMe = blockStatus?.blockedByMe === true;
  const isBlocked = blockedByMe || blockStatus?.blockedMe === true;
  const isHost = myProfile?.role === "host";

  // Handlers
  const setActiveChat = (
    id: string,
    type: "conversation" | "request" | "sent_request"
  ) => {
    router.push(`/messages?chat=${id}&type=${type}`);
  };

  const handleSend = async () => {
    if (!(messageInput.trim() && activeConversationId)) {
      return;
    }
    try {
      await sendMessage({
        conversationId: activeConversationId,
        content: messageInput.trim(),
      });
      setMessageInput("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  const handleRespond = async (accept: boolean) => {
    if (!activeRequest) {
      return;
    }
    setIsResponding(true);
    const respond = async () => {
      await respondToInvitation({
        invitationId: activeRequest.invitationId,
        accept,
      });
      if (accept) {
        setActiveChat(activeRequest.oderId, "conversation");
      } else {
        router.push("/messages");
      }
    };
    await respond().finally(() => {
      setIsResponding(false);
    });
  };

  const handleCancelRequest = async () => {
    if (!activeSentRequest) {
      return;
    }
    setIsCancelling(true);
    try {
      await cancelInvitation({
        invitationId: activeSentRequest.invitationId,
      });
      toast.success("Request cancelled");
      router.push("/messages");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel request"
      );
    }
    setIsCancelling(false);
  };

  const handleShareEventDetails = async (data: {
    date: string;
    address: string;
    phone: string;
    note: string;
  }) => {
    if (!activeConversationId) {
      return;
    }
    setIsSendingCard(true);
    // Format event details as a message
    const parts = [`Event Details for ${data.date}`];
    if (data.address) {
      parts.push(`Address: ${data.address}`);
    }
    if (data.phone) {
      parts.push(`Phone: ${data.phone}`);
    }
    if (data.note) {
      parts.push(`Note: ${data.note}`);
    }

    const send = async () => {
      await sendMessage({
        conversationId: activeConversationId,
        content: parts.join("\n"),
      });
      setShowShareModal(false);
    };
    await send().finally(() => {
      setIsSendingCard(false);
    });
  };

  const handleBlock = async () => {
    if (!otherUserId) {
      return;
    }
    try {
      if (blockedByMe) {
        await unblockUser({ userId: otherUserId });
        toast.success("User unblocked");
      } else {
        await blockUser({ userId: otherUserId });
        toast.success("User blocked");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    }
  };

  const handleReport = async (
    reason: (typeof REPORT_REASONS)[number]["value"],
    details?: string
  ) => {
    if (!otherUserId) {
      toast.error("Unable to identify user to report");
      return;
    }
    // Prevent reporting yourself (sanity check)
    if (myProfile?.userId === otherUserId) {
      toast.error("Cannot report yourself");
      return;
    }
    setIsReporting(true);
    try {
      await reportUser({
        userId: otherUserId,
        reason,
        details,
        conversationId: activeConversationId,
      });
      toast.success("Report submitted", {
        description: "Thank you for helping keep our community safe.",
      });
      setShowReportModal(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit report"
      );
    }
    setIsReporting(false);
  };

  const filteredItems = sidebarItems.filter(
    (item) =>
      item.profile?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) === true
  );
  const archivedCount = archivedAndBlocked.length;

  // Archive handlers
  const handleUnarchive = async (conversationId: Id<"conversations">) => {
    try {
      await unarchiveConversation({ conversationId });
      toast.success("Conversation unarchived");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unarchive"
      );
    }
  };

  const handleUnblockFromArchive = async (userId: Id<"users">) => {
    try {
      await unblockUser({ userId });
      toast.success("User unblocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unblock");
    }
  };

  // Show archive view
  if (showArchive) {
    return (
      <div className="flex min-h-0 flex-1">
        <ArchiveView
          isLoading={archivedAndBlockedQuery === undefined}
          items={archivedAndBlocked}
          onBack={() => {
            setShowArchive(false);
          }}
          onUnarchive={(conversationId) => {
            void handleUnarchive(conversationId);
          }}
          onUnblock={(userId) => {
            void handleUnblockFromArchive(userId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1">
      <MessagesSidebar
        activeId={activeId}
        archivedCount={archivedCount}
        isLoading={isLoading}
        items={filteredItems}
        onItemClick={setActiveChat}
        onOpenArchive={() => {
          setShowArchive(true);
        }}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <div
        className={cn(
          "flex flex-1 flex-col",
          // Hide on mobile when no chat is active
          !hasText(activeId) && "hidden md:flex"
        )}
      >
        <MainContentArea
          activeConversation={activeConversation}
          activeRequest={activeRequest}
          activeRequestProfileUsername={activeRequestProfile?.username}
          activeSentRequest={activeSentRequest}
          activeSentRequestProfileUsername={activeSentRequestProfile?.username}
          isBlocked={isBlocked}
          isCancelling={isCancelling}
          isHost={isHost}
          isResponding={isResponding}
          isSendingCard={isSendingCard}
          messageInput={messageInput}
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          myProfile={myProfile}
          onBack={() => {
            router.push("/messages");
          }}
          onBlock={() => {
            void handleBlock();
          }}
          onCancelRequest={() => {
            void handleCancelRequest();
          }}
          onCloseShareModal={() => {
            setShowShareModal(false);
          }}
          onMessageInputChange={setMessageInput}
          onReport={() => {
            setShowReportModal(true);
          }}
          onRespond={(accept) => {
            void handleRespond(accept);
          }}
          onSend={() => {
            void handleSend();
          }}
          onShareEventDetails={(data) => {
            void handleShareEventDetails(data);
          }}
          onShowShareModal={() => {
            setShowShareModal(true);
          }}
          otherUserVerified={otherUserProfile?.verified}
          showShareModal={showShareModal}
        />
      </div>
      {/* Profile Sidebar - only visible on xl screens when conversation active */}
      {activeConversation && otherUserId && (
        <ProfileSidebar
          isBlocked={blockedByMe}
          onBlock={() => {
            void handleBlock();
          }}
          onReport={() => {
            setShowReportModal(true);
          }}
          userId={otherUserId}
        />
      )}
      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        isSubmitting={isReporting}
        onClose={() => {
          setShowReportModal(false);
        }}
        onSubmit={(reason, details) => {
          void handleReport(reason, details);
        }}
        userName={getDisplayName(activeConversation?.profile)}
      />
    </div>
  );
};

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="border-muted border-t-brand h-8 w-8 animate-spin rounded-full border-4" />
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}
