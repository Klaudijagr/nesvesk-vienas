"use client";

import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";

/**
 * Client Landing 3: Envelope/Letter Aesthetic
 * Based on Screenshot 3 - sage envelope with letter card
 * "Vintage Nostalgic Christmas + Modern Farmhouse Stationery"
 */
export default function ClientLanding3() {
  const { t } = useLocale();

  return (
    <div className="stripe-red relative min-h-screen w-full overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Envelope Container */}
        <div className="relative w-full max-w-xl">
          {/* Envelope Back */}
          <div className="absolute inset-x-0 bottom-0 h-48 rounded-b-lg bg-sage shadow-lg" />

          {/* Envelope Flap (V-shape) */}
          <div
            className="absolute top-32 right-0 left-0 h-32 bg-sage-dark"
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Letter Card */}
          <div className="stationery-card relative z-20 mx-4 p-8 text-center md:mx-8 md:p-12">
            {/* Decorative header */}
            <div className="mb-6 flex items-center justify-center gap-2">
              <Star className="h-4 w-4 fill-barn-red text-barn-red" />
              <span className="font-courier text-barn-red/60 text-xs uppercase tracking-widest">
                Special Invitation
              </span>
              <Star className="h-4 w-4 fill-barn-red text-barn-red" />
            </div>

            {/* Mixed Typography Header */}
            <div className="mb-6">
              <span className="block font-pinyon text-4xl text-sage-dark md:text-5xl">
                Happy
              </span>
              <h1 className="-mt-2 font-playfair text-3xl text-soft-black uppercase tracking-wide md:text-4xl">
                New Year
              </h1>
            </div>

            {/* Scalloped edge divider */}
            <div className="mx-auto mb-6 flex w-48 justify-between">
              {[...new Array(12)].map((_, i) => (
                <div
                  className="h-2 w-2 rounded-full bg-sage/40"
                  key={`dot-${i}`}
                />
              ))}
            </div>

            {/* Body text */}
            <p className="mx-auto mb-4 max-w-sm font-courier text-sm text-soft-black/70 leading-relaxed">
              Cheers to new beginnings, fresh goals, and endless opportunities.
            </p>
            <p className="mx-auto max-w-sm font-courier text-soft-black/70 text-xs leading-relaxed">
              {t.heroDescription}
            </p>

            {/* Stats Row */}
            <div className="my-8 grid grid-cols-2 gap-4 border-sage/20 border-y py-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-sage-dark">
                  <Calendar className="h-4 w-4" />
                  <span className="font-playfair text-lg">Dec 24-31</span>
                </div>
                <span className="font-courier text-soft-black/50 text-xs uppercase">
                  {t.statsHolidayPeriod}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-sage-dark">
                  <MapPin className="h-4 w-4" />
                  <span className="font-playfair text-lg">60+</span>
                </div>
                <span className="font-courier text-soft-black/50 text-xs uppercase">
                  {t.statsCities}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              className="group inline-flex items-center gap-3 rounded-full bg-sage px-8 py-4 font-courier text-cream text-sm uppercase tracking-wider transition-all hover:bg-sage-dark hover:px-10"
              href="/sign-up"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Footer */}
            <p className="mt-8 font-pinyon text-2xl text-sage-dark">
              Nešvęsk Vienas
            </p>
            <p className="font-courier text-soft-black/40 text-xs">
              www.nesveskvienas.lt
            </p>
          </div>

          {/* Envelope Front (bottom part) */}
          <div className="relative z-10 mx-4 h-24 rounded-b-lg bg-sage md:mx-8" />
        </div>
      </div>
    </div>
  );
}
