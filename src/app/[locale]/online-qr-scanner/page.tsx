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
  Smartphone,
  CheckCircle2,
  FileCheck2,
  Sparkles,
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
  const title = "Free QR Code & Barcode Scanner Online — Camera & Image Reader | QRVenues";
  const description =
    "Scan QR codes, EAN/UPC product barcodes, Code 128, Wi-Fi codes, and vCards instantly in your browser using camera or file upload. 100% free and private.";

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
            "Yes! Switch to the 'Upload Image / File' tab, drag and drop any image file (PNG, JPG, WEBP, SVG), or paste a screenshot directly using Ctrl+V or Cmd+V.",
        },
      },
      {
        "@type": "Question",
        "name": "Which barcode formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The scanner supports 2D formats (QR Code, Micro QR, Data Matrix, Aztec, PDF-417) and 1D standard barcodes (EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF, and Codabar).",
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
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 flex-1 w-full space-y-12">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-medium text-ink gap-2 px-3.5 py-2.5 rounded-full shadow-none inline-flex">
            <Scan className="w-3.5 h-3.5 text-fin-orange" />
            <span>Universal 1D & 2D Barcode Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            Online QR Code & Barcode Scanner
          </h1>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Scan QR codes, retail barcodes (EAN/UPC), inventory codes, Wi-Fi networks, and contact cards instantly via webcam or image upload. No app download required.
          </p>
        </div>

        {/* Feature Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="card bg-surface-1 border border-hairline rounded-xl p-4 text-center shadow-none space-y-1">
            <Zap className="w-5 h-5 text-fin-orange mx-auto" />
            <div className="text-xs font-semibold text-ink">Instant Detection</div>
            <div className="text-[11px] text-ink-subtle">High-FPS camera stream</div>
          </div>
          <div className="card bg-surface-1 border border-hairline rounded-xl p-4 text-center shadow-none space-y-1">
            <Layers className="w-5 h-5 text-semantic-success mx-auto" />
            <div className="text-xs font-semibold text-ink">15+ Formats</div>
            <div className="text-[11px] text-ink-subtle">QR, 1D & 2D barcodes</div>
          </div>
          <div className="card bg-surface-1 border border-hairline rounded-xl p-4 text-center shadow-none space-y-1">
            <ShieldCheck className="w-5 h-5 text-brand-blue mx-auto" />
            <div className="text-xs font-semibold text-ink">100% Private</div>
            <div className="text-[11px] text-ink-subtle">On-device client parsing</div>
          </div>
          <div className="card bg-surface-1 border border-hairline rounded-xl p-4 text-center shadow-none space-y-1">
            <Sparkles className="w-5 h-5 text-fin-orange mx-auto" />
            <div className="text-xs font-semibold text-ink">Smart Actions</div>
            <div className="text-[11px] text-ink-subtle">Open, copy, Wi-Fi connect</div>
          </div>
        </div>

        {/* Interactive Scanner Core */}
        <ScannerView />

        {/* Informational Hospitality Guide Section */}
        <div className="card bg-surface-1 border border-hairline rounded-2xl p-6 sm:p-10 shadow-none space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-ink">
              How Hospitality & Retail Venues Use Barcode Scanning
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Modern restaurants, cafes, and retail stores use QR codes and barcodes for daily operations, stock auditing, and customer table ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-canvas rounded-xl border border-hairline space-y-2">
              <div className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-fin-orange" />
                <span>Menu Testing & Verification</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Verify table QR codes and review tent cards before printing bulk batches for your dining room.
              </p>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-hairline space-y-2">
              <div className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-semantic-success" />
                <span>Inventory & Stock Checking</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Scan EAN-13 and UPC-A grocery and beverage barcodes directly using your phone or tablet camera to look up details.
              </p>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-hairline space-y-2">
              <div className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                <span>Order & Ticket Logistics</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Read Code 128 order tickets, takeaway receipts, and tracking labels with instant clipboard copy and export.
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-ink flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-fin-orange" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-ink-muted">
              Everything you need to know about scanning QR codes and barcodes online.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-sm font-semibold text-ink">
                How do I scan a QR code or barcode using my camera?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Allow camera access in your browser prompt, point your camera at any QR code or barcode, and keep it steady within the scanning frame. The reader will immediately recognize, decode, and present the result.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-sm font-semibold text-ink">
                Can I scan an image file or screenshot without a camera?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Yes! Click the &quot;Upload Image / File&quot; tab and drag in any image file (PNG, JPG, WEBP, SVG), or press Cmd+V / Ctrl+V to paste an image directly from your clipboard.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-sm font-semibold text-ink">
                Which barcode and 2D formats are supported?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                The scanner supports QR Code, Data Matrix, Aztec, PDF-417, EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, Code 93, ITF, and Codabar.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-surface-1 border border-hairline rounded-xl">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-sm font-semibold text-ink">
                Is my camera feed or uploaded image private?
              </div>
              <div className="collapse-content text-xs text-ink-muted leading-relaxed">
                Yes, completely. Decoding runs entirely on your device via client-side JavaScript / WebAssembly. No video frames, images, or decoded contents are ever sent to our servers.
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
