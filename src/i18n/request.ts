import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

// Type-safe recursive deep merge for message overrides
function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const output = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const targetVal = output[key];
    const sourceVal = source[key];
    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      output[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      );
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal;
    }
  }
  return output as T;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that incoming locale is supported
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Load shared base English messages
  const baseMessages = (await import("../../messages/en/base.json")).default;

  // Load region-specific overrides
  let regionalOverrides: Record<string, unknown> = {};
  if (locale === "en-US") {
    regionalOverrides = (await import("../../messages/en/us.json")).default;
  } else if (locale === "en-GB") {
    regionalOverrides = (await import("../../messages/en/gb.json")).default;
  } else if (locale === "en-AU") {
    regionalOverrides = (await import("../../messages/en/au.json")).default;
  }

  const messages = deepMerge(baseMessages, regionalOverrides);

  return {
    locale,
    messages,
  };
});
