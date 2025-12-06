'use client';

import { Calendar, CheckCircle2, Edit, LogOut, Mail, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { clearCurrentUser, getCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/lib/i18n';
import type { GuestProfile, HostProfile, User } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useTranslation(locale);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<HostProfile | GuestProfile | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth/signin');
      return;
    }

    setUser(currentUser);

    // Load profile based on role
    if (currentUser.role === 'host') {
      const hostProfiles: HostProfile[] = JSON.parse(localStorage.getItem('hostProfiles') || '[]');
      const userProfile = hostProfiles.find((p) => p.userId === currentUser.id);
      setProfile(userProfile || null);
    } else if (currentUser.role === 'guest') {
      const guestProfiles: GuestProfile[] = JSON.parse(
        localStorage.getItem('guestProfiles') || '[]',
      );
      const userProfile = guestProfiles.find((p) => p.userId === currentUser.id);
      setProfile(userProfile || null);
    }
  }, [router]);

  const handleSignOut = () => {
    clearCurrentUser();
    router.push('/');
  };

  if (!user) return null;

  const isHost = user.role === 'host';

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl text-foreground">{t.dashboard}</h1>
              <p className="mt-1 text-muted-foreground">Welcome back, {user.firstName}!</p>
            </div>
            <Button
              className="flex items-center gap-2 bg-transparent"
              onClick={handleSignOut}
              variant="outline"
            >
              <LogOut className="h-4 w-4" />
              {t.signOut}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Summary Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Profile</CardTitle>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      className="flex items-center gap-2"
                      href={isHost ? '/register/host' : '/register/guest'}
                    >
                      <Edit className="h-4 w-4" />
                      {t.edit}
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  {isHost ? 'Host' : 'Guest'} • {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Name</p>
                    <p className="text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground text-sm">Age</p>
                    <p className="text-foreground">{user.age} years</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Phone</p>
                      <p className="text-foreground">{user.phone}</p>
                    </div>
                  )}
                </div>

                {profile && (
                  <div className="space-y-3 border-border border-t pt-4">
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Location</p>
                      <p className="text-foreground">
                        {profile.city}
                        {profile.district && `, ${profile.district}`}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-muted-foreground text-sm">
                        Available Dates
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.availableDates.map((date) => (
                          <Badge className="flex items-center gap-1" key={date} variant="outline">
                            <Calendar className="h-3 w-3" />
                            {t[date as keyof typeof t] || date}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-muted-foreground text-sm">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isHost && (profile as HostProfile).capacity && (
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Capacity</p>
                        <p className="flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4" />
                          {(profile as HostProfile).capacity} guests
                        </p>
                      </div>
                    )}
                    {!isHost && (profile as GuestProfile).groupSize && (
                      <div>
                        <p className="font-medium text-muted-foreground text-sm">Group Size</p>
                        <p className="flex items-center gap-2 text-foreground">
                          <Users className="h-4 w-4" />
                          {(profile as GuestProfile).groupSize} people
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!profile && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-muted-foreground text-sm">
                      Complete your profile to start connecting with others
                    </p>
                    <Button asChild className="mt-3" size="sm">
                      <Link href={isHost ? '/register/host' : '/register/guest'}>
                        Complete Profile
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification & Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Verification & Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email</span>
                    </div>
                    {user.emailVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <Badge className="text-xs" variant="outline">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Phone</span>
                    </div>
                    {user.phoneVerified ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <Badge className="text-xs" variant="outline">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="border-border border-t pt-4">
                  <p className="mb-2 font-medium text-muted-foreground text-sm">
                    {t.completedMeetups}
                  </p>
                  <p className="font-bold text-3xl text-foreground">{user.completedMeetupsCount}</p>
                  {user.completedMeetupsCount === 0 && (
                    <p className="mt-1 text-muted-foreground text-xs">{t.newThisSeason}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetups Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t.upcomingMeetups}</CardTitle>
              <CardDescription>Your scheduled holiday celebrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No upcoming meetups yet. Browse {isHost ? 'guests' : 'hosts'} and send
                  invitations!
                </p>
                <Button asChild className="mt-4">
                  <Link href={isHost ? '/browse/guests' : '/browse/hosts'}>
                    {isHost ? t.browseGuests : t.browseHosts}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
