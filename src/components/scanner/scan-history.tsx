"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  FileSpreadsheet,
  QrCode,
  Barcode,
  Globe,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { ScannedResult } from "./scanner.types";
import { exportHistoryToCSV, getFormatLabel, triggerHaptic } from "./scanner.utils";

interface ScanHistoryProps {
  history: ScannedResult[];
  onSelectResult: (result: ScannedResult) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export function ScanHistory({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteItem,
}: ScanHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyItem = async (e: React.MouseEvent, item: ScannedResult) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.rawText);
      setCopiedId(item.id);
      triggerHaptic(30);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl sm:rounded-3xl shadow-xs p-4 sm:p-5 space-y-3.5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-hairline-soft">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-fin-orange" />
          <h3 className="text-xs sm:text-sm font-bold text-ink">Recent Scans</h3>
          <span className="badge badge-xs bg-canvas border border-hairline text-ink font-semibold px-1.5 py-0.5">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-1">
            {/* Export CSV */}
            <button
              type="button"
              onClick={() => exportHistoryToCSV(history)}
              className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1 px-2"
              title="Download CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Clear All */}
            <button
              type="button"
              onClick={onClearHistory}
              className="btn btn-ghost btn-xs text-error/80 hover:text-error hover:bg-error/10 gap-1 px-2"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items List */}
      {history.length > 0 ? (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
          {history.map((item) => {
            const label = getFormatLabel(item.format);
            const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="p-2.5 sm:p-3 bg-canvas hover:bg-surface-2 border border-hairline-soft hover:border-hairline rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-ink-muted group-hover:text-fin-orange">
                    {item.format === "QR_CODE" ? (
                      <QrCode className="w-3.5 h-3.5" />
                    ) : item.parsed.type === "url" ? (
                      <Globe className="w-3.5 h-3.5" />
                    ) : (
                      <Barcode className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="badge badge-xs bg-surface-1 text-ink border-hairline font-semibold text-[10px]">
                        {label}
                      </span>
                      <span className="text-[10px] text-ink-tertiary">
                        {timeStr}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-ink truncate font-mono">
                      {item.rawText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCopyItem(e, item)}
                    className="btn btn-ghost btn-circle btn-xs text-ink-muted hover:text-ink"
                    title="Copy text"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-semantic-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="btn btn-ghost btn-circle btn-xs text-ink-tertiary hover:text-error hover:bg-error/10"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-ink transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center space-y-1.5 bg-canvas/50 border border-hairline rounded-xl">
          <p className="text-xs font-semibold text-ink">No Scan History</p>
          <p className="text-[11px] text-ink-muted">
            Scanned barcodes and QR codes will appear here
          </p>
        </div>
      )}
    </div>
  );
}
