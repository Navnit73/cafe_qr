import { MetadataRoute } from "next";
import { activeLocales } from "@/i18n/routing";
import { getGuideSlugs } from "@/lib/guides";
import { getAllIndustrySlugs } from "@/lib/industries";

const baseUrl = "https://www.qrvenues.com";

// Core static pages with explicit search intent
const STATIC_PAGES = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/online-qr-scanner", changeFrequency: "weekly" as const, priority: 0.95 },
  { path: "/guides", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/case-studies", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/gdpr", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/terms", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/security", changeFrequency: "monthly" as const, priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Static Localized Pages
  for (const page of STATIC_PAGES) {
    const alternates: Record<string, string> = {
      "x-default": `${baseUrl}/en-us${page.path}`,
      "en-US": `${baseUrl}/en-us${page.path}`,
      "en-GB": `${baseUrl}/en-gb${page.path}`,
      "en-AU": `${baseUrl}/en-au${page.path}`,
    };

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: locale === "en-us" ? page.priority : Number((page.priority * 0.9).toFixed(2)),
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 2. Industry & Use-Case High-Intent Pages
  const industrySlugs = getAllIndustrySlugs();
  for (const slug of industrySlugs) {
    const industryPath = `/${slug}`;
    const alternates: Record<string, string> = {
      "x-default": `${baseUrl}/en-us${industryPath}`,
      "en-US": `${baseUrl}/en-us${industryPath}`,
      "en-GB": `${baseUrl}/en-gb${industryPath}`,
      "en-AU": `${baseUrl}/en-au${industryPath}`,
    };

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${industryPath}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: locale === "en-us" ? 0.9 : 0.81,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 3. Dynamic High-Quality Guide Pages
  const guideSlugs = getGuideSlugs();
  for (const slug of guideSlugs) {
    const guidePath = `/guides/${slug}`;
    const alternates: Record<string, string> = {
      "x-default": `${baseUrl}/en-us${guidePath}`,
      "en-US": `${baseUrl}/en-us${guidePath}`,
      "en-GB": `${baseUrl}/en-gb${guidePath}`,
      "en-AU": `${baseUrl}/en-au${guidePath}`,
    };

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${guidePath}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: locale === "en-us" ? 0.85 : 0.76,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return routes;
}
