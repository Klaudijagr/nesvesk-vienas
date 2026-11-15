"use client";

import Link from "next/link";

import { useLocale } from "@/contexts/locale-context";

interface FooterProps {
  variant?: "dark" | "light";
}

// Resolved once per module load so render stays pure.
const CURRENT_YEAR = new Date().getFullYear();

export const Footer = ({ variant = "dark" }: FooterProps) => {
  const { t } = useLocale();

  const isDark = variant === "dark";

  return (
    <footer
      className={
        isDark
          ? "border-t border-white/10 bg-slate-950 py-6"
          : "border-t border-gray-200 bg-gray-50 py-6"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <span
          className={
            isDark ? "text-sm text-blue-100/40" : "text-sm text-gray-500"
          }
        >
          &copy; {CURRENT_YEAR} {t.appName}
        </span>
        <nav
          className={
            isDark
              ? "flex gap-6 text-sm text-blue-100/50"
              : "flex gap-6 text-sm text-gray-500"
          }
        >
          <Link
            className={
              isDark
                ? "transition-colors hover:text-amber-400"
                : "transition-colors hover:text-green-600"
            }
            href="/safety"
          >
            {t.safetyGuidelines}
          </Link>
          <Link
            className={
              isDark
                ? "transition-colors hover:text-amber-400"
                : "transition-colors hover:text-green-600"
            }
            href="/terms"
          >
            {t.termsOfService}
          </Link>
          <Link
            className={
              isDark
                ? "transition-colors hover:text-amber-400"
                : "transition-colors hover:text-green-600"
            }
            href="/privacy"
          >
            {t.privacyPolicy}
          </Link>
        </nav>
      </div>
    </footer>
  );
};
