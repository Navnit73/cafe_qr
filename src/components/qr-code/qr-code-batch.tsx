"use client";

import React from "react";
import { clsx } from "clsx";

import { QRCode } from "./qr-code";
import type { QRCodeBatchProps } from "./qr-code.types";

// ---------------------------------------------------------------------------
// QRCodeBatch — renders a responsive grid of QR codes
// ---------------------------------------------------------------------------
export const QRCodeBatch = React.memo(function QRCodeBatch({
  items,
  commonProps = {},
  className,
}: QRCodeBatchProps) {
  if (!items.length) return null;

  return (
    <div
      className={clsx(
        "grid gap-6",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.value}-${index}`}
          className="flex flex-col items-center gap-2"
        >
          <QRCode {...commonProps} value={item.value} />
          {item.label && (
            <span className="text-sm font-medium text-ink-muted text-center">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

QRCodeBatch.displayName = "QRCodeBatch";
