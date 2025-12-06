'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { getAllUsers, getCurrentUser, updateCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';

export default function ChooseRolePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    } else if (!user.emailVerified) {
      router.push('/auth/verify-email');
    }
  }, [user, router]);

  const handleChooseRole = (role: 'host' | 'guest') => {
    if (user) {
      const updated = updateCurrentUser({ role });
      if (updated) {
        // Update in all users list
        const users = getAllUsers();
        const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

        setTimeout(() => {
          if (role === 'host') {
            router.push('/register/host');
          } else {
            router.push('/register/guest');
          }
        }, 300);
      }
    }
  };

  if (!(user && user.emailVerified)) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="font-bold text-3xl text-foreground">Choose Your Role</h1>
            <p className="mt-2 text-muted-foreground">
              Are you hosting a celebration or looking for a place to celebrate?
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="cursor-pointer border-2 transition-colors hover:border-primary">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <svg
                    className="h-16 w-16 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <CardTitle className="text-center">{t.startAsHost}</CardTitle>
                <CardDescription className="text-center">
                  Invite guests to celebrate at your place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-muted-foreground text-sm">
                  <li>• Share your holiday spirit</li>
                  <li>• Choose who to invite</li>
                  <li>• Set your own capacity</li>
                  <li>• Build meaningful connections</li>
                </ul>
                <Button className="w-full" onClick={() => handleChooseRole('host')}>
                  Continue as Host
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer border-2 transition-colors hover:border-primary">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <svg
                    className="h-16 w-16 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <CardTitle className="text-center">{t.startAsGuest}</CardTitle>
                <CardDescription className="text-center">
                  Find a welcoming place to celebrate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-muted-foreground text-sm">
                  <li>• Browse available hosts</li>
                  <li>• Find the right atmosphere</li>
                  <li>• Send requests to join</li>
                  <li>• Enjoy the holidays together</li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleChooseRole('guest')}
                  variant="outline"
                >
                  Continue as Guest
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
