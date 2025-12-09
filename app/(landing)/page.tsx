"use client";

import { useConvexAuth } from "convex/react";
import {
  ArrowRight,
  Calendar,
  Gift,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useLocale } from "@/contexts/locale-context";

export default function LandingPage() {
  const { isAuthenticated: isSignedIn } = useConvexAuth();
  const { t } = useLocale();

  return (
    <div className="flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-green-800 pt-16 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-center bg-cover opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-extrabold text-4xl tracking-tight md:text-6xl">
              {t.heroTitle}
              <br />
              <span className="text-amber-400">{t.heroHighlight}</span>
            </h1>
            <p className="mb-8 text-gray-100 text-lg leading-relaxed md:text-xl">
              {t.heroDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-amber-400 px-8 py-4 font-bold text-base text-green-800 shadow-lg transition-transform hover:scale-105 hover:bg-yellow-400 md:text-lg"
                href={isSignedIn ? "/register?role=host" : "/sign-in"}
              >
                {t.inviteGuests}
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 font-bold text-base text-white transition-colors hover:bg-white hover:text-green-800 md:text-lg"
                href={isSignedIn ? "/register?role=guest" : "/sign-in"}
              >
                {t.becomeGuest}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-20" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-900">
              {t.howItWorks}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-3 font-bold text-xl">1. {t.step1Title}</h3>
              <p className="text-gray-500">{t.step1Description}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="mb-3 font-bold text-xl">2. {t.step2Title}</h3>
              <p className="text-gray-500">{t.step2Description}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <Heart className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="mb-3 font-bold text-xl">3. {t.step3Title}</h3>
              <p className="text-gray-500">{t.step3Description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20" id="about">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-2xl bg-green-50 p-8 md:flex-row md:p-12">
            <div className="relative h-64 w-full md:w-1/3">
              <Image
                alt="Friends sharing a meal"
                className="rounded-lg object-cover shadow-md"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="mb-4 font-bold text-2xl text-gray-900">
                {t.originStoryTitle}
              </h3>
              <p className="mb-6 text-gray-600 italic">
                "{t.originStoryQuote}"
              </p>
              <p className="mb-4 text-gray-500 text-sm">
                — {t.originStoryAuthor}
              </p>
              <p className="text-gray-500 text-sm">
                {t.originStoryDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-bold text-3xl text-gray-900">
                {t.safetyTitle}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <ShieldCheck className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t.identityVerification}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {t.identityVerificationDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t.mutualConsent}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {t.mutualConsentDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <Image
                alt="People gathering together"
                className="rounded-2xl object-cover shadow-lg"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-green-800 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="font-bold text-3xl text-amber-400">
                {t.statsLanguagesValue}
              </div>
              <div className="text-green-200 text-sm">{t.statsLanguages}</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">
                {t.statsCitiesValue}
              </div>
              <div className="text-green-200 text-sm">{t.statsCities}</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">
                {t.statsHolidayPeriodValue}
              </div>
              <div className="text-green-200 text-sm">
                {t.statsHolidayPeriod}
              </div>
            </div>
            <div>
              <div className="font-bold text-3xl text-amber-400">
                {t.statsCommunityMembersValue}
              </div>
              <div className="text-green-200 text-sm">
                {t.statsCommunityMembers}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-bold text-3xl">{t.finalCtaTitle}</h2>
          <p className="mx-auto mb-8 max-w-xl text-red-100">
            {t.finalCtaDescription}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-red-600 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100"
              href={isSignedIn ? "/register" : "/sign-in"}
            >
              {t.getStarted} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white hover:text-red-600"
              href="/browse"
            >
              {t.browseHosts}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Gift className="h-6 w-6 text-red-500" />
                <span className="font-bold text-lg">{t.appName}</span>
              </div>
              <p className="max-w-sm text-gray-400 text-sm leading-relaxed">
                {t.appTagline}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">{t.platform}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    href="/browse"
                  >
                    {t.becomeGuest}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    href="/register?role=host"
                  >
                    {t.inviteGuests}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">
                {t.legalAndSafety}
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    href="/safety"
                  >
                    {t.safetyGuidelines}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    href="/terms"
                  >
                    {t.termsOfService}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-amber-400"
                    href="/privacy"
                  >
                    {t.privacyPolicy}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-gray-800 border-t pt-8 text-center text-gray-500 text-sm">
            <span>
              &copy; {new Date().getFullYear()} {t.appName}.{" "}
              {t.allRightsReserved}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
