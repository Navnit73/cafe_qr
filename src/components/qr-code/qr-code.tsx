"use client";

import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
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
  copyValueToClipboard,
  applyCanvasGradient,
  svgToString,
} from "./qr-code.utils";
import { QRCodeDownloadModal } from "./qr-code-download-modal";

// ---------------------------------------------------------------------------
// Frame preset configurations
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
    bgClass: "bg-secondary",
    textClass: "text-primary",
    borderClass: "border-primary/20",
  },
  review: {
    label: "Review Us on Google",
    subtext: "★★★★★ 5.0 Rating",
    icon: Star,
    position: "top",
    bgClass: "bg-surface-2",
    textClass: "text-brand-orange",
    borderClass: "border-brand-orange/30",
  },
  order: {
    label: "Scan to Order & Pay",
    subtext: "Fast Contactless Table Service",
    icon: Smartphone,
    position: "top",
    bgClass: "bg-surface-2",
    textClass: "text-link-blue",
    borderClass: "border-link-blue/30",
  },
  "scan-me": {
    label: "SCAN ME",
    icon: Sparkles,
    position: "bottom",
    bgClass: "bg-secondary",
    textClass: "text-primary",
    borderClass: "border-primary/20",
  },
  badge: {
    label: "Point Camera to Scan",
    icon: QrIcon,
    position: "bottom",
    bgClass: "bg-surface-2",
    textClass: "text-link-blue",
    borderClass: "border-link-blue/30",
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

export interface QRCodeHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getSvgString: () => string | null;
  wrapperElement: HTMLDivElement | null;
}

// ---------------------------------------------------------------------------
// QRCode component
// ---------------------------------------------------------------------------
export const QRCode = forwardRef<QRCodeHandle, QRCodeProps>(function QRCode(
  {
    value,
    size = 200,
    bgColor = "#ffffff",
    fgColor = "#0a1530",
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
    frameSubtext,
    frameBgColor,
    frameTextColor,
    alt = "QR Code",
    ariaLabel,
    processingSeconds = 15,
  },
  ref
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Expose imperative handle for external canvas and SVG extraction
  useImperativeHandle(ref, () => ({
    getCanvas: () => wrapperRef.current?.querySelector("canvas") ?? null,
    getSvgString: () => {
      const svg = wrapperRef.current?.querySelector("svg");
      return svg ? svgToString(svg) : null;
    },
    wrapperElement: wrapperRef.current,
  }));

  // Force level "H" when logo is attached for maximum scannability
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
      excavate: true,
    };
  }, [logo, effectiveLogoSize]);

  // Apply gradient to canvas after render
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

  // Copy helper
  const handleCopy = useCallback(async () => {
    const ok = await copyValueToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  // Shared QR props
  const qrProps = useMemo(
    () => ({
      value: value || "https://www.qrvenues.com",
      size,
      bgColor,
      fgColor,
      level: effectiveLevel as "L" | "M" | "Q" | "H",
      includeMargin,
      imageSettings,
    }),
    [value, size, bgColor, fgColor, effectiveLevel, includeMargin, imageSettings]
  );

  // Render QR element
  const qrElement = useMemo(() => {
    if (format === "svg" && !gradient) {
      return <QRCodeSVG {...qrProps} />;
    }
    return <QRCodeCanvas {...qrProps} />;
  }, [format, gradient, qrProps]);

  // Rounded module style
  const roundedStyle: React.CSSProperties | undefined = rounded
    ? {
        borderRadius: "var(--radius-md, 8px)",
        overflow: "hidden",
      }
    : undefined;

  // Frame configurations
  const frameInfo = frame !== "none" ? FRAME_CONFIG[frame] : null;
  const resolvedFrameLabel = frameLabel ?? frameInfo?.label ?? "";
  const resolvedFrameSubtext = frameSubtext ?? frameInfo?.subtext;
  const IconComponent = frameInfo?.icon || QrIcon;

  return (
    <>
      <div
        ref={wrapperRef}
        className={clsx(
          "inline-flex flex-col items-center max-w-full",
          animated && "animate-[qr-appear_400ms_ease-out_both]",
          className
        )}
        style={style}
        role="img"
        aria-label={ariaLabel ?? alt}
      >
        {/* Outer Card Wrapper with clean borders */}
        <div
          className={clsx(
            "bg-surface-1 border border-hairline rounded-xl overflow-hidden transition-all max-w-full",
            frame !== "none" && "p-2 sm:p-2.5"
          )}
        >
          {/* Top Banner Frame */}
          {frameInfo &&
            (frameInfo.position === "top" || frameInfo.position === "card") && (
              <div
                className={clsx(
                  "flex flex-col items-center justify-center px-4 py-2.5 rounded-lg mb-2 border",
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
                {resolvedFrameSubtext && (
                  <span className="text-[10px] opacity-80 font-medium">
                    {resolvedFrameSubtext}
                  </span>
                )}
              </div>
            )}

          {/* QR Code Canvas Area */}
          <div
            className="bg-surface-1 p-2 flex items-center justify-center rounded-lg max-w-full overflow-hidden"
            style={roundedStyle}
          >
            {qrElement}
          </div>

          {/* Bottom Banner Frame / SCAN ME pill */}
          {frameInfo &&
            (frameInfo.position === "bottom" || frameInfo.position === "card") && (
              <div
                className={clsx(
                  "flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg mt-2 text-xs font-semibold tracking-wider uppercase border",
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

        {/* Action buttons (Download & Copy) */}
        {downloadable && (
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <div
              className="tooltip tooltip-bottom"
              data-tip={`Download high-res ${format.toUpperCase()} (15s processing)`}
            >
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="btn btn-xs bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs font-medium h-7 min-h-7 px-3 rounded-md gap-1.5"
                aria-label={`Download QR code as ${format.toUpperCase()}`}
              >
                <Download className="w-3.5 h-3.5 text-fin-orange" />
                <span>Download {format.toUpperCase()}</span>
              </button>
            </div>

            <div
              className="tooltip tooltip-bottom"
              data-tip="Copy value to clipboard"
            >
              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-xs bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs font-medium h-7 min-h-7 px-3 rounded-md gap-1.5"
                aria-label="Copy QR value to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-semantic-success" />
                    <span className="text-semantic-success font-medium">
                      Copied!
                    </span>
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

      {/* 15-Second Download Processing Modal */}
      <QRCodeDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        value={value}
        format={format}
        frame={frame}
        frameLabel={resolvedFrameLabel}
        frameSubtext={resolvedFrameSubtext}
        frameBgColor={frameBgColor}
        frameTextColor={frameTextColor}
        getCanvas={() => wrapperRef.current?.querySelector("canvas") ?? null}
        getSvgString={() => {
          const svg = wrapperRef.current?.querySelector("svg");
          return svg ? svgToString(svg) : null;
        }}
        filename={`qr-${value.slice(0, 24).replace(/[^a-zA-Z0-9]/g, "_") || "code"}`}
        processingDuration={processingSeconds}
        includeFrame={frame !== "none"}
      />
    </>
  );
});

QRCode.displayName = "QRCode";
