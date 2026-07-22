import React, { useState, useEffect, useRef } from "react";
import { SEO } from "@/app/components/SEO";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { X, Menu } from "lucide-react";
import holmesLogoPng from "@/imports/logo_white-4.png";
import holmesProduct from "@/imports/pdf4_img0.jpg";
import vectorHolmes from "@/imports/Vector.png";
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

  @keyframes scan-sweep {
    0%   { top: -2px;  opacity: 0; }
    4%   { opacity: 1; }
    92%  { opacity: 0.55; }
    100% { top: 100vh; opacity: 0; }
  }
  @keyframes radar-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ring-pulse {
    0%   { transform: translate(-50%, -50%) scale(0.25); opacity: 0.7; }
    100% { transform: translate(-50%, -50%) scale(1);    opacity: 0; }
  }
  @keyframes reticle-glow {
    0%, 100% { opacity: 0.25; }
    50%       { opacity: 0.55; }
  }
  @keyframes lens-drift {
    0%   { transform: translate(0px,   0px); }
    25%  { transform: translate(22px, -14px); }
    50%  { transform: translate(-10px, 18px); }
    75%  { transform: translate(-24px, -6px); }
    100% { transform: translate(0px,   0px); }
  }
  @keyframes crosshair-spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }
  .scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,90,31,0.45) 35%, rgba(255,170,80,0.6) 50%, rgba(255,90,31,0.45) 65%, transparent 100%);
    animation: scan-sweep 9s linear infinite;
    pointer-events: none;
  }
  .radar-sweep {
    position: absolute; inset: 0; border-radius: 50%;
    background: conic-gradient(from 0deg, transparent 0%, transparent 72%, rgba(255,90,31,0.18) 86%, rgba(255,150,60,0.08) 95%, transparent 100%);
    animation: radar-rotate 5s linear infinite;
  }
  .ring-expand {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(255,90,31,0.45);
    animation: ring-pulse 3s ease-out infinite;
  }
  .reticle-blink {
    animation: reticle-glow 2.5s ease-in-out infinite;
  }
  .lens-float {
    animation: lens-drift 14s ease-in-out infinite;
  }
`;

// ─── HOLMES full name mapping ─────────────────────────────────────────────────
const HOLMES_LETTERS = [
  { letter: "H", word: "Homomorphic" },
  { letter: "O", word: "Oblivious" },
  { letter: "L", word: "Learning" },
  { letter: "M", word: "for" },
  { letter: "E", word: "Malicious" },
  { letter: "S", word: "Event" },
  { letter: "", word: "Screening" },
];

// ─── Background layer ─────────────────────────────────────────────────────────
function ProductBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute",
        right: "-4%", top: "50%",
        transform: "translateY(-50%)",
        width: "62%", maxWidth: 920,
        aspectRatio: "16 / 9",
      }}>
        <ImageWithFallback
          src={holmesProduct}
          alt=""
          className="w-full h-full object-cover"
          style={{ mixBlendMode: "screen", opacity: 0.68 }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to right, ${C.navy} 0%, rgba(6,8,26,0.55) 28%, transparent 55%, rgba(6,8,26,0.3) 90%, ${C.navy} 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, ${C.navy} 0%, transparent 18%, transparent 82%, ${C.navy} 100%)`,
        }} />
      </div>

      <div className="lens-float hidden lg:block" style={{
        position: "absolute",
        right: "6%", bottom: "8%",
        width: 220,
        opacity: 0.07,
        filter: "sepia(1) hue-rotate(-20deg) saturate(2) brightness(1.4)",
      }}>
        <ImageWithFallback src={vectorHolmes} alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="scan-line" style={{ animationDelay: "-3s" }} />
      <div className="scan-line" style={{ animationDelay: "-7.5s", opacity: 0.4 }} />

      <div style={{
        position: "absolute",
        right: "18%", top: "50%",
        width: 420, height: 420,
        marginTop: -210,
      }}>
        {[1, 0.72, 0.48, 0.28].map((scale, i) => (
          <div key={i} className="reticle-blink" style={{
            position: "absolute",
            inset: `${(1 - scale) * 50}%`,
            borderRadius: "50%",
            border: `1px solid rgba(255,90,31,${0.07 + i * 0.02})`,
            animationDelay: `${i * 0.6}s`,
          }} />
        ))}
        <div className="radar-sweep" />
        <div className="ring-expand" style={{ width: 120, height: 120, left: "50%", top: "50%", marginLeft: -60, marginTop: -60, animationDelay: "0s" }} />
        <div className="ring-expand" style={{ width: 120, height: 120, left: "50%", top: "50%", marginLeft: -60, marginTop: -60, animationDelay: "1.5s" }} />
      </div>

      <div className="reticle-blink" style={{
        position: "absolute",
        right: "18%", top: "50%",
        width: 80, height: 80,
        marginRight: -40, marginTop: -40,
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,90,31,0.4)", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,90,31,0.4)", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "1px solid rgba(255,90,31,0.6)", borderLeft: "1px solid rgba(255,90,31,0.6)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTop: "1px solid rgba(255,90,31,0.6)", borderRight: "1px solid rgba(255,90,31,0.6)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottom: "1px solid rgba(255,90,31,0.6)", borderLeft: "1px solid rgba(255,90,31,0.6)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "1px solid rgba(255,90,31,0.6)", borderRight: "1px solid rgba(255,90,31,0.6)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 5, height: 5, borderRadius: "50%", background: C.orange, transform: "translate(-50%, -50%)", opacity: 0.8 }} />
      </div>

      <div style={{
        position: "absolute",
        right: "18%", top: "50%",
        width: 560, height: 560,
        marginRight: -280, marginTop: -280,
        borderRadius: "50%",
        border: "1px dashed rgba(255,90,31,0.06)",
        animation: "radar-rotate 28s linear infinite reverse",
      }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 8,
            height: 1,
            background: "rgba(255,90,31,0.25)",
            transformOrigin: "-272px 0",
            transform: `translateY(-50%) rotate(${i * 30}deg)`,
          }} />
        ))}
      </div>

      <div className="hidden lg:block" style={{
        position: "absolute",
        right: "17%", top: "44%",
        width: 180, height: 180,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,90,31,0.18)",
        overflow: "hidden",
      }}>
        {[25, 50, 75].map(pct => (
          <React.Fragment key={pct}>
            <div style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, height: 1, background: "rgba(255,90,31,0.06)" }} />
            <div style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,90,31,0.06)" }} />
          </React.Fragment>
        ))}
        <div style={{
          position: "absolute", top: "8%", left: "12%",
          width: "35%", height: "20%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,200,150,0.08) 0%, transparent 80%)",
          transform: "rotate(-20deg)",
        }} />
      </div>

      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: "42%",
        background: `linear-gradient(to right, ${C.navy} 60%, transparent 100%)`,
      }} />
    </div>
  );
}

// ─── Lang Toggle ──────────────────────────────────────────────────────────────
// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [litIdx, setLitIdx] = useState(0);
  const { lang } = useLang();
  const t = T[lang];

  useEffect(() => {
    const id = setInterval(() => setLitIdx(i => (i + 1) % HOLMES_LETTERS.length), 620);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-8">
          <ImageWithFallback
            src={holmesLogoPng}
            alt="HOLMES"
            className="w-auto object-contain mx-auto"
            style={{ height: "2.5rem", filter: "drop-shadow(0 0 20px rgba(255,90,31,0.30))" }}
          />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="f-display font-semibold leading-tight mb-4"
          style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)", color: C.offWhite, maxWidth: "30ch", margin: "0 auto 1rem" }}>
          {t.product.hero.h1}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="f-mono mb-6"
          style={{ color: C.dim, letterSpacing: "0.04em", margin: "0 auto 1.5rem", fontSize: "0.9rem" }}>
          {HOLMES_LETTERS.map((item, i) => (
            <span key={i} style={{
              color: litIdx === i ? C.orange : "inherit",
              transition: "color 0.25s ease",
              marginRight: i < HOLMES_LETTERS.length - 1 ? "0.35em" : 0,
            }}>
              {item.word}
            </span>
          ))}
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-base lg:text-lg leading-relaxed mb-8"
          style={{ color: "rgba(242,238,232,0.72)", maxWidth: "54ch", margin: "0 auto 2rem" }}>
          {t.product.hero.lead}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-wrap justify-center gap-4">
          <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-all"
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.orangeLight; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.orange; }}>
            {t.product.hero.cta1}
          </a>
          <button
            onClick={() => document.getElementById("core-capabilities")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-sm transition-all"
            style={{ border: `1px solid ${C.dim}`, color: "rgba(242,238,232,0.65)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.dim; e.currentTarget.style.color = "rgba(242,238,232,0.65)"; }}>
            {t.product.hero.cta2}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Core Capabilities ────────────────────────────────────────────────────────
function CoreCapabilities() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { lang } = useLang();
  const t = T[lang];
  const cards = t.product.capabilities.cards;

  return (
    <motion.section
      id="core-capabilities"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-20">
      <h2 className="text-xs tracking-[0.2em] uppercase f-mono mb-8" style={{ color: C.dim }}>
        {t.product.capabilities.label}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="rounded-sm p-6 lg:p-7 relative overflow-hidden cursor-default"
            animate={{
              borderColor: hovered === i ? C.orange : "rgba(255,255,255,0.07)",
              boxShadow: hovered === i
                ? `0 0 0 1px rgba(255,90,31,0.15), 0 8px 40px rgba(255,90,31,0.12), inset 0 0 30px rgba(255,90,31,0.04)`
                : "0 0 0px transparent",
              backgroundColor: hovered === i ? "rgba(14,17,38,0.95)" : C.navyCard,
            }}
            transition={{ duration: 0.22 }}
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>

            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              animate={{ opacity: hovered === i ? 1 : 0, scaleX: hovered === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: `linear-gradient(90deg, transparent, ${C.orange}, transparent)`, transformOrigin: "left" }}
            />

            <div className="mb-5 flex items-center gap-3">
              <motion.span
                className="f-mono text-2xl font-medium"
                animate={{ color: hovered === i ? C.offWhite : C.orange }}
                transition={{ duration: 0.2 }}
                style={{ color: C.orange }}>
                {card.num}
              </motion.span>
              <motion.div
                animate={{ opacity: hovered === i ? 1 : 0, scale: hovered === i ? 1 : 0.6 }}
                transition={{ duration: 0.2 }}
                style={{ position: "relative", width: 14, height: 14 }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.orange, transform: "translateY(-50%)" }} />
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: C.orange, transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", width: 4, height: 4, borderRadius: "50%", background: C.orange, transform: "translate(-50%,-50%)" }} />
              </motion.div>
            </div>

            <motion.h3
              className="text-lg font-semibold mb-4"
              animate={{ color: hovered === i ? C.orange : C.offWhite }}
              transition={{ duration: 0.2 }}>
              {card.title}
            </motion.h3>

            <p className="text-sm leading-relaxed" style={{ color: "rgba(242,238,232,0.7)" }}>
              {card.body}
            </p>

            <motion.div
              animate={{ opacity: hovered === i ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: "absolute", bottom: 12, right: 12 }}>
              <div style={{ width: 16, height: 16, borderBottom: `1px solid rgba(255,90,31,0.5)`, borderRight: `1px solid rgba(255,90,31,0.5)` }} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Product() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const t = T[lang];
  const zones = t.product.zones.items;

  return (
    <div style={{ background: C.navy, minHeight: "100vh", position: "relative" }}>
      <SEO
        title="HOLMES Solution — How It Works | DESILO Europe"
        description="HOLMES uses fully homomorphic encryption to let banks run joint fraud-detection models across institutions—without exposing any customer data. AMLR Article 75 compliant."
        canonical="/product"
      />
      <style>{fontStyle}</style>

      <ProductBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navigation />
        <Hero />

        <main className="relative">
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">

            <CoreCapabilities />

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              <h2 className="text-xs tracking-[0.2em] uppercase f-mono mb-8" style={{ color: C.dim }}>
                {t.product.zones.label}
              </h2>

              <div className="flex flex-col gap-6">
                {zones.map((zone, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-sm p-6 lg:p-8"
                    style={{ background: "rgba(11,14,36,0.85)", border: `1px solid ${C.borderOrange}`, backdropFilter: "blur(8px)" }}>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="relative w-3 h-3">
                          <div className="absolute inset-0 rounded-full" style={{ background: C.orange, boxShadow: `0 0 12px ${C.orange}` }} />
                          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: C.orange, opacity: 0.4 }} />
                        </div>
                      </div>
                      <h3 className="f-mono text-lg font-medium" style={{ color: C.orange }}>{zone.title}</h3>
                    </div>
                    <div className="pl-7">
                      {zone.intro && (
                        <p className="text-base leading-relaxed mb-5" style={{ color: "rgba(242,238,232,0.8)" }}>{zone.intro}</p>
                      )}
                      <ul className="flex flex-col gap-4">
                        {zone.bullets.map((bullet, bi) => (
                          <li key={bi} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: C.orange, opacity: 0.5 }} />
                            <p className="text-sm leading-relaxed" style={{ color: C.muted, whiteSpace: "pre-line" }}>{bullet}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Bottom CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-28 lg:mt-36 text-center">
              <div className="relative inline-block mb-10">
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 320, height: 320,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,90,31,0.07)",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 200, height: 200,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,90,31,0.11)",
                  pointerEvents: "none",
                }} />
                <p className="f-mono text-xs uppercase tracking-[0.25em] mb-5" style={{ color: C.orange }}>
                  {t.product.bottomCta.label}
                </p>
              </div>

              <h2 className="f-display font-semibold leading-tight mb-8 mx-auto"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.2rem)", color: C.offWhite, maxWidth: "22ch" }}>
                {t.product.bottomCta.h2}
              </h2>

              <a href={lang === 'fr' ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV" : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-9 py-4 text-base font-medium rounded-sm transition-all"
                style={{ background: C.orange, color: "#fff" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.orangeLight)}
                onMouseLeave={e => (e.currentTarget.style.background = C.orange)}>
                {t.product.bottomCta.cta}
              </a>
            </motion.section>
          </div>
        </main>

        <footer style={{ background: "rgba(4,6,21,0.95)", borderTop: `1px solid ${C.border}`, backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs" style={{ color: C.dim }}>{t.product.footer.rights}</p>
              <button onClick={() => navigate("/")} className="text-xs transition-colors" style={{ color: C.dim }}
                onMouseEnter={e => (e.currentTarget.style.color = C.muted)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dim)}>
                {t.product.footer.back}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
