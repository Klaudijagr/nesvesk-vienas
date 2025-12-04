import { Calendar, MapPin, MessageCircle, ShieldCheck, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Doc, Id } from '../../convex/_generated/dataModel';

interface ListingCardProps {
  profile: Doc<'profiles'>;
  onInvite?: (userId: Id<'users'>) => void;
}

export function ListingCard({ profile, onInvite }: ListingCardProps) {
  const isHost = profile.role === 'host' || profile.role === 'both';
  const isGuest = profile.role === 'guest' || profile.role === 'both';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
      <Link
        to={`/profile/${profile.userId}`}
        className="block relative h-48 bg-gray-200 overflow-hidden"
      >
        <img
          src={
            profile.photoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`
          }
          alt={profile.firstName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {profile.verified && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-green-700 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-bold text-xl">
            {profile.firstName}
            {!isHost && profile.age ? `, ${profile.age}` : ''}
          </h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {profile.city}
          </div>
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col gap-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {isHost && (
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3" /> Host ({profile.capacity})
            </span>
          )}
          {isGuest && (
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider flex items-center gap-1">
              <User className="w-3 h-3" /> Guest
            </span>
          )}
          {isHost && profile.concept && (
            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium">
              {profile.concept}
            </span>
          )}
        </div>

        {/* Bio */}
        <Link to={`/profile/${profile.userId}`} className="block">
          <p className="text-gray-600 text-sm line-clamp-2 italic hover:text-gray-900 transition-colors">
            "{profile.bio}"
          </p>
        </Link>

        {/* Details */}
        <div className="space-y-2 mt-2">
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mt-0.5 text-red-500" />
            <div className="flex flex-wrap gap-1">
              {profile.availableDates.map((d) => (
                <span key={d} className="bg-gray-100 px-1.5 rounded text-xs text-gray-700">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4 mt-0.5 text-red-500" />
            <span className="text-xs">{profile.languages.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 mt-auto flex gap-2">
        <Link
          to={`/profile/${profile.userId}`}
          className="flex-1 bg-gray-50 text-gray-700 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        >
          View Details
        </Link>
        {onInvite && (
          <button
            type="button"
            onClick={() => onInvite(profile.userId)}
            className="flex-1 bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
