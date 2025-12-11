"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Flame,
  Gift,
  Heart,
  Menu,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale } from "@/contexts/locale-context";
import type { Locale } from "@/lib/i18n";

const languages: { code: Locale; label: string }[] = [
  { code: "lt", label: "LT" },
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
];

function MagicLanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`flex gap-0.5 rounded-md border border-amber-200/20 bg-slate-900/50 p-0.5 backdrop-blur-sm ${compact ? "" : "md:gap-1 md:rounded-lg md:p-1"}`}
    >
      {languages.map((lang) => (
        <button
          className={`rounded px-1.5 py-0.5 font-medium text-[10px] transition-all md:min-w-7 md:px-2 md:py-1 md:text-xs ${
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

export default function LandingPage() {
  const { isAuthenticated: isSignedIn } = useConvexAuth();
  const { t } = useLocale();

  const scrollToSection = (id: string, delay = 0) => {
    const doScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
    if (delay > 0) {
      setTimeout(doScroll, delay);
    } else {
      doScroll();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-white">
      {/* Navbar */}
      <nav className="relative z-20 border-white/10 border-b bg-[#0F172A]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          {/* Logo */}
          <Link className="flex items-center gap-1.5 sm:gap-2" href="/">
            <Gift className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6" />
            <span className="font-bold font-serif text-amber-100 text-base sm:text-lg">
              {t.appName}
            </span>
          </Link>

          {/* Center nav links - desktop */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <button
              className="font-medium text-amber-100/80 text-sm transition-colors hover:text-amber-100"
              onClick={() => scrollToSection("how-it-works")}
              type="button"
            >
              {t.howItWorks}
            </button>
            <button
              className="font-medium text-amber-100/80 text-sm transition-colors hover:text-amber-100"
              onClick={() => scrollToSection("about")}
              type="button"
            >
              {t.about}
            </button>
          </div>

          {/* Right side - desktop */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <MagicLanguageSelector />
            <SignedOut>
              <Link
                className="rounded-full border border-amber-200/30 px-3 py-1.5 font-medium text-amber-100 text-sm backdrop-blur-sm transition-all hover:bg-amber-200/10 lg:px-4 lg:py-2"
                href="/sign-in"
              >
                {t.signIn}
              </Link>
              <Link
                className="rounded-full bg-amber-400 px-3 py-1.5 font-medium text-slate-900 text-sm transition-all hover:bg-amber-300 lg:px-4 lg:py-2"
                href="/sign-up"
              >
                {t.signUp}
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                className="rounded-full bg-amber-400 px-3 py-1.5 font-medium text-slate-900 text-sm transition-all hover:bg-amber-300 lg:px-4 lg:py-2"
                href="/browse"
              >
                {t.goToApp}
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile: language + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <MagicLanguageSelector compact />
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-1 text-amber-100" type="button">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                className="w-[300px] border-slate-700/50 bg-linear-to-b from-slate-900 to-slate-950 p-0"
                side="right"
              >
                <SheetHeader className="border-slate-700/50 border-b p-4">
                  <SheetTitle className="flex items-center gap-2 text-amber-100">
                    <Gift className="h-5 w-5 text-amber-400" />
                    {t.appName}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col p-2">
                  {/* Navigation buttons */}
                  <SheetClose asChild>
                    <button
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-slate-800/50"
                      onClick={() => scrollToSection("how-it-works", 300)}
                      type="button"
                    >
                      <span className="font-medium text-amber-100/90">
                        {t.howItWorks}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-100/40" />
                    </button>
                  </SheetClose>

                  <SheetClose asChild>
                    <button
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-slate-800/50"
                      onClick={() => scrollToSection("about", 300)}
                      type="button"
                    >
                      <span className="font-medium text-amber-100/90">
                        {t.about}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-100/40" />
                    </button>
                  </SheetClose>

                  <div className="mx-4 my-2 h-px bg-slate-700/50" />

                  {/* Auth buttons */}
                  <div className="p-4">
                    <SignedOut>
                      <div className="flex gap-3">
                        <SheetClose asChild>
                          <Link
                            className="flex-1 rounded-lg border border-amber-200/30 py-2.5 text-center font-medium text-amber-100 text-sm transition-colors hover:bg-amber-200/10"
                            href="/sign-in"
                          >
                            {t.signIn}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            className="flex-1 rounded-lg bg-amber-400 py-2.5 text-center font-medium text-slate-900 text-sm transition-colors hover:bg-amber-300"
                            href="/sign-up"
                          >
                            {t.signUp}
                          </Link>
                        </SheetClose>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <SheetClose asChild>
                        <Link
                          className="block w-full rounded-lg bg-amber-400 py-2.5 text-center font-medium text-slate-900 text-sm transition-colors hover:bg-amber-300"
                          href="/browse"
                        >
                          {t.goToApp}
                        </Link>
                      </SheetClose>
                    </SignedIn>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
          <div className="absolute inset-0 bg-linear-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-[#0F172A]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8 lg:py-40">
          {/* Constrained text container for mobile */}
          <div className="mx-auto max-w-sm sm:mx-0 sm:max-w-2xl">
            <h1 className="mb-4 text-center font-bold font-serif text-3xl text-amber-100 tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:mb-6 sm:text-left sm:text-4xl md:text-5xl lg:text-7xl">
              {t.heroTitle}
              <br />
              <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="mb-6 text-center text-blue-100/90 text-sm leading-relaxed drop-shadow-md sm:mb-8 sm:text-left sm:text-base md:text-lg lg:text-xl">
              {t.heroDescription}
            </p>
            {/* Mobile: side-by-side centered buttons */}
            <div className="flex justify-center gap-3 sm:justify-start sm:gap-4">
              <Link
                className="group relative overflow-hidden rounded-full bg-amber-400 px-4 py-2.5 font-semibold text-slate-900 text-sm shadow-amber-400/20 shadow-lg transition-all hover:scale-105 hover:shadow-amber-400/40 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base lg:text-lg"
                href={isSignedIn ? "/onboarding" : "/sign-in"}
              >
                <span className="relative z-10">{t.inviteGuests}</span>
                <div className="-translate-x-full absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                className="rounded-full border-2 border-amber-200/30 px-4 py-2.5 font-semibold text-amber-100 text-sm backdrop-blur-sm transition-all hover:border-amber-200/60 hover:bg-amber-200/10 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base lg:text-lg"
                href={isSignedIn ? "/browse" : "/sign-in"}
              >
                {t.becomeGuest}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 h-32 w-[300px] translate-y-1/2 rounded-full bg-amber-500/10 blur-[80px] sm:h-64 sm:w-[600px] sm:blur-[100px]" />

        {/* Divider between hero and how it works */}
        <div className="relative z-10 mx-auto max-w-xs px-4 sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-400/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-400/30" />
          </div>
        </div>

        {/* How it works - inside hero for continuous background */}
        <div
          className="relative z-10 px-4 pt-10 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24"
          id="how-it-works"
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-xs text-center sm:mb-12 sm:max-w-none md:mb-16">
              <h2 className="mb-2 font-bold font-serif text-2xl text-amber-100 sm:mb-4 sm:text-3xl md:text-4xl">
                {t.howItWorks}
              </h2>
              <p className="mx-auto max-w-2xl text-blue-100/70 text-sm sm:text-base">
                {t.howItWorksSubtitle}
              </p>
            </div>

            <div className="mx-auto grid max-w-xs grid-cols-1 gap-6 sm:max-w-none sm:gap-8 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/20 bg-slate-900/60 shadow-amber-500/10 shadow-lg backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Users className="h-7 w-7 text-amber-400 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="mb-2 font-bold text-amber-100 text-base sm:mb-3 sm:text-lg md:text-xl">
                  1. {t.step1Title}
                </h3>
                <p className="text-blue-100/60 text-xs sm:text-sm">
                  {t.step1Description}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-slate-900/60 shadow-emerald-500/10 shadow-lg backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Calendar className="h-7 w-7 text-emerald-400 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="mb-2 font-bold text-amber-100 text-base sm:mb-3 sm:text-lg md:text-xl">
                  2. {t.step2Title}
                </h3>
                <p className="text-blue-100/60 text-xs sm:text-sm">
                  {t.step2Description}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/20 bg-slate-900/60 shadow-lg shadow-rose-500/10 backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Heart className="h-7 w-7 text-rose-400 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="mb-2 font-bold text-amber-100 text-base sm:mb-3 sm:text-lg md:text-xl">
                  3. {t.step3Title}
                </h3>
                <p className="text-blue-100/60 text-xs sm:text-sm">
                  {t.step3Description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator before Founder section */}
      <div className="mx-auto max-w-xs px-4 py-8 sm:max-w-md sm:py-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-400/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-400/30" />
        </div>
      </div>

      {/* Story Section - Founder Card */}
      <div className="relative px-4 pb-12 sm:pb-16 md:pb-24" id="about">
        <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-amber-200/10 bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm sm:rounded-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Image - taller on mobile */}
              <div className="relative h-64 w-full sm:h-72 md:h-auto md:w-2/5">
                <Image
                  alt="Klaudija, founder of Nešvęsk vienas"
                  className="object-cover object-top"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  src="/klaudija.jpg"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                {/* Quote section */}
                <div className="p-4 sm:p-6 md:p-8">
                  <h3 className="mb-3 font-bold font-serif text-amber-100 text-lg sm:text-xl md:text-2xl">
                    {t.originStoryTitle}
                  </h3>
                  <p className="mb-3 text-amber-200/80 text-sm italic leading-relaxed sm:text-base">
                    "{t.originStoryQuote}"
                  </p>
                  <p className="text-amber-100/60 text-xs sm:text-sm">
                    — {t.originStoryAuthor}
                  </p>
                </div>

                {/* Separator */}
                <div className="mx-4 h-px bg-amber-200/10 sm:mx-6 md:mx-8" />

                {/* Highlighted footer section */}
                <div className="bg-slate-800/30 p-4 sm:p-6 md:p-8">
                  <p className="text-center text-blue-100/70 text-xs leading-relaxed sm:text-left sm:text-sm">
                    {t.originStoryDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator before Safety */}
      <div className="mx-auto max-w-xs px-4 py-8 sm:max-w-md sm:py-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-400/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-400/30" />
        </div>
      </div>

      {/* Safety Section */}
      <div className="relative bg-slate-900/50 px-4 pb-12 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-xs text-center sm:mb-12 sm:max-w-none md:mb-16">
            <h2 className="mb-2 font-bold font-serif text-2xl text-amber-100 sm:mb-4 sm:text-3xl md:text-4xl">
              {t.safetyTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-blue-100/70 text-sm sm:text-base">
              {t.howItWorksSubtitle}
            </p>
          </div>

          {/* Safety cards - centered and smaller on mobile */}
          <div className="mx-auto flex max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="rounded-xl border border-amber-200/10 bg-linear-to-br from-slate-800/30 to-slate-900/30 p-4 text-center backdrop-blur-sm sm:w-72 sm:rounded-2xl sm:p-5 sm:text-left md:w-80 md:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 sm:mx-0 sm:mb-4 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <Star className="h-5 w-5 text-amber-400 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <h3 className="mb-1.5 font-semibold text-amber-100 text-base sm:mb-2 sm:text-lg">
                {t.identityVerification}
              </h3>
              <p className="text-blue-100/60 text-xs leading-relaxed sm:text-sm">
                {t.identityVerificationDesc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-amber-200/10 bg-linear-to-br from-slate-800/30 to-slate-900/30 p-4 text-center backdrop-blur-sm sm:w-72 sm:rounded-2xl sm:p-5 sm:text-left md:w-80 md:p-6">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-400/10 sm:mx-0 sm:mb-4 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <MessageCircle className="h-5 w-5 text-rose-400 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <h3 className="mb-1.5 font-semibold text-amber-100 text-base sm:mb-2 sm:text-lg">
                {t.mutualConsent}
              </h3>
              <p className="text-blue-100/60 text-xs leading-relaxed sm:text-sm">
                {t.mutualConsentDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24">
        <div className="absolute inset-0 bg-linear-to-br from-amber-600/20 via-rose-600/10 to-amber-600/20" />
        <div className="-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-32 w-[400px] rounded-full bg-amber-500/20 blur-[80px] sm:h-64 sm:w-[800px] sm:blur-[120px]" />

        {/* Separator at top of CTA */}
        <div className="relative mx-auto mb-8 max-w-xs px-4 sm:mb-12 sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-400/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-400/30" />
          </div>
        </div>

        <div className="relative mx-auto max-w-xs px-4 text-center sm:max-w-4xl">
          <Flame className="mx-auto mb-4 h-8 w-8 text-amber-400 sm:mb-6 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          <h2 className="mb-2 font-bold font-serif text-2xl text-amber-100 sm:mb-4 sm:text-3xl md:text-4xl">
            {t.finalCtaTitle}
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-blue-100/70 text-sm sm:mb-8 sm:text-base">
            {t.finalCtaDescription}
          </p>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Link
              className="group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-amber-400 px-4 py-2.5 font-semibold text-slate-900 text-sm shadow-amber-400/20 shadow-lg transition-all hover:scale-105 hover:shadow-amber-400/40 sm:gap-2 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base"
              href={isSignedIn ? "/onboarding" : "/sign-in"}
            >
              <span className="relative z-10">{t.getStarted}</span>
              <ArrowRight className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
              <div className="-translate-x-full absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              className="flex items-center justify-center rounded-full border-2 border-amber-200/30 px-4 py-2.5 font-semibold text-amber-100 text-sm backdrop-blur-sm transition-all hover:border-amber-200/60 hover:bg-amber-200/10 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base"
              href="/browse"
            >
              {t.browseHosts}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
