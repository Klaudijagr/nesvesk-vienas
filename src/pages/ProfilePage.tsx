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
    if (!id || !selectedDate) return;

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
    if (!id || !message.trim()) return;

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
        <Button onClick={() => navigate('/browse')}>Browse profiles</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-red-100 to-orange-100">
                <img
                  src={
                    profile.photoUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}&backgroundColor=f87171`
                  }
                  alt={profile.firstName}
                  className="w-full h-full object-cover"
                />
                {profile.verified && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-green-700 shadow">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
                  </div>
                )}
              </div>

              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.firstName}
                      {profile.lastName && ` ${profile.lastName}`}
                      {profile.age && (
                        <span className="text-gray-500 font-normal">, {profile.age}</span>
                      )}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.city}
                      </span>
                      {profile.lastActive && (
                        <span className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4" />
                          Active recently
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isHost && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Host
                      </span>
                    )}
                    {(profile.role === 'guest' || profile.role === 'both') && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
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
                  <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <span
                        key={lang}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Dates */}
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Available Dates
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.availableDates.map((date) => (
                      <span
                        key={date}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                {profile.dietaryInfo.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Dietary Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.dietaryInfo.map((diet) => (
                        <span
                          key={diet}
                          className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm"
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
                    <h3 className="font-medium text-gray-900 mb-2">Vibes</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.vibes.map((vibe) => (
                        <span
                          key={vibe}
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {profile.smokingAllowed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    Smoking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {profile.drinkingAllowed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    Alcohol
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {profile.petsAllowed ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                    Pets welcome
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {profile.hasPets ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
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
                        <h4 className="text-sm text-gray-500 mb-1">Event Type</h4>
                        <p className="font-medium">{profile.concept}</p>
                      </div>
                    )}
                    {profile.capacity && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Capacity</h4>
                        <p className="font-medium">{profile.capacity} guests</p>
                      </div>
                    )}
                  </div>

                  {profile.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.houseRules.length > 0 && (
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">House Rules</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.houseRules.map((rule) => (
                          <span
                            key={rule}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
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
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-green-700">You're matched!</p>
                      <p className="text-sm text-green-600 mt-1">You can now message each other</p>
                    </div>
                  ) : (
                    <>
                      {/* Send Invitation */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Send an invitation for:</p>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
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
                          onClick={handleSendInvitation}
                          disabled={!selectedDate || isSending}
                        >
                          {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
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
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a message..."
                            className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowMessageBox(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={handleSendMessage}
                              disabled={!message.trim() || isSending}
                            >
                              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowMessageBox(true)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
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
                  <p className="text-gray-600 mb-4">Sign in to connect with {profile.firstName}</p>
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
                  <p className="text-gray-600 mb-4">This is your profile</p>
                  <Link to="/register">
                    <Button variant="outline" className="w-full">
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
