import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Ban,
  Calendar,
  Check,
  CheckCircle,
  FileText,
  Flag,
  MapPin,
  MessageSquare,
  MoreVertical,
  Search,
  Send,
  Tag,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CURRENT_USER, getRandomResponse } from "../constants";
import type { Conversation, Message } from "../types";

interface InboxProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

const InboxView: React.FC<InboxProps> = ({
  conversations,
  setConversations,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewArchived, setViewArchived] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // AI Response Simulation
  useEffect(() => {
    if (
      !selectedConversation ||
      selectedConversation.status === "archived" ||
      selectedConversation.isBlocked
    )
      return;

    const lastMsg =
      selectedConversation.messages[selectedConversation.messages.length - 1];
    if (lastMsg.senderId === "me") {
      const timeout = setTimeout(() => {
        const newMsg: Message = {
          id: `ai-${Date.now()}`,
          senderId: selectedConversation.otherUser.id,
          text: getRandomResponse(),
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === selectedConversation.id) {
              return {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessage: newMsg.text,
                lastMessageDate: "Just now",
              };
            }
            return c;
          })
        );
      }, 1500); // 1.5s delay
      return () => clearTimeout(timeout);
    }
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!(inputValue.trim() && selectedId) || selectedConversation?.isBlocked)
      return;

    const newMsg: Message = {
      id: `me-${Date.now()}`,
      senderId: "me",
      text: inputValue,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: inputValue,
            lastMessageDate: "Just now",
          };
        }
        return c;
      })
    );
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrivateNote(e.target.value);
  };

  const toggleArchive = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedId) return;

    const newStatus =
      selectedConversation?.status === "active" ? "archived" : "active";

    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: newStatus } : c))
    );

    // If archiving, clear selection or switch view to see it?
    // Better to just clear selection to indicate it moved.
    if (newStatus === "archived" && !viewArchived) {
      setSelectedId(null);
    } else if (newStatus === "active" && viewArchived) {
      setSelectedId(null);
    }
    setShowMenu(false);
  };

  const handleAddLabel = () => {
    const label = window.prompt("Enter label (e.g., Friend, Potential Host):");
    if (label && selectedId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, labels: [...(c.labels || []), label] }
            : c
        )
      );
    }
    setShowMenu(false);
  };

  const handleBlockUser = () => {
    if (
      window.confirm(
        "Are you sure you want to block this user? You won't be able to message each other."
      )
    ) {
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, isBlocked: true } : c))
      );
      setShowMenu(false);
    }
  };

  const handleReportSubmit = (reason: string) => {
    alert(`Report submitted for "${reason}". User has been blocked.`);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, isBlocked: true } : c))
    );
    setShowReportModal(false);
    setShowMenu(false);
  };

  // Filter logic
  const displayedConversations = conversations.filter((c) =>
    viewArchived ? c.status === "archived" : c.status === "active"
  );

  return (
    // Full screen container
    <div className="flex h-[calc(100vh-64px)] w-full bg-gray-50">
      {/* LEFT: Conversation List */}
      <div
        className={`flex w-full flex-col border-gray-200 border-r bg-white md:w-[350px] lg:w-[400px] ${selectedId ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-gray-100 border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-xl">
              {viewArchived ? "Archived Chats" : "Inbox"}
            </h2>
            {viewArchived && (
              <button
                className="flex items-center gap-1 text-blue-600 text-xs hover:underline"
                onClick={() => setViewArchived(false)}
              >
                <ArrowLeft size={12} /> Back to Inbox
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute top-2.5 left-3 text-gray-400"
              size={16}
            />
            <input
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Search messages..."
              type="text"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {displayedConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {viewArchived ? "No archived chats." : "No messages yet."}
            </div>
          ) : (
            displayedConversations.map((conv) => {
              const isMyRequest =
                conv.isRequest && conv.messages[0].senderId === "me";

              return (
                <div
                  className={`relative flex cursor-pointer gap-3 border-gray-50 border-b p-4 transition-colors hover:bg-gray-50 ${selectedId === conv.id ? "border-orange-100 bg-orange-50/50" : ""}`}
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                >
                  <div className="relative shrink-0">
                    <img
                      alt={conv.otherUser.name}
                      className={`h-12 w-12 rounded-full object-cover ${conv.isBlocked ? "opacity-50 grayscale" : ""}`}
                      src={conv.otherUser.avatarUrl}
                    />
                    {conv.messages.some(
                      (m) => !m.isRead && m.senderId !== CURRENT_USER.id
                    ) && (
                      <div className="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between">
                      <h3
                        className={`truncate text-sm ${selectedId === conv.id ? "font-bold text-orange-900" : "font-semibold text-gray-900"} ${conv.isBlocked ? "text-gray-400 line-through" : ""}`}
                      >
                        {conv.otherUser.name}
                      </h3>
                      <span className="ml-2 whitespace-nowrap text-[10px] text-gray-400">
                        {conv.lastMessageDate}
                      </span>
                    </div>

                    {/* Tags & Labels */}
                    <div className="mb-1 flex flex-wrap gap-1">
                      {conv.isBlocked && (
                        <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-[9px] text-red-600 uppercase">
                          Blocked
                        </span>
                      )}
                      {conv.requestType &&
                        (isMyRequest ? (
                          <span className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-bold text-[9px] text-gray-600 uppercase">
                            Request Sent
                          </span>
                        ) : (
                          <span
                            className={`rounded px-1.5 py-0.5 font-bold text-[9px] uppercase ${
                              conv.requestType === "host"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {conv.requestType === "host"
                              ? "Host Request"
                              : "Meetup Request"}
                          </span>
                        ))}
                      {conv.labels?.map((label, i) => (
                        <span
                          className="rounded bg-purple-100 px-1.5 py-0.5 font-bold text-[9px] text-purple-700 uppercase"
                          key={i}
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <p
                      className={`truncate text-xs ${conv.messages[conv.messages.length - 1].isRead ? "text-gray-500" : "font-medium text-gray-900"}`}
                    >
                      {conv.messages[conv.messages.length - 1].senderId ===
                      CURRENT_USER.id
                        ? "You: "
                        : ""}
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Archive Toggle */}
        {!viewArchived && (
          <div className="border-gray-200 border-t bg-gray-50 p-4">
            <button
              className="flex w-full items-center justify-center gap-2 font-semibold text-gray-600 text-sm transition-colors hover:text-gray-800"
              onClick={() => setViewArchived(true)}
            >
              <Archive size={16} /> View Archived Chats
            </button>
          </div>
        )}
      </div>

      {/* MIDDLE: Chat Window */}
      <div
        className={`relative flex flex-1 flex-col bg-gray-100 ${selectedId ? "flex" : "hidden md:flex"}`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="z-10 flex h-16 shrink-0 items-center justify-between border-gray-200 border-b bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  className="-ml-2 p-2 text-gray-600 md:hidden"
                  onClick={() => setSelectedId(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                  src={selectedConversation.otherUser.avatarUrl}
                />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {selectedConversation.otherUser.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={10} />{" "}
                    {selectedConversation.otherUser.location}
                  </div>
                </div>
              </div>
              <div className="relative flex gap-2">
                <button
                  className={`rounded-full p-2 hover:bg-gray-100 ${selectedConversation.status === "archived" ? "text-orange-500" : "text-gray-500"}`}
                  onClick={(e) => toggleArchive(e)}
                  title={
                    selectedConversation.status === "archived"
                      ? "Unarchive"
                      : "Archive"
                  }
                >
                  <Archive size={18} />
                </button>

                <div className="relative">
                  <button
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {showMenu && (
                    <div className="fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 w-48 animate-in rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
                        onClick={handleAddLabel}
                      >
                        <Tag size={14} /> Add Label
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-50"
                        onClick={() => setShowReportModal(true)}
                      >
                        <Flag size={14} /> Report User
                      </button>
                      <button
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 text-sm hover:bg-red-50"
                        onClick={handleBlockUser}
                      >
                        <Ban size={14} /> Block User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
              {/* Blocked Banner */}
              {selectedConversation.isBlocked && (
                <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-center font-bold text-red-700 text-sm">
                  <Ban size={16} /> You have blocked this user. You cannot send
                  or receive messages.
                </div>
              )}

              {/* Request Action Buttons for INCOMING requests */}
              {!selectedConversation.isBlocked &&
                selectedConversation.isRequest &&
                selectedConversation.messages[0].senderId !== "me" && (
                  <div className="mx-auto mb-6 max-w-md rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                    <h4 className="mb-1 font-bold text-gray-900">
                      Request Pending
                    </h4>
                    <p className="mb-4 text-gray-500 text-sm">
                      {selectedConversation.otherUser.name} sent you a{" "}
                      {selectedConversation.requestType} request.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button className="flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2 font-bold text-sm text-white shadow-sm transition-transform hover:bg-green-600 active:scale-95">
                        <Check size={16} /> Accept
                      </button>
                      <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2 font-bold text-gray-700 text-sm transition-transform hover:bg-gray-200 active:scale-95">
                        <X size={16} /> Decline
                      </button>
                    </div>
                  </div>
                )}

              {/* Request Banner for OUTGOING requests */}
              {selectedConversation.isRequest &&
                selectedConversation.messages[0].senderId === "me" && (
                  <div className="mx-auto mb-6 max-w-md rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                    <h4 className="mb-1 font-bold text-gray-600 text-sm uppercase">
                      Request Sent
                    </h4>
                    <p className="text-gray-500 text-xs">
                      You sent a request to{" "}
                      {selectedConversation.otherUser.name}. Wait for them to
                      respond.
                    </p>
                  </div>
                )}

              {selectedConversation.messages.map((msg) => {
                const isMe = msg.senderId === "me";
                return (
                  <div
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    key={msg.id}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm md:max-w-[70%] ${
                        isMe
                          ? "rounded-br-none bg-orange-500 text-white"
                          : "rounded-bl-none border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`mt-1 text-right text-[10px] opacity-70 ${isMe ? "text-orange-100" : "text-gray-400"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {selectedConversation.isBlocked ? (
              <div className="border-gray-200 border-t bg-gray-100 p-4 text-center text-gray-500 text-sm italic">
                Messaging disabled.
              </div>
            ) : (
              <div className="shrink-0 border-gray-200 border-t bg-white p-4">
                <div className="relative mx-auto flex max-w-4xl items-end gap-2">
                  <textarea
                    className="h-12 max-h-32 min-h-[48px] w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 pr-10 text-sm shadow-inner focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-200"
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    value={inputValue}
                  />
                  <button
                    className="mb-0.5 rounded-xl bg-orange-500 p-3 text-white shadow-sm transition-colors hover:bg-orange-600 active:scale-95"
                    onClick={handleSendMessage}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
              <MessageSquare className="text-gray-400" size={40} />
            </div>
            <p className="font-medium text-lg">Your Messages</p>
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* RIGHT: Mini Profile Sidebar */}
      {selectedConversation && (
        <div className="z-20 hidden h-full w-[320px] flex-col overflow-y-auto border-gray-200 border-l bg-white shadow-xl xl:flex">
          {/* Identity Card */}
          <div className="relative border-gray-100 border-b p-6 text-center">
            <div className="relative mx-auto mb-3 h-24 w-24">
              <img
                className={`h-full w-full rounded-full border-4 border-white object-cover shadow-md ${selectedConversation.isBlocked ? "grayscale" : ""}`}
                src={selectedConversation.otherUser.avatarUrl}
              />
              <div
                className={`absolute right-1 bottom-1 h-5 w-5 rounded-full border-2 border-white ${selectedConversation.otherUser.status.includes("not") ? "bg-red-400" : "bg-green-400"}`}
              />
            </div>

            <h2 className="font-bold text-gray-900 text-xl">
              {selectedConversation.otherUser.name}
            </h2>
            <p className="mt-1 flex items-center justify-center gap-1 font-medium text-gray-500 text-sm">
              <MapPin size={14} /> {selectedConversation.otherUser.location}
            </p>

            <div className="mt-6 flex justify-center gap-6">
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-lg">
                  {selectedConversation.otherUser.referencesCount}
                </span>
                <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                  References
                </span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-gray-900 text-lg">
                  {selectedConversation.otherUser.friendsCount}
                </span>
                <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                  Friends
                </span>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="flex-1 space-y-6 p-6">
            {/* Verification Badges */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
                Verification
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Payment</span>
                  {selectedConversation.otherUser.verification.payment ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Government ID</span>
                  {selectedConversation.otherUser.verification.governmentId ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div>
              <h4 className="mb-3 font-bold text-gray-400 text-xs uppercase tracking-wider">
                Quick Info
              </h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-2">
                  <Calendar className="shrink-0 text-gray-400" size={16} />
                  <span>
                    Joined {selectedConversation.otherUser.joinedDate}
                  </span>
                </li>
                <li className="flex gap-2">
                  <Zap className="shrink-0 text-gray-400" size={16} />
                  <span>{selectedConversation.otherUser.responseTime}</span>
                </li>
                <li className="flex gap-2">
                  <UserIcon className="shrink-0 text-gray-400" size={16} />
                  <span>{selectedConversation.otherUser.occupation}</span>
                </li>
              </ul>
            </div>

            {/* Interests */}
            <div>
              <h4 className="mb-3 font-bold text-gray-400 text-xs uppercase tracking-wider">
                Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedConversation.otherUser.interests.map((int, i) => (
                  <span
                    className="rounded border border-blue-100 bg-blue-50 px-2 py-1 font-medium text-[10px] text-blue-700"
                    key={i}
                  >
                    {int}
                  </span>
                ))}
              </div>
            </div>

            {/* Private Notes */}
            <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-xs text-yellow-800 uppercase">
                <FileText size={12} /> Private Note
              </div>
              <textarea
                className="w-full resize-none border-0 bg-transparent text-gray-700 text-sm placeholder-gray-400 outline-none"
                onChange={handleNoteChange}
                placeholder="Add a private note about this person..."
                rows={3}
                value={privateNote}
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="fade-in zoom-in-95 w-full max-w-sm animate-in rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2 text-red-600">
              <AlertCircle size={24} />
              <h3 className="font-bold text-lg">Report User</h3>
            </div>
            <p className="mb-4 text-gray-600 text-sm">
              Why are you reporting {selectedConversation?.otherUser.name}? This
              will also block them.
            </p>

            <div className="mb-6 space-y-2">
              {[
                "Spam or Scam",
                "Inappropriate Content",
                "Harassment",
                "Fake Profile",
                "Other",
              ].map((reason) => (
                <button
                  className="w-full rounded border border-gray-200 px-4 py-3 text-left font-medium text-sm transition-colors hover:bg-gray-50"
                  key={reason}
                  onClick={() => handleReportSubmit(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              className="w-full py-2 font-bold text-gray-500 text-sm hover:text-gray-700"
              onClick={() => setShowReportModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxView;
