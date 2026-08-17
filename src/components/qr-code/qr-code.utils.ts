// ---------------------------------------------------------------------------
// QR Code utility helpers — download, copy, composite card rendering, canvas
// ---------------------------------------------------------------------------

import type { FramePreset } from "./qr-code.types";

/**
 * Convert a canvas element to a Blob.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = "image/png",
  quality: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Serialise an SVG DOM element to a UTF-8 string.
 */
export function svgToString(svgElement: SVGSVGElement): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

/**
 * Trigger a browser file download from a Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Trigger a browser file download from a Data URL.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  if (typeof window === "undefined") return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 200);
}

/**
 * Copy a string value to the clipboard.
 */
export async function copyValueToClipboard(value: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Convert a CSS gradient direction string into canvas
 * createLinearGradient coordinates [x0, y0, x1, y1].
 */
export function parseGradientDirection(
  direction: string,
  w: number,
  h: number
): [number, number, number, number] {
  switch (direction) {
    case "to right":
      return [0, 0, w, 0];
    case "to left":
      return [w, 0, 0, 0];
    case "to bottom":
      return [0, 0, 0, h];
    case "to top":
      return [0, h, 0, 0];
    case "to bottom right":
    case "135deg":
      return [0, 0, w, h];
    case "to top right":
    case "45deg":
      return [0, h, w, 0];
    case "to bottom left":
    case "225deg":
      return [w, 0, 0, h];
    case "to top left":
    case "315deg":
      return [w, h, 0, 0];
    default:
      return [0, 0, w, h];
  }
}

/**
 * Apply a linear gradient to a QR canvas safely without color-bleeding.
 */
export function applyCanvasGradient(
  canvas: HTMLCanvasElement,
  from: string,
  to: string,
  direction: string = "to bottom right"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Sample corner pixel (0,0) as background baseline
  const bgR = pixels[0];
  const bgG = pixels[1];
  const bgB = pixels[2];

  // Create gradient overlay
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx = tmpCanvas.getContext("2d");
  if (!tmpCtx) return;

  const coords = parseGradientDirection(direction, width, height);
  const gradient = tmpCtx.createLinearGradient(...coords);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);

  tmpCtx.fillStyle = gradient;
  tmpCtx.fillRect(0, 0, width, height);
  const gradData = tmpCtx.getImageData(0, 0, width, height).data;

  // Color distance threshold from background
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Check if pixel differs from background color
    const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (dist > 45 && a > 0) {
      pixels[i] = gradData[i];
      pixels[i + 1] = gradData[i + 1];
      pixels[i + 2] = gradData[i + 2];
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// ---------------------------------------------------------------------------
// High-Resolution Composite Card Rendering (300 DPI ready for Print / Export)
// ---------------------------------------------------------------------------
export interface CompositeCardRenderOptions {
  qrCanvas: HTMLCanvasElement;
  frame: FramePreset;
  frameLabel?: string;
  frameSubtext?: string;
  frameBgColor?: string;
  frameTextColor?: string;
  targetScale?: number; // Scaling factor for high-res output (e.g. 2 for 2x crispness)
  cardBgColor?: string;
}

/**
 * Render a complete tabletop standing card with header banner, QR code,
 * crisp borders, subtexts, and badge into a high-resolution canvas.
 */
export async function renderCompositeCardCanvas(
  options: CompositeCardRenderOptions
): Promise<HTMLCanvasElement> {
  const {
    qrCanvas,
    frame,
    frameLabel,
    frameSubtext,
    frameBgColor,
    frameTextColor,
    targetScale = 3, // 3x high resolution for crystal clear print
    cardBgColor = "#ffffff",
  } = options;

  const qrWidth = qrCanvas.width;
  const qrHeight = qrCanvas.height;

  // If no frame is chosen, render crisp QR canvas scaled up
  if (frame === "none") {
    const standaloneCanvas = document.createElement("canvas");
    standaloneCanvas.width = qrWidth * targetScale;
    standaloneCanvas.height = qrHeight * targetScale;
    const ctx = standaloneCanvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvas, 0, 0, standaloneCanvas.width, standaloneCanvas.height);
    return standaloneCanvas;
  }

  // Dimensioning for card
  const pad = 24 * targetScale;
  const bannerHeight = 56 * targetScale;
  const cardWidth = (qrWidth + 48) * targetScale;
  let cardHeight = (qrHeight + 48) * targetScale;

  const hasTopBanner = ["menu", "review", "order", "card"].includes(frame);
  const hasBottomBanner = ["scan-me", "badge", "card"].includes(frame);

  if (hasTopBanner) cardHeight += bannerHeight + 12 * targetScale;
  if (hasBottomBanner) cardHeight += 44 * targetScale;

  const canvas = document.createElement("canvas");
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 1. Draw Card Background with Rounded Corners
  const radius = 16 * targetScale;
  ctx.fillStyle = cardBgColor;
  roundRect(ctx, 0, 0, cardWidth, cardHeight, radius);
  ctx.fill();

  // 1b. Draw subtle card hairline border
  ctx.lineWidth = 2 * targetScale;
  ctx.strokeStyle = "#d3cec6";
  roundRect(ctx, 0, 0, cardWidth, cardHeight, radius);
  ctx.stroke();

  let currentY = pad;

  // Preset theme defaults
  const presetTheme = getPresetDefaultColors(frame);
  const activeBg = frameBgColor || presetTheme.bg;
  const activeText = frameTextColor || presetTheme.text;
  const activeBorder = presetTheme.border;
  const resolvedLabel = frameLabel || presetTheme.defaultLabel;
  const resolvedSubtext = frameSubtext || presetTheme.defaultSubtext;

  // 2. Draw Top Banner if applicable
  if (hasTopBanner) {
    const bannerRadius = 10 * targetScale;
    const bannerWidth = cardWidth - pad * 2;

    ctx.fillStyle = activeBg;
    roundRect(ctx, pad, currentY, bannerWidth, bannerHeight, bannerRadius);
    ctx.fill();

    ctx.lineWidth = 1.5 * targetScale;
    ctx.strokeStyle = activeBorder;
    roundRect(ctx, pad, currentY, bannerWidth, bannerHeight, bannerRadius);
    ctx.stroke();

    // Banner Text
    ctx.fillStyle = activeText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (resolvedSubtext) {
      ctx.font = `bold ${15 * targetScale}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillText(
        resolvedLabel,
        cardWidth / 2,
        currentY + bannerHeight * 0.38
      );

      ctx.font = `500 ${11 * targetScale}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.globalAlpha = 0.85;
      ctx.fillText(
        resolvedSubtext,
        cardWidth / 2,
        currentY + bannerHeight * 0.72
      );
      ctx.globalAlpha = 1.0;
    } else {
      ctx.font = `bold ${16 * targetScale}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillText(resolvedLabel, cardWidth / 2, currentY + bannerHeight / 2);
    }

    currentY += bannerHeight + 14 * targetScale;
  }

  // 3. Draw QR Code in Center
  const qrX = (cardWidth - qrWidth * targetScale) / 2;
  const qrY = currentY;
  ctx.drawImage(qrCanvas, qrX, qrY, qrWidth * targetScale, qrHeight * targetScale);
  currentY += qrHeight * targetScale + 12 * targetScale;

  // 4. Draw Bottom Banner if applicable
  if (hasBottomBanner) {
    const bottomHeight = 36 * targetScale;
    const bottomRadius = 8 * targetScale;
    const bottomWidth = cardWidth - pad * 2;

    ctx.fillStyle = activeBg;
    roundRect(ctx, pad, currentY, bottomWidth, bottomHeight, bottomRadius);
    ctx.fill();

    ctx.lineWidth = 1.5 * targetScale;
    ctx.strokeStyle = activeBorder;
    roundRect(ctx, pad, currentY, bottomWidth, bottomHeight, bottomRadius);
    ctx.stroke();

    ctx.fillStyle = activeText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${13 * targetScale}px Inter, system-ui, -apple-system, sans-serif`;

    const bottomLabel =
      frame === "card"
        ? "Powered by QRVenues"
        : frame === "scan-me"
        ? (frameLabel || "⚡ SCAN ME WITH PHONE ⚡")
        : (frameLabel || "Point Camera to Scan");

    ctx.fillText(bottomLabel, cardWidth / 2, currentY + bottomHeight / 2);
  }

  return canvas;
}

/**
 * Canvas round rectangle path utility.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Get preset colors and default texts.
 */
function getPresetDefaultColors(frame: FramePreset): {
  bg: string;
  text: string;
  border: string;
  defaultLabel: string;
  defaultSubtext?: string;
} {
  switch (frame) {
    case "menu":
      return {
        bg: "#f0fdf4",
        text: "#059669",
        border: "#bbf7d0",
        defaultLabel: "Scan for Menu",
        defaultSubtext: "Dine-in & Takeaway",
      };
    case "review":
      return {
        bg: "#fff7f2",
        text: "#ea580c",
        border: "#fed7aa",
        defaultLabel: "Review Us on Google",
        defaultSubtext: "★★★★★ 5.0 Rating",
      };
    case "order":
      return {
        bg: "#eff6ff",
        text: "#2563eb",
        border: "#bfdbfe",
        defaultLabel: "Scan to Order & Pay",
        defaultSubtext: "Fast Contactless Table Service",
      };
    case "scan-me":
      return {
        bg: "#f7fee7",
        text: "#4d7c0f",
        border: "#d9f99d",
        defaultLabel: "SCAN ME",
      };
    case "badge":
      return {
        bg: "#ecfeff",
        text: "#0891b2",
        border: "#a5f3fc",
        defaultLabel: "Point Camera to Scan",
      };
    case "card":
      return {
        bg: "#ebe7e1",
        text: "#111111",
        border: "#d3cec6",
        defaultLabel: "Tabletop Digital Portal",
        defaultSubtext: "Instant contactless access",
      };
    default:
      return {
        bg: "#ffffff",
        text: "#111111",
        border: "#d3cec6",
        defaultLabel: "QR Code",
      };
  }
}
