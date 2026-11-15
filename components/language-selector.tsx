"use client";

import { useLocale } from "@/contexts/locale-context";
import type { Locale } from "@/lib/i18n";

import { Button } from "./ui/button";

const languages: { code: Locale; label: string }[] = [
  { code: "lt", label: "LT" },
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
];

export const LanguageSelector = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="border-border bg-background flex gap-1 rounded-lg border p-1">
      {languages.map((lang) => (
        <Button
          className="min-w-[2.5rem] text-xs font-medium"
          key={lang.code}
          onClick={() => {
            setLocale(lang.code);
          }}
          size="sm"
          variant={locale === lang.code ? "default" : "ghost"}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};
