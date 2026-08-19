import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScannerView } from "@/components/scanner";
import {
  Scan,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
} from "lucide-react";

interface ScannerPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ScannerPageProps): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `https://qrvenues.com/${locale}/online-qr-scanner`;
  const title = "Free QR Code & Barcode Scanner Online | QRVenues";
  const description =
    "Scan QR codes, EAN/UPC product barcodes, Code 128, Wi-Fi codes, and contacts instantly in your browser via camera or image upload. Fast, free, and 100% private.";

  return {
    title,
    description,
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
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": "https://qrvenues.com/en-us/online-qr-scanner",
        "en-GB": "https://qrvenues.com/en-gb/online-qr-scanner",
        "en-AU": "https://qrvenues.com/en-au/online-qr-scanner",
        "x-default": "https://qrvenues.com/en-us/online-qr-scanner",
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

export default async function OnlineQrScannerPage({ params }: ScannerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Structured Data: Breadcrumbs
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
        "name": "Online QR & Barcode Scanner",
        "item": `https://qrvenues.com/${locale}/online-qr-scanner`,
      },
    ],
  };

  // Structured Data: WebApplication
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QRVenues Online QR & Barcode Scanner",
    "url": `https://qrvenues.com/${locale}/online-qr-scanner`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description":
      "Free browser-based camera and image scanner for QR codes, EAN-13, UPC-A, Code-128, Data Matrix, Aztec, and PDF-417 barcodes.",
  };

  // Structured Data: FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I scan a QR code or barcode using my camera?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Allow camera permissions when prompted by your browser, hold the QR code or barcode within the highlighted frame, and the reader will automatically detect and decode the content instantly.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I scan a barcode from an image or screenshot?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes! Switch to the 'Upload Image' tab, drag and drop any image file (PNG, JPG, WEBP, SVG), or paste a screenshot directly using Ctrl+V or Cmd+V.",
        },
      },
      {
        "@type": "Question",
        "name": "Which barcode formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The scanner supports 2D formats (QR Code, Data Matrix, Aztec, PDF-417) and 1D standard barcodes (EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF).",
        },
      },
      {
        "@type": "Question",
        "name": "Is scanning private and secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. All image processing and barcode decoding is performed 100% locally in your device's browser memory. No images or camera feeds are ever transmitted to external servers.",
        },
      },
    ],
  };

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
            Scan QR codes, retail product barcodes (EAN/UPC), logistics codes, and Wi-Fi networks in your browser. Fast, free, and private.
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

        {/* Frequently Asked Questions */}
        <div className="space-y-4 pt-6 border-t border-hairline-soft max-w-3xl mx-auto">
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
            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-2xl">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xs sm:text-sm font-semibold text-ink">
                How do I scan a QR code or barcode using my camera?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Allow camera access in your browser, point your camera at any QR code or barcode, and keep it steady within the scanning frame. The reader will immediately recognize, decode, and present the result.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-2xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xs sm:text-sm font-semibold text-ink">
                Can I scan an image file or screenshot without a camera?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Yes! Click the &quot;Upload Image&quot; tab and drag in any image file (PNG, JPG, WEBP, SVG), or press Cmd+V / Ctrl+V to paste an image directly from your clipboard.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-2xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xs sm:text-sm font-semibold text-ink">
                Which barcode formats are supported?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                The scanner supports QR Code, Data Matrix, Aztec, PDF-417, EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, and ITF.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-2xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xs sm:text-sm font-semibold text-ink">
                Is my camera feed or uploaded image private?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Yes, completely. Decoding runs entirely on your device via client-side JavaScript. No video frames, images, or decoded contents are ever sent to external servers.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
