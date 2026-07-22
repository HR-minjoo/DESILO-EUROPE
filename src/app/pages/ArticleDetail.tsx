import React, { useState, useEffect } from "react";
import { SEO } from "@/app/components/SEO";
import { motion } from "motion/react";
import { X, Menu, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import frame3Logo from "@/imports/Frame_7.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  authorById,
  categoryBySlug,
  categoryColorMap,
  categoryDisplayName,
  type BodyBlock,
  type Article,
} from "@/app/data/news";
import { fetchLuxArticles } from "@/app/lib/luxArticles";
import { Navigation } from "@/app/components/Navigation";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  navy: "#06081A",
  navyCard: "#0B0E24",
  orange: "#FF5A1F",
  offWhite: "#F2EEE8",
  muted: "#7A7D9A",
  dim: "#3A3D58",
  border: "rgba(255,255,255,0.07)",
  borderOrange: "rgba(255,90,31,0.18)",
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
  
  /* Article body Markdown styling */
  .article-body p { 
    line-height: 1.85; 
    margin-bottom: 1.4em; 
    color: rgba(242,238,232,0.82); 
    font-size: clamp(1rem, 1.15vw, 1.125rem); 
  }
  .article-body h1,
  .article-body h2,
  .article-body h3 { 
    font-family: var(--font-display); 
    font-weight: 600; 
    color: #F2EEE8; 
    margin-top: 2.5em; 
    margin-bottom: 0.8em; 
    line-height: 1.3; 
  }
  .article-body h1 { font-size: clamp(1.5rem, 2.2vw, 1.875rem); }
  .article-body h2 { font-size: clamp(1.25rem, 1.8vw, 1.5rem); }
  .article-body h3 { font-size: clamp(1.125rem, 1.5vw, 1.25rem); }
  
  .article-body ul,
  .article-body ol { 
    padding-left: 0; 
    margin-bottom: 1.5em; 
    list-style: none; 
  }
  .article-body ul li,
  .article-body ol li { 
    padding-left: 1.5em; 
    position: relative; 
    margin-bottom: 0.5em; 
    color: rgba(242,238,232,0.72); 
    font-size: clamp(0.95rem, 1.1vw, 1.05rem); 
    line-height: 1.7; 
  }
  .article-body ul li::before { 
    content: "—"; 
    position: absolute; 
    left: 0; 
    color: ${C.orange}; 
    opacity: 0.7; 
  }
  .article-body ol { 
    counter-reset: item; 
  }
  .article-body ol li::before { 
    content: counter(item) "."; 
    counter-increment: item; 
    position: absolute; 
    left: 0; 
    color: ${C.orange}; 
    opacity: 0.7; 
    font-weight: 500;
  }
  
  .article-body a { 
    color: ${C.orange}; 
    text-decoration: none; 
    border-bottom: 1px solid rgba(255,90,31,0.3);
    transition: all 0.2s;
  }
  .article-body a:hover { 
    border-bottom-color: ${C.orange}; 
    opacity: 0.8;
  }
  
  .article-body strong { 
    font-weight: 600; 
    color: rgba(242,238,232,0.95); 
  }
  .article-body em { 
    font-style: italic; 
    color: rgba(242,238,232,0.85); 
  }
  
  .article-body code { 
    font-family: var(--font-mono); 
    background: rgba(255,90,31,0.1); 
    color: ${C.orange}; 
    padding: 0.2em 0.4em; 
    border-radius: 3px; 
    font-size: 0.9em;
  }
  .article-body pre { 
    background: rgba(11,14,36,0.6); 
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px; 
    padding: 1.25em; 
    overflow-x: auto; 
    margin: 1.5em 0;
  }
  .article-body pre code { 
    background: transparent; 
    padding: 0; 
    color: rgba(242,238,232,0.82);
  }
  
  .article-body blockquote { 
    border-left: 2px solid ${C.orange}; 
    padding-left: 1.5em; 
    margin: 2em 0;
    color: rgba(242,238,232,0.75);
    font-style: italic;
  }
  
  .article-body hr { 
    border: none; 
    border-top: 1px solid rgba(255,255,255,0.1); 
    margin: 3em 0;
  }
  
  .article-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 2em 0;
  }
  .article-body table th,
  .article-body table td {
    border: 1px solid rgba(255,255,255,0.1);
    padding: 0.75em 1em;
    text-align: left;
  }
  .article-body table th {
    background: rgba(255,90,31,0.1);
    color: ${C.offWhite};
    font-weight: 600;
  }
  .article-body table td {
    color: rgba(242,238,232,0.82);
  }
  
  ::-webkit-scrollbar { width: 0; height: 0; }
  * { scrollbar-width: none; }
`;

// ─── Navigation ───────────────────────────────────────────────────────────────
// ─── Body Block Renderer ──────────────────────────────────────────────────────
function Block({ block }: { block: BodyBlock }) {
  if (block.type === "p") {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {block.text}
      </ReactMarkdown>
    );
  }
  if (block.type === "h2") {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        p: ({ children }) => <h2>{children}</h2>
      }}>
        {block.text}
      </ReactMarkdown>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="relative my-8 pl-6" style={{ borderLeft: `2px solid ${C.orange}` }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p className="f-display italic not-italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                  lineHeight: 1.65,
                  color: C.offWhite,
                  marginBottom: block.attribution ? "0.5em" : 0,
                  fontStyle: "italic",
                }}>
                {children}
              </p>
            )
          }}
        >
          {block.text}
        </ReactMarkdown>
        {block.attribution && (
          <p className="f-mono text-xs" style={{ color: C.muted, marginBottom: 0 }}>
            — {block.attribution}
          </p>
        )}
      </blockquote>
    );
  }
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((item, i) => (
          <li key={i}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <>{children}</>
              }}
            >
              {item}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

// ─── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const accentColor = categoryColorMap[article.lux_category] ?? C.orange;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/news/${article.slug}`)}
      className="cursor-pointer rounded-sm border p-5 flex flex-col gap-3 transition-colors"
      style={{ background: C.navyCard, borderColor: hovered ? C.borderOrange : C.border }}>
      <p className="text-xs f-mono uppercase tracking-wider" style={{ color: accentColor }}>
        {categoryDisplayName[article.lux_category]}
      </p>
      <h3 className="f-display font-semibold leading-tight text-base"
        style={{ color: hovered ? C.orange : C.offWhite, transition: "color 0.2s" }}>
        {article.title}
      </h3>
      <div className="flex items-center gap-2 text-xs f-mono mt-auto" style={{ color: C.dim }}>
        <Clock size={11} />
        <span>{article.readingTime} min</span>
        <span>·</span>
        <span>{article.publishedAt}</span>
      </div>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      setLoading(true);
      const result = await fetchLuxArticles();
      
      if (cancelled) return;

      if (result.status === "success") {
        setAllArticles(result.articles);
        const foundArticle = result.articles.find(a => a.slug === slug);
        setArticle(foundArticle || null);
      } else {
        setArticle(null);
      }
      
      setLoading(false);
    }

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: C.navy, minHeight: "100vh" }}>
        <style>{fontStyle}</style>
        <Navigation />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="f-mono text-lg" style={{ color: C.muted }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ background: C.navy, minHeight: "100vh" }}>
        <style>{fontStyle}</style>
        <Navigation />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <p className="f-mono text-lg mb-6" style={{ color: C.muted }}>Article not found.</p>
          <button onClick={() => navigate("/news")} className="flex items-center gap-2 mx-auto text-sm"
            style={{ color: C.orange }}>
            <ArrowLeft size={16} /> Back to News
          </button>
        </div>
      </div>
    );
  }

  const author = authorById(article.lux_author);
  const category = categoryBySlug(article.lux_category);
  const accentColor = categoryColorMap[article.lux_category] ?? C.orange;

  const related = allArticles
    .filter(a => a.id !== article.id && a.lux_category === article.lux_category)
    .slice(0, 3);

  const articleDescription = article.excerpt.length > 160
    ? article.excerpt.slice(0, 157) + "..."
    : article.excerpt;

  return (
    <div style={{ background: C.navy, minHeight: "100vh" }}>
      <SEO
        title={`${article.title} | DESILO Europe`}
        description={articleDescription}
        canonical={`/news/${article.slug}`}
      />
      <style>{fontStyle}</style>
      <Navigation />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, rgba(6,8,26,0) 0%, ${C.navy} 100%)` }}>
        {/* atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${accentColor}18 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 pt-12 pb-12">
          {/* Breadcrumb */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 mb-8 text-sm f-mono hover:opacity-100 transition-opacity"
            style={{ color: C.muted }}>
            <ArrowLeft size={15} />
            News & Insights
          </motion.button>

          {/* Category + read time */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 mb-5">
            <span className="text-xs f-mono uppercase tracking-wider px-2.5 py-1 rounded-sm"
              style={{ background: accentColor + "1A", color: accentColor }}>
              {category.name}
            </span>
            <span className="flex items-center gap-1.5 text-xs f-mono" style={{ color: C.dim }}>
              <Clock size={12} />
              {article.readingTime} min read
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="f-display font-semibold leading-tight mb-6"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)", color: C.offWhite }}>
            {article.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="leading-relaxed mb-8"
            style={{ fontSize: "clamp(1rem, 1.2vw, 1.1rem)", color: C.muted }}>
            {article.excerpt}
          </motion.p>

          {/* Author + date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-4 pb-8 border-b"
            style={{ borderColor: C.border }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: accentColor + "22" }}>
              <span className="text-sm f-display font-semibold" style={{ color: accentColor }}>
                {author.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: C.offWhite }}>{author.name}</p>
              <p className="text-xs f-mono" style={{ color: C.dim }}>
                {author.role} · {article.publishedAt}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Cover Image ── */}
      {article.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-4xl mx-auto px-6 lg:px-8 -mt-8 mb-12">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden border"
            style={{ 
              background: C.navyCard,
              borderColor: C.border,
            }}>
            <img 
              src={article.coverImage} 
              alt={article.coverImageAlt || article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {article.coverImageAlt && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                <p className="text-xs f-mono text-white/80">
                  {article.coverImageAlt}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Body ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-3xl mx-auto px-6 lg:px-8 pb-16">
        <div className="article-body">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </motion.div>

      {/* ── Author Bio ── */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pb-16">
        <div className="rounded-sm border p-6 flex gap-4"
          style={{ background: C.navyCard, borderColor: C.border }}>
          <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: accentColor + "22" }}>
            <span className="text-lg f-display font-semibold" style={{ color: accentColor }}>
              {author.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium mb-0.5" style={{ color: C.offWhite }}>{author.name}</p>
            <p className="text-xs f-mono mb-3" style={{ color: accentColor }}>{author.role}</p>
            <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{author.bio}</p>
          </div>
        </div>
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <div className="border-t" style={{ borderColor: C.border }}>
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg f-display font-semibold" style={{ color: C.offWhite }}>
                More in {category.name}
              </h2>
              <button onClick={() => navigate("/news")}
                className="flex items-center gap-1.5 text-sm f-mono hover:opacity-80 transition-opacity"
                style={{ color: C.orange }}>
                All articles <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(a => (
                <RelatedCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="border-t py-10" style={{ background: C.navy, borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-sm f-mono" style={{ color: C.dim }}>
            © 2026 DESILO Europe. Built on privacy-preserving technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
