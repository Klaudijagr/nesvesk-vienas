"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Gift, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/locale-context";
import { LanguageSelector } from "./language-selector";
import { Button } from "./ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                isScrolled
                  ? "bg-gradient-to-br from-red-500 to-amber-500"
                  : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span
              className={`font-bold text-lg ${isScrolled ? "text-gray-900" : "text-white"}`}
            >
              Nešvęsk Vienas
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <button
              className={`font-medium text-sm transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
              onClick={() => scrollToSection("how-it-works")}
              type="button"
            >
              {t.howItWorks}
            </button>
            <button
              className={`font-medium text-sm transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/80 hover:text-white"
              }`}
              onClick={() => scrollToSection("about")}
              type="button"
            >
              About
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSelector />
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  className={`${
                    isScrolled
                      ? "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
                      : "border-white/30 bg-transparent text-white hover:bg-white/10"
                  }`}
                  variant="outline"
                >
                  {t.signIn}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className={`${
                    isScrolled
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-amber-400 text-green-800 hover:bg-yellow-400"
                  }`}
                >
                  {t.signUp}
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/browse">
                <Button
                  className={`${
                    isScrolled
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-amber-400 text-green-800 hover:bg-yellow-400"
                  }`}
                >
                  Go to App
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </SignedIn>
          </div>

          <button
            className={`md:hidden ${isScrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-white/10 border-t bg-white py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                className="px-2 text-left font-medium text-gray-700 text-sm"
                onClick={() => scrollToSection("how-it-works")}
                type="button"
              >
                {t.howItWorks}
              </button>
              <button
                className="px-2 text-left font-medium text-gray-700 text-sm"
                onClick={() => scrollToSection("about")}
                type="button"
              >
                About
              </button>
              <div className="px-2">
                <LanguageSelector />
              </div>
              <div className="flex gap-2 border-gray-100 border-t pt-4">
                <SignedOut>
                  <Link className="flex-1" href="/sign-in">
                    <Button className="w-full" variant="outline">
                      {t.signIn}
                    </Button>
                  </Link>
                  <Link className="flex-1" href="/sign-up">
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700">
                      {t.signUp}
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link className="flex-1" href="/browse">
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700">
                      Go to App
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
