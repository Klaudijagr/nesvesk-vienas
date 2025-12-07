"use client";

import { useQuery } from "convex/react";
import {
  Calendar,
  CalendarCheck,
  Clock,
  MapPin,
  PartyPopper,
  Plus,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export default function EventsPage() {
  const myEvents = useQuery(api.events.getMyEvents);
  const isLoading = myEvents === undefined;

  const hostingEvents = myEvents?.hosting ?? [];
  const attendingEvents = myEvents?.attending ?? [];
  const totalEvents = hostingEvents.length + attendingEvents.length;

  return (
    <div className="h-full overflow-y-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
        <p className="text-muted-foreground text-sm">
          Events you're hosting and attending
        </p>
        <Link href="/events/create">
          <Button className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                className="h-48 animate-pulse rounded-xl border border-gray-100 bg-white"
                key={i}
              >
                <div className="p-4">
                  <div className="h-5 w-1/2 rounded bg-gray-200" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && totalEvents === 0 && (
          <div className="rounded-xl border-2 border-gray-300 border-dashed bg-white py-16 text-center">
            <PartyPopper className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-semibold text-gray-900 text-lg">
              No events yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-gray-500 text-sm">
              Create your first event to start inviting guests for the holidays,
              or browse hosts to find events to attend.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/events/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline">Browse Hosts</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Events I'm Hosting */}
        {!isLoading && hostingEvents.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg">
              <CalendarCheck className="h-5 w-5 text-green-600" />
              Events I'm Hosting ({hostingEvents.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {hostingEvents.map((event) => (
                <EventCard event={event} isHost key={event._id} />
              ))}
            </div>
          </section>
        )}

        {/* Events I'm Attending */}
        {!isLoading && attendingEvents.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              Events I'm Attending ({attendingEvents.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {attendingEvents.map((event) => (
                <EventCard event={event} key={event._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type EventCardProps = {
  event: {
    _id: string;
    title?: string;
    eventDate: string;
    time?: string;
    address?: string;
    guestIds: string[];
    hostProfile?: {
      firstName: string;
      photoUrl?: string;
      city: string;
    } | null;
    guestProfiles?: Array<{
      firstName: string;
      photoUrl?: string;
    } | null>;
  };
  isHost?: boolean;
};

function EventCard({ event, isHost }: EventCardProps) {
  const guestCount = event.guestIds.length;

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {event.title || `${event.eventDate} Celebration`}
            </h3>
            {!isHost && event.hostProfile && (
              <p className="mt-0.5 text-gray-500 text-sm">
                Hosted by {event.hostProfile.firstName}
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-2.5 py-1 font-medium text-xs ${
              isHost ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            {isHost ? "Hosting" : "Attending"}
          </span>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{event.eventDate}</span>
            {event.time && (
              <>
                <span className="text-gray-300">|</span>
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{event.time}</span>
              </>
            )}
          </div>
          {event.address && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {guestCount === 0
                ? "No guests yet"
                : `${guestCount} guest${guestCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {/* Guests Preview */}
        {event.guestProfiles && event.guestProfiles.length > 0 && (
          <div className="-space-x-2 mt-4 flex">
            {event.guestProfiles.slice(0, 4).map((guest, i) =>
              guest ? (
                <div
                  className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                  key={guest.firstName + i}
                >
                  <Image
                    alt={guest.firstName}
                    className="object-cover"
                    fill
                    sizes="32px"
                    src={
                      guest.photoUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${guest.firstName}`
                    }
                  />
                </div>
              ) : null
            )}
            {event.guestProfiles.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 font-medium text-gray-600 text-xs">
                +{event.guestProfiles.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Host Avatar for attending events */}
        {!isHost && event.hostProfile && (
          <div className="mt-4 flex items-center gap-2 border-gray-100 border-t pt-4">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100">
              <Image
                alt={event.hostProfile.firstName}
                className="object-cover"
                fill
                sizes="32px"
                src={
                  event.hostProfile.photoUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${event.hostProfile.firstName}`
                }
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {event.hostProfile.firstName}
              </p>
              <p className="text-gray-500 text-xs">{event.hostProfile.city}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
