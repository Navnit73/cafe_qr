import {
  BarcodeFormatName,
  ParsedPayload,
  ScannedResult,
} from "./scanner.types";

/**
 * Safely decodes URI components without throwing URIError on literal '%' characters.
 */
function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Unescapes backslash-escaped characters in Wi-Fi QR fields (\;, \:, \\, \", \,).
 */
function unescapeWifiField(value: string): string {
  return value.replace(/\\([\\;,:"])/g, "$1");
}

/**
 * Format names mapping from numeric codes or standard strings
 */
export function formatBarcodeType(
  format: string | number | undefined
): BarcodeFormatName {
  if (typeof format === "number") {
    const formatMap: Record<number, BarcodeFormatName> = {
      0: "QR_CODE",
      1: "AZTEC",
      2: "CODABAR",
      3: "CODE_39",
      4: "CODE_93",
      5: "CODE_128",
      6: "DATA_MATRIX",
      7: "MAXICODE",
      8: "ITF",
      9: "EAN_13",
      10: "EAN_8",
      11: "PDF_417",
      12: "RSS_14",
      13: "RSS_EXPANDED",
      14: "UPC_A",
      15: "UPC_E",
      16: "UPC_EAN_EXTENSION",
    };
    return formatMap[format] || "UNKNOWN";
  }

  if (typeof format === "string") {
    const upper = format.toUpperCase().replace(/-/g, "_").replace(/\s+/g, "_");
    if (upper.includes("QR")) return "QR_CODE";
    if (upper.includes("EAN_13") || upper === "EAN13") return "EAN_13";
    if (upper.includes("EAN_8") || upper === "EAN8") return "EAN_8";
    if (upper.includes("UPC_A") || upper === "UPCA") return "UPC_A";
    if (upper.includes("UPC_E") || upper === "UPCE") return "UPC_E";
    if (upper.includes("CODE_128") || upper === "CODE128") return "CODE_128";
    if (upper.includes("CODE_39") || upper === "CODE39") return "CODE_39";
    if (upper.includes("CODE_93") || upper === "CODE93") return "CODE_93";
    if (upper.includes("DATA_MATRIX") || upper === "DATAMATRIX")
      return "DATA_MATRIX";
    if (upper.includes("AZTEC")) return "AZTEC";
    if (upper.includes("PDF_417") || upper === "PDF417") return "PDF_417";
    if (upper.includes("ITF")) return "ITF";
    if (upper.includes("CODABAR")) return "CODABAR";
    return "UNKNOWN";
  }

  return "UNKNOWN";
}

/**
 * Human readable display label for a barcode format
 */
export function getFormatLabel(format: BarcodeFormatName): string {
  switch (format) {
    case "QR_CODE":
      return "QR Code";
    case "EAN_13":
      return "EAN-13 (Product)";
    case "EAN_8":
      return "EAN-8 (Product)";
    case "UPC_A":
      return "UPC-A (Retail)";
    case "UPC_E":
      return "UPC-E (Retail)";
    case "CODE_128":
      return "Code 128 (Logistics)";
    case "CODE_39":
      return "Code 39 (Industrial)";
    case "CODE_93":
      return "Code 93";
    case "DATA_MATRIX":
      return "Data Matrix (2D)";
    case "AZTEC":
      return "Aztec Code (2D)";
    case "PDF_417":
      return "PDF417 (ID / Transit)";
    case "ITF":
      return "ITF (Interleaved 2 of 5)";
    case "CODABAR":
      return "Codabar";
    default:
      return "Barcode / QR";
  }
}

/**
 * Parses raw barcode text into rich structured information
 */
export function parseBarcodePayload(
  rawText: string,
  format: BarcodeFormatName
): ParsedPayload {
  const trimmed = rawText.trim();

  // 1. WiFi Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
  if (/^WIFI:/i.test(trimmed)) {
    const ssidMatch = trimmed.match(/(?:^|;)S:((?:\\.|[^;])*)/i);
    const passMatch = trimmed.match(/(?:^|;)P:((?:\\.|[^;])*)/i);
    const typeMatch = trimmed.match(/(?:^|;)T:([^;]*)/i);
    const hiddenMatch = trimmed.match(/(?:^|;)H:([^;]*)/i);

    return {
      type: "wifi",
      ssid: ssidMatch
        ? unescapeWifiField(safeDecodeURIComponent(ssidMatch[1]))
        : "Unknown SSID",
      password:
        passMatch && passMatch[1]
          ? unescapeWifiField(passMatch[1])
          : undefined,
      security: typeMatch && typeMatch[1] ? typeMatch[1] : "WPA",
      hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === "true" : false,
    };
  }

  // 2. vCard Format: BEGIN:VCARD ... END:VCARD
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    const fnMatch = trimmed.match(/^FN:(.*?)(\r?\n|$)/im);
    const nMatch = trimmed.match(/^N:(.*?)(\r?\n|$)/im);
    const telMatch = trimmed.match(/^TEL[^:]*:(.*?)(\r?\n|$)/im);
    const emailMatch = trimmed.match(/^EMAIL[^:]*:(.*?)(\r?\n|$)/im);
    const orgMatch = trimmed.match(/^ORG:(.*?)(\r?\n|$)/im);
    const titleMatch = trimmed.match(/^TITLE:(.*?)(\r?\n|$)/im);
    const urlMatch = trimmed.match(/^URL:(.*?)(\r?\n|$)/im);
    const adrMatch = trimmed.match(/^ADR[^:]*:(.*?)(\r?\n|$)/im);
    const noteMatch = trimmed.match(/^NOTE:(.*?)(\r?\n|$)/im);

    let parsedName = fnMatch ? fnMatch[1].trim() : undefined;
    if (!parsedName && nMatch) {
      const parts = nMatch[1].split(";").filter(Boolean);
      parsedName = parts.reverse().join(" ").trim();
    }

    return {
      type: "vcard",
      formattedName: parsedName || "Contact Card",
      name: parsedName,
      phone: telMatch ? telMatch[1].trim() : undefined,
      email: emailMatch ? emailMatch[1].trim() : undefined,
      org: orgMatch ? orgMatch[1].trim() : undefined,
      title: titleMatch ? titleMatch[1].trim() : undefined,
      url: urlMatch ? urlMatch[1].trim() : undefined,
      address: adrMatch ? adrMatch[1].replace(/;/g, ", ").trim() : undefined,
      note: noteMatch ? noteMatch[1].trim() : undefined,
      rawVCard: trimmed,
    };
  }

  // 3. Email mailto: or plain email address
  if (/^mailto:/i.test(trimmed)) {
    try {
      const parsedUrl = new URL(trimmed);
      const email = parsedUrl.pathname;
      const subject = parsedUrl.searchParams.get("subject") || undefined;
      const body = parsedUrl.searchParams.get("body") || undefined;
      return { type: "email", email, subject, body };
    } catch {
      const email = trimmed.replace(/^mailto:/i, "").split("?")[0];
      return { type: "email", email };
    }
  }

  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { type: "email", email: trimmed };
  }

  // 4. Phone Number tel:
  if (/^tel:/i.test(trimmed)) {
    return {
      type: "phone",
      phoneNumber: trimmed.replace(/^tel:/i, "").trim(),
    };
  }

  // 5. SMS smsto: or sms:
  if (/^(smsto|sms):/i.test(trimmed)) {
    const cleaned = trimmed.replace(/^(smsto|sms):/i, "");
    const parts = cleaned.split(/[:?]/);
    const phoneNumber = parts[0] || "";
    let message: string | undefined;

    if (trimmed.includes("body=")) {
      const bodyMatch = trimmed.match(/body=([^&]*)/i);
      if (bodyMatch) message = safeDecodeURIComponent(bodyMatch[1]);
    } else if (parts.length > 1) {
      message = parts.slice(1).join(":");
    }

    return {
      type: "sms",
      phoneNumber,
      message,
    };
  }

  // 6. Geo Location geo:lat,lng
  if (/^geo:/i.test(trimmed)) {
    const geoContent = trimmed.replace(/^geo:/i, "");
    const [coords, queryPart] = geoContent.split("?");
    const [latStr, lngStr] = coords.split(",");
    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lngStr);
    let query: string | undefined;

    if (queryPart && queryPart.includes("q=")) {
      const qMatch = queryPart.match(/q=([^&]*)/);
      if (qMatch) query = safeDecodeURIComponent(qMatch[1]);
    }

    if (!isNaN(latitude) && !isNaN(longitude)) {
      return {
        type: "geo",
        latitude,
        longitude,
        query,
      };
    }
  }

  // 7. Standard HTTP / HTTPS URL or www. URL
  if (/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
    const fullUrl = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
    try {
      const u = new URL(fullUrl);
      if (u.protocol === "http:" || u.protocol === "https:") {
        return {
          type: "url",
          url: u.href,
          hostname: u.hostname,
          isSecure: u.protocol === "https:",
        };
      }
    } catch {
      // Fallback
    }
  }

  // 8. 1D Product Barcodes (EAN-13, EAN-8, UPC-A, UPC-E)
  if (
    ["EAN_13", "EAN_8", "UPC_A", "UPC_E"].includes(format) ||
    (/^\d{8}$|^\d{12,14}$/.test(trimmed) && !trimmed.includes("\n"))
  ) {
    return {
      type: "product",
      code: trimmed,
      format: getFormatLabel(format),
    };
  }

  // 9. JSON detection
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        type: "json",
        jsonString: JSON.stringify(parsed, null, 2),
        data: parsed,
      };
    } catch {
      // Not valid JSON, continue to text
    }
  }

  // 10. Default Plain Text
  return {
    type: "text",
    text: trimmed,
  };
}

/**
 * Play a subtle confirmation beep using Web Audio API and properly close AudioContext
 */
export function playScanBeep(): void {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.onended = () => {
      ctx.close().catch(() => {});
    };

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    // Audio playback not allowed or disabled
  }
}

/**
 * Trigger subtle haptic vibration on mobile devices
 */
export function triggerHaptic(durationMs: number = 40): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Vibration not supported or allowed
  }
}

/**
 * Sanitize a string for safe CSV output (prevents spreadsheet formula injection).
 */
function sanitizeCsvCell(value: string): string {
  const neutralized = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

/**
 * Export scan history to CSV file download
 */
export function exportHistoryToCSV(history: ScannedResult[]): void {
  if (!history || history.length === 0) return;

  const headers = ["Timestamp", "Date", "Format", "Payload Type", "Content"];
  const rows = history.map((item) => {
    const dateStr = new Date(item.timestamp).toISOString();
    return [
      item.timestamp,
      `"${dateStr}"`,
      `"${item.format}"`,
      `"${item.parsed.type}"`,
      sanitizeCsvCell(item.rawText),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `qrvenues-scans-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Export scan history to JSON file download
 */
export function exportHistoryToJSON(history: ScannedResult[]): void {
  if (!history || history.length === 0) return;

  const jsonString = JSON.stringify(history, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `qrvenues-scans-${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}
