import {
  Calendar,
  Cigarette,
  Dog,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Doc, Id } from '../../convex/_generated/dataModel';

interface ListingCardProps {
  profile: Doc<'profiles'>;
  onInvite?: (userId: Id<'users'>) => void;
}

export function ListingCard({ profile, onInvite }: ListingCardProps) {
  const isHost = profile.role === 'host' || profile.role === 'both';
  const isGuest = profile.role === 'guest' || profile.role === 'both';

  // Build preference icons
  const preferenceIcons = [];
  if (profile.drinkingAllowed)
    preferenceIcons.push({ icon: Wine, label: 'Alcohol OK', color: 'text-purple-500' });
  if (profile.smokingAllowed)
    preferenceIcons.push({ icon: Cigarette, label: 'Smoking OK', color: 'text-gray-500' });
  if (profile.petsAllowed || profile.hasPets)
    preferenceIcons.push({
      icon: Dog,
      label: profile.hasPets ? 'Has pets' : 'Pets OK',
      color: 'text-amber-500',
    });

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        className="relative block h-48 overflow-hidden bg-gray-200"
        to={`/profile/${profile.userId}`}
      >
        <img
          alt={profile.firstName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={
            profile.photoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
          }
        />
        {profile.verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 font-medium text-green-700 text-xs shadow-sm backdrop-blur-sm">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </div>
        )}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="font-bold text-white text-xl">
            {profile.firstName}
            {!isHost && profile.age ? `, ${profile.age}` : ''}
          </h3>
          <div className="flex items-center text-sm text-white/90">
            <MapPin className="mr-1 h-3 w-3" />
            {profile.city}
          </div>
        </div>
      </Link>

      <div className="flex flex-grow flex-col gap-3 p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {isHost && (
            <span className="flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 font-medium text-purple-700 text-xs uppercase tracking-wider">
              <Users className="h-3 w-3" /> Host ({profile.capacity ?? '?'})
            </span>
          )}
          {isGuest && (
            <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 text-xs uppercase tracking-wider">
              <User className="h-3 w-3" /> Guest
            </span>
          )}
          {isHost && profile.concept && (
            <span className="rounded-md bg-orange-50 px-2 py-1 font-medium text-orange-700 text-xs">
              {profile.concept}
            </span>
          )}
        </div>

        {/* Bio */}
        <Link className="block" to={`/profile/${profile.userId}`}>
          <p className="line-clamp-2 text-gray-600 text-sm italic transition-colors hover:text-gray-900">
            "{profile.bio}"
          </p>
        </Link>

        {/* Vibes */}
        {profile.vibes.length > 0 && (
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
            <div className="flex flex-wrap gap-1">
              {profile.vibes.slice(0, 3).map((vibe) => (
                <span
                  className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-purple-600 text-xs"
                  key={vibe}
                >
                  {vibe}
                </span>
              ))}
              {profile.vibes.length > 3 && (
                <span className="text-gray-400 text-xs">+{profile.vibes.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Dietary */}
        {profile.dietaryInfo.length > 0 && (
          <div className="flex items-start gap-2">
            <UtensilsCrossed className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <span className="text-gray-600 text-xs">
              {profile.dietaryInfo.slice(0, 3).join(', ')}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="mt-auto space-y-2">
          <div className="flex items-start gap-2 text-gray-500 text-sm">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <div className="flex flex-wrap gap-1">
              {profile.availableDates.map((d) => (
                <span className="rounded bg-gray-100 px-1.5 text-gray-700 text-xs" key={d}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-500 text-sm">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span className="text-xs">{profile.languages.join(', ')}</span>
          </div>

          {/* Preference Icons */}
          {preferenceIcons.length > 0 && (
            <div className="flex items-center gap-3">
              {preferenceIcons.map(({ icon: Icon, label, color }) => (
                <div className={`flex items-center gap-1 ${color}`} key={label} title={label}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-2 border-gray-100 border-t p-4">
        <Link
          className="flex-1 rounded-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700 text-sm transition-colors hover:bg-gray-100"
          to={`/profile/${profile.userId}`}
        >
          View Details
        </Link>
        {onInvite && (
          <button
            className="flex-1 rounded-lg border border-red-600 bg-white px-4 py-2 font-medium text-red-600 text-sm transition-colors hover:bg-red-600 hover:text-white"
            onClick={() => onInvite(profile.userId)}
            type="button"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
