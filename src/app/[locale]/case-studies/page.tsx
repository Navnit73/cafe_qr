import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import {
  ArrowLeft,
  TrendingUp,
  MapPin,
  Zap,
  ArrowRight,
  Utensils,
  Coffee,
} from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/case-studies`;

  return {
    title: "Hospitality Case Studies & Operator ROI — Cafe QRBuddy",
    description: "Read how cafes and restaurants achieved +42% table turnaround, 4.9-star ratings, and zero queue friction with Cafe QRBuddy.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/case-studies",
        "en-GB": "https://cafeqrbuddy.com/en-gb/case-studies",
        "en-AU": "https://cafeqrbuddy.com/en-au/case-studies",
        "x-default": "https://cafeqrbuddy.com/en-us/case-studies",
      },
    },
  };
}

export default async function CaseStudiesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCases = await getTranslations({ locale, namespace: "caseStudies" });

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline-soft">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-ink-muted hover:text-ink transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to overview</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="btn btn-primary btn-sm rounded-md text-xs font-medium h-9 min-h-9 px-3.5 shadow-none">
              {tNav("signIn")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-medium text-ink gap-2 px-3.5 py-2.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 text-fin-orange" />
            <span>{tCases("badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tCases("title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {tCases("subtitle")}
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-8">
          {/* Case 1 */}
          <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-soft pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-fin-orange" />
                  <h2 className="text-lg font-semibold text-ink">{tCases("case1Title")}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tCases("case1Loc")}</span>
                </div>
              </div>
              <div className="text-left sm:text-right bg-canvas p-3.5 rounded-xl border border-hairline shrink-0">
                <div className="text-2xl font-bold text-fin-orange">{tCases("case1Stat")}</div>
                <div className="text-[11px] text-ink-subtle">{tCases("case1StatLabel")}</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {tCases("case1Desc")}
            </p>
          </div>

          {/* Case 2 */}
          <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-soft pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-fin-orange" />
                  <h2 className="text-lg font-semibold text-ink">{tCases("case2Title")}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tCases("case2Loc")}</span>
                </div>
              </div>
              <div className="text-left sm:text-right bg-canvas p-3.5 rounded-xl border border-hairline shrink-0">
                <div className="text-2xl font-bold text-semantic-success flex items-center justify-start sm:justify-end gap-1">
                  <span>{tCases("case2Stat")}</span>
                </div>
                <div className="text-[11px] text-ink-subtle">{tCases("case2StatLabel")}</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {tCases("case2Desc")}
            </p>
          </div>

          {/* Case 3 */}
          <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-soft pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-fin-orange" />
                  <h2 className="text-lg font-semibold text-ink">{tCases("case3Title")}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tCases("case3Loc")}</span>
                </div>
              </div>
              <div className="text-left sm:text-right bg-canvas p-3.5 rounded-xl border border-hairline shrink-0">
                <div className="text-2xl font-bold text-ink">{tCases("case3Stat")}</div>
                <div className="text-[11px] text-ink-subtle">{tCases("case3StatLabel")}</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {tCases("case3Desc")}
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 text-center space-y-4 shadow-none">
          <h3 className="text-xl font-semibold text-ink">Ready to achieve similar results?</h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Join over 1,200+ hospitality venues generating menus, Google reviews, and contactless orders in minutes.
          </p>
          <Link
            href="/login"
            className="btn btn-primary h-11 min-h-11 px-6 rounded-lg text-xs font-medium inline-flex items-center gap-2 shadow-none mx-auto"
          >
            <span>Start Free — No Credit Card Required</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
