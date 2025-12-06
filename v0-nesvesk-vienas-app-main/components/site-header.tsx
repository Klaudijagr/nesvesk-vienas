'use client';

import Link from 'next/link';
import { LanguageSelector } from '@/components/language-selector';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/locale-context';
import { useTranslation } from '@/lib/i18n';

export function SiteHeader() {
  const { locale } = useLocale();
  const t = useTranslation(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link className="flex items-center gap-2" href="/">
          <span className="font-bold text-foreground text-xl">{t.appName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            className="font-medium text-foreground text-sm hover:text-primary"
            href="/browse/hosts"
          >
            {t.browseHosts}
          </Link>
          <Link
            className="font-medium text-foreground text-sm hover:text-primary"
            href="/browse/guests"
          >
            {t.browseGuests}
          </Link>
          <Link
            className="font-medium text-foreground text-sm hover:text-primary"
            href="/dashboard"
          >
            {t.dashboard}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <div className="hidden gap-2 sm:flex">
            <Button asChild variant="ghost">
              <Link href="/auth/signin">{t.signIn}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">{t.signUp}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
