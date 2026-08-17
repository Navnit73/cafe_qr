import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Scale } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}/terms`;
  const title = "Terms of Service — QRVenues";
  const description = "Terms and conditions governing the use of QRVenues software and services.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us/terms",
        "en-GB": "https://qrvenues.com/en-gb/terms",
        "en-AU": "https://qrvenues.com/en-au/terms",
        "x-default": "https://qrvenues.com/en-us/terms",
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

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tTerms = await getTranslations({ locale, namespace: "terms" });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://qrvenues.com/${locale}`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Terms of Service",
        "item": `https://qrvenues.com/${locale}/terms`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Common Header */}
      <Header />

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
              By creating an account, generating QR codes, or accessing the QRVenues platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a restaurant, cafe, or business entity, you represent that you possess full authority to bind that entity.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">2. Description of Services & SLA</h2>
            <p>
              QRVenues provides digital hospitality management tools including dynamic QR code menus, table ordering queues, Google review link routing, private feedback loops, and guest WiFi generators. We guarantee a 99.98% uptime Service Level Agreement (SLA) for public-facing guest menu resolution endpoints.
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
              All menu data, logos, prices, photographs, and business profile materials uploaded to the platform remain your sole intellectual property. QRVenues claims no ownership over your venue assets. You grant QRVenues a non-exclusive license strictly to render, format, and display your menu content to your guests.
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
              To the maximum extent permitted by applicable law, QRVenues shall not be liable for any indirect, incidental, punitive, or consequential damages arising from business interruptions, device incompatibilities, or guest network outages.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline-soft">
            <h2 className="text-base font-semibold text-ink">7. Governing Law & Contact</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of California, USA, without regard to its conflict of law principles. For legal inquiries regarding these terms, contact our legal counsel at <a href="mailto:legal@qrvenues.com" className="text-ink font-medium hover:underline">legal@qrvenues.com</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
