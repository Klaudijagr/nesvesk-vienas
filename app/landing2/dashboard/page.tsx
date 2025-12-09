"use client";

import { Coffee, MapPin, Music, TreePine, Users } from "lucide-react";

export default function CommunityDashboard() {
  const neighbors = [
    {
      id: 1,
      name: "The Petrovs",
      activity: "Caroling Night",
      dist: "0.2 km",
      icon: Music,
    },
    {
      id: 2,
      name: "Community Center",
      activity: "Potluck Dinner",
      dist: "0.5 km",
      icon: Users,
    },
    {
      id: 3,
      name: "Anna's Place",
      activity: "Hot Cocoa & Chill",
      dist: "0.8 km",
      icon: Coffee,
    },
    {
      id: 4,
      name: "Old Town Hall",
      activity: "Tree Lighting",
      dist: "1.2 km",
      icon: TreePine,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f0f4f8] text-[#0a2342]">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-[#0a2342] text-xl tracking-tight">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Nešvęsk vienas
        </div>
        <div className="flex gap-6 font-medium text-gray-500 text-sm">
          <span className="border-amber-400 border-b-2 text-[#0a2342]">
            Neighbors
          </span>
          <span>Map View</span>
          <span>My Plans</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-100" />
      </nav>

      {/* Hero / Greeting */}
      <div className="bg-[#0a2342] px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 font-bold text-3xl">Good Evening, Traveler.</h1>
          <p className="text-blue-200">
            There are 4 gatherings happening near you tonight.
          </p>
        </div>
      </div>

      {/* Main Content Area - overlapping the blue header */}
      <div className="-mt-8 mx-auto max-w-4xl px-6 pb-12">
        {/* Filter Chips */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {["All", "Food", "Music", "Games", "Quiet"].map((f, i) => (
            <button
              className={`rounded-full px-5 py-2 font-semibold text-sm shadow-sm transition-transform hover:scale-105 ${i === 0 ? "bg-amber-400 text-[#0a2342]" : "bg-white text-gray-600"}`}
              key={f}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>

        {/* List of "Houses" */}
        <div className="space-y-4">
          {neighbors.map((n) => (
            <div
              className="group hover:-translate-y-1 flex flex-col items-start justify-between rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg hover:ring-2 hover:ring-amber-200 sm:flex-row sm:items-center"
              key={n.id}
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-[#0a2342] group-hover:text-white">
                  <n.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="inline-block border-transparent border-b font-bold text-[#0a2342] text-lg leading-tight group-hover:border-amber-400">
                    {n.activity}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-gray-500 text-sm">
                    <span>Hosted by {n.name}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-0.5 text-blue-400">
                      <MapPin className="h-3 w-3" />
                      {n.dist}
                    </span>
                  </p>
                </div>
              </div>

              <button
                className="mt-4 rounded-lg border-2 border-[#0a2342] px-6 py-2 font-bold text-[#0a2342] text-sm opacity-0 transition-opacity hover:bg-[#0a2342] hover:text-white group-hover:opacity-100 sm:mt-0"
                type="button"
              >
                Say Hello
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
