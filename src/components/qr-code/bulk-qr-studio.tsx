"use client";

import React, { useState, useMemo } from "react";
import { clsx } from "clsx";
import {
  Layers,
  ListOrdered,
  FileSpreadsheet,
  Printer,
  Palette,
  Sparkles,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { QRCodeBatch } from "./qr-code-batch";
import { downloadBlob } from "./qr-code.utils";
import type { FramePreset, QRCodeBatchItem } from "./qr-code.types";

const MAX_BATCH_SIZE = 50;

const SWATCHES = [
  { name: "Brand Violet", hex: "#5645d4" },
  { name: "Navy", hex: "#0a1530" },
  { name: "Link Blue", hex: "#0075de" },
  { name: "Brand Orange", hex: "#dd5b00" },
  { name: "Emerald", hex: "#059669" },
];

const FRAMES: { id: FramePreset; label: string }[] = [
  { id: "menu", label: "Scan for Menu" },
  { id: "order", label: "Order & Pay" },
  { id: "review", label: "Google Review" },
  { id: "scan-me", label: "SCAN ME" },
  { id: "none", label: "Plain QR" },
];

const DEFAULT_CUSTOM_LIST = `Table 01, https://www.qrvenues.com/menu/bistro?table=01
Table 02, https://www.qrvenues.com/menu/bistro?table=02
Table 03, https://www.qrvenues.com/menu/bistro?table=03
Patio 01, https://www.qrvenues.com/menu/bistro?table=patio-1`;

export function BulkQRStudio() {
  const [mode, setMode] = useState<"sequential" | "custom">("sequential");

  // Sequential mode state
  const [urlTemplate, setUrlTemplate] = useState(
    "https://www.qrvenues.com/menu/the-artisan-cafe?table={n}"
  );
  const [labelPrefix, setLabelPrefix] = useState("Table");
  const [startNum, setStartNum] = useState(1);
  const [count, setCount] = useState(8);
  const [zeroPad, setZeroPad] = useState(true);

  // Custom list / CSV mode state
  const [customLines, setCustomLines] = useState(DEFAULT_CUSTOM_LIST);

  // Shared styling
  const [fgColor, setFgColor] = useState("#0a1530");
  const [frame, setFrame] = useState<FramePreset>("menu");
  const [format, setFormat] = useState<"png" | "svg">("png");

  const items = useMemo<QRCodeBatchItem[]>(() => {
    if (mode === "sequential") {
      const safeCount = Math.min(MAX_BATCH_SIZE, Math.max(1, count));
      const safeStart = Math.max(0, startNum);
      const list: QRCodeBatchItem[] = [];

      for (let i = 0; i < safeCount; i++) {
        const num = safeStart + i;
        const formatted = zeroPad && num < 10 ? `0${num}` : String(num);
        const value = urlTemplate.includes("{n}")
          ? urlTemplate.replaceAll("{n}", formatted)
          : `${urlTemplate}${formatted}`;
        const label = `${labelPrefix.trim() || "Item"} ${formatted}`;
        list.push({
          value,
          label,
          badge: label,
          filename: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
      }
      return list;
    }

    // Custom CSV / line-by-line parser
    return customLines
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, MAX_BATCH_SIZE)
      .map((line, index) => {
        const commaIdx = line.indexOf(",");
        const tabIdx = line.indexOf("\t");
        const splitIdx =
          tabIdx !== -1 ? tabIdx : commaIdx !== -1 ? commaIdx : -1;

        if (splitIdx !== -1) {
          const left = line.slice(0, splitIdx).trim();
          const right = line.slice(splitIdx + 1).trim();
          if (right) {
            return {
              label: left || `QR #${index + 1}`,
              badge: left || `QR #${index + 1}`,
              value: right,
            };
          }
        }

        return {
          label: `Code #${index + 1}`,
          badge: `QR #${index + 1}`,
          value: line,
        };
      });
  }, [mode, urlTemplate, labelPrefix, startNum, count, zeroPad, customLines]);

  const handleExportCsvManifest = () => {
    if (!items.length) return;
    const sanitize = (v: string) => {
      const safe = /^[=+\-@]/.test(v) ? `'${v}` : v;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const rows = [
      "Index,Label,Encoded Value",
      ...items.map((item, idx) =>
        [idx + 1, sanitize(item.label || `QR #${idx + 1}`), sanitize(item.value)].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    downloadBlob(
      blob,
      `qrvenues-bulk-manifest-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handlePrintSheet = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-surface-1 border border-hairline rounded-2xl shadow-none overflow-hidden">
        {/* Top Bar & Mode Tabs */}
        <div className="border-b border-hairline bg-canvas/40 px-4 sm:px-6 pt-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-primary">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">
                  Bulk QR Code Generator Studio
                </div>
                <p className="text-[11px] text-ink-muted">
                  Generate up to {MAX_BATCH_SIZE} branded QR codes in one batch with instant CSV manifest export.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="badge badge-sm bg-semantic-success/15 text-semantic-success border-0 font-medium text-[11px] gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {items.length} Ready
              </span>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Bulk QR Input Modes"
            className="flex items-center gap-1 -mb-[1px]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "sequential"}
              onClick={() => setMode("sequential")}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all rounded-t-lg",
                mode === "sequential"
                  ? "border-primary text-primary font-semibold bg-surface-1"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Sequential Tables / Rooms</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "custom"}
              onClick={() => setMode("custom")}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all rounded-t-lg",
                mode === "custom"
                  ? "border-primary text-primary font-semibold bg-surface-1"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Custom List / CSV Paste</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="p-4 sm:p-6 space-y-5">
          {mode === "sequential" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-1.5">
                <label
                  htmlFor="bulk-url-template"
                  className="text-xs font-semibold text-ink flex items-center justify-between"
                >
                  <span>URL Template (use {"{n}"} for sequence)</span>
                  <span className="text-[10px] text-ink-subtle font-mono">
                    {"{n}"} → 01, 02...
                  </span>
                </label>
                <input
                  id="bulk-url-template"
                  type="text"
                  value={urlTemplate}
                  onChange={(e) => setUrlTemplate(e.target.value)}
                  className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="bulk-label-prefix"
                  className="text-xs font-semibold text-ink"
                >
                  Label Prefix
                </label>
                <input
                  id="bulk-label-prefix"
                  type="text"
                  value={labelPrefix}
                  onChange={(e) => setLabelPrefix(e.target.value)}
                  placeholder="Table"
                  className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="bulk-start-num"
                  className="text-xs font-semibold text-ink"
                >
                  Start #
                </label>
                <input
                  id="bulk-start-num"
                  type="number"
                  min={0}
                  max={9999}
                  value={startNum}
                  onChange={(e) => setStartNum(Number(e.target.value) || 0)}
                  className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="bulk-count"
                  className="text-xs font-semibold text-ink"
                >
                  Quantity (1–{MAX_BATCH_SIZE})
                </label>
                <input
                  id="bulk-count"
                  type="number"
                  min={1}
                  max={MAX_BATCH_SIZE}
                  value={count}
                  onChange={(e) =>
                    setCount(
                      Math.min(MAX_BATCH_SIZE, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="input input-sm w-full bg-canvas border border-hairline rounded-lg text-xs font-medium text-ink h-10"
                />
              </div>

              <div className="md:col-span-12 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-muted">
                  <input
                    type="checkbox"
                    checked={zeroPad}
                    onChange={(e) => setZeroPad(e.target.checked)}
                    className="checkbox checkbox-xs checkbox-primary"
                  />
                  <span>Zero-pad single digits (01, 02, ... 09)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label
                htmlFor="bulk-custom-lines"
                className="text-xs font-semibold text-ink flex items-center justify-between"
              >
                <span>Paste URLs or &quot;Label, URL&quot; Pairs (one per line, max {MAX_BATCH_SIZE})</span>
                <span className="text-[10px] text-ink-subtle">
                  Supports CSV or Excel Tab paste
                </span>
              </label>
              <textarea
                id="bulk-custom-lines"
                rows={5}
                value={customLines}
                onChange={(e) => setCustomLines(e.target.value)}
                className="textarea textarea-sm w-full bg-canvas border border-hairline rounded-xl text-xs font-mono text-ink leading-relaxed"
              />
            </div>
          )}

          {/* Shared Styling & Export Bar */}
          <div className="pt-4 border-t border-hairline-soft flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Swatches */}
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-primary mr-1" />
                {SWATCHES.map((s) => (
                  <button
                    key={s.hex}
                    type="button"
                    aria-label={`Set batch color to ${s.name}`}
                    onClick={() => setFgColor(s.hex)}
                    className={clsx(
                      "w-6 h-6 rounded-full border transition-transform",
                      fgColor === s.hex
                        ? "scale-110 border-ink ring-2 ring-primary/30"
                        : "border-black/15 hover:scale-105"
                    )}
                    style={{ backgroundColor: s.hex }}
                    title={s.name}
                  />
                ))}
              </div>

              {/* Frame Selector */}
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fin-orange" />
                <select
                  aria-label="Batch frame style"
                  value={frame}
                  onChange={(e) => setFrame(e.target.value as FramePreset)}
                  className="select select-xs select-bordered bg-canvas border-hairline text-ink text-xs rounded-lg h-8"
                >
                  {FRAMES.map((f) => (
                    <option key={f.id} value={f.id}>
                      Frame: {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Format Selector */}
              <select
                aria-label="Batch download format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "png" | "svg")}
                className="select select-xs select-bordered bg-canvas border-hairline text-ink text-xs rounded-lg h-8"
              >
                <option value="png">Export: Framed PNG (300 DPI)</option>
                <option value="svg">Export: Vector SVG</option>
              </select>
            </div>

            {/* Batch Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsvManifest}
                className="btn btn-sm bg-surface-1 border border-hairline hover:bg-canvas text-ink rounded-lg text-xs font-medium h-9 min-h-9 gap-1.5 shadow-none"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-semantic-success" />
                <span>Export CSV Manifest</span>
              </button>
              <button
                type="button"
                onClick={handlePrintSheet}
                className="btn btn-sm btn-primary rounded-lg text-xs font-medium h-9 min-h-9 gap-1.5 shadow-none"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Batch Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Generated Batch Grid */}
      <QRCodeBatch
        title="Generated Bulk QR Batch"
        description="Click Download on any individual card to export high-res print assets, or print the full sheet above."
        items={items}
        commonProps={{
          fgColor,
          frame,
          format,
          size: 150,
          level: "H",
          downloadable: true,
          processingSeconds: 3,
        }}
      />
    </div>
  );
}
