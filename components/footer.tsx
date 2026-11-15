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
          ? "bg-night-deep border-t border-white/10 py-6"
          : "border-border bg-muted/50 border-t py-6"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <span
          className={
            isDark
              ? "text-night-foreground/40 text-sm"
              : "text-muted-foreground text-sm"
          }
        >
          &copy; {CURRENT_YEAR} {t.appName}
        </span>
        <nav
          className={
            isDark
              ? "text-night-foreground/50 flex gap-6 text-sm"
              : "text-muted-foreground flex gap-6 text-sm"
          }
        >
          <Link
            className={
              isDark
                ? "hover:text-gold transition-colors"
                : "hover:text-success transition-colors"
            }
            href="/safety"
          >
            {t.safetyGuidelines}
          </Link>
          <Link
            className={
              isDark
                ? "hover:text-gold transition-colors"
                : "hover:text-success transition-colors"
            }
            href="/terms"
          >
            {t.termsOfService}
          </Link>
          <Link
            className={
              isDark
                ? "hover:text-gold transition-colors"
                : "hover:text-success transition-colors"
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
