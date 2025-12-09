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

type SidebarItem =
  | {
      type: "conversation";
      oderId: string;
      profile: {
        firstName: string;
        photoUrl?: string;
        city: string;
      } | null;
      lastMessage?: {
        content: string;
        createdAt: number;
      };
      unreadCount: number;
    }
  | {
      type: "request";
      oderId: string;
      invitationId: Id<"invitations">;
      profile: {
        firstName: string;
        photoUrl?: string;
        city: string;
      } | null;
      date: string;
      createdAt: number;
    };

type SidebarItemProps = {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
};

function SidebarItemComponent({ item, isActive, onClick }: SidebarItemProps) {
  const formatTime = (timestamp: number) => {
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
          {item.type === "request" ? (
            <Badge
              className="shrink-0 bg-amber-500 text-white hover:bg-amber-600"
              variant="secondary"
            >
              Request
            </Badge>
          ) : item.lastMessage ? (
            <span className="shrink-0 text-muted-foreground text-xs">
              {formatTime(item.lastMessage.createdAt)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          {item.type === "request" ? (
            <p className="truncate">Wants to connect for {item.date}</p>
          ) : (
            <p className="truncate">
              {item.lastMessage?.content ?? "No messages yet"}
            </p>
          )}
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

type EventCard = {
  date: string;
  address?: string;
  phone?: string;
  note?: string;
};

type MessageBubbleProps = {
  content: string;
  isOwn: boolean;
  timestamp: number;
  eventCard?: EventCard;
};

function MessageBubble({
  content,
  isOwn,
  timestamp,
  eventCard,
}: MessageBubbleProps) {
  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
            {formatTime(timestamp)}
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
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareDate, setShareDate] = useState<string>("");
  const [shareAddress, setShareAddress] = useState("");
  const [sharePhone, setSharePhone] = useState("");
  const [shareNote, setShareNote] = useState("");
  const [isSendingCard, setIsSendingCard] = useState(false);

  const conversationsQuery = useQuery(api.messages.getConversations);
  const conversations = conversationsQuery ?? [];
  const invitations = useQuery(api.invitations.getMyInvitations);
  const isLoading =
    conversationsQuery === undefined || invitations === undefined;
  const activeId = searchParams.get("chat");
  const activeType = searchParams.get("type") as
    | "conversation"
    | "request"
    | null;

  const sidebarItems: SidebarItem[] = [];

  if (invitations?.received) {
    for (const inv of invitations.received) {
      if (inv.status === "pending" && inv.otherUser) {
        sidebarItems.push({
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
  }

  for (const conv of conversations) {
    sidebarItems.push({
      type: "conversation",
      ...conv,
    });
  }

  const activeUserId = activeId as Id<"users"> | null;
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

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markAsRead);
  const respondToInvitation = useMutation(api.invitations.respond);
  const sendEventCard = useMutation(api.messages.sendInvitationCard);
  const createTestConversations = useMutation(api.seed.createTestConversations);
  const myProfile = useQuery(api.profiles.getMyProfile);

  // Scroll to bottom when switching conversations - uses useLayoutEffect for instant scroll before paint
  const prevConversationId = useRef(activeConversationId);
  const prevMessagesLength = useRef(messages?.length ?? 0);

  // Instant scroll when switching conversations (before paint)
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    if (activeConversationId !== prevConversationId.current) {
      // Switched conversations - instant scroll before browser paints
      container.scrollTop = container.scrollHeight;
      prevConversationId.current = activeConversationId;
      prevMessagesLength.current = messages?.length ?? 0;
    }
  }, [activeConversationId, messages]);

  // Smooth scroll only for new messages in same conversation
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!(container && messages)) {
      return;
    }

    const currentLength = messages.length;
    if (
      activeConversationId === prevConversationId.current &&
      currentLength > prevMessagesLength.current
    ) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
    prevMessagesLength.current = currentLength;
  }, [messages, activeConversationId]);

  useEffect(() => {
    if (activeConversationId && activeConversation?.unreadCount) {
      markAsRead({ conversationId: activeConversationId });
    }
  }, [activeConversationId, activeConversation?.unreadCount, markAsRead]);

  const setSearchParamsHelper = (params: Record<string, string>) => {
    const newParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      newParams.set(key, value);
    }
    router.push(`/messages?${newParams.toString()}`);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        setSearchParamsHelper({
          chat: activeRequest.oderId,
          type: "conversation",
        });
      } else {
        router.push("/messages");
      }
    } finally {
      setIsResponding(false);
    }
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.type === "request") {
      setSearchParamsHelper({ chat: item.oderId, type: "request" });
    } else {
      setSearchParamsHelper({ chat: item.oderId, type: "conversation" });
    }
  };

  const handleShareEventDetails = async () => {
    if (!(activeConversationId && shareDate)) {
      return;
    }

    setIsSendingCard(true);
    try {
      await sendEventCard({
        conversationId: activeConversationId,
        date: shareDate as "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec",
        address: shareAddress || undefined,
        phone: sharePhone || undefined,
        note: shareNote || undefined,
      });
      setShowShareModal(false);
      setShareDate("");
      setShareAddress("");
      setSharePhone("");
      setShareNote("");
    } finally {
      setIsSendingCard(false);
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
      <div className="flex w-80 shrink-0 flex-col border-r bg-background">
        {/* Search bar - aligned with profile header height */}
        <div className="flex h-[72px] items-center border-b px-4">
          <div className="relative w-full">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-red-500" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Connect with hosts or guests to start chatting
              </p>
              {/* Dev: Create test conversations */}
              <Button
                className="mt-4"
                onClick={async () => {
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
                }}
                size="sm"
                variant="outline"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Test Conversations
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {pendingCount > 0 && (
                <div className="mb-2 px-3 py-2">
                  <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {pendingCount} pending request
                    {pendingCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {filteredItems.map((item) => (
                <SidebarItemComponent
                  isActive={item.oderId === activeId}
                  item={item}
                  key={`${item.type}-${item.oderId}`}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {activeRequest ? (
          <>
            <div className="flex h-[72px] items-center gap-3 border-b px-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={activeRequest.profile?.photoUrl} />
                <AvatarFallback>
                  {activeRequest.profile?.firstName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">
                  {activeRequest.profile?.firstName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {activeRequest.profile?.city}
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
                  {activeRequestProfile ? (
                    <ProfileView profile={activeRequestProfile} />
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
              <h2 className="mb-2 font-semibold text-2xl">
                Connection Request
              </h2>
              <p className="mb-2 max-w-md text-center text-muted-foreground">
                <span className="font-medium text-foreground">
                  {activeRequest.profile?.firstName}
                </span>{" "}
                wants to connect with you for{" "}
                <span className="font-medium text-foreground">
                  {activeRequest.date}
                </span>
                .
              </p>
              <p className="mb-8 max-w-md text-center text-muted-foreground text-sm">
                If you accept, you'll be able to message each other and share
                contact information.
              </p>

              <div className="flex gap-3">
                <Button
                  className="gap-2"
                  disabled={isResponding}
                  onClick={() => handleRespond(false)}
                  size="lg"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                  Decline
                </Button>
                <Button
                  className="gap-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
                  disabled={isResponding}
                  onClick={() => handleRespond(true)}
                  size="lg"
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
              </div>
            </div>
          </>
        ) : activeUserId && activeConversation ? (
          <>
            <div className="flex h-[72px] items-center gap-3 border-b px-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={activeConversation.profile?.photoUrl} />
                <AvatarFallback>
                  {activeConversation.profile?.firstName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">
                  {activeConversation.profile?.firstName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {activeConversation.profile?.city}
                </p>
              </div>
              <div className="flex gap-2">
                {isHost && (
                  <Button
                    onClick={() => setShowShareModal(true)}
                    size="sm"
                    variant="outline"
                  >
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
                    {activeConversation.profile && (
                      <ProfileView profile={activeConversation.profile} />
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

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

            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Input
                  className="flex-1"
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  value={messageInput}
                />
                <Button
                  className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600"
                  disabled={!messageInput.trim()}
                  onClick={handleSend}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showShareModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                  <h3 className="mb-4 font-semibold text-lg">
                    Share Event Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shareDate">Date *</Label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        id="shareDate"
                        onChange={(e) => setShareDate(e.target.value)}
                        value={shareDate}
                      >
                        <option value="">Select a date...</option>
                        {HOLIDAY_DATES.map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shareAddress">Address</Label>
                      <Input
                        id="shareAddress"
                        onChange={(e) => setShareAddress(e.target.value)}
                        placeholder="Where should they come?"
                        value={shareAddress}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sharePhone">Phone</Label>
                      <Input
                        id="sharePhone"
                        onChange={(e) => setSharePhone(e.target.value)}
                        placeholder="Your contact number"
                        value={sharePhone}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shareNote">Note</Label>
                      <Input
                        id="shareNote"
                        onChange={(e) => setShareNote(e.target.value)}
                        placeholder="Any additional info..."
                        value={shareNote}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => setShowShareModal(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-red-500 to-amber-500"
                      disabled={!shareDate || isSendingCard}
                      onClick={handleShareEventDetails}
                    >
                      {isSendingCard ? "Sending..." : "Send Details"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
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
        )}
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
