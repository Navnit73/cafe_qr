// ---------------------------------------------------------------------------
// QR Code utility helpers — download, copy, canvas conversion
// ---------------------------------------------------------------------------

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
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Download a QR code from a wrapper element.
 *
 * For PNG: finds the inner `<canvas>` and converts to blob.
 * For SVG: finds the inner `<svg>` and creates a blob from its markup.
 */
export async function downloadQRCode(
  wrapperElement: HTMLElement,
  filename: string = "qr-code",
  format: "png" | "svg" = "png"
): Promise<void> {
  if (format === "svg") {
    const svg = wrapperElement.querySelector("svg");
    if (!svg) throw new Error("No SVG element found in QR wrapper");
    const svgString = svgToString(svg as SVGSVGElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `${filename}.svg`);
  } else {
    const canvas = wrapperElement.querySelector("canvas");
    if (!canvas) throw new Error("No canvas element found in QR wrapper");
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, `${filename}.png`);
  }
}

/**
 * Copy a string value to the clipboard.
 * Falls back to `document.execCommand` for older browsers.
 */
export async function copyValueToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
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
 * Apply a linear gradient to a QR canvas.
 *
 * Reads the existing canvas, replaces the foreground colour with a gradient,
 * and writes back. Call after the canvas has rendered.
 */
export function applyCanvasGradient(
  canvas: HTMLCanvasElement,
  from: string,
  to: string,
  direction: string = "to bottom"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;

  // Parse direction into gradient coords
  const coords = parseGradientDirection(direction, width, height);
  const gradient = ctx.createLinearGradient(...coords);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);

  // Get existing pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Create a temporary canvas with the gradient fill
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = width;
  tmpCanvas.height = height;
  const tmpCtx = tmpCanvas.getContext("2d")!;
  tmpCtx.fillStyle = gradient;
  tmpCtx.fillRect(0, 0, width, height);
  const gradientData = tmpCtx.getImageData(0, 0, width, height).data;

  // Replace dark (foreground) pixels with gradient pixels
  for (let i = 0; i < pixels.length; i += 4) {
    // If pixel is dark (foreground), replace with gradient colour
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    if (brightness < 128 && pixels[i + 3] > 0) {
      pixels[i] = gradientData[i];
      pixels[i + 1] = gradientData[i + 1];
      pixels[i + 2] = gradientData[i + 2];
      // Keep original alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Convert a CSS gradient direction string into canvas
 * createLinearGradient coordinates [x0, y0, x1, y1].
 */
function parseGradientDirection(
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
      // Fallback: top to bottom
      return [0, 0, 0, h];
  }
}
