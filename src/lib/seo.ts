import { Metadata } from "next";

export const SITE_URL = "https://www.qrvenues.com";
export const SITE_NAME = "QRVenues";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicons.svg`;

export interface MetadataOptions {
  title: string;
  description: string;
  path: string; // e.g. "/online-qr-scanner" or "/guides/google-review-qr-code" or ""
  locale?: string; // "en-us" | "en-gb" | "en-au"
  canonicalPath?: string; // If canonical should point to a specific path/locale (e.g. always en-us for identical content)
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds standard, pristine SEO metadata for Next.js App Router pages.
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
}: MetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  
  // Canonical URL determination:
  // If canonicalPath is provided, use that; otherwise canonicalize to the localized path
  const canonicalUrl = canonicalPath
    ? (canonicalPath.startsWith("http") ? canonicalPath : `${SITE_URL}${canonicalPath}`)
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

  return {
    title: `${title} | ${SITE_NAME}`,
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
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === "en-gb" ? "en_GB" : locale === "en-au" ? "en_AU" : "en_US",
      type,
      publishedTime,
      modifiedTime,
      authors: type === "article" ? authors : undefined,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 512,
          height: 512,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
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
  featureList = [],
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
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
      priceCurrency: "USD",
      description: "Free tier available with no credit card required",
    },
    featureList,
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
