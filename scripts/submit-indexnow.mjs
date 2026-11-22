#!/usr/bin/env node

/**
 * Standalone IndexNow URL Submission Script
 * Usage: node scripts/submit-indexnow.mjs
 */

import fs from "fs";
import path from "path";

const KEY = "9493ae36fcb848a2a4686641c38600a6";
const HOST = process.env.INDEXNOW_HOST || "www.qrvenues.com";
const BASE_URL = `https://${HOST}`;
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const LOCALES = ["en-us", "en-gb", "en-au"];
const STATIC_PATHS = [
  "",
  "/online-qr-scanner",
  "/guides",
  "/case-studies",
  "/about",
  "/contact",
  "/gdpr",
  "/privacy",
  "/terms",
  "/security",
];

const TOOL_SLUGS = [
  "qr-code-menu-generator",
  "google-review-qr-code-generator",
  "wifi-qr-code-generator",
  "whatsapp-qr-code-generator",
  "bulk-qr-code-generator",
];

const INDUSTRY_SLUGS = [
  "qr-code-for-restaurants",
  "qr-code-for-cafes",
  "qr-code-for-hotels",
  "qr-code-for-bars",
  "qr-code-for-events",
  "qr-code-for-real-estate",
];

function getGuideSlugs() {
  const guidesDir = path.join(process.cwd(), "content/guides");
  if (!fs.existsSync(guidesDir)) return [];
  return fs
    .readdirSync(guidesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function buildUrls() {
  const urls = [];

  for (const pagePath of STATIC_PATHS) {
    for (const loc of LOCALES) {
      urls.push(`${BASE_URL}/${loc}${pagePath}`);
    }
  }

  for (const slug of TOOL_SLUGS) {
    for (const loc of LOCALES) {
      urls.push(`${BASE_URL}/${loc}/${slug}`);
    }
  }

  for (const slug of INDUSTRY_SLUGS) {
    for (const loc of LOCALES) {
      urls.push(`${BASE_URL}/${loc}/${slug}`);
    }
  }

  for (const slug of getGuideSlugs()) {
    for (const loc of LOCALES) {
      urls.push(`${BASE_URL}/${loc}/guides/${slug}`);
    }
  }

  return urls;
}

async function run() {
  const urlList = buildUrls();
  console.log(`\n📡 Submitting ${urlList.length} URLs to IndexNow...`);
  console.log(`🔑 Key: ${KEY}`);
  console.log(`🌐 Key Location: ${KEY_LOCATION}\n`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log(`HTTP Status: ${res.status} ${res.statusText}`);

    if (res.status === 200 || res.status === 202) {
      console.log("✅ Success! URLs submitted to IndexNow (Bing, Yandex, etc.).");
    } else {
      const text = await res.text();
      console.error("❌ IndexNow submission response:", text);
    }
  } catch (err) {
    console.error("❌ Network error:", err.message);
  }
}

run();
