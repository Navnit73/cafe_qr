import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft, ShieldCheck, Mail, Lock, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/gdpr`;

  return {
    title: "GDPR & Data Protection Compliance — Cafe QRBuddy",
    description: "Our comprehensive commitment to the EU GDPR, UK DPA, and international data privacy regulations.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/gdpr",
        "en-GB": "https://cafeqrbuddy.com/en-gb/gdpr",
        "en-AU": "https://cafeqrbuddy.com/en-au/gdpr",
        "x-default": "https://cafeqrbuddy.com/en-us/gdpr",
      },
    },
  };
}

export default async function GdprPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tGdpr = await getTranslations({ locale, namespace: "gdpr" });

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
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-medium text-ink gap-2 px-3.5 py-2.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
            <span>EU / UK GDPR Certified Standard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tGdpr("title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {tGdpr("subtitle")}
          </p>
        </div>

        {/* Commitment Statement */}
        <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-3">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <Lock className="w-4 h-4 text-fin-orange" />
            <span>{tGdpr("commitmentTitle")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {tGdpr("commitmentDesc")}
          </p>
        </div>

        {/* Rights Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-ink">{tGdpr("rightsTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-surface-1 border border-hairline rounded-xl p-5 shadow-none flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed font-medium">{tGdpr("right1")}</p>
            </div>
            <div className="card bg-surface-1 border border-hairline rounded-xl p-5 shadow-none flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed font-medium">{tGdpr("right2")}</p>
            </div>
            <div className="card bg-surface-1 border border-hairline rounded-xl p-5 shadow-none flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed font-medium">{tGdpr("right3")}</p>
            </div>
            <div className="card bg-surface-1 border border-hairline rounded-xl p-5 shadow-none flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
              <p className="text-xs text-ink leading-relaxed font-medium">{tGdpr("right4")}</p>
            </div>
          </div>
        </div>

        {/* DPO Contact Box */}
        <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-ink">{tGdpr("dpoContactTitle")}</h3>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xl">{tGdpr("dpoContactDesc")}</p>
          </div>
          <a
            href="mailto:privacy@cafeqrbuddy.com"
            className="btn btn-primary btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 shrink-0 shadow-none inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact DPO</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
