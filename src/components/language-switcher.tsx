"use client";

import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, type Locale, activeLocales } from "@/i18n/routing";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LocaleOption {
  code: Locale;
  label: string;
  region: string;
  flag: string;
}

const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "en-us", label: "English (US)", region: "United States", flag: "🇺🇸" },
  { code: "en-gb", label: "English (UK)", region: "United Kingdom", flag: "🇬🇧" },
  { code: "en-au", label: "English (AU)", region: "Australia", flag: "🇦🇺" },
  // Future markets (uncomment when translations are available):
  // { code: "de-de", label: "Deutsch", region: "Germany", flag: "🇩🇪" },
  // { code: "fr-fr", label: "Français", region: "France", flag: "🇫🇷" },
];

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentOption =
    LOCALE_OPTIONS.find((opt) => opt.code === currentLocale) || LOCALE_OPTIONS[0];

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="dropdown dropdown-end shrink-0">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm h-8 min-h-8 px-2 sm:px-2.5 rounded-md text-xs font-medium text-ink flex items-center gap-1 sm:gap-1.5 border border-hairline hover:border-ink hover:bg-surface-1"
        aria-label="Change region and language"
      >
        <Globe className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
        <span className="text-xs shrink-0">{currentOption.flag}</span>
        <span className="font-medium hidden sm:inline">
          {currentOption.code === "en-us" ? "en-US" : currentOption.code === "en-gb" ? "en-GB" : "en-AU"}
        </span>
        <ChevronDown className="w-3 h-3 text-ink-subtle opacity-70 shrink-0" />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 p-1.5 shadow-md bg-surface-1 border border-hairline rounded-lg w-52 mt-1 space-y-0.5"
      >
        <li className="menu-title px-2 py-1 text-[10px] uppercase font-semibold text-ink-tertiary tracking-wider">
          Select Region
        </li>
        {LOCALE_OPTIONS.filter((opt) =>
          activeLocales.includes(opt.code)
        ).map((option) => {
          const isSelected = option.code === currentLocale;
          return (
            <li key={option.code}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleLocaleChange(option.code)}
                className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md w-full text-left transition-colors ${
                  isSelected
                    ? "bg-canvas font-semibold text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-canvas"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{option.flag}</span>
                  <div>
                    <div className="text-ink text-xs">{option.label}</div>
                    <div className="text-[10px] text-ink-subtle">{option.region}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-ink shrink-0" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
