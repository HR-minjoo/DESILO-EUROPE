import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "fr";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangContextType>({ lang: "en", setLang: () => {} });

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      {children}
    </LangCtx.Provider>
  );
}
