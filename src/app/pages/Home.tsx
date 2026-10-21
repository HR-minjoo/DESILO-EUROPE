import React, { useState, useEffect, useRef, useCallback } from "react";
import { SEO } from "@/app/components/SEO";
import { motion, AnimatePresence, useInView } from "motion/react";
import { X, Menu, ArrowRight, Linkedin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import logoWhite from "@/imports/logo_white.png";
import holmesLogo from "@/imports/logo_white-3.png";
import frame3Logo from "@/imports/Frame_7.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/context/LanguageContext";
import { T } from "@/app/data/translations";
import { SiteFooter } from "@/app/components/SiteFooter";
import { Navigation } from "@/app/components/Navigation";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  navy: "#050E0D",
  navyCard: "#0A1916",
  orange: "#FF5A1F",
  accent: "#22C48C",
  accentLight: "#4FD3A5",
  borderAccent: "rgba(34,196,140,0.3)",
  orangeLight: "#FF7040",
  orangeGlow: "rgba(255,90,31,0.22)",
  offWhite: "#F2EEE8",
  muted: "#8C9A95",
  dim: "#4B5B56",
  border: "rgba(255,255,255,0.07)",
  borderOrange: "rgba(255,90,31,0.25)",
};

// Light-section palette (used where a section switches to a light background)
const L = {
  bg: "#F4F6F5",
  card: "#FFFFFF",
  border: "#E1E7E4",
  ink: "#0B1A16",
  body: "#5C6B66",
  accentText: "#128A5F", // brand green darkened for legible text on light backgrounds
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
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.7; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .pulse-ring::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    background: ${C.accent};
    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }
  @keyframes bounce-idle {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(7px); }
  }
  @keyframes bounce-hold {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(12px); }
  }
  @keyframes bounce-cta {
    0%, 100% { transform: translateY(0px); opacity: 1; }
    45%      { transform: translateY(10px); opacity: 1; }
    50%      { transform: translateY(10px); opacity: 0.5; }
    55%      { transform: translateY(10px); opacity: 1; }
  }
  @keyframes glow-cta {
    0%, 100% { filter: drop-shadow(0 0 0px rgba(34,196,140,0)); }
    50%      { filter: drop-shadow(0 0 8px rgba(34,196,140,0.9)); }
  }
  .scroll-hint-idle { animation: bounce-idle 2s ease-in-out infinite; }
  .scroll-hint-hold { animation: bounce-hold 0.9s ease-in-out infinite; }
  .scroll-hint-cta  { animation: bounce-cta 1.1s ease-in-out infinite, glow-cta 1.1s ease-in-out infinite; }
  ::-webkit-scrollbar { width: 0; height: 0; }
  * { scrollbar-width: none; }
`;

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="relative z-50 flex items-center justify-between px-5 py-2.5 text-xs"
      style={{ background: "rgba(34,196,140,0.10)", borderBottom: `1px solid ${C.borderAccent}` }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="relative flex-shrink-0 w-2 h-2 pulse-ring">
          <span className="block w-2 h-2 rounded-full" style={{ background: C.accent }} />
        </span>
        <span className="truncate text-xs" style={{ color: "rgba(242,238,232,0.65)" }}>
          <span className="font-medium italic" style={{ color: C.offWhite }}>Encrypted Collaboration in Financial Crime Detection</span>
          {" "}— Technology Showcase &amp; Pilot Programme, in view of AMLR Art.75
        </span>
      </div>
      <button onClick={() => setShow(false)} className="ml-4 flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity p-1" style={{ color: C.offWhite }}>
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { lang } = useLang();
  const t = T[lang];
  const microTerms = t.hero.microTerms;
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [mIdx, setMIdx] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setMIdx(i => (i + 1) % microTerms.length), 3000);
    return () => clearInterval(timer);
  }, [microTerms.length]);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMx(((e.clientX - r.left) / r.width - 0.5) * 2);
    setMy(((e.clientY - r.top) / r.height - 0.5) * 2);
  }, []);

  return (
    <section id="hero" ref={ref} onMouseMove={onMove}
      className="relative flex flex-col overflow-hidden" style={{ background: C.navy }}>

      {/* Pin spotlight — concentrated beam, follows mouse aggressively */}
      <motion.div
        animate={{ x: mx * 320, y: my * 200 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="absolute pointer-events-none"
        style={{
          top: "8%", right: "5%",
          width: "32vw", height: "32vw",
          maxWidth: 420, maxHeight: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(120,232,186,0.95) 0%, rgba(56,212,152,0.75) 12%, rgba(26,172,120,0.48) 28%, rgba(14,128,90,0.22) 50%, transparent 75%)",
          filter: "blur(18px)",
          boxShadow: "0 0 80px rgba(34,196,140,0.5)",
        }}
      />
      {/* Secondary halo — softer glow layer */}
      <motion.div
        animate={{ x: mx * 260, y: my * 160 }}
        transition={{ type: "spring", stiffness: 60, damping: 22 }}
        className="absolute pointer-events-none"
        style={{
          top: "2%", right: "-5%",
          width: "48vw", height: "48vw",
          maxWidth: 580, maxHeight: 580,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(32,186,132,0.24) 0%, rgba(20,152,106,0.12) 40%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* Pin/node network SVG — moves with mouse */}
      <motion.div
        animate={{ x: mx * 80, y: my * 60 }}
        transition={{ type: "spring", stiffness: 45, damping: 20 }}
        className="absolute pointer-events-none hidden lg:block"
        style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}>
        <svg className="absolute" style={{ top: "12%", right: "3%", width: "46%", height: "68%" }} viewBox="0 0 520 460" fill="none">
          {[
            [100,60,260,180],[260,180,420,100],[260,180,370,310],[260,180,140,270],
            [140,270,60,380],[370,310,460,390],[260,180,260,360],[420,100,500,160],
            [260,360,140,430],
          ].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(34,196,140,0.18)" strokeWidth="1" />
          ))}
          {([
            [260,180,true,6],[100,60,false,3],[420,100,false,3],[370,310,false,3],
            [140,270,false,2.5],[260,360,false,2.5],[460,390,false,2],[60,380,false,2],[500,160,false,2],[140,430,false,2],
          ] as [number,number,boolean,number][]).map(([cx,cy,main,r],i)=>(
            <g key={i}>
              {main && <circle cx={cx} cy={cy} r={18} fill="rgba(34,196,140,0.12)" />}
              {main && <circle cx={cx} cy={cy} r={11} fill="rgba(34,196,140,0.08)" />}
              <circle cx={cx} cy={cy} r={r} fill={main ? C.accent : "rgba(34,196,140,0.55)"}
                stroke={main ? "rgba(34,196,140,0.35)" : "none"} strokeWidth={main ? 5 : 0} />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-28 pb-24 lg:pb-32">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="f-display leading-[0.95] tracking-tight mb-8"
          style={{ fontSize: "clamp(3rem, 7.2vw, 6.4rem)", color: C.offWhite, maxWidth: "16ch" }}>
          <span className="block">{t.hero.h1a}</span>
          <span className="block" style={{ color: C.accent, fontStyle: "italic", fontWeight: 700, letterSpacing: "-0.01em" }}>HOLMES</span>
          <span className="block">{t.hero.h1b}</span>
        </motion.h1>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg lg:text-xl leading-relaxed mb-5 max-w-lg"
          style={{ color: "rgba(242,238,232,0.72)" }}>
          {t.hero.body}
        </motion.p>

        {/* Microline — rotating regulatory term */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 lg:mb-14">
          {/* Line 1: "Built for <term>." — the term box sizes to the current term, so long
              terms never overflow and short ones leave no gap. Line 2: the rest of the sentence,
              kept on its own line so it doesn't shift sideways as the term changes. */}
          <p className="text-sm font-medium f-mono leading-snug" style={{ color: "rgba(242,238,232,0.55)", textAlign: "left" }}>
            {t.hero.microBase.trim()}{" "}
            <span style={{
              display: "inline-block", position: "relative", overflow: "hidden",
              height: "1.35em", verticalAlign: "bottom",
            }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={mIdx}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ display: "inline-block", color: C.accent, whiteSpace: "nowrap" }}>
                  {microTerms[mIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            .
            <br />
            {t.hero.microSuffix.replace(/^\.\s*/, "")}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3">
          <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 text-base font-medium rounded-sm transition-all duration-200"
            style={{ background: C.accent, color: C.navy }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}>
            {t.hero.cta1}
          </a>
          <button
            onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-7 py-3 text-base font-medium rounded-sm transition-all duration-200"
            style={{ border: `1px solid ${C.borderAccent}`, color: C.offWhite }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderAccent; e.currentTarget.style.color = C.offWhite; }}>
            {t.hero.cta2}
          </button>
        </motion.div>
      </div>

      {/* Bottom gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${C.navy})` }} />
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

// Scroll-scrub math helpers
const c01   = (t: number) => Math.max(0, Math.min(1, t));
const remap = (p: number, a: number, b: number) => c01((p - a) / (b - a));
const eio   = (t: number) => t < 0.5 ? 2*t*t : 1 - (-2*t+2)**2/2;
const fi    = (p: number, a: number, b: number) => eio(remap(p, a, b));
const fb    = (p: number, ia: number, ib: number, oa: number, ob: number) =>
              fi(p,ia,ib) * (1 - fi(p,oa,ob));

function useStickyProgress(ref: React.RefObject<HTMLDivElement>) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current; if (!el) return;
      const top    = el.getBoundingClientRect().top;
      const travel = el.offsetHeight - window.innerHeight;
      setProg(travel > 0 ? Math.max(0, Math.min(1, -top / travel)) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize",  update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return prog;
}

const probTlNodes = [
  { year: "2018",        label: "GDPR",          desc: "The age of barriers: direct sharing of customer data became heavily constrained." },
  { year: "2023",        label: "PSD3 / PSR",    desc: "A legal basis begins to emerge for exchanging payment-fraud information." },
  { year: "10 Jul 2027", label: "AMLR Art. 75", desc: "The first explicit legal pathway for cross-institutional information-sharing partnerships (PfIS), with EU-level coordination through AMLA." },
];

function ProblemStatic() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section id="problem" className="relative py-28 lg:py-40" style={{ background: C.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(34,196,140,0.25) 50%, transparent 90%)" }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-5" style={{ color: C.accent }}>THE PROBLEM</p>
        <h2 className="f-display font-semibold leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.offWhite, maxWidth: "22ch" }}>
          Fraud is engineered to exploit the gaps between banks.
        </h2>
        <p className="text-base lg:text-lg leading-relaxed mb-20 max-w-2xl" style={{ color: C.muted }}>
          {"Today's fraud rarely unfolds within a single institution. Activity is distributed across banks and jurisdictions, leaving each institution with only a partial view of the full scheme."}
        </p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>Isolated signals look legitimate.</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-8" style={{ color: C.accent }}>Connected, they reveal fraud.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 mb-24"
          style={{ borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>
          {[
            { v: "€4.3B+", cap: "Total payment fraud losses across the EU/EEA in 2024, up 17% year on year.", src: "EBA & ECB, 2025" },
            { v: "43%",    cap: "Share of credit transfer fraud losses involving cross-border transactions.", src: "EBA · ECB" },
            { v: "15 min", cap: "Around one-third of fraudulent funds move again within 15 minutes—quickly escaping institutional boundaries.", src: "RUSI, 2025" },
          ].map((s, i) => (
            <div key={i} style={{ borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "1.75rem 2rem" }}>
              <div className="f-display font-bold tabular-nums leading-none mb-4"
                style={{ fontSize: "clamp(3rem, 5vw, 4.8rem)", color: C.accent }}>{s.v}</div>
              <p className="leading-relaxed f-mono mb-1" style={{ fontSize: "0.9625rem", color: C.muted }}>{s.cap}</p>
              <p className="text-xs f-mono" style={{ color: C.dim }}>{s.src}</p>
            </div>
          ))}
        </div>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>Once out of bounds.</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-10" style={{ color: C.accent }}>Now within reach.</p>
        <div className="hidden lg:flex items-start relative">
          <div className="absolute top-[11px] left-0 right-0 h-px" style={{ background: C.border }} />
          <div className="absolute top-[11px] left-0 h-px" style={{ width: "87.5%", background: `linear-gradient(90deg, ${C.accent}, rgba(34,196,140,0.5))` }} />
          {probTlNodes.map((n, i) => {
            const isAmlr = i === 2;
            const barrierFilled = [5, 3, 0];
            const barrierLabels = ["Full barrier", "Partially relaxed", "Path clear"];
            const filled = barrierFilled[i];
            return (
              <div key={i} className="relative flex-1 flex flex-col pr-4">
                <div className="mb-4" style={{ height: 22 }}>
                  <div className="rounded-full" style={{ width: isAmlr ? 22 : 14, height: isAmlr ? 22 : 14, background: isAmlr ? C.accent : C.dim, marginTop: isAmlr ? 0 : 4 }} />
                </div>
                <span className="text-xs f-mono mb-1.5" style={{ color: isAmlr ? "rgba(34,196,140,0.7)" : C.dim }}>{n.year}</span>
                <p className="text-sm font-semibold mb-1" style={{ color: isAmlr ? C.accent : "rgba(242,238,232,0.6)" }}>{n.label}</p>
                <p className="mb-3" style={{ fontSize: "0.825rem", color: C.muted }}>{n.desc}</p>
                {/* Barrier blocks */}
                <div style={{ display: "flex", flexDirection: "column-reverse", gap: "2px", width: 36, marginBottom: "0.3rem" }}>
                  {Array.from({ length: 5 }, (_, bIdx) => (
                    <div key={bIdx} style={{
                      width: 36, height: 6,
                      background: bIdx < filled ? "rgba(140,154,149,0.32)" : "rgba(255,255,255,0.02)",
                      border: bIdx < filled ? "1px solid rgba(255,255,255,0.13)" : "1px dashed rgba(255,255,255,0.05)",
                    }} />
                  ))}
                </div>
                {isAmlr ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: "0.5rem" }}>
                    <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
                    <span className="f-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.06em", color: C.accent }}>✓ OPEN</span>
                  </div>
                ) : (
                  <p className="f-mono uppercase mb-2" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: C.dim }}>
                    {barrierLabels[i]}
                  </p>
                )}
                {isAmlr && (
                  <div className="mt-1">
                    <p className="text-xs leading-relaxed mb-2" style={{ color: C.muted, maxWidth: "28ch" }}>
                      Establishes the legal basis for information-sharing partnerships (PfIS) between institutions, with AMLA facilitating them across the EU.
                    </p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-sm f-mono"
                      style={{ background: "rgba(34,196,140,0.12)", color: C.accent, border: `1px solid rgba(34,196,140,0.22)` }}>
                      Effective July 10, 2027
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-16 f-display italic font-semibold leading-tight"
          style={{ fontSize: "clamp(2.8rem, 5.2vw, 4.6rem)", maxWidth: "54ch", paddingLeft: "1.5rem", borderLeft: `2px solid rgba(34,196,140,0.3)`, color: "rgba(242,238,232,0.55)" }}>
                {"“Regulation opened the door to collaboration.”"}
          <span style={{ color: C.accent }}>{'Now comes the real challenge: making it work without exposing customer data."'}</span>
        </p>
      </div>
    </section>
  );
}

function Problem() {
  const { lang } = useLang();
  const t = T[lang];
  const tp = t.problem;
  
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // DEFAULT TO FINAL STATE (1) — animations will temporarily reset to 0 when triggered
  const [countupProgress, setCountupProgress] = useState(1);
  const [timelineProgress, setTimelineProgress] = useState(1);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [timelineTriggered, setTimelineTriggered] = useState(false);
  
  const animFrameRef = useRef<number>(0);

  const prefersReduced = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Trigger countup when stats scroll into view (once only)
  useEffect(() => {
    if (prefersReduced || statsTriggered || !statsRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          setStatsTriggered(true);
          observer.disconnect();
          
          // Start animation from 0
          let startTime = Date.now();
          const dur = 1300;
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / dur);
            setCountupProgress(progress);
            
            if (progress < 1) {
              animFrameRef.current = requestAnimationFrame(animate);
            }
          };
          
          // Reset to 0 and start animation immediately
          setCountupProgress(0);
          requestAnimationFrame(() => {
            startTime = Date.now(); // Reset start time
            animate();
          });
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5] }
    );
    
    observer.observe(statsRef.current);
    
    return () => {
      observer.disconnect();
      // Don't cancel animation - let it complete even if scrolling past quickly
    };
  }, [prefersReduced, statsTriggered]);

  // Trigger timeline when it scrolls into view (once only)
  useEffect(() => {
    if (prefersReduced || timelineTriggered || !timelineRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          setTimelineTriggered(true);
          observer.disconnect();
          
          // Start animation from 0
          let startTime = Date.now();
          const dur = 1700;
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / dur);
            setTimelineProgress(progress);
            
            if (progress < 1) {
              animFrameRef.current = requestAnimationFrame(animate);
            }
          };
          
          // Reset to 0 and start animation immediately
          setTimelineProgress(0);
          requestAnimationFrame(() => {
            startTime = Date.now(); // Reset start time
            animate();
          });
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5] }
    );
    
    observer.observe(timelineRef.current);
    
    return () => {
      observer.disconnect();
      // Don't cancel animation - let it complete even if scrolling past quickly
    };
  }, [prefersReduced, timelineTriggered]);

  // Calculate countup values with stagger
  const s1t = prefersReduced ? 1 : eio(remap(countupProgress, 0, 0.85));
  const s2t = prefersReduced ? 1 : eio(remap(countupProgress, 0.08, 0.92));
  const s3t = prefersReduced ? 1 : eio(remap(countupProgress, 0.16, 1.0));
  const s1Val = (s1t * 4.3).toFixed(1);
  const s2Val = Math.round(s2t * 43);
  const s3Val = Math.round(s3t * 15);
  
  // Timeline node activation
  const tlProg = prefersReduced ? 1 : timelineProgress;
  const n0Active = tlProg >= 0.20;
  const n1Active = tlProg >= 0.55;
  const n2Active = tlProg >= 0.85;
  const amlrGlow = remap(tlProg, 0.82, 1.0);

  return (
    <section id="problem" className="relative py-24 lg:py-36" style={{ background: C.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(34,196,140,0.25) 50%, transparent 90%)" }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* ① Heading */}
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-6" style={{ color: C.accent }}>{tp.label}</p>
        <h2 className="f-display font-semibold leading-tight mb-7"
          style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", color: C.offWhite, maxWidth: "22ch" }}>{tp.h2}</h2>
        <p className="text-base lg:text-lg leading-relaxed max-w-3xl mb-24 lg:mb-32 sm:whitespace-pre-line" style={{ color: C.muted }}>{tp.lead}</p>

        {/* ② Stats */}
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-2" style={{ color: C.dim }}>{tp.statsCaption1}</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-8" style={{ color: C.accent }}>{tp.statsCaption2}</p>

        {/* Stats - with countup animation */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 mb-24 lg:mb-32" style={{ borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>
          {[
            { val: `€${s1Val}B+`, t: s1t, cap: tp.stats[0].cap, src: tp.stats[0].src },
            { val: `${s2Val}%`, t: s2t, cap: tp.stats[1].cap, src: tp.stats[1].src },
            { val: `${s3Val} min`, t: s3t, cap: tp.stats[2].cap, src: tp.stats[2].src },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col" style={{ borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "2rem 2rem 2.25rem" }}>
              <div className="f-display font-bold tabular-nums leading-none mb-5" style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", color: C.accent }}>{stat.val}</div>
              {/* flex-1 lets the caption fill the row so every source line sits on the same baseline */}
              <p className="leading-relaxed f-mono mb-4 flex-1" style={{ fontSize: "0.8rem", color: "rgba(242,238,232,0.88)" }}>{stat.cap}</p>
              <p className="text-xs f-mono" style={{ color: C.dim, fontSize: "0.7rem" }}>{stat.src}</p>
            </div>
          ))}
        </div>

        {/* ③ Quote */}
        <div className="mb-24 lg:mb-32" style={{ 
          padding: "2.25rem 2.5rem", 
          borderLeft: `2px solid rgba(34,196,140,0.3)`,
          background: "rgba(34,196,140,0.03)"
        }}>
          <p className="f-display font-semibold leading-tight mb-5"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.3rem)", color: C.offWhite }}>
            {`“${tp.challengeTitle}”`}
          </p>
          <p style={{ 
            fontSize: "clamp(0.9rem, 1.05vw, 1rem)", 
            lineHeight: 1.75, 
            color: "rgba(242,238,232,0.65)",
            whiteSpace: "pre-line" 
          }}>
            {tp.challengeBody}
          </p>
        </div>

        {/* ④ Timeline */}
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-2" style={{ color: C.dim }}>{tp.tlCaption1}</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-4" style={{ color: C.accent }}>{tp.tlCaption2}</p>
        
        <div ref={timelineRef} className="flex items-start relative mb-24 lg:mb-32">
          {/* Horizontal line */}
          <div className="absolute left-0 right-0 h-px" style={{ top: '5rem', background: C.border }} />
          <div className="absolute left-0 h-px" 
            style={{ 
              top: '5rem',
              width: `${tlProg * 87.5}%`, 
              background: `linear-gradient(90deg, ${C.accent}, rgba(34,196,140,0.5))`,
              transition: 'width 0.1s linear'
            }} />
          {tp.nodes.map((node, i) => {
            const isAmlr = i === 2;
            const active = [n0Active, n1Active, n2Active][i];
            const brickCfgs = [
              { cols: 3, rows: 2, color: "rgba(26,172,120,0.45)", border: "1px solid rgba(26,172,120,0.30)" },
              { cols: 3, rows: 1, color: "rgba(150,204,112,0.38)", border: "1px solid rgba(150,204,112,0.22)" },
              { cols: 3, rows: 1, color: "transparent", border: "1px dashed rgba(255,255,255,0.06)" },
            ];
            const cfg = brickCfgs[i];
            return (
              <div key={i} className="relative flex-1 pr-10" 
                style={{ 
                  opacity: active ? 1 : (prefersReduced ? 1 : 0.3),
                  transition: 'opacity 0.4s ease',
                  ...(isAmlr && amlrGlow > 0 ? { 
                    filter: `drop-shadow(0 0 ${amlrGlow * 14}px rgba(34,196,140,0.6))` 
                  } : {})
                }}>
                <div style={{ height: "5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cfg.cols}, 18px)`, gap: 3 }}>
                    {Array.from({ length: cfg.cols * cfg.rows }, (_, b) => (
                      <div key={b} style={{ width: 18, height: 6, borderRadius: 2, background: cfg.color, border: cfg.border }} />
                    ))}
                  </div>
                </div>
                {/* Node dot - left aligned with text */}
                <div style={{ 
                  width: 12, height: 12, borderRadius: "50%", 
                  background: active || prefersReduced ? (isAmlr ? C.accent : C.muted) : C.dim, 
                  position: "relative", zIndex: 1,
                  boxShadow: isAmlr && (active || prefersReduced) ? `0 0 ${8 + amlrGlow * 12}px ${C.accent}` : "none",
                  transition: 'all 0.4s ease',
                  margin: 0,
                  transform: 'translateY(-6px)'
                }} />
                <div style={{ paddingTop: "1rem" }}>
                  <span className="block f-mono text-xs mb-2"
                    style={{ color: (active || prefersReduced) ? (isAmlr ? "rgba(34,196,140,0.85)" : C.muted) : C.dim }}>
                    {node.year}
                  </span>
                  <p className="font-semibold text-base mb-2"
                    style={{ color: (active || prefersReduced) ? (isAmlr ? C.accent : "rgba(242,238,232,0.88)") : "rgba(242,238,232,0.3)" }}>
                    {node.label}
                  </p>
                  <p className="leading-relaxed"
                    style={{ fontSize: "0.875rem", color: (active || prefersReduced) ? C.muted : "rgba(140,154,149,0.3)", maxWidth: "26ch" }}>
                    {node.desc}
                  </p>
                  {isAmlr && (
                    <div style={{ marginTop: 14, opacity: (active || prefersReduced) ? 1 : 0, transition: 'opacity 0.4s' }}>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-sm f-mono"
                        style={{ background: "rgba(34,196,140,0.12)", color: C.accent, border: `1px solid rgba(34,196,140,0.22)` }}>
                        {t.problem.amlrBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* ⑤ Bridge sentence */}
        <p className="f-display font-medium leading-relaxed" 
          style={{ 
            fontSize: "clamp(1.2rem, 2vw, 1.6rem)", 
            lineHeight: 1.5, 
            maxWidth: "40ch",
            paddingLeft: "1.5rem",
            borderLeft: `2px solid rgba(34,196,140,0.3)`
          }}>
          <span style={{ color: "rgba(242,238,232,0.85)" }}>{t.bridge.line1}</span><br />
          <span style={{ color: C.accent }}>{t.bridge.line2}</span>
        </p>
      </div>
    </section>
  );
}

// ─── Problem Bridge ───────────────────────────────────────────────────────────
function ProblemBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div ref={ref} style={{ background: C.navy, paddingTop: "10vh", paddingBottom: "12vh" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <motion.p
          className="f-display italic font-semibold leading-tight inline-block"
          style={{ fontSize: "clamp(2.8rem, 5.2vw, 4.6rem)", maxWidth: "30ch" }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ marginRight: "0.35em", color: "rgba(242,238,232,0.88)" }}>
            {"“Regulation opened the door to collaboration."}
          </span>
          <motion.span
            style={{ color: C.accent, textShadow: "0 0 60px rgba(34,196,140,0.35)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {"Now comes the real challenge: making it work without exposing customer data.”"}
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}

// ─── HOLMES flow diagram (Solution section) ──────────────────────────────────
// Three banks keep raw data in their Local Zone; only encrypted signals travel to
// the Global Zone (dark = sealed / blind), and only alerts travel back.
function HolmesFlowDiagram({ active }: { active: boolean }) {
  const { lang } = useLang();
  const d = T[lang].solution.diagram;
  const reduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = active && !reduced;

  const BANK_W = 212, BANK_H = 112;
  const banks = [
    { name: `${d.bank} A`, y: 24,  gz: 200 },
    { name: `${d.bank} B`, y: 196, gz: 260 },
    { name: `${d.bank} C`, y: 368, gz: 320 },
  ];
  const GZ = { x: 330, y: 140, w: 230, h: 240 };
  const cx = GZ.x + GZ.w / 2;
  const pathFor = (b: typeof banks[number]) => {
    const y0 = b.y + BANK_H / 2;
    return `M${BANK_W},${y0} C272,${y0} 272,${b.gz} ${GZ.x},${b.gz}`;
  };
  const body = { fontFamily: "var(--font-body)" } as const;
  const mono = { fontFamily: "var(--font-mono)" } as const;

  return (
    <svg viewBox="0 0 560 568" className="w-full h-auto" role="img" aria-label={d.aria}>
      {/* connectors */}
      {banks.map((b, i) => (
        <path key={`p${i}`} id={`holmes-flow-${i}`} d={pathFor(b)} fill="none" stroke="#C9D4CF" strokeWidth={1.5} />
      ))}

      {/* bank / Local Zone cards */}
      {banks.map((b, i) => (
        <g key={`b${i}`} transform={`translate(0,${b.y})`}>
          <rect x={0.5} y={0.5} width={BANK_W - 1} height={BANK_H - 1} rx={6} fill={L.card} stroke={L.border} />
          <text x={18} y={32} fontSize={15} fontWeight={600} fill={L.ink} style={body}>{b.name}</text>
          <text x={BANK_W - 18} y={31} fontSize={9.5} letterSpacing={1.2} textAnchor="end" fill={L.accentText} style={mono}>
            {d.localZone.toUpperCase()}
          </text>
          {/* lock + caption */}
          <g transform="translate(18,52)" fill="none" stroke={L.body} strokeWidth={1.3}>
            <rect x={0} y={5} width={10} height={8} rx={1.5} />
            <path d="M2.2 5 V3.2 a2.8 2.8 0 0 1 5.6 0 V5" />
          </g>
          <text x={35} y={64} fontSize={11.5} fill={L.body} style={body}>{d.rawStays}</text>
          {/* raw records that never leave */}
          {Array.from({ length: 6 }, (_, k) => (
            <rect key={k} x={18 + k * 30} y={80} width={24} height={6} rx={2} fill={L.ink} opacity={0.1} />
          ))}
        </g>
      ))}

      {/* Global Zone: dark, sealed box */}
      <rect x={GZ.x} y={GZ.y} width={GZ.w} height={GZ.h} rx={8} fill={C.navy} />
      <text x={cx} y={GZ.y + 36} fontSize={11} letterSpacing={2} textAnchor="middle" fill={C.accent} style={mono}>{d.globalZone}</text>
      <text x={cx} y={GZ.y + 56} fontSize={11.5} textAnchor="middle" fill="rgba(242,238,232,0.6)" style={body}>{d.operator}</text>
      <g transform={`translate(${cx},${GZ.y + 122})`}>
        <circle r={36} fill="none" stroke={C.accent} strokeOpacity={0.25} />
        <circle r={23} fill="none" stroke={C.accent} strokeOpacity={0.55} />
        <circle r={6} fill={C.accent} />
        {animate && (
          <circle r={23} fill="none" stroke={C.accent} strokeWidth={1}>
            <animate attributeName="r" values="23;44" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
      <text x={cx} y={GZ.y + 190} fontSize={12.5} textAnchor="middle" fill="rgba(242,238,232,0.92)" style={body}>{d.computes}</text>
      <text x={cx} y={GZ.y + 210} fontSize={11.5} textAnchor="middle" fill="rgba(242,238,232,0.55)" style={body}>{d.blind}</text>

      {/* moving packets: encrypted signals out, alerts back */}
      {banks.map((_, i) => (
        <g key={`m${i}`}>
          <circle r={5} fill={C.accent} stroke={L.card} strokeWidth={1.5}
            {...(!animate ? { transform: `translate(272,${[140, 256, 372][i]})` } : {})}>
            {animate && (
              <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${i * 0.7}s`}>
                <mpath href={`#holmes-flow-${i}`} />
              </animateMotion>
            )}
          </circle>
          {animate && (
            <rect x={-3.5} y={-3.5} width={7} height={7} fill={L.ink} transform="rotate(45)" opacity={0}>
              <animateMotion dur="5.2s" repeatCount="indefinite" begin={`${1.6 + i * 1.1}s`}
                keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href={`#holmes-flow-${i}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.45;0.5;1"
                dur="5.2s" repeatCount="indefinite" begin={`${1.6 + i * 1.1}s`} />
            </rect>
          )}
        </g>
      ))}

      {/* legend */}
      <g transform="translate(0,522)">
        <circle cx={6} cy={0} r={5} fill={C.accent} />
        <text x={18} y={4} fontSize={11.5} fill={L.body} style={body}>{d.legendSignal}</text>
        <rect x={182} y={-3.5} width={7} height={7} fill={L.ink} transform="rotate(45 185.5 0)" />
        <text x={198} y={4} fontSize={11.5} fill={L.body} style={body}>{d.legendAlert}</text>
      </g>
      <g transform="translate(0,552)">
        <path d="M6 -7 L12 -4.5 V0.5 C12 4.5 9 6.5 6 7.5 C3 6.5 0 4.5 0 0.5 V-4.5 Z" fill="none" stroke={L.accentText} strokeWidth={1.3} />
        <text x={18} y={4} fontSize={11.5} fill={L.body} style={body}>{d.quantum}</text>
      </g>
    </svg>
  );
}

// ─── Solution ─────────────────────────────────────────────────────────────────
function Solution() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });


  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative py-28 lg:py-40 overflow-hidden"
      style={{ background: L.bg }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.2em] uppercase mb-10 f-mono" style={{ color: L.accentText }}>
            {t.solution.label}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* HOLMES logo lockup — white source asset rendered dark for the light background */}
            <div className="mb-6">
              <ImageWithFallback
                src={holmesLogo}
                alt="HOLMES"
                className="h-9 w-auto object-contain"
                style={{ filter: "brightness(0)", opacity: 0.88 }}
              />
            </div>

            <p className="f-display font-semibold leading-tight mb-8"
              style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)", color: L.ink }}>
              {t.solution.tagline}
            </p>

            <div className="flex flex-col gap-4 mb-10"
              style={{ paddingLeft: "1rem", borderLeft: `2px solid ${C.accent}` }}>
              {t.solution.features.map((f, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: L.body, whiteSpace: "pre-line" }}>{f}</p>
              ))}
            </div>

            <button
              onClick={() => {
                // Navigate to Product page with hash
                navigate("/product#holmes-logo");
                // Small delay to allow navigation to complete, then scroll to the section
                setTimeout(() => {
                  const element = document.getElementById("holmes-logo");
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium rounded-sm transition-all duration-200"
              style={{ background: C.accent, color: C.navy }}
              onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}>
              {t.solution.cta} <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* HOLMES flow diagram — answers "how, without exposing customer data?" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <HolmesFlowDiagram active={inView} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Technology ───────────────────────────────────────────────────────────────
function Technology() {
  const { lang } = useLang();
  const t = T[lang];
  // Encrypted data stream animation
  const encryptedChars = "0123456789ABCDEF";
  const streamCount = 8;
  
  return (
    <section id="technology" className="relative py-28 lg:py-40 overflow-hidden" style={{ background: C.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `1px solid ${C.border}` }} />

      {/* Left side: Encrypted data streams */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block overflow-hidden">
        {/* Green glow emanating from streams */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 25% 50%, rgba(34,196,140,0.08) 0%, transparent 70%)" }} />
        
        {/* Vertical encrypted text streams */}
        <div className="absolute inset-0 flex items-center justify-center gap-8 pl-12">
          {Array.from({ length: streamCount }).map((_, streamIdx) => {
            const delay = streamIdx * 0.8;
            const duration = 25 + streamIdx * 3;
            const opacity = 0.15 + (streamIdx % 3) * 0.08;
            
            return (
              <motion.div
                key={streamIdx}
                className="flex flex-col gap-3 f-mono text-xs"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ opacity }}
              >
                {Array.from({ length: 40 }).map((_, charIdx) => {
                  const char = encryptedChars[Math.floor(Math.random() * encryptedChars.length)];
                  const isHighlight = Math.random() > 0.85;
                  
                  return (
                    <motion.span
                      key={charIdx}
                      animate={{
                        opacity: isHighlight ? [opacity, opacity * 2.5, opacity] : opacity,
                        color: isHighlight ? [C.dim, C.accent, C.dim] : C.dim,
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: charIdx * 0.1,
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20" style={{ mixBlendMode: "overlay" }}>
          <defs>
            <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,196,140,0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" />
        </svg>

        {/* Animated circuit nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
          {[
            [80, 120], [140, 200], [100, 320], [160, 450], [70, 540]
          ].map(([cx, cy], i) => (
            <motion.g key={i}>
              {/* Pulsing ring */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={12}
                fill="none"
                stroke={C.accent}
                strokeWidth="1"
                opacity="0"
                animate={{
                  r: [8, 20],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
              {/* Core dot */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={3}
                fill={C.accent}
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            </motion.g>
          ))}
        </svg>

        {/* Fade to background on right edge */}
        <div className="absolute inset-y-0 right-0 w-1/3"
          style={{ background: `linear-gradient(to right, transparent 0%, ${C.navy} 100%)` }} />
      </div>

      {/* Subtle centered glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(34,196,140,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex justify-end">
        <div className="max-w-2xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs tracking-[0.2em] uppercase mb-12 f-mono text-right" style={{ color: C.accent }}>
            {t.technology.label}
          </motion.p>

          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="f-display font-semibold leading-tight mb-5 text-right"
            style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.2rem)", color: C.offWhite }}>
            {t.technology.h2}
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 lg:mb-20 text-right text-base lg:text-lg leading-relaxed max-w-2xl ml-auto"
            style={{ color: "rgba(242,238,232,0.65)" }}>
            {lang === "en" ? (
              <>Built on years of cryptographic research and real-world deployment<br className="hidden sm:block" />{" "}by our parent company <span style={{ color: C.accent }}>DESILO KOREA</span>.</>
            ) : (
              <>Fruit de plusieurs années de recherche cryptographique<br className="hidden sm:block" />{" "}et de déploiements concrets par notre maison mère <span style={{ color: C.accent }}>DESILO KOREA</span>.</>
            )}
          </motion.p>

          {/* Capabilities — right-aligned */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.18 }}
            className="mb-16 lg:mb-20">
            <div className="flex flex-col gap-3">
              {t.technology.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3 justify-end">
                  <span className="text-base lg:text-lg f-mono" style={{ color: "rgba(242,238,232,0.9)" }}>
                    {cap}
                  </span>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.accent }} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end">
            <a href="https://desilo.ai/en/technology" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
              style={{
                background: C.accent,
                color: C.navy,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accentLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.accent; }}>
              {t.technology.cta} <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section id="contact" className="relative py-36 lg:py-56 overflow-hidden" style={{ background: C.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(34,196,140,0.3) 50%, transparent 90%)" }} />

      {/* Spotlight orb — similar to hero */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%", right: "10%",
          width: "50vw", height: "50vw",
          maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(86,222,168,0.5) 0%, rgba(34,196,140,0.35) 18%, rgba(16,140,98,0.18) 40%, rgba(10,100,70,0.08) 62%, transparent 78%)",
          filter: "blur(32px)",
        }}
      />
      {/* Outer halo */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%", left: "5%",
          width: "60vw", height: "60vw",
          maxWidth: 700, maxHeight: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,152,106,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="f-display font-semibold leading-tight mb-10 lg:mb-12"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: C.offWhite }}>
          {t.finalCta.h2}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="leading-relaxed mb-14 lg:mb-16 max-w-2xl mx-auto"
          style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)", color: C.muted, whiteSpace: "pre-line" }}>
          {t.finalCta.body}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center">
          <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium rounded-sm transition-all"
            style={{ background: C.accent, color: C.navy }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentLight)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}>
            {t.finalCta.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}


// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: C.navy, minHeight: "100vh" }}>
      <SEO
        title="DESILO Europe — HOLMES | Privacy-Preserving Fraud Detection"
        description="HOLMES lets European banks detect cross-institutional fraud together, without any bank sharing its raw customer data. Built on fully homomorphic encryption, aligned with AMLR Article 75."
        canonical="/"
      />
      <style>{fontStyle}</style>
      <Navigation />
      <Hero />
      <Problem />
      <Solution />
      <Technology />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}