import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  Lock,
  Server,
  FileCheck2,
  ExternalLink,
  Mail,
  Scan,
} from "lucide-react";
import { CookieModal } from "@/components/cookie-modal";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-surface-1 border-t border-hairline-soft mt-16 text-ink">
      {/* Main Footer Navigation Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand & Trust Overview (Span 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/favicons.svg"
                alt="QRVenues logo"
                className="w-8 h-8 rounded-lg shrink-0"
                width={32}
                height={32}
              />
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-ink group-hover:text-fin-orange transition-colors">
                  {tNav("brand")}
                </span>
                <span className="badge badge-sm bg-fin-orange text-on-primary text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 border-0 rounded">
                  {tNav("badge")}
                </span>
              </div>
            </Link>

            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              {t("brandDesc")}
            </p>

            {/* Trust Badges Strip (E-E-A-T & Compliance) */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2.5">
                Trust & Security Standards
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/gdpr"
                  className="badge badge-sm bg-canvas border-hairline hover:border-ink text-ink text-[11px] gap-1.5 py-2 px-2.5 rounded-md font-medium transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
                  <span>GDPR Compliant</span>
                </Link>
                <Link
                  href="/security"
                  className="badge badge-sm bg-canvas border-hairline hover:border-ink text-ink text-[11px] gap-1.5 py-2 px-2.5 rounded-md font-medium transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-fin-orange" />
                  <span>PCI-DSS Level 1</span>
                </Link>
                <Link
                  href="/security"
                  className="badge badge-sm bg-canvas border-hairline hover:border-ink text-ink text-[11px] gap-1.5 py-2 px-2.5 rounded-md font-medium transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-ink-subtle" />
                  <span>TLS 1.3 Encryption</span>
                </Link>
                <span className="badge badge-sm bg-canvas border-hairline text-ink text-[11px] gap-1.5 py-2 px-2.5 rounded-md font-medium">
                  <Server className="w-3.5 h-3.5 text-semantic-success" />
                  <span>99.98% SLA</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 1: Industry Solutions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
              Solutions
            </h3>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/qr-code-for-restaurants" className="hover:text-ink hover:underline transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-cafes" className="hover:text-ink hover:underline transition-colors">
                  Cafes & Roasteries
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-hotels" className="hover:text-ink hover:underline transition-colors">
                  Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-bars" className="hover:text-ink hover:underline transition-colors">
                  Bars & Breweries
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-events" className="hover:text-ink hover:underline transition-colors">
                  Events & Summits
                </Link>
              </li>
              <li>
                <Link href="/qr-code-for-real-estate" className="hover:text-ink hover:underline transition-colors">
                  Real Estate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Free Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
              Tools & Studio
            </h3>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/online-qr-scanner" className="hover:text-ink hover:underline transition-colors font-medium text-fin-orange flex items-center gap-1">
                  <Scan className="w-3 h-3" />
                  <span>QR & Barcode Scanner</span>
                </Link>
              </li>
              <li>
                <Link href="/guides/free-qr-code-generator" className="hover:text-ink hover:underline transition-colors">
                  Free QR Generator
                </Link>
              </li>
              <li>
                <Link href="/guides/google-review-qr-code" className="hover:text-ink hover:underline transition-colors">
                  Google Review QR
                </Link>
              </li>
              <li>
                <Link href="/guides/wifi-qr-code-generator" className="hover:text-ink hover:underline transition-colors">
                  Wi-Fi QR Generator
                </Link>
              </li>
              <li>
                <Link href="/guides/pdf-qr-code-generator" className="hover:text-ink hover:underline transition-colors">
                  PDF QR Generator
                </Link>
              </li>
              <li>
                <Link href="/guides/qr-code-visiting-card-generator" className="hover:text-ink hover:underline transition-colors">
                  vCard Business Card QR
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & E-E-A-T */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
              {t("companyCol")}
            </h3>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/about" className="hover:text-ink hover:underline transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-ink hover:underline transition-colors font-medium text-ink">
                  {t("caseStudies")}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-ink hover:underline transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink hover:underline transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:careers@qrvenues.com"
                  className="hover:text-ink hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <span>{t("careers")}</span>
                  <ExternalLink className="w-3 h-3 text-ink-subtle" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
              {t("complianceCol")}
            </h3>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/gdpr" className="hover:text-ink hover:underline transition-colors font-medium text-ink">
                  {t("gdpr")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-ink hover:underline transition-colors">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ink hover:underline transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-ink hover:underline transition-colors">
                  {t("security")}
                </Link>
              </li>
              <li>
                <CookieModal />
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & DPO Contact Banner */}
        <div className="mt-10 pt-6 border-t border-hairline-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-subtle">
          <p>{t("registeredNotice")}</p>
          <a
            href="mailto:privacy@qrvenues.com"
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink font-medium hover:underline"
          >
            <Mail className="w-3.5 h-3.5 text-fin-orange" />
            <span>privacy@qrvenues.com (Data Protection Desk)</span>
          </a>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-surface-2 border-t border-hairline-soft py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-tertiary">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4 text-[11px] text-ink-subtle">
            <Link href="/privacy" className="hover:text-ink hover:underline">
              {t("privacy")}
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-ink hover:underline">
              {t("terms")}
            </Link>
            <span>·</span>
            <Link href="/gdpr" className="hover:text-ink hover:underline">
              {t("gdpr")}
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-ink hover:underline">
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
