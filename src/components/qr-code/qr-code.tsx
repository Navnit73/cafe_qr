"use client";

import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import {
  Download,
  Copy,
  Check,
  UtensilsCrossed,
  Star,
  Smartphone,
  QrCode as QrIcon,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

import type { QRCodeProps, FramePreset } from "./qr-code.types";
import {
  downloadQRCode,
  copyValueToClipboard,
  applyCanvasGradient,
} from "./qr-code.utils";

// ---------------------------------------------------------------------------
// Frame preset configurations (Refined with Green/Blue/Lime/Orange palettes & )
// ---------------------------------------------------------------------------
interface FrameInfo {
  label: string;
  icon: React.ElementType;
  position: "top" | "bottom" | "card";
  bgClass: string;
  textClass: string;
  borderClass: string;
  subtext?: string;
}

const FRAME_CONFIG: Record<Exclude<FramePreset, "none">, FrameInfo> = {
  menu: {
    label: "Scan for Menu",
    subtext: "Dine-in & Takeaway",
    icon: UtensilsCrossed,
    position: "top",
    bgClass: "bg-[#f0fdf4]",
    textClass: "text-[#059669]",
    borderClass: "border-[#bbf7d0]",
  },
  review: {
    label: "Review Us on Google",
    subtext: "★★★★★ 5.0 Rating",
    icon: Star,
    position: "top",
    bgClass: "bg-[#fff7f2]",
    textClass: "text-[#ea580c]",
    borderClass: "border-[#fed7aa]",
  },
  order: {
    label: "Scan to Order & Pay",
    subtext: "Fast Contactless Table Service",
    icon: Smartphone,
    position: "top",
    bgClass: "bg-[#eff6ff]",
    textClass: "text-[#2563eb]",
    borderClass: "border-[#bfdbfe]",
  },
  "scan-me": {
    label: "SCAN ME",
    icon: Sparkles,
    position: "bottom",
    bgClass: "bg-[#f7fee7]",
    textClass: "text-[#4d7c0f]",
    borderClass: "border-[#d9f99d]",
  },
  badge: {
    label: "Point Camera to Scan",
    icon: QrIcon,
    position: "bottom",
    bgClass: "bg-[#ecfeff]",
    textClass: "text-[#0891b2]",
    borderClass: "border-[#a5f3fc]",
  },
  card: {
    label: "Tabletop Digital Portal",
    subtext: "Instant contactless access",
    icon: QrIcon,
    position: "card",
    bgClass: "bg-surface-2",
    textClass: "text-ink",
    borderClass: "border-hairline",
  },
};

// ---------------------------------------------------------------------------
// QRCode component
// ---------------------------------------------------------------------------
export const QRCode = React.memo(function QRCode({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#111111",
  logo,
  logoSize,
  level,
  includeMargin = true,
  style,
  className,
  rounded = false,
  downloadable = false,
  format = "png",
  gradient,
  animated = true,
  frame = "none",
  frameLabel,
  frameBgColor,
  frameTextColor,
  alt = "QR Code",
  ariaLabel,
}: QRCodeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // When a logo is present, force high error correction for scannability
  const effectiveLevel = useMemo(
    () => level ?? (logo ? "H" : "H"),
    [level, logo]
  );

  const effectiveLogoSize = useMemo(
    () => logoSize ?? Math.round(size * 0.22),
    [logoSize, size]
  );

  // Image settings for qrcode.react logo overlay
  const imageSettings = useMemo(() => {
    if (!logo) return undefined;
    return {
      src: logo,
      height: effectiveLogoSize,
      width: effectiveLogoSize,
      // Excavate a clear white zone so modules don't clash with logo
      excavate: true,
    };
  }, [logo, effectiveLogoSize]);

  // ---------------------------------------------------------------------------
  // Apply gradient after canvas render
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!gradient || format === "svg") return;

    const timer = setTimeout(() => {
      const canvas = wrapperRef.current?.querySelector("canvas");
      if (canvas) {
        applyCanvasGradient(
          canvas,
          gradient.from,
          gradient.to,
          gradient.direction || "to bottom right"
        );
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [gradient, format, value, size, fgColor, bgColor, effectiveLevel]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const handleDownload = useCallback(async () => {
    if (!wrapperRef.current) return;
    setDownloading(true);
    try {
      await downloadQRCode(
        wrapperRef.current,
        `qr-${value.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_") || "code"}`,
        format
      );
    } catch (err) {
      console.error("QR download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [value, format]);

  const handleCopy = useCallback(async () => {
    const ok = await copyValueToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  // ---------------------------------------------------------------------------
  // Shared QR props
  // ---------------------------------------------------------------------------
  const qrProps = useMemo(
    () => ({
      value: value || "https://qrvenues.com",
      size,
      bgColor,
      fgColor,
      level: effectiveLevel as "L" | "M" | "Q" | "H",
      includeMargin,
      imageSettings,
    }),
    [value, size, bgColor, fgColor, effectiveLevel, includeMargin, imageSettings]
  );

  // ---------------------------------------------------------------------------
  // Render the QR element
  // ---------------------------------------------------------------------------
  const qrElement = useMemo(() => {
    if (format === "svg" && !gradient) {
      return <QRCodeSVG {...qrProps} />;
    }
    return <QRCodeCanvas {...qrProps} />;
  }, [format, gradient, qrProps]);

  // ---------------------------------------------------------------------------
  // Rounded module style
  // ---------------------------------------------------------------------------
  const roundedStyle: React.CSSProperties | undefined = rounded
    ? {
        borderRadius: "var(--radius-md, 8px)",
        overflow: "hidden",
      }
    : undefined;

  // ---------------------------------------------------------------------------
  // Frame configurations
  // ---------------------------------------------------------------------------
  const frameInfo = frame !== "none" ? FRAME_CONFIG[frame] : null;
  const resolvedFrameLabel = frameLabel ?? frameInfo?.label ?? "";
  const IconComponent = frameInfo?.icon || QrIcon;

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "inline-flex flex-col items-center",
        animated && "animate-[qr-appear_400ms_ease-out_both]",
        className
      )}
      style={style}
      role="img"
      aria-label={ariaLabel ?? alt}
    >
      {/* Outer Card Wrapper with  and clean borders */}
      <div
        className={clsx(
          "bg-surface-1 border border-hairline rounded-xl  overflow-hidden transition-all",
          frame !== "none" && "p-2"
        )}
      >
        {/* Top Banner Frame */}
        {frameInfo && (frameInfo.position === "top" || frameInfo.position === "card") && (
          <div
            className={clsx(
              "flex flex-col items-center justify-center px-4 py-2.5 rounded-lg mb-2 border ",
              frameInfo.bgClass,
              frameInfo.textClass,
              frameInfo.borderClass
            )}
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
            }}
          >
            <div className="flex items-center gap-1.5 font-semibold text-xs tracking-tight">
              <IconComponent className="w-3.5 h-3.5 shrink-0" />
              <span>{resolvedFrameLabel}</span>
            </div>
            {frameInfo.subtext && (
              <span className="text-[10px] opacity-80 font-medium">
                {frameInfo.subtext}
              </span>
            )}
          </div>
        )}

        {/* QR Code Canvas Area */}
        <div
          className="bg-surface-1 p-2 flex items-center justify-center rounded-lg"
          style={roundedStyle}
        >
          {qrElement}
        </div>

        {/* Bottom Banner Frame / SCAN ME pill */}
        {frameInfo && (frameInfo.position === "bottom" || frameInfo.position === "card") && (
          <div
            className={clsx(
              "flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg mt-2 text-xs font-semibold tracking-wider uppercase border ",
              frameInfo.bgClass,
              frameInfo.textClass,
              frameInfo.borderClass
            )}
            style={{
              backgroundColor: frameBgColor,
              color: frameTextColor,
            }}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{resolvedFrameLabel}</span>
          </div>
        )}
      </div>

      {/* Action buttons (Download PNG/SVG & Copy) */}
      {downloadable && (
        <div className="flex items-center gap-2 mt-3">
          <div className="tooltip tooltip-bottom" data-tip={`Download as ${format.toUpperCase()}`}>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-xs bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs font-medium h-7 min-h-7 px-3 rounded-md gap-1.5 "
              aria-label={`Download QR code as ${format.toUpperCase()}`}
            >
              <Download className="w-3.5 h-3.5 text-fin-orange" />
              <span>{downloading ? "Exporting..." : `Download ${format.toUpperCase()}`}</span>
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Copy value to clipboard">
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-xs bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs font-medium h-7 min-h-7 px-3 rounded-md gap-1.5 "
              aria-label="Copy QR value to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-semantic-success" />
                  <span className="text-semantic-success font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

QRCode.displayName = "QRCode";
