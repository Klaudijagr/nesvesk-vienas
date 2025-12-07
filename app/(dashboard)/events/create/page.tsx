"use client";

import { useMutation } from "convex/react";
import { ArrowLeft, Calendar, Clock, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { HOLIDAY_DATES } from "@/lib/types";

type HolidayDate = "24 Dec" | "25 Dec" | "26 Dec" | "31 Dec";

export default function CreateEventPage() {
  const router = useRouter();
  const createEvent = useMutation(api.events.createEvent);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    eventDate: "" as HolidayDate | "",
    time: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventDate) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent({
        eventDate: formData.eventDate as HolidayDate,
        title: formData.title || undefined,
        time: formData.time || undefined,
        address: formData.address || undefined,
        notes: formData.notes || undefined,
      });
      router.push("/events");
    } catch (error) {
      toast.error(
        `Failed to create event: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              href="/events"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="font-bold text-gray-900 text-xl">Create Event</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Event Details</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title (optional)</Label>
                <Input
                  className="mt-1.5"
                  id="title"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Christmas Dinner, New Year's Eve Party"
                  value={formData.title}
                />
                <p className="mt-1 text-gray-500 text-xs">
                  Leave blank to use the date as the title
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2" htmlFor="date">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  Date *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      eventDate: value as HolidayDate,
                    }))
                  }
                  value={formData.eventDate}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOLIDAY_DATES.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2" htmlFor="time">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Time (optional)
                </Label>
                <Input
                  className="mt-1.5"
                  id="time"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  type="time"
                  value={formData.time}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Location</h2>

            <div>
              <Label className="flex items-center gap-2" htmlFor="address">
                <MapPin className="h-4 w-4 text-gray-400" />
                Address (optional)
              </Label>
              <Input
                className="mt-1.5"
                id="address"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter the event address"
                value={formData.address}
              />
              <p className="mt-1 text-gray-500 text-xs">
                This will be shared with confirmed guests only
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900">
              Additional Info
            </h2>

            <div>
              <Label className="flex items-center gap-2" htmlFor="notes">
                <FileText className="h-4 w-4 text-gray-400" />
                Notes (optional)
              </Label>
              <Textarea
                className="mt-1.5 min-h-[120px]"
                id="notes"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes for your guests (e.g., what to bring, house rules, parking info)"
                value={formData.notes}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link className="flex-1" href="/events">
              <Button className="w-full" type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              className="flex-1"
              disabled={isSubmitting || !formData.eventDate}
              type="submit"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
