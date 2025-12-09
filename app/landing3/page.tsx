import { ArrowRight, Calendar, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Landing3Type() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#2a1b1b] p-4 text-[#2a1b1b]">
      {/* Background Texture/Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eecfa1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-[#fdfbf7] shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Top Decorative Border */}
        <div className="h-4 w-full bg-[#8b3a3a] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#a64444_10px,#a64444_20px)]" />

        <div className="relative flex flex-col items-center p-8 text-center md:p-16">
          {/* Stamp / Icon */}
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#8b3a3a] bg-[#fdfbf7] text-[#8b3a3a] shadow-inner">
            <Mail className="h-10 w-10" />
          </div>

          <h1 className="mb-4 font-bold font-serif text-3xl text-[#8b3a3a] tracking-wide md:text-5xl">
            You Are Invited
          </h1>

          <div className="mb-8 h-px w-32 bg-amber-400" />

          <p className="mb-10 max-w-lg font-medium text-gray-600 text-lg italic leading-relaxed md:text-xl">
            "To not celebrate alone. To share a meal, a story, or just a moment
            of warmth. The door is open."
          </p>

          {/* Details */}
          <div className="mb-12 grid w-full grid-cols-1 gap-6 text-[#8b3a3a] text-sm uppercase tracking-widest md:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-5 w-5 opacity-70" />
              <span>This Holiday</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-5 w-5 opacity-70" />
              <span>Near You</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-5 w-5 opacity-70" />
              <span>RSVP Now</span>
            </div>
          </div>

          <Link
            className="group flex items-center gap-3 rounded-full bg-[#8b3a3a] px-8 py-4 font-semibold text-white transition-all hover:bg-[#722f2f] hover:px-10"
            href="/landing3/dashboard"
          >
            <span>Open Your Invitation</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="mt-8 text-gray-400 text-xs">
            Nešvęsk vienas - A Community Initiative
          </p>
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-4 w-full bg-[#8b3a3a] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#a64444_10px,#a64444_20px)]" />
      </div>
    </div>
  );
}
