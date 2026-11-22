import React from "react";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QRCodeGenerator } from "@/components/qr-code";
import { INDUSTRIES, IndustryData } from "@/lib/industries";
import { HIGH_DEMAND_TOOLS } from "@/lib/tools";
import { getLocaleCurrency } from "@/lib/seo";
import {
  Utensils,
  Coffee,
  Hotel,
  Calendar,
  Home,
  Beer,
  Zap,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  BookOpen,
  QrCode,
} from "lucide-react";

interface IndustryPageTemplateProps {
  data: IndustryData;
  locale: string;
}

const ICON_MAP = {
  Utensils,
  Coffee,
  Hotel,
  Calendar,
  Home,
  Beer,
  Zap,
  ShieldCheck,
  TrendingUp,
  Users,
};

export function IndustryPageTemplate({ data, locale }: IndustryPageTemplateProps) {
  const canonicalUrl = `https://www.qrvenues.com/${locale}/${data.slug}`;

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://www.qrvenues.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: data.industry,
        item: canonicalUrl,
      },
    ],
  };

  // JSON-LD: SoftwareApplication & Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `QRVenues for ${data.industry}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All (Web Browser)",
    url: canonicalUrl,
    description: data.metaDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: getLocaleCurrency(locale),
      description: "Free tier available for QR code generation and menus",
    },
    featureList: data.features.map((f) => f.title),
  };

  // JSON-LD: FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Structured Data Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-20 space-y-16">
          {/* Breadcrumbs Navigation */}
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
                <span className="text-ink font-medium">{data.industry}</span>
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 badge badge-lg bg-surface-1 border border-hairline text-xs font-semibold text-ink px-3.5 py-2.5 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
              <span>{data.heroBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink leading-[1.15]">
              {data.title}
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto">
              {data.subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="btn btn-primary h-12 min-h-12 px-7 rounded-lg text-sm font-medium inline-flex items-center gap-2 shadow-none w-full sm:w-auto"
              >
                <span>Start Free for {data.industry}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#live-generator"
                className="btn bg-surface-1 border border-hairline hover:bg-surface-2 text-ink h-12 min-h-12 px-6 rounded-lg text-sm font-medium shadow-none w-full sm:w-auto"
              >
                Try Interactive Studio
              </a>
            </div>
          </section>

          {/* Stats Bar */}
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

          {/* Interactive Live QR Generator Section */}
          <section id="live-generator" className="space-y-4">
            <div className="text-center space-y-1 max-w-2xl mx-auto mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-ink">
                Instant {data.industry} QR Code Studio
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Test scan the interactive demo below or customize with your own URL, colors, and frame styles.
              </p>
            </div>

            <QRCodeGenerator
              initialValue={data.sampleQrValue}
              initialFrame={data.sampleFrame}
              title={`Live Generator for ${data.industry}`}
              description="Customize your payload, logo, and frame style with instant high-resolution PNG & vector SVG downloads."
            />
          </section>

          {/* Key Benefits Grid */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                Built Specifically for {data.industry} Workflows
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Purpose-built features that solve real daily operational bottlenecks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.keyBenefits.map((benefit, idx) => {
                const IconComponent = ICON_MAP[benefit.icon] || Sparkles;
                return (
                  <div
                    key={idx}
                    className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-fin-orange">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-semibold text-ink">{benefit.title}</h3>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Deep Feature Highlights */}
          <section className="space-y-6">
            <div className="border-b border-hairline pb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Core Operational Capabilities</h2>
              <span className="badge badge-sm bg-canvas border-hairline text-ink-muted text-[11px] font-medium px-2.5 py-1">
                Enterprise Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3"
                >
                  <span className="badge badge-sm bg-fin-orange/10 border-fin-orange/20 text-fin-orange text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                    {feat.tag}
                  </span>
                  <h3 className="text-sm font-semibold text-ink">{feat.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3-Step Implementation Workflow */}
          <section className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-medium tracking-tight text-ink">
                How to Set Up QR Codes for {data.industry} in 3 Minutes
              </h2>
              <p className="text-xs text-ink-muted">
                No complex hardware installations or merchant account hassles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.stepGuide.map((step) => (
                <div key={step.step} className="space-y-2 relative">
                  <div className="w-8 h-8 rounded-full bg-canvas border border-hairline text-ink font-bold text-xs flex items-center justify-center mb-3">
                    0{step.step}
                  </div>
                  <h3 className="text-sm font-semibold text-ink">{step.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs (daisyUI Collapse Accordion) */}
          <section className="space-y-4 max-w-3xl mx-auto">
            <div className="text-center space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-ink flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-fin-orange" />
                <span>Frequently Asked Questions</span>
              </h2>
              <p className="text-xs text-ink-muted">
                Common inquiries regarding {data.industry} QR code deployment
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

          {/* Related Guides, Free Tools & Sibling Industries */}
          <section className="space-y-8 pt-6 border-t border-hairline">
            {data.relatedGuides.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-fin-orange" />
                  <h2 className="text-base font-semibold text-ink">
                    Related Tutorials & Guides
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.relatedGuides.map((guide, idx) => (
                    <Link
                      key={idx}
                      href={`/guides/${guide.slug}`}
                      className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group flex flex-row items-center justify-between"
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

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                <h2 className="text-base font-semibold text-ink">
                  Free QR Tools & Other Industries
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HIGH_DEMAND_TOOLS.slice(0, 3).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group flex flex-row items-center justify-between"
                  >
                    <span className="text-xs font-medium text-ink group-hover:text-fin-orange transition-colors">
                      {tool.shortLabel}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-fin-orange shrink-0 ml-2" />
                  </Link>
                ))}
                {INDUSTRIES.filter((i) => i.slug !== data.slug)
                  .slice(0, 3)
                  .map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/${ind.slug}`}
                      className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group flex flex-row items-center justify-between"
                    >
                      <span className="text-xs font-medium text-ink group-hover:text-fin-orange transition-colors">
                        QR Codes for {ind.industry}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-fin-orange shrink-0 ml-2" />
                    </Link>
                  ))}
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-none">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Ready to Upgrade Your {data.industry} Operations?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted max-w-lg mx-auto">
              Join leading venues driving customer engagement, faster service, and glowing reviews.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="btn btn-primary h-11 min-h-11 px-7 rounded-lg text-xs font-medium inline-flex items-center gap-2 shadow-none"
              >
                <span>Create Free {data.industry} QR Code</span>
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
