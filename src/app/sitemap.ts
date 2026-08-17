import { MetadataRoute } from "next";
import { activeLocales } from "@/i18n/routing";

const baseUrl = "https://qrvenues.com";

const PATHS = [
  { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/case-studies", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/gdpr", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/terms", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/security", changeFrequency: "monthly" as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const page of PATHS) {
    const alternates: Record<string, string> = {
      "x-default": `${baseUrl}/en-us${page.path}`,
      "en-US": `${baseUrl}/en-us${page.path}`,
      "en-GB": `${baseUrl}/en-gb${page.path}`,
      "en-AU": `${baseUrl}/en-au${page.path}`,
    };

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: locale === "en-us" ? page.priority : Number((page.priority * 0.9).toFixed(2)),
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return routes;
}
