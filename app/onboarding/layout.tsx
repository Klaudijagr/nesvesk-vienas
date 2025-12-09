"use client";

import { Gift } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Simple header with logo */}
      <header className="shrink-0 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg">
                Nešvęsk vienas
              </span>
              <span className="-mt-1 text-muted-foreground text-xs">
                Don't Celebrate Alone
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Full screen content area */}
      <main className="flex flex-1 items-center justify-center p-4">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="shrink-0 py-4 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Nešvęsk vienas
      </footer>
    </div>
  );
}
