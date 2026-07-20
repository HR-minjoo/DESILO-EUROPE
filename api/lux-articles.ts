import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "ul"; items: string[] };

export type LuxArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: BodyBlock[];
  coverImage?: string;
  coverImageAlt?: string;
  category: string;
  author: string;
  readingTime: number;
  status: "published" | "draft";
  isFeatured: boolean;
  featuredOrder?: number;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  language: "en" | "de" | "fr" | "ko";
};

const STRAPI_ENDPOINTS = ["lux-articles", "lux_articles"] as const;
const STRAPI_TIMEOUT_MS = 30_000;
const STRAPI_PAGE_SIZE = 20;

/** Scalar fields needed for the News list (body/rich text intentionally excluded). */
const STRAPI_LIST_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "summary",
  "description",
  "intro",
  "readingTime",
  "isFeatured",
  "featuredOrder",
  "publishedAt",
  "updatedAt",
  "seoDescription",
  "metaDescription",
] as const;

/** Relations populated with minimal nested fields (Strapi v5 bracket syntax). */
const STRAPI_POPULATE_RELATIONS = [
  { relation: "category", fields: ["slug", "name"] },
  { relation: "author", fields: ["slug", "name", "username"] },
  { relation: "coverImage", fields: ["url", "alternativeText"] },
] as const;

function buildStrapiListParams(): Record<string, string | number> {
  const params: Record<string, string | number> = {
    status: "published",
    "pagination[page]": 1,
    "pagination[pageSize]": STRAPI_PAGE_SIZE,
    "sort[0]": "publishedAt:desc",
  };

  STRAPI_LIST_FIELDS.forEach((field, index) => {
    params[`fields[${index}]`] = field;
  });

  for (const { relation, fields } of STRAPI_POPULATE_RELATIONS) {
    fields.forEach((field, index) => {
      params[`populate[${relation}][fields][${index}]`] = field;
    });
  }

  return params;
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

function getMediaUrl(media: unknown, baseUrl: string): { url?: string; alt?: string } {
  const unwrapped = unwrapRelation(media);
  if (!unwrapped) return {};

  const rawUrl = pickString(unwrapped, "url");
  if (!rawUrl) return {};

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const url = rawUrl.startsWith("http") ? rawUrl : `${normalizedBase}${rawUrl}`;
  const alt = pickString(unwrapped, "alternativeText", "alt", "name");

  return { url, alt };
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

  const name = pickString(category, "name", "title");
  if (!name) return "tech-insights";

  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapAuthorId(author: Record<string, unknown> | null): string {
  if (!author) return "desilo-team";

  const slug = pickString(author, "slug", "username");
  if (slug) return slug;

  const name = pickString(author, "name", "title");
  if (!name) return "desilo-team";

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(item => {
      if (typeof item === "string") return item;
      if (isRecord(item)) return pickString(item, "name", "title", "label");
      return undefined;
    })
    .filter((tag): tag is string => Boolean(tag));
}

function mapLanguage(value: unknown): LuxArticle["language"] {
  if (value === "en" || value === "de" || value === "fr" || value === "ko") {
    return value;
  }
  return "en";
}

function mapArticle(entry: unknown, baseUrl: string): LuxArticle | null {
  const raw = unwrapEntry(entry);
  const title = pickString(raw, "title", "name");
  const slug = pickString(raw, "slug");

  if (!title || !slug) return null;

  const category = unwrapRelation(raw.category ?? raw.categories);
  const author = unwrapRelation(raw.author ?? raw.authors);
  const coverMedia = getMediaUrl(raw.coverImage ?? raw.cover ?? raw.image ?? raw.thumbnail, baseUrl);

  const excerpt =
    pickString(raw, "excerpt", "summary", "description", "intro") ??
    pickString(raw, "seoDescription", "metaDescription") ??
    "";

  const bodySource = raw.body ?? raw.content ?? raw.blocks ?? raw.richText;
  const body = blocksFromRichText(bodySource);
  const readingTime =
    pickNumber(raw, "readingTime", "reading_time", "readTime") ??
    estimateReadingTime(`${title} ${excerpt} ${body.map(block => ("text" in block ? block.text : "")).join(" ")}`);

  const id = String(raw.documentId ?? raw.id ?? slug);
  const publishedAtRaw = raw.publishedAt ?? raw.publishDate ?? raw.createdAt;

  return {
    id,
    title,
    slug,
    excerpt,
    body,
    coverImage: coverMedia.url,
    coverImageAlt: coverMedia.alt,
    category: mapCategorySlug(category),
    author: mapAuthorId(author),
    readingTime,
    status: "published",
    isFeatured: pickBoolean(raw, "isFeatured", "is_featured", "featured"),
    featuredOrder: pickNumber(raw, "featuredOrder", "featured_order"),
    publishedAt: formatPublishedDate(publishedAtRaw),
    updatedAt: pickString(raw, "updatedAt", "updated_at"),
    tags: mapTags(raw.tags),
    seoTitle: pickString(raw, "seoTitle", "seo_title", "metaTitle"),
    seoDescription: pickString(raw, "seoDescription", "seo_description", "metaDescription"),
    language: mapLanguage(raw.language ?? raw.locale),
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
