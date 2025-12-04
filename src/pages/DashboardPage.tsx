import { useMutation, useQuery } from 'convex/react';
import { Check, Inbox, MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'messages' | 'invitations'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = useQuery(api.messages.getConversations);
  const invitations = useQuery(api.invitations.getMyInvitations);

  const messages = useQuery(
    api.messages.getConversation,
    selectedConversation ? { otherUserId: selectedConversation as Id<'users'> } : 'skip',
  );

  const sendMessage = useMutation(api.messages.send);
  const respondToInvitation = useMutation(api.invitations.respond);

  const handleSendMessage = async () => {
    if (!(newMessage.trim() && selectedConversation)) return;

    try {
      await sendMessage({
        receiverId: selectedConversation as Id<'users'>,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInvitationResponse = async (invitationId: string, accept: boolean) => {
    try {
      await respondToInvitation({
        invitationId: invitationId as Id<'invitations'>,
        accept,
      });
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 font-bold text-2xl text-gray-900">Your Dashboard</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setActiveTab('messages')}
            variant={activeTab === 'messages' ? 'default' : 'outline'}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button
            onClick={() => setActiveTab('invitations')}
            variant={activeTab === 'invitations' ? 'default' : 'outline'}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Invitations
            {invitations?.received.filter((i) => i.status === 'pending').length ? (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-white text-xs">
                {invitations.received.filter((i) => i.status === 'pending').length}
              </span>
            ) : null}
          </Button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Conversation List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {conversations === undefined ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations yet</div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <button
                        className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                          selectedConversation === conv.oderId ? 'bg-gray-100' : ''
                        }`}
                        key={conv.oderId}
                        onClick={() => setSelectedConversation(conv.oderId)}
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            className="h-10 w-10 rounded-full"
                            src={
                              conv.profile?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${conv.profile?.firstName || 'U'}`
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                              {conv.profile?.firstName || 'Unknown'}
                            </p>
                            <p className="truncate text-gray-500 text-sm">
                              {conv.lastMessage?.content || 'No messages'}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-white text-xs">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Thread */}
            <Card className="md:col-span-2">
              <CardContent className="flex h-[500px] flex-col p-0">
                {selectedConversation ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                      {messages?.map((msg) => (
                        <div
                          className={`flex ${
                            msg.senderId === selectedConversation ? 'justify-start' : 'justify-end'
                          }`}
                          key={msg._id}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.senderId === selectedConversation
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2 border-t p-4">
                      <Input
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        value={newMessage}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Received */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Received Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations === undefined ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : invitations.received.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">No invitations received yet</div>
                ) : (
                  <div className="space-y-4">
                    {invitations.received.map((inv) => (
                      <div
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                        key={inv._id}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            className="h-10 w-10 rounded-full"
                            src={
                              inv.otherUser?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${inv.otherUser?.firstName || 'U'}`
                            }
                          />
                          <div>
                            <p className="font-medium">{inv.otherUser?.firstName || 'Unknown'}</p>
                            <p className="text-gray-500 text-sm">{inv.date}</p>
                          </div>
                        </div>
                        {inv.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleInvitationResponse(inv._id, false)}
                              size="sm"
                              variant="outline"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleInvitationResponse(inv._id, true)}
                              size="sm"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={`font-medium text-sm ${
                              inv.status === 'accepted' ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            {inv.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sent */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sent Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations === undefined ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : invitations.sent.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">No invitations sent yet</div>
                ) : (
                  <div className="space-y-4">
                    {invitations.sent.map((inv) => (
                      <div
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                        key={inv._id}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            className="h-10 w-10 rounded-full"
                            src={
                              inv.otherUser?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${inv.otherUser?.firstName || 'U'}`
                            }
                          />
                          <div>
                            <p className="font-medium">{inv.otherUser?.firstName || 'Unknown'}</p>
                            <p className="text-gray-500 text-sm">{inv.date}</p>
                          </div>
                        </div>
                        <span
                          className={`font-medium text-sm ${
                            inv.status === 'accepted'
                              ? 'text-green-600'
                              : inv.status === 'pending'
                                ? 'text-amber-600'
                                : 'text-gray-500'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
