import { Link } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QrCode, Scan, BookOpen, Home, ArrowRight } from "lucide-react";

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-16">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="badge badge-lg bg-surface-1 border border-hairline text-xs font-semibold text-fin-orange px-3.5 py-2.5 rounded-full">
            Error 404 · Page Not Found
          </div>

          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-ink">
            We couldn&apos;t find that page
          </h1>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-lg mx-auto">
            The link may have moved or expired. Explore our free QR code studio,
            live camera barcode scanner, or hospitality guides below.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="btn btn-primary h-11 min-h-11 px-6 rounded-lg text-xs font-medium inline-flex items-center gap-2 shadow-none w-full sm:w-auto"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
            <Link
              href="/online-qr-scanner"
              className="btn bg-surface-1 border border-hairline hover:bg-surface-2 text-ink h-11 min-h-11 px-5 rounded-lg text-xs font-medium inline-flex items-center gap-2 shadow-none w-full sm:w-auto"
            >
              <Scan className="w-4 h-4 text-fin-orange" />
              <span>Open QR Scanner</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-left">
            <Link
              href="/qr-code-menu-generator"
              className="card bg-surface-1 border border-hairline hover:border-ink rounded-xl p-4 shadow-none transition-colors group"
            >
              <QrCode className="w-4 h-4 text-fin-orange mb-2" />
              <div className="text-xs font-semibold text-ink group-hover:text-fin-orange flex items-center justify-between">
                <span>QR Menu Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Build restaurant & cafe menus free.
              </p>
            </Link>

            <Link
              href="/wifi-qr-code-generator"
              className="card bg-surface-1 border border-hairline hover:border-ink rounded-xl p-4 shadow-none transition-colors group"
            >
              <QrCode className="w-4 h-4 text-primary mb-2" />
              <div className="text-xs font-semibold text-ink group-hover:text-fin-orange flex items-center justify-between">
                <span>Wi-Fi QR Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                1-tap guest Wi-Fi cards.
              </p>
            </Link>

            <Link
              href="/guides"
              className="card bg-surface-1 border border-hairline hover:border-ink rounded-xl p-4 shadow-none transition-colors group"
            >
              <BookOpen className="w-4 h-4 text-semantic-success mb-2" />
              <div className="text-xs font-semibold text-ink group-hover:text-fin-orange flex items-center justify-between">
                <span>QR Code Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Print specs & step-by-step tutorials.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
