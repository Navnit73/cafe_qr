import { NextRequest, NextResponse } from "next/server";
import {
  submitAllSiteUrls,
  submitToIndexNow,
  getAllSiteUrls,
  INDEXNOW_KEY,
  INDEXNOW_HOST,
  INDEXNOW_KEY_LOCATION,
} from "@/lib/indexnow";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shouldSubmit = searchParams.get("submit") === "true";
  const allUrls = getAllSiteUrls();

  if (shouldSubmit) {
    const result = await submitAllSiteUrls();
    return NextResponse.json(result, {
      status: result.success ? 200 : result.status || 500,
    });
  }

  return NextResponse.json({
    status: "ready",
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    totalUrls: allUrls.length,
    urls: allUrls,
    usage: {
      submitAll: "GET /api/indexnow?submit=true",
      submitCustom: "POST /api/indexnow with { urlList: [...] }",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const customUrls = body?.urlList || body?.urls;

    if (customUrls && Array.isArray(customUrls) && customUrls.length > 0) {
      const result = await submitToIndexNow(customUrls, {
        host: body.host,
        key: body.key,
        keyLocation: body.keyLocation,
      });
      return NextResponse.json(result, {
        status: result.success ? 200 : result.status || 500,
      });
    }

    // Default to submitting all site URLs
    const result = await submitAllSiteUrls({
      host: body?.host,
      key: body?.key,
      keyLocation: body?.keyLocation,
    });

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
