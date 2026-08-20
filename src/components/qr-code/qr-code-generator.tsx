"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { clsx } from "clsx";
import {
  Download,
  Copy,
  Check,
  UtensilsCrossed,
  Star,
  Smartphone,
  Sparkles,
  RefreshCw,
  QrCode as QrIcon,
  Palette,
  Layers,
  Sliders,
  Image as ImageIcon,
  Globe,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  User,
  Wifi,
  ChevronDown,
  Upload,
  Coffee,
  Eye,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import { QRCode, type QRCodeHandle } from "./qr-code";
import type {
  FramePreset,
  ErrorCorrectionLevel,
  QRContentType,
} from "./qr-code.types";
import { QRCodeDownloadModal } from "./qr-code-download-modal";

export interface QRCodeGeneratorProps {
  /** Initial text/URL to encode */
  initialValue?: string;
  /** Initial frame preset */
  initialFrame?: FramePreset;
  /** Initial foreground color */
  initialFgColor?: string;
  /** Initial title / badge for the generator card */
  title?: string;
  /** Description below the title */
  description?: string;
  /** Extra CSS classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Design System Color Swatches
// ---------------------------------------------------------------------------
const FG_COLORS = [
  { name: "Brand Violet", hex: "#5645d4" },
  { name: "Deep Violet", hex: "#3a2a99" },
  { name: "Navy", hex: "#0a1530" },
  { name: "Link Blue", hex: "#0075de" },
  { name: "Ocean Blue", hex: "#2563eb" },
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Brand Orange", hex: "#dd5b00" },
  { name: "Rausch Red", hex: "#ff385c" },
  { name: "Brand Pink", hex: "#ff64c8" },
  { name: "Muted Slate", hex: "#5a5f73" },
];

const BG_COLORS = [
  { name: "Pure White", hex: "#ffffff" },
  { name: "Soft Lavender", hex: "#eeecfb" },
  { name: "Soft Blue", hex: "#eaf4ff" },
  { name: "Soft Gray", hex: "#f4f4f8" },
  { name: "Warm Cream", hex: "#f5f1ec" },
];


// ---------------------------------------------------------------------------
// Built-in Logo Presets (Embedded SVG Data URIs for CORS-free exports)
// ---------------------------------------------------------------------------
const LOGO_PRESETS = [
  {
    id: "none",
    name: "None",
    icon: null,
    src: undefined,
  },
  {
    id: "google",
    name: "Google Review",
    icon: Star,
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23dd5b00'/><path d='M50 20 L59 38 L79 41 L64 56 L68 76 L50 66 L32 76 L36 56 L21 41 L41 38 Z' fill='%23ffffff'/></svg>",
  },
  {
    id: "coffee",
    name: "Coffee",
    icon: Coffee,
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230a1530'/><path d='M30 35 h35 v25 a15 15 0 0 1 -30 0 v-25 z M65 40 h8 a6 6 0 0 1 0 12 h-8 z M25 70 h45 v4 h-45 z' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  },
  {
    id: "utensils",
    name: "Menu Dining",
    icon: UtensilsCrossed,
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%235645d4'/><path d='M35 25 v25 a8 8 0 0 0 16 0 v-25 M43 25 v50 M62 25 v50 M62 25 c0 15 -10 20 -10 20' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  },
  {
    id: "wifi",
    name: "WiFi",
    icon: Wifi,
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230075de'/><path d='M25 42 a36 36 0 0 1 50 0 M34 52 a22 22 0 0 1 32 0 M43 62 a10 10 0 0 1 14 0 M50 72 a2 2 0 1 1 0 -0.1' fill='none' stroke='%23ffffff' stroke-width='6' stroke-linecap='round'/></svg>",
  },
  {
    id: "qrvenues",
    name: "QRVenues",
    icon: QrIcon,
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%235645d4'/><text x='50' y='60' font-size='32' font-weight='900' font-family='sans-serif' text-anchor='middle' fill='%23ffffff'>QV</text></svg>",
  },
];

// ---------------------------------------------------------------------------
// Tabs Definition
// ---------------------------------------------------------------------------
const TABS: { id: QRContentType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "URL", icon: Globe },
  { id: "menu", label: "MENU", icon: UtensilsCrossed },
  { id: "review", label: "REVIEW", icon: Star },
  { id: "wifi", label: "WIFI", icon: Wifi },
  { id: "text", label: "TEXT", icon: FileText },
  { id: "vcard", label: "VCARD", icon: User },
  { id: "phone", label: "PHONE", icon: Phone },
  { id: "email", label: "EMAIL", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquare },
];

type AccordionSection = "content" | "colors" | "logo" | "design";

export function QRCodeGenerator({
  initialValue = "https://www.qrvenues.com/menu/the-artisan-cafe",
  initialFrame = "menu",
  initialFgColor = "#5645d4",
  title = "Interactive QR Code Studio",
  description = "Create, customize, and export high-resolution QR codes in real time.",
  className,
}: QRCodeGeneratorProps) {
  // Active Content Tab
  const [activeTab, setActiveTab] = useState<QRContentType>("url");

  // Single Active Accordion Section
  const [activeAccordion, setActiveAccordion] =
    useState<AccordionSection | null>("content");

  const toggleAccordion = (section: AccordionSection) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  // Content state fields
  const [urlVal, setUrlVal] = useState(initialValue);
  const [textVal, setTextVal] = useState(
    "Scan to view our exclusive daily specials!"
  );
  const [menuSlug, setMenuSlug] = useState("the-artisan-cafe");
  const [menuTable, setMenuTable] = useState("04");
  const [reviewPlaceId, setReviewPlaceId] = useState(
    "ChIJN1t_tDeuEmsRUsoyG83frY4"
  );
  const [wifiSsid, setWifiSsid] = useState("Artisan_Guest_WiFi");
  const [wifiPass, setWifiPass] = useState("coffeetime2026");
  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [vcardName, setVcardName] = useState("Marcus Vance");
  const [vcardOrg, setVcardOrg] = useState("The Artisan Cafe");
  const [vcardPhone, setVcardPhone] = useState("+1 555 234 5678");
  const [vcardEmail, setVcardEmail] = useState("hello@artisancafe.com");
  const [phoneVal, setPhoneVal] = useState("+1 555 234 5678");
  const [emailTo, setEmailTo] = useState("contact@artisancafe.com");
  const [emailSubject, setEmailSubject] = useState("Table Reservation");
  const [smsPhone, setSmsPhone] = useState("+1 555 234 5678");
  const [smsMsg, setSmsMsg] = useState(
    "Hi, I would like to book a table for 4 tonight."
  );

  // Style State
  const [frame, setFrame] = useState<FramePreset>(initialFrame);
  const [customFrameLabel, setCustomFrameLabel] = useState("");
  const [customFrameSubtext, setCustomFrameSubtext] = useState("");
  const [fgColor, setFgColor] = useState(initialFgColor);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [rounded, setRounded] = useState(true);
  const [enableGradient, setEnableGradient] = useState(false);
  const [gradientTo, setGradientTo] = useState("#3a2a99");
  const [selectedLogoId, setSelectedLogoId] = useState("none");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | undefined>(
    undefined
  );
  const [size, setSize] = useState(210);
  const [level, setLevel] = useState<ErrorCorrectionLevel>("H");
  const [copied, setCopied] = useState(false);

  // Download Modal State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "svg">("png");
  const [downloadIncludeFrame, setDownloadIncludeFrame] = useState(true);

  // QR Component Ref for direct canvas access
  const qrRef = useRef<QRCodeHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute final encoded value based on activeTab
  const encodedValue = useMemo(() => {
    switch (activeTab) {
      case "url":
        return urlVal || "https://www.qrvenues.com";
      case "menu":
        return `https://www.qrvenues.com/menu/${menuSlug || "menu"}${
          menuTable ? `?table=${menuTable}` : ""
        }`;
      case "review":
        return `https://search.google.com/local/writereview?placeid=${
          reviewPlaceId || "ChIJN1t_tDeuEmsRUsoyG83frY4"
        }`;
      case "wifi":
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case "text":
        return textVal || "Welcome to QRVenues!";
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "phone":
        return `tel:${phoneVal}`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case "sms":
        return `smsto:${smsPhone}:${smsMsg}`;
      default:
        return urlVal || "https://www.qrvenues.com";
    }
  }, [
    activeTab,
    urlVal,
    menuSlug,
    menuTable,
    reviewPlaceId,
    wifiSsid,
    wifiPass,
    wifiType,
    textVal,
    vcardName,
    vcardOrg,
    vcardPhone,
    vcardEmail,
    phoneVal,
    emailTo,
    emailSubject,
    smsPhone,
    smsMsg,
  ]);

  // Compute active logo src
  const activeLogoSrc = useMemo(() => {
    if (customLogoUrl) return customLogoUrl;
    const preset = LOGO_PRESETS.find((p) => p.id === selectedLogoId);
    return preset?.src;
  }, [customLogoUrl, selectedLogoId]);

  // Gradient object
  const gradient = useMemo(() => {
    if (!enableGradient) return undefined;
    return {
      from: fgColor,
      to: gradientTo,
      direction: "to bottom right",
    };
  }, [enableGradient, fgColor, gradientTo]);

  // Copy helper
  const handleCopyValue = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(encodedValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore
    }
  }, [encodedValue]);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomLogoUrl(reader.result as string);
        setSelectedLogoId("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  // Open 15-second download processing modal
  const openDownloadModal = (format: "png" | "svg", includeFrame: boolean) => {
    setDownloadFormat(format);
    setDownloadIncludeFrame(includeFrame);
    setIsDownloadModalOpen(true);
  };

  return (
    <div
      className={clsx(
        "bg-surface-1 border border-hairline rounded-2xl overflow-hidden my-6 w-full transition-all",
        className
      )}
    >
      {/* =====================================================================
          1. Header & Tab Navigation Bar
          ===================================================================== */}
      <div className="border-b border-hairline bg-canvas/40 px-4 sm:px-6 pt-4 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-primary">
              <QrIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ink leading-tight">
                {title}
              </h2>
              <p className="text-[11px] text-ink-muted hidden sm:block">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="badge badge-sm bg-secondary text-primary border-primary/20 font-medium text-[11px] gap-1">
              <Sparkles className="w-3 h-3" />
              Live Studio
            </span>
          </div>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div role="tablist" aria-label="QR Code Content Types" className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 pb-0 -mb-[1px]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "menu") setFrame("menu");
                  else if (tab.id === "review") setFrame("review");
                }}
                className={clsx(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all rounded-t-lg",
                  isActive
                    ? "border-primary text-primary font-semibold bg-surface-1"
                    : "border-transparent text-ink-muted hover:text-ink hover:bg-surface-2/60"
                )}
                aria-selected={isActive}
              >
                <Icon
                  className={clsx(
                    "w-3.5 h-3.5",
                    isActive ? "text-primary" : "text-ink-subtle"
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. Two-Column Layout (Settings Left, Live Preview Right)
          ===================================================================== */}
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* -----------------------------------------------------------------
              LEFT COLUMN: Single-Open Accordion Settings Panels
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-3">
            {/* PANEL 1: ENTER CONTENT */}
            <div className="border border-hairline rounded-xl overflow-hidden bg-surface-1 transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion("content")}
                className="w-full px-4 sm:px-5 py-3.5 bg-canvas/70 hover:bg-canvas flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider transition-colors"
                aria-expanded={activeAccordion === "content"}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>1. Enter Content ({activeTab.toUpperCase()})</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-ink-muted transition-transform duration-200",
                    activeAccordion === "content" && "rotate-180 text-primary"
                  )}
                />
              </button>

              {activeAccordion === "content" && (
                <div className="p-4 sm:p-5 space-y-4 border-t border-hairline-soft animate-in fade-in duration-150">
                  {/* URL Content Tab */}
                  {activeTab === "url" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink flex items-center justify-between">
                        <span>Target Website URL</span>
                        <span className="text-[10px] text-ink-subtle font-normal">
                          https://
                        </span>
                      </label>
                      <input
                        type="url"
                        value={urlVal}
                        onChange={(e) => setUrlVal(e.target.value)}
                        placeholder="https://yourrestaurant.com"
                        className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink focus:border-primary h-10"
                      />
                    </div>
                  )}

                  {/* Menu Content Tab */}
                  {activeTab === "menu" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-ink">
                          Restaurant Menu Slug
                        </label>
                        <input
                          type="text"
                          value={menuSlug}
                          onChange={(e) => setMenuSlug(e.target.value)}
                          placeholder="the-artisan-cafe"
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink focus:border-primary h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-ink">
                          Table Number
                        </label>
                        <input
                          type="text"
                          value={menuTable}
                          onChange={(e) => setMenuTable(e.target.value)}
                          placeholder="04"
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink focus:border-primary h-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Google Review Tab */}
                  {activeTab === "review" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-ink flex items-center justify-between">
                        <span>Google Place ID or Direct Review URL</span>
                        <span className="badge badge-xs bg-semantic-success/15 text-semantic-success font-medium border-0">
                          5-Star Direct Link
                        </span>
                      </label>
                      <input
                        type="text"
                        value={reviewPlaceId}
                        onChange={(e) => setReviewPlaceId(e.target.value)}
                        placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                        className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink focus:border-primary h-10"
                      />
                      <p className="text-[11px] text-ink-subtle leading-normal">
                        Launches Google Maps write-review prompt automatically
                        when scanned.
                      </p>
                    </div>
                  )}

                  {/* WiFi Content Tab */}
                  {activeTab === "wifi" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-ink">
                            Network SSID Name
                          </label>
                          <input
                            type="text"
                            value={wifiSsid}
                            onChange={(e) => setWifiSsid(e.target.value)}
                            placeholder="Guest_WiFi"
                            className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-ink">
                            Password
                          </label>
                          <input
                            type="text"
                            value={wifiPass}
                            onChange={(e) => setWifiPass(e.target.value)}
                            placeholder="WiFi Password"
                            className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-ink-muted">
                        <span className="font-semibold text-ink">Security:</span>
                        {(["WPA", "WEP", "nopass"] as const).map((t) => (
                          <label
                            key={t}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="wifi-sec"
                              checked={wifiType === t}
                              onChange={() => setWifiType(t)}
                              className="radio radio-xs radio-primary"
                            />
                            <span>{t === "nopass" ? "Open (No Pass)" : t}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Content Tab */}
                  {activeTab === "text" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">
                        Plain Text Payload
                      </label>
                      <textarea
                        value={textVal}
                        onChange={(e) => setTextVal(e.target.value)}
                        rows={3}
                        placeholder="Enter text message or table code..."
                        className="textarea textarea-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink"
                      />
                    </div>
                  )}

                  {/* vCard Content Tab */}
                  {activeTab === "vcard" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={vcardName}
                          onChange={(e) => setVcardName(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Company / Restaurant
                        </label>
                        <input
                          type="text"
                          value={vcardOrg}
                          onChange={(e) => setVcardOrg(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={vcardPhone}
                          onChange={(e) => setVcardPhone(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Email
                        </label>
                        <input
                          type="email"
                          value={vcardEmail}
                          onChange={(e) => setVcardEmail(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Phone Tab */}
                  {activeTab === "phone" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneVal}
                        onChange={(e) => setPhoneVal(e.target.value)}
                        placeholder="+1 555 0199"
                        className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                      />
                    </div>
                  )}

                  {/* Email Tab */}
                  {activeTab === "email" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Recipient Email
                        </label>
                        <input
                          type="email"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                    </div>
                  )}

                  {/* SMS Tab */}
                  {activeTab === "sms" && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={smsPhone}
                          onChange={(e) => setSmsPhone(e.target.value)}
                          className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs h-10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-ink">
                          Message Body
                        </label>
                        <textarea
                          value={smsMsg}
                          onChange={(e) => setSmsMsg(e.target.value)}
                          rows={2}
                          className="textarea textarea-sm w-full bg-canvas border border-hairline rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Encoded String Preview */}
                  <div className="p-3 bg-canvas rounded-xl border border-hairline-soft flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="truncate max-w-[240px] sm:max-w-xs font-mono">
                      {encodedValue}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyValue}
                      className="btn btn-ghost btn-xs h-7 min-h-7 px-2.5 text-[11px] text-ink-muted hover:text-ink gap-1 rounded-md"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-semantic-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL 2: SET COLORS */}
            <div className="border border-hairline rounded-xl overflow-hidden bg-surface-1 transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion("colors")}
                className="w-full px-4 sm:px-5 py-3.5 bg-canvas/70 hover:bg-canvas flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider transition-colors"
                aria-expanded={activeAccordion === "colors"}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span>2. Set Colors & Gradients</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-ink-muted transition-transform duration-200",
                    activeAccordion === "colors" && "rotate-180 text-primary"
                  )}
                />
              </button>

              {activeAccordion === "colors" && (
                <div className="p-4 sm:p-5 space-y-4 border-t border-hairline-soft animate-in fade-in duration-150">
                  {/* Foreground Swatches */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink">
                        QR Module Shade
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-muted">
                        <span>Gradient</span>
                        <input
                          type="checkbox"
                          checked={enableGradient}
                          onChange={(e) => setEnableGradient(e.target.checked)}
                          className="toggle toggle-xs toggle-primary"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {FG_COLORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setFgColor(c.hex)}
                          className={clsx(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all",
                            fgColor === c.hex
                              ? "border-ink bg-surface-1 font-semibold ring-1 ring-black/15"
                              : "border-hairline bg-canvas text-ink-muted hover:text-ink"
                          )}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-hairline cursor-pointer p-0.5 bg-transparent"
                        title="Custom Color Picker"
                      />
                    </div>
                  </div>

                  {/* Gradient Secondary Color */}
                  {enableGradient && (
                    <div className="p-3 bg-canvas rounded-xl border border-hairline-soft space-y-2 animate-in fade-in">
                      <span className="text-xs text-ink font-semibold">
                        Gradient Secondary Shade
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {FG_COLORS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setGradientTo(c.hex)}
                            className={clsx(
                              "w-6 h-6 rounded-full border transition-transform",
                              gradientTo === c.hex
                                ? "scale-125 border-ink ring-2 ring-primary/40"
                                : "border-black/10 hover:scale-110"
                            )}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        <input
                          type="color"
                          value={gradientTo}
                          onChange={(e) => setGradientTo(e.target.value)}
                          className="w-6 h-6 rounded border border-hairline cursor-pointer p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Background Color */}
                  <div className="space-y-2 pt-2 border-t border-hairline-soft">
                    <span className="text-xs font-semibold text-ink">
                      Background Ground
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {BG_COLORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setBgColor(c.hex)}
                          className={clsx(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all",
                            bgColor === c.hex
                              ? "border-ink bg-surface-1 font-semibold ring-1 ring-black/15"
                              : "border-hairline bg-canvas text-ink-muted hover:text-ink"
                          )}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL 3: ADD LOGO IMAGE */}
            <div className="border border-hairline rounded-xl overflow-hidden bg-surface-1 transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion("logo")}
                className="w-full px-4 sm:px-5 py-3.5 bg-canvas/70 hover:bg-canvas flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider transition-colors"
                aria-expanded={activeAccordion === "logo"}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>3. Add Center Logo</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-ink-muted transition-transform duration-200",
                    activeAccordion === "logo" && "rotate-180 text-primary"
                  )}
                />
              </button>

              {activeAccordion === "logo" && (
                <div className="p-4 sm:p-5 space-y-4 border-t border-hairline-soft animate-in fade-in duration-150">
                  {/* Preset Badges Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-ink">
                      Hospitality Logo Presets
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {LOGO_PRESETS.map((preset) => {
                        const isSelected =
                          selectedLogoId === preset.id && !customLogoUrl;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setSelectedLogoId(preset.id);
                              setCustomLogoUrl(undefined);
                            }}
                            className={clsx(
                              "p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 text-xs transition-all h-16",
                              isSelected
                                ? "border-primary bg-surface-1 ring-2 ring-primary/20 font-semibold"
                                : "border-hairline bg-canvas hover:border-ink text-ink-muted"
                            )}
                          >
                            {preset.icon ? (
                              <preset.icon className="w-5 h-5 text-primary" />
                            ) : (
                              <span className="text-[10px] text-ink-subtle">
                                No Logo
                              </span>
                            )}
                            <span className="text-[10px] truncate max-w-full">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Upload */}
                  <div className="pt-2 border-t border-hairline-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-ink block">
                        Upload Custom Brand Logo
                      </span>
                      <span className="text-[10px] text-ink-subtle">
                        PNG, SVG or JPEG (Square transparent PNG recommended)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-xs bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs h-8 px-3 rounded-lg gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>Upload Image</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {customLogoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomLogoUrl(undefined);
                            setSelectedLogoId("none");
                          }}
                          className="text-[11px] text-semantic-error hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL 4: CUSTOMIZE DESIGN & FRAME */}
            <div className="border border-hairline rounded-xl overflow-hidden bg-surface-1 transition-all">
              <button
                type="button"
                onClick={() => toggleAccordion("design")}
                className="w-full px-4 sm:px-5 py-3.5 bg-canvas/70 hover:bg-canvas flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider transition-colors"
                aria-expanded={activeAccordion === "design"}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>4. Customize Frame & Tabletop Card</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-ink-muted transition-transform duration-200",
                    activeAccordion === "design" && "rotate-180 text-primary"
                  )}
                />
              </button>

              {activeAccordion === "design" && (
                <div className="p-4 sm:p-5 space-y-4 border-t border-hairline-soft animate-in fade-in duration-150">
                  {/* Frame Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink">
                        Tabletop Frame Style
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: "none" as FramePreset,
                          label: "No Frame",
                          icon: QrIcon,
                        },
                        {
                          id: "menu" as FramePreset,
                          label: "Scan for Menu",
                          icon: UtensilsCrossed,
                        },
                        {
                          id: "review" as FramePreset,
                          label: "Google Review",
                          icon: Star,
                        },
                        {
                          id: "order" as FramePreset,
                          label: "Order & Pay",
                          icon: Smartphone,
                        },
                        {
                          id: "scan-me" as FramePreset,
                          label: "SCAN ME Pill",
                          icon: Sparkles,
                        },
                        {
                          id: "card" as FramePreset,
                          label: "Tabletop Card",
                          icon: QrIcon,
                        },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFrame(f.id)}
                          className={clsx(
                            "p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all",
                            frame === f.id
                              ? "border-primary bg-surface-1 font-semibold text-primary ring-1 ring-primary"
                              : "border-hairline bg-canvas text-ink-muted hover:border-ink hover:text-ink"
                          )}
                        >
                          <span>{f.label}</span>
                          <f.icon className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      ))}
                    </div>

                    {/* Frame Text Overrides */}
                    {frame !== "none" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-ink">
                            Custom Frame Headline
                          </label>
                          <input
                            type="text"
                            value={customFrameLabel}
                            onChange={(e) => setCustomFrameLabel(e.target.value)}
                            placeholder="e.g. Scan for Lunch Menu"
                            className="input input-xs bg-canvas border border-hairline rounded-lg text-xs text-ink w-full h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-ink">
                            Custom Subtitle Text
                          </label>
                          <input
                            type="text"
                            value={customFrameSubtext}
                            onChange={(e) =>
                              setCustomFrameSubtext(e.target.value)
                            }
                            placeholder="e.g. Table 04 · Fast Service"
                            className="input input-xs bg-canvas border border-hairline rounded-lg text-xs text-ink w-full h-8"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modules & Accuracy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-hairline-soft">
                    <div className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-hairline-soft">
                      <span className="text-xs text-ink font-medium">
                        Rounded Modules
                      </span>
                      <input
                        type="checkbox"
                        checked={rounded}
                        onChange={(e) => setRounded(e.target.checked)}
                        className="toggle toggle-xs toggle-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-hairline-soft">
                      <span className="text-xs text-ink font-medium">
                        Error Correction
                      </span>
                      <select
                        value={level}
                        onChange={(e) =>
                          setLevel(e.target.value as ErrorCorrectionLevel)
                        }
                        className="select select-xs select-bordered bg-surface-1 text-ink text-[11px] h-7 min-h-7 rounded-lg"
                      >
                        <option value="L">L (7% Recovery)</option>
                        <option value="M">M (15% Recovery)</option>
                        <option value="Q">Q (25% Recovery)</option>
                        <option value="H">H (30% High)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              RIGHT COLUMN: Prominent Live QR Preview & Export Center
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-surface-1 border border-hairline rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-between text-center space-y-6 lg:sticky lg:top-6">
            {/* Header Badge */}
            <div className="flex items-center justify-between w-full border-b border-hairline-soft pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Live Interactive Preview</span>
              </span>
              <span className="badge badge-xs bg-semantic-success/15 text-semantic-success font-medium border-0 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                100% Scannable
              </span>
            </div>

            {/* The Live Rendered QR Code */}
            <div className="py-2 flex items-center justify-center max-w-full overflow-hidden transition-transform hover:scale-[1.02]">
              <QRCode
                ref={qrRef}
                value={encodedValue}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                gradient={gradient}
                rounded={rounded}
                level={level}
                logo={activeLogoSrc}
                logoSize={Math.round(size * 0.22)}
                frame={frame}
                frameLabel={customFrameLabel || undefined}
                frameSubtext={customFrameSubtext || undefined}
                downloadable={false}
                format="png"
                animated={true}
                alt="Live Generated QR Code"
                ariaLabel="Scan this interactive QR code with your smartphone"
              />
            </div>

            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              Point any mobile camera at the preview above to verify real-time
              routing.
            </p>

            {/* Controls & 15-Second Download Buttons */}
            <div className="w-full space-y-4 pt-4 border-t border-hairline-soft">
              {/* Size Slider */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    Canvas Size:
                  </span>
                  <span className="font-semibold text-ink font-mono">
                    {size}px × {size}px
                  </span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={280}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="range range-xs range-primary"
                />
              </div>

              {/* Action Buttons with 15-Second Processing Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openDownloadModal("png", true)}
                  className="btn btn-sm btn-primary rounded-xl text-xs font-semibold h-11 min-h-11 gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-fin-orange" />
                  <span>Download Card (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => openDownloadModal("svg", false)}
                  className="btn btn-sm bg-surface-1 border border-hairline hover:bg-canvas text-ink rounded-xl text-xs font-semibold h-11 min-h-11 gap-2"
                >
                  <FileCode className="w-4 h-4 text-primary" />
                  <span>Download SVG</span>
                </button>
              </div>

              {/* Standalone Quick Export Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => openDownloadModal("png", false)}
                  className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>QR Only (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyValue}
                  className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-semantic-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copied ? "Copied Link!" : "Copy Data"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUrlVal("https://www.qrvenues.com/menu/the-artisan-cafe");
                    setFgColor("#5645d4");
                    setBgColor("#ffffff");
                    setEnableGradient(false);
                    setSelectedLogoId("none");
                    setCustomLogoUrl(undefined);
                    setFrame(initialFrame);
                    setCustomFrameLabel("");
                    setCustomFrameSubtext("");
                    setSize(210);
                  }}
                  className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 15-Second Download Processing Modal */}
      <QRCodeDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        value={encodedValue}
        format={downloadFormat}
        frame={downloadIncludeFrame ? frame : "none"}
        frameLabel={customFrameLabel || undefined}
        frameSubtext={customFrameSubtext || undefined}
        getCanvas={() => qrRef.current?.getCanvas() ?? null}
        getSvgString={() => qrRef.current?.getSvgString() ?? null}
        filename={`qrvenues-${activeTab}`}
        processingDuration={15}
        includeFrame={downloadIncludeFrame && frame !== "none"}
      />
    </div>
  );
}
