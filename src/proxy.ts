import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.toLowerCase();
  const hostname = host.split(":")[0];
  const proto = request.headers.get("x-forwarded-proto");
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0";
  const { pathname, search } = request.nextUrl;

  const cleanPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  // 1. Enforce canonical www domain (qrvenues.com -> www.qrvenues.com) in a single hop
  if (hostname === "qrvenues.com") {
    const canonicalUrl = new URL(
      `https://www.qrvenues.com${cleanPath}${search}`
    );
    return NextResponse.redirect(canonicalUrl, { status: 308 });
  }

  // 2. Enforce HTTPS in production (also normalize trailing slash in the same hop)
  if (proto === "http" && !isLocal) {
    const httpsUrl = new URL(`https://${host}${cleanPath}${search}`);
    return NextResponse.redirect(httpsUrl, { status: 308 });
  }

  // 3. Trailing slash normalization (e.g. /en-us/ -> /en-us) - exclude root /
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const protocol = isLocal ? request.nextUrl.protocol : "https:";
    const cleanUrl = new URL(`${protocol}//${host}${cleanPath}${search}`);
    return NextResponse.redirect(cleanUrl, { status: 308 });
  }

  // 4. Delegate to next-intl middleware for locale routing
  return intlMiddleware(request);
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|apple-icon|icon|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
