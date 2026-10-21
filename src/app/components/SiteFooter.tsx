import React from "react";
import { Linkedin } from "lucide-react";
import { useLang } from "@/app/context/LanguageContext";
import { T } from "@/app/data/translations";

// Shared site footer — used on every page so the footer is identical across menus.
const C = {
  bg: "#020706",
  accent: "#22C48C",
  offWhite: "#F2EEE8",
  border: "rgba(255,255,255,0.07)",
  body: "rgba(242,238,232,0.68)",
  link: "rgba(242,238,232,0.88)",
  fine: "rgba(242,238,232,0.55)",
};

const CONTACT_FORM = {
  en: "https://walla.my/survey/Z5EK7K3Kx5ukoOeZtzO0",
  fr: "https://walla.my/v/IRvaXDzwyjpQ80jCRtSV",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm transition-colors"
      style={{ color: C.link }}
      onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
      onMouseLeave={e => (e.currentTarget.style.color = C.link)}>
      {children}
    </a>
  );
}

export function SiteFooter() {
  const { lang } = useLang();
  const f = T[lang].footer;
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, position: "relative", zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="f-display font-semibold text-sm" style={{ color: C.offWhite }}>DESILO</span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(34,196,140,0.15)", color: C.accent }}>Europe</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.body }}>
              DESILO Europe S.à r.l.<br />
              9 Rue du Laboratoire, 1911 Gare Luxembourg
            </p>
            <p className="text-sm leading-relaxed mt-4" style={{ color: C.body }}>
              DESILO KOREA<br />
              138, Seoun-ro, Seocho-gu, Seoul, Republic of Korea
            </p>
          </div>
          <div>
            <p className="text-xs f-mono tracking-[0.15em] uppercase mb-3" style={{ color: C.accent }}>{f.contact}</p>
            <FooterLink href={CONTACT_FORM[lang === "fr" ? "fr" : "en"]}>contact@luxdesilo.ai</FooterLink>
          </div>
          <div>
            <p className="text-xs f-mono tracking-[0.15em] uppercase mb-3" style={{ color: C.accent }}>{f.follow}</p>
            <div className="flex flex-col gap-2">
              <FooterLink href="https://www.linkedin.com/company/desilo-europe/"><Linkedin size={13} /> LinkedIn DESILO EUROPE</FooterLink>
              <FooterLink href="https://www.linkedin.com/company/desilo/"><Linkedin size={13} /> LinkedIn DESILO KOREA</FooterLink>
              <FooterLink href="https://desilo.ai">DESILO KOREA</FooterLink>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-xs" style={{ color: C.fine }}>{f.rights}</p>
          <a href="#" className="text-xs transition-colors" style={{ color: C.fine }}
            onMouseEnter={e => (e.currentTarget.style.color = C.offWhite)}
            onMouseLeave={e => (e.currentTarget.style.color = C.fine)}>
            {f.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
