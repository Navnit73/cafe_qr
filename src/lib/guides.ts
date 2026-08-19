import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface GuideFrontmatter {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  qrValue?: string;
  qrFrame?: "none" | "menu" | "review" | "order";
  faqs?: { q: string; a: string }[];
  schema?: "Article" | "HowTo";
}

export interface Guide {
  frontmatter: GuideFrontmatter;
  content: string;
  readingTime: number;
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const GUIDES_DIR = path.join(process.cwd(), "content/guides");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Estimate reading time in minutes (~200 wpm).
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Return all guide slugs (for generateStaticParams).
 */
export function getGuideBySlug(slug: string): Guide | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.trim()) return null;
  const { data, content } = matter(raw);
  if (!data || !data.title || !data.slug) return null;

  return {
    frontmatter: {
      tags: [],
      ...data,
    } as unknown as GuideFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Return all valid guide slugs (for generateStaticParams).
 */
export function getGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => getGuideBySlug(slug) !== null);
}

/**
 * Return all guides sorted by publishedAt (newest first).
 */
export function getAllGuides(): Guide[] {
  const slugs = getGuideSlugs();
  const guides = slugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== null);

  guides.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );

  return guides;
}
