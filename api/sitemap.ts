import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

/** Must match SEO.tsx SITE_URL (no www). */
const SITE_URL = "https://luxdesilo.ai";
const STRAPI_ENDPOINTS = ["lux-articles", "lux_articles"] as const;
const STRAPI_TIMEOUT_MS = 30_000;
const STRAPI_PAGE_SIZE = 200;

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

const STATIC_ROUTES: SitemapEntry[] = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/product", changefreq: "monthly", priority: "0.9" },
  { loc: "/news", changefreq: "daily", priority: "0.8" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapEntry(entry: unknown): Record<string, unknown> {
  if (!isRecord(entry)) return {};
  if (isRecord(entry.attributes)) {
    return { ...entry.attributes, id: entry.id, documentId: entry.documentId };
  }
  return entry;
}

function pickString(raw: Record<string, unknown>, key: string): string | undefined {
  const value = raw[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function toLastmod(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlEntry(entry: SitemapEntry): string {
  const loc = `${SITE_URL}${entry.loc === "/" ? "/" : entry.loc}`;
  const parts = [`    <loc>${escapeXml(loc)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

function renderSitemap(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(buildUrlEntry).join("\n")}
</urlset>
`;
}

async function fetchArticleEntries(baseUrl: string, apiKey: string): Promise<unknown[]> {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${apiKey}` };
  const params: Record<string, string | number> = {
    status: "published",
    "pagination[page]": 1,
    "pagination[pageSize]": STRAPI_PAGE_SIZE,
    "sort[0]": "publishedAt:desc",
    "fields[0]": "slug",
    "fields[1]": "publishedAt",
    "fields[2]": "updatedAt",
    "fields[3]": "articleStatus",
  };

  let lastError: unknown;

  for (const endpoint of STRAPI_ENDPOINTS) {
    const url = `${normalizedBase}/api/${endpoint}`;
    try {
      const response = await axios.get(url, { headers, params, timeout: STRAPI_TIMEOUT_MS });
      const data = response.data?.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error) && error.response?.status === 404) continue;
      throw error;
    }
  }

  throw lastError ?? new Error("Unable to reach Strapi lux-articles endpoint.");
}

function mapArticleRoutes(entries: unknown[]): SitemapEntry[] {
  const routes: SitemapEntry[] = [];

  for (const entry of entries) {
    const raw = unwrapEntry(entry);
    const slug = pickString(raw, "slug");
    if (!slug) continue;

    // Prefer published articles; skip explicit drafts if present.
    if (raw.articleStatus === "draft") continue;

    routes.push({
      loc: `/news/${encodeURIComponent(slug)}`,
      lastmod: toLastmod(pickString(raw, "updatedAt") ?? pickString(raw, "publishedAt")),
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  return routes;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const staticWithDates = STATIC_ROUTES.map((route) => ({
    ...route,
    lastmod: new Date().toISOString().slice(0, 10),
  }));

  let articleRoutes: SitemapEntry[] = [];
  const strapiUrl = process.env.STRAPI_URL;
  const strapiApiKey = process.env.STRAPI_API_KEY;

  if (strapiUrl && strapiApiKey) {
    try {
      const entries = await fetchArticleEntries(strapiUrl, strapiApiKey);
      articleRoutes = mapArticleRoutes(entries);
    } catch (error) {
      console.error("[sitemap] Failed to fetch Strapi articles", {
        error: axios.isAxiosError(error)
          ? error.response?.data ?? error.message
          : error instanceof Error
            ? error.message
            : String(error),
      });
      // Fall through with static routes only so crawlers still get a valid sitemap.
    }
  } else {
    console.warn("[sitemap] STRAPI_URL / STRAPI_API_KEY missing; emitting static routes only.");
  }

  const xml = renderSitemap([...staticWithDates, ...articleRoutes]);

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).send(xml);
}
