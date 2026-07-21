"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Rocket, CheckCircle2 } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Analiz", desc: "İhtiyaçları ve hedefleri birlikte netleştiriyoruz." },
  { icon: PenTool, title: "Tasarım", desc: "Marka kimliğinize uygun premium arayüzler kurguluyoruz." },
  { icon: Rocket, title: "Geliştirme", desc: "Modern, ölçeklenebilir ve performanslı kod yazıyoruz." },
  { icon: CheckCircle2, title: "Yayınlama", desc: "Test edip yayına alıyor, sürekli destek veriyoruz." },
];

export default function Process() {
  return (
    <section id="hakkimizda" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Süreç
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Nasıl Çalışıyoruz?
          </h2>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-4">
          {/* Baglanti cizgisi */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black text-violet-300 shadow-[0_0_30px_-10px_rgba(139,92,246,0.8)]">
                  <Icon size={26} />
                </div>
                <div className="mt-2 text-xs font-semibold text-white/40">
                  0{i + 1}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/60">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
