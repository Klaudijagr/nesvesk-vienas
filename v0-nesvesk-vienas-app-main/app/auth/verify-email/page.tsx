'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { getAllUsers, getCurrentUser, updateCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  const handleVerify = () => {
    if (user) {
      const updated = updateCurrentUser({ emailVerified: true });
      if (updated) {
        // Update in all users list
        const users = getAllUsers();
        const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

        setUser(updated);
        setTimeout(() => {
          router.push('/auth/choose-role');
        }, 1000);
      }
    }
  };

  if (!user) return null;

  if (user.emailVerified) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center p-4">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <svg
                  className="h-16 w-16 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <CardTitle className="text-center text-2xl">Email Verified!</CardTitle>
              <CardDescription className="text-center">
                Your email has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push('/auth/choose-role')}>
                Continue
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle className="text-center text-2xl">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to <strong>{user.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              Please check your email and click the verification link to continue.
            </p>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-muted-foreground text-xs">
                For demo purposes, click the button below to simulate email verification.
              </p>
            </div>

            <Button className="w-full" onClick={handleVerify}>
              Verify Email (Demo)
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              Didn't receive the email?{' '}
              <button className="font-medium text-primary hover:underline">
                Resend verification
              </button>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
