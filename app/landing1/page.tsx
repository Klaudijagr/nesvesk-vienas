import Image from "next/image";
import Link from "next/link";

export default function Landing1Type() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0F172A] text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Magical winter night with a lit window"
          className="object-cover opacity-80"
          fill
          priority
          src="/magic-window.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 font-bold font-serif text-5xl text-amber-100 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] md:text-7xl">
          More Than Just A Place
        </h1>

        <p className="mb-8 max-w-2xl text-blue-100/90 text-lg shadow-black drop-shadow-md md:text-xl">
          Step inside and feel the magic. A single light in the window means
          you're never truly alone. Be part of something wonderful this season.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            className="group relative overflow-hidden rounded-full bg-amber-200/10 px-8 py-3 font-semibold text-amber-100 backdrop-blur-sm transition-all hover:bg-amber-200/20 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            href="/landing1/dashboard"
          >
            <span className="relative z-10">Discover the Magic</span>
            <div className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>
        </div>
      </div>

      {/* Decorative "Light" Element */}
      <div className="-translate-x-1/2 pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 translate-y-1/2 rounded-full bg-amber-500/20 blur-[100px]" />
    </div>
  );
}
