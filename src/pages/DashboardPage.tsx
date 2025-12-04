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
    if (!newMessage.trim() || !selectedConversation) return;

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Button
            variant={activeTab === 'invitations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('invitations')}
          >
            <Inbox className="w-4 h-4 mr-2" />
            Invitations
            {invitations?.received.filter((i) => i.status === 'pending').length ? (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {invitations.received.filter((i) => i.status === 'pending').length}
              </span>
            ) : null}
          </Button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        type="button"
                        key={conv.oderId}
                        onClick={() => setSelectedConversation(conv.oderId)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation === conv.oderId ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              conv.profile?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${conv.profile?.firstName || 'U'}`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {conv.profile?.firstName || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.content || 'No messages'}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
              <CardContent className="p-0 h-[500px] flex flex-col">
                {!selectedConversation ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages?.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${
                            msg.senderId === selectedConversation ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
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
                    <div className="border-t p-4 flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Received */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Received Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations === undefined ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : invitations.received.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No invitations received yet</div>
                ) : (
                  <div className="space-y-4">
                    {invitations.received.map((inv) => (
                      <div
                        key={inv._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              inv.otherUser?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${inv.otherUser?.firstName || 'U'}`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{inv.otherUser?.firstName || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{inv.date}</p>
                          </div>
                        </div>
                        {inv.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleInvitationResponse(inv._id, false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleInvitationResponse(inv._id, true)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={`text-sm font-medium ${
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
                  <div className="text-center text-gray-500 py-8">No invitations sent yet</div>
                ) : (
                  <div className="space-y-4">
                    {invitations.sent.map((inv) => (
                      <div
                        key={inv._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              inv.otherUser?.photoUrl ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${inv.otherUser?.firstName || 'U'}`
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{inv.otherUser?.firstName || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{inv.date}</p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-medium ${
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
