import type React from "react";
import { useState } from "react";
import DashboardView from "./components/Dashboard";
import InboxView from "./components/InboxView";
import Navbar from "./components/Navbar";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import { MOCK_INBOX } from "./constants";
import type { Conversation, User, ViewState } from "./types";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>("profile");
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_INBOX);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  const handleViewProfile = (userId: string) => {
    setViewingProfileId(userId);
    setCurrentView("profile");
  };

  const handleRequestSend = (type: "host" | "meetup", user: User) => {
    // Check if conversation already exists
    const existing = conversations.find((c) => c.otherUser.id === user.id);
    if (existing) {
      setCurrentView("inbox");
      // You could also focus that chat here if you lifted selectedId state
      return;
    }

    // Create new conversation
    const newConv: Conversation = {
      id: `new-${Date.now()}`,
      otherUser: user,
      lastMessage: `Request to ${type === "host" ? "stay" : "meet up"} sent`,
      lastMessageDate: "Just now",
      status: "active",
      requestType: type,
      isRequest: true,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: "me",
          text: `Hi ${user.name}, I would love to ${type === "host" ? "stay with you" : "meet up with you"}!`,
          timestamp: new Date().toISOString(),
          isRead: true,
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case "profile":
        return (
          <ProfileView
            onRequestSend={handleRequestSend}
            viewingProfileId={viewingProfileId}
          />
        );
      case "inbox":
        return (
          <InboxView
            conversations={conversations}
            setConversations={setConversations}
          />
        );
      case "dashboard":
      case "search":
        return <DashboardView onViewProfile={handleViewProfile} />;
      case "settings":
        return <SettingsView />;
      default:
        return (
          <ProfileView
            onRequestSend={handleRequestSend}
            viewingProfileId={viewingProfileId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar
        currentView={currentView}
        setView={(view) => {
          if (view === "profile") setViewingProfileId(null); // Reset to 'me' when clicking nav profile
          setCurrentView(view);
        }}
      />

      {/* Wrapper logic to allow full screen for Inbox */}
      <div className={currentView === "inbox" ? "" : ""}>{renderView()}</div>

      {/* Footer - Hide on inbox view */}
      {currentView !== "inbox" && (
        <footer className="mt-20 border-gray-200 border-t bg-white py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap gap-8 font-bold text-gray-600 text-sm uppercase tracking-wider">
              <a className="hover:text-orange-500" href="#">
                About
              </a>
              <a className="hover:text-orange-500" href="#">
                Safety
              </a>
            </div>
            <div className="mt-8 text-gray-400 text-xs">
              © 1999 - {new Date().getFullYear()} Couchsurfing International,
              Inc.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
