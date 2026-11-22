import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1530",
          borderRadius: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 136,
            height: 136,
            borderRadius: 24,
            border: "6px solid #dd5b00",
            background: "#0a1530",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -3,
              display: "flex",
            }}
          >
            QV
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
