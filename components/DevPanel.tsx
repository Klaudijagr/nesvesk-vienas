"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const testUsers = useQuery(api.seed.getTestUsers);
  const clearRealUsers = useMutation(api.seed.clearRealUsers);
  const createTestConversations = useMutation(api.seed.createTestConversations);

  const handleClearRealUsers = async () => {
    // biome-ignore lint/suspicious/noAlert: Intentional for dev mode confirmation
    if (!confirm("Delete all non-test users? This cannot be undone.")) {
      return;
    }
    try {
      const result = await clearRealUsers();
      toast.success(`Cleared ${result.deleted.users} users`, {
        description: `Profiles: ${result.deleted.profiles}, Conversations: ${result.deleted.conversations}`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to clear users");
    }
  };

  const handleCreateTestConversations = async () => {
    try {
      const result = await createTestConversations();
      if (result.conversations) {
        toast.success(result.message, {
          description: result.conversations.join(", "),
        });
      } else {
        toast.info(result.message, {
          description: `${result.conversationCount} conversations exist`,
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl"
          onClick={() => setIsOpen(true)}
          title="Dev Mode"
          type="button"
        >
          <Bug className="h-5 w-5" />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="w-72 rounded-lg border border-purple-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-purple-100 border-b bg-purple-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-900 text-sm">
                Dev Mode
              </span>
            </div>
            <button
              className="text-purple-400 hover:text-purple-600"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-3">
            {/* Actions */}
            <div className="mb-3 space-y-2">
              <button
                className="flex w-full items-center gap-2 rounded bg-red-50 px-3 py-2 text-left text-red-700 text-xs transition-colors hover:bg-red-100"
                onClick={handleClearRealUsers}
                type="button"
              >
                <Trash2 className="h-3 w-3" />
                Clear Real Users (keep test)
              </button>
              <button
                className="flex w-full items-center gap-2 rounded bg-blue-50 px-3 py-2 text-left text-blue-700 text-xs transition-colors hover:bg-blue-100"
                onClick={handleCreateTestConversations}
                type="button"
              >
                <MessageSquare className="h-3 w-3" />
                Create Test Conversations
              </button>
            </div>

            {/* Test Users Section */}
            <div className="border-t pt-3">
              <button
                className="mb-2 flex w-full items-center justify-between text-gray-500 text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
              >
                <span>Test Users ({testUsers?.length || 0})</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-1">
                  {testUsers?.map((user) => (
                    <Link
                      className="flex items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-gray-100"
                      href={`/profile/${user.userId}`}
                      key={user.userId}
                    >
                      <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                        {user.photoUrl && (
                          <Image
                            alt={user.name}
                            className="object-cover"
                            fill
                            sizes="24px"
                            src={user.photoUrl}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="truncate text-xs">{user.name}</span>
                          {user.verified && (
                            <ShieldCheck className="h-3 w-3 flex-shrink-0 text-green-500" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {user.role} · {user.city}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
