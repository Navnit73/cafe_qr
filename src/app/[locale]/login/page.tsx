import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LoginForm } from "@/components/auth/login-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/login`;

  return {
    title: "Sign In — Cafe QRBuddy",
    description: "Sign in to your Cafe QRBuddy dashboard to manage menus, tables, and AI orders.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/login",
        "en-GB": "https://cafeqrbuddy.com/en-gb/login",
        "en-AU": "https://cafeqrbuddy.com/en-au/login",
        "x-default": "https://cafeqrbuddy.com/en-us/login",
      },
    },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tAuth = await getTranslations({ locale, namespace: "auth" });

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
            <span>{tAuth("backToHome")}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-ink">
                {tNav("brand")}
              </span>
              <span className="badge badge-sm bg-fin-orange text-on-primary text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border-0 rounded">
                {tNav("badge")}
              </span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex flex-col items-center justify-center my-12 px-4">
        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
