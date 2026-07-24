import React, { useState, useEffect, useRef, useCallback } from "react";
import { SEO } from "@/app/components/SEO";
import { motion, AnimatePresence, useInView } from "motion/react";
import { X, Menu, ArrowRight, Linkedin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import holmesProduct from "@/imports/holmes_product.jpg";
import logoWhite from "@/imports/logo_white.png";
import holmesLogo from "@/imports/logo_white-3.png";
import frame3Logo from "@/imports/Frame_7.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/context/LanguageContext";
import { T } from "@/app/data/translations";
import { Navigation } from "@/app/components/Navigation";

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
    background: ${C.orange};
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
    0%, 100% { filter: drop-shadow(0 0 0px rgba(255,90,31,0)); }
    50%      { filter: drop-shadow(0 0 8px rgba(255,90,31,0.9)); }
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
      style={{ background: "rgba(255,90,31,0.10)", borderBottom: `1px solid ${C.borderOrange}` }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="relative flex-shrink-0 w-2 h-2 pulse-ring">
          <span className="block w-2 h-2 rounded-full" style={{ background: C.orange }} />
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
          background: "radial-gradient(circle at 50% 50%, rgba(255,150,80,0.95) 0%, rgba(255,100,40,0.75) 12%, rgba(255,70,25,0.48) 28%, rgba(220,50,10,0.22) 50%, transparent 75%)",
          filter: "blur(18px)",
          boxShadow: "0 0 80px rgba(255,90,31,0.5)",
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
          background: "radial-gradient(circle, rgba(255,80,20,0.24) 0%, rgba(255,60,10,0.12) 40%, transparent 70%)",
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
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,90,31,0.18)" strokeWidth="1" />
          ))}
          {([
            [260,180,true,6],[100,60,false,3],[420,100,false,3],[370,310,false,3],
            [140,270,false,2.5],[260,360,false,2.5],[460,390,false,2],[60,380,false,2],[500,160,false,2],[140,430,false,2],
          ] as [number,number,boolean,number][]).map(([cx,cy,main,r],i)=>(
            <g key={i}>
              {main && <circle cx={cx} cy={cy} r={18} fill="rgba(255,90,31,0.12)" />}
              {main && <circle cx={cx} cy={cy} r={11} fill="rgba(255,90,31,0.08)" />}
              <circle cx={cx} cy={cy} r={r} fill={main ? C.orange : "rgba(255,90,31,0.55)"}
                stroke={main ? "rgba(255,90,31,0.35)" : "none"} strokeWidth={main ? 5 : 0} />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-28 pb-6">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="f-display leading-[0.95] tracking-tight mb-8"
          style={{ fontSize: "clamp(3rem, 7.2vw, 6.4rem)", color: C.offWhite, maxWidth: "16ch" }}>
          <span className="block">{t.hero.h1a}</span>
          <span className="block" style={{ color: C.orange, fontStyle: "italic", fontWeight: 700, letterSpacing: "-0.01em" }}>HOLMES</span>
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
          className="mb-8">
          <p className="text-sm font-medium f-mono leading-snug" style={{ color: "rgba(242,238,232,0.55)", textAlign: "left" }}>
            {t.hero.microBase}
            <span style={{
              display: "inline-block", position: "relative", overflow: "hidden",
              height: "1.35em", minWidth: "17ch", verticalAlign: "bottom",
              textAlign: "center",
            }}>
              <AnimatePresence mode="wait">
                <motion.span key={mIdx}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ position: "absolute", left: 0, top: 0, width: "100%", color: C.orange, whiteSpace: "nowrap", textAlign: "center" }}>
                  {microTerms[mIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            {t.hero.microSuffix}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-3">
          <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 text-base font-medium rounded-sm transition-all duration-200"
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeLight)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            {t.hero.cta1}
          </a>
          <button
            onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-7 py-3 text-base font-medium rounded-sm transition-all duration-200"
            style={{ border: `1px solid ${C.borderOrange}`, color: "rgba(242,238,232,0.65)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderOrange; e.currentTarget.style.color = "rgba(242,238,232,0.65)"; }}>
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
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,90,31,0.25) 50%, transparent 90%)" }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-5" style={{ color: C.orange }}>THE PROBLEM</p>
        <h2 className="f-display font-semibold leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: C.offWhite, maxWidth: "22ch" }}>
          Fraud is engineered to exploit the gaps between banks.
        </h2>
        <p className="text-base lg:text-lg leading-relaxed mb-20 max-w-2xl" style={{ color: C.muted }}>
          {"Today's fraud rarely unfolds within a single institution. Activity is distributed across banks and jurisdictions, leaving each institution with only a partial view of the full scheme."}
        </p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>Isolated signals look legitimate.</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-8" style={{ color: C.orange }}>Connected, they reveal fraud.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 mb-24"
          style={{ borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>
          {[
            { v: "€4.3B+", cap: "Total payment fraud losses across the EU/EEA in 2024, up 17% year on year.", src: "EBA & ECB, 2025" },
            { v: "43%",    cap: "Share of credit transfer fraud losses involving cross-border transactions.", src: "EBA · ECB" },
            { v: "15 min", cap: "Around one-third of fraudulent funds move again within 15 minutes—quickly escaping institutional boundaries.", src: "RUSI, 2025" },
          ].map((s, i) => (
            <div key={i} style={{ borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "1.75rem 2rem" }}>
              <div className="f-display font-bold tabular-nums leading-none mb-4"
                style={{ fontSize: "clamp(3rem, 5vw, 4.8rem)", color: C.orange }}>{s.v}</div>
              <p className="leading-relaxed f-mono mb-1" style={{ fontSize: "0.9625rem", color: C.muted }}>{s.cap}</p>
              <p className="text-xs f-mono" style={{ color: C.dim }}>{s.src}</p>
            </div>
          ))}
        </div>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>Once out of bounds.</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-10" style={{ color: C.orange }}>Now within reach.</p>
        <div className="hidden lg:flex items-start relative">
          <div className="absolute top-[11px] left-0 right-0 h-px" style={{ background: C.border }} />
          <div className="absolute top-[11px] left-0 h-px" style={{ width: "87.5%", background: `linear-gradient(90deg, ${C.orange}, rgba(255,90,31,0.5))` }} />
          {probTlNodes.map((n, i) => {
            const isAmlr = i === 2;
            const barrierFilled = [5, 3, 0];
            const barrierLabels = ["Full barrier", "Partially relaxed", "Path clear"];
            const filled = barrierFilled[i];
            return (
              <div key={i} className="relative flex-1 flex flex-col pr-4">
                <div className="mb-4" style={{ height: 22 }}>
                  <div className="rounded-full" style={{ width: isAmlr ? 22 : 14, height: isAmlr ? 22 : 14, background: isAmlr ? C.orange : C.dim, marginTop: isAmlr ? 0 : 4 }} />
                </div>
                <span className="text-xs f-mono mb-1.5" style={{ color: isAmlr ? "rgba(255,90,31,0.7)" : C.dim }}>{n.year}</span>
                <p className="text-sm font-semibold mb-1" style={{ color: isAmlr ? C.orange : "rgba(242,238,232,0.6)" }}>{n.label}</p>
                <p className="mb-3" style={{ fontSize: "0.825rem", color: C.muted }}>{n.desc}</p>
                {/* Barrier blocks */}
                <div style={{ display: "flex", flexDirection: "column-reverse", gap: "2px", width: 36, marginBottom: "0.3rem" }}>
                  {Array.from({ length: 5 }, (_, bIdx) => (
                    <div key={bIdx} style={{
                      width: 36, height: 6,
                      background: bIdx < filled ? "rgba(122,125,154,0.32)" : "rgba(255,255,255,0.02)",
                      border: bIdx < filled ? "1px solid rgba(255,255,255,0.13)" : "1px dashed rgba(255,255,255,0.05)",
                    }} />
                  ))}
                </div>
                {isAmlr ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: "0.5rem" }}>
                    <div style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${C.orange}, transparent)` }} />
                    <span className="f-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.06em", color: C.orange }}>✓ OPEN</span>
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
                      style={{ background: "rgba(255,90,31,0.12)", color: C.orange, border: `1px solid rgba(255,90,31,0.22)` }}>
                      Effective July 10, 2027
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-16 f-display italic leading-relaxed"
          style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.3rem)", maxWidth: "54ch", paddingLeft: "1.5rem", borderLeft: `2px solid rgba(255,90,31,0.3)`, color: "rgba(242,238,232,0.55)" }}>
                {"“Regulation opened the door to collaboration.”"}
          <span style={{ color: C.orange }}>{'Now comes the real challenge: making it work without exposing customer data."'}</span>
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
    <section id="problem" className="relative py-12 lg:py-16" style={{ background: C.navy }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,90,31,0.25) 50%, transparent 90%)" }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-2" style={{ color: C.orange }}>{tp.label}</p>
        <h2 className="f-display font-semibold leading-tight mb-3"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: C.offWhite, maxWidth: "22ch" }}>{tp.h2}</h2>
        <p className="text-sm lg:text-base leading-relaxed mb-6 max-w-2xl" style={{ color: C.muted }}>{tp.lead}</p>

        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>{tp.statsCaption1}</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-3" style={{ color: C.orange }}>{tp.statsCaption2}</p>

        {/* Stats - with countup animation */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 mb-4" style={{ borderTop: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}` }}>
          {[
            { val: `€${s1Val}B+`, t: s1t, cap: tp.stats[0].cap, src: tp.stats[0].src },
            { val: `${s2Val}%`, t: s2t, cap: tp.stats[1].cap, src: tp.stats[1].src },
            { val: `${s3Val} min`, t: s3t, cap: tp.stats[2].cap, src: tp.stats[2].src },
          ].map((stat, i) => (
            <div key={i} style={{ borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "1.25rem 1.5rem" }}>
              <div className="f-display font-bold tabular-nums leading-none mb-2" style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", color: C.orange }}>{stat.val}</div>
              <p className="leading-relaxed f-mono mb-1" style={{ fontSize: "0.8rem", color: C.muted }}>{stat.cap}</p>
              <p className="text-xs f-mono" style={{ color: C.dim, fontSize: "0.7rem" }}>{stat.src}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mb-6" style={{ 
          padding: "1rem 1.5rem", 
          borderLeft: `2px solid rgba(255,90,31,0.3)`,
          background: "rgba(255,90,31,0.03)"
        }}>
          <p className="f-display italic font-semibold leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.3rem)", color: C.offWhite }}>
            {`"${tp.challengeTitle}"`}
          </p>
          <p style={{ 
            fontSize: "clamp(0.85rem, 1vw, 0.95rem)", 
            lineHeight: 1.6, 
            color: "rgba(242,238,232,0.65)",
            whiteSpace: "pre-line" 
          }}>
            {tp.challengeBody}
          </p>
        </div>

        {/* Timeline */}
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-1" style={{ color: C.dim }}>{tp.tlCaption1}</p>
        <p className="text-xs tracking-[0.22em] uppercase f-mono mb-6" style={{ color: C.orange }}>{tp.tlCaption2}</p>
        
        <div ref={timelineRef} className="flex items-start relative mb-8">
          {/* Horizontal line */}
          <div className="absolute left-0 right-0 h-px" style={{ top: '5rem', background: C.border }} />
          <div className="absolute left-0 h-px" 
            style={{ 
              top: '5rem',
              width: `${tlProg * 87.5}%`, 
              background: `linear-gradient(90deg, ${C.orange}, rgba(255,90,31,0.5))`,
              transition: 'width 0.1s linear'
            }} />
          {tp.nodes.map((node, i) => {
            const isAmlr = i === 2;
            const active = [n0Active, n1Active, n2Active][i];
            const brickCfgs = [
              { cols: 3, rows: 2, color: "rgba(210,55,20,0.45)", border: "1px solid rgba(210,55,20,0.30)" },
              { cols: 3, rows: 1, color: "rgba(195,115,35,0.38)", border: "1px solid rgba(195,115,35,0.22)" },
              { cols: 3, rows: 1, color: "transparent", border: "1px dashed rgba(255,255,255,0.06)" },
            ];
            const cfg = brickCfgs[i];
            return (
              <div key={i} className="relative flex-1 pr-6" 
                style={{ 
                  opacity: active ? 1 : (prefersReduced ? 1 : 0.3),
                  transition: 'opacity 0.4s ease',
                  ...(isAmlr && amlrGlow > 0 ? { 
                    filter: `drop-shadow(0 0 ${amlrGlow * 14}px rgba(255,90,31,0.6))` 
                  } : {})
                }}>
                <div style={{ height: "5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cfg.cols}, 18px)`, gap: 3 }}>
                    {Array.from({ length: cfg.cols * cfg.rows }, (_, b) => (
                      <div key={b} style={{ width: 18, height: 6, borderRadius: 2, background: cfg.color, border: cfg.border }} />
                    ))}
                  </div>
                </div>
                {/* Node dot - centered on line */}
                <div style={{ 
                  width: 12, height: 12, borderRadius: "50%", 
                  background: active || prefersReduced ? (isAmlr ? C.orange : C.muted) : C.dim, 
                  position: "relative", zIndex: 1,
                  boxShadow: isAmlr && (active || prefersReduced) ? `0 0 ${8 + amlrGlow * 12}px ${C.orange}` : "none",
                  transition: 'all 0.4s ease',
                  margin: '0 auto',
                  transform: 'translateY(-6px)'
                }} />
                <div style={{ paddingTop: "0.5rem" }}>
                  <span className="block f-mono text-xs mb-0.5"
                    style={{ color: (active || prefersReduced) ? (isAmlr ? "rgba(255,90,31,0.85)" : C.muted) : C.dim }}>
                    {node.year}
                  </span>
                  <p className="font-semibold text-sm mb-0.5"
                    style={{ color: (active || prefersReduced) ? (isAmlr ? C.orange : "rgba(242,238,232,0.88)") : "rgba(242,238,232,0.3)" }}>
                    {node.label}
                  </p>
                  <p className="leading-snug"
                    style={{ fontSize: "0.825rem", color: (active || prefersReduced) ? C.muted : "rgba(122,125,154,0.3)", maxWidth: "26ch" }}>
                    {node.desc}
                  </p>
                  {isAmlr && (
                    <div style={{ marginTop: 6, opacity: (active || prefersReduced) ? 1 : 0, transition: 'opacity 0.4s' }}>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-sm f-mono"
                        style={{ background: "rgba(255,90,31,0.12)", color: C.orange, border: `1px solid rgba(255,90,31,0.22)` }}>
                        {t.problem.amlrBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bridge sentence */}
        <p className="f-display italic leading-relaxed" 
          style={{ 
            fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)", 
            lineHeight: 1.55, 
            maxWidth: "42ch",
            paddingLeft: "1.5rem",
            borderLeft: `2px solid rgba(255,90,31,0.3)`
          }}>
          <span style={{ color: "rgba(242,238,232,0.85)" }}>{t.bridge.line1}</span><br />
          <span style={{ color: C.orange }}>{t.bridge.line2}</span>
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
          className="f-display italic leading-tight inline-block"
          style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.3rem)", whiteSpace: "nowrap" }}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ marginRight: "0.35em", color: "rgba(242,238,232,0.88)" }}>
            {"“Regulation opened the door to collaboration."}
          </span>
          <motion.span
            style={{ color: C.orange, textShadow: "0 0 60px rgba(255,90,31,0.35)" }}
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

// ─── Solution ─────────────────────────────────────────────────────────────────
function Solution() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [hovered, setHovered] = useState(false);

  // Holmes opacity: hidden → appears on scroll → brightens significantly on hover
  const holmesOpacity = inView ? (hovered ? 1.0 : 0.48) : 0;
  const holmesX = inView ? 0 : 60;
  const holmesScale = hovered ? 0.95 : 0.9; // Slightly smaller, zooms to 95% on hover

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative py-28 lg:py-44 overflow-hidden"
      style={{ background: C.navyCard }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,90,31,0.18) 50%, transparent 90%)" }} />

      {/* Holmes image — right-side atmospheric, appears on scroll, brightens on hover */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 pointer-events-none hidden lg:block flex items-center justify-center"
        style={{ width: "52%" }}
        animate={{ opacity: holmesOpacity, x: holmesX }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ scale: holmesScale }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ImageWithFallback
            src={holmesProduct}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "hue-rotate(-18deg) saturate(1.3)", mixBlendMode: "lighten" }}
          />
          {/* Left gradient fade — text side bleeds into image */}
          <div className="absolute inset-y-0 left-0 w-2/5 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${C.navyCard} 0%, transparent 100%)` }} />
          {/* Subtle orange glow behind holmes */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 55% 50%, rgba(255,90,31,0.07) 0%, transparent 70%)" }} />
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.2em] uppercase mb-10 f-mono" style={{ color: C.orange }}>
          {t.solution.label}
        </motion.p>

        {/* Text block — left half only, flows naturally against the atmospheric right */}
        <div className="max-w-xl lg:max-w-[48%]">
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* HOLMES logo lockup */}
            <div className="mb-6">
              <ImageWithFallback 
                src={holmesLogo} 
                alt="HOLMES" 
                className="h-9 w-auto object-contain opacity-90" 
              />
            </div>

            {/* Tagline — display-size, unified font */}
            <p className="f-display italic leading-tight mb-6"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", color: "rgba(242,238,232,0.88)" }}>
              {t.solution.tagline}
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-4 mb-10"
              style={{ paddingLeft: "1rem", borderLeft: `2px solid rgba(255,90,31,0.2)` }}>
              {t.solution.features.map((f, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: "rgba(242,238,232,0.55)", whiteSpace: "pre-line" }}>{f}</p>
              ))}
            </div>

            <button
              onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium transition-all duration-200 tracking-widest"
              style={{ background: C.orange, color: "#fff" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.orangeLight)}
              onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
              {t.solution.cta} <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
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
        {/* Orange glow emanating from streams */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 25% 50%, rgba(255,90,31,0.08) 0%, transparent 70%)" }} />
        
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
                        color: isHighlight ? [C.dim, C.orange, C.dim] : C.dim,
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
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,90,31,0.15)" strokeWidth="0.5" />
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
                stroke={C.orange}
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
                fill={C.orange}
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
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,90,31,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex justify-end">
        <div className="max-w-2xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs tracking-[0.2em] uppercase mb-12 f-mono text-right" style={{ color: C.orange }}>
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
            className="mb-12 text-right"
            style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", color: "rgba(242,238,232,0.65)", lineHeight: 1.5 }}>
            {lang === "en" ? (
              <>Built on years of cryptographic research and real-world deployment by our parent company <span style={{ color: C.orange }}>DESILO KOREA</span>.</>
            ) : (
              <>Fruit de plusieurs années de recherche cryptographique et de déploiements concrets par notre maison mère <span style={{ color: C.orange }}>DESILO KOREA</span>.</>
            )}
          </motion.p>

          {/* Capabilities — right-aligned */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.18 }}
            className="mb-12">
            <div className="flex flex-col gap-3">
              {t.technology.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3 justify-end">
                  <span className="text-base lg:text-lg f-mono" style={{ color: "rgba(242,238,232,0.55)" }}>
                    {cap}
                  </span>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: C.dim }} />
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
                background: C.orange,
                color: "#fff",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.orangeLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.orange; }}>
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
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,90,31,0.3) 50%, transparent 90%)" }} />

      {/* Spotlight orb — similar to hero */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "15%", right: "10%",
          width: "50vw", height: "50vw",
          maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(255,130,50,0.5) 0%, rgba(255,90,20,0.35) 18%, rgba(220,60,5,0.18) 40%, rgba(180,40,5,0.08) 62%, transparent 78%)",
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
          background: "radial-gradient(circle, rgba(255,60,0,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="f-display font-semibold leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: C.offWhite }}>
          {t.finalCta.h2}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          className="leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)", color: C.muted, whiteSpace: "pre-line" }}>
          {t.finalCta.body}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center">
          <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium rounded-sm transition-all"
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.orangeLight)}
            onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
            {t.finalCta.cta}
          </a>
        </motion.div>
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
            <a href="https://www.linkedin.com/company/desilo-europe/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: C.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              <Linkedin size={13} /> LinkedIn
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
      <Footer />
    </div>
  );
}