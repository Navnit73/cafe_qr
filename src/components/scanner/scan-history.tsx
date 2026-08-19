"use client";

import React, { useState } from "react";
import {
  History,
  Trash2,
  Download,
  FileSpreadsheet,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  QrCode,
  Barcode,
  Globe,
  Clock,
} from "lucide-react";
import { ScannedResult } from "./scanner.types";
import { exportHistoryToCSV, exportHistoryToJSON, getFormatLabel } from "./scanner.utils";

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
  const [filterType, setFilterType] = useState<"all" | "qr" | "barcode" | "url">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) => {
    // Filter type
    if (filterType === "qr" && item.format !== "QR_CODE") return false;
    if (filterType === "barcode" && item.format === "QR_CODE") return false;
    if (filterType === "url" && item.parsed.type !== "url") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = item.rawText.toLowerCase().includes(q);
      const matchFormat = item.format.toLowerCase().includes(q);
      const matchType = item.parsed.type.toLowerCase().includes(q);
      return matchText || matchFormat || matchType;
    }

    return true;
  });

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl shadow-none p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-hairline-soft">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-fin-orange" />
          <h3 className="text-sm font-semibold text-ink">Scan History</h3>
          <span className="badge badge-xs bg-canvas border border-hairline text-ink font-medium px-2 py-1">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-1.5">
            {/* Export CSV */}
            <button
              type="button"
              onClick={() => exportHistoryToCSV(history)}
              className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1"
              title="Export to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Export JSON */}
            <button
              type="button"
              onClick={() => exportHistoryToJSON(history)}
              className="btn btn-ghost btn-xs text-ink-muted hover:text-ink gap-1"
              title="Export to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Clear All */}
            <button
              type="button"
              onClick={onClearHistory}
              className="btn btn-ghost btn-xs text-error hover:bg-error/10 gap-1"
              title="Clear all scan history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {history.length > 0 ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm input-bordered w-full pl-8 text-xs bg-canvas text-ink border-hairline rounded-lg"
              />
            </div>

            {/* Filter Tabs */}
            <div className="join w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`join-item btn btn-xs text-[11px] ${
                  filterType === "all" ? "btn-active btn-primary" : "btn-ghost"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType("qr")}
                className={`join-item btn btn-xs text-[11px] ${
                  filterType === "qr" ? "btn-active btn-primary" : "btn-ghost"
                }`}
              >
                QR
              </button>
              <button
                type="button"
                onClick={() => setFilterType("barcode")}
                className={`join-item btn btn-xs text-[11px] ${
                  filterType === "barcode" ? "btn-active btn-primary" : "btn-ghost"
                }`}
              >
                Barcodes
              </button>
              <button
                type="button"
                onClick={() => setFilterType("url")}
                className={`join-item btn btn-xs text-[11px] ${
                  filterType === "url" ? "btn-active btn-primary" : "btn-ghost"
                }`}
              >
                URLs
              </button>
            </div>
          </div>

          {/* List of scanned items */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => {
                const label = getFormatLabel(item.format);
                const timeFormatted = new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-canvas hover:bg-surface-2 border border-hairline rounded-xl transition-colors flex items-center justify-between gap-3 group"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectResult(item)}
                      className="min-w-0 flex-1 text-left flex items-start gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center shrink-0 text-ink-muted group-hover:text-fin-orange mt-0.5">
                        {item.format === "QR_CODE" ? (
                          <QrCode className="w-3.5 h-3.5" />
                        ) : item.parsed.type === "url" ? (
                          <Globe className="w-3.5 h-3.5" />
                        ) : (
                          <Barcode className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="badge badge-xs bg-surface-1 text-ink border-hairline font-semibold text-[10px]">
                            {label}
                          </span>
                          <span className="text-[10px] text-ink-tertiary">
                            {timeFormatted}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-ink truncate font-mono">
                          {item.rawText}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectResult(item)}
                        className="btn btn-ghost btn-circle btn-xs text-ink-muted hover:text-ink"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="btn btn-ghost btn-circle btn-xs text-ink-tertiary hover:text-error hover:bg-error/10"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-ink-muted bg-canvas rounded-xl border border-hairline">
                No scans match your filter &quot;{searchQuery || filterType}&quot;.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="p-8 text-center space-y-2 bg-canvas/40 border border-hairline rounded-xl">
          <div className="w-10 h-10 rounded-full bg-surface-1 border border-hairline mx-auto flex items-center justify-center text-ink-tertiary">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-ink">No Scan History Yet</p>
          <p className="text-[11px] text-ink-muted max-w-xs mx-auto">
            Codes you scan via camera or image upload will be saved here locally for quick reference and CSV export.
          </p>
        </div>
      )}
    </div>
  );
}
