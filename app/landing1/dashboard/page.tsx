"use client";

import { Search, Sparkles, User } from "lucide-react";

export default function MagicDashboard() {
  const windows = [
    {
      id: 1,
      name: "Maria",
      desc: "Warm tea & stories",
      color: "bg-amber-100/10",
    },
    {
      id: 2,
      name: "Jonas",
      desc: "Christmas Eve Dinner",
      color: "bg-orange-100/10",
    },
    {
      id: 3,
      name: "Elara",
      desc: "Board games night",
      color: "bg-blue-100/10",
    },
    { id: 4, name: "Family R.", desc: "Open house", color: "bg-yellow-100/10" },
    { id: 5, name: "Sarah", desc: "Baking cookies", color: "bg-red-100/10" },
    { id: 6, name: "Tom", desc: "Movie marathon", color: "bg-purple-100/10" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-white selection:bg-amber-500/30">
      {/* Navbar Overlay */}
      <div className="sticky top-0 z-50 border-white/10 border-b bg-[#0F172A]/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-amber-100">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold font-serif text-xl">MagicWindows</span>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-white/10" />
            <div className="h-8 w-8 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 bg-gradient-to-r from-amber-100 to-amber-200 bg-clip-text font-serif text-4xl text-transparent">
            Pick a Window to Peek Inside
          </h2>
          <p className="text-blue-200/60">Find the light that calls to you.</p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-16 flex max-w-md items-center rounded-full border border-white/10 bg-white/5 px-4 py-3 ring-1 ring-white/5 focus-within:ring-amber-200/50">
          <Search className="mr-3 h-5 w-5 text-gray-400" />
          <input
            className="w-full bg-transparent text-sm placeholder:text-gray-500 focus:outline-none"
            placeholder="Find a celebration nearby..."
            type="text"
          />
        </div>

        {/* The Grid of Windows */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {windows.map((w) => (
            <div
              className="group hover:-translate-y-2 relative h-64 cursor-pointer overflow-hidden rounded-t-[100px] border-white/5 border-b-8 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.15)]"
              key={w.id}
            >
              {/* Window Frame Glow */}
              <div className="absolute inset-0 rounded-t-[100px] border border-white/10 opacity-50 transition-opacity group-hover:border-amber-200/30 group-hover:opacity-100" />

              {/* Interior Light */}
              <div
                className={`absolute inset-x-8 top-12 bottom-0 ${w.color} blur-2xl transition-all group-hover:bg-amber-200/20`}
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col items-center justify-end pb-8 text-center">
                <div className="mb-3 rounded-full border border-white/20 bg-black/30 p-3 backdrop-blur-sm">
                  <User className="h-6 w-6 text-amber-100" />
                </div>
                <h3 className="mb-1 font-medium font-serif text-amber-50 text-xl">
                  {w.name}
                </h3>
                <p className="text-blue-100/70 text-sm">{w.desc}</p>

                <div className="mt-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-amber-200 text-xs uppercase tracking-widest">
                    Knock to enter
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
