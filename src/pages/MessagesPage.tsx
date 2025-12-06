import { useMutation, useQuery } from 'convex/react';
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
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HOLIDAY_DATES } from '@/lib/types';
import { cn } from '@/lib/utils';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

// Unified item that can be either a conversation or a pending request
type SidebarItem =
  | {
      type: 'conversation';
      oderId: string;
      profile: {
        firstName: string;
        photoUrl?: string;
        city: string;
      } | null;
      lastMessage?: {
        content: string;
        _creationTime: number;
      };
      unreadCount: number;
    }
  | {
      type: 'request';
      oderId: string;
      invitationId: Id<'invitations'>;
      profile: {
        firstName: string;
        photoUrl?: string;
        city: string;
      } | null;
      date: string;
      createdAt: number;
    };

interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItemComponent({ item, isActive, onClick }: SidebarItemProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (hours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted',
        isActive && 'bg-muted',
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage alt={item.profile?.firstName} src={item.profile?.photoUrl} />
          <AvatarFallback>{item.profile?.firstName?.charAt(0) ?? '?'}</AvatarFallback>
        </Avatar>
        {item.type === 'request' && (
          <div className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-amber-500">
            <UserPlus className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{item.profile?.firstName ?? 'Unknown'}</span>
          {item.type === 'request' ? (
            <Badge
              className="shrink-0 bg-amber-500 text-white hover:bg-amber-600"
              variant="secondary"
            >
              Request
            </Badge>
          ) : item.lastMessage ? (
            <span className="shrink-0 text-muted-foreground text-xs">
              {formatTime(item.lastMessage._creationTime)}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          {item.type === 'request' ? (
            <p className="truncate">Wants to connect for {item.date}</p>
          ) : (
            <p className="truncate">{item.lastMessage?.content ?? 'No messages yet'}</p>
          )}
          {item.type === 'conversation' && item.unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 font-medium text-white text-xs">
              {item.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface EventCard {
  date: string;
  address?: string;
  phone?: string;
  note?: string;
}

interface MessageBubbleProps {
  content: string;
  isOwn: boolean;
  timestamp: number;
  eventCard?: EventCard;
}

function MessageBubble({ content, isOwn, timestamp, eventCard }: MessageBubbleProps) {
  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Render event card differently
  if (eventCard) {
    return (
      <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
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
                <p className="text-muted-foreground text-sm italic">"{eventCard.note}"</p>
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
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2',
          isOwn
            ? 'rounded-br-sm bg-gradient-to-r from-red-500 to-amber-500 text-white'
            : 'rounded-bl-sm bg-muted',
        )}
      >
        <p className="text-sm">{content}</p>
        <p className={cn('mt-1 text-xs', isOwn ? 'text-white/70' : 'text-muted-foreground')}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Event card sharing state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareDate, setShareDate] = useState<string>('');
  const [shareAddress, setShareAddress] = useState('');
  const [sharePhone, setSharePhone] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [isSendingCard, setIsSendingCard] = useState(false);

  const conversations = useQuery(api.messages.getConversations) ?? [];
  const invitations = useQuery(api.invitations.getMyInvitations);
  const activeId = searchParams.get('chat');
  const activeType = searchParams.get('type') as 'conversation' | 'request' | null;

  // Build unified sidebar items - requests first, then conversations
  const sidebarItems: SidebarItem[] = [];

  // Add pending requests (received only)
  if (invitations?.received) {
    for (const inv of invitations.received) {
      if (inv.status === 'pending' && inv.otherUser) {
        sidebarItems.push({
          type: 'request',
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

  // Add conversations
  for (const conv of conversations) {
    sidebarItems.push({
      type: 'conversation',
      ...conv,
    });
  }

  const activeUserId = activeId as Id<'users'> | null;
  const activeItem = sidebarItems.find((item) => item.oderId === activeId);
  const activeConversation =
    activeItem?.type === 'conversation' || activeType === 'conversation'
      ? conversations.find((c) => c.oderId === activeId)
      : null;
  const activeRequest =
    activeItem?.type === 'request'
      ? (activeItem as Extract<SidebarItem, { type: 'request' }>)
      : null;

  const messages = useQuery(
    api.messages.getConversation,
    activeUserId && activeType !== 'request' ? { otherUserId: activeUserId } : 'skip',
  );

  const sendMessage = useMutation(api.messages.send);
  const markAsRead = useMutation(api.messages.markAsRead);
  const respondToInvitation = useMutation(api.invitations.respond);
  const sendEventCard = useMutation(api.messages.sendEventCard);
  const myProfile = useQuery(api.profiles.getMyProfile);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (activeUserId && activeConversation?.unreadCount) {
      markAsRead({ senderId: activeUserId });
    }
  }, [activeUserId, activeConversation?.unreadCount, markAsRead]);

  const handleSend = async () => {
    if (!(messageInput.trim() && activeUserId)) return;

    await sendMessage({
      receiverId: activeUserId,
      content: messageInput.trim(),
    });
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRespond = async (accept: boolean) => {
    if (!activeRequest) return;
    setIsResponding(true);
    try {
      await respondToInvitation({
        invitationId: activeRequest.invitationId,
        accept,
      });
      if (accept) {
        // Switch to conversation view
        setSearchParams({ chat: activeRequest.oderId, type: 'conversation' });
      } else {
        // Clear selection
        setSearchParams({});
      }
    } finally {
      setIsResponding(false);
    }
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.type === 'request') {
      setSearchParams({ chat: item.oderId, type: 'request' });
    } else {
      setSearchParams({ chat: item.oderId, type: 'conversation' });
    }
  };

  const handleShareEventDetails = async () => {
    if (!(activeUserId && shareDate)) return;

    setIsSendingCard(true);
    try {
      await sendEventCard({
        receiverId: activeUserId,
        date: shareDate as '24 Dec' | '25 Dec' | '26 Dec' | '31 Dec',
        address: shareAddress || undefined,
        phone: sharePhone || undefined,
        note: shareNote || undefined,
      });
      setShowShareModal(false);
      setShareDate('');
      setShareAddress('');
      setSharePhone('');
      setShareNote('');
    } catch (error) {
      console.error('Failed to share event details:', error);
      alert('Failed to share event details. Please try again.');
    } finally {
      setIsSendingCard(false);
    }
  };

  const filteredItems = sidebarItems.filter((item) =>
    item.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pendingCount = invitations?.received?.filter((inv) => inv.status === 'pending').length ?? 0;

  // Check if current user is a host (can share event details)
  const isHost = myProfile?.role === 'host';

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r">
        <div className="border-b p-4">
          <h1 className="mb-4 font-bold text-2xl">Messages</h1>
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Connect with hosts or guests to start chatting
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {pendingCount > 0 && (
                <div className="mb-2 px-3 py-2">
                  <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {activeRequest ? (
          // Request View
          <>
            <div className="flex items-center gap-3 border-b p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={activeRequest.profile?.photoUrl} />
                <AvatarFallback>
                  {activeRequest.profile?.firstName?.charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">{activeRequest.profile?.firstName}</h2>
                <p className="text-muted-foreground text-sm">{activeRequest.profile?.city}</p>
              </div>
              <Link to={`/profile/${activeRequest.oderId}`}>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </Link>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-8">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
                <UserPlus className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="mb-2 font-semibold text-2xl">Connection Request</h2>
              <p className="mb-2 max-w-md text-center text-muted-foreground">
                <span className="font-medium text-foreground">
                  {activeRequest.profile?.firstName}
                </span>{' '}
                wants to connect with you for{' '}
                <span className="font-medium text-foreground">{activeRequest.date}</span>.
              </p>
              <p className="mb-8 max-w-md text-center text-muted-foreground text-sm">
                If you accept, you'll be able to message each other and share contact information.
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
          // Conversation View
          <>
            <div className="flex items-center gap-3 border-b p-4">
              <Avatar>
                <AvatarImage src={activeConversation.profile?.photoUrl} />
                <AvatarFallback>
                  {activeConversation.profile?.firstName?.charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">{activeConversation.profile?.firstName}</h2>
                <p className="text-muted-foreground text-sm">{activeConversation.profile?.city}</p>
              </div>
              <div className="flex gap-2">
                {isHost && (
                  <Button onClick={() => setShowShareModal(true)} size="sm" variant="outline">
                    <Share2 className="mr-1 h-4 w-4" />
                    Share Details
                  </Button>
                )}
                <Link to={`/profile/${activeConversation.oderId}`}>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages?.map((message) => (
                <MessageBubble
                  content={message.content}
                  eventCard={message.eventCard}
                  isOwn={message.senderId === myProfile?.userId}
                  key={message._id}
                  timestamp={message._creationTime}
                />
              ))}
              <div ref={messagesEndRef} />
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

            {/* Share Event Details Modal */}
            {showShareModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                  <h3 className="mb-4 font-semibold text-lg">Share Event Details</h3>
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
                      {isSendingCard ? 'Sending...' : 'Send Details'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 font-semibold text-xl">Your Messages</h2>
            <p className="max-w-sm text-muted-foreground">
              Select a conversation to start chatting, or respond to connection requests from hosts
              and guests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
