import React, { useState, useEffect, useRef } from "react";
import { SEO } from "@/app/components/SEO";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu, Search, ArrowRight, Clock, Pin, Linkedin } from "lucide-react";
import { useNavigate } from "react-router";
import frame3Logo from "@/imports/Frame_7.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  categoryColorMap,
  categoryDisplayName,
  type Article,
} from "@/app/data/news";
import { fetchLuxArticles, getFeaturedArticles } from "@/app/lib/luxArticles";
import { useLang } from "@/app/context/LanguageContext";
import { T } from "@/app/data/translations";
import { Navigation } from "@/app/components/Navigation";

type ArticlesLoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "empty" }
  | { kind: "ready"; articles: Article[] };

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  navy: "#06081A",
  navyCard: "#0B0E24",
  orange: "#FF5A1F",
  orangeLight: "#FF7040",
  orangeGlow: "rgba(255,90,31,0.22)",
  offWhite: "#F2EEE8",
  muted: "#7A7D9A",
  dim: "#3A3D58",
  border: "rgba(255,255,255,0.07)",
  borderOrange: "rgba(255,90,31,0.25)",
};

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,500;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&family=DM+Mono:wght@300;400&display=swap');
  :root {
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'DM Mono', monospace;
  }
  html { 
    scroll-behavior: smooth; 
    scrollbar-gutter: stable;
    overflow-y: scroll;
  }
  body { 
    font-family: var(--font-body); 
    background: ${C.navy}; 
    color: ${C.offWhite};
    overflow-x: hidden;
  }
  .f-display { font-family: var(--font-display); }
  .f-mono { font-family: var(--font-mono); }
  ::-webkit-scrollbar { width: 0; height: 0; }
  * { scrollbar-width: none; }
`;

const allCategoryLabels = ["All", "Tech & Insights", "Company News", "Fraud Trends", "Regulatory"];

const categorySlugFor = (label: string) => {
  const map: Record<string, string> = {
    "Tech & Insights": "tech-insights",
    "Company News": "company-news",
    "Fraud Trends": "fraud-trends",
    "Regulatory": "regulatory",
  };
  return map[label] ?? null;
};

// ─── Lang Toggle ──────────────────────────────────────────────────────────────
// ─── Page Header ──────────────────────────────────────────────────────────────
function PageHeader() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="relative pt-12 pb-10 overflow-hidden" style={{ background: C.navy }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,90,31,0.12) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto px-6 lg:px-10 text-center" style={{ maxWidth: "90rem" }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.2em] uppercase mb-3 f-mono" style={{ color: C.orange }}>
          {t.news.label}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="f-display font-semibold leading-tight mb-3"
          style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.75rem)", color: C.offWhite }}>
          {lang === "fr"
            ? "Ce que nous construisons, apprenons et observons."
            : "What we're building, what we're learning, and what's changing."}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base max-w-2xl mx-auto" style={{ color: C.muted }}>
          {lang === "fr"
            ? "Tendances de fraude, technologie de confidentialité et mises à jour de DESILO Europe."
            : "Fraud trends, privacy technology, and updates from DESILO Europe."}
        </motion.p>
      </div>
    </section>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
function FilterBar({ selected, onSelect }: { selected: string; onSelect: (cat: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <div className="sticky top-16 z-40 border-b" style={{ background: "rgba(6,8,26,0.95)", backdropFilter: "blur(16px)", borderColor: C.border }}>
      <div className="mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-4" style={{ maxWidth: "90rem" }}>
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {allCategoryLabels.map(cat => (
            <button key={cat} onClick={() => onSelect(cat)}
              className="text-sm f-mono whitespace-nowrap transition-all duration-200 relative"
              style={{ color: selected === cat ? C.orange : C.dim }}>
              {cat}
              {selected === cat && (
                <motion.div layoutId="activeTab"
                  className="absolute -bottom-4 left-0 right-0 h-0.5"
                  style={{ background: C.orange }} />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {searchOpen && (
              <motion.input ref={searchRef} initial={{ width: 0, opacity: 0 }} animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                placeholder="Search articles..."
                className="px-3 py-1.5 text-sm rounded f-mono outline-none"
                style={{ background: C.navyCard, color: C.offWhite, border: `1px solid ${C.border}` }}
                onBlur={() => setSearchOpen(false)} />
            )}
          </AnimatePresence>
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:opacity-70 transition-opacity" style={{ color: C.muted }}>
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Article Card (Featured) ──────────────────────────────────────────────────
function FeaturedCard({ article, index }: { article: Article; index: number }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const accentColor = categoryColorMap[article.lux_category] ?? C.orange;

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/news/${article.slug}`)}
      className="group cursor-pointer relative overflow-hidden rounded-sm border"
      style={{ background: C.navyCard, borderColor: C.borderOrange }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: C.orange }} />

      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: accentColor + "15" }}>
        {article.coverImage ? (
          <>
            <motion.img 
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0%, ${C.navyCard} 100%)` }} />
          </>
        ) : (
          <>
            <motion.div className="w-full h-full flex items-center justify-center"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <p className="f-display text-6xl font-semibold opacity-20" style={{ color: accentColor }}>
                {categoryDisplayName[article.lux_category]?.split(" ")[0].toUpperCase() ?? "DESILO"}
              </p>
            </motion.div>
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0%, ${C.navyCard} 100%)` }} />
          </>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs f-mono uppercase tracking-wider mb-3" style={{ color: accentColor }}>
          {categoryDisplayName[article.lux_category]}
        </p>

        <motion.h3 className="f-display font-semibold text-xl lg:text-2xl leading-tight mb-3"
          animate={{ color: hovered ? C.orange : C.offWhite }}
          transition={{ duration: 0.2 }}>
          {article.title}
        </motion.h3>

        <p className="text-sm f-mono mb-4" style={{ color: C.dim }}>
          {article.publishedAt} · {article.lux_author.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: C.orange }}>
          <span>{t.news.readMore}</span>
          <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ boxShadow: hovered ? `0 16px 48px ${C.orangeGlow}` : "0 0 0 transparent" }}
        transition={{ duration: 0.3 }} />
    </motion.article>
  );
}

// ─── Article Card (Regular) ───────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: Article; index: number }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const accentColor = categoryColorMap[article.lux_category] ?? C.orange;

  return (
    <motion.article initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/news/${article.slug}`)}
      className="group cursor-pointer relative overflow-hidden rounded-sm border"
      style={{ background: C.navyCard, borderColor: C.border }}>
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: accentColor + "10" }}>
        {article.coverImage ? (
          <motion.img 
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.div className="w-full h-full flex items-center justify-center"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}>
            <p className="f-display text-5xl font-semibold opacity-15" style={{ color: accentColor }}>
              {categoryDisplayName[article.lux_category]?.split(" ")[0].toUpperCase() ?? "DESILO"}
            </p>
          </motion.div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-xs f-mono uppercase tracking-wider" style={{ color: accentColor }}>
            {categoryDisplayName[article.lux_category]}
          </p>
          <span style={{ color: C.dim }}>·</span>
          <div className="flex items-center gap-1.5 text-xs f-mono" style={{ color: C.dim }}>
            <Clock size={12} />
            <span>{article.readingTime} min read</span>
          </div>
        </div>

        <h3 className="f-display font-semibold text-lg lg:text-xl leading-tight mb-3"
          style={{ color: hovered ? C.orange : C.offWhite, transition: "color 0.2s" }}>
          {article.title}
        </h3>

        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: C.muted }}>
          {article.excerpt}
        </p>

        <p className="text-xs f-mono mb-3" style={{ color: C.dim }}>
          {article.publishedAt}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: C.orange }}>
          <span>{t.news.readMore}</span>
          <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.4)` : "0 0 0 transparent",
          y: hovered ? -6 : 0,
        }}
        transition={{ duration: 0.3 }} />
    </motion.article>
  );
}

// ─── Featured Section ─────────────────────────────────────────────────────────
function FeaturedSection({ articles }: { articles: Article[] }) {
  const { lang } = useLang();
  const t = T[lang];
  const featuredArticles = getFeaturedArticles(articles);

  if (featuredArticles.length === 0) return null;

  return (
    <section className="relative py-16" style={{ background: C.navy }}>
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: "90rem" }}>
        <div className="flex items-center gap-2 mb-10">
          <Pin size={16} style={{ color: C.orange }} />
          <h2 className="text-sm f-mono uppercase tracking-wider" style={{ color: C.orange }}>{t.news.featured}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArticles.slice(0, 4).map((article, i) => (
            <FeaturedCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Latest Grid ──────────────────────────────────────────────────────────────
function LatestGrid({
  category,
  loadState,
}: {
  category: string;
  loadState: ArticlesLoadState;
}) {
  const { lang } = useLang();
  const t = T[lang];
  const slug = categorySlugFor(category);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    setVisibleCount(9);
  }, [category, loadState.kind]);

  const allArticles = loadState.kind === "ready" ? loadState.articles : [];
  const nonFeatured = allArticles.filter(a => !a.isFeatured);
  
  // If no category selected (All), show all articles including featured
  // If category selected, filter by that category from all articles
  const filtered = slug 
    ? allArticles.filter(a => a.lux_category === slug) 
    : allArticles;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const statusKey =
    loadState.kind === "loading"
      ? "loading"
      : loadState.kind === "error"
        ? "error"
        : loadState.kind === "empty" || visible.length === 0
          ? "empty"
          : "grid";

  return (
    <section className="relative py-16" style={{ background: C.navy }}>
      <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: "90rem" }}>
        <h2 className="text-2xl f-display font-semibold mb-10" style={{ color: C.offWhite }}>
          {t.news.allArticles}
        </h2>

        <AnimatePresence mode="wait">
          {statusKey === "loading" ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <p className="text-lg f-mono" style={{ color: C.muted }}>{t.news.loading}</p>
            </motion.div>
          ) : statusKey === "error" ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <p className="text-lg f-mono max-w-xl mx-auto" style={{ color: C.muted }}>
                {loadState.kind === "error" ? loadState.message : t.news.error}
              </p>
            </motion.div>
          ) : statusKey === "empty" ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20">
              <p className="text-lg f-mono" style={{ color: C.dim }}>{t.news.empty}</p>
            </motion.div>
          ) : (
            <motion.div key={category} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {visible.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {statusKey === "grid" && hasMore && (
          <div className="flex justify-center">
            <button onClick={() => setVisibleCount(prev => prev + 9)}
              className="px-8 py-3.5 text-sm font-medium rounded-sm border transition-all duration-200"
              style={{ background: "transparent", color: C.orange, borderColor: C.borderOrange }}
              onMouseEnter={e => { e.currentTarget.style.background = C.orange + "15"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              {lang === "fr" ? "Charger plus d'articles" : "Load more articles"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { lang } = useLang();
  return (
    <footer style={{ background: "#040615", borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="f-display font-semibold text-sm" style={{ color: C.offWhite }}>DESILO</span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,90,31,0.15)", color: C.orange }}>Europe</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.dim }}>
              DESILO Europe S.à r.l.<br />
              9 Rue du Laboratoire, 1911 Gare Luxembourg
            </p>
            <p className="text-sm leading-relaxed mt-4" style={{ color: C.dim }}>
              DESILO KOREA<br />
              138, Seoun-ro, Seocho-gu, Seoul, Republic of Korea
            </p>
          </div>
          <div>
            <p className="text-xs f-mono tracking-[0.15em] uppercase mb-3" style={{ color: C.dim }}>Contact</p>
            <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors"
              style={{ color: C.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              contact@luxdesilo.ai
            </a>
          </div>
          <div>
            <p className="text-xs f-mono tracking-[0.15em] uppercase mb-3" style={{ color: C.dim }}>Follow</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.linkedin.com/company/desilo-europe/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                <Linkedin size={13} /> LinkedIn DESILO EUROPE
              </a>
              <a href="https://www.linkedin.com/company/desilo/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                <Linkedin size={13} /> LinkedIn DESILO KOREA
              </a>
              <a href="https://desilo.ai" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: C.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                DESILO KOREA
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.dim }}>© DESILO Europe S.à r.l. All rights reserved.</p>
          <a href="#" className="text-xs transition-colors" style={{ color: C.dim }}
            onMouseEnter={e => (e.currentTarget.style.color = C.muted)}
            onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>
            Privacy notice
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function News() {
  const [loadState, setLoadState] = useState<ArticlesLoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      console.log('[News] Starting to load articles...');
      setLoadState({ kind: "loading" });

      try {
        const result = await fetchLuxArticles();
        console.log('[News] fetchLuxArticles result:', result);
        
        if (cancelled) return;

        if (result.status === "error") {
          console.error('[News] Error loading articles:', result.message);
          setLoadState({ kind: "error", message: result.message });
          return;
        }

        if (result.status === "empty") {
          console.log('[News] No articles found');
          setLoadState({ kind: "empty" });
          return;
        }

        console.log('[News] Successfully loaded', result.articles.length, 'articles');
        setLoadState({ kind: "ready", articles: result.articles });
      } catch (error) {
        console.error('[News] Unexpected error:', error);
        setLoadState({ kind: "error", message: "Failed to load articles. Please try again later." });
      }
    }

    loadArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  const readyArticles = loadState.kind === "ready" ? loadState.articles : [];

  return (
    <div style={{ background: C.navy, minHeight: "100vh" }}>
      <SEO
        title="News & Insights — AMLR, FHE, Fraud Prevention | DESILO Europe"
        description="Stay current on AMLR regulation, fully homomorphic encryption, and privacy-preserving fraud detection in European banking. Insights from the DESILO Europe team."
        canonical="/news"
      />
      <style>{fontStyle}</style>
      <Navigation />
      <PageHeader />
      {loadState.kind === "ready" && <FeaturedSection articles={readyArticles} />}
      <LatestGrid category="All" loadState={loadState} />
      <Footer />
    </div>
  );
}
