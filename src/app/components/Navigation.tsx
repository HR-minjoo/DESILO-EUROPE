import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import frame3Logo from "@/imports/Frame_7.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useLang } from "@/app/context/LanguageContext";
import { LangToggle } from "@/app/components/LangToggle";
import { T } from "@/app/data/translations";

const C = {
  navy: "#06081A",
  orange: "#FF5A1F",
  orangeLight: "#FF7040",
  offWhite: "#F2EEE8",
  muted: "#7A7D9A",
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

  const navigateToHome = () => {
    setOpen(false);
    navigate("/");
  };

  const navigateToProduct = () => {
    setOpen(false);
    navigate("/product");
  };

  const navigateToNews = () => {
    setOpen(false);
    navigate("/news");
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
        background: solid ? "rgba(6,8,26,0.92)" : "rgba(6,8,26,0.70)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex items-center justify-between gap-8"
        style={{ minHeight: "4rem" }}
      >
        {/* Logo */}
        <button
          onClick={navigateToHome}
          className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <ImageWithFallback
            src={frame3Logo}
            alt="DESILO Europe"
            className="w-auto object-contain"
            style={{ height: "4rem" }}
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: C.muted }}>
          <button
            onClick={() => isHome ? scrollToSection("hero") : navigateToHome()}
            className="hover:text-white transition-colors"
            style={{ color: isHome ? C.offWhite : C.muted }}
          >
            {t.nav.home}
          </button>
          <button
            onClick={navigateToProduct}
            className="hover:text-white transition-colors"
            style={{ color: isProduct ? C.orange : C.muted }}
          >
            {t.nav.product}
          </button>
          <button
            onClick={navigateToNews}
            className="hover:text-white transition-colors"
            style={{ color: isNews ? C.orange : C.muted }}
          >
            {t.nav.news}
          </button>
        </div>

        {/* Right Side */}
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
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.orangeLight)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.orange)}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-4"
            style={{ background: "rgba(6,8,26,0.97)", borderTop: `1px solid ${C.border}` }}
          >
            <button
              onClick={() => isHome ? scrollToSection("hero") : navigateToHome()}
              className="text-left py-1.5 text-sm"
              style={{ color: isHome ? C.offWhite : C.muted }}
            >
              {t.nav.home}
            </button>
            <button
              onClick={navigateToProduct}
              className="text-left py-1.5 text-sm"
              style={{ color: isProduct ? C.orange : C.muted }}
            >
              {t.nav.product}
            </button>
            <button
              onClick={navigateToNews}
              className="text-left py-1.5 text-sm"
              style={{ color: isNews ? C.orange : C.muted }}
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
              style={{ background: C.orange, color: "#fff" }}
            >
              {t.nav.cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
