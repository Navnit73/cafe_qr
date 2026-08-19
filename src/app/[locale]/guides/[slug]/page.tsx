import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guides";
import { getGuideMDXComponents } from "@/components/guides/mdx-components";
import { QRCodeGenerator } from "@/components/qr-code";
import { activeLocales } from "@/i18n/routing";
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  const slugs = getGuideSlugs();
  const params: { locale: string; slug: string }[] = [];

  for (const locale of activeLocales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const { frontmatter } = guide;
  const canonicalUrl = `https://qrvenues.com/${locale}/guides/${frontmatter.slug}`;

  return {
    title: `${frontmatter.title} — QRVenues Guides`,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    authors: [{ name: frontmatter.author }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `https://qrvenues.com/en-us/guides/${frontmatter.slug}`,
        "en-GB": `https://qrvenues.com/en-gb/guides/${frontmatter.slug}`,
        "en-AU": `https://qrvenues.com/en-au/guides/${frontmatter.slug}`,
        "x-default": `https://qrvenues.com/en-us/guides/${frontmatter.slug}`,
      },
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: canonicalUrl,
      siteName: "QRVenues",
      type: "article",
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.updatedAt || frontmatter.publishedAt,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function GuideDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const { frontmatter, content, readingTime } = guide;
  const canonicalUrl = `https://qrvenues.com/${locale}/guides/${frontmatter.slug}`;
  const defaultQrValue = frontmatter.qrValue || canonicalUrl;

  // -----------------------------------------------------------------------
  // JSON-LD: BreadcrumbList
  // -----------------------------------------------------------------------
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://qrvenues.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `https://qrvenues.com/${locale}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: canonicalUrl,
      },
    ],
  };

  // -----------------------------------------------------------------------
  // JSON-LD: Article or HowTo
  // -----------------------------------------------------------------------
  const articleSchema =
    frontmatter.schema === "HowTo"
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: frontmatter.title,
          description: frontmatter.description,
          datePublished: frontmatter.publishedAt,
          dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
          author: {
            "@type": "Organization",
            name: frontmatter.author,
            url: "https://qrvenues.com",
          },
          publisher: {
            "@type": "Organization",
            name: "QRVenues",
            url: "https://qrvenues.com",
            logo: {
              "@type": "ImageObject",
              url: "https://qrvenues.com/favicons.svg",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: frontmatter.title,
          description: frontmatter.description,
          datePublished: frontmatter.publishedAt,
          dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
          author: {
            "@type": "Organization",
            name: frontmatter.author,
            url: "https://qrvenues.com",
          },
          publisher: {
            "@type": "Organization",
            name: "QRVenues",
            url: "https://qrvenues.com",
            logo: {
              "@type": "ImageObject",
              url: "https://qrvenues.com/favicons.svg",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          articleSection: frontmatter.category,
          keywords: (frontmatter.tags || []).join(", "),
        };

  // -----------------------------------------------------------------------
  // JSON-LD: FAQPage
  // -----------------------------------------------------------------------
  const faqSchema =
    frontmatter.faqs && frontmatter.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: frontmatter.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  // -----------------------------------------------------------------------
  // MDX components & options (remarkGfm enables tables, strikethrough, etc.)
  // -----------------------------------------------------------------------
  const mdxComponents = getGuideMDXComponents();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Schema injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <Header />

      <main className="flex-1">
        <article className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-20">
          {/* ===============================================================
              0. Breadcrumbs Navigation
              =============================================================== */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-ink-muted mb-6 flex items-center gap-1.5 flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-fin-orange transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-fin-orange" />
            <Link
              href="/guides"
              className="hover:text-fin-orange transition-colors"
            >
              Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-fin-orange" />
            <span className="text-ink font-medium truncate max-w-xs">
              {frontmatter.title}
            </span>
          </nav>

          {/* ===============================================================
              1. H1 — Display Title
              =============================================================== */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink leading-[1.15] mb-5">
            {frontmatter.title}
          </h1>

          {/* ===============================================================
              2. Meta Info Bar (Author, Date, Reading Time, Category)
              =============================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted pb-6 mb-8 border-b border-hairline">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-fin-orange text-white flex items-center justify-center font-bold text-[10px] ">
                  QV
                </div>
                <span className="font-medium text-ink">{frontmatter.author}</span>
              </div>
              <span className="text-ink-tertiary">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-semantic-success" />
                {formatDate(frontmatter.publishedAt)}
                {frontmatter.updatedAt &&
                  frontmatter.updatedAt !== frontmatter.publishedAt && (
                    <span className="text-ink-subtle">
                      (revised {formatDate(frontmatter.updatedAt)})
                    </span>
                  )}
              </span>
              <span className="text-ink-tertiary">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-link-blue" />
                {readingTime} min read
              </span>
            </div>

            {/* Category Tag */}
            <span className="badge badge-sm bg-surface-1 border border-fin-orange/30 text-fin-orange text-[11px] font-medium gap-1 px-2.5 py-2 rounded-md">
              <Tag className="w-3 h-3 text-fin-orange" />
              {frontmatter.category}
            </span>
          </div>

          {/* ===============================================================
              3. Dynamic Interactive QR Code Component Studio
              =============================================================== */}
          <div className="mb-10">
            <QRCodeGenerator
              initialValue={defaultQrValue}
              initialFrame={frontmatter.qrFrame || "none"}
              title={`Live QR Generator: ${frontmatter.title}`}
              description="Test scanning the code below or type your custom URL/menu link to download your high-resolution QR instantly."
            />
          </div>

          {/* ===============================================================
              4. Article Body (MDX with remark-gfm for tables, checklists)
              =============================================================== */}
          <div className="prose-guide">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>

          {/* ===============================================================
              5. Frequently Asked Questions (daisyUI Accordion)
              =============================================================== */}
          {frontmatter.faqs && frontmatter.faqs.length > 0 && (
            <section className="mt-14 pt-10 border-t border-hairline">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-fin-orange" />
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {frontmatter.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl "
                  >
                    <input
                      type="radio"
                      name={`guide-faq-${frontmatter.slug}`}
                      defaultChecked={i === 0}
                    />
                    <div className="collapse-title text-sm sm:text-base font-semibold text-ink py-4">
                      {faq.q}
                    </div>
                    <div className="collapse-content text-xs sm:text-sm text-ink-muted leading-relaxed pb-4">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===============================================================
              6. Tags & Navigation Footer
              =============================================================== */}
          <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mr-1">
                  Topics:
                </span>
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-sm bg-surface-1 border border-hairline text-ink-muted text-[11px] font-medium px-2.5 py-2 rounded-md "
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <Link
              href="/guides"
              className="btn btn-sm bg-surface-1 border border-hairline hover:bg-surface-2 gap-1.5 text-xs font-medium text-ink rounded-lg "
            >
              <ArrowLeft className="w-3.5 h-3.5 text-fin-orange" />
              <span>Back to all guides</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
