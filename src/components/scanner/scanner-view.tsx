"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  UploadCloud,
  QrCode,
  CheckCircle2,
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

  // Load history from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save history
  const saveHistory = (newHistory: ScannedResult[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory.slice(0, 50)));
    } catch {
      // Ignore
    }
  };

  // Handle new scan result
  const handleScanSuccess = (result: ScannedResult) => {
    setCurrentResult(result);

    // Add to history (deduplicating same raw text)
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.rawText !== result.rawText);
      const updated = [result, ...filtered].slice(0, 50);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
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
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex bg-surface-1 border border-hairline p-1 rounded-2xl shadow-2xs w-full max-w-sm">
          <button
            type="button"
            onClick={() => {
              setActiveTab("camera");
              triggerHaptic(20);
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "camera"
                ? "bg-primary text-white shadow-2xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("upload");
              triggerHaptic(20);
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "upload"
                ? "bg-primary text-white shadow-2xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Active Scanner Viewport */}
        <div className="lg:col-span-7 space-y-4">
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

          {/* Compact Supported Formats Badge Strip */}
          <div className="card bg-surface-1 border border-hairline rounded-2xl p-3 sm:p-3.5 shadow-none flex flex-row items-center justify-between gap-2 text-xs">
            <span className="text-ink-muted font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
              <span>Supports QR, EAN-13, UPC, Code 128 & Data Matrix</span>
            </span>
            <span className="badge badge-xs bg-canvas text-ink-subtle border-hairline hidden sm:inline-flex">
              Fast Engine
            </span>
          </div>
        </div>

        {/* Right Column: Result Inspector & Recent Scans */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Result Card (if scanned) */}
          {currentResult ? (
            <ScanResultCard
              result={currentResult}
              onClear={handleClearCurrentResult}
            />
          ) : (
            <div className="card bg-surface-1 border border-hairline rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center space-y-2 shadow-none">
              <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline mx-auto flex items-center justify-center text-fin-orange">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-semibold text-ink">Ready to Scan</h3>
                <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
                  Hold a code in front of the camera or upload an image to view instant decoded actions.
                </p>
              </div>
            </div>
          )}

          {/* Scan History */}
          {mounted && (
            <ScanHistory
              history={history}
              onSelectResult={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteHistoryItem}
            />
          )}
        </div>
      </div>
    </div>
  );
}
