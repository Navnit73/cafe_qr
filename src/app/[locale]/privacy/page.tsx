import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Footer } from "@/components/footer";
import { ArrowLeft, ShieldCheck, Cookie, Mail } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://cafeqrbuddy.com/${locale.toLowerCase()}/privacy`;

  return {
    title: "Privacy Policy — Cafe QRBuddy",
    description: "Our full privacy policy outlining data collection, cookies, and protection measures.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://cafeqrbuddy.com/en-us/privacy",
        "en-GB": "https://cafeqrbuddy.com/en-gb/privacy",
        "en-AU": "https://cafeqrbuddy.com/en-au/privacy",
        "x-default": "https://cafeqrbuddy.com/en-us/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tPriv = await getTranslations({ locale, namespace: "privacy" });

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
            <span>Privacy-by-Design Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tPriv("title")}
          </h1>
          <p className="text-xs text-ink-muted">
            {tPriv("subtitle")}
          </p>
        </div>

        <div className="card bg-surface-1 border border-hairline rounded-2xl p-8 sm:p-10 shadow-none space-y-6 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-ink">1. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver high-speed digital menu rendering, QR routing, and order processing:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Operator Account Data:</strong> Name, business email, venue name, phone number, and billing details.</li>
              <li><strong>Venue Operational Data:</strong> Menu items, categories, dietary tags, pricing, and table identifiers.</li>
              <li><strong>Guest Dining Interactions:</strong> Anonymized scan timestamps, device user agents, and ordered items. Guests are never required to create accounts or download native apps.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">2. Lawful Basis & Roles under GDPR</h2>
            <p>
              Under the EU General Data Protection Regulation (GDPR) and UK Data Protection Act:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Data Processor:</strong> Cafe QRBuddy processes guest table orders and feedback solely on behalf of the subscriber venue.</li>
              <li><strong>Data Controller:</strong> Cafe QRBuddy controls account, subscription, and billing data for registered venue operators.</li>
            </ul>
          </section>

          <section id="cookies" className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink flex items-center gap-1.5">
              <Cookie className="w-4 h-4 text-fin-orange" />
              <span>3. Cookie & Local Storage Policy</span>
            </h2>
            <p>
              We prioritize privacy and do not use cross-site behavioral tracking cookies or third-party ad networks. We utilize strictly necessary cookies and browser local storage for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Maintaining secure operator authentication sessions.</li>
              <li>Preserving internationalization locale preferences (<code>en-US</code>, <code>en-GB</code>, <code>en-AU</code>).</li>
              <li>Holding in-progress tabletop order state on guest devices without requiring user logins.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">4. Third-Party Subprocessors & Payments</h2>
            <p>
              We partner with trusted, SOC-2 and PCI DSS certified infrastructure providers:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Payment Processing:</strong> Stripe Inc. (PCI DSS Level 1 Certified). Credit card numbers are tokenized and never touch our servers.</li>
              <li><strong>Cloud Hosting & CDN:</strong> AWS / Vercel (SOC-2 Type II Certified, multi-region TLS 1.3 encryption).</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">5. Data Retention & Erasure</h2>
            <p>
              Guest scan logs and order histories are automatically pseudonymized after 90 days. Operators may request complete and permanent account deletion at any time by emailing our Data Protection Desk.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-fin-orange" />
              <span>6. Data Protection Officer (DPO) Contact</span>
            </h2>
            <p>
              If you have any questions regarding our privacy practices or wish to submit a Data Subject Access Request (DSAR), please contact our Data Protection Officer at:
            </p>
            <p className="font-mono text-xs text-ink bg-canvas p-3 rounded-lg border border-hairline">
              Cafe QRBuddy Privacy & Compliance Office<br />
              Email: privacy@cafeqrbuddy.com<br />
              Address: 548 Market St, Suite 39201, San Francisco, CA 94104
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
