import type { Article } from "@/app/data/news";

type LuxArticlesResponse = {
  articles?: Article[];
  error?: string;
};

export type FetchLuxArticlesResult =
  | { status: "success"; articles: Article[] }
  | { status: "empty"; articles: [] }
  | { status: "error"; message: string };

export async function fetchLuxArticles(): Promise<FetchLuxArticlesResult> {
  try {
    console.log('[fetchLuxArticles] Fetching from /api/lux-articles...');
    const response = await fetch("/api/lux-articles");
    console.log('[fetchLuxArticles] Response status:', response.status, response.statusText);

    let payload: LuxArticlesResponse = {};
    try {
      payload = (await response.json()) as LuxArticlesResponse;
      console.log('[fetchLuxArticles] Payload:', payload);
    } catch (parseError) {
      console.error('[fetchLuxArticles] Failed to parse JSON:', parseError);
      payload = {};
    }

    if (!response.ok) {
      console.error('[fetchLuxArticles] Response not ok:', payload.error);
      return {
        status: "error",
        message: payload.error ?? "Unable to load articles right now.",
      };
    }

    const articles = Array.isArray(payload.articles) ? payload.articles : [];
    console.log('[fetchLuxArticles] Found', articles.length, 'articles');

    if (articles.length === 0) {
      return { status: "empty", articles: [] };
    }

    return { status: "success", articles };
  } catch (error) {
    console.error('[fetchLuxArticles] Fetch error:', error);
    return {
      status: "error",
      message: "Unable to load articles right now.",
    };
  }
}

export function getFeaturedArticles(articles: Article[]): Article[] {
  return articles
    .filter(article => article.isFeatured)
    .sort((a, b) => (a.featureOrder ?? 99) - (b.featureOrder ?? 99));
}
