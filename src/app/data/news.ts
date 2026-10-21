// ─── Types ───────────────────────────────────────────────────────────────────

export type Author = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  accentColor: string;
  description: string;
  order: number;
};

export type BodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "ul"; items: string[] };

export type ArticleSeo = {
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: string;
};

export type Article = {
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
  seo?: ArticleSeo;
};

// ─── Authors ─────────────────────────────────────────────────────────────────

export const authors: Author[] = [
  {
    id: "howard-park",
    name: "Howard Park",
    role: "Co-Founder & Chief Scientist",
    bio: "Howard leads DESILO's cryptography and applied ML research. Previously at KAIST and DeepMind, he has published extensively on homomorphic encryption in financial applications.",
  },
  {
    id: "emma-larsen",
    name: "Emma Larsen",
    role: "Head of Growth, Europe",
    bio: "Emma builds DESILO's European financial institution partnerships. Before joining, she held senior roles at Revolut and the European Banking Authority.",
  },
  {
    id: "kim-andersen",
    name: "Dr. Kim Andersen",
    role: "Principal Engineer, Cryptography",
    bio: "Kim specialises in practical TFHE and CKKS implementations. Her research on lattice-based cryptography has been adopted by leading open-source FHE libraries.",
  },
  {
    id: "desilo-team",
    name: "DESILO Team",
    role: "DESILO Europe",
    bio: "Official company announcements and updates from DESILO Europe.",
  },
  {
    id: "legal-team",
    name: "Regulatory Affairs",
    role: "DESILO Legal & Compliance",
    bio: "DESILO's in-house regulatory team tracks financial crime compliance across EU member states and provides guidance to our financial institution partners.",
  },
  {
    id: "research-team",
    name: "Research Team",
    role: "DESILO Research",
    bio: "DESILO's fraud intelligence research team analyses cross-institutional patterns, threat models, and detection methodologies.",
  },
  {
    id: "engineering-team",
    name: "Engineering Team",
    role: "DESILO Engineering",
    bio: "The team behind HOLMES: privacy-preserving ML pipelines, FHE performance at scale, and the infrastructure that powers collaborative fraud intelligence.",
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "tech",
    name: "Tech & Insights",
    slug: "tech-insights",
    accentColor: "#22C48C",
    description: "Deep dives into homomorphic encryption, privacy-preserving ML, and the cryptography powering HOLMES.",
    order: 1,
  },
  {
    id: "company",
    name: "Company News",
    slug: "company-news",
    accentColor: "#A6D86E",
    description: "Announcements, milestones, and updates from DESILO Europe.",
    order: 2,
  },
  {
    id: "fraud",
    name: "Fraud Trends",
    slug: "fraud-trends",
    accentColor: "#E5B45A",
    description: "Analysis of evolving financial crime patterns and the intelligence needed to counter them.",
    order: 3,
  },
  {
    id: "regulatory",
    name: "Regulatory",
    slug: "regulatory",
    accentColor: "#93A69F",
    description: "European financial regulation, AML directives, and what they mean for collaborative fraud intelligence.",
    order: 4,
  },
];

export const categoryBySlug = (slug: string) =>
  categories.find(c => c.slug === slug) ?? categories[0];

export const authorById = (id: string) =>
  authors.find(a => a.id === id) ?? authors[3];

// ─── Articles ─────────────────────────────────────────────────────────────────
// CMS integration point — populate this array from your CMS at build time or runtime.
// Article shape is defined by the Article type above.

export const articles: Article[] = [];

export const articleBySlug = (slug: string) =>
  articles.find(a => a.slug === slug);

export const featuredArticles = articles
  .filter(a => a.isFeatured)
  .sort((a, b) => (a.featureOrder ?? 99) - (b.featureOrder ?? 99));

export const categoryColorMap: Record<string, string> = {
  "tech-insights": "#22C48C",
  "company-news":  "#A6D86E",
  "fraud-trends":  "#E5B45A",
  "regulatory":    "#93A69F",
};

export const categoryDisplayName: Record<string, string> = {
  "tech-insights": "Tech & Insights",
  "company-news":  "Company News",
  "fraud-trends":  "Fraud Trends",
  "regulatory":    "Regulatory",
};
