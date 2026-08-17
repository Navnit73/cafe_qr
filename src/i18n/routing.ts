import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en-us", "en-gb", "en-au"],
  defaultLocale: "en-us",
  localePrefix: "always",
  localeCookie: true,
});

// Locales with active, human-reviewed copy
export const activeLocales = ["en-us", "en-gb", "en-au"] as const;
export type Locale = (typeof activeLocales)[number];

// Lightweight wrappers around Next.js navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
