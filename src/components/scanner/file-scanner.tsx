"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileImage,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Wifi,
  Globe,
  Barcode,
  User,
  Package,
  Camera,
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  BarcodeFormatName,
  ScannedResult,
} from "./scanner.types";
import {
  formatBarcodeType,
  parseBarcodePayload,
  playScanBeep,
  triggerHaptic,
} from "./scanner.utils";

interface FileScannerProps {
  onScanSuccess: (result: ScannedResult) => void;
  soundEnabled: boolean;
}

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.MAXICODE,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
];

const SAMPLE_PRESETS: Array<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  format: BarcodeFormatName;
  rawText: string;
  description: string;
}> = [
  {
    id: "sample-url",
    label: "Menu URL (QR)",
    icon: Globe,
    format: "QR_CODE",
    rawText: "https://qrvenues.com/menu/table-12",
    description: "Hospitality digital menu link",
  },
  {
    id: "sample-wifi",
    label: "Guest WiFi (QR)",
    icon: Wifi,
    format: "QR_CODE",
    rawText: "WIFI:T:WPA;S:ArtisanCoffee_Guest;P:Espresso2026;;",
    description: "Wi-Fi credentials format",
  },
  {
    id: "sample-ean13",
    label: "Product (EAN-13)",
    icon: Package,
    format: "EAN_13",
    rawText: "8901030382956",
    description: "Retail 13-digit product barcode",
  },
  {
    id: "sample-code128",
    label: "Tracking (Code 128)",
    icon: Barcode,
    format: "CODE_128",
    rawText: "ORD-2026-TABLE04-XP",
    description: "Order & logistics tracking",
  },
  {
    id: "sample-vcard",
    label: "Contact (vCard)",
    icon: User,
    format: "QR_CODE",
    rawText: "BEGIN:VCARD\nVERSION:3.0\nFN:Elena Rostova\nTITLE:General Manager\nORG:Artisan Roast Cafe\nTEL:+1-555-0199\nEMAIL:elena@artisanroast.com\nURL:https://qrvenues.com\nEND:VCARD",
    description: "Digital business vCard",
  },
];

export function FileScanner({ onScanSuccess, soundEnabled }: FileScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedSummary, setDetectedSummary] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const hiddenScannerDivRef = useRef<HTMLDivElement>(null);

  // Scan file using Html5Qrcode
  const scanImageFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file (PNG, JPG, WEBP, SVG, etc.)");
        return;
      }

      setIsProcessing(true);
      setErrorMessage(null);
      setDetectedSummary(null);

      try {
        const scannerId = "hidden-file-scanner-container";
        const html5QrCode = new Html5Qrcode(scannerId, {
          formatsToSupport: SUPPORTED_FORMATS,
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });

        const decodedText = await html5QrCode.scanFile(file, false);

        if (decodedText) {
          if (soundEnabled) {
            playScanBeep();
          }
          triggerHaptic(60);

          let guessedFormat: BarcodeFormatName = "QR_CODE";
          if (/^\d{13}$/.test(decodedText.trim())) guessedFormat = "EAN_13";
          else if (/^\d{8}$/.test(decodedText.trim())) guessedFormat = "EAN_8";
          else if (/^\d{12}$/.test(decodedText.trim())) guessedFormat = "UPC_A";
          else if (/^[A-Z0-9\-_]{4,}$/i.test(decodedText.trim()) && !decodedText.includes("http") && !decodedText.includes("\n")) {
            guessedFormat = "CODE_128";
          }

          const parsed = parseBarcodePayload(decodedText, guessedFormat);

          const result: ScannedResult = {
            id: `scan-file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            rawText: decodedText,
            format: guessedFormat,
            timestamp: Date.now(),
            source: "file",
            parsed,
          };

          setDetectedSummary(`Detected: ${decodedText.slice(0, 40)}${decodedText.length > 40 ? "..." : ""}`);
          onScanSuccess(result);
        }
      } catch (err: unknown) {
        console.warn("Scan file error:", err);
        setErrorMessage(
          "No QR code or barcode found in this image. Ensure the code is clear, well-lit, and not cropped."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [soundEnabled, onScanSuccess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      scanImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      scanImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          scanImageFile(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [scanImageFile]);

  const handleSelectSample = (preset: typeof SAMPLE_PRESETS[0]) => {
    if (soundEnabled) {
      playScanBeep();
    }
    triggerHaptic(50);

    const parsed = parseBarcodePayload(preset.rawText, preset.format);
    const result: ScannedResult = {
      id: `scan-sample-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      rawText: preset.rawText,
      format: preset.format,
      timestamp: Date.now(),
      source: "sample",
      parsed,
    };

    setErrorMessage(null);
    setDetectedSummary(`Sample loaded: ${preset.label}`);
    onScanSuccess(result);
  };

  return (
    <div className="card bg-surface-1 border border-hairline rounded-3xl shadow-sm p-5 sm:p-7 space-y-6">
      {/* Hidden container for Html5Qrcode engine */}
      <div
        id="hidden-file-scanner-container"
        ref={hiddenScannerDivRef}
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-fin-orange bg-fin-orange/5 scale-[0.99]"
            : "border-hairline hover:border-ink hover:bg-canvas/50"
        } ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Dedicated mobile camera capture input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-2 flex items-center justify-center text-fin-orange border border-hairline-soft shadow-inner">
            {isProcessing ? (
              <span className="loading loading-spinner loading-md text-fin-orange" />
            ) : (
              <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-ink">
              {isProcessing
                ? "Decoding barcode from image..."
                : "Upload or Drop Image File"}
            </p>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              PNG, JPG, WEBP, SVG · Or press <kbd className="kbd kbd-xs bg-canvas text-ink border border-hairline font-mono">⌘ V</kbd> to paste screenshot
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-xl text-xs font-semibold px-4 shadow-none pointer-events-none"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Browse Image</span>
            </button>

            {/* Mobile Snap Photo Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="btn btn-outline btn-sm rounded-xl text-xs font-semibold px-4 border-hairline text-ink hover:bg-canvas sm:hidden"
            >
              <Camera className="w-3.5 h-3.5 text-fin-orange" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div className="alert alert-error bg-error/10 border-error/20 text-ink rounded-2xl text-xs py-3 px-4 flex items-start gap-2 shadow-none animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-error">Scan Unsuccessful</span>
            <p className="text-ink-muted text-xs leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {detectedSummary && !errorMessage && (
        <div className="alert alert-success bg-semantic-success/10 border-semantic-success/20 text-ink rounded-2xl text-xs py-3 px-4 flex items-center gap-2 shadow-none animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" />
          <span className="font-semibold text-ink">{detectedSummary}</span>
        </div>
      )}

      {/* Sample Presets Strip with Mobile Scroll Snapping */}
      <div className="space-y-3 pt-3 border-t border-hairline-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
            <span>Try Instant Sample Presets</span>
          </div>
          <span className="text-[11px] text-ink-subtle hidden sm:inline">
            1-Tap instant decode
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x">
          {SAMPLE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectSample(preset)}
                className="card bg-canvas hover:bg-surface-2 border border-hairline hover:border-ink rounded-2xl p-3 text-left transition-all group shadow-none flex flex-row items-center gap-3 shrink-0 w-64 sm:w-auto snap-start active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-ink group-hover:text-fin-orange group-hover:scale-105 transition-all shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-ink truncate group-hover:text-fin-orange transition-colors">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-ink-muted truncate">
                    {preset.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
