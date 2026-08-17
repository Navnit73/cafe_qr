import { MetadataRoute } from "next";
import { activeLocales } from "@/i18n/routing";

const baseUrl = "https://cafeqrbuddy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const languageAlternates: Record<string, string> = {
    "x-default": `${baseUrl}/en-us`,
  };

  for (const locale of activeLocales) {
    languageAlternates[locale] = `${baseUrl}/${locale.toLowerCase()}`;
  }

  return activeLocales.map((locale) => ({
    url: `${baseUrl}/${locale.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "en-US" ? 1.0 : 0.8,
    alternates: {
      languages: languageAlternates,
    },
  }));
}
