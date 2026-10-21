import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import frame3Logo from "@/imports/desilo-europe-logo.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/context/LanguageContext";
import { LangToggle } from "@/app/components/LangToggle";
import { T } from "@/app/data/translations";

const C = {
  navy: "#050E0D",
  orange: "#FF5A1F",
  accent: "#22C48C",
  accentLight: "#4FD3A5",
  borderAccent: "rgba(34,196,140,0.3)",
  orangeLight: "#FF7040",
  offWhite: "#F2EEE8",
  muted: "#8C9A95",
  border: "rgba(255,255,255,0.07)",
};

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const t = T[lang];

  useEffect(() => {
    const handleScroll = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPath = location.pathname;
  const isHome = currentPath === "/";
  const isProduct = currentPath === "/product";
  const isNews = currentPath.startsWith("/news");

  const forceTop = () => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    html.style.scrollBehavior = prev;
  };

  const navigateToHome = () => {
    setOpen(false);
    forceTop();
    navigate("/", { replace: false });
    requestAnimationFrame(forceTop);
  };

  const navigateToProduct = () => {
    setOpen(false);
    forceTop();
    navigate({ pathname: "/product", hash: "" });
    requestAnimationFrame(forceTop);
    setTimeout(forceTop, 0);
    setTimeout(forceTop, 50);
  };

  const navigateToNews = () => {
    setOpen(false);
    forceTop();
    navigate({ pathname: "/news", hash: "" });
    requestAnimationFrame(forceTop);
  };

  const scrollToSection = (id: string) => {
    setOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav
      className="sticky top-0 z-40 transition-all duration-500"
      style={{
        background: solid ? "rgba(5,14,13,0.97)" : "rgba(5,14,13,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex items-center justify-between gap-8"
        style={{ minHeight: "6rem" }}
      >
        <button
          onClick={navigateToHome}
          className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <ImageWithFallback
            src={frame3Logo}
            alt="DESILO Europe"
            className="w-auto object-contain"
            style={{ height: "5.5rem" }}
          />
        </button>

        <div className="hidden md:flex items-center gap-[38px] text-sm" style={{ color: C.muted }}>
          <button
            onClick={() => (isHome ? scrollToSection("hero") : navigateToHome())}
            className="hover:text-white transition-colors"
            style={{ color: isHome ? C.offWhite : C.muted }}
          >
            {t.nav.home}
          </button>
          <button
            onClick={navigateToProduct}
            className="hover:text-white transition-colors"
            style={{ color: isProduct ? C.accent : C.muted }}
          >
            {t.nav.product}
          </button>
          <button
            onClick={navigateToNews}
            className="hover:text-white transition-colors"
            style={{ color: isNews ? C.accent : C.muted }}
          >
            {t.nav.news}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <LangToggle />
          <a
            href={
              lang === "fr"
                ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV"
                : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200"
            style={{ background: C.accent, color: C.navy }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.accentLight)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.accent)}
          >
            {t.nav.cta}
          </a>
          <button
            className="md:hidden p-1.5"
            onClick={() => setOpen((v) => !v)}
            style={{ color: C.offWhite }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-4"
            style={{ background: "rgba(5,14,13,0.97)", borderTop: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => (isHome ? scrollToSection("hero") : navigateToHome())}
              className="text-left py-1.5 text-sm"
              style={{ color: isHome ? C.offWhite : C.muted }}
            >
              {t.nav.home}
            </button>
            <button
              onClick={navigateToProduct}
              className="text-left py-1.5 text-sm"
              style={{ color: isProduct ? C.accent : C.muted }}
            >
              {t.nav.product}
            </button>
            <button
              onClick={navigateToNews}
              className="text-left py-1.5 text-sm"
              style={{ color: isNews ? C.accent : C.muted }}
            >
              {t.nav.news}
            </button>
            <a
              href={
                lang === "fr"
                  ? "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV"
                  : "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center py-2.5 text-sm font-medium rounded-sm"
              style={{ background: C.accent, color: C.navy }}
            >
              {t.nav.cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
