'use client';

import {
  Baby,
  Calendar,
  CheckCircle2,
  Dog,
  Mail,
  Phone,
  Users,
  Utensils,
  Wine,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';
import { useTranslation } from '@/lib/i18n';
import type { GuestProfile, HostProfile, User } from '@/lib/types';

interface ProfileCardProps {
  user: User;
  profile: HostProfile | GuestProfile;
  type: 'host' | 'guest';
  onInvite?: () => void;
}

export function ProfileCard({ user, profile, type, onInvite }: ProfileCardProps) {
  const { locale } = useLocale();
  const t = useTranslation(locale);

  const isHost = type === 'host';
  const hostProfile = isHost ? (profile as HostProfile) : null;
  const guestProfile = isHost ? null : (profile as GuestProfile);

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with name and age */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-xl">
                {user.firstName} {getInitial(user.lastName)}.
              </h3>
              <p className="text-muted-foreground text-sm">{user.age} years old</p>
            </div>
            <div className="flex flex-col gap-1">
              {user.emailVerified && (
                <Badge
                  className="flex items-center gap-1 bg-accent text-accent-foreground"
                  variant="default"
                >
                  <Mail className="h-3 w-3" />
                  {t.emailVerified}
                </Badge>
              )}
              {user.phoneVerified && (
                <Badge
                  className="flex items-center gap-1 bg-accent text-accent-foreground"
                  variant="default"
                >
                  <Phone className="h-3 w-3" />
                  {t.phoneVerified}
                </Badge>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="font-medium text-foreground text-sm">
              {profile.city}
              {profile.district && `, ${profile.district}`}
            </p>
          </div>

          {/* Dates Available */}
          <div className="flex flex-wrap gap-2">
            {profile.availableDates.map((date) => (
              <Badge className="flex items-center gap-1" key={date} variant="outline">
                <Calendar className="h-3 w-3" />
                {t[date as keyof typeof t] || date}
              </Badge>
            ))}
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang) => (
              <Badge key={lang} variant="secondary">
                {lang.toUpperCase()}
              </Badge>
            ))}
          </div>

          {/* Dietary & Alcohol (Host only) */}
          {isHost && hostProfile && (
            <div className="space-y-2">
              {hostProfile.dietary.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hostProfile.dietary.map((diet) => (
                    <Badge className="flex items-center gap-1" key={diet} variant="outline">
                      <Utensils className="h-3 w-3" />
                      {t[diet as keyof typeof t] || diet}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge className="flex items-center gap-1" variant="outline">
                  <Wine className="h-3 w-3" />
                  {
                    t[
                      hostProfile.alcoholPolicy === 'none'
                        ? 'noAlcohol'
                        : hostProfile.alcoholPolicy === 'light'
                          ? 'lightAlcohol'
                          : 'alcoholAllowed'
                    ]
                  }
                </Badge>
              </div>
            </div>
          )}

          {/* Dietary (Guest) */}
          {!isHost && guestProfile && guestProfile.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {guestProfile.dietary.map((diet) => (
                <Badge className="flex items-center gap-1" key={diet} variant="outline">
                  <Utensils className="h-3 w-3" />
                  {t[diet as keyof typeof t] || diet}
                </Badge>
              ))}
            </div>
          )}

          {/* Atmosphere */}
          <div>
            <Badge variant="default">
              {
                t[
                  isHost
                    ? hostProfile!.atmosphere === 'quiet'
                      ? 'quietDinner'
                      : hostProfile!.atmosphere === 'games'
                        ? 'boardGames'
                        : 'livelySocial'
                    : guestProfile!.lookingFor === 'quiet'
                      ? 'quietDinner'
                      : guestProfile!.lookingFor === 'games'
                        ? 'boardGames'
                        : 'livelySocial'
                ]
              }
            </Badge>
          </div>

          {/* Pets and Kids (Host) / Group Size (Guest) */}
          <div className="flex flex-wrap gap-2">
            {isHost && hostProfile && (
              <>
                {hostProfile.hasPets && (
                  <Badge className="flex items-center gap-1" variant="outline">
                    <Dog className="h-3 w-3" />
                    Pets at home
                  </Badge>
                )}
                {hostProfile.hasKids && (
                  <Badge className="flex items-center gap-1" variant="outline">
                    <Baby className="h-3 w-3" />
                    Kids at event
                  </Badge>
                )}
                {hostProfile.capacity && (
                  <Badge className="flex items-center gap-1" variant="outline">
                    <Users className="h-3 w-3" />
                    Capacity: {hostProfile.capacity}
                  </Badge>
                )}
              </>
            )}
            {!isHost && guestProfile && (
              <Badge className="flex items-center gap-1" variant="outline">
                <Users className="h-3 w-3" />
                Group: {guestProfile.groupSize}
              </Badge>
            )}
          </div>

          {/* Completed Meetups */}
          <div className="pt-2">
            {user.completedMeetupsCount > 0 ? (
              <p className="flex items-center gap-1 text-muted-foreground text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {user.completedMeetupsCount} {t.completedMeetups}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">{t.newThisSeason}</p>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-3 text-muted-foreground text-sm">{profile.description}</p>

          {/* Action Button */}
          <Button className="w-full" onClick={onInvite}>
            {isHost ? t.askToJoin : t.invite}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
