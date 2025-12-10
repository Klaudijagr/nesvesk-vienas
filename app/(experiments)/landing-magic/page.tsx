"use client";

import { useConvexAuth } from "convex/react";
import {
  ArrowRight,
  Calendar,
  Flame,
  Gift,
  Heart,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/locale-context";
import type { Locale } from "@/lib/i18n";

const languages: { code: Locale; label: string }[] = [
  { code: "lt", label: "LT" },
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
];

function MagicLanguageSelector() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex gap-1 rounded-lg border border-amber-200/20 bg-slate-900/50 p-1 backdrop-blur-sm">
      {languages.map((lang) => (
        <button
          className={`min-w-[2rem] rounded px-2 py-1 font-medium text-xs transition-all ${
            locale === lang.code
              ? "bg-amber-400 text-slate-900"
              : "text-amber-100/70 hover:bg-amber-400/10 hover:text-amber-100"
          }`}
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          type="button"
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default function LandingMagicPage() {
  const { isAuthenticated: isSignedIn } = useConvexAuth();
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-white">
      {/* Navbar */}
      <nav className="relative z-20 border-white/10 border-b bg-[#0F172A]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2" href="/landing-magic">
            <Gift className="h-6 w-6 text-amber-400" />
            <span className="font-bold font-serif text-amber-100 text-lg">
              {t.appName}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="hidden text-amber-100/80 text-sm transition-colors hover:text-amber-100 sm:block"
              href="#how-it-works"
            >
              {t.howItWorks}
            </Link>
            <Link
              className="hidden text-amber-100/80 text-sm transition-colors hover:text-amber-100 sm:block"
              href="#about"
            >
              {t.about}
            </Link>
            <MagicLanguageSelector />
            <Link
              className="rounded-full bg-amber-400/10 px-4 py-2 font-medium text-amber-200 text-sm backdrop-blur-sm transition-all hover:bg-amber-400/20"
              href={isSignedIn ? "/browse" : "/sign-in"}
            >
              {isSignedIn ? t.browseHosts : t.signIn}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            alt="Magical winter night with a lit window"
            className="object-cover opacity-70"
            fill
            priority
            src="/magic-window.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 md:py-40 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-bold font-serif text-5xl text-amber-100 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-7xl">
              {t.heroTitle}
              <br />
              <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="mb-8 text-blue-100/90 text-lg leading-relaxed drop-shadow-md md:text-xl">
              {t.heroDescription}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="group relative overflow-hidden rounded-full bg-amber-400 px-8 py-4 font-bold text-base text-slate-900 shadow-amber-400/20 shadow-lg transition-all hover:scale-105 hover:shadow-amber-400/40 md:text-lg"
                href={isSignedIn ? "/onboarding" : "/sign-in"}
              >
                <span className="relative z-10">{t.inviteGuests}</span>
                <div className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                className="group relative overflow-hidden rounded-full border-2 border-amber-200/30 px-8 py-4 font-bold text-amber-100 text-base backdrop-blur-sm transition-all hover:border-amber-200/60 hover:bg-amber-200/10 md:text-lg"
                href={isSignedIn ? "/browse" : "/sign-in"}
              >
                {t.becomeGuest}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 h-64 w-[600px] translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />

        {/* How it works - inside hero for continuous background */}
        <div className="relative z-10 pt-16 pb-24" id="how-it-works">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-bold font-serif text-3xl text-amber-100 md:text-4xl">
                {t.howItWorks}
              </h2>
              <p className="mx-auto max-w-2xl text-blue-100/70">
                {t.howItWorksSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-slate-900/60 shadow-amber-500/10 shadow-lg backdrop-blur-sm">
                  <Users className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="mb-3 font-bold text-amber-100 text-xl">
                  1. {t.step1Title}
                </h3>
                <p className="text-blue-100/60">{t.step1Description}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-900/60 shadow-emerald-500/10 shadow-lg backdrop-blur-sm">
                  <Calendar className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="mb-3 font-bold text-amber-100 text-xl">
                  2. {t.step2Title}
                </h3>
                <p className="text-blue-100/60">{t.step2Description}</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-rose-400/20 bg-slate-900/60 shadow-lg shadow-rose-500/10 backdrop-blur-sm">
                  <Heart className="h-10 w-10 text-rose-400" />
                </div>
                <h3 className="mb-3 font-bold text-amber-100 text-xl">
                  3. {t.step3Title}
                </h3>
                <p className="text-blue-100/60">{t.step3Description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative py-24" id="about">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 rounded-2xl border border-amber-200/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm md:flex-row md:p-12">
            <div className="relative h-64 w-full md:w-1/3">
              <Image
                alt="Friends sharing warmth by candlelight"
                className="rounded-lg object-cover shadow-black/30 shadow-xl"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src="https://images.unsplash.com/photo-1513618827672-0d7c5ad591b1?auto=format&fit=crop&w=800&q=80"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="mb-4 font-bold font-serif text-2xl text-amber-100">
                {t.originStoryTitle}
              </h3>
              <p className="mb-6 text-amber-200/80 italic leading-relaxed">
                "{t.originStoryQuote}"
              </p>
              <p className="mb-4 text-amber-100/60 text-sm">
                — {t.originStoryAuthor}
              </p>
              <p className="text-blue-100/60 text-sm leading-relaxed">
                {t.originStoryDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="relative bg-slate-900/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold font-serif text-3xl text-amber-100 md:text-4xl">
              {t.safetyTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-blue-100/70">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-2xl border border-amber-200/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10">
                <Star className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="mb-2 font-semibold text-amber-100 text-lg">
                {t.identityVerification}
              </h3>
              <p className="text-blue-100/60 text-sm leading-relaxed">
                {t.identityVerificationDesc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-amber-200/10 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-400/10">
                <MessageCircle className="h-7 w-7 text-rose-400" />
              </div>
              <h3 className="mb-2 font-semibold text-amber-100 text-lg">
                {t.mutualConsent}
              </h3>
              <p className="text-blue-100/60 text-sm leading-relaxed">
                {t.mutualConsentDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-amber-400/5 to-amber-600/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="font-bold font-serif text-4xl text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {t.statsLanguagesValue}
              </div>
              <div className="text-blue-100/60 text-sm">{t.statsLanguages}</div>
            </div>
            <div>
              <div className="font-bold font-serif text-4xl text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {t.statsCitiesValue}
              </div>
              <div className="text-blue-100/60 text-sm">{t.statsCities}</div>
            </div>
            <div>
              <div className="font-bold font-serif text-4xl text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {t.statsHolidayPeriodValue}
              </div>
              <div className="text-blue-100/60 text-sm">
                {t.statsHolidayPeriod}
              </div>
            </div>
            <div>
              <div className="font-bold font-serif text-4xl text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {t.statsCommunityMembersValue}
              </div>
              <div className="text-blue-100/60 text-sm">
                {t.statsCommunityMembers}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-rose-600/10 to-amber-600/20" />
        <div className="-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-64 w-[800px] rounded-full bg-amber-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Flame className="mx-auto mb-6 h-12 w-12 text-amber-400" />
          <h2 className="mb-4 font-bold font-serif text-3xl text-amber-100 md:text-4xl">
            {t.finalCtaTitle}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-blue-100/70">
            {t.finalCtaDescription}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-amber-400 px-8 py-4 font-bold text-slate-900 shadow-amber-400/20 shadow-lg transition-all hover:scale-105 hover:shadow-amber-400/40"
              href={isSignedIn ? "/onboarding" : "/sign-in"}
            >
              <span className="relative z-10">{t.getStarted}</span>
              <ArrowRight className="relative z-10 h-5 w-5" />
              <div className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              className="flex items-center justify-center gap-2 rounded-full border-2 border-amber-200/30 px-8 py-4 font-bold text-amber-100 backdrop-blur-sm transition-all hover:border-amber-200/60 hover:bg-amber-200/10"
              href="/browse"
            >
              {t.browseHosts}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-white/10 border-t bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Gift className="h-6 w-6 text-amber-400" />
                <span className="font-bold font-serif text-amber-100 text-lg">
                  {t.appName}
                </span>
              </div>
              <p className="max-w-sm text-blue-100/50 text-sm leading-relaxed">
                {t.appTagline}
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-amber-100">
                {t.platform}
              </h3>
              <ul className="space-y-2 text-blue-100/50 text-sm">
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
                    href="/onboarding"
                  >
                    {t.inviteGuests}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-amber-100">
                {t.legalAndSafety}
              </h3>
              <ul className="space-y-2 text-blue-100/50 text-sm">
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
          <div className="mt-12 border-white/10 border-t pt-8 text-center text-blue-100/40 text-sm">
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
