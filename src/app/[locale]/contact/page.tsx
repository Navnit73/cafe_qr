import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mail, MessageSquare, Building2, ShieldCheck, Clock } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}/contact`;
  const title = "Contact & Support — QRVenues";
  const description = "Contact the QRVenues hospitality operations and compliance desk.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us/contact",
        "en-GB": "https://qrvenues.com/en-gb/contact",
        "en-AU": "https://qrvenues.com/en-au/contact",
        "x-default": "https://qrvenues.com/en-us/contact",
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

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tContact = await getTranslations({ locale, namespace: "contact" });

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
        "name": "Contact Us",
        "item": `https://qrvenues.com/${locale}/contact`,
      },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "QRVenues Support & Compliance Desk",
    "url": `https://qrvenues.com/${locale}/contact`,
    "description": "24/7 Global Hospitality Operations, Enterprise Solutions and Compliance Support.",
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Common Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-medium text-ink gap-2 px-3.5 py-2.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-fin-orange" />
            <span>24/7 Global Hospitality Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            {tContact("title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {tContact("subtitle")}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Support Desk */}
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3">
            <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-ink">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-ink">{tContact("deskTitle")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tContact("deskHours")}</p>
            <a
              href={`mailto:${tContact("deskEmail")}`}
              className="btn btn-primary btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 w-fit shadow-none inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{tContact("deskEmail")}</span>
            </a>
          </div>

          {/* Card 2: Sales & Enterprise */}
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3">
            <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-fin-orange">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-ink">{tContact("salesTitle")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tContact("salesDesc")}</p>
            <a
              href={`mailto:${tContact("salesEmail")}`}
              className="btn bg-surface-1 border border-hairline hover:bg-canvas text-ink btn-sm rounded-lg text-xs font-medium h-9 min-h-9 px-4 w-fit shadow-none inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{tContact("salesEmail")}</span>
            </a>
          </div>

          {/* Card 3: Privacy & DPO */}
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3">
            <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-semantic-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-ink">{tContact("complianceTitle")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tContact("complianceDesc")}</p>
            <a
              href={`mailto:${tContact("complianceEmail")}`}
              className="text-xs font-medium text-ink hover:underline inline-flex items-center gap-1"
            >
              <span>{tContact("complianceEmail")}</span>
            </a>
          </div>

          {/* Card 4: Office Address */}
          <div className="card bg-surface-1 border border-hairline rounded-xl p-6 shadow-none space-y-3">
            <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-ink">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-ink">{tContact("officeTitle")}</h2>
            <p className="text-xs text-ink-muted leading-relaxed">{tContact("officeAddress")}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
