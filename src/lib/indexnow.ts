import { activeLocales } from "@/i18n/routing";
import { getGuideSlugs } from "@/lib/guides";

export const INDEXNOW_KEY = "9493ae36fcb848a2a4686641c38600a6";
export const INDEXNOW_HOST = process.env.INDEXNOW_HOST || "www.qrvenues.com";
export const INDEXNOW_BASE_URL = `https://${INDEXNOW_HOST}`;
export const INDEXNOW_KEY_LOCATION = `${INDEXNOW_BASE_URL}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/case-studies",
  "/guides",
  "/gdpr",
  "/privacy",
  "/terms",
  "/security",
];

/**
 * Returns an array of all active canonical URLs across all locales and guides.
 */
export function getAllSiteUrls(baseUrl: string = INDEXNOW_BASE_URL): string[] {
  const urls: string[] = [];

  // Static localized routes
  for (const pagePath of STATIC_PATHS) {
    for (const locale of activeLocales) {
      urls.push(`${baseUrl}/${locale}${pagePath}`);
    }
  }

  // Dynamic guide routes
  const guideSlugs = getGuideSlugs();
  for (const slug of guideSlugs) {
    for (const locale of activeLocales) {
      urls.push(`${baseUrl}/${locale}/guides/${slug}`);
    }
  }

  return urls;
}

export interface IndexNowSubmitOptions {
  host?: string;
  key?: string;
  keyLocation?: string;
  endpoint?: string;
}

export interface IndexNowResponse {
  success: boolean;
  status: number;
  message: string;
  urlCount: number;
  urls: string[];
}

/**
 * Submit a single URL or a batch of URLs to the IndexNow API.
 */
export async function submitToIndexNow(
  urls: string | string[],
  options?: IndexNowSubmitOptions
): Promise<IndexNowResponse> {
  const urlList = Array.isArray(urls) ? urls : [urls];
  if (!urlList.length) {
    return {
      success: false,
      status: 400,
      message: "No URLs provided for submission",
      urlCount: 0,
      urls: [],
    };
  }

  const host = options?.host || INDEXNOW_HOST;
  const key = options?.key || INDEXNOW_KEY;
  const keyLocation = options?.keyLocation || `${INDEXNOW_BASE_URL}/${key}.txt`;
  const endpoint = options?.endpoint || INDEXNOW_ENDPOINT;

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const isOk = res.status === 200 || res.status === 202;
    let responseText = "";
    try {
      responseText = await res.text();
    } catch {
      // Ignore text read error
    }

    const messageMap: Record<number, string> = {
      200: "URL(s) submitted successfully to IndexNow.",
      202: "URL(s) accepted by IndexNow for processing.",
      400: "Bad request - Invalid format or payload.",
      403: "Forbidden - Key not valid or key file could not be verified.",
      422: "Unprocessable Entity - URLs do not match host or key schema.",
      429: "Too Many Requests - Rate limit reached.",
    };

    return {
      success: isOk,
      status: res.status,
      message:
        messageMap[res.status] ||
        `IndexNow returned status ${res.status}: ${responseText || res.statusText}`,
      urlCount: urlList.length,
      urls: urlList,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      status: 500,
      message: `Network error connecting to IndexNow: ${errorMsg}`,
      urlCount: urlList.length,
      urls: urlList,
    };
  }
}

/**
 * Submit all site URLs directly to IndexNow.
 */
export async function submitAllSiteUrls(
  options?: IndexNowSubmitOptions
): Promise<IndexNowResponse> {
  const allUrls = getAllSiteUrls(options?.host ? `https://${options.host}` : INDEXNOW_BASE_URL);
  return submitToIndexNow(allUrls, options);
}
