"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "VOID ekibi fikrimizi sadece koda değil, gerçek bir markaya dönüştürdü. Dönüşüm oranımız üç ayda %40 arttı.",
    name: "Elif Yıldırım",
    role: "Kurucu, Nova Commerce",
    initials: "EY",
  },
  {
    quote:
      "Yapay zeka destekli müşteri asistanı sayesinde destek yükümüz yarıya indi. Süreç baştan sona kusursuzdu.",
    name: "Mert Kaya",
    role: "CTO, Lumen AI",
    initials: "MK",
  },
  {
    quote:
      "Kurumsal sitemiz artık rakiplerimizden çok daha profesyonel görünüyor. Detaylara gösterdikleri özen etkileyici.",
    name: "Zeynep Demir",
    role: "Pazarlama Direktörü, Atlas",
    initials: "ZD",
  },
  {
    quote:
      "Teslimat zamanında, iletişim şeffaf, sonuç beklentimizin üzerindeydi. Bir sonraki projede yine birlikte çalışacağız.",
    name: "Can Öztürk",
    role: "Genel Müdür, Pulse",
    initials: "CÖ",
  },
];

export default function VoidTestimonials() {
  return (
    <section id="yorumlar" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Referanslar
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-violet-400/30"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={16}
                    className="fill-violet-400 text-violet-400"
                  />
                ))}
              </div>
              <blockquote className="text-lg leading-relaxed text-white/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">
                  {t.initials}
                </span>
                <span>
                  <span className="block font-semibold text-white">
                    {t.name}
                  </span>
                  <span className="block text-sm text-white/50">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
