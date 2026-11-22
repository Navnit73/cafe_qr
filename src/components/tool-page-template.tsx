import React from "react";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QRCodeGenerator, BulkQRStudio } from "@/components/qr-code";
import { HIGH_DEMAND_TOOLS, type ToolPageData, type ToolIconName } from "@/lib/tools";
import {
  SITE_URL,
  getLocaleCurrency,
  generateBreadcrumbSchema,
  generateWebAppSchema,
  generateHowToSchema,
  generateFaqSchema,
} from "@/lib/seo";
import {
  Utensils,
  Star,
  Wifi,
  MessageCircle,
  Layers,
  ShieldCheck,
  Zap,
  Printer,
  Smartphone,
  TrendingUp,
  QrCode,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
  Building2,
} from "lucide-react";

const ICON_MAP: Record<ToolIconName, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Star,
  Wifi,
  MessageCircle,
  Layers,
  ShieldCheck,
  Zap,
  Printer,
  Smartphone,
  TrendingUp,
  QrCode,
  CheckCircle2,
};

interface ToolPageTemplateProps {
  data: ToolPageData;
  locale: string;
}

export function ToolPageTemplate({ data, locale }: ToolPageTemplateProps) {
  const canonicalUrl = `${SITE_URL}/${locale}/${data.slug}`;
  const currency = getLocaleCurrency(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: data.shortLabel, url: canonicalUrl },
  ]);

  const webAppSchema = generateWebAppSchema({
    name: `QRVenues ${data.shortLabel}`,
    description: data.metaDescription,
    url: canonicalUrl,
    category: "UtilitiesApplication",
    currency,
    featureList: data.benefits.map((b) => b.title),
  });

  const howToSchema = generateHowToSchema({
    name: data.howToTitle,
    description: data.metaDescription,
    url: canonicalUrl,
    steps: data.steps.map((s) => ({ title: s.title, description: s.description })),
  });

  const faqSchema = generateFaqSchema(data.faqs);

  const siblingTools = HIGH_DEMAND_TOOLS.filter((t) => t.slug !== data.slug);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Structured Data Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-20 space-y-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-ink-muted">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-fin-orange transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5 text-fin-orange" />
              </li>
              <li>
                <span className="text-ink font-medium">{data.shortLabel}</span>
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 badge badge-lg bg-surface-1 border border-hairline text-xs font-semibold text-ink px-3.5 py-2.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
              <span>{data.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink leading-[1.15]">
              {data.title}
            </h1>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {data.subtitle}
            </p>

            {/* Quick Highlight Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
              {data.highlights.map((item) => {
                const Icon = ICON_MAP[item.icon] || Sparkles;
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-hairline text-ink font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-fin-orange" />
                    <span>{item.label}</span>
                  </span>
                );
              })}
            </div>
          </section>

          {/* Interactive Tool Studio (Above the fold protagonist) */}
          <section id="tool-studio" aria-label={data.studioTitle}>
            {data.mode === "bulk" ? (
              <BulkQRStudio />
            ) : (
              <QRCodeGenerator
                initialTab={data.initialTab || "url"}
                initialFrame={data.initialFrame || "none"}
                initialValue={data.initialValue}
                initialFgColor={data.initialFgColor}
                title={data.studioTitle}
                description={data.studioDescription}
              />
            )}
          </section>

          {/* Key Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.stats.map((stat, idx) => (
              <div
                key={idx}
                className="card bg-surface-1 border border-hairline rounded-xl p-6 text-center shadow-none"
              >
                <div className="text-3xl font-bold text-ink mb-1">{stat.value}</div>
                <div className="text-xs text-ink-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Core Benefits */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                Why Use QRVenues {data.shortLabel}?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Built for speed, privacy, and commercial print quality with zero paywalls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.benefits.map((benefit, idx) => {
                const Icon = ICON_MAP[benefit.icon] || Sparkles;
                return (
                  <div
                    key={idx}
                    className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-fin-orange">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-ink">{benefit.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How-To Steps */}
          <section className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-medium tracking-tight text-ink">
                {data.howToTitle}
              </h2>
              <p className="text-xs text-ink-muted">
                No sign-up, software installs, or design skills required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.steps.map((step) => (
                <div key={step.step} className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-canvas border border-hairline text-ink font-bold text-xs flex items-center justify-center mb-3">
                    0{step.step}
                  </div>
                  <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* High-Impact Use Cases */}
          <section className="space-y-6">
            <div className="border-b border-hairline pb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Popular Real-World Placements</h2>
              <span className="badge badge-sm bg-canvas border-hairline text-ink-muted text-[11px] font-medium px-2.5 py-1">
                Print & Digital Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.useCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3"
                >
                  <span className="badge badge-sm bg-fin-orange/10 border-fin-orange/20 text-fin-orange text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                    {uc.tag}
                  </span>
                  <h3 className="text-sm font-semibold text-ink">{uc.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {uc.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Best Practices Checklist */}
          <section className="card bg-surface-1 border border-hairline rounded-2xl p-6 sm:p-8 shadow-none space-y-4">
            <h2 className="text-lg font-semibold text-ink">
              Print & Scannability Best Practices
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-ink-muted leading-relaxed">
              {data.bestPractices.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-canvas border border-hairline-soft"
                >
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs (100% synced with FAQPage JSON-LD) */}
          <section className="space-y-4 max-w-3xl mx-auto">
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-ink flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-fin-orange" />
                <span>Frequently Asked Questions</span>
              </h2>
              <p className="text-xs text-ink-muted">
                Answers about our free {data.shortLabel.toLowerCase()}
              </p>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl"
                >
                  <input
                    type="radio"
                    name={`faq-${data.slug}`}
                    aria-label={faq.question}
                    defaultChecked={idx === 0}
                  />
                  <div className="collapse-title text-sm sm:text-base font-semibold text-ink py-4">
                    {faq.question}
                  </div>
                  <div className="collapse-content text-xs sm:text-sm text-ink-muted leading-relaxed pb-4">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Internal Links: More Free QR Tools + Related Guides & Industries */}
          <section className="space-y-8 pt-6 border-t border-hairline">
            {/* Sibling Free Tools */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-fin-orange" />
                  <h2 className="text-base font-semibold text-ink">
                    More Free QR Code Tools
                  </h2>
                </div>
                <Link
                  href="/online-qr-scanner"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Try Online QR Scanner →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {siblingTools.map((tool) => (
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
                    <p className="text-[11px] text-ink-muted">{tool.navDescription}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Guides & Industries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.relatedGuides.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-fin-orange" />
                    <h2 className="text-sm font-semibold text-ink">
                      Related Tutorials & Guides
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {data.relatedGuides.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        className="card bg-surface-1 border border-hairline rounded-xl p-3.5 shadow-none hover:border-ink transition-all group flex flex-row items-center justify-between"
                      >
                        <span className="text-xs font-medium text-ink group-hover:text-fin-orange transition-colors">
                          {guide.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-fin-orange group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {data.relatedIndustries.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold text-ink">
                      Industry Solutions
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {data.relatedIndustries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/${ind.slug}`}
                        className="card bg-surface-1 border border-hairline rounded-xl p-3.5 shadow-none hover:border-ink transition-all group flex flex-row items-center justify-between"
                      >
                        <span className="text-xs font-medium text-ink group-hover:text-fin-orange transition-colors">
                          {ind.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-fin-orange group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Closing CTA */}
          <section className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-none">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Need Dynamic Menus, Analytics & Live Ordering?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto">
              Manage every table QR code, update digital menus in real time, and
              track scan metrics from one unified hospitality studio.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="btn btn-primary h-11 min-h-11 px-7 rounded-lg text-xs font-medium inline-flex items-center gap-2 shadow-none"
              >
                <span>Start Free — No Credit Card Required</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
