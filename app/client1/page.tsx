"use client";

import { Gift, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";

/**
 * Client Landing 1: Sage Green/Cream Stripes
 * Follows the client brief closely - "Vintage Nostalgic Christmas + Modern Farmhouse Stationery"
 * Based on Screenshot 1 & 4 from client-visual
 */
export default function ClientLanding1() {
  const { t } = useLocale();

  return (
    <div className="stripe-sage-rough relative min-h-screen w-full overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Stationery Card */}
        <div className="stationery-card relative z-10 w-full max-w-lg p-8 text-center md:p-12">
          {/* Est. Year Accent */}
          <span className="font-pinyon text-barn-red text-xl">Est. 2025</span>

          {/* Main Title */}
          <h1 className="mt-2 font-playfair text-4xl text-soft-black uppercase tracking-wide md:text-5xl">
            Nešvęsk Vienas
          </h1>

          {/* Decorative Divider */}
          <div className="my-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-barn-red/40" />
            <Sparkles className="h-4 w-4 text-barn-red" />
            <span className="h-px w-12 bg-barn-red/40" />
          </div>

          {/* Vintage Illustration */}
          <div className="relative mx-auto mb-6 h-48 w-48">
            <Image
              alt="Vintage Christmas wreath"
              className="object-contain opacity-90"
              fill
              src="/client-visual/Screenshot 2025-12-08 at 19.58.38.png"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>

          {/* Body Copy */}
          <p className="mx-auto max-w-xs font-courier text-sm text-soft-black/80 leading-relaxed">
            {t.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link className="btn-vintage-pill" href="/sign-up">
              {t.inviteGuests}
            </Link>
            <Link
              className="font-courier text-barn-red/80 text-sm uppercase tracking-wider transition-colors hover:text-barn-red"
              href="/browse"
            >
              {t.becomeGuest} →
            </Link>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="mt-12 flex items-center gap-2 text-cream/90">
          <Gift className="h-4 w-4" />
          <span className="font-courier text-xs uppercase tracking-widest">
            {t.appTagline.slice(0, 50)}...
          </span>
        </div>
      </div>
    </div>
  );
}
