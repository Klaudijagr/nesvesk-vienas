'use client';

import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/profile-card';
import { SiteHeader } from '@/components/site-header';
import { useLocale } from '@/contexts/locale-context';
import { getAllUsers } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';
import type { HostProfile, User } from '@/lib/types';

export default function BrowseHostsPage() {
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [hosts, setHosts] = useState<Array<{ user: User; profile: HostProfile }>>([]);

  useEffect(() => {
    // Load all hosts
    const users = getAllUsers();
    const hostProfiles: HostProfile[] = JSON.parse(localStorage.getItem('hostProfiles') || '[]');

    const hostsData = users
      .filter((u) => u.role === 'host')
      .map((user) => {
        const profile = hostProfiles.find((p) => p.userId === user.id);
        return profile ? { user, profile } : null;
      })
      .filter((h): h is { user: User; profile: HostProfile } => h !== null);

    setHosts(hostsData);
  }, []);

  const handleInvite = (userId: string) => {
    console.log('[v0] Inviting host:', userId);
    // In a real app, open invitation modal
    alert('Invitation feature coming soon! This would open a modal to send an invitation.');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-bold text-3xl text-foreground">{t.browseHosts}</h1>
            <p className="mt-2 text-muted-foreground">
              Find a welcoming host for your holiday celebration
            </p>
          </div>

          {hosts.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">
                No hosts available yet. Be the first to register as a host!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hosts.map(({ user, profile }) => (
                <ProfileCard
                  key={user.id}
                  onInvite={() => handleInvite(user.id)}
                  profile={profile}
                  type="host"
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
