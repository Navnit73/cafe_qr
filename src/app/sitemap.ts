import { MetadataRoute } from "next";
import { activeLocales } from "@/i18n/routing";
import { getAllGuides } from "@/lib/guides";
import { getAllIndustrySlugs } from "@/lib/industries";
import { HIGH_DEMAND_TOOLS } from "@/lib/tools";

const baseUrl = "https://www.qrvenues.com";
const SITE_RELEASE_DATE = new Date("2026-11-22");

// Core static pages with explicit search intent
const STATIC_PAGES = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0, lastModified: SITE_RELEASE_DATE },
  { path: "/online-qr-scanner", changeFrequency: "weekly" as const, priority: 0.95, lastModified: SITE_RELEASE_DATE },
  { path: "/guides", changeFrequency: "weekly" as const, priority: 0.9, lastModified: SITE_RELEASE_DATE },
  { path: "/case-studies", changeFrequency: "monthly" as const, priority: 0.85, lastModified: new Date("2026-09-20") },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8, lastModified: new Date("2026-09-20") },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8, lastModified: new Date("2026-09-20") },
  { path: "/gdpr", changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date("2026-08-17") },
  { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date("2026-08-17") },
  { path: "/terms", changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date("2026-08-17") },
  { path: "/security", changeFrequency: "monthly" as const, priority: 0.7, lastModified: new Date("2026-08-17") },
];

function buildLanguageAlternates(path: string): Record<string, string> {
  return {
    "x-default": `${baseUrl}/en-us${path}`,
    "en-US": `${baseUrl}/en-us${path}`,
    "en-GB": `${baseUrl}/en-gb${path}`,
    "en-AU": `${baseUrl}/en-au${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // 1. Static Localized Pages
  for (const page of STATIC_PAGES) {
    const alternates = buildLanguageAlternates(page.path);

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority:
          locale === "en-us"
            ? page.priority
            : Number((page.priority * 0.9).toFixed(2)),
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 2. High-Demand Dedicated Free QR Tool Pages
  for (const tool of HIGH_DEMAND_TOOLS) {
    const toolPath = `/${tool.slug}`;
    const alternates = buildLanguageAlternates(toolPath);
    const toolLastMod = new Date(tool.lastModified);

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${toolPath}`,
        lastModified: toolLastMod,
        changeFrequency: "weekly",
        priority: locale === "en-us" ? 0.95 : 0.86,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 3. Industry & Use-Case High-Intent Pages
  const industrySlugs = getAllIndustrySlugs();
  for (const slug of industrySlugs) {
    const industryPath = `/${slug}`;
    const alternates = buildLanguageAlternates(industryPath);

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${industryPath}`,
        lastModified: SITE_RELEASE_DATE,
        changeFrequency: "weekly",
        priority: locale === "en-us" ? 0.9 : 0.81,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 4. Dynamic High-Quality Guide Pages (using authentic frontmatter dates)
  const guides = getAllGuides();
  for (const guide of guides) {
    const guidePath = `/guides/${guide.frontmatter.slug}`;
    const alternates = buildLanguageAlternates(guidePath);
    const rawDate = guide.frontmatter.updatedAt || guide.frontmatter.publishedAt;
    const parsedDate = rawDate ? new Date(rawDate) : SITE_RELEASE_DATE;
    const lastModified = isNaN(parsedDate.getTime())
      ? SITE_RELEASE_DATE
      : parsedDate;

    for (const locale of activeLocales) {
      routes.push({
        url: `${baseUrl}/${locale}${guidePath}`,
        lastModified,
        changeFrequency: "monthly",
        priority: locale === "en-us" ? 0.85 : 0.76,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return routes;
}
