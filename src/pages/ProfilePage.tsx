import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Globe,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();

  const profile = useQuery(api.profiles.getProfile, id ? { userId: id as Id<'users'> } : 'skip');
  const myProfile = useQuery(api.profiles.getMyProfile);
  const areMatched = useQuery(
    api.invitations.areMatched,
    id ? { otherUserId: id as Id<'users'> } : 'skip',
  );

  const sendInvitation = useMutation(api.invitations.send);
  const sendMessage = useMutation(api.messages.send);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const isOwnProfile = myProfile?.userId === id;
  const isHost = profile?.role === 'host' || profile?.role === 'both';

  const handleSendInvitation = async () => {
    if (!(id && selectedDate)) return;

    setIsSending(true);
    try {
      await sendInvitation({
        toUserId: id as Id<'users'>,
        date: selectedDate as '24 Dec' | '25 Dec' | '26 Dec' | '31 Dec',
      });
      alert('Invitation sent!');
      setSelectedDate('');
    } catch {
      alert('Failed to send invitation. You may have already sent one.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!(id && message.trim())) return;

    setIsSending(true);
    try {
      await sendMessage({
        receiverId: id as Id<'users'>,
        content: message.trim(),
      });
      setMessage('');
      setShowMessageBox(false);
      alert('Message sent!');
    } catch {
      alert('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl text-gray-900">Profile not found</h1>
        <Button onClick={() => navigate('/browse')}>Browse profiles</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Back button */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hero Card */}
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-red-100 to-orange-100">
                <img
                  alt={profile.firstName}
                  className="h-full w-full object-cover"
                  src={
                    profile.photoUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}&backgroundColor=f87171`
                  }
                />
                {profile.verified && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 font-medium text-green-700 text-sm shadow backdrop-blur-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </div>
                )}
              </div>

              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-bold text-3xl text-gray-900">
                      {profile.firstName}
                      {profile.lastName && ` ${profile.lastName}`}
                      {profile.age && (
                        <span className="font-normal text-gray-500">, {profile.age}</span>
                      )}
                    </h1>
                    <div className="mt-2 flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.city}
                      </span>
                      {profile.lastActive && (
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4" />
                          Active recently
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isHost && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700 text-sm">
                        <Users className="h-4 w-4" />
                        Host
                      </span>
                    )}
                    {(profile.role === 'guest' || profile.role === 'both') && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                        Guest
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">{profile.bio}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Languages */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                    <Globe className="h-4 w-4 text-gray-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <span
                        className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-sm"
                        key={lang}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Dates */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Available Dates
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.availableDates.map((date) => (
                      <span
                        className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 text-sm"
                        key={date}
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                {profile.dietaryInfo.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">Dietary Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.dietaryInfo.map((diet) => (
                        <span
                          className="rounded-full bg-orange-50 px-3 py-1 text-orange-700 text-sm"
                          key={diet}
                        >
                          {diet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vibes */}
                {profile.vibes.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">Vibes</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.vibes.map((vibe) => (
                        <span
                          className="rounded-full bg-purple-50 px-3 py-1 text-purple-700 text-sm"
                          key={vibe}
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    {profile.smokingAllowed ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    Smoking
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    {profile.drinkingAllowed ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    Alcohol
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    {profile.petsAllowed ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    Pets welcome
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    {profile.hasPets ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    Has pets
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Host-specific */}
            {isHost && (profile.concept || profile.capacity || profile.amenities.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Host Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {profile.concept && (
                      <div>
                        <h4 className="mb-1 text-gray-500 text-sm">Event Type</h4>
                        <p className="font-medium">{profile.concept}</p>
                      </div>
                    )}
                    {profile.capacity && (
                      <div>
                        <h4 className="mb-1 text-gray-500 text-sm">Capacity</h4>
                        <p className="font-medium">{profile.capacity} guests</p>
                      </div>
                    )}
                  </div>

                  {profile.amenities.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-gray-500 text-sm">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.amenities.map((amenity) => (
                          <span
                            className="rounded-full bg-green-50 px-3 py-1 text-green-700 text-sm"
                            key={amenity}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.houseRules.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-gray-500 text-sm">House Rules</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.houseRules.map((rule) => (
                          <span
                            className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-sm"
                            key={rule}
                          >
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            {!isOwnProfile && isAuthenticated && (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {areMatched ? (
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <Check className="mx-auto mb-2 h-8 w-8 text-green-600" />
                      <p className="font-medium text-green-700">You're matched!</p>
                      <p className="mt-1 text-green-600 text-sm">You can now message each other</p>
                    </div>
                  ) : (
                    <>
                      {/* Send Invitation */}
                      <div className="space-y-2">
                        <p className="text-gray-600 text-sm">Send an invitation for:</p>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          onChange={(e) => setSelectedDate(e.target.value)}
                          value={selectedDate}
                        >
                          <option value="">Select a date...</option>
                          {profile.availableDates.map((date) => (
                            <option key={date} value={date}>
                              {date}
                            </option>
                          ))}
                        </select>
                        <Button
                          className="w-full"
                          disabled={!selectedDate || isSending}
                          onClick={handleSendInvitation}
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Invitation
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Message */}
                  {(areMatched || !areMatched) && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">or</span>
                        </div>
                      </div>

                      {showMessageBox ? (
                        <div className="space-y-2">
                          <textarea
                            className="h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a message..."
                            value={message}
                          />
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => setShowMessageBox(false)}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1"
                              disabled={!message.trim() || isSending}
                              onClick={handleSendMessage}
                            >
                              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => setShowMessageBox(true)}
                          variant="outline"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Not authenticated */}
            {!isAuthenticated && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">Sign in to connect with {profile.firstName}</p>
                  <Link to={`/login?redirect=/profile/${id}`}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Own profile */}
            {isOwnProfile && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">This is your profile</p>
                  <Link to="/register">
                    <Button className="w-full" variant="outline">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
