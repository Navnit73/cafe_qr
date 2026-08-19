import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeAppDock } from "@/components/home-app-dock";
import { QRCodeGenerator } from "@/components/qr-code";
import {
  QrCode,
  Star,
  Smartphone,
  MessageSquareHeart,
  Wifi,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
  Clock,
  Printer,
  TrendingUp,
  ShieldCheck,
  Zap,
  Utensils,
  ExternalLink,
  Scan,
} from "lucide-react";

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}`;
  const title = "Create QR Code Menus, Google Review Links & Contactless Ordering — Free to Start | QRVenues";
  const description = "Give your restaurant or cafe a QR code menu, a Google review QR code, and a full ordering system — all from one dashboard. Free to start.";

  return {
    title,
    description,
    keywords: [
      "qr code menu",
      "free qr menu maker",
      "google review qr code",
      "google review link generator",
      "qr code ordering system",
      "contactless menu",
      "restaurant qr code",
      "cafe qr ordering",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us",
        "en-GB": "https://qrvenues.com/en-gb",
        "en-AU": "https://qrvenues.com/en-au",
        "x-default": "https://qrvenues.com/en-us",
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

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tQrMenu = await getTranslations({ locale, namespace: "qrMenu" });
  const tGoogleReview = await getTranslations({ locale, namespace: "googleReview" });
  const tOrdering = await getTranslations({ locale, namespace: "ordering" });
  const tFeedback = await getTranslations({ locale, namespace: "feedback" });
  const tStudio = await getTranslations({ locale, namespace: "studio" });
  const tHowItWorks = await getTranslations({ locale, namespace: "howItWorks" });
  const tFaq = await getTranslations({ locale, namespace: "faq" });

  // Structured Data for Google FAQ Rich Snippet
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": tFaq("q1"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a1") },
      },
      {
        "@type": "Question",
        "name": tFaq("q2"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a2") },
      },
      {
        "@type": "Question",
        "name": tFaq("q3"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a3") },
      },
      {
        "@type": "Question",
        "name": tFaq("q4"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a4") },
      },
      {
        "@type": "Question",
        "name": tFaq("q5"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a5") },
      },
      {
        "@type": "Question",
        "name": tFaq("q6"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a6") },
      },
      {
        "@type": "Question",
        "name": tFaq("q7"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a7") },
      },
      {
        "@type": "Question",
        "name": tFaq("q8"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a8") },
      },
      {
        "@type": "Question",
        "name": tFaq("q9"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a9") },
      },
      {
        "@type": "Question",
        "name": tFaq("q10"),
        "acceptedAnswer": { "@type": "Answer", "text": tFaq("a10") },
      },
    ],
  };

  // Structured Data for Software Application / SaaS Rich Snippet
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "QRVenues",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All (Web Browser)",
    "url": "https://qrvenues.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier with QR code menu maker and Google review link generator",
    },
    "featureList": [
      "Digital Menu QR Code Generator",
      "Google Review QR Code Generator & Private Feedback Loop",
      "Contactless Dine-in & Takeaway Table Ordering System",
      "Live Kitchen POS Order Stream",
      "Print-ready Table Tent Templates",
    ],
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* Common Header / Navbar */}
      <Header />

      {/* Main Content Landmark */}
      <main className="flex-1">
          {/* Phone App Icon Menu Dock (Quick Actions Hub) */}
        <HomeAppDock />
        {/* =========================================================================
            1. Hero Section
            ========================================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 text-center flex flex-col items-center">
       

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink max-w-4xl leading-[1.1] mb-6">
          {tHero("h1")}
        </h1>

        <p className="text-base sm:text-lg text-ink-muted max-w-3xl mb-8 leading-relaxed">
          {tHero("subhead")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-4">
          <Link
            href="/login"
            className="btn btn-primary w-full sm:w-auto h-12 min-h-12 px-7 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-none"
          >
            <span>{tHero("primaryCta")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="btn bg-surface-1 text-ink border border-hairline hover:bg-canvas hover:border-ink w-full sm:w-auto h-12 min-h-12 px-6 rounded-lg text-sm font-medium shadow-none"
          >
            {tHero("secondaryCta")}
          </a>
        </div>

        <p className="text-xs text-ink-tertiary mb-6">
          {tHero("noCard")}
        </p>

      

        {/* Hero Interactive Studio Showcase Card */}
        <div className="card w-full max-w-4xl bg-surface-1 border border-hairline rounded-2xl text-left shadow-none overflow-hidden">
          <div className="card-body p-4 sm:p-7">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-hairline-soft mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center text-on-primary font-bold text-xs">
                  CQ
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink">QR Code Studio Hub</div>
                  <div className="text-[10px] text-ink-subtle">Dine-in · Takeaway · Google Review · Feedback</div>
                </div>
              </div>
              <div className="badge badge-sm bg-fin-orange text-on-primary border-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded">
                Live Studio
              </div>
            </div>

            {/* 3 Floating Cards Preview in Hero Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Card 1: Digital Menu */}
              <div className="p-4 rounded-xl bg-canvas border border-hairline-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-ink">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="badge badge-xs bg-surface-1 text-ink-muted border-hairline">Table 04</span>
                  </div>
                  <div className="text-xs font-semibold text-ink mb-0.5">Scannable QR Menu</div>
                  <p className="text-[11px] text-ink-subtle leading-tight">Instant browser view, auto-tagged for Table 04.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-hairline-soft flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted font-medium">Flat White & Pastries</span>
                  <span className="text-ink font-semibold">Active</span>
                </div>
              </div>

              {/* Card 2: Google Review Smart Router */}
              <div className="p-4 rounded-xl bg-canvas border border-hairline-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-fin-orange">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="badge badge-xs bg-semantic-success/15 text-semantic-success border-0 font-medium">
                      5.0 ★
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ink mb-0.5">Google Review QR</div>
                  <p className="text-[11px] text-ink-subtle leading-tight">One-click 5-star review route with private feedback filter.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-hairline-soft flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted font-medium">+142 Reviews</span>
                  <span className="text-fin-orange font-semibold">Protected</span>
                </div>
              </div>

              {/* Card 3: Live Order Queue */}
              <div className="p-4 rounded-xl bg-canvas border border-hairline-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-ink">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="badge badge-xs bg-fin-orange text-on-primary border-0">Live POS</span>
                  </div>
                  <div className="text-xs font-semibold text-ink mb-0.5">Kitchen Order Stream</div>
                  <p className="text-[11px] text-ink-subtle leading-tight">Pending → Preparing → Ready → Served in real time.</p>
                </div>
                <div className="mt-3 pt-2 border-t border-hairline-soft flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted font-medium">Prep Time</span>
                  <span className="text-ink font-semibold">3.2 min avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. Digital Menu Maker Section
          ========================================================================= */}
      <section id="menu-maker" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
            {tQrMenu("badge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-ink mb-4">
            {tQrMenu("h2")}
          </h2>
          <p className="text-base text-ink-muted leading-relaxed mb-3">
            {tQrMenu("lead")}
          </p>
          <p className="text-xs text-ink-subtle">
            {tQrMenu("sublead")}
          </p>
        </div>

        {/* 5 Feature Bullets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <FileText className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tQrMenu("bullet1")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <QrCode className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tQrMenu("bullet2")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <TrendingUp className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tQrMenu("bullet3")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <Sparkles className="w-5 h-5 text-fin-orange mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tQrMenu("bullet4")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none md:col-span-2 lg:col-span-2">
            <div className="card-body p-5">
              <Printer className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tQrMenu("bullet5")}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: How To & Why It Beats Printed Menus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How to Create */}
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 sm:p-7">
              <h3 className="card-title text-base font-semibold text-ink mb-4">
                {tQrMenu("howTitle")}
              </h3>
              <ol className="space-y-3 text-xs text-ink-muted list-decimal list-inside leading-relaxed">
                <li className="pl-1"><span className="text-ink font-medium">{tQrMenu("step1")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tQrMenu("step2")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tQrMenu("step3")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tQrMenu("step4")}</span></li>
              </ol>
            </div>
          </div>

          {/* Why It Beats Printed Only */}
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 sm:p-7">
              <h3 className="card-title text-base font-semibold text-ink mb-4">
                {tQrMenu("whyTitle")}
              </h3>
              <ul className="space-y-3 text-xs text-ink-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tQrMenu("why1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tQrMenu("why2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tQrMenu("why3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tQrMenu("why4")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. Google Review QR Code Generator Section
          ========================================================================= */}
      <section id="google-reviews" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
            {tGoogleReview("badge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-ink mb-4">
            {tGoogleReview("h2")}
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            {tGoogleReview("lead")}
          </p>
        </div>

        {/* Feature Bullets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 space-y-2">
              <Star className="w-5 h-5 text-fin-orange fill-current" />
              <p className="text-xs text-ink leading-relaxed font-medium">
                {tGoogleReview("bullet1")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 space-y-2">
              <Printer className="w-5 h-5 text-ink" />
              <p className="text-xs text-ink leading-relaxed font-medium">
                {tGoogleReview("bullet2")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 space-y-2">
              <ExternalLink className="w-5 h-5 text-ink" />
              <p className="text-xs text-ink leading-relaxed font-medium">
                {tGoogleReview("bullet3")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 space-y-2">
              <ShieldCheck className="w-5 h-5 text-semantic-success" />
              <p className="text-xs text-ink leading-relaxed font-medium">
                {tGoogleReview("bullet4")}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: How To & Why It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 sm:p-7">
              <h3 className="card-title text-base font-semibold text-ink mb-4">
                {tGoogleReview("howTitle")}
              </h3>
              <ol className="space-y-3 text-xs text-ink-muted list-decimal list-inside leading-relaxed">
                <li className="pl-1"><span className="text-ink font-medium">{tGoogleReview("step1")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tGoogleReview("step2")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tGoogleReview("step3")}</span></li>
                <li className="pl-1"><span className="text-ink font-medium">{tGoogleReview("step4")}</span></li>
              </ol>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6 sm:p-7">
              <h3 className="card-title text-base font-semibold text-ink mb-4">
                {tGoogleReview("whyTitle")}
              </h3>
              <ul className="space-y-3 text-xs text-ink-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tGoogleReview("why1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tGoogleReview("why2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tGoogleReview("why3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                  <span>{tGoogleReview("why4")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. QR Code Ordering System Section
          ========================================================================= */}
      <section id="ordering-system" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
            {tOrdering("badge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-ink mb-4">
            {tOrdering("h2")}
          </h2>
          <p className="text-base text-ink-muted leading-relaxed">
            {tOrdering("lead")}
          </p>
        </div>

        {/* 5 Core Ordering Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <Smartphone className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tOrdering("bullet1")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <Layers className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tOrdering("bullet2")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <Clock className="w-5 h-5 text-fin-orange mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tOrdering("bullet3")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-5">
              <Zap className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tOrdering("bullet4")}
              </p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none md:col-span-2 lg:col-span-2">
            <div className="card-body p-5">
              <Utensils className="w-5 h-5 text-ink mb-2" />
              <p className="text-xs text-ink font-medium leading-relaxed">
                {tOrdering("bullet5")}
              </p>
            </div>
          </div>
        </div>

        {/* Built for Real Restaurant Operations */}
        <div className="card bg-surface-1 border border-hairline rounded-2xl shadow-none p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-ink mb-4">
            {tOrdering("builtTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ink-muted">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-fin-orange shrink-0 mt-0.5" />
              <span>{tOrdering("built1")}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-fin-orange shrink-0 mt-0.5" />
              <span>{tOrdering("built2")}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-fin-orange shrink-0 mt-0.5" />
              <span>{tOrdering("built3")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. Customer Feedback QR Codes Section
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="card bg-surface-1 border border-hairline rounded-2xl shadow-none p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
              {tFeedback("badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-3">
              {tFeedback("h2")}
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              {tFeedback("lead")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-canvas border border-hairline-soft text-xs font-medium text-ink flex items-start gap-2.5">
              <MessageSquareHeart className="w-4 h-4 text-fin-orange shrink-0 mt-0.5" />
              <span>{tFeedback("bullet1")}</span>
            </div>
            <div className="p-4 rounded-xl bg-canvas border border-hairline-soft text-xs font-medium text-ink flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-fin-orange shrink-0 mt-0.5" />
              <span>{tFeedback("bullet2")}</span>
            </div>
            <div className="p-4 rounded-xl bg-canvas border border-hairline-soft text-xs font-medium text-ink flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
              <span>{tFeedback("bullet3")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. Complete QR Studio Suite & Live Generator App
          ========================================================================= */}
      <section id="qr-studio" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-semibold text-ink gap-2 px-3.5 py-2.5 mb-3 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
            <span>{tStudio("badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            {tStudio("h2")}
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-xl mx-auto">
            Design, customize colors, test, and download high-resolution QR codes directly from your browser.
          </p>
        </div>

        {/* Live Interactive QR Studio Generator App */}
        <div className="mb-12">
          <QRCodeGenerator
            title="Interactive QR Code Studio"
            description="Create custom QR codes for websites, guest Wi-Fi, menus, reviews, and vCards."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <QrCode className="w-5 h-5 text-ink mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item1Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item1Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <Star className="w-5 h-5 text-fin-orange fill-current mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item2Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item2Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <MessageSquareHeart className="w-5 h-5 text-ink mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item3Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item3Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <Wifi className="w-5 h-5 text-ink mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item4Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item4Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <ExternalLink className="w-5 h-5 text-ink mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item5Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item5Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <Printer className="w-5 h-5 text-ink mb-2" />
              <h3 className="card-title text-sm font-semibold text-ink">{tStudio("item6Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tStudio("item6Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. How It Works Section
          ========================================================================= */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
            {tHowItWorks("badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            {tHowItWorks("h2")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <div className="text-2xl font-bold text-ink-tertiary mb-2">{tHowItWorks("step1Num")}</div>
              <h3 className="card-title text-sm font-semibold text-ink mb-1">{tHowItWorks("step1Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tHowItWorks("step1Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <div className="text-2xl font-bold text-ink-tertiary mb-2">{tHowItWorks("step2Num")}</div>
              <h3 className="card-title text-sm font-semibold text-ink mb-1">{tHowItWorks("step2Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tHowItWorks("step2Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <div className="text-2xl font-bold text-ink-tertiary mb-2">{tHowItWorks("step3Num")}</div>
              <h3 className="card-title text-sm font-semibold text-ink mb-1">{tHowItWorks("step3Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tHowItWorks("step3Desc")}</p>
            </div>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl shadow-none">
            <div className="card-body p-6">
              <div className="text-2xl font-bold text-fin-orange mb-2">{tHowItWorks("step4Num")}</div>
              <h3 className="card-title text-sm font-semibold text-ink mb-1">{tHowItWorks("step4Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tHowItWorks("step4Desc")}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="btn btn-primary h-12 min-h-12 px-8 rounded-lg text-sm font-medium inline-flex items-center gap-2 shadow-none"
          >
            <span>{tHowItWorks("cta")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          8. Frequently Asked Questions (daisyUI Accordion)
          ========================================================================= */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-8 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold uppercase text-fin-orange tracking-wider mb-2">
            {tFaq("badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            {tFaq("h2")}
          </h2>
        </div>

        <div className="space-y-3">
          {/* FAQ 1 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" defaultChecked />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q1")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a1")}</p>
            </div>
          </div>

          {/* FAQ 2 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q2")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a2")}</p>
            </div>
          </div>

          {/* FAQ 3 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q3")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a3")}</p>
            </div>
          </div>

          {/* FAQ 4 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q4")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a4")}</p>
            </div>
          </div>

          {/* FAQ 5 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q5")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a5")}</p>
            </div>
          </div>

          {/* FAQ 6 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q6")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a6")}</p>
            </div>
          </div>

          {/* FAQ 7 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q7")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a7")}</p>
            </div>
          </div>

          {/* FAQ 8 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q8")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a8")}</p>
            </div>
          </div>

          {/* FAQ 9 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q9")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a9")}</p>
            </div>
          </div>

          {/* FAQ 10 */}
          <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-sm font-semibold text-ink">
              {tFaq("q10")}
            </div>
            <div className="collapse-content text-xs text-ink-muted leading-relaxed">
              <p>{tFaq("a10")}</p>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* =========================================================================
          Footer & Compliance
          ========================================================================= */}
      <Footer />
    </div>
  );
}
