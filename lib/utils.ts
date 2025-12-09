import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the URL for a user's profile.
 * Prefers /people/[username] if username exists, falls back to /profile/[id]
 */
export function getProfileUrl(profile: {
  userId: string;
  username?: string | null;
}): string {
  if (profile.username) {
    return `/people/${profile.username}`;
  }
  return `/profile/${profile.userId}`;
}

/**
 * Format a timestamp as relative time (e.g., "Active 2h ago", "Active 3d ago")
 */
export function formatRelativeTime(timestamp: number | undefined): string {
  if (!timestamp) {
    return "";
  }

  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 5) {
    return "Active now";
  }
  if (minutes < 60) {
    return `Active ${minutes}m ago`;
  }
  if (hours < 24) {
    return `Active ${hours}h ago`;
  }
  if (days < 7) {
    return `Active ${days}d ago`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Active ${weeks}w ago`;
  }
  return "Active 30+ days ago";
}
