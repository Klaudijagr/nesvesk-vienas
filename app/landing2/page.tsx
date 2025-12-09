import { Building2, Home, TreePine } from "lucide-react";
import Link from "next/link";

export default function Landing2Type() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a2342] text-white selection:bg-amber-500/30">
      {/* CSS Snow Effect */}
      <div className="absolute inset-0 z-0 opacity-50">
        {[...new Array(50)].map((_, i) => (
          <div
            className="absolute animate-pulse rounded-full bg-white"
            key={`snow-${i}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-blue-200 text-sm uppercase tracking-widest backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          Join the celebration
        </div>

        <h1 className="mb-6 max-w-4xl font-medium font-serif text-6xl text-white leading-tight md:text-8xl">
          Don't Spend <br />
          <span className="text-amber-200 italic decoration-amber-200/30 underline-offset-8">
            It Alone
          </span>
        </h1>

        <p className="mb-12 max-w-xl text-blue-100/80 text-lg leading-relaxed md:text-xl">
          Join a community where every window holds a story, and every door is
          open to new friends.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-amber-100 px-8 py-4 font-medium font-serif text-[#0a2342] text-lg transition-transform hover:scale-105 hover:bg-white"
            href="/landing2/dashboard"
          >
            Find Your Place
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 font-medium font-serif text-lg text-white transition-colors hover:bg-white/10"
            href="/about"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* "Village" Illustration at Bottom */}
      <div className="absolute right-0 bottom-0 left-0 z-10 flex h-32 items-end justify-center gap-2 px-4 opacity-40 md:gap-8">
        {/* Simple stylized buildings using lucide icons or divs */}
        <div className="flex items-end text-blue-300/50">
          <Building2 className="h-24 w-24" strokeWidth={1} />
          <Home className="-ml-4 h-16 w-16" strokeWidth={1} />
          <TreePine className="h-20 w-20" strokeWidth={1} />
          <Building2 className="-ml-2 h-32 w-32" strokeWidth={1} />
          <Home className="h-20 w-20" strokeWidth={1} />
          <TreePine className="h-24 w-24" strokeWidth={1} />
        </div>
      </div>

      {/* Gradient Fog at Bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-64 bg-gradient-to-t from-[#0a2342] to-transparent" />
    </div>
  );
}
