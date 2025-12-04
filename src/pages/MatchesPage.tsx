import { useQuery } from 'convex/react';
import {
  Calendar,
  Copy,
  Gift,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  User,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function MatchesPage() {
  const matches = useQuery(api.invitations.getMatches);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (matches === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Gift className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Christmas Matches</h1>
          <p className="text-gray-600 mt-2">
            Your confirmed holiday connections - contact info revealed!
          </p>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No matches yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                When someone accepts your invitation (or you accept theirs), they'll appear here
                with their full contact details.
              </p>
              <Link to="/browse">
                <Button>Browse Profiles</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <Card key={match._id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{match.date}</span>
                    </div>
                    <span className="text-sm opacity-90">
                      {match.isSender ? 'You invited them' : 'They invited you'}
                    </span>
                  </div>
                </div>

                {match.otherUser && (
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            match.otherUser.photoUrl ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${match.otherUser.firstName}`
                          }
                          alt={match.otherUser.firstName}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {match.otherUser.firstName}
                            {match.otherUser.lastName && ` ${match.otherUser.lastName}`}
                            {match.otherUser.age && (
                              <span className="text-gray-500 font-normal">
                                , {match.otherUser.age}
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            {match.otherUser.city}
                            {match.otherUser.role === 'host' && (
                              <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                Host
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm">{match.otherUser.bio}</p>

                        {/* Contact Info - REVEALED */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                          <h4 className="font-medium text-green-800 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Contact Information
                          </h4>

                          {match.otherUser.phone && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-4 h-4 text-green-600" />
                                <span>{match.otherUser.phone}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(match.otherUser!.phone!)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {match.otherUser.address && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span>{match.otherUser.address}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(match.otherUser!.address!)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {!match.otherUser.phone && !match.otherUser.address && (
                            <p className="text-gray-500 text-sm italic">
                              No contact details provided yet. Send them a message!
                            </p>
                          )}
                        </div>

                        {/* Host-specific info */}
                        {match.otherUser.role === 'host' && (
                          <div className="flex flex-wrap gap-2 text-sm">
                            {match.otherUser.concept && (
                              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                                {match.otherUser.concept}
                              </span>
                            )}
                            {match.otherUser.capacity && (
                              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                {match.otherUser.capacity} guests
                              </span>
                            )}
                          </div>
                        )}

                        {/* Languages */}
                        <div className="flex flex-wrap gap-2">
                          {match.otherUser.languages.map((lang) => (
                            <span
                              key={lang}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        <Link to={`/profile/${match.otherUser.userId}`}>
                          <Button variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                        <Link to={`/dashboard?chat=${match.otherUser.userId}`}>
                          <Button className="w-full gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Tips */}
        {matches.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Tips for a great celebration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Reach out to confirm the time and any last-minute details
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Discuss dietary requirements and what each person will bring
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Exchange phone numbers in case of day-of coordination
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Have fun and make new memories together!
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
