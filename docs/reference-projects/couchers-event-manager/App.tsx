import {
  AlertCircle,
  Bell,
  Bold,
  Calendar,
  Clock,
  Github,
  Image as ImageIcon,
  Instagram,
  Italic,
  List,
  Loader2,
  MapPin,
  Menu,
  Plus,
  Search,
  Sparkles,
  Twitter,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { generateEventDescription } from "./services/geminiService";
import type { EventData } from "./types";

// --- Mock Data ---
const MOCK_EVENTS: EventData[] = [
  {
    id: "1",
    title: "Sunset Yoga in the Park",
    startDate: "2023-10-25",
    startTime: "18:00",
    location: "Central Park, NY",
    description:
      "Join us for a relaxing evening of yoga as the sun sets over the city skyline.",
    organizer: "Sarah Jenkins",
    imageUrl: "https://picsum.photos/800/600?random=1",
  },
  {
    id: "2",
    title: "Tech Networking Mixer",
    startDate: "2023-10-28",
    startTime: "19:30",
    location: "The Hive Coworking",
    description:
      "Connect with local developers, designers, and entrepreneurs. Pizza provided!",
    organizer: "DevCommunity",
    imageUrl: "https://picsum.photos/800/600?random=2",
  },
  {
    id: "3",
    title: "Weekend Hiking Trip",
    startDate: "2023-11-04",
    startTime: "08:00",
    location: "Blue Ridge Mountains",
    description:
      "Intermediate difficulty hike. Bring water and good boots. Carpooling available.",
    organizer: "Outdoor Club",
    imageUrl: "https://picsum.photos/800/600?random=3",
  },
];

// --- Main Component ---
export default function App() {
  const [profileComplete, setProfileComplete] = useState<boolean>(false); // Default to incomplete to show feature
  const [showIncompleteModal, setShowIncompleteModal] =
    useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateClick = () => {
    if (profileComplete) {
      setShowCreateModal(true);
    } else {
      setShowIncompleteModal(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900">
      {/* Dev Tool: Profile State Toggle */}
      <div className="fixed right-6 bottom-6 z-50 flex animate-fade-in-up items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <div className="flex flex-col">
          <span className="font-bold text-gray-400 text-xs uppercase tracking-wider">
            Dev Mode
          </span>
          <span className="font-medium text-sm">Profile Status:</span>
        </div>
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            profileComplete ? "bg-emerald-500" : "bg-gray-200"
          }`}
          onClick={() => setProfileComplete(!profileComplete)}
        >
          <span
            className={`${
              profileComplete ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </button>
        <span
          className={`font-semibold text-sm ${profileComplete ? "text-emerald-600" : "text-amber-600"}`}
        >
          {profileComplete ? "Complete" : "Incomplete"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-gray-200 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 font-bold text-white text-xl">
                  C
                </div>
                <span className="hidden font-bold text-gray-800 text-xl tracking-tight sm:block">
                  Couchers.org
                </span>
              </div>

              {/* Desktop Links */}
              <div className="hidden space-x-1 md:flex">
                {[
                  "Dashboard",
                  "Messages",
                  "Search",
                  "Events",
                  "Communities",
                ].map((item) => (
                  <a
                    className={`rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                      item === "Events"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    href="#"
                    key={item}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              <button className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
              </button>

              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-orange-200 bg-orange-100 font-semibold text-orange-700 text-sm">
                JD
              </div>

              <div className="md:hidden">
                <button
                  className="p-2 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-bold text-3xl text-gray-900">Events</h1>
            <p className="mt-1 text-gray-500">
              Discover what's happening in your community or start something
              new.
            </p>
          </div>
          <button
            className="hover:-translate-y-0.5 inline-flex transform items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 font-medium text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md active:translate-y-0"
            onClick={handleCreateClick}
          >
            <Plus className="h-5 w-5" />
            Create Event
          </button>
        </div>

        {/* Filters & Tabs (Visual Only) */}
        <div className="scrollbar-hide mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          <button className="whitespace-nowrap rounded-full bg-gray-900 px-4 py-2 font-medium text-sm text-white">
            All Events
          </button>
          <button className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-600 text-sm hover:bg-gray-50">
            Your Events
          </button>
          <button className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-600 text-sm hover:bg-gray-50">
            Attending
          </button>
          <button className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-600 text-sm hover:bg-gray-50">
            Past Events
          </button>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-gray-200 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">
                About
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Our Mission
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Team
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Forum
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-500 text-sm hover:text-gray-900"
                    href="#"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-400 text-sm uppercase tracking-wider">
                Connect
              </h3>
              <div className="flex gap-4">
                <a className="text-gray-400 hover:text-gray-500" href="#">
                  <Github className="h-5 w-5" />
                </a>
                <a className="text-gray-400 hover:text-gray-500" href="#">
                  <Twitter className="h-5 w-5" />
                </a>
                <a className="text-gray-400 hover:text-gray-500" href="#">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-gray-200 border-t pt-8 text-center text-gray-400 text-sm">
            &copy; 2023 Couchers.org. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showIncompleteModal && (
        <ProfileIncompleteModal
          onClose={() => setShowIncompleteModal(false)}
          onEditProfile={() => {
            setShowIncompleteModal(false);
            setProfileComplete(true); // Simulate completing it
            // In a real app, this would navigate to /profile/edit
          }}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newEvent) => {
            setEvents([newEvent, ...events]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

// --- Sub-Components ---

const EventCard: React.FC<{ event: EventData }> = ({ event }) => (
  <div className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="relative h-48 overflow-hidden">
      <img
        alt={event.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        src={event.imageUrl}
      />
      <div className="absolute top-3 right-3 rounded-md bg-white/90 px-2 py-1 font-semibold text-gray-800 text-xs shadow-sm backdrop-blur-sm">
        {new Date(event.startDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
    <div className="p-5">
      <div className="mb-2 font-semibold text-orange-600 text-xs uppercase tracking-wide">
        {event.location}
      </div>
      <h3 className="mb-2 line-clamp-1 font-bold text-gray-900 text-lg transition-colors group-hover:text-orange-600">
        {event.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-gray-500 text-sm">
        {event.description}
      </p>
      <div className="flex items-center justify-between border-gray-100 border-t pt-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500 text-sm">{event.startTime}</span>
        </div>
        <div className="-space-x-2 flex">
          {[1, 2, 3].map((i) => (
            <img
              alt="Attendee"
              className="h-6 w-6 rounded-full border-2 border-white"
              key={i}
              src={`https://picsum.photos/30/30?random=${i + 10}`}
            />
          ))}
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 font-medium text-[10px] text-gray-500">
            +5
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- MODAL: Profile Incomplete ---

type ProfileIncompleteModalProps = {
  onClose: () => void;
  onEditProfile: () => void;
};

const ProfileIncompleteModal: React.FC<ProfileIncompleteModalProps> = ({
  onClose,
  onEditProfile,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="mb-2 font-bold text-gray-900 text-xl">
            Almost there!
          </h3>
          <p className="mb-6 text-gray-500 text-sm leading-relaxed">
            Before you can create an event, you must{" "}
            <strong>write a bit about yourself</strong> in your profile and{" "}
            <strong>upload a profile photo</strong>.
            <br />
            <br />
            This helps build a trusted community and reduce spam. For more
            information, please refer to this help page. Thank you for your
            help!
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              onClick={onEditProfile}
            >
              Edit your profile now
            </button>
            <button
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              onClick={onClose}
            >
              Never mind
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAL: Create Event ---

type CreateEventModalProps = {
  onClose: () => void;
  onCreate: (event: EventData) => void;
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [_step, _setStep] = useState(1); // 1: Details, 2: Image/Review
  const [formData, setFormData] = useState<Partial<EventData>>({
    title: "",
    startDate: "",
    startTime: "",
    location: "",
    description: "",
  });

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMood, setGenerationMood] = useState("Exciting & Social");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
      return;
    }
    setIsGenerating(true);
    const desc = await generateEventDescription(
      formData.title,
      formData.location || "",
      generationMood
    );
    setFormData((prev) => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: EventData = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title || "Untitled Event",
      startDate: formData.startDate || new Date().toISOString(),
      startTime: formData.startTime || "12:00",
      location: formData.location || "TBD",
      description: formData.description || "",
      organizer: "You",
      imageUrl: `https://picsum.photos/800/600?random=${Math.random()}`,
    };
    onCreate(newEvent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-100 border-b bg-gray-50/50 px-6 py-4">
          <div>
            <h2 className="font-bold text-gray-900 text-xl">Create Event</h2>
            <p className="mt-0.5 text-gray-500 text-xs">
              Share your adventure with the community
            </p>
          </div>
          <button
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Image Upload Placeholder */}
          <div className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-300 border-dashed bg-gray-100 text-gray-400 transition-colors hover:border-orange-300 hover:bg-gray-50">
            <div className="mb-3 rounded-full bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
              <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
            </div>
            <span className="font-medium text-sm">
              Click to upload a cover image
            </span>
            <span className="mt-1 text-xs">Recommended: 1200x600px</span>
          </div>

          <form
            className="space-y-5"
            id="create-event-form"
            onSubmit={handleSubmit}
          >
            {/* Title */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-700 text-sm">
                Event Title
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                name="title"
                onChange={handleInputChange}
                placeholder="e.g., Weekly Potluck Dinner"
                required
                type="text"
                value={formData.title}
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-medium text-gray-700 text-sm">
                  Start Date
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-gray-200 py-2.5 pr-4 pl-10 text-gray-600 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    name="startDate"
                    onChange={handleInputChange}
                    required
                    type="date"
                    value={formData.startDate}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-700 text-sm">
                  Start Time
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-gray-200 py-2.5 pr-4 pl-10 text-gray-600 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    name="startTime"
                    onChange={handleInputChange}
                    required
                    type="time"
                    value={formData.startTime}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 block font-medium text-gray-700 text-sm">
                Location
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-4 pl-10 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  name="location"
                  onChange={handleInputChange}
                  placeholder="e.g., Central Park or Zoom Link"
                  required
                  type="text"
                  value={formData.location}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                Press Enter or click the map icon to confirm address
              </p>
            </div>

            {/* Description Editor */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-200">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-gray-200 border-b bg-white px-3 py-2">
                <div className="flex items-center gap-1">
                  <button
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                    type="button"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                    type="button"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <div className="mx-1 h-4 w-px bg-gray-200" />
                  <button
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* AI Helper Trigger */}
                <div className="flex items-center gap-2">
                  <select
                    className="hidden cursor-pointer border-none bg-transparent text-gray-500 text-xs focus:ring-0 sm:block"
                    onChange={(e) => setGenerationMood(e.target.value)}
                    value={generationMood}
                  >
                    <option>Exciting & Social</option>
                    <option>Professional</option>
                    <option>Relaxed & Chill</option>
                    <option>Adventurous</option>
                  </select>
                  <button
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-all ${
                      isGenerating
                        ? "cursor-wait bg-purple-100 text-purple-700"
                        : formData.title
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-90 hover:shadow-md"
                          : "cursor-not-allowed bg-gray-100 text-gray-400"
                    }`}
                    disabled={isGenerating || !formData.title}
                    onClick={handleAiGenerate}
                    type="button"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {isGenerating ? "Magic..." : "Auto-Write"}
                  </button>
                </div>
              </div>

              <textarea
                className="block w-full resize-none bg-white p-4 text-gray-700 text-sm outline-none"
                name="description"
                onChange={handleInputChange}
                placeholder="Describe your event... What should people expect? What should they bring?"
                rows={6}
                value={formData.description}
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-gray-100 border-t bg-gray-50/50 px-6 py-4">
          <button
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-orange-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-orange-700 hover:shadow-md active:scale-95 active:transform"
            form="create-event-form"
            type="submit"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};
