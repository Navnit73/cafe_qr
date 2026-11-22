import { Metadata } from "next";

export const SITE_URL = "https://www.qrvenues.com";
export const SITE_NAME = "QRVenues";
export const DEFAULT_LOGO_PNG = `${SITE_URL}/apple-icon`;

export function buildOgImageUrl({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}): string {
  const params = new URLSearchParams();
  params.set("title", title.slice(0, 90));
  if (subtitle) params.set("subtitle", subtitle.slice(0, 150));
  if (badge) params.set("badge", badge.slice(0, 40));
  return `${SITE_URL}/api/og?${params.toString()}`;
}

export function getBcp47Locale(locale: string): string {
  if (locale === "en-gb") return "en-GB";
  if (locale === "en-au") return "en-AU";
  return "en-US";
}

export function getOgLocale(locale: string): string {
  if (locale === "en-gb") return "en_GB";
  if (locale === "en-au") return "en_AU";
  return "en_US";
}

export function getAlternateOgLocales(locale: string): string[] {
  const all = ["en_US", "en_GB", "en_AU"];
  const current = getOgLocale(locale);
  return all.filter((l) => l !== current);
}

export function getLocaleCurrency(locale: string): string {
  if (locale === "en-gb") return "GBP";
  if (locale === "en-au") return "AUD";
  return "USD";
}

export interface MetadataOptions {
  title: string;
  description: string;
  path: string; // e.g. "/online-qr-scanner" or "/guides/google-review-qr-code" or ""
  locale?: string; // "en-us" | "en-gb" | "en-au"
  canonicalPath?: string; // Optional explicit canonical path
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  ogBadge?: string;
}

/**
 * Builds standard, pristine SEO metadata for Next.js App Router pages.
 * Note: layout.tsx applies `title.template: "%s | QRVenues"`, so we pass the raw
 * page title to `title` (preventing double "| QRVenues | QRVenues") while using
 * `${title} | ${SITE_NAME}` for OpenGraph and Twitter cards.
 */
export function constructMetadata({
  title,
  description,
  path,
  locale = "en-us",
  canonicalPath,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  authors = ["QRVenues Team"],
  noIndex = false,
  ogBadge,
}: MetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  const canonicalUrl = canonicalPath
    ? canonicalPath.startsWith("http")
      ? canonicalPath
      : `${SITE_URL}${canonicalPath}`
    : `${SITE_URL}/${locale}${cleanPath}`;

  const alternates = {
    canonical: canonicalUrl,
    languages: {
      "en-US": `${SITE_URL}/en-us${cleanPath}`,
      "en-GB": `${SITE_URL}/en-gb${cleanPath}`,
      "en-AU": `${SITE_URL}/en-au${cleanPath}`,
      "x-default": `${SITE_URL}/en-us${cleanPath}`,
    },
  };

  const defaultKeywords = [
    "QR code menu",
    "QR code generator",
    "Google review QR code",
    "contactless ordering",
    "restaurant QR code",
    "free QR code maker",
  ];

  const mergedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));
  const fullSocialTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const ogImageUrl = buildOgImageUrl({
    title,
    subtitle: description,
    badge: ogBadge || SITE_NAME,
  });

  return {
    title: {
      absolute: fullSocialTitle,
    },
    description,
    keywords: mergedKeywords,
    authors: authors.map((name) => ({ name })),
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates,
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: fullSocialTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: getOgLocale(locale),
      alternateLocale: getAlternateOgLocales(locale),
      type,
      publishedTime,
      modifiedTime,
      authors: type === "article" ? authors : undefined,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullSocialTitle,
      description,
      images: [ogImageUrl],
      creator: "@qrvenues",
    },
  };
}

// ---------------------------------------------------------------------------
// Structured Data (JSON-LD) Generators
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateSoftwareAppSchema({
  name,
  description,
  url,
  category = "BusinessApplication",
  currency = "USD",
  featureList = [],
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
  currency?: string;
  featureList?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    applicationCategory: category,
    operatingSystem: "All (Web Browser)",
    browserRequirements: "Requires HTML5 and JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: currency,
      description: "Free tier available with no credit card required",
    },
    featureList,
  };
}

export function generateWebAppSchema({
  name,
  description,
  url,
  category = "UtilitiesApplication",
  currency = "USD",
  featureList = [],
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
  currency?: string;
  featureList?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    applicationCategory: category,
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and HTML5",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: currency,
    },
    ...(featureList.length > 0 ? { featureList } : {}),
  };
}

export function generateHowToSchema({
  name,
  description,
  url,
  steps,
}: {
  name: string;
  description: string;
  url: string;
  steps: { title: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    },
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
