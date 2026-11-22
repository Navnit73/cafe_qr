import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Link, activeLocales } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllGuides, getGuideBySlug, getGuideSlugs } from "@/lib/guides";
import { getGuideMDXComponents } from "@/components/guides/mdx-components";
import { QRCodeGenerator } from "@/components/qr-code";
import { HIGH_DEMAND_TOOLS } from "@/lib/tools";
import {
  SITE_URL,
  DEFAULT_LOGO_PNG,
  buildOgImageUrl,
  constructMetadata,
  getBcp47Locale,
} from "@/lib/seo";
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
  QrCode,
  BookOpen,
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

  return constructMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/guides/${frontmatter.slug}`,
    locale,
    keywords: frontmatter.tags,
    type: "article",
    publishedTime: frontmatter.publishedAt,
    modifiedTime: frontmatter.updatedAt || frontmatter.publishedAt,
    authors: [frontmatter.author],
    ogBadge: frontmatter.category,
  });
}

// ---------------------------------------------------------------------------
// Helper: Extract structured HowToStep items from MDX content
// ---------------------------------------------------------------------------
function extractHowToSteps(
  mdxContent: string
): { name: string; text: string }[] {
  const steps: { name: string; text: string }[] = [];

  // Match <StepCard number="..." title="...">body</StepCard>
  const stepCardRegex =
    /<StepCard[^>]*title=["']([^"']+)["'][^>]*>([\s\S]*?)<\/StepCard>/gi;
  let match: RegExpExecArray | null;
  while ((match = stepCardRegex.exec(mdxContent)) !== null) {
    const name = match[1].trim();
    const text = match[2].replace(/\s+/g, " ").replace(/[*_`]/g, "").trim();
    if (name && text) {
      steps.push({ name, text });
    }
  }

  if (steps.length > 0) return steps;

  // Fallback: match numbered ### 1. Step Title followed by paragraph
  const headingStepRegex = /###\s+\d+\.\s+([^\n]+)\n+([^\n#]+)/g;
  while ((match = headingStepRegex.exec(mdxContent)) !== null) {
    const name = match[1].trim();
    const text = match[2].replace(/\s+/g, " ").replace(/[*_`]/g, "").trim();
    if (name && text) {
      steps.push({ name, text });
    }
  }

  return steps;
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
  const canonicalUrl = `${SITE_URL}/${locale}/guides/${frontmatter.slug}`;
  const defaultQrValue = frontmatter.qrValue || canonicalUrl;
  const validFaqs = (frontmatter.faqs || []).filter(
    (faq): faq is { q: string; a: string } => Boolean(faq?.q && faq?.a)
  );
  const articleOgImage = buildOgImageUrl({
    title: frontmatter.title,
    subtitle: frontmatter.description,
    badge: frontmatter.category,
  });

  // Related guides for internal linking
  const relatedGuides = getAllGuides()
    .filter((g) => g.frontmatter.slug !== frontmatter.slug)
    .slice(0, 3);

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
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/${locale}/guides`,
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
  // JSON-LD: Article (always valid with image + PNG logo) + optional HowTo with steps
  // -----------------------------------------------------------------------
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: [articleOgImage],
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
    inLanguage: getBcp47Locale(locale),
    author: {
      "@type": "Organization",
      name: frontmatter.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "QRVenues",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_LOGO_PNG,
        width: 180,
        height: 180,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    articleSection: frontmatter.category,
    keywords: (frontmatter.tags || []).join(", "),
  };

  const extractedSteps =
    frontmatter.schema === "HowTo" ? extractHowToSteps(content) : [];

  const howToSchema =
    extractedSteps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: frontmatter.title,
          description: frontmatter.description,
          image: articleOgImage,
          step: extractedSteps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
          })),
        }
      : null;

  // -----------------------------------------------------------------------
  // JSON-LD: FAQPage
  // -----------------------------------------------------------------------
  const faqSchema =
    validFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: validFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

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
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
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
          {/* 0. Breadcrumbs Navigation */}
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

          {/* 1. H1 — Display Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink leading-[1.15] mb-5">
            {frontmatter.title}
          </h1>

          {/* 2. Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted pb-6 mb-8 border-b border-hairline">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-fin-orange text-white flex items-center justify-center font-bold text-[10px]">
                  QV
                </div>
                <span className="font-medium text-ink">
                  {frontmatter.author}
                </span>
              </div>
              <span className="text-ink-tertiary">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-semantic-success" />
                {formatDate(frontmatter.publishedAt, locale)}
                {frontmatter.updatedAt &&
                  frontmatter.updatedAt !== frontmatter.publishedAt && (
                    <span className="text-ink-subtle">
                      (revised {formatDate(frontmatter.updatedAt, locale)})
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

          {/* 3. Dynamic Interactive QR Code Component Studio */}
          <div className="mb-10">
            <QRCodeGenerator
              initialValue={defaultQrValue}
              initialFrame={frontmatter.qrFrame || "none"}
              title={`Live QR Generator: ${frontmatter.title}`}
              description="Test scanning the code below or type your custom URL/menu link to download your high-resolution QR instantly."
            />
          </div>

          {/* 4. Article Body */}
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

          {/* 5. Frequently Asked Questions (daisyUI Accordion) */}
          {validFaqs.length > 0 && (
            <section className="mt-14 pt-10 border-t border-hairline">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-fin-orange" />
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {validFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl"
                  >
                    <input
                      type="radio"
                      name={`guide-faq-${frontmatter.slug}`}
                      aria-label={faq.q}
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

          {/* 6. Related Free Tools & Guides (Internal Linking) */}
          <section className="mt-12 pt-8 border-t border-hairline space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-fin-orange" />
                <h2 className="text-base font-semibold text-ink">
                  Try Our Dedicated Free QR Code Tools
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HIGH_DEMAND_TOOLS.slice(0, 3).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors">
                        {tool.shortLabel}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-fin-orange group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      {tool.navDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {relatedGuides.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h2 className="text-base font-semibold text-ink">
                    More Guides & Tutorials
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {relatedGuides.map((rel) => (
                    <Link
                      key={rel.frontmatter.slug}
                      href={`/guides/${rel.frontmatter.slug}`}
                      className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors line-clamp-2">
                          {rel.frontmatter.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-fin-orange shrink-0" />
                      </div>
                      <span className="text-[11px] text-ink-subtle">
                        {rel.readingTime} min read · {rel.frontmatter.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 7. Tags & Navigation Footer */}
          <div className="mt-10 pt-8 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mr-1">
                  Topics:
                </span>
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-sm bg-surface-1 border border-hairline text-ink-muted text-[11px] font-medium px-2.5 py-2 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <Link
              href="/guides"
              className="btn btn-sm bg-surface-1 border border-hairline hover:bg-surface-2 gap-1.5 text-xs font-medium text-ink rounded-lg"
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
function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getBcp47Locale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
