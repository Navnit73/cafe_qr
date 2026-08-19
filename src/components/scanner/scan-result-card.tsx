"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Share2,
  Download,
  Wifi,
  Phone,
  Mail,
  MapPin,
  User,
  Package,
  FileText,
  Search,
  Eye,
  EyeOff,
  QrCode,
  X,
  MessageSquare,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  ParsedEmail,
  ParsedGeo,
  ParsedJson,
  ParsedPhone,
  ParsedProduct,
  ParsedSms,
  ParsedText,
  ParsedUrl,
  ParsedVCard,
  ParsedWifi,
  ScannedResult,
} from "./scanner.types";
import { getFormatLabel } from "./scanner.utils";

interface ScanResultCardProps {
  result: ScannedResult;
  onClear: () => void;
}

export function ScanResultCard({ result, onClear }: ScanResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [wifiPassCopied, setWifiPassCopied] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const formatLabel = getFormatLabel(result.format);
  const dateStr = new Date(result.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Typed views of parsed payloads
  const parsedUrl = result.parsed.type === "url" ? (result.parsed as ParsedUrl) : null;
  const parsedWifi = result.parsed.type === "wifi" ? (result.parsed as ParsedWifi) : null;
  const parsedVCard = result.parsed.type === "vcard" ? (result.parsed as ParsedVCard) : null;
  const parsedProduct = result.parsed.type === "product" ? (result.parsed as ParsedProduct) : null;
  const parsedEmail = result.parsed.type === "email" ? (result.parsed as ParsedEmail) : null;
  const parsedPhone = result.parsed.type === "phone" ? (result.parsed as ParsedPhone) : null;
  const parsedSms = result.parsed.type === "sms" ? (result.parsed as ParsedSms) : null;
  const parsedGeo = result.parsed.type === "geo" ? (result.parsed as ParsedGeo) : null;
  const parsedJson = result.parsed.type === "json" ? (result.parsed as ParsedJson) : null;
  const parsedText = result.parsed.type === "text" ? (result.parsed as ParsedText) : null;

  // Copy raw content
  const handleCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(result.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Copy wifi password
  const handleCopyWifiPass = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setWifiPassCopied(true);
      setTimeout(() => setWifiPassCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Native Web Share API
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Scanned ${formatLabel}`,
          text: result.rawText,
          url: parsedUrl ? parsedUrl.url : undefined,
        });
      } catch {
        // Share cancelled or failed
      }
    } else {
      // Fallback to copy
      await handleCopyRaw();
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  // Download raw result as text file
  const handleDownloadText = () => {
    const blob = new Blob([result.rawText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `scan-result-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download vCard file
  const handleDownloadVCard = (vCardData: string, name?: string) => {
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(name || "contact").replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card bg-surface-1 border-2 border-fin-orange/30 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-hairline-soft bg-canvas/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge badge-sm bg-fin-orange text-white font-semibold text-xs py-2 px-2.5 rounded-md border-0">
            {formatLabel}
          </span>
          <span className="badge badge-sm bg-surface-1 border border-hairline text-ink text-[11px] font-medium py-2 px-2 rounded-md">
            Source: {result.source}
          </span>
          <span className="text-[11px] text-ink-subtle flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateStr}
          </span>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="btn btn-ghost btn-circle btn-xs text-ink-muted hover:text-ink hover:bg-canvas"
          title="Clear scan result"
          aria-label="Clear result"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Specialized Content Inspectors */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* 1. URL PAYLOAD */}
        {parsedUrl && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-canvas border border-hairline rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-fin-orange">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink uppercase tracking-wide">
                    Website Link
                  </span>
                  {parsedUrl.isSecure && (
                    <span className="badge badge-xs bg-semantic-success/15 text-semantic-success font-medium border-0 px-2 py-1">
                      HTTPS Secure
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted font-mono truncate">
                  Domain: {parsedUrl.hostname}
                </p>
                <p className="text-sm font-medium text-ink break-all select-all pt-1">
                  {parsedUrl.url}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={parsedUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <span>Open Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas hover:border-ink"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Link!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. WIFI PAYLOAD */}
        {parsedWifi && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <Wifi className="w-5 h-5 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">Wi-Fi Network Configuration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-subtle block">Network Name (SSID):</span>
                  <span className="font-semibold text-ink text-sm select-all">{parsedWifi.ssid}</span>
                </div>
                <div>
                  <span className="text-ink-subtle block">Security Type:</span>
                  <span className="font-medium text-ink">{parsedWifi.security || "WPA/WPA2"}</span>
                </div>
              </div>

              {parsedWifi.password && (
                <div className="pt-2 border-t border-hairline-soft">
                  <span className="text-ink-subtle text-xs block mb-1">Wi-Fi Password:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-surface-1 border border-hairline rounded-lg font-mono text-sm text-ink flex items-center justify-between">
                      <span>
                        {showWifiPassword ? parsedWifi.password : "•".repeat(parsedWifi.password.length)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowWifiPassword(!showWifiPassword)}
                        className="btn btn-ghost btn-circle btn-xs text-ink-muted hover:text-ink"
                        title={showWifiPassword ? "Hide password" : "Show password"}
                      >
                        {showWifiPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyWifiPass(parsedWifi.password || "")}
                      className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink shrink-0 hover:bg-canvas"
                    >
                      {wifiPassCopied ? (
                        <Check className="w-3.5 h-3.5 text-semantic-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{wifiPassCopied ? "Copied!" : "Copy Password"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. VCARD CONTACT PAYLOAD */}
        {parsedVCard && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <User className="w-5 h-5 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">
                  {parsedVCard.formattedName || "Digital Contact Card"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {parsedVCard.org && (
                  <div>
                    <span className="text-ink-subtle block">Company / Venue:</span>
                    <span className="font-semibold text-ink">{parsedVCard.org}</span>
                  </div>
                )}
                {parsedVCard.title && (
                  <div>
                    <span className="text-ink-subtle block">Role:</span>
                    <span className="font-medium text-ink">{parsedVCard.title}</span>
                  </div>
                )}
                {parsedVCard.phone && (
                  <div>
                    <span className="text-ink-subtle block">Phone:</span>
                    <a
                      href={`tel:${parsedVCard.phone}`}
                      className="font-medium text-fin-orange hover:underline"
                    >
                      {parsedVCard.phone}
                    </a>
                  </div>
                )}
                {parsedVCard.email && (
                  <div>
                    <span className="text-ink-subtle block">Email:</span>
                    <a
                      href={`mailto:${parsedVCard.email}`}
                      className="font-medium text-fin-orange hover:underline"
                    >
                      {parsedVCard.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleDownloadVCard(
                    parsedVCard.rawVCard,
                    parsedVCard.formattedName
                  )
                }
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Contact (.vcf)</span>
              </button>

              {parsedVCard.phone && (
                <a
                  href={`tel:${parsedVCard.phone}`}
                  className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {parsedVCard.phone}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 4. PRODUCT BARCODE (EAN/UPC) PAYLOAD */}
        {parsedProduct && (
          <div className="space-y-4">
            <div className="p-5 bg-canvas border border-hairline rounded-xl space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <Package className="w-5 h-5 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">Retail / Inventory Barcode</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-ink-subtle block">Barcode Number:</span>
                <span className="font-mono text-2xl font-bold tracking-widest text-ink select-all">
                  {parsedProduct.code}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(parsedProduct.code)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lookup on Google</span>
              </a>

              <a
                href={`https://world.openfoodfacts.org/product/${parsedProduct.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Open Food Facts</span>
              </a>

              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Number"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. EMAIL PAYLOAD */}
        {parsedEmail && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <Mail className="w-4 h-4 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">Email Message</span>
              </div>
              <p className="font-medium text-ink text-sm">{parsedEmail.email}</p>
              {parsedEmail.subject && (
                <p className="text-ink-muted">Subject: {parsedEmail.subject}</p>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={`mailto:${parsedEmail.email}${parsedEmail.subject ? `?subject=${encodeURIComponent(parsedEmail.subject)}` : ""}`}
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Compose Email</span>
              </a>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Email</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. PHONE PAYLOAD */}
        {parsedPhone && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <Phone className="w-4 h-4 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">Phone Number</span>
              </div>
              <p className="font-mono text-lg font-bold text-ink">{parsedPhone.phoneNumber}</p>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${parsedPhone.phoneNumber}`}
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Number</span>
              </a>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Number</span>
              </button>
            </div>
          </div>
        )}

        {/* 7. SMS PAYLOAD */}
        {parsedSms && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <MessageSquare className="w-4 h-4 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">SMS Text</span>
              </div>
              <p className="font-mono text-lg font-bold text-ink">{parsedSms.phoneNumber}</p>
              {parsedSms.message && (
                <p className="text-xs text-ink-muted">Message: {parsedSms.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={`sms:${parsedSms.phoneNumber}`}
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send SMS</span>
              </a>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Number</span>
              </button>
            </div>
          </div>
        )}

        {/* 8. GEO LOCATION PAYLOAD */}
        {parsedGeo && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-hairline-soft">
                <MapPin className="w-4 h-4 text-fin-orange" />
                <span className="text-sm font-semibold text-ink">Geographic Location</span>
              </div>
              <p className="text-xs text-ink-muted font-mono">
                Lat: {parsedGeo.latitude}, Lng: {parsedGeo.longitude}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${parsedGeo.latitude},${parsedGeo.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        )}

        {/* 9. JSON PAYLOAD */}
        {parsedJson && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-fin-orange" />
                  <span className="text-sm font-semibold text-ink">Structured JSON Data</span>
                </div>
                <span className="badge badge-xs bg-surface-1 border border-hairline text-ink">JSON</span>
              </div>
              <pre className="text-xs font-mono bg-surface-1 p-3 rounded-lg border border-hairline overflow-x-auto text-ink max-h-48">
                {parsedJson.jsonString}
              </pre>
            </div>

            <button
              type="button"
              onClick={handleCopyRaw}
              className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied JSON!" : "Copy JSON Data"}</span>
            </button>
          </div>
        )}

        {/* 10. PLAIN TEXT PAYLOAD */}
        {parsedText && (
          <div className="space-y-4">
            <div className="p-4 bg-canvas border border-hairline rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-fin-orange" />
                  <span className="text-sm font-semibold text-ink">Decoded Text Content</span>
                </div>
                <span className="text-[11px] text-ink-subtle">
                  {result.rawText.length} characters
                </span>
              </div>
              <p className="text-sm text-ink whitespace-pre-wrap break-words font-mono bg-surface-1 p-3 rounded-lg border border-hairline select-all">
                {result.rawText}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-primary btn-sm rounded-lg text-xs font-medium gap-1.5 shadow-none"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied Text!" : "Copy Text"}</span>
              </button>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(result.rawText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm rounded-lg text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Google</span>
              </a>
            </div>
          </div>
        )}

        {/* Universal Secondary Action Strip */}
        <div className="pt-3 border-t border-hairline-soft flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-ghost btn-xs text-ink-muted hover:text-ink hover:bg-canvas gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharedToast ? "Copied for Sharing!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadText}
              className="btn btn-ghost btn-xs text-ink-muted hover:text-ink hover:bg-canvas gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save .txt</span>
            </button>
          </div>

          <Link
            href="/#qr-studio"
            className="btn btn-ghost btn-xs text-fin-orange hover:bg-fin-orange/10 gap-1.5 font-medium"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generate QR from this</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
