import { NextRequest, NextResponse } from "next/server";
import {
  submitAllSiteUrls,
  submitToIndexNow,
  getAllSiteUrls,
  INDEXNOW_HOST,
  INDEXNOW_KEY_LOCATION,
} from "@/lib/indexnow";

function isAuthorized(request: NextRequest): boolean {
  const configuredSecret = process.env.INDEXNOW_SECRET;
  if (!configuredSecret) {
    return true;
  }
  const authHeader = request.headers.get("authorization") || "";
  const headerToken = request.headers.get("x-indexnow-secret") || "";
  const queryToken = new URL(request.url).searchParams.get("secret") || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  return (
    bearerToken === configuredSecret ||
    headerToken === configuredSecret ||
    queryToken === configuredSecret
  );
}

function filterAllowedHostUrls(urls: unknown[]): string[] {
  const valid: string[] = [];
  for (const item of urls) {
    if (typeof item !== "string") continue;
    try {
      const parsed = new URL(item);
      if (parsed.protocol === "https:" && parsed.host === INDEXNOW_HOST) {
        valid.push(parsed.toString());
      }
    } catch {
      // Skip invalid URLs
    }
  }
  return Array.from(new Set(valid));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shouldSubmit = searchParams.get("submit") === "true";
  const allUrls = getAllSiteUrls();

  if (shouldSubmit) {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized IndexNow submission request." },
        { status: 401 }
      );
    }
    const result = await submitAllSiteUrls();
    return NextResponse.json(result, {
      status: result.success ? 200 : result.status || 500,
    });
  }

  return NextResponse.json({
    status: "ready",
    host: INDEXNOW_HOST,
    keyLocation: INDEXNOW_KEY_LOCATION,
    totalUrls: allUrls.length,
    urls: allUrls,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized IndexNow submission request." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const rawCustomUrls = body?.urlList || body?.urls;

    if (rawCustomUrls && Array.isArray(rawCustomUrls) && rawCustomUrls.length > 0) {
      const safeUrls = filterAllowedHostUrls(rawCustomUrls);
      if (!safeUrls.length) {
        return NextResponse.json(
          {
            success: false,
            message: `All submitted URLs must be HTTPS URLs belonging to ${INDEXNOW_HOST}.`,
          },
          { status: 400 }
        );
      }

      const result = await submitToIndexNow(safeUrls);
      return NextResponse.json(result, {
        status: result.success ? 200 : result.status || 500,
      });
    }

    const result = await submitAllSiteUrls();
    return NextResponse.json(result, {
      status: result.success ? 200 : result.status || 500,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
