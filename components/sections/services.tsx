"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Globe, ShoppingCart, BrainCircuit, Code2 } from "lucide-react";

const SERVICES = [
  {
    icon: Globe,
    title: "Kurumsal Web Siteleri",
    desc: "Hızlı, SEO uyumlu ve markanızı yansıtan modern kurumsal web deneyimleri.",
  },
  {
    icon: ShoppingCart,
    title: "E-Ticaret Sistemleri",
    desc: "Ölçeklenebilir, güvenli ve dönüşüm odaklı e-ticaret altyapıları.",
  },
  {
    icon: BrainCircuit,
    title: "Yapay Zeka Çözümleri",
    desc: "LLM entegrasyonları, akıllı asistanlar ve süreçleri otomatikleştiren AI sistemleri.",
  },
  {
    icon: Code2,
    title: "Özel Yazılım Geliştirme",
    desc: "İş süreçlerinize özel, uçtan uca tasarlanmış yazılım projeleri.",
  },
];

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(py * -12);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="[perspective:1000px]"
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="hizmetler" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Hizmetler
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Fikirden Ürüne, Üründen Markaya
          </h2>
          <p className="mt-4 text-white/60">
            Modern web siteleri, e-ticaret sistemleri, yapay zeka çözümleri ve
            özel yazılım projeleri geliştiriyoruz.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <TiltCard>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-violet-400/40">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="mb-5 inline-flex rounded-xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-blue-600/20 p-3 text-violet-300">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {s.desc}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
