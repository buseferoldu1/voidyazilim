"use client";

import { motion } from "framer-motion";

const TECH = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Tailwind CSS",
  "Framer Motion",
  "React Native",
  "OpenAI",
  "Vercel",
  "AWS",
  "Docker",
  "GraphQL",
  "Stripe",
  "Redis",
];

export default function TechStack() {
  // Kesintisiz kayma icin liste iki kez basilir.
  const doubled = [...TECH, ...TECH];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-black py-14">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/40"
      >
        Kullandığımız Teknolojiler
      </motion.p>

      <div className="relative">
        {/* Kenar solma maskeleri */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />

        <div className="flex w-max void-marquee-track gap-4">
          {doubled.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
