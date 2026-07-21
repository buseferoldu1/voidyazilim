"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Magnetic from "@/components/ui/magnetic";

const PLANS = [
  {
    name: "Başlangıç",
    price: "₺25.000",
    period: "'den başlayan",
    desc: "Kurumsal kimliğini dijitale taşımak isteyen markalar için.",
    features: [
      "Kurumsal web sitesi (5 sayfa)",
      "Mobil uyumlu responsive tasarım",
      "Temel SEO optimizasyonu",
      "İletişim formu entegrasyonu",
      "Google Analytics kurulumu",
      "SSL sertifikası & hız optimizasyonu",
      "1 ay ücretsiz destek",
    ],
    highlight: false,
  },
  {
    name: "Profesyonel",
    price: "₺50.000",
    period: "'den başlayan",
    desc: "Büyüyen işletmeler için e-ticaret ve özel çözümler.",
    features: [
      "Başlangıç paketindeki her şey",
      "Özel tasarım web / e-ticaret",
      "İnteraktif 3D ürün & web deneyimleri",
      "Ödeme & kargo entegrasyonları",
      "Yönetim paneli (CMS)",
      "Gelişmiş SEO, analitik & animasyonlar",
      "3 ay öncelikli destek",
    ],
    highlight: true,
  },
  {
    name: "Kurumsal",
    price: "Özel",
    period: "teklif",
    desc: "Uçtan uca özel yazılım ve yapay zeka projeleri.",
    features: [
      "Profesyonel paketteki her şey",
      "Özel yazılım / SaaS geliştirme",
      "Yapay zeka & otomasyon sistemleri",
      "API & üçüncü parti entegrasyonlar",
      "Ölçeklenebilir bulut altyapısı",
      "Adanmış proje ekibi",
      "7/24 SLA destek",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="fiyatlandirma" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Fiyatlandırma
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Projenize Uygun Paket
          </h2>
          <p className="mt-4 text-white/60">
            Şeffaf başlangıç bütçeleri; kapsam netleştikçe size özel teklif
            hazırlarız.
          </p>
        </motion.div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                p.highlight
                  ? "border-violet-500/50 bg-gradient-to-b from-violet-600/15 to-blue-600/5 shadow-[0_0_60px_-20px_rgba(139,92,246,0.8)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-1 text-xs font-semibold text-white">
                  En Popüler
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-2 min-h-[40px] text-sm text-white/55">
                {p.desc}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">
                  {p.price}
                </span>
                <span className="text-sm text-white/50">{p.period}</span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                    <Check
                      size={18}
                      className={
                        p.highlight ? "text-violet-300" : "text-blue-300"
                      }
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Magnetic strength={0.25} className="mt-8 w-full">
                <a
                  href="#iletisim"
                  className={`block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] ${
                    p.highlight
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_28px_-8px_rgba(139,92,246,0.9)]"
                      : "border border-white/15 bg-white/5 text-white hover:border-violet-400/50"
                  }`}
                >
                  Teklif Al
                </a>
              </Magnetic>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
