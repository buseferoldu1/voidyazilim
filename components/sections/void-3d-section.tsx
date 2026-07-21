"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

// 3D sahne yalnızca istemcide çalışır (WebGL). SSR kapalı; yüklenene kadar
// yumuşak bir parıltı gösterilir.
const Void3DObject = dynamic(() => import("./void-3d-object"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-violet-600/30 blur-3xl" />
    </div>
  ),
});

export default function Void3DSection() {
  return (
    <section id="uc-boyut" className="relative overflow-hidden bg-black py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-700/20 to-blue-700/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            İnteraktif 3D
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Ürünlerinizi Boyut Kazandırın
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            WebGL ile gerçek zamanlı 3D deneyimler tasarlıyoruz: 360° döndürülebilir
            ürünler, sinematik giriş sahneleri ve etkileşimli görseller. Ziyaretçinizi
            ekrana yapıştıran türden.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70">
            <MousePointer2 size={15} className="text-violet-300" />
            Objeyi sürükleyerek döndürün
          </p>
        </motion.div>

        {/* 3D tuval */}
        <div className="relative h-[360px] w-full sm:h-[440px]">
          <Void3DObject />
        </div>
      </div>
    </section>
  );
}
