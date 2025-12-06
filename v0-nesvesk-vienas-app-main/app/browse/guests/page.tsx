'use client';

import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile-card';
import { SiteHeader } from '@/components/site-header';
import { useLocale } from '@/contexts/locale-context';
import { getAllUsers } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';
import type { GuestProfile, User } from '@/lib/types';

export default function BrowseGuestsPage() {
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [guests, setGuests] = useState<Array<{ user: User; profile: GuestProfile }>>([]);

  useEffect(() => {
    // Load all guests
    const users = getAllUsers();
    const guestProfiles: GuestProfile[] = JSON.parse(localStorage.getItem('guestProfiles') || '[]');

    const guestsData = users
      .filter((u) => u.role === 'guest')
      .map((user) => {
        const profile = guestProfiles.find((p) => p.userId === user.id);
        return profile ? { user, profile } : null;
      })
      .filter((g): g is { user: User; profile: GuestProfile } => g !== null);

    setGuests(guestsData);
  }, []);

  const handleInvite = (userId: string) => {
    console.log('[v0] Inviting guest:', userId);
    // In a real app, open invitation modal
    alert('Invitation feature coming soon! This would open a modal to send an invitation.');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-bold text-3xl text-foreground">{t.browseGuests}</h1>
            <p className="mt-2 text-muted-foreground">
              Invite guests to join your holiday celebration
            </p>
          </div>

          {guests.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No guests looking for hosts yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guests.map(({ user, profile }) => (
                <ProfileCard
                  key={user.id}
                  onInvite={() => handleInvite(user.id)}
                  profile={profile}
                  type="guest"
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
