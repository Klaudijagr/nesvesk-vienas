'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';
import { useTranslation } from '@/lib/i18n';

export function SiteFooter() {
  const { locale } = useLocale();
  const t = useTranslation(locale);

  return (
    <footer className="border-border border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-semibold text-foreground text-sm">{t.appName}</p>
            <p className="text-muted-foreground text-xs">2025. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/safety-tips">
              {t.safetyTips}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/code-of-conduct">
              {t.codeOfConduct}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/terms">
              {t.terms}
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
