import React from "react";
import { useLang } from "@/app/context/LanguageContext";

const C = {
  orange: "#FF5A1F",
  dim: "#3A3D58",
};

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="hidden sm:flex items-center f-mono text-xs" style={{ gap: "2px" }}>
      <button
        onClick={() => setLang("en")}
        className="px-1.5 py-0.5 transition-colors"
        style={{ color: lang === "en" ? C.orange : C.dim, fontWeight: lang === "en" ? 500 : 400 }}
      >
        EN
      </button>
      <span style={{ color: C.dim, opacity: 0.4 }}>/</span>
      <button
        onClick={() => setLang("fr")}
        className="px-1.5 py-0.5 transition-colors"
        style={{ color: lang === "fr" ? C.orange : C.dim, fontWeight: lang === "fr" ? 500 : 400 }}
      >
        FR
      </button>
    </div>
  );
}
