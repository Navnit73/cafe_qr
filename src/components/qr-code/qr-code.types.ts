import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Gradient
// ---------------------------------------------------------------------------
export interface GradientConfig {
  /** Start color */
  from: string;
  /** End color */
  to: string;
  /** CSS linear-gradient direction, e.g. "to right", "135deg", "to bottom right" */
  direction?: string;
}

// ---------------------------------------------------------------------------
// Frame preset
// ---------------------------------------------------------------------------
export type FramePreset =
  | "none"
  | "menu"
  | "review"
  | "order"
  | "scan-me"
  | "badge"
  | "card";

// ---------------------------------------------------------------------------
// Content types supported by generator
// ---------------------------------------------------------------------------
export type QRContentType =
  | "url"
  | "text"
  | "menu"
  | "review"
  | "wifi"
  | "vcard"
  | "phone"
  | "email"
  | "sms";

// ---------------------------------------------------------------------------
// Error correction level
// ---------------------------------------------------------------------------
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// ---------------------------------------------------------------------------
// Download & Processing Config
// ---------------------------------------------------------------------------
export interface QRDownloadConfig {
  filename?: string;
  format: "png" | "svg";
  includeFrame?: boolean;
  resolution?: number;
  processingDuration?: number; // Duration in seconds (e.g. 15)
}

export interface QRProcessingStep {
  id: string;
  label: string;
  description: string;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// QRCode props
// ---------------------------------------------------------------------------
export interface QRCodeProps {
  /** Data to encode (URL, text, vCard, JSON string, etc.) */
  value: string;

  /** Width & height in px @default 200 */
  size?: number;

  /** Background color @default "#ffffff" */
  bgColor?: string;

  /** Foreground (module) color @default "#111111" */
  fgColor?: string;

  /**
   * Optional center logo image path or data URI.
   * When provided, `level` defaults to `"H"` for best scannability.
   */
  logo?: string;

  /** Logo width & height in px @default size * 0.22 */
  logoSize?: number;

  /** Error correction level @default "H" */
  level?: ErrorCorrectionLevel;

  /** Include a quiet-zone margin @default true */
  includeMargin?: boolean;

  /** Extra inline styles on the wrapper */
  style?: CSSProperties;

  /** Extra CSS classes on the wrapper */
  className?: string;

  /** Render rounded QR modules @default false */
  rounded?: boolean;

  /** Show download button @default false */
  downloadable?: boolean;

  /** Download format @default "png" */
  format?: "png" | "svg";

  /** Apply a linear gradient to QR modules */
  gradient?: GradientConfig;

  /** Fade/scale entrance animation @default true */
  animated?: boolean;

  /** Decorative frame preset @default "none" */
  frame?: FramePreset;

  /** Custom frame label — overrides the preset default */
  frameLabel?: string;

  /** Custom frame subtext — overrides the preset default */
  frameSubtext?: string;

  /** Custom frame background color override */
  frameBgColor?: string;

  /** Custom frame text color override */
  frameTextColor?: string;

  /** Accessible alt text @default "QR Code" */
  alt?: string;

  /** ARIA label — falls back to `alt` */
  ariaLabel?: string;

  /** Custom processing duration in seconds when download button is clicked @default 15 */
  processingSeconds?: number;
}

// ---------------------------------------------------------------------------
// QRCodeBatch props
// ---------------------------------------------------------------------------
export interface QRCodeBatchItem {
  /** Encoded value */
  value: string;
  /** Optional label rendered below the QR */
  label?: string;
  /** Optional category or table badge */
  badge?: string;
  /** Custom filename prefix */
  filename?: string;
}

export interface QRCodeBatchProps {
  /** Array of values (+optional labels) to render */
  items: QRCodeBatchItem[];

  /** Props applied to every QR instance (value is overridden per-item) */
  commonProps?: Omit<QRCodeProps, "value">;

  /** Extra CSS classes on the grid container */
  className?: string;

  /** Title above the batch */
  title?: string;

  /** Description below title */
  description?: string;
}
