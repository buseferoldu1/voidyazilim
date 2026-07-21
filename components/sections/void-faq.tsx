"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Bir proje ne kadar sürede tamamlanır?",
    a: "Kapsamına göre değişmekle birlikte kurumsal web siteleri genellikle 3-5 hafta, e-ticaret ve özel yazılım projeleri 6-12 hafta arasında teslim edilir. İlk görüşmede size net bir zaman çizelgesi sunarız.",
  },
  {
    q: "Süreç nasıl ilerliyor?",
    a: "Analiz, tasarım, geliştirme ve yayınlama olmak üzere dört aşamalı, şeffaf bir süreç izliyoruz. Her aşamada düzenli demolar ve geri bildirim döngüleriyle sizi sürece dahil ediyoruz.",
  },
  {
    q: "Yayın sonrası destek veriyor musunuz?",
    a: "Evet. Tüm paketlerimizde ücretsiz destek süresi bulunur; ayrıca bakım, güncelleme ve büyüme odaklı sürekli iş birliği paketleri sunuyoruz.",
  },
  {
    q: "Mevcut sistemimizle entegrasyon mümkün mü?",
    a: "Kesinlikle. ERP, CRM, ödeme sistemleri ve üçüncü parti API'ler dahil mevcut altyapınızla sorunsuz entegrasyon sağlıyoruz.",
  },
  {
    q: "Yapay zeka çözümleri neleri kapsıyor?",
    a: "Akıllı müşteri asistanları, içerik ve süreç otomasyonu, öneri sistemleri ve LLM tabanlı özel entegrasyonlar geliştiriyoruz; ihtiyacınıza göre özelleştiriyoruz.",
  },
];

export default function VoidFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="sss" className="relative bg-black py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            SSS
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Sıkça Sorulan Sorular
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-white">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-violet-300"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-white/60">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
