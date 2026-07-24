"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/lib/void-content";

export default function References({ references }: { references: SiteContent["references"] }) {
  const PROJECTS = references.projects;
  return (
    <section id="projeler" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            {references.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {references.title}
          </h2>
          <p className="mt-4 text-white/60">
            {references.subtitle}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative h-72 overflow-hidden rounded-3xl border border-white/10"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${p.gradient} blur-2xl scale-110 transition-all duration-700 group-hover:blur-0 group-hover:scale-100`}
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/10" />
              <div className="relative flex h-full flex-col justify-end p-8 transition-transform duration-700 group-hover:-translate-y-1">
                <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                  {p.tag}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white drop-shadow">
                  {p.title}
                </h3>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 transition group-hover:shadow-[0_30px_80px_-20px_rgba(139,92,246,0.6)]" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
