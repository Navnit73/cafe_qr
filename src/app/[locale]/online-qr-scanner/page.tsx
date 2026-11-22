import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScannerView } from "@/components/scanner";
import { HIGH_DEMAND_TOOLS } from "@/lib/tools";
import {
  constructMetadata,
  getLocaleCurrency,
  generateBreadcrumbSchema,
  generateWebAppSchema,
  generateFaqSchema,
} from "@/lib/seo";
import {
  Scan,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
  QrCode,
  ArrowRight,
} from "lucide-react";

interface ScannerPageProps {
  params: Promise<{ locale: string }>;
}

const SCANNER_FAQS = [
  {
    question: "How do I scan a QR code or barcode using my camera?",
    answer:
      "Allow camera permissions when prompted by your browser, hold the QR code or barcode within the highlighted frame, and the reader will automatically detect and decode the content instantly.",
  },
  {
    question: "Can I scan a barcode from an image file or screenshot without a camera?",
    answer:
      "Yes! Switch to the 'Upload Image' tab, drag and drop any image file (PNG, JPG, WEBP, SVG), or paste a screenshot directly using Ctrl+V or Cmd+V.",
  },
  {
    question: "Which barcode formats are supported?",
    answer:
      "The scanner supports 2D formats (QR Code, Data Matrix, Aztec, PDF-417) and 1D standard barcodes (EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF).",
  },
  {
    question: "Is my camera feed or uploaded image private and secure?",
    answer:
      "Yes, completely. All image processing and barcode decoding is performed 100% locally in your device's browser memory. No video frames, images, or decoded contents are ever transmitted to external servers.",
  },
];

export async function generateMetadata({
  params,
}: ScannerPageProps): Promise<Metadata> {
  const { locale } = await params;
  return constructMetadata({
    title: "Free Online QR Code & Barcode Scanner — Camera & Image Reader",
    description:
      "Scan QR codes, EAN/UPC product barcodes, Code 128, Wi-Fi codes, and contacts instantly in your browser via camera or image upload. Fast, free, and 100% private.",
    path: "/online-qr-scanner",
    locale,
    ogBadge: "Free Online Scanner",
    keywords: [
      "online qr scanner",
      "qr code scanner",
      "online barcode scanner",
      "barcode reader",
      "scan qr code from image",
      "camera barcode scanner",
      "ean 13 barcode reader",
      "upc scanner online",
      "wifi qr code reader",
      "free qr scanner web",
    ],
  });
}

export default async function OnlineQrScannerPage({
  params,
}: ScannerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Online QR & Barcode Scanner", url: `/${locale}/online-qr-scanner` },
  ]);

  const webAppSchema = generateWebAppSchema({
    name: "QRVenues Online QR & Barcode Scanner",
    url: `/${locale}/online-qr-scanner`,
    category: "UtilitiesApplication",
    currency: getLocaleCurrency(locale),
    description:
      "Free browser-based camera and image scanner for QR codes, EAN-13, UPC-A, Code-128, Data Matrix, Aztec, and PDF-417 barcodes.",
  });

  const faqSchema = generateFaqSchema(SCANNER_FAQS);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full space-y-8 sm:space-y-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge badge-sm bg-surface-1 border border-hairline text-xs font-semibold text-ink gap-1.5 px-3 py-2 rounded-full shadow-2xs inline-flex">
            <Scan className="w-3.5 h-3.5 text-fin-orange" />
            <span>Fast QR & Barcode Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            Online QR Code & Barcode Scanner
          </h1>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-lg mx-auto">
            Scan QR codes, retail product barcodes (EAN/UPC), logistics codes,
            and Wi-Fi networks in your browser. Fast, free, and private.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-hairline text-ink font-medium">
            <Zap className="w-3.5 h-3.5 text-fin-orange" />
            <span>Instant Detection</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-hairline text-ink font-medium">
            <Layers className="w-3.5 h-3.5 text-semantic-success" />
            <span>1D & 2D Formats</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-1 border border-hairline text-ink font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
            <span>100% Client-Side Private</span>
          </span>
        </div>

        {/* Interactive Scanner Core */}
        <ScannerView />

        {/* Frequently Asked Questions (100% synced with FAQPage JSON-LD) */}
        <section className="space-y-4 pt-6 border-t border-hairline-soft max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-fin-orange" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-ink-muted">
              Common questions about scanning barcodes & QR codes online
            </p>
          </div>

          <div className="space-y-2">
            {SCANNER_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-2xl"
              >
                <input
                  type="radio"
                  name="scanner-faq-accordion"
                  aria-label={faq.question}
                  defaultChecked={idx === 0}
                />
                <div className="collapse-title text-xs sm:text-sm font-semibold text-ink">
                  {faq.question}
                </div>
                <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Link to Free QR Generators */}
        <section className="space-y-4 pt-6 border-t border-hairline-soft">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-fin-orange" />
            <h2 className="text-base font-semibold text-ink">
              Need to Create a Custom QR Code?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HIGH_DEMAND_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="card bg-surface-1 border border-hairline rounded-xl p-4 shadow-none hover:border-ink transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-ink group-hover:text-fin-orange transition-colors">
                    {tool.shortLabel}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-fin-orange group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
                <p className="text-[11px] text-ink-muted">{tool.navDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
