"use client";

import { ArrowRight, Calendar, Feather, MapPin } from "lucide-react";

export default function InvitationDashboard() {
  const invitations = [
    {
      id: 1,
      title: "Christmas Eve Dinner",
      host: "Elena & Family",
      time: "Dec 24, 18:00",
      loc: "Vilnius Old Town",
      type: "Dinner",
    },
    {
      id: 2,
      title: "Late Night Board Games",
      host: "The Students",
      time: "Dec 25, 20:00",
      loc: "Kaunas Center",
      type: "Social",
    },
    {
      id: 3,
      title: "Winter Walk & Tea",
      host: "Markas",
      time: "Dec 26, 14:00",
      loc: "Vingis Park",
      type: "Outdoor",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#eeeae6] p-6 text-[#2a1b1b] md:p-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-16 flex flex-col items-center justify-between border-[#2a1b1b]/10 border-b pb-8 md:flex-row">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-2 flex items-center gap-2 text-[#8b3a3a]">
              <Feather className="h-5 w-5" />
              <span className="font-bold text-sm uppercase tracking-widest">
                The Registry
              </span>
            </div>
            <h1 className="font-serif text-4xl text-[#2a1b1b] italic">
              Confirmed Gatherings
            </h1>
          </div>

          <div className="mt-6 flex gap-4 md:mt-0">
            <button
              className="border-transparent border-b font-medium text-[#8b3a3a] text-sm transition-all hover:border-[#8b3a3a]"
              type="button"
            >
              My Invitations
            </button>
            <button
              className="rounded-none bg-[#2a1b1b] px-6 py-2 text-sm text-white transition-colors hover:bg-[#8b3a3a]"
              type="button"
            >
              Post Invitation
            </button>
          </div>
        </header>

        {/* The Board */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv) => (
            <div
              className="group relative flex flex-col bg-[#fdfbf7] p-8 shadow-sm transition-all duration-500 hover:shadow-2xl"
              key={inv.id}
            >
              {/* Decorative Corner */}
              <div
                className="absolute top-0 right-0 h-12 w-12 bg-[#eeeae6] transition-all duration-300 group-hover:h-0 group-hover:w-0"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              />
              <div
                className="absolute top-0 right-0 h-12 w-12 bg-[#dcd6d0] shadow-inner transition-all duration-300 group-hover:scale-0"
                style={{ clipPath: "polygon(0 100%, 0 0, 100% 100%)" }}
              />

              <span className="mb-6 inline-block w-fit border border-[#2a1b1b]/20 px-3 py-1 text-[#2a1b1b]/60 text-[10px] uppercase tracking-widest">
                {inv.type}
              </span>

              <h2 className="mb-2 font-serif text-2xl text-[#2a1b1b] leading-tight transition-colors group-hover:text-[#8b3a3a]">
                {inv.title}
              </h2>
              <p className="mb-8 font-serif text-gray-500 italic">
                Cordially hosted by {inv.host}
              </p>

              <div className="mt-auto space-y-3 border-[#2a1b1b]/5 border-t pt-6 text-[#2a1b1b]/80 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#8b3a3a]" />
                  <span>{inv.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#8b3a3a]" />
                  <span>{inv.loc}</span>
                </div>
              </div>

              <div className="absolute right-8 bottom-8 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5 text-[#8b3a3a]" />
              </div>
            </div>
          ))}

          {/* 'More' Card */}
          <div className="flex cursor-pointer flex-col items-center justify-center border-2 border-[#2a1b1b]/10 border-dashed bg-transparent p-8 text-center text-[#2a1b1b]/40 transition-all hover:border-[#8b3a3a]/30 hover:bg-[#fdfbf7]/50 hover:text-[#8b3a3a]">
            <p className="font-serif text-lg italic">View All 24 Listings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
