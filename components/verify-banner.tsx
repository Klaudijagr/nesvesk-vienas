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
    <div className="border-gold/50 bg-gold-soft/50 text-gold-deep flex items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <ShieldAlert className="h-4 w-4 md:h-5 md:w-5" />
        <span>
          Verify your identity to build trust and unlock the full experience.
        </span>
      </div>
      <Link
        className="bg-gold-strong hover:bg-gold-deep shrink-0 rounded-md px-3 py-2 text-sm font-medium text-white transition"
        href="/verify"
      >
        Verify now
      </Link>
    </div>
  );
};
