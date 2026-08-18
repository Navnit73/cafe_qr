import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllGuides } from "@/lib/guides";
import { QRCodeGenerator } from "@/components/qr-code";
import { BookOpen, Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}/guides`;
  const title =
    "QR Code Guides & Tutorials — Restaurant QR Menus, Reviews & Ordering";
  const description =
    "Free guides on QR code menus, Google review QR codes, contactless ordering, and restaurant technology. Step-by-step tutorials for hospitality venues.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us/guides",
        "en-GB": "https://qrvenues.com/en-gb/guides",
        "en-AU": "https://qrvenues.com/en-au/guides",
        "x-default": "https://qrvenues.com/en-us/guides",
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "QRVenues",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GuidesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const guides = getAllGuides();

  // JSON-LD: CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "QR Code Guides & Tutorials",
    description:
      "Free guides on QR code menus, Google review QR codes, contactless ordering, and restaurant technology.",
    url: `https://qrvenues.com/${locale}/guides`,
    publisher: {
      "@type": "Organization",
      name: "QRVenues",
      url: "https://qrvenues.com",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://qrvenues.com/${locale}/guides/${guide.frontmatter.slug}`,
        name: guide.frontmatter.title,
      })),
    },
  };

  // JSON-LD: BreadcrumbList
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
    ],
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Header />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-ink-muted mb-8"
          >
            <ol className="flex items-center gap-1.5">
              <li>
                <Link
                  href="/"
                  className="hover:text-ink transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="text-ink-tertiary">/</span>
              </li>
              <li>
                <span className="text-ink font-medium">Guides</span>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-fin-orange tracking-wider mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Hospitality Guides & Tutorials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink mb-4 leading-tight">
              QR Code Guides for Restaurants & Cafes
            </h1>
            <p className="text-base text-ink-muted leading-relaxed">
              Step-by-step tutorials on building QR code menus, generating Google review
              links, setting up contactless ordering, and optimizing table turns.
            </p>
          </div>

          {/* Interactive Live Generator Studio */}
          <div className="mb-14">
            <QRCodeGenerator
              initialValue="https://qrvenues.com/menu/the-artisan-cafe"
              initialFrame="menu"
              title="Instant QR Code Studio"
              description="Create, customize, and export high-resolution QR codes in seconds. Enter any menu, review link, or custom URL below."
            />
          </div>

          {/* Guides Grid Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fin-orange" />
                <h2 className="text-lg font-semibold text-ink">All Published Guides</h2>
              </div>
              <span className="text-xs text-ink-subtle">{guides.length} tutorials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link
                  key={guide.frontmatter.slug}
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="card bg-surface-1 border border-hairline rounded-xl shadow-none hover:border-ink hover: transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="card-body p-6">
                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge badge-sm bg-canvas border-hairline text-ink-muted text-[11px] font-medium gap-1 px-2.5 py-1 rounded-md">
                        <Tag className="w-3 h-3 text-fin-orange" />
                        {guide.frontmatter.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-base font-semibold text-ink group-hover:text-fin-orange transition-colors leading-snug mb-2">
                      {guide.frontmatter.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 mb-4">
                      {guide.frontmatter.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-[11px] text-ink-subtle mt-auto pt-3 border-t border-hairline-soft">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-semantic-success" />
                        {formatDate(guide.frontmatter.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-link-blue" />
                        {guide.readingTime} min read
                      </span>
                    </div>

                    {/* Read CTA */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors mt-3">
                      <span>Read tutorial</span>
                      <ArrowRight className="w-3.5 h-3.5 text-fin-orange group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Empty state */}
          {guides.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-ink-tertiary mx-auto mb-4" />
              <p className="text-sm text-ink-muted">
                No guides published yet. Check back soon!
              </p>
            </div>
          )}
        </section>
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
