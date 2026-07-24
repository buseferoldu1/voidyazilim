"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Magnetic from "@/components/ui/magnetic";
import type { SiteContent } from "@/lib/void-content";

type Status = "idle" | "loading" | "success" | "error";

const BUDGETS = [
  "₺45.000 - ₺100.000",
  "₺100.000 - ₺250.000",
  "₺250.000 - ₺500.000",
  "₺500.000+",
  "Emin değilim",
];

export default function ContactSection({ contact }: { contact: SiteContent["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setServerMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      budget: fd.get("budget"),
      message: fd.get("message"),
      website: fd.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/void/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setServerMsg(data.message ?? "Mesajınız alındı.");
        form.reset();
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus("error");
      } else {
        setServerMsg(data.error ?? "Bir hata oluştu. Lütfen tekrar deneyin.");
        setStatus("error");
      }
    } catch {
      setServerMsg("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  }

  return (
    <section id="iletisim" className="relative overflow-hidden bg-black py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-700/25 to-blue-700/25 blur-[130px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
        {/* Sol: CTA metni + iletisim bilgileri */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            {contact.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-5 max-w-md text-white/60">
            {contact.subtitle}
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-center gap-4 text-white/75">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-violet-300">
                <Mail size={18} />
              </span>
              {contact.email}
            </li>
            <li className="flex items-center gap-4 text-white/75">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-blue-300">
                <Phone size={18} />
              </span>
              {contact.phone}
            </li>
            <li className="flex items-center gap-4 text-white/75">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-fuchsia-300">
                <MapPin size={18} />
              </span>
              {contact.address}
            </li>
          </ul>
        </motion.div>

        {/* Sag: form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
        >
          {status === "success" ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={48} className="text-violet-400" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                Teşekkürler!
              </h3>
              <p className="mt-2 max-w-xs text-white/60">{serverMsg}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:border-violet-400/50"
              >
                Yeni mesaj gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Bal kupu: kullanicilar gormez, botlar doldurur. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <Field label="Ad Soyad" error={errors.name}>
                <input
                  name="name"
                  type="text"
                  placeholder="Adınız"
                  className="void-input"
                />
              </Field>

              <Field label="E-posta" error={errors.email}>
                <input
                  name="email"
                  type="email"
                  placeholder="ornek@sirket.com"
                  className="void-input"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Şirket (opsiyonel)">
                  <input
                    name="company"
                    type="text"
                    placeholder="Şirket adı"
                    className="void-input"
                  />
                </Field>
                <Field label="Bütçe">
                  <select name="budget" className="void-input" defaultValue="">
                    <option value="" disabled>
                      Seçiniz
                    </option>
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-neutral-900">
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Proje Detayı" error={errors.message}>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Projenizden kısaca bahsedin..."
                  className="void-input resize-none"
                />
              </Field>

              {status === "error" && serverMsg && (
                <p className="text-sm text-red-400">{serverMsg}</p>
              )}

              <Magnetic strength={0.2} className="w-full">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.9)] transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Mesajı Gönder
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </Magnetic>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
