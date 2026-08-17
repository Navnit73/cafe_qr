import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MapPin, DollarSign, Calendar, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}`;

  return {
    title: "Sign In — Cafe QRBuddy",
    description: "Smart contactless ordering & customer service powered by Fin AI",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us",
        "en-GB": "https://cafeqrbuddy.com/en-gb",
        "en-AU": "https://cafeqrbuddy.com/en-au",
        "x-default": "https://cafeqrbuddy.com/en-us",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tRegional = await getTranslations({ locale, namespace: "regional" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 sm:p-8">
      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-on-primary font-bold text-sm tracking-tight">
            CQ
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-ink">
              {tNav("brand")}
            </span>
            <span className="badge badge-sm bg-fin-orange text-on-primary text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border-0 rounded">
              {tNav("badge")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-ink-muted">
            <a href="#help" className="hover:text-ink transition-colors">
              {tNav("help")}
            </a>
            <a href="#privacy" className="hover:text-ink transition-colors">
              {tNav("privacy")}
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center my-8 gap-6">
        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm />
        </div>

        {/* Regional Market Information Tile */}
        <div className="w-full max-w-[420px] mx-auto bg-surface-1 border border-hairline-soft rounded-lg p-3.5 text-xs">
          <div className="flex items-center justify-between font-medium text-ink mb-2">
            <span className="flex items-center gap-1.5 text-ink-muted">
              <MapPin className="w-3.5 h-3.5 text-fin-orange" />
              {tRegional("marketLabel")}
            </span>
            <span className="badge badge-xs bg-canvas text-ink-subtle border-hairline">
              {locale}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-hairline-soft">
            <div className="flex items-center gap-1 text-ink-muted">
              <DollarSign className="w-3 h-3 text-ink-subtle" />
              <span>{tRegional("currencyValue")}</span>
            </div>
            <div className="flex items-center gap-1 text-ink-muted">
              <Calendar className="w-3 h-3 text-ink-subtle" />
              <span>{tRegional("dateFormatValue")}</span>
            </div>
          </div>
          <div className="mt-1.5 text-[11px] text-ink-subtle flex items-start gap-1">
            <Sparkles className="w-3 h-3 text-fin-orange shrink-0 mt-0.5" />
            <span>{tRegional("spellingValue")}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center py-4 text-xs text-ink-tertiary">
        <p>{tFooter("copyright", { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}
