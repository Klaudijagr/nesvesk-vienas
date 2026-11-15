"use client";

import { Show, UserButton } from "@clerk/nextjs";
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

const MagicLanguageSelector = ({ compact = false }: { compact?: boolean }) => {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`border-gold-soft/20 bg-night/50 flex gap-0.5 rounded-md border p-0.5 backdrop-blur-sm ${compact ? "" : "md:gap-1 md:rounded-lg md:p-1"}`}
    >
      {languages.map((lang) => (
        <button
          className={`text-2xs rounded px-1.5 py-0.5 font-medium transition-all md:min-w-7 md:px-2 md:py-1 md:text-xs ${
            locale === lang.code
              ? "bg-gold text-gold-foreground"
              : "text-gold-soft/70 hover:bg-gold/10 hover:text-gold-soft"
          }`}
          key={lang.code}
          onClick={() => {
            setLocale(lang.code);
          }}
          type="button"
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

const scrollToSection = (id: string, delay = 0) => {
  const doScroll = () => {
    const element = document.querySelector(`#${id}`);
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

const LandingPage = () => {
  const { isAuthenticated: isSignedIn } = useConvexAuth();
  const { t } = useLocale();

  return (
    <div className="bg-night flex min-h-screen flex-col text-white">
      {/* Navbar */}
      <nav className="bg-night/80 relative z-20 border-b border-white/10 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          {/* Logo */}
          <Link className="flex items-center gap-1.5 sm:gap-2" href="/">
            <Gift className="text-gold h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-gold-soft font-serif text-base font-bold sm:text-lg">
              {t.appName}
            </span>
          </Link>

          {/* Center nav links - desktop */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <button
              className="text-gold-soft/80 hover:text-gold-soft text-sm font-medium transition-colors"
              onClick={() => {
                scrollToSection("how-it-works");
              }}
              type="button"
            >
              {t.howItWorks}
            </button>
            <button
              className="text-gold-soft/80 hover:text-gold-soft text-sm font-medium transition-colors"
              onClick={() => {
                scrollToSection("about");
              }}
              type="button"
            >
              {t.about}
            </button>
          </div>

          {/* Right side - desktop */}
          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <MagicLanguageSelector />
            <Show when="signed-out">
              <Link
                className="border-gold-soft/30 text-gold-soft hover:bg-gold-soft/10 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur-sm transition-all lg:px-4 lg:py-2"
                href="/sign-in"
              >
                {t.signIn}
              </Link>
              <Link
                className="bg-gold text-gold-foreground hover:bg-gold-bright rounded-full px-3 py-1.5 text-sm font-medium transition-all lg:px-4 lg:py-2"
                href="/sign-up"
              >
                {t.signUp}
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                className="bg-gold text-gold-foreground hover:bg-gold-bright rounded-full px-3 py-1.5 text-sm font-medium transition-all lg:px-4 lg:py-2"
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
            </Show>
          </div>

          {/* Mobile: language + menu */}
          <div className="flex items-center gap-2 md:hidden">
            <MagicLanguageSelector compact />
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-gold-soft p-1" type="button">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                className="border-night-border/50 from-night to-night-deep w-[300px] bg-linear-to-b p-0"
                side="right"
              >
                <SheetHeader className="border-night-border/50 border-b p-4">
                  <SheetTitle className="text-gold-soft flex items-center gap-2">
                    <Gift className="text-gold h-5 w-5" />
                    {t.appName}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col p-2">
                  {/* Navigation buttons */}
                  <SheetClose asChild>
                    <button
                      className="hover:bg-night-raised/50 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors"
                      onClick={() => {
                        scrollToSection("how-it-works", 300);
                      }}
                      type="button"
                    >
                      <span className="text-gold-soft/90 font-medium">
                        {t.howItWorks}
                      </span>
                      <ChevronRight className="text-gold-soft/40 h-4 w-4" />
                    </button>
                  </SheetClose>

                  <SheetClose asChild>
                    <button
                      className="hover:bg-night-raised/50 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors"
                      onClick={() => {
                        scrollToSection("about", 300);
                      }}
                      type="button"
                    >
                      <span className="text-gold-soft/90 font-medium">
                        {t.about}
                      </span>
                      <ChevronRight className="text-gold-soft/40 h-4 w-4" />
                    </button>
                  </SheetClose>

                  <div className="bg-night-border/50 mx-4 my-2 h-px" />

                  {/* Auth buttons */}
                  <div className="p-4">
                    <Show when="signed-out">
                      <div className="flex gap-3">
                        <SheetClose asChild>
                          <Link
                            className="border-gold-soft/30 text-gold-soft hover:bg-gold-soft/10 flex-1 rounded-lg border py-2.5 text-center text-sm font-medium transition-colors"
                            href="/sign-in"
                          >
                            {t.signIn}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            className="bg-gold text-gold-foreground hover:bg-gold-bright flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-colors"
                            href="/sign-up"
                          >
                            {t.signUp}
                          </Link>
                        </SheetClose>
                      </div>
                    </Show>
                    <Show when="signed-in">
                      <SheetClose asChild>
                        <Link
                          className="bg-gold text-gold-foreground hover:bg-gold-bright block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors"
                          href="/browse"
                        >
                          {t.goToApp}
                        </Link>
                      </SheetClose>
                    </Show>
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
          <div className="from-night via-night/60 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-night/40 absolute inset-0 bg-linear-to-b to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8 lg:py-40">
          {/* Constrained text container for mobile */}
          <div className="mx-auto max-w-sm sm:mx-0 sm:max-w-2xl">
            <h1 className="text-gold-soft drop-shadow-text mb-4 text-center font-serif text-3xl font-bold tracking-tight sm:mb-6 sm:text-left sm:text-4xl md:text-5xl lg:text-7xl">
              {t.heroTitle}
              <br />
              <span className="text-gold drop-shadow-glow">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="text-night-foreground/80 mb-6 text-center text-sm leading-relaxed drop-shadow-md sm:mb-8 sm:text-left sm:text-base md:text-lg lg:text-xl">
              {t.heroDescription}
            </p>
            {/* Mobile: side-by-side centered buttons */}
            <div className="flex justify-center gap-3 sm:justify-start sm:gap-4">
              <Link
                className="group bg-gold text-gold-foreground shadow-gold/20 hover:shadow-gold/40 relative overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base lg:text-lg"
                href={isSignedIn ? "/onboarding" : "/sign-in"}
              >
                <span className="relative z-10">{t.inviteGuests}</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                className="border-gold-soft/30 text-gold-soft hover:border-gold-soft/60 hover:bg-gold-soft/10 rounded-full border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base lg:text-lg"
                href={isSignedIn ? "/browse" : "/sign-in"}
              >
                {t.becomeGuest}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="bg-gold-rich/10 blur-4xl sm:blur-5xl pointer-events-none absolute bottom-0 left-1/2 h-32 w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full sm:h-64 sm:w-[600px]" />

        {/* Divider between hero and how it works */}
        <div className="relative z-10 mx-auto max-w-xs px-4 sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="to-gold/30 h-px flex-1 bg-linear-to-r from-transparent" />
            <div className="bg-gold/50 h-1.5 w-1.5 rounded-full" />
            <div className="to-gold/30 h-px flex-1 bg-linear-to-l from-transparent" />
          </div>
        </div>

        {/* How it works - inside hero for continuous background */}
        <div
          className="relative z-10 px-4 pt-10 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24"
          id="how-it-works"
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-xs text-center sm:mb-12 sm:max-w-none md:mb-16">
              <h2 className="text-gold-soft mb-2 font-serif text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
                {t.howItWorks}
              </h2>
              <p className="text-night-foreground/65 mx-auto max-w-2xl text-sm sm:text-base">
                {t.howItWorksSubtitle}
              </p>
            </div>

            <div className="mx-auto grid max-w-xs grid-cols-1 gap-6 sm:max-w-none sm:gap-8 md:grid-cols-3 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="border-gold/20 bg-night/60 shadow-gold-rich/10 mb-3 flex h-14 w-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Users className="text-gold h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-gold-soft mb-2 text-base font-bold sm:mb-3 sm:text-lg md:text-xl">
                  1. {t.step1Title}
                </h3>
                <p className="text-night-foreground/55 text-xs sm:text-sm">
                  {t.step1Description}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="border-holly/20 bg-night/60 shadow-holly/10 mb-3 flex h-14 w-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Calendar className="text-holly h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-gold-soft mb-2 text-base font-bold sm:mb-3 sm:text-lg md:text-xl">
                  2. {t.step2Title}
                </h3>
                <p className="text-night-foreground/55 text-xs sm:text-sm">
                  {t.step2Description}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="border-berry/20 bg-night/60 shadow-berry/10 mb-3 flex h-14 w-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm sm:mb-4 sm:h-16 sm:w-16 md:mb-6 md:h-20 md:w-20">
                  <Heart className="text-berry h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-gold-soft mb-2 text-base font-bold sm:mb-3 sm:text-lg md:text-xl">
                  3. {t.step3Title}
                </h3>
                <p className="text-night-foreground/55 text-xs sm:text-sm">
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
          <div className="to-gold/30 h-px flex-1 bg-linear-to-r from-transparent" />
          <div className="bg-gold/50 h-1.5 w-1.5 rounded-full" />
          <div className="to-gold/30 h-px flex-1 bg-linear-to-l from-transparent" />
        </div>
      </div>

      {/* Story Section - Founder Card */}
      <div className="relative px-4 pb-12 sm:pb-16 md:pb-24" id="about">
        <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
          <div className="border-gold-soft/10 from-night-raised/50 to-night/50 overflow-hidden rounded-xl border bg-linear-to-br backdrop-blur-sm sm:rounded-2xl">
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
                  <h3 className="text-gold-soft mb-3 font-serif text-lg font-bold sm:text-xl md:text-2xl">
                    {t.originStoryTitle}
                  </h3>
                  <p className="text-gold-soft/80 mb-3 text-sm leading-relaxed italic sm:text-base">
                    &quot;{t.originStoryQuote}&quot;
                  </p>
                  <p className="text-gold-soft/60 text-xs sm:text-sm">
                    — {t.originStoryAuthor}
                  </p>
                </div>

                {/* Separator */}
                <div className="bg-gold-soft/10 mx-4 h-px sm:mx-6 md:mx-8" />

                {/* Highlighted footer section */}
                <div className="bg-night-raised/30 p-4 sm:p-6 md:p-8">
                  <p className="text-night-foreground/65 text-center text-xs leading-relaxed sm:text-left sm:text-sm">
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
          <div className="to-gold/30 h-px flex-1 bg-linear-to-r from-transparent" />
          <div className="bg-gold/50 h-1.5 w-1.5 rounded-full" />
          <div className="to-gold/30 h-px flex-1 bg-linear-to-l from-transparent" />
        </div>
      </div>

      {/* Safety Section */}
      <div className="bg-night/50 relative px-4 pb-12 sm:pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-xs text-center sm:mb-12 sm:max-w-none md:mb-16">
            <h2 className="text-gold-soft mb-2 font-serif text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
              {t.safetyTitle}
            </h2>
            <p className="text-night-foreground/65 mx-auto max-w-2xl text-sm sm:text-base">
              {t.howItWorksSubtitle}
            </p>
          </div>

          {/* Safety cards - centered and smaller on mobile */}
          <div className="mx-auto flex max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="border-gold-soft/10 from-night-raised/30 to-night/30 rounded-xl border bg-linear-to-br p-4 text-center backdrop-blur-sm sm:w-72 sm:rounded-2xl sm:p-5 sm:text-left md:w-80 md:p-6">
              <div className="bg-gold/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mx-0 sm:mb-4 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <Star className="text-gold h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <h3 className="text-gold-soft mb-1.5 text-base font-semibold sm:mb-2 sm:text-lg">
                {t.identityVerification}
              </h3>
              <p className="text-night-foreground/55 text-xs leading-relaxed sm:text-sm">
                {t.identityVerificationDesc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="border-gold-soft/10 from-night-raised/30 to-night/30 rounded-xl border bg-linear-to-br p-4 text-center backdrop-blur-sm sm:w-72 sm:rounded-2xl sm:p-5 sm:text-left md:w-80 md:p-6">
              <div className="bg-berry/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mx-0 sm:mb-4 sm:h-12 sm:w-12 md:h-14 md:w-14">
                <MessageCircle className="text-berry h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
              <h3 className="text-gold-soft mb-1.5 text-base font-semibold sm:mb-2 sm:text-lg">
                {t.mutualConsent}
              </h3>
              <p className="text-night-foreground/55 text-xs leading-relaxed sm:text-sm">
                {t.mutualConsentDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24">
        <div className="from-gold-strong/20 via-berry/10 to-gold-strong/20 absolute inset-0 bg-linear-to-br" />
        <div className="bg-gold-rich/20 blur-4xl sm:blur-6xl pointer-events-none absolute top-0 left-1/2 h-32 w-[400px] -translate-x-1/2 rounded-full sm:h-64 sm:w-[800px]" />

        {/* Separator at top of CTA */}
        <div className="relative mx-auto mb-8 max-w-xs px-4 sm:mb-12 sm:max-w-md">
          <div className="flex items-center gap-4">
            <div className="to-gold/30 h-px flex-1 bg-linear-to-r from-transparent" />
            <div className="bg-gold/50 h-1.5 w-1.5 rounded-full" />
            <div className="to-gold/30 h-px flex-1 bg-linear-to-l from-transparent" />
          </div>
        </div>

        <div className="relative mx-auto max-w-xs px-4 text-center sm:max-w-4xl">
          <Flame className="text-gold mx-auto mb-4 h-8 w-8 sm:mb-6 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          <h2 className="text-gold-soft mb-2 font-serif text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            {t.finalCtaTitle}
          </h2>
          <p className="text-night-foreground/65 mx-auto mb-6 max-w-xl text-sm sm:mb-8 sm:text-base">
            {t.finalCtaDescription}
          </p>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Link
              className="group bg-gold text-gold-foreground shadow-gold/20 hover:shadow-gold/40 relative flex items-center justify-center gap-1.5 overflow-hidden rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 sm:gap-2 sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base"
              href={isSignedIn ? "/onboarding" : "/sign-in"}
            >
              <span className="relative z-10">{t.getStarted}</span>
              <ArrowRight className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              className="border-gold-soft/30 text-gold-soft hover:border-gold-soft/60 hover:bg-gold-soft/10 flex items-center justify-center rounded-full border-2 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all sm:px-6 sm:py-3 md:px-8 md:py-4 md:text-base"
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
};

export default LandingPage;
