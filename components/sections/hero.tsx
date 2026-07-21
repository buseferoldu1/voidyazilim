"use client";

import { useCallback, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ParticleTextEffect from "@/components/ui/particle-text-effect";
import Magnetic from "@/components/ui/magnetic";

const WORDS = [
  "VOID",
  "YAZILIM",
  "WEB",
  "ECOMMERCE",
  "AI",
  "MOBILE",
  "AUTOMATION",
];

const HEADING = "Markanızı Dijitalde Rakiplerinizden Ayırın";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Mouse'a gore blur isiklarin hafif parallax hareketi.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 60, damping: 20, mass: 0.6 };
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const purpleX = useTransform(sx, (v) => v * 40);
  const purpleY = useTransform(sy, (v) => v * 40);
  const blueX = useTransform(sx, (v) => v * -55);
  const blueY = useTransform(sy, (v) => v * -30);

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );

  // Baslik: harf harf reveal (fade + blur).
  const letters = useMemo(() => HEADING.split(""), []);

  return (
    <section
      id="top"
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* Arka plan blur isiklari */}
      <motion.div
        aria-hidden
        style={{ x: purpleX, y: purpleY }}
        className="pointer-events-none absolute -left-32 top-10 h-[38rem] w-[38rem] rounded-full bg-violet-600/30 blur-[140px]"
      />
      <motion.div
        aria-hidden
        style={{ x: blueX, y: blueY }}
        className="pointer-events-none absolute -right-32 bottom-0 h-[36rem] w-[36rem] rounded-full bg-blue-600/30 blur-[140px]"
      />

      {/* Particle text efekti tum ekrani kaplar */}
      <div className="absolute inset-0">
        <ParticleTextEffect words={WORDS} interval={5000} density={4} />
      </div>

      {/* Merkezdeki overlay icerik icin okunabilirlik gradyani */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />

      {/* Overlay icerik */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md"
        >
          <Sparkles size={14} className="text-violet-300" />
          🚀 Dijital Ürün Geliştirme Stüdyosu
        </motion.span>

        <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
          {letters.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              initial={{ opacity: 0, filter: "blur(12px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                delay: 0.35 + i * 0.028,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block whitespace-pre"
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-6 max-w-2xl text-pretty text-base text-white/70 sm:text-lg"
        >
          Kurumsal web siteleri, e-ticaret altyapıları, özel yazılım çözümleri
          ve yapay zeka sistemleri geliştiriyoruz.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic strength={0.4}>
            <a
              href="#iletisim"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(139,92,246,0.8)] transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_44px_-4px_rgba(139,92,246,1)]"
            >
              Proje Başlat
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </Magnetic>

          <Magnetic strength={0.4}>
            <a
              href="#projeler"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-blue-400/60 hover:shadow-[0_0_28px_-6px_rgba(59,130,246,0.8)]"
            >
              Teklif Al
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Alt scroll ipucu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1 rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </section>
  );
}
