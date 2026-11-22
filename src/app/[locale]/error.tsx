"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function LocaleError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex items-center justify-center px-4 py-16">
      <div className="card bg-surface-1 border border-hairline rounded-2xl max-w-md w-full p-8 text-center space-y-5 shadow-none">
        <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-ink">
            Something went wrong
          </h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            An unexpected error occurred while rendering this page. You can try
            reloading or return to the QRVenues homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => retry()}
            className="btn btn-primary btn-sm h-10 min-h-10 px-5 rounded-lg text-xs font-medium gap-1.5 shadow-none w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn bg-surface-1 border border-hairline hover:bg-surface-2 text-ink btn-sm h-10 min-h-10 px-5 rounded-lg text-xs font-medium gap-1.5 shadow-none w-full sm:w-auto"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
