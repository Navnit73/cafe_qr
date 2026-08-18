"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { Copy, Check, QrCode as QrIcon } from "lucide-react";
import { QRCode } from "./qr-code";
import type { QRCodeBatchProps } from "./qr-code.types";
import { copyValueToClipboard } from "./qr-code.utils";

// ---------------------------------------------------------------------------
// QRCodeBatch — renders a responsive, interactive grid of QR codes
// ---------------------------------------------------------------------------
export const QRCodeBatch = React.memo(function QRCodeBatch({
  items,
  commonProps = {},
  className,
  title,
  description,
}: QRCodeBatchProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!items.length) return null;

  const handleCopy = async (val: string, idx: number) => {
    const ok = await copyValueToClipboard(val);
    if (ok) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className={clsx("space-y-4 my-6 w-full", className)}>
      {(title || description) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                <QrIcon className="w-4 h-4 text-primary" />
                <span>{title}</span>
              </h3>
            )}
            {description && (
              <p className="text-xs text-ink-muted">{description}</p>
            )}
          </div>
          <span className="badge badge-sm bg-surface-2 border-hairline text-ink-muted font-mono text-[11px] self-start sm:self-auto">
            {items.length} Codes
          </span>
        </div>
      )}

      <div
        className={clsx(
          "grid gap-4 sm:gap-6",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {items.map((item, index) => (
          <div
            key={`${item.value}-${index}`}
            className="bg-surface-1 border border-hairline rounded-xl p-4 flex flex-col items-center justify-between gap-3 text-center transition-all hover:border-ink/40"
          >
            {/* Header / Table Badge */}
            <div className="flex items-center justify-between w-full">
              <span className="badge badge-xs bg-secondary text-primary border-primary/20 font-medium text-[10px]">
                {item.badge || `QR #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(item.value, index)}
                className="btn btn-ghost btn-xs h-6 min-h-6 px-1.5 text-[10px] text-ink-muted hover:text-ink gap-1 rounded-md"
                aria-label={`Copy value for QR #${index + 1}`}
              >
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-semantic-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* QR Render */}
            <div className="py-1">
              <QRCode
                {...commonProps}
                value={item.value}
                size={commonProps.size || 160}
                downloadable={commonProps.downloadable ?? true}
              />
            </div>

            {/* Label */}
            {item.label && (
              <div className="w-full pt-2 border-t border-hairline-soft">
                <span className="text-xs font-semibold text-ink block truncate">
                  {item.label}
                </span>
                <span className="text-[10px] text-ink-subtle font-mono truncate block max-w-full">
                  {item.value}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

QRCodeBatch.displayName = "QRCodeBatch";
