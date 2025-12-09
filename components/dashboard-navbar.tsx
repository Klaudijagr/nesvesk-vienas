"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Gift, Home, Menu, MessageCircle, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/contexts/locale-context";
import { api } from "@/convex/_generated/api";
import { LanguageSelector } from "./language-selector";

export function DashboardNavbar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = useQuery(api.messages.getUnreadCount) ?? 0;
  const pendingInvites = useQuery(api.invitations.getPendingCount) ?? 0;

  const totalBadge = unreadCount + pendingInvites;

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);

  const navItems = [
    { title: t.navHome, url: "/browse", icon: Home },
    {
      title: t.navMessages,
      url: "/messages",
      icon: MessageCircle,
      badge: totalBadge,
    },
    { title: t.navSettings, url: "/settings", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 border-gray-200 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link className="flex items-center gap-3" href="/browse">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="font-bold text-foreground text-lg leading-tight">
                {t.appName}
              </span>
              <span className="text-muted-foreground text-xs">
                {t.dontCelebrateAlone}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden h-full items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                className={`flex h-16 flex-col items-center justify-center gap-1 px-5 font-medium text-xs transition-colors ${
                  isActive(item.url)
                    ? "border-red-500 border-b-2 text-red-600"
                    : "border-transparent border-b-2 text-gray-600 hover:bg-gray-50 hover:text-red-500"
                }`}
                href={item.url}
                key={item.url}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge ? (
                    <span className="-top-1.5 -right-2.5 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-medium text-[10px] text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
            {/* Mobile menu button */}
            <button
              className="text-gray-600 md:hidden"
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
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-gray-100 border-t bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm ${
                  isActive(item.url)
                    ? "bg-red-50 text-red-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                href={item.url}
                key={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge ? (
                    <span className="-top-1 -right-1 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-medium text-[10px] text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </div>
                <span>{item.title}</span>
              </Link>
            ))}
            <div className="border-gray-100 border-t pt-3 sm:hidden">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
