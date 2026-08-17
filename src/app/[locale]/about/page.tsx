import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft, Coffee, ShieldCheck, HeartHandshake, Zap, Users } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/about`;

  return {
    title: "About Us — Cafe QRBuddy Hospitality Platform",
    description: "Learn about the mission, team, and hospitality expertise behind Cafe QRBuddy.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/about",
        "en-GB": "https://cafeqrbuddy.com/en-gb/about",
        "en-AU": "https://cafeqrbuddy.com/en-au/about",
        "x-default": "https://cafeqrbuddy.com/en-us/about",
      },
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

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
            <Coffee className="w-3.5 h-3.5 text-fin-orange" />
            <span>Built by Hospitality Operators</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tAbout("title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {tAbout("subtitle")}
          </p>
        </div>

        {/* Numbers Strip (E-E-A-T Social Proof) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 text-center shadow-none">
            <div className="text-3xl font-bold text-ink mb-1">{tAbout("numbersVenues")}</div>
            <div className="text-xs text-ink-subtle">{tAbout("numbersVenuesLabel")}</div>
          </div>
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 text-center shadow-none">
            <div className="text-3xl font-bold text-fin-orange mb-1">{tAbout("numbersScans")}</div>
            <div className="text-xs text-ink-subtle">{tAbout("numbersScansLabel")}</div>
          </div>
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 text-center shadow-none">
            <div className="text-3xl font-bold text-semantic-success mb-1">{tAbout("numbersRating")}</div>
            <div className="text-xs text-ink-subtle">{tAbout("numbersRatingLabel")}</div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-4">
          <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-fin-orange" />
            <span>{tAbout("missionTitle")}</span>
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {tAbout("missionDesc")}
          </p>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-ink text-center">
            {tAbout("valuesTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
              <Zap className="w-5 h-5 text-ink mb-1" />
              <h3 className="text-sm font-semibold text-ink">{tAbout("value1Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tAbout("value1Desc")}</p>
            </div>
            <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
              <Users className="w-5 h-5 text-fin-orange mb-1" />
              <h3 className="text-sm font-semibold text-ink">{tAbout("value2Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tAbout("value2Desc")}</p>
            </div>
            <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
              <ShieldCheck className="w-5 h-5 text-semantic-success mb-1" />
              <h3 className="text-sm font-semibold text-ink">{tAbout("value3Title")}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{tAbout("value3Desc")}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
