"use client";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en-US">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#0a1530",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            border: "1px solid #dfe1ea",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>
            QRVenues encountered an error
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#5a5f73",
              lineHeight: 1.5,
              marginBottom: "24px",
            }}
          >
            Please try refreshing the page or return to the homepage.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              backgroundColor: "#5645d4",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
