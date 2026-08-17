import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en-US", "en-GB", "en-AU"],
  defaultLocale: "en-US",
  localePrefix: "always",
  localeCookie: true,
});

// Locales with active, human-reviewed copy
export const activeLocales = ["en-US", "en-GB", "en-AU"] as const;
export type Locale = (typeof activeLocales)[number];

// Lightweight wrappers around Next.js navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
