import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto");
  const { pathname, search } = request.nextUrl;

  // 1. Enforce canonical www domain (qrvenues.com -> www.qrvenues.com)
  if (host === "qrvenues.com") {
    const canonicalUrl = new URL(`https://www.qrvenues.com${pathname}${search}`);
    return NextResponse.redirect(canonicalUrl, { status: 308 });
  }

  // 2. Enforce HTTPS in production
  if (proto === "http" && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const httpsUrl = new URL(`https://${host}${pathname}${search}`);
    return NextResponse.redirect(httpsUrl, { status: 308 });
  }

  // 3. Trailing slash normalization (e.g. /en-us/ -> /en-us) - exclude root /
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const cleanPath = pathname.slice(0, -1);
    const targetHost = host === "qrvenues.com" ? "www.qrvenues.com" : host;
    const cleanUrl = new URL(`https://${targetHost}${cleanPath}${search}`);
    return NextResponse.redirect(cleanUrl, { status: 308 });
  }

  // 4. Delegate to next-intl middleware for locale routing
  return intlMiddleware(request);
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
