"use client";

import { Heart, Users } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";

/**
 * Client Landing 2: Red/Cream Festive Stripes
 * More festive Christmas feel - Based on Screenshot 2 (paperclip note aesthetic)
 * "Vintage Nostalgic Christmas + Modern Farmhouse Stationery"
 */
export default function ClientLanding2() {
  const { t } = useLocale();

  return (
    <div className="stripe-red-rough relative min-h-screen w-full overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Paper Note with Paperclip */}
        <div className="relative w-full max-w-md">
          {/* Paperclip */}
          <div className="-top-4 absolute left-8 z-20 h-16 w-6">
            <svg
              aria-hidden="true"
              className="h-full w-full"
              fill="none"
              role="img"
              stroke="#9a2a2a"
              strokeWidth="2"
              viewBox="0 0 24 64"
            >
              <title>Decorative paperclip</title>
              <path
                d="M12 0 V20 C12 28 4 28 4 36 V48 C4 56 12 56 12 48 V24"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Note Card */}
          <div className="stationery-card relative z-10 rotate-[-1deg] p-8 text-center shadow-xl md:p-12">
            {/* Ribbon Bow Decoration */}
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center text-barn-red">
              <svg
                aria-hidden="true"
                className="h-full w-full"
                fill="currentColor"
                role="img"
                viewBox="0 0 64 64"
              >
                <title>Decorative ribbon bow</title>
                <path
                  d="M32 24c-8-8-16-8-20-4s-4 12 4 20c-8 8-8 16-4 20s12 4 20-4c8 8 16 8 20 4s4-12-4-20c8-8 8-16 4-20s-12-4-20 4z"
                  opacity="0.2"
                />
                <circle cx="32" cy="32" r="6" />
                <path
                  d="M32 38 L28 56 M32 38 L36 56"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Message */}
            <p className="font-courier text-base text-soft-black leading-loose md:text-lg">
              A fresh chapter begins.
              <br />
              Let go of what dimmed your light
              <br />
              and step boldly into everything
              <br />
              meant for you.
            </p>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-barn-red/20" />

            {/* Brand */}
            <h2 className="font-playfair text-2xl text-barn-red uppercase tracking-widest md:text-3xl">
              Nešvęsk Vienas
            </h2>

            <p className="mt-4 font-courier text-soft-black/60 text-xs uppercase tracking-wider">
              {t.appName} • 2025
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-barn-red px-6 py-3 font-courier text-cream text-sm uppercase tracking-wider transition-colors hover:bg-barn-red-light"
                href="/sign-up"
              >
                <Users className="h-4 w-4" />
                {t.inviteGuests}
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-barn-red/30 px-6 py-3 font-courier text-barn-red text-sm uppercase tracking-wider transition-colors hover:border-barn-red"
                href="/browse"
              >
                <Heart className="h-4 w-4" />
                {t.becomeGuest}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="mt-12 max-w-md px-4 text-center font-courier text-cream/90 text-sm leading-relaxed">
          {t.heroDescription}
        </p>
      </div>
    </div>
  );
}
