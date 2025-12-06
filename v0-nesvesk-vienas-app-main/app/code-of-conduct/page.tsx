'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { useTranslation } from '@/lib/i18n';

export default function CodeOfConductPage() {
  const { locale } = useLocale();
  const t = useTranslation(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h1 className="font-bold text-4xl text-foreground">{t.codeOfConduct}</h1>
            <p className="mt-2 text-muted-foreground">Our community values and expectations</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Be Respectful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>
                  Treat everyone with kindness, respect, and dignity. We welcome people of all
                  backgrounds, cultures, and beliefs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Be Honest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>
                  Provide accurate information in your profile. Be truthful about your capacity,
                  availability, and expectations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Be Inclusive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>
                  Our platform is open to everyone. Discrimination based on race, religion,
                  nationality, gender, sexual orientation, or any other characteristic is strictly
                  prohibited.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Be Communicative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>
                  Respond to invitations and messages in a timely manner. If plans change, inform
                  others as soon as possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zero Tolerance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground text-sm">
                <p>
                  We have zero tolerance for harassment, threats, inappropriate behavior, or any
                  actions that make others feel unsafe. Violations will result in immediate account
                  suspension.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
