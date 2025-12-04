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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Gift className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-bold text-3xl text-gray-900">Christmas Matches</h1>
          <p className="mt-2 text-gray-600">
            Your confirmed holiday connections - contact info revealed!
          </p>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 font-medium text-gray-900 text-xl">No matches yet</h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500">
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
              <Card className="overflow-hidden" key={match._id}>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{match.date}</span>
                    </div>
                    <span className="text-sm opacity-90">
                      {match.isSender ? 'You invited them' : 'They invited you'}
                    </span>
                  </div>
                </div>

                {match.otherUser && (
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        <img
                          alt={match.otherUser.firstName}
                          className="h-24 w-24 rounded-xl object-cover"
                          src={
                            match.otherUser.photoUrl ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${match.otherUser.firstName}`
                          }
                        />
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl">
                            {match.otherUser.firstName}
                            {match.otherUser.lastName && ` ${match.otherUser.lastName}`}
                            {match.otherUser.age && (
                              <span className="font-normal text-gray-500">
                                , {match.otherUser.age}
                              </span>
                            )}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {match.otherUser.city}
                            {match.otherUser.role === 'host' && (
                              <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-700 text-xs">
                                Host
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm">{match.otherUser.bio}</p>

                        {/* Contact Info - REVEALED */}
                        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                          <h4 className="flex items-center gap-2 font-medium text-green-800">
                            <User className="h-4 w-4" />
                            Contact Information
                          </h4>

                          {match.otherUser.phone && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span>{match.otherUser.phone}</span>
                              </div>
                              <button
                                className="text-green-600 hover:text-green-700"
                                onClick={() => copyToClipboard(match.otherUser!.phone!)}
                                type="button"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {match.otherUser.address && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span>{match.otherUser.address}</span>
                              </div>
                              <button
                                className="text-green-600 hover:text-green-700"
                                onClick={() => copyToClipboard(match.otherUser!.address!)}
                                type="button"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {!(match.otherUser.phone || match.otherUser.address) && (
                            <p className="text-gray-500 text-sm italic">
                              No contact details provided yet. Send them a message!
                            </p>
                          )}
                        </div>

                        {/* Host-specific info */}
                        {match.otherUser.role === 'host' && (
                          <div className="flex flex-wrap gap-2 text-sm">
                            {match.otherUser.concept && (
                              <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                                {match.otherUser.concept}
                              </span>
                            )}
                            {match.otherUser.capacity && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                                {match.otherUser.capacity} guests
                              </span>
                            )}
                          </div>
                        )}

                        {/* Languages */}
                        <div className="flex flex-wrap gap-2">
                          {match.otherUser.languages.map((lang) => (
                            <span
                              className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-xs"
                              key={lang}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        <Link to={`/profile/${match.otherUser.userId}`}>
                          <Button className="w-full" variant="outline">
                            View Profile
                          </Button>
                        </Link>
                        <Link to={`/dashboard?chat=${match.otherUser.userId}`}>
                          <Button className="w-full gap-2">
                            <MessageCircle className="h-4 w-4" />
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
              <ul className="space-y-2 text-gray-600 text-sm">
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
