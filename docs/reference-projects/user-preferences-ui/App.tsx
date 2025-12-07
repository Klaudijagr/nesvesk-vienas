import type React from "react";
import { useState } from "react";
import PreferenceCard from "./components/PreferenceCard";
import type { PreferenceOption } from "./types";

// Define the data for the cards
const hostingOptions: PreferenceOption[] = [
  {
    id: "can-host",
    title: "Can host",
    description: "I am eager to let people stay with me",
    iconType: "check",
  },
  {
    id: "may-host",
    title: "May host",
    description: "I might be able to host, depending on the circumstances",
    iconType: "question",
  },
  {
    id: "cant-host",
    title: "Can't host",
    description: "I'm not able to host travelers at the moment",
    iconType: "x",
  },
];

const meetupOptions: PreferenceOption[] = [
  {
    id: "wants-meet",
    title: "Wants to meet",
    description: "I'm eager to meet up with others",
    iconType: "check",
  },
  {
    id: "open-meet",
    title: "Open to meet",
    description: "I might meet up, depending on the circumstances",
    iconType: "question",
  },
  {
    id: "cant-meet",
    title: "Can't meet",
    description: "I prefer not to meet up with others",
    iconType: "x",
  },
];

const App: React.FC = () => {
  // State for selections. Defaults set to match a likely initial state or none.
  // The screenshot had "Can't host" (right) and "Open to meet" (center) active.
  const [hostingStatus, setHostingStatus] = useState<string>("cant-host");
  const [meetupStatus, setMeetupStatus] = useState<string>("open-meet");

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="mb-4 font-bold text-3xl text-gray-800">Preferences</h1>
          <hr className="mb-6 border-teal-500 border-t-2" />
          <p className="font-medium text-gray-600 text-lg">
            Let others know about your hosting and meetup preferences
          </p>
        </div>

        {/* Hosting Status Section */}
        <section className="mb-12">
          <h2 className="mb-6 font-bold text-gray-800 text-xl">
            Hosting status
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {hostingOptions.map((option) => (
              <PreferenceCard
                isSelected={hostingStatus === option.id}
                key={option.id}
                onSelect={setHostingStatus}
                option={option}
              />
            ))}
          </div>
        </section>

        {/* Meetup Status Section */}
        <section>
          <h2 className="mb-6 font-bold text-gray-800 text-xl">
            Meetup status
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {meetupOptions.map((option) => (
              <PreferenceCard
                isSelected={meetupStatus === option.id}
                key={option.id}
                onSelect={setMeetupStatus}
                option={option}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
