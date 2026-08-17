import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft, Scale } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/terms`;

  return {
    title: "Terms of Service — Cafe QRBuddy",
    description: "Terms and conditions governing the use of Cafe QRBuddy software and services.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/terms",
        "en-GB": "https://cafeqrbuddy.com/en-gb/terms",
        "en-AU": "https://cafeqrbuddy.com/en-au/terms",
        "x-default": "https://cafeqrbuddy.com/en-us/terms",
      },
    },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tTerms = await getTranslations({ locale, namespace: "terms" });

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
            <Scale className="w-3.5 h-3.5 text-fin-orange" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tTerms("title")}
          </h1>
          <p className="text-xs text-ink-muted">
            {tTerms("subtitle")}
          </p>
        </div>

        <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-6 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">1. Agreement to Terms</h2>
            <p>
              By creating an account, generating QR codes, or accessing the Cafe QRBuddy platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a restaurant, cafe, or business entity, you represent that you possess full authority to bind that entity.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">2. Description of Services & SLA</h2>
            <p>
              Cafe QRBuddy provides digital hospitality management tools including dynamic QR code menus, table ordering queues, Google review link routing, private feedback loops, and guest WiFi generators. We guarantee a 99.98% uptime Service Level Agreement (SLA) for public-facing guest menu resolution endpoints.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">3. Subscription, Billing & Cancellation</h2>
            <p>
              Free tier features remain free without requiring a credit card. Paid subscriptions are billed on a recurring monthly or annual basis. You may cancel your subscription at any time directly through your dashboard settings. Upon cancellation, your account will remain active until the end of the current billing period without early termination penalties.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">4. Customer Data & Intellectual Property</h2>
            <p>
              All menu data, logos, prices, photographs, and business profile materials uploaded to the platform remain your sole intellectual property. Cafe QRBuddy claims no ownership over your venue assets. You grant Cafe QRBuddy a non-exclusive license strictly to render, format, and display your menu content to your guests.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">5. Acceptable Use & Conduct</h2>
            <p>
              You agree not to use the Service for any unlawful activities, malicious redirection of QR codes, deceptive Google review manipulation, or unauthorized scraping of guest information. Any violation may result in immediate suspension of account privileges.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Cafe QRBuddy shall not be liable for any indirect, incidental, punitive, or consequential damages arising from business interruptions, device incompatibilities, or guest network outages.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">7. Governing Law & Contact</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of California, USA, without regard to its conflict of law principles. For legal inquiries regarding these terms, contact our legal counsel at <a href="mailto:legal@cafeqrbuddy.com" className="text-ink font-medium hover:underline">legal@cafeqrbuddy.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
