import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "ul"; items: string[] };

export type LuxArticleSeo = {
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: string;
};

export type LuxArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: BodyBlock[];
  coverImage?: string;
  coverImageAlt?: string;
  lux_category: string;
  lux_author: string;
  readingTime: number;
  articleStatus: "published" | "draft";
  isFeatured: boolean;
  featureOrder?: number;
  publishedAt: string;
  updatedAt?: string;
  language: "en" | "de" | "fr" | "ko";
  seo?: LuxArticleSeo;
};

const STRAPI_ENDPOINTS = ["lux-articles", "lux_articles"] as const;
const STRAPI_TIMEOUT_MS = 30_000;
const STRAPI_PAGE_SIZE = 20;

/** Scalar fields on Lux-Article (system fields publishedAt/updatedAt omitted — returned by default). */
const STRAPI_ARTICLE_SCALAR_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "body",
  "coverImageAlt",
  "readingTime",
  "isFeatured",
  "featureOrder",
  "articleStatus",
  "language",
] as const;

function buildStrapiListParams(): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    status: "published",
    "pagination[page]": 1,
    "pagination[pageSize]": STRAPI_PAGE_SIZE,
    "sort[0]": "publishedAt:desc",
    "populate[lux_category]": true,
    "populate[lux_author]": true,
    "populate[coverImage]": true,
  };

  STRAPI_ARTICLE_SCALAR_FIELDS.forEach((field, index) => {
    params[`fields[${index}]`] = field;
  });

  return params;
}

function collectObjectKeys(value: unknown): string[] {
  if (!isRecord(value)) return [];
  return Object.keys(value);
}

function collectRelationKeys(value: unknown): string[] {
  if (value == null) return [];

  if (isRecord(value) && "data" in value) {
    const data = value.data;
    if (data == null) return [];
    if (Array.isArray(data)) {
      const first = data[0];
      return first ? collectObjectKeys(unwrapEntry(first)) : [];
    }
    return collectObjectKeys(unwrapEntry(data));
  }

  const unwrapped = unwrapRelation(value);
  return unwrapped ? Object.keys(unwrapped) : collectObjectKeys(value);
}

function logResponseStructure(entries: unknown[]) {
  const sample = entries[0];
  if (!sample) {
    console.log("[lux-articles] Response structure", { sampleCount: 0 });
    return;
  }

  const raw = unwrapEntry(sample);

  console.log("[lux-articles] Response structure", {
    sampleCount: entries.length,
    articleTopLevelKeys: Object.keys(raw),
    lux_category: {
      present: raw.lux_category != null,
      keys: collectRelationKeys(raw.lux_category),
    },
    lux_author: {
      present: raw.lux_author != null,
      keys: collectRelationKeys(raw.lux_author),
    },
    coverImage: {
      present: raw.coverImage != null,
      keys: collectRelationKeys(raw.coverImage),
    },
    seo: {
      present: raw.seo != null,
      keys: collectObjectKeys(raw.seo),
    },
  });
}

function logStrapiErrorResponse(error: unknown) {
  if (!axios.isAxiosError(error)) return;

  console.error("[lux-articles] Strapi error response", {
    status: error.response?.status,
    data: error.response?.data,
  });
}

function extractStrapiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: { message?: string }; message?: string }
      | undefined;

    return data?.error?.message ?? data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Failed to fetch articles from Strapi.";
}

function logStrapiRequest(event: {
  phase: "success" | "error" | "retry";
  url: string;
  durationMs: number;
  endpoint: string;
  status?: number;
  error?: string;
}) {
  const { phase, url, durationMs, endpoint, status, error } = event;
  const payload = {
    service: "lux-articles",
    phase,
    endpoint,
    url,
    durationMs,
    ...(status !== undefined ? { status } : {}),
    ...(error ? { error } : {}),
  };

  if (phase === "error") {
    console.error("[lux-articles] Strapi request failed", payload);
    return;
  }

  console.log("[lux-articles] Strapi request", payload);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Normalizes Strapi v4 (attributes) and v5 (flat) entry shapes. */
function unwrapEntry(entry: unknown): Record<string, unknown> {
  if (!isRecord(entry)) return {};

  if (isRecord(entry.attributes)) {
    return {
      id: entry.id ?? entry.documentId,
      documentId: entry.documentId,
      ...entry.attributes,
    };
  }

  return entry;
}

function unwrapRelation(value: unknown): Record<string, unknown> | null {
  if (!value) return null;

  if (isRecord(value) && "data" in value) {
    const data = value.data;
    if (Array.isArray(data)) {
      const first = data[0];
      return first ? unwrapEntry(first) : null;
    }
    return unwrapEntry(data);
  }

  return unwrapEntry(value);
}

function pickString(source: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function pickBoolean(source: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") return value;
  }
  return false;
}

function pickNumber(source: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function getMediaUrl(media: unknown, baseUrl: string): string | undefined {
  const unwrapped = unwrapRelation(media);
  if (!unwrapped) return undefined;

  const rawUrl = pickString(unwrapped, "url");
  if (!rawUrl) return undefined;

  const normalizedBase = baseUrl.replace(/\/$/, "");
  return rawUrl.startsWith("http") ? rawUrl : `${normalizedBase}${rawUrl}`;
}

function formatPublishedDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function blocksFromRichText(value: unknown): BodyBlock[] {
  if (typeof value === "string" && value.trim()) {
    return [{ type: "p", text: value.trim() }];
  }

  if (!Array.isArray(value)) return [];

  const blocks: BodyBlock[] = [];

  for (const block of value) {
    if (!isRecord(block)) continue;

    const type = pickString(block, "type", "__component");
    const children = block.children;

    if (type === "heading" || type === "h2") {
      const text =
        typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children
                .map(child => (isRecord(child) ? pickString(child, "text") : undefined))
                .filter(Boolean)
                .join(" ")
            : pickString(block, "text", "title");
      if (text) blocks.push({ type: "h2", text });
      continue;
    }

    if (type === "quote") {
      const text = pickString(block, "text") ?? pickString(block, "body");
      if (text) {
        blocks.push({
          type: "quote",
          text,
          attribution: pickString(block, "attribution", "author"),
        });
      }
      continue;
    }

    if (type === "list" || type === "ul") {
      const items = Array.isArray(block.items)
        ? block.items.map(item => String(item)).filter(Boolean)
        : [];
      if (items.length > 0) blocks.push({ type: "ul", items });
      continue;
    }

    const paragraphText =
      pickString(block, "text", "body") ??
      (Array.isArray(children)
        ? children
            .map(child => (isRecord(child) ? pickString(child, "text") : undefined))
            .filter(Boolean)
            .join(" ")
        : undefined);

    if (paragraphText) blocks.push({ type: "p", text: paragraphText });
  }

  return blocks;
}

function mapCategorySlug(category: Record<string, unknown> | null): string {
  if (!category) return "tech-insights";

  const slug = pickString(category, "slug");
  if (slug) return slug;

  const name = pickString(category, "name");
  if (!name) return "tech-insights";

  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapAuthorId(author: Record<string, unknown> | null): string {
  if (!author) return "desilo-team";

  const name = pickString(author, "name");
  if (!name) return "desilo-team";

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapArticleStatus(value: unknown): LuxArticle["articleStatus"] {
  if (value === "draft") return "draft";
  return "published";
}

function mapLanguage(value: unknown): LuxArticle["language"] {
  if (value === "en" || value === "de" || value === "fr" || value === "ko") {
    return value;
  }
  return "en";
}

function mapArticle(entry: unknown, baseUrl: string): LuxArticle | null {
  const raw = unwrapEntry(entry);
  const title = pickString(raw, "title");
  const slug = pickString(raw, "slug");

  if (!title || !slug) return null;

  const luxCategory = unwrapRelation(raw.lux_category ?? null);
  const luxAuthor = unwrapRelation(raw.lux_author ?? null);
  const excerpt = pickString(raw, "excerpt") ?? "";
  const body = blocksFromRichText(raw.body);
  const readingTime =
    pickNumber(raw, "readingTime") ??
    estimateReadingTime(`${title} ${excerpt} ${body.map(block => ("text" in block ? block.text : "")).join(" ")}`);

  const id = String(raw.documentId ?? raw.id ?? slug);

  return {
    id,
    title,
    slug,
    excerpt,
    body,
    coverImage: getMediaUrl(raw.coverImage ?? null, baseUrl),
    coverImageAlt: pickString(raw, "coverImageAlt"),
    lux_category: mapCategorySlug(luxCategory),
    lux_author: mapAuthorId(luxAuthor),
    readingTime,
    articleStatus: mapArticleStatus(raw.articleStatus),
    isFeatured: pickBoolean(raw, "isFeatured"),
    featureOrder: pickNumber(raw, "featureOrder"),
    publishedAt: formatPublishedDate(raw.publishedAt),
    updatedAt: pickString(raw, "updatedAt"),
    language: mapLanguage(raw.language),
  };
}

async function fetchFromStrapi(baseUrl: string, apiKey: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${apiKey}` };
  const params = buildStrapiListParams();

  let lastError: unknown;
  let lastDurationMs = 0;
  let lastRequestUrl = "";

  for (const endpoint of STRAPI_ENDPOINTS) {
    const url = `${normalizedBase}/api/${endpoint}`;
    const requestUrl = axios.getUri({ url, params });
    const startedAt = Date.now();

    try {
      const response = await axios.get(url, { headers, params, timeout: STRAPI_TIMEOUT_MS });
      const durationMs = Date.now() - startedAt;

      logStrapiRequest({
        phase: "success",
        url: requestUrl,
        durationMs,
        endpoint,
        status: response.status,
      });

      return { response, endpoint, durationMs, requestUrl };
    } catch (error) {
      lastError = error;
      lastDurationMs = Date.now() - startedAt;
      lastRequestUrl = requestUrl;
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const errorMessage = extractStrapiErrorMessage(error);

      logStrapiErrorResponse(error);

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logStrapiRequest({
          phase: "retry",
          url: requestUrl,
          durationMs: lastDurationMs,
          endpoint,
          status,
          error: errorMessage,
        });
        continue;
      }

      logStrapiRequest({
        phase: "error",
        url: requestUrl,
        durationMs: lastDurationMs,
        endpoint,
        status,
        error: errorMessage,
      });

      throw error;
    }
  }

  logStrapiRequest({
    phase: "error",
    url: lastRequestUrl,
    durationMs: lastDurationMs,
    endpoint: STRAPI_ENDPOINTS[STRAPI_ENDPOINTS.length - 1],
    error: extractStrapiErrorMessage(lastError),
  });

  throw lastError ?? new Error("Unable to reach Strapi lux-articles endpoint.");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const strapiUrl = process.env.STRAPI_URL;
  const strapiApiKey = process.env.STRAPI_API_KEY;

  if (!strapiUrl || !strapiApiKey) {
    return res.status(500).json({ error: "Strapi environment variables are not configured." });
  }

  const handlerStartedAt = Date.now();

  try {
    const { response, durationMs, requestUrl, endpoint } = await fetchFromStrapi(strapiUrl, strapiApiKey);
    const payload = response.data;
    const entries = Array.isArray(payload?.data) ? payload.data : [];

    logResponseStructure(entries);

    const articles = entries
      .map((entry: unknown) => mapArticle(entry, strapiUrl))
      .filter((article: LuxArticle | null): article is LuxArticle => article !== null)
      .sort((a: LuxArticle, b: LuxArticle) => {
        const aTime = Date.parse(a.updatedAt ?? a.publishedAt);
        const bTime = Date.parse(b.updatedAt ?? b.publishedAt);
        return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
      });

    console.log("[lux-articles] Handler completed", {
      endpoint,
      url: requestUrl,
      strapiDurationMs: durationMs,
      totalDurationMs: Date.now() - handlerStartedAt,
      status: response.status,
      articleCount: articles.length,
    });

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ articles });
  } catch (error) {
    logStrapiErrorResponse(error);
    const message = extractStrapiErrorMessage(error);
    const status = axios.isAxiosError(error) ? error.response?.status ?? 502 : 502;

    console.error("[lux-articles] Handler failed", {
      totalDurationMs: Date.now() - handlerStartedAt,
      status,
      error: message,
    });

    return res.status(status >= 400 && status < 600 ? status : 502).json({ error: message });
  }
}
