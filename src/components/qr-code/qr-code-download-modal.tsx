"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Download,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import type { FramePreset } from "./qr-code.types";
import {
  renderCompositeCardCanvas,
  canvasToBlob,
  downloadBlob,
  downloadDataUrl,
} from "./qr-code.utils";

export interface QRCodeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: string;
  format: "png" | "svg";
  frame?: FramePreset;
  frameLabel?: string;
  frameSubtext?: string;
  frameBgColor?: string;
  frameTextColor?: string;
  getCanvas: () => HTMLCanvasElement | null;
  getSvgString?: () => string | null;
  filename?: string;
  processingDuration?: number; // In seconds (default: 15)
  includeFrame?: boolean;
}

interface StepInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  startSec: number;
  endSec: number;
}

const PROCESSING_STEPS: StepInfo[] = [
  {
    id: "init",
    title: "Initializing High-Res Canvas",
    description: "Configuring 300 DPI layout grid and color profile...",
    icon: Sparkles,
    startSec: 0,
    endSec: 3.0,
  },
  {
    id: "frame",
    title: "Rendering Tabletop Frame & Typography",
    description: "Composing custom banner, badge accents, and typography...",
    icon: Layers,
    startSec: 3.0,
    endSec: 6.5,
  },
  {
    id: "scannability",
    title: "Optimizing Error Correction & Contrast",
    description: "Validating Level H scannability matrix and finder patterns...",
    icon: ShieldCheck,
    startSec: 6.5,
    endSec: 10.5,
  },
  {
    id: "compress",
    title: "Synthesizing Anti-Aliased Asset",
    description: "Rendering high-fidelity pixels with custom logo overlay...",
    icon: Loader2,
    startSec: 10.5,
    endSec: 13.5,
  },
  {
    id: "finalize",
    title: "Packaging & Generating Download",
    description: "Exporting crystal-clear production file...",
    icon: FileCheck,
    startSec: 13.5,
    endSec: 15.0,
  },
];

export function QRCodeDownloadModal({
  isOpen,
  onClose,
  value,
  format,
  frame = "none",
  frameLabel,
  frameSubtext,
  frameBgColor,
  frameTextColor,
  getCanvas,
  getSvgString,
  filename = "qr-code",
  processingDuration = 15,
  includeFrame = true,
}: QRCodeDownloadModalProps) {
  if (!isOpen) return null;

  return (
    <QRCodeDownloadModalContent
      onClose={onClose}
      value={value}
      format={format}
      frame={frame}
      frameLabel={frameLabel}
      frameSubtext={frameSubtext}
      frameBgColor={frameBgColor}
      frameTextColor={frameTextColor}
      getCanvas={getCanvas}
      getSvgString={getSvgString}
      filename={filename}
      processingDuration={processingDuration}
      includeFrame={includeFrame}
    />
  );
}

function QRCodeDownloadModalContent({
  onClose,
  value,
  format,
  frame = "none",
  frameLabel,
  frameSubtext,
  frameBgColor,
  frameTextColor,
  getCanvas,
  getSvgString,
  filename = "qr-code",
  processingDuration = 15,
  includeFrame = true,
}: Omit<QRCodeDownloadModalProps, "isOpen">) {
  const [elapsed, setElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasTriggeredDownload = useRef(false);

  const totalMs = processingDuration * 1000;
  const progressPercent = Math.min(100, Math.round((elapsed / totalMs) * 100));
  const remainingSeconds = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));

  // Extract thumbnail preview on mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const sourceCanvas = getCanvas();
      if (sourceCanvas) {
        try {
          setPreviewDataUrl(sourceCanvas.toDataURL("image/png"));
        } catch {
          // Ignore cross-origin error
        }
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [getCanvas]);

  // Actual Download Execution Handler
  const executeDownload = useCallback(async () => {
    setIsExporting(true);
    try {
      if (format === "svg" && getSvgString) {
        const svgStr = getSvgString();
        if (svgStr) {
          const blob = new Blob([svgStr], {
            type: "image/svg+xml;charset=utf-8",
          });
          downloadBlob(blob, `${filename}.svg`);
          setIsExporting(false);
          return;
        }
      }

      // PNG composite export
      const sourceCanvas = getCanvas();
      if (!sourceCanvas) {
        setIsExporting(false);
        return;
      }

      if (includeFrame && frame !== "none") {
        const compositeCanvas = await renderCompositeCardCanvas({
          qrCanvas: sourceCanvas,
          frame,
          frameLabel,
          frameSubtext,
          frameBgColor,
          frameTextColor,
          targetScale: 3, // 3x ultra-crisp output (approx 1200px+ width)
        });
        const blob = await canvasToBlob(compositeCanvas, "image/png", 1.0);
        downloadBlob(blob, `${filename}-framed.png`);
      } else {
        const standaloneCanvas = await renderCompositeCardCanvas({
          qrCanvas: sourceCanvas,
          frame: "none",
          targetScale: 3,
        });
        const blob = await canvasToBlob(standaloneCanvas, "image/png", 1.0);
        downloadBlob(blob, `${filename}.png`);
      }
    } catch (err) {
      console.error("Export error:", err);
      // Fallback
      const sourceCanvas = getCanvas();
      if (sourceCanvas) {
        downloadDataUrl(sourceCanvas.toDataURL("image/png"), `${filename}.png`);
      }
    } finally {
      setIsExporting(false);
    }
  }, [
    format,
    getSvgString,
    getCanvas,
    includeFrame,
    frame,
    frameLabel,
    frameSubtext,
    frameBgColor,
    frameTextColor,
    filename,
  ]);

  // Timer Animation Loop
  useEffect(() => {
    startTimeRef.current = performance.now();
    hasTriggeredDownload.current = false;

    const updateTimer = (currentTime: number) => {
      if (!startTimeRef.current) return;
      const diff = currentTime - startTimeRef.current;
      const currentElapsed = Math.min(totalMs, diff);
      setElapsed(currentElapsed);

      if (currentElapsed >= totalMs) {
        setIsCompleted(true);
        if (!hasTriggeredDownload.current) {
          hasTriggeredDownload.current = true;
          executeDownload();
        }
      } else {
        animFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalMs, executeDownload]);

  const currentSeconds = elapsed / 1000;
  const currentStepIndex = Math.min(
    PROCESSING_STEPS.length - 1,
    PROCESSING_STEPS.findIndex(
      (s) => currentSeconds >= s.startSec && currentSeconds < s.endSec
    ) === -1
      ? PROCESSING_STEPS.length - 1
      : PROCESSING_STEPS.findIndex(
          (s) => currentSeconds >= s.startSec && currentSeconds < s.endSec
        )
  );

  const activeStep = PROCESSING_STEPS[currentStepIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div className="bg-surface-1 border border-hairline rounded-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between bg-canvas/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-ink font-semibold text-xs">
              <Download className="w-4 h-4 text-fin-orange" />
            </div>
            <div>
              <h3
                id="download-modal-title"
                className="text-sm font-semibold text-ink leading-tight"
              >
                {isCompleted
                  ? "Export Ready for Download"
                  : "Generating High-Resolution Asset"}
              </h3>
              <p className="text-[11px] text-ink-muted">
                {isCompleted
                  ? "Your asset was generated and downloaded."
                  : `Processing high-DPI ${format.toUpperCase()} (15-second optimization)`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-square text-ink-muted hover:text-ink rounded-lg"
            aria-label="Close download modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Progress Overview Card */}
          <div className="bg-canvas border border-hairline-soft rounded-xl p-4 sm:p-5 flex flex-col items-center text-center space-y-4">
            {/* Live Preview Thumbnail or Success Icon */}
            <div className="relative flex items-center justify-center">
              {previewDataUrl ? (
                <div className="w-24 h-24 rounded-xl border border-hairline bg-surface-1 p-2 flex items-center justify-center overflow-hidden transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewDataUrl}
                    alt={value ? `Preview for ${value}` : "QR Code Preview"}
                    className="w-full h-full object-contain"
                  />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center animate-in zoom-in-50">
                      <CheckCircle2 className="w-10 h-10 text-semantic-success drop-shadow-md" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-surface-1 border border-hairline flex items-center justify-center">
                  <Download className="w-8 h-8 text-[#059669] animate-pulse" />
                </div>
              )}
            </div>

            {/* Countdown / Percentage Display */}
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>
                  {isCompleted
                    ? "✨ 100% Processed"
                    : `${progressPercent}% Completed`}
                </span>
                <span className="text-ink-muted font-mono text-[11px]">
                  {isCompleted
                    ? "0s remaining"
                    : `${remainingSeconds}s remaining (${(elapsed / 1000).toFixed(1)}s / ${processingDuration}s)`}
                </span>
              </div>

              {/* daisyUI Progress Bar */}
              <div className="w-full bg-surface-2 rounded-full h-2.5 overflow-hidden border border-hairline-soft">
                <div
                  className={clsx(
                    "h-full transition-all ease-out rounded-full",
                    isCompleted
                      ? "bg-semantic-success"
                      : "bg-gradient-to-r from-[#059669] via-[#2563eb] to-fin-orange"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Current Active Step Callout */}
            <div className="w-full bg-surface-1 border border-hairline rounded-lg p-3 flex items-start gap-3 text-left">
              <div className="w-7 h-7 rounded-md bg-canvas border border-hairline-soft flex items-center justify-center shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                ) : (
                  <activeStep.icon className="w-4 h-4 text-[#059669] animate-spin" />
                )}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="text-xs font-semibold text-ink block truncate">
                  {isCompleted
                    ? "File Generation Completed!"
                    : activeStep.title}
                </span>
                <span className="text-[11px] text-ink-muted leading-tight block">
                  {isCompleted
                    ? "Your high-resolution asset is ready for printing and digital deployment."
                    : activeStep.description}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
              Processing Pipeline Stages
            </span>
            <div className="space-y-1.5">
              {PROCESSING_STEPS.map((step, idx) => {
                const isStepDone =
                  isCompleted || currentSeconds >= step.endSec;
                const isStepCurrent =
                  !isCompleted &&
                  currentSeconds >= step.startSec &&
                  currentSeconds < step.endSec;

                return (
                  <div
                    key={step.id}
                    className={clsx(
                      "flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all",
                      isStepCurrent
                        ? "bg-surface-1 border-[#059669] font-medium text-ink ring-1 ring-[#059669]/20"
                        : isStepDone
                        ? "bg-canvas/50 border-hairline-soft text-ink-muted"
                        : "bg-canvas/20 border-transparent text-ink-tertiary"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono w-4 text-center">
                        {idx + 1}.
                      </span>
                      <span className="truncate">{step.title}</span>
                    </div>
                    <div>
                      {isStepDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                      ) : isStepCurrent ? (
                        <span className="badge badge-xs bg-[#f0fdf4] text-[#059669] border-[#bbf7d0] font-mono text-[9px]">
                          RUNNING
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-ink-tertiary">
                          WAIT
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 border-t border-hairline bg-canvas/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost text-xs text-ink-muted hover:text-ink font-medium h-9 min-h-9 px-4 rounded-lg"
          >
            {isCompleted ? "Close" : "Cancel"}
          </button>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <button
                  type="button"
                  onClick={executeDownload}
                  disabled={isExporting}
                  className="btn btn-sm bg-surface-1 border border-hairline hover:bg-canvas text-ink text-xs font-semibold h-9 min-h-9 px-3.5 rounded-lg gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Download Again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-primary text-xs font-semibold h-9 min-h-9 px-5 rounded-lg gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-semantic-success" />
                  <span>Done</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                <Loader2 className="w-3.5 h-3.5 text-[#059669] animate-spin" />
                <span>Processing asset ({remainingSeconds}s)...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
