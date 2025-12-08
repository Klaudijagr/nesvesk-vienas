"use client";

import { useQuery } from "convex/react";
import { Gift, Home, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function AppSidebar() {
  const pathname = usePathname();
  const unreadCount = useQuery(api.messages.getUnreadCount) ?? 0;
  const pendingInvites = useQuery(api.invitations.getPendingCount) ?? 0;

  const isActive = (url: string) => pathname === url;

  const totalBadge = unreadCount + pendingInvites;

  const navItems = [
    { title: "Home", url: "/browse", icon: Home },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageCircle,
      badge: totalBadge,
    },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <div className="flex w-64 shrink-0 flex-col border-border border-r bg-sidebar p-4">
      {/* Logo */}
      <Link className="mb-2 flex items-center gap-3 px-2 py-3" href="/">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-amber-500">
          <Gift className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground text-lg">
            Nešvęsk Vienas
          </span>
          <span className="text-muted-foreground text-xs">
            Don't Celebrate Alone
          </span>
        </div>
      </Link>

      <Separator className="my-3" />

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link href={item.url} key={item.title}>
            <Button
              className="h-11 w-full justify-start gap-3"
              variant={isActive(item.url) ? "secondary" : "ghost"}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 font-medium text-white text-xs">
                  {item.badge}
                </span>
              ) : null}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
