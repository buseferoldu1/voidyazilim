"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { SiteContent } from "@/lib/void-content";

function Counter({
  value,
  prefix = "",
  suffix = "",
  play,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  play: boolean;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!play) return;
    let raf = 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, value]);

  return (
    <span>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export default function Stats({ stats }: { stats: SiteContent["stats"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const STATS = stats.items;

  return (
    <section className="relative border-y border-white/10 bg-black py-20">
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
              <Counter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                play={inView}
              />
            </div>
            <div className="mt-2 text-sm text-white/60">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
