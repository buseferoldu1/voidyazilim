"use client";

import { Globe, AtSign, MessageCircle, Share2, Mail } from "lucide-react";

const COLS = [
  {
    title: "Hizmetler",
    links: [
      { label: "Kurumsal Web", href: "#hizmetler" },
      { label: "E-Ticaret", href: "#hizmetler" },
      { label: "Yapay Zeka", href: "#hizmetler" },
      { label: "Özel Yazılım", href: "#hizmetler" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "#hakkimizda" },
      { label: "Projeler", href: "#projeler" },
      { label: "Fiyatlandırma", href: "#fiyatlandirma" },
      { label: "SSS", href: "#sss" },
    ],
  },
  {
    title: "İletişim",
    links: [
      { label: "Teklif Al", href: "#iletisim" },
      { label: "merhaba@voidyazilim.com", href: "mailto:merhaba@voidyazilim.com" },
    ],
  },
];

const SOCIAL = [
  { icon: Globe, href: "#", label: "Web" },
  { icon: AtSign, href: "#", label: "LinkedIn" },
  { icon: MessageCircle, href: "#", label: "X" },
  { icon: Share2, href: "#", label: "Instagram" },
];

export default function VoidFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-xl font-extrabold tracking-[0.3em] text-white">
              VOID
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Fikirden ürüne, üründen markaya. Modern web, e-ticaret, yapay zeka
              ve özel yazılım geliştiren dijital ürün stüdyosu.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-violet-400/50 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {l.label.includes("@") && <Mail size={14} />}
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} VOID Yazılım. Tüm hakları saklıdır.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70">
              Gizlilik
            </a>
            <a href="#" className="hover:text-white/70">
              Şartlar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
