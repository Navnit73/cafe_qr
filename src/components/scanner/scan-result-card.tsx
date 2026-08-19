"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Share2,
  Wifi,
  Phone,
  Mail,
  Search,
  Eye,
  EyeOff,
  QrCode,
  X,
  Clock,
  ShieldCheck,
  Package,
  User,
  FileText,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  ParsedEmail,
  ParsedPhone,
  ParsedProduct,
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

  const formatLabel = getFormatLabel(result.format);
  const dateStr = new Date(result.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parsedUrl = result.parsed.type === "url" ? (result.parsed as ParsedUrl) : null;
  const parsedWifi = result.parsed.type === "wifi" ? (result.parsed as ParsedWifi) : null;
  const parsedVCard = result.parsed.type === "vcard" ? (result.parsed as ParsedVCard) : null;
  const parsedProduct = result.parsed.type === "product" ? (result.parsed as ParsedProduct) : null;
  const parsedEmail = result.parsed.type === "email" ? (result.parsed as ParsedEmail) : null;
  const parsedPhone = result.parsed.type === "phone" ? (result.parsed as ParsedPhone) : null;

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

  // Share via Web Share API
  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Scanned ${formatLabel}`,
          text: result.rawText,
          url: parsedUrl ? parsedUrl.url : undefined,
        });
      } catch {
        // Ignored
      }
    } else {
      await handleCopyRaw();
    }
  };

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden animate-in fade-in duration-200">
      {/* Result Card Header */}
      <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 border-b border-hairline-soft bg-canvas/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge badge-sm bg-fin-orange text-white font-semibold text-xs py-2 px-2.5 rounded-lg border-0">
            {formatLabel}
          </span>
          <span className="text-[11px] text-ink-subtle flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{dateStr}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="btn btn-ghost btn-circle btn-xs text-ink-muted hover:text-ink"
          title="Clear result"
          aria-label="Clear result"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* 1. URL Content */}
        {parsedUrl && (
          <div className="space-y-3">
            <div className="p-3.5 bg-canvas border border-hairline rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-fin-orange" />
                  <span>Web Link</span>
                </span>
                {parsedUrl.isSecure && (
                  <span className="badge badge-xs bg-semantic-success/15 text-semantic-success font-medium border-0">
                    HTTPS Secure
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-ink break-all select-all font-mono">
                {parsedUrl.url}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={parsedUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none flex-1 sm:flex-initial"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-xl text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Wi-Fi Content */}
        {parsedWifi && (
          <div className="space-y-3">
            <div className="p-3.5 bg-canvas border border-hairline rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 pb-2 border-b border-hairline-soft font-semibold text-ink">
                <Wifi className="w-4 h-4 text-fin-orange" />
                <span>Wi-Fi Network</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-ink-subtle">Network (SSID):</span>
                <span className="font-bold text-ink select-all">{parsedWifi.ssid}</span>
              </div>

              {parsedWifi.password && (
                <div className="pt-2 border-t border-hairline-soft space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-subtle">Password:</span>
                    <button
                      type="button"
                      onClick={() => setShowWifiPassword(!showWifiPassword)}
                      className="text-[11px] text-ink-muted hover:text-ink flex items-center gap-1"
                    >
                      {showWifiPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-fin-orange" />}
                      <span>{showWifiPassword ? "Hide" : "Reveal"}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-surface-1 border border-hairline rounded-lg font-mono text-sm text-ink select-all">
                      {showWifiPassword ? parsedWifi.password : "••••••••"}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyWifiPass(parsedWifi.password || "")}
                      className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
                    >
                      {wifiPassCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{wifiPassCopied ? "Copied!" : "Copy Password"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Product / Barcode Content (EAN-13, UPC, Code 128) */}
        {parsedProduct && (
          <div className="space-y-3">
            <div className="p-3.5 bg-canvas border border-hairline rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                <Package className="w-4 h-4 text-fin-orange" />
                <span>Barcode / Product Number</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-ink select-all">
                {parsedProduct.code}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(parsedProduct.code)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Google</span>
              </a>

              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-xl text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Number"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. vCard / Contact Content */}
        {parsedVCard && (
          <div className="space-y-3">
            <div className="p-3.5 bg-canvas border border-hairline rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 pb-2 border-b border-hairline-soft font-semibold text-ink text-sm">
                <User className="w-4 h-4 text-fin-orange" />
                <span>{parsedVCard.formattedName || "Contact Card"}</span>
              </div>
              {parsedVCard.org && <p className="text-ink-muted">Company: {parsedVCard.org}</p>}
              {parsedVCard.phone && (
                <p className="text-ink">
                  Phone: <a href={`tel:${parsedVCard.phone}`} className="font-semibold text-fin-orange hover:underline">{parsedVCard.phone}</a>
                </p>
              )}
              {parsedVCard.email && (
                <p className="text-ink">
                  Email: <a href={`mailto:${parsedVCard.email}`} className="font-semibold text-fin-orange hover:underline">{parsedVCard.email}</a>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {parsedVCard.phone && (
                <a
                  href={`tel:${parsedVCard.phone}`}
                  className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {parsedVCard.phone}</span>
                </a>
              )}
              {parsedVCard.email && (
                <a
                  href={`mailto:${parsedVCard.email}`}
                  className="btn btn-outline btn-sm rounded-xl text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-outline btn-sm rounded-xl text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Phone / Email / Plain Text fallback */}
        {!parsedUrl && !parsedWifi && !parsedProduct && !parsedVCard && (
          <div className="space-y-3">
            <div className="p-3.5 bg-canvas border border-hairline rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-fin-orange" />
                  <span>Decoded Text</span>
                </span>
                <span className="text-ink-subtle text-[11px]">
                  {result.rawText.length} chars
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-ink whitespace-pre-wrap break-words bg-surface-1 p-2.5 rounded-lg border border-hairline select-all max-h-40 overflow-y-auto">
                {result.rawText}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {parsedPhone && (
                <a
                  href={`tel:${parsedPhone.phoneNumber}`}
                  className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {parsedPhone.phoneNumber}</span>
                </a>
              )}

              {parsedEmail && (
                <a
                  href={`mailto:${parsedEmail.email}`}
                  className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyRaw}
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold gap-1.5 shadow-none"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(result.rawText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm rounded-xl text-xs font-medium gap-1.5 border-hairline text-ink hover:bg-canvas"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </a>
            </div>
          </div>
        )}

        {/* Universal Footer Utility Bar */}
        <div className="pt-2.5 border-t border-hairline-soft flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link
            href="/#qr-studio"
            className="btn btn-ghost btn-xs text-fin-orange hover:bg-fin-orange/10 gap-1.5 font-medium"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Create QR from this</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
