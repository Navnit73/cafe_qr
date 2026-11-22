import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTitle =
    searchParams.get("title") ||
    "QR Code Menus, Google Review Links & Free QR Studio";
  const rawSubtitle =
    searchParams.get("subtitle") ||
    "Create custom QR codes with logos, frames, and lossless SVG exports — 100% free in your browser.";
  const rawBadge = searchParams.get("badge") || "QRVenues Studio";

  const title = rawTitle.slice(0, 90);
  const subtitle = rawSubtitle.slice(0, 160);
  const badge = rawBadge.slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "56px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          border: "12px solid #f4f4f8",
        }}
      >
        {/* Top Brand Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#0a1530",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "26px",
                fontWeight: 800,
                border: "3px solid #dd5b00",
              }}
            >
              QV
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0a1530",
                  letterSpacing: "-0.5px",
                }}
              >
                QRVenues
              </span>
              <span style={{ fontSize: "16px", color: "#5a5f73" }}>
                www.qrvenues.com
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#eeecfb",
              color: "#5645d4",
              padding: "10px 22px",
              borderRadius: "9999px",
              fontSize: "18px",
              fontWeight: 700,
              border: "1px solid #d5d0f7",
            }}
          >
            {badge}
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1020px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 55 ? "48px" : "56px",
              fontWeight: 700,
              color: "#0a1530",
              lineHeight: 1.12,
              letterSpacing: "-1.5px",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#5a5f73",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #dfe1ea",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <span
              style={{
                backgroundColor: "#f4f4f8",
                color: "#0a1530",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "17px",
                fontWeight: 600,
              }}
            >
              100% Free Static QR
            </span>
            <span
              style={{
                backgroundColor: "#f4f4f8",
                color: "#0a1530",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "17px",
                fontWeight: 600,
              }}
            >
              Vector SVG & 300 DPI PNG
            </span>
            <span
              style={{
                backgroundColor: "#f4f4f8",
                color: "#0a1530",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "17px",
                fontWeight: 600,
              }}
            >
              No Watermark
            </span>
          </div>
          <span
            style={{
              color: "#dd5b00",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Instant Studio →
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    }
  );
}
