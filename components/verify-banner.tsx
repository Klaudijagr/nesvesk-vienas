"use client";

import { useQuery } from "convex/react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import { api } from "@/convex/_generated/api";

export const VerifyBanner = () => {
  const profile = useQuery(api.profiles.getMyProfile);

  if (profile === undefined || profile?.verified === true) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <ShieldAlert className="h-4 w-4 md:h-5 md:w-5" />
        <span>
          Verify your identity to build trust and unlock the full experience.
        </span>
      </div>
      <Link
        className="shrink-0 rounded-md bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        href="/verify"
      >
        Verify now
      </Link>
    </div>
  );
};
