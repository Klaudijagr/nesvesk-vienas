'use client';

import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const { locale } = useLocale();
  const t = useTranslation(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-balance font-bold text-4xl text-foreground tracking-tight md:text-6xl">
                {t.appName}
              </h1>
              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                {t.appTagline}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild className="text-lg" size="lg">
                  <Link href="/auth/signup?role=host">{t.startAsHost}</Link>
                </Button>
                <Button asChild className="bg-transparent text-lg" size="lg" variant="outline">
                  <Link href="/auth/signup?role=guest">{t.startAsGuest}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-bold text-3xl text-foreground md:text-4xl">
              {t.howItWorks}
            </h2>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 font-semibold text-foreground text-xl">{t.step1Title}</h3>
                  <p className="text-muted-foreground">{t.step1Description}</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 font-semibold text-foreground text-xl">{t.step2Title}</h3>
                  <p className="text-muted-foreground">{t.step2Description}</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 font-semibold text-foreground text-xl">{t.step3Title}</h3>
                  <p className="text-muted-foreground">{t.step3Description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Safety & Trust Section */}
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <svg
                className="mx-auto mb-6 h-16 w-16 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl">
                {t.safetyAndTrust}
              </h2>
              <p className="mb-8 text-pretty text-lg text-muted-foreground leading-relaxed">
                {t.safetyDescription}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href="/safety-tips">{t.safetyTips}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/code-of-conduct">{t.codeOfConduct}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 font-bold text-3xl text-foreground md:text-4xl">
                {t.finalCtaTitle}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">{t.finalCtaDescription}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/signup">{t.signUp}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/browse/hosts">{t.browseHosts}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
