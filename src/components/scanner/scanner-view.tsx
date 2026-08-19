"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  UploadCloud,
  Volume2,
  VolumeX,
  History,
  QrCode,
  Barcode,
  Layers,
  Sparkles,
  CheckCircle2,
  ListFilter,
  X,
} from "lucide-react";
import { CameraScanner } from "./camera-scanner";
import { FileScanner } from "./file-scanner";
import { ScanResultCard } from "./scan-result-card";
import { ScanHistory } from "./scan-history";
import { ScannedResult } from "./scanner.types";
import { triggerHaptic } from "./scanner.utils";

const HISTORY_STORAGE_KEY = "qrvenues_scan_history_v1";

export function ScannerView() {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentResult, setCurrentResult] = useState<ScannedResult | null>(null);
  const [history, setHistory] = useState<ScannedResult[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  // Load history from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ScannedResult[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory.slice(0, 100)));
    } catch {
      // Ignore
    }
  };

  // Handle new scan result
  const handleScanSuccess = (result: ScannedResult) => {
    setCurrentResult(result);

    // Prepend to history
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.rawText !== result.rawText);
      const updated = [result, ...filtered].slice(0, 100);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    // Mobile UX: Smooth scroll down to result card automatically
    setTimeout(() => {
      const resultAnchor = document.getElementById("scan-result-card-anchor");
      if (resultAnchor) {
        resultAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleClearCurrentResult = () => {
    setCurrentResult(null);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleSelectHistoryItem = (item: ScannedResult) => {
    setCurrentResult(item);
    setMobileHistoryOpen(false);
    setTimeout(() => {
      const resultAnchor = document.getElementById("scan-result-card-anchor");
      if (resultAnchor) {
        resultAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Tab Switcher & Quick Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-hairline-soft">
        {/* Full-width Mobile Segmented Pill Tabs */}
        <div className="grid grid-cols-2 bg-surface-1 border border-hairline p-1 rounded-2xl w-full sm:w-auto shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("camera");
              triggerHaptic(30);
            }}
            className={`py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              activeTab === "camera"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("upload");
              triggerHaptic(30);
            }}
            className={`py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              activeTab === "upload"
                ? "bg-primary text-white shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Action Pills & Mobile History Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Mobile History Drawer Button */}
          <button
            type="button"
            onClick={() => {
              setMobileHistoryOpen(true);
              triggerHaptic(30);
            }}
            className="lg:hidden btn btn-sm bg-surface-1 border border-hairline text-ink rounded-xl text-xs font-medium gap-1.5 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-fin-orange" />
            <span>History ({history.length})</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              triggerHaptic(30);
            }}
            className="btn btn-sm bg-surface-1 border border-hairline text-ink rounded-xl text-xs font-medium gap-1.5 shadow-2xs ml-auto"
            title={soundEnabled ? "Mute scan audio" : "Enable scan audio"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-fin-orange" />
                <span>Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-ink-tertiary" />
                <span>Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Scanner Left / Result & History Right on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Active Scanner Viewport */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === "camera" ? (
            <CameraScanner
              onScanSuccess={handleScanSuccess}
              onSwitchToFileScan={() => setActiveTab("upload")}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
          ) : (
            <FileScanner
              onScanSuccess={handleScanSuccess}
              soundEnabled={soundEnabled}
            />
          )}

          {/* Supported Formats Pill Strip */}
          <div className="card bg-surface-1 border border-hairline rounded-3xl p-4 sm:p-5 shadow-none space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-fin-orange" />
                <span>Supported Formats</span>
              </span>
              <span className="text-[11px] text-semantic-success font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Universal Engine</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-ink-muted">
              <div className="p-2.5 bg-canvas rounded-xl border border-hairline-soft">
                <strong className="text-ink block mb-0.5">2D Barcodes:</strong>
                QR Code, Data Matrix, Aztec, PDF-417
              </div>
              <div className="p-2.5 bg-canvas rounded-xl border border-hairline-soft">
                <strong className="text-ink block mb-0.5">Retail & Grocery:</strong>
                EAN-13, EAN-8, UPC-A, UPC-E
              </div>
              <div className="p-2.5 bg-canvas rounded-xl border border-hairline-soft">
                <strong className="text-ink block mb-0.5">Logistics:</strong>
                Code 128, Code 39, Code 93, ITF
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result Inspector & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Anchor for automatic smooth scrolling */}
          <div id="scan-result-card-anchor" className="scroll-mt-24 space-y-2">
            {/* Active Result Card (if any) */}
            {currentResult ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
                    <span>Active Result</span>
                  </span>
                  <span className="badge badge-xs bg-semantic-success text-white font-bold border-0 px-2 py-1">
                    Decoded
                  </span>
                </div>
                <ScanResultCard
                  result={currentResult}
                  onClear={handleClearCurrentResult}
                />
              </div>
            ) : (
              <div className="card bg-surface-1 border border-hairline rounded-3xl p-6 text-center space-y-3 shadow-none">
                <div className="w-14 h-14 rounded-2xl bg-canvas border border-hairline mx-auto flex items-center justify-center text-fin-orange shadow-inner">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-ink">Ready to Scan</h3>
                  <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto">
                    Point your camera at any QR code or barcode, or upload an image to view detected content and instant actions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Scan History Component */}
          {mounted && (
            <div className="hidden lg:block">
              <ScanHistory
                history={history}
                onSelectResult={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteHistoryItem}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Up History Drawer Modal */}
      {mobileHistoryOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-surface-1 rounded-t-3xl border-t border-hairline p-4 sm:p-6 max-h-[85vh] flex flex-col space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between pb-2 border-b border-hairline-soft">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-fin-orange" />
                <h3 className="text-sm font-bold text-ink">Scan History</h3>
                <span className="badge badge-xs bg-canvas border border-hairline text-ink font-semibold">
                  {history.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileHistoryOpen(false)}
                className="btn btn-ghost btn-circle btn-sm text-ink-muted hover:text-ink"
                aria-label="Close history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <ScanHistory
                history={history}
                onSelectResult={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
                onDeleteItem={handleDeleteHistoryItem}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
