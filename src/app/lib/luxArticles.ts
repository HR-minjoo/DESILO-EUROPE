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
    const response = await fetch("/api/lux-articles");

    let payload: LuxArticlesResponse = {};
    try {
      payload = (await response.json()) as LuxArticlesResponse;
    } catch {
      payload = {};
    }

    if (!response.ok) {
      return {
        status: "error",
        message: payload.error ?? "Unable to load articles right now.",
      };
    }

    const articles = Array.isArray(payload.articles) ? payload.articles : [];

    if (articles.length === 0) {
      return { status: "empty", articles: [] };
    }

    return { status: "success", articles };
  } catch {
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
