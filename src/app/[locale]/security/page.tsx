import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft, ShieldCheck, Lock, Server, KeyRound } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/security`;

  return {
    title: "Security & PCI DSS Compliance — Cafe QRBuddy",
    description: "Our security controls, TLS 1.3 encryption, and Level 1 PCI DSS compliant payment handling.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/security",
        "en-GB": "https://cafeqrbuddy.com/en-gb/security",
        "en-AU": "https://cafeqrbuddy.com/en-au/security",
        "x-default": "https://cafeqrbuddy.com/en-us/security",
      },
    },
  };
}

export default async function SecurityPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tSec = await getTranslations({ locale, namespace: "security" });

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
            <Lock className="w-3.5 h-3.5 text-fin-orange" />
            <span>PCI-DSS Level 1 & SOC-2 Ready</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tSec("title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {tSec("subtitle")}
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
            <Lock className="w-5 h-5 text-ink mb-1" />
            <h2 className="text-base font-semibold text-ink">{tSec("infra1Title")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tSec("infra1Desc")}</p>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
            <ShieldCheck className="w-5 h-5 text-semantic-success mb-1" />
            <h2 className="text-base font-semibold text-ink">{tSec("infra2Title")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tSec("infra2Desc")}</p>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
            <Server className="w-5 h-5 text-fin-orange mb-1" />
            <h2 className="text-base font-semibold text-ink">{tSec("infra3Title")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tSec("infra3Desc")}</p>
          </div>

          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-2">
            <KeyRound className="w-5 h-5 text-ink mb-1" />
            <h2 className="text-base font-semibold text-ink">{tSec("infra4Title")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tSec("infra4Desc")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
