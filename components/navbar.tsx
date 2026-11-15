"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { Gift, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@/contexts/locale-context";

import { LanguageSelector } from "./language-selector";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(`#${id}`);
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
                isScrolled ? "bg-brand" : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span
              className={`text-lg font-bold ${isScrolled ? "text-foreground" : "text-white"}`}
            >
              Nešvęsk vienas
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <button
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white"
              }`}
              onClick={() => {
                scrollToSection("how-it-works");
              }}
              type="button"
            >
              {t.howItWorks}
            </button>
            <button
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white"
              }`}
              onClick={() => {
                scrollToSection("about");
              }}
              type="button"
            >
              {t.about}
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSelector />
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant={isScrolled ? "outline" : "outline-night"}>
                  {t.signIn}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant={isScrolled ? "brand" : "gold"}>
                  {t.signUp}
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link href="/browse">
                <Button variant={isScrolled ? "brand" : "gold"}>
                  {t.goToApp}
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </Show>
          </div>

          <button
            className={`md:hidden ${isScrolled ? "text-foreground" : "text-white"}`}
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
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
          <div className="border-t border-white/10 bg-white py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                className="text-foreground/80 px-2 text-left text-sm font-medium"
                onClick={() => {
                  scrollToSection("how-it-works");
                }}
                type="button"
              >
                {t.howItWorks}
              </button>
              <button
                className="text-foreground/80 px-2 text-left text-sm font-medium"
                onClick={() => {
                  scrollToSection("about");
                }}
                type="button"
              >
                {t.about}
              </button>
              <div className="px-2">
                <LanguageSelector />
              </div>
              <div className="border-border/60 flex gap-2 border-t pt-4">
                <Show when="signed-out">
                  <Link className="flex-1" href="/sign-in">
                    <Button className="w-full" variant="outline">
                      {t.signIn}
                    </Button>
                  </Link>
                  <Link className="flex-1" href="/sign-up">
                    <Button className="w-full" variant="brand">
                      {t.signUp}
                    </Button>
                  </Link>
                </Show>
                <Show when="signed-in">
                  <Link className="flex-1" href="/browse">
                    <Button className="w-full" variant="brand">
                      {t.goToApp}
                    </Button>
                  </Link>
                </Show>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
};
