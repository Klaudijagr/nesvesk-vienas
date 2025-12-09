"use client";

import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Calendar,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProfileView } from "@/components/profile-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { HOLIDAY_DATES } from "@/lib/types";
import { cn } from "@/lib/utils";

// Types
type ProfileInfo = {
  firstName: string;
  photoUrl?: string;
  city: string;
};

type SidebarItem =
  | {
      type: "conversation";
      oderId: string;
      profile: ProfileInfo | null;
      lastMessage?: { content: string; createdAt: number };
      unreadCount: number;
    }
  | {
      type: "request";
      oderId: string;
      invitationId: Id<"invitations">;
      profile: ProfileInfo | null;
      date: string;
      createdAt: number;
    };

type EventCard = {
  date: string;
  address?: string;
  phone?: string;
  note?: string;
};

// Utility functions
function formatTime(timestamp: number): string {
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
}

function formatShortTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Sub-components
function SidebarItemComponent({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const renderTimestamp = () => {
    if (item.type === "request") {
      return (
        <Badge
          className="shrink-0 bg-amber-500 text-white hover:bg-amber-600"
          variant="secondary"
        >
          Request
        </Badge>
      );
    }
    if (item.lastMessage) {
      return (
        <span className="shrink-0 text-muted-foreground text-xs">
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
    return (
      <p className="truncate">
        {item.lastMessage?.content ?? "No messages yet"}
      </p>
    );
  };

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
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
          <div className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
            <UserPlus className="h-3 w-3 text-white" />
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
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          {renderSubtext()}
          {item.type === "conversation" && item.unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 font-medium text-white text-xs">
              {item.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({
  content,
  isOwn,
  timestamp,
  eventCard,
}: {
  content: string;
  isOwn: boolean;
  timestamp: number;
  eventCard?: EventCard;
}) {
  if (eventCard) {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        <div className="w-72 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="bg-gradient-to-r from-red-500 to-amber-500 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold">Event Details</span>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{eventCard.date}</span>
            </div>
            {eventCard.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{eventCard.address}</span>
              </div>
            )}
            {eventCard.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{eventCard.phone}</span>
              </div>
            )}
            {eventCard.note && (
              <div className="border-t pt-3">
                <p className="text-muted-foreground text-sm italic">
                  "{eventCard.note}"
                </p>
              </div>
            )}
          </div>
          <div className="border-t px-4 py-2 text-muted-foreground text-xs">
            {formatShortTime(timestamp)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          isOwn
            ? "rounded-br-sm bg-gradient-to-r from-red-500 to-amber-500 text-white"
            : "rounded-bl-sm bg-muted"
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
}

function EmptyConversationsList({
  onCreateTest,
}: {
  onCreateTest: () => Promise<void>;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="text-muted-foreground">No messages yet</p>
      <p className="mt-1 text-muted-foreground text-sm">
        Connect with hosts or guests to start chatting
      </p>
      <Button
        className="mt-4"
        onClick={onCreateTest}
        size="sm"
        variant="outline"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Create Test Conversations
      </Button>
    </div>
  );
}

function RequestView({
  request,
  profile,
  isResponding,
  onRespond,
}: {
  request: Extract<SidebarItem, { type: "request" }>;
  profile: unknown;
  isResponding: boolean;
  onRespond: (accept: boolean) => void;
}) {
  return (
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
          <p className="text-muted-foreground text-sm">
            {request.profile?.city}
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="outline">
              View Profile
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
            <SheetHeader className="mb-4">
              <SheetTitle>Profile Details</SheetTitle>
            </SheetHeader>
            {profile ? (
              <ProfileView
                profile={
                  profile as Parameters<typeof ProfileView>[0]["profile"]
                }
              />
            ) : (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-red-500" />
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
          <UserPlus className="h-12 w-12 text-amber-600" />
        </div>
        <h2 className="mb-2 font-semibold text-2xl">Connection Request</h2>
        <p className="mb-2 max-w-md text-center text-muted-foreground">
          <span className="font-medium text-foreground">
            {request.profile?.firstName}
          </span>{" "}
          wants to connect with you for{" "}
          <span className="font-medium text-foreground">{request.date}</span>.
        </p>
        <p className="mb-8 max-w-md text-center text-muted-foreground text-sm">
          If you accept, you'll be able to message each other and share contact
          information.
        </p>
        <div className="flex gap-3">
          <Button
            className="gap-2"
            disabled={isResponding}
            onClick={() => onRespond(false)}
            size="lg"
            variant="outline"
          >
            <X className="h-4 w-4" />
            Decline
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
            disabled={isResponding}
            onClick={() => onRespond(true)}
            size="lg"
          >
            <Check className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </div>
    </>
  );
}

function ShareDetailsModal({
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
}) {
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
        <h3 className="mb-4 font-semibold text-lg">Share Event Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareDate">Date *</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              id="shareDate"
              onChange={(e) => setDate(e.target.value)}
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
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Where should they come?"
              value={address}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sharePhone">Phone</Label>
            <Input
              id="sharePhone"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your contact number"
              value={phone}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shareNote">Note</Label>
            <Input
              id="shareNote"
              onChange={(e) => setNote(e.target.value)}
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
            className="flex-1 bg-gradient-to-r from-red-500 to-amber-500"
            disabled={!date || isSending}
            onClick={handleSubmit}
          >
            {isSending ? "Sending..." : "Send Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mb-2 font-semibold text-xl">Your Messages</h2>
      <p className="max-w-sm text-muted-foreground">
        Select a conversation to start chatting, or respond to connection
        requests from hosts and guests.
      </p>
    </div>
  );
}

// Sidebar component
function MessagesSidebar({
  items,
  activeId,
  isLoading,
  pendingCount,
  searchQuery,
  onSearchChange,
  onItemClick,
  onCreateTest,
}: {
  items: SidebarItem[];
  activeId: string | null;
  isLoading: boolean;
  pendingCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onItemClick: (id: string, type: "conversation" | "request") => void;
  onCreateTest: () => Promise<void>;
}) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-red-500" />
        </div>
      );
    }
    if (items.length === 0) {
      return <EmptyConversationsList onCreateTest={onCreateTest} />;
    }
    return (
      <div className="space-y-1">
        {pendingCount > 0 && (
          <div className="mb-2 px-3 py-2">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              {pendingCount} pending request
              {pendingCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {items.map((item) => (
          <SidebarItemComponent
            isActive={item.oderId === activeId}
            item={item}
            key={`${item.type}-${item.oderId}`}
            onClick={() => onItemClick(item.oderId, item.type)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-80 shrink-0 flex-col border-r bg-background">
      <div className="flex h-[72px] items-center border-b px-4">
        <div className="relative w-full">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            value={searchQuery}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">{renderContent()}</div>
    </div>
  );
}

// Conversation view component
function ConversationView({
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
}: {
  conversation: NonNullable<
    ReturnType<typeof useQuery<typeof api.messages.getConversations>>[number]
  >;
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
}) {
  return (
    <>
      {/* Conversation header */}
      <div className="flex h-[72px] items-center gap-3 border-b px-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.profile?.photoUrl} />
          <AvatarFallback>
            {conversation.profile?.firstName?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{conversation.profile?.firstName}</h2>
          <p className="text-muted-foreground text-sm">
            {conversation.profile?.city}
          </p>
        </div>
        <div className="flex gap-2">
          {isHost && (
            <Button onClick={onShowShareModal} size="sm" variant="outline">
              <Share2 className="mr-1 h-4 w-4" />
              Share Details
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost">
                View Profile
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Profile Details</SheetTitle>
              </SheetHeader>
              {conversation.profile && (
                <ProfileView profile={conversation.profile} />
              )}
            </SheetContent>
          </Sheet>
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
            eventCard={message.eventCard}
            isOwn={message.senderId === myProfile?.userId}
            key={message._id}
            timestamp={message.createdAt}
          />
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Input
            className="flex-1"
            onChange={(e) => onMessageInputChange(e.target.value)}
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
            className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
            disabled={!messageInput.trim()}
            onClick={onSend}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ShareDetailsModal
        isOpen={showShareModal}
        isSending={isSendingCard}
        onClose={onCloseShareModal}
        onSubmit={onShareEventDetails}
      />
    </>
  );
}

// Main content area component
function MainContentArea({
  activeRequest,
  activeConversation,
  activeRequestProfile,
  isResponding,
  onRespond,
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
}: {
  activeRequest: Extract<SidebarItem, { type: "request" }> | null;
  activeConversation:
    | ReturnType<typeof useQuery<typeof api.messages.getConversations>>[number]
    | null;
  activeRequestProfile: unknown;
  isResponding: boolean;
  onRespond: (accept: boolean) => void;
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
}) {
  if (activeRequest) {
    return (
      <RequestView
        isResponding={isResponding}
        onRespond={onRespond}
        profile={activeRequestProfile}
        request={activeRequest}
      />
    );
  }

  if (activeConversation) {
    return (
      <ConversationView
        conversation={activeConversation}
        isHost={isHost}
        isSendingCard={isSendingCard}
        messageInput={messageInput}
        messages={messages}
        messagesContainerRef={messagesContainerRef}
        myProfile={myProfile}
        onCloseShareModal={onCloseShareModal}
        onMessageInputChange={onMessageInputChange}
        onSend={onSend}
        onShareEventDetails={onShareEventDetails}
        onShowShareModal={onShowShareModal}
        showShareModal={showShareModal}
      />
    );
  }

  return <EmptyState />;
}

// Helper to build sidebar items
function buildSidebarItems(
  invitations: ReturnType<
    typeof useQuery<typeof api.invitations.getMyInvitations>
  >,
  conversations: NonNullable<
    ReturnType<typeof useQuery<typeof api.messages.getConversations>>
  >
): SidebarItem[] {
  const items: SidebarItem[] = [];
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
  for (const conv of conversations) {
    items.push({ type: "conversation", ...conv });
  }
  return items;
}

// Custom hook for scroll management
function useMessagesScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  conversationId: Id<"conversations"> | undefined,
  messages: unknown[] | undefined
) {
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
}

// Custom hook for mark as read
function useMarkAsRead(
  conversationId: Id<"conversations"> | undefined,
  unreadCount: number | undefined
) {
  const markAsRead = useMutation(api.messages.markAsRead);
  useEffect(() => {
    if (conversationId && unreadCount) {
      markAsRead({ conversationId });
    }
  }, [conversationId, unreadCount, markAsRead]);
}

// Main component
function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSendingCard, setIsSendingCard] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Queries
  const conversationsQuery = useQuery(api.messages.getConversations);
  const conversations = conversationsQuery ?? [];
  const invitations = useQuery(api.invitations.getMyInvitations);
  const myProfile = useQuery(api.profiles.getMyProfile);
  const isLoading =
    conversationsQuery === undefined || invitations === undefined;

  // URL params
  const activeId = searchParams.get("chat");
  const activeType = searchParams.get("type") as
    | "conversation"
    | "request"
    | null;

  // Build sidebar items
  const sidebarItems = buildSidebarItems(invitations, conversations);

  // Active items
  const activeItem = sidebarItems.find((item) => item.oderId === activeId);
  const activeConversation =
    activeItem?.type === "conversation" || activeType === "conversation"
      ? conversations.find((c) => c.oderId === activeId)
      : null;
  const activeConversationId = activeConversation?.conversation?._id;
  const activeRequest =
    activeItem?.type === "request"
      ? (activeItem as Extract<SidebarItem, { type: "request" }>)
      : null;

  // More queries
  const messages = useQuery(
    api.messages.getConversationMessages,
    activeConversationId ? { conversationId: activeConversationId } : "skip"
  );
  const activeRequestProfile = useQuery(
    api.profiles.getProfile,
    activeRequest?.oderId
      ? { userId: activeRequest.oderId as Id<"users"> }
      : "skip"
  );

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const respondToInvitation = useMutation(api.invitations.respond);
  const sendEventCard = useMutation(api.messages.sendInvitationCard);
  const createTestConversations = useMutation(api.seed.createTestConversations);

  // Scroll and read management via hooks
  useMessagesScroll(messagesContainerRef, activeConversationId, messages);
  useMarkAsRead(activeConversationId, activeConversation?.unreadCount);

  // Handlers
  const setActiveChat = (id: string, type: "conversation" | "request") => {
    router.push(`/messages?chat=${id}&type=${type}`);
  };

  const handleSend = async () => {
    if (!(messageInput.trim() && activeConversationId)) {
      return;
    }
    await sendMessage({
      conversationId: activeConversationId,
      content: messageInput.trim(),
    });
    setMessageInput("");
  };

  const handleRespond = async (accept: boolean) => {
    if (!activeRequest) {
      return;
    }
    setIsResponding(true);
    try {
      await respondToInvitation({
        invitationId: activeRequest.invitationId,
        accept,
      });
      if (accept) {
        setActiveChat(activeRequest.oderId, "conversation");
      } else {
        router.push("/messages");
      }
    } finally {
      setIsResponding(false);
    }
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
    try {
      await sendEventCard({
        conversationId: activeConversationId,
        date: data.date as "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec",
        address: data.address || undefined,
        phone: data.phone || undefined,
        note: data.note || undefined,
      });
      setShowShareModal(false);
    } finally {
      setIsSendingCard(false);
    }
  };

  const handleCreateTest = async () => {
    try {
      const result = await createTestConversations({});
      if (result.conversations) {
        toast.success(result.message, {
          description: result.conversations.join(", "),
        });
      } else {
        toast.info(result.message, {
          description: `${result.conversationCount} conversations exist`,
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const filteredItems = sidebarItems.filter((item) =>
    item.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pendingCount =
    invitations?.received?.filter((inv) => inv.status === "pending").length ??
    0;
  const isHost = myProfile?.role === "host";

  return (
    <div className="flex h-full">
      <MessagesSidebar
        activeId={activeId}
        isLoading={isLoading}
        items={filteredItems}
        onCreateTest={handleCreateTest}
        onItemClick={setActiveChat}
        onSearchChange={setSearchQuery}
        pendingCount={pendingCount}
        searchQuery={searchQuery}
      />
      <div className="flex flex-1 flex-col">
        <MainContentArea
          activeConversation={activeConversation}
          activeRequest={activeRequest}
          activeRequestProfile={activeRequestProfile}
          isHost={isHost}
          isResponding={isResponding}
          isSendingCard={isSendingCard}
          messageInput={messageInput}
          messages={messages}
          messagesContainerRef={messagesContainerRef}
          myProfile={myProfile}
          onCloseShareModal={() => setShowShareModal(false)}
          onMessageInputChange={setMessageInput}
          onRespond={handleRespond}
          onSend={handleSend}
          onShareEventDetails={handleShareEventDetails}
          onShowShareModal={() => setShowShareModal(true)}
          showShareModal={showShareModal}
        />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-red-500" />
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}
