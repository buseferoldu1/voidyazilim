"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/lib/void-content";

export default function References({ references }: { references: SiteContent["references"] }) {
  // Marka isim + linkleri (admin panelindeki "Projeler" alanindan gelir).
  const brands = references.projects.filter((p) => p.title);
  // Kesintisiz dongu icin listeyi iki kez basariz; ikinci kopya ekran
  // okuyuculardan gizlenir.
  const loop = brands.length ? brands : [{ title: "VOID", tag: "", gradient: "", href: undefined }];

  return (
    <section id="projeler" className="relative overflow-hidden bg-black py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            {references.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {references.title}
          </h2>
          <p className="mt-4 text-white/60">{references.subtitle}</p>
        </motion.div>
      </div>

      {/* Sagdan sola sonsuz kayan marka seridi */}
      <div
        className="relative mt-16 flex overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          className="flex shrink-0 items-center gap-14 pr-14"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: Math.max(18, loop.length * 4),
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...loop, ...loop].map((brand, i) => (
            <span
              key={`${brand.title}-${i}`}
              aria-hidden={i >= loop.length}
              className="flex shrink-0 items-center gap-14"
            >
              {brand.href ? (
                <a
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={i >= loop.length ? -1 : 0}
                  className="whitespace-nowrap bg-gradient-to-r from-white/85 to-white/55 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent transition-all duration-300 hover:from-violet-300 hover:to-blue-300 sm:text-4xl"
                >
                  {brand.title}
                </a>
              ) : (
                <span className="whitespace-nowrap bg-gradient-to-r from-white/85 to-white/55 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {brand.title}
                </span>
              )}
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
