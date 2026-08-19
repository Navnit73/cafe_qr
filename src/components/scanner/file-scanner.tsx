"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileImage,
  AlertCircle,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  BarcodeFormatName,
  ScannedResult,
} from "./scanner.types";
import {
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
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.ITF,
];

const HIDDEN_CONTAINER_ID = "qr-file-scanner-worker";

export function FileScanner({ onScanSuccess, soundEnabled }: FileScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedSummary, setDetectedSummary] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  // Scan file using Html5Qrcode
  const scanImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setDetectedSummary(null);

    let html5QrCode: Html5Qrcode | null = null;
    try {
      html5QrCode = new Html5Qrcode(HIDDEN_CONTAINER_ID, {
        formatsToSupport: SUPPORTED_FORMATS,
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });

      const decodedText = await html5QrCode.scanFile(file, false);

      if (decodedText) {
        if (soundEnabledRef.current) {
          playScanBeep();
        }
        triggerHaptic(50);

        let guessedFormat: BarcodeFormatName = "QR_CODE";
        const trimmed = decodedText.trim();
        if (/^\d{13}$/.test(trimmed)) guessedFormat = "EAN_13";
        else if (/^\d{8}$/.test(trimmed)) guessedFormat = "EAN_8";
        else if (/^\d{12}$/.test(trimmed)) guessedFormat = "UPC_A";
        else if (/^[A-Z0-9\-_]{4,}$/i.test(trimmed) && !trimmed.includes("http") && !trimmed.includes("\n")) {
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

        setDetectedSummary(`Decoded: ${decodedText.slice(0, 35)}${decodedText.length > 35 ? "..." : ""}`);
        onScanSuccessRef.current(result);
      }
    } catch (err: unknown) {
      console.warn("Scan file error:", err);
      setErrorMessage(
        "No QR code or barcode found in this image. Ensure the image is clear and well-lit."
      );
    } finally {
      if (html5QrCode) {
        try {
          await html5QrCode.clear();
        } catch {
          // Ignore
        }
      }
      setIsProcessing(false);
    }
  }, []);

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
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = "";
    }
  };

  // Clipboard paste listener (Cmd+V / Ctrl+V)
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

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl sm:rounded-3xl shadow-xs p-4 sm:p-6 space-y-4 w-full">
      {/* Hidden container for worker engine */}
      <div id={HIDDEN_CONTAINER_ID} className="hidden" />

      {/* Main Drag & Drop / File Selector Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-150 ${
          isDragging
            ? "border-fin-orange bg-fin-orange/5"
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

        {/* Mobile camera snap input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-fin-orange border border-hairline-soft">
            {isProcessing ? (
              <span className="loading loading-spinner loading-md text-fin-orange" />
            ) : (
              <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-ink">
              {isProcessing ? "Decoding Image Barcode..." : "Upload or Drop Image File"}
            </p>
            <p className="text-xs text-ink-muted max-w-xs mx-auto">
              PNG, JPG, WEBP, SVG · Paste screenshot with <kbd className="kbd kbd-xs bg-canvas text-ink border border-hairline font-mono">⌘ V</kbd>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-xl text-xs font-semibold px-4 shadow-none pointer-events-none"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Browse Image</span>
            </button>

            {/* Mobile Take Photo fallback */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="btn btn-outline btn-sm rounded-xl text-xs font-semibold px-3.5 border-hairline text-ink hover:bg-canvas sm:hidden"
            >
              <Camera className="w-3.5 h-3.5 text-fin-orange" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="alert alert-error bg-error/10 border-error/20 text-ink rounded-xl text-xs py-2.5 px-3.5 flex items-start gap-2 shadow-none animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-error">Scan Unsuccessful</span>
            <p className="text-ink-muted text-xs leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Feedback */}
      {detectedSummary && !errorMessage && (
        <div className="alert alert-success bg-semantic-success/10 border-semantic-success/20 text-ink rounded-xl text-xs py-2.5 px-3.5 flex items-center gap-2 shadow-none animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" />
          <span className="font-semibold text-ink">{detectedSummary}</span>
        </div>
      )}
    </div>
  );
}
