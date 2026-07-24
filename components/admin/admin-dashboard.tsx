"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ExternalLink,
  Inbox,
  Loader2,
  LogOut,
  Plus,
  Save,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { SiteContent } from "@/lib/void-content";
import type { VoidLead } from "@/lib/void-leads";
import type { VoidOrder, OrderStatus } from "@/lib/void-orders";

type Props = {
  initialContent: SiteContent;
  initialLeads: VoidLead[];
  initialOrders: VoidOrder[];
};

type Section =
  | "brand"
  | "hero"
  | "services"
  | "stats"
  | "pricing"
  | "references"
  | "testimonials"
  | "faq"
  | "contact"
  | "footer"
  | "settings"
  | "leads"
  | "orders";

const NAV: { key: Section; label: string; group: string }[] = [
  { key: "brand", label: "Marka", group: "İçerik" },
  { key: "hero", label: "Hero (Üst Alan)", group: "İçerik" },
  { key: "services", label: "Hizmetler", group: "İçerik" },
  { key: "stats", label: "İstatistikler", group: "İçerik" },
  { key: "pricing", label: "Fiyatlandırma", group: "İçerik" },
  { key: "references", label: "Projeler", group: "İçerik" },
  { key: "testimonials", label: "Yorumlar", group: "İçerik" },
  { key: "faq", label: "SSS", group: "İçerik" },
  { key: "contact", label: "İletişim", group: "İçerik" },
  { key: "footer", label: "Footer", group: "İçerik" },
  { key: "settings", label: "Ayarlar", group: "İçerik" },
  { key: "leads", label: "Mesajlar", group: "Veri" },
  { key: "orders", label: "Siparişler", group: "Veri" },
];

const ICON_OPTIONS = ["globe", "cart", "ai", "code"];
const SOCIAL_OPTIONS = ["web", "linkedin", "x", "instagram"];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Bekliyor",
  paid: "Ödendi",
  cancelled: "İptal",
  refunded: "İade",
};

export default function AdminDashboard({
  initialContent,
  initialLeads,
  initialOrders,
}: Props) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [leads] = useState<VoidLead[]>(initialLeads);
  const [orders, setOrders] = useState<VoidOrder[]>(initialOrders);
  const [active, setActive] = useState<Section>("brand");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [error, setError] = useState("");

  /** Icerigi guvenli (immutable) sekilde gunceller. */
  const update = useCallback((mutator: (draft: SiteContent) => void) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      mutator(next);
      return next;
    });
    setSavedAt("");
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/void/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSavedAt(new Date().toLocaleTimeString("tr-TR"));
      } else {
        setError(data.error ?? "Kaydedilemedi.");
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/void/admin/logout", { method: "POST" });
    router.replace("/void-admin/login");
    router.refresh();
  }

  async function setOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/void/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  const grouped = useMemo(() => {
    const map = new Map<string, typeof NAV>();
    for (const item of NAV) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  const isData = active === "leads" || active === "orders";

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/40 p-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white">
            <Sparkles size={18} />
          </span>
          <span className="text-lg font-extrabold tracking-[0.2em]">VOID</span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {grouped.map(([group, items]) => (
            <div key={group}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-white/30">
                {group}
              </p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActive(item.key)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        active === item.key
                          ? "bg-gradient-to-r from-violet-600/30 to-blue-600/20 font-medium text-white ring-1 ring-violet-400/30"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={15} /> Siteyi Görüntüle
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={15} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-neutral-950/80 px-5 py-4 backdrop-blur-xl">
          {/* Mobil section secici */}
          <select
            value={active}
            onChange={(e) => setActive(e.target.value as Section)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm md:hidden"
          >
            {NAV.map((n) => (
              <option key={n.key} value={n.key} className="bg-neutral-900">
                {n.label}
              </option>
            ))}
          </select>
          <h1 className="hidden text-lg font-semibold md:block">
            {NAV.find((n) => n.key === active)?.label}
          </h1>

          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-400">{error}</span>}
            {savedAt && !isData && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <Check size={15} /> {savedAt}'de kaydedildi
              </span>
            )}
            {!isData && (
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold shadow-[0_0_24px_-8px_rgba(139,92,246,0.9)] transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Kaydet
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 p-5 md:p-8">
          {active === "brand" && <BrandEditor content={content} update={update} />}
          {active === "hero" && <HeroEditor content={content} update={update} />}
          {active === "services" && <ServicesEditor content={content} update={update} />}
          {active === "stats" && <StatsEditor content={content} update={update} />}
          {active === "pricing" && <PricingEditor content={content} update={update} />}
          {active === "references" && <ReferencesEditor content={content} update={update} />}
          {active === "testimonials" && <TestimonialsEditor content={content} update={update} />}
          {active === "faq" && <FaqEditor content={content} update={update} />}
          {active === "contact" && <ContactEditor content={content} update={update} />}
          {active === "footer" && <FooterEditor content={content} update={update} />}
          {active === "settings" && <SettingsEditor content={content} update={update} />}
          {active === "leads" && <LeadsView leads={leads} />}
          {active === "orders" && <OrdersView orders={orders} onStatus={setOrderStatus} />}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ortak alan bilesenleri
// ---------------------------------------------------------------------------

type EditorProps = {
  content: SiteContent;
  update: (mutator: (draft: SiteContent) => void) => void;
};

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-neutral-900">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Card({
  children,
  title,
  onRemove,
}: {
  children: React.ReactNode;
  title: string;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-white/80">{title}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-300/80 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 size={13} /> Sil
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-3 text-sm text-white/60 transition hover:border-violet-400/50 hover:text-white"
    >
      <Plus size={16} /> {label}
    </button>
  );
}

function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-white/50">{desc}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bolum editorleri
// ---------------------------------------------------------------------------

function BrandEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Marka" desc="Site geneli marka bilgileri." />
      <Text
        label="Marka Adı"
        value={content.brand.name}
        onChange={(v) => update((d) => (d.brand.name = v))}
      />
      <Text
        label="Slogan"
        value={content.brand.tagline}
        onChange={(v) => update((d) => (d.brand.tagline = v))}
      />
    </div>
  );
}

function HeroEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Hero (Üst Alan)" desc="Ana sayfanın en üst bölümü." />
      <Text label="Rozet" value={content.hero.badge} onChange={(v) => update((d) => (d.hero.badge = v))} />
      <Area label="Başlık" value={content.hero.heading} onChange={(v) => update((d) => (d.hero.heading = v))} />
      <Area label="Alt Metin" value={content.hero.subtitle} onChange={(v) => update((d) => (d.hero.subtitle = v))} />
      <Text
        label="Partikül Kelimeler (virgülle)"
        value={content.hero.words.join(", ")}
        onChange={(v) =>
          update((d) => (d.hero.words = v.split(",").map((s) => s.trim()).filter(Boolean)))
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Text label="Birincil Buton" value={content.hero.ctaPrimary} onChange={(v) => update((d) => (d.hero.ctaPrimary = v))} />
        <Text label="İkincil Buton" value={content.hero.ctaSecondary} onChange={(v) => update((d) => (d.hero.ctaSecondary = v))} />
      </div>
    </div>
  );
}

function ServicesEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Hizmetler" />
      <Text label="Üst Etiket" value={content.services.eyebrow} onChange={(v) => update((d) => (d.services.eyebrow = v))} />
      <Text label="Başlık" value={content.services.title} onChange={(v) => update((d) => (d.services.title = v))} />
      <Area label="Alt Metin" value={content.services.subtitle} onChange={(v) => update((d) => (d.services.subtitle = v))} />
      <div className="space-y-3 pt-2">
        {content.services.items.map((s, i) => (
          <Card key={i} title={`Hizmet ${i + 1}`} onRemove={() => update((d) => d.services.items.splice(i, 1))}>
            <Select label="İkon" value={s.icon} options={ICON_OPTIONS} onChange={(v) => update((d) => (d.services.items[i].icon = v))} />
            <Text label="Başlık" value={s.title} onChange={(v) => update((d) => (d.services.items[i].title = v))} />
            <Area label="Açıklama" value={s.desc} onChange={(v) => update((d) => (d.services.items[i].desc = v))} />
          </Card>
        ))}
        <AddButton label="Hizmet Ekle" onClick={() => update((d) => d.services.items.push({ icon: "globe", title: "Yeni Hizmet", desc: "" }))} />
      </div>
    </div>
  );
}

function StatsEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="İstatistikler" desc="Sayaçlı rakamlar bandı." />
      <div className="space-y-3">
        {content.stats.items.map((s, i) => (
          <Card key={i} title={`İstatistik ${i + 1}`} onRemove={() => update((d) => d.stats.items.splice(i, 1))}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Num label="Değer" value={s.value} onChange={(v) => update((d) => (d.stats.items[i].value = v))} />
              <Text label="Ön Ek" value={s.prefix ?? ""} onChange={(v) => update((d) => (d.stats.items[i].prefix = v))} />
              <Text label="Son Ek" value={s.suffix ?? ""} onChange={(v) => update((d) => (d.stats.items[i].suffix = v))} />
            </div>
            <Text label="Etiket" value={s.label} onChange={(v) => update((d) => (d.stats.items[i].label = v))} />
          </Card>
        ))}
        <AddButton label="İstatistik Ekle" onClick={() => update((d) => d.stats.items.push({ value: 0, suffix: "+", label: "Yeni" }))} />
      </div>
    </div>
  );
}

function PricingEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Fiyatlandırma" />
      <Text label="Üst Etiket" value={content.pricing.eyebrow} onChange={(v) => update((d) => (d.pricing.eyebrow = v))} />
      <Text label="Başlık" value={content.pricing.title} onChange={(v) => update((d) => (d.pricing.title = v))} />
      <Area label="Alt Metin" value={content.pricing.subtitle} onChange={(v) => update((d) => (d.pricing.subtitle = v))} />
      <div className="space-y-3 pt-2">
        {content.pricing.plans.map((p, i) => (
          <Card key={i} title={`Paket: ${p.name || i + 1}`} onRemove={() => update((d) => d.pricing.plans.splice(i, 1))}>
            <Text label="Ad" value={p.name} onChange={(v) => update((d) => (d.pricing.plans[i].name = v))} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Fiyat" value={p.price} onChange={(v) => update((d) => (d.pricing.plans[i].price = v))} />
              <Text label="Periyot" value={p.period} onChange={(v) => update((d) => (d.pricing.plans[i].period = v))} />
            </div>
            <Area label="Açıklama" value={p.desc} onChange={(v) => update((d) => (d.pricing.plans[i].desc = v))} />
            <Area
              label="Özellikler (her satır bir madde)"
              rows={7}
              value={p.features.join("\n")}
              onChange={(v) => update((d) => (d.pricing.plans[i].features = v.split("\n").map((s) => s.trim()).filter(Boolean)))}
            />
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={p.highlight}
                onChange={(e) => update((d) => (d.pricing.plans[i].highlight = e.target.checked))}
                className="h-4 w-4 accent-violet-500"
              />
              Öne çıkan paket (En Popüler rozeti)
            </label>
          </Card>
        ))}
        <AddButton
          label="Paket Ekle"
          onClick={() => update((d) => d.pricing.plans.push({ name: "Yeni Paket", price: "₺0", period: "", desc: "", features: [], highlight: false }))}
        />
      </div>
    </div>
  );
}

function ReferencesEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Projeler / Referanslar" />
      <Text label="Üst Etiket" value={content.references.eyebrow} onChange={(v) => update((d) => (d.references.eyebrow = v))} />
      <Text label="Başlık" value={content.references.title} onChange={(v) => update((d) => (d.references.title = v))} />
      <Area label="Alt Metin" value={content.references.subtitle} onChange={(v) => update((d) => (d.references.subtitle = v))} />
      <div className="space-y-3 pt-2">
        {content.references.projects.map((p, i) => (
          <Card key={i} title={`Proje ${i + 1}`} onRemove={() => update((d) => d.references.projects.splice(i, 1))}>
            <Text label="Başlık" value={p.title} onChange={(v) => update((d) => (d.references.projects[i].title = v))} />
            <Text label="Etiket" value={p.tag} onChange={(v) => update((d) => (d.references.projects[i].tag = v))} />
            <Text label="Gradyan (Tailwind)" value={p.gradient} onChange={(v) => update((d) => (d.references.projects[i].gradient = v))} />
          </Card>
        ))}
        <AddButton label="Proje Ekle" onClick={() => update((d) => d.references.projects.push({ title: "Yeni Proje", tag: "Web", gradient: "from-violet-600/40 to-blue-600/30" }))} />
      </div>
    </div>
  );
}

function TestimonialsEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Müşteri Yorumları" />
      <Text label="Üst Etiket" value={content.testimonials.eyebrow} onChange={(v) => update((d) => (d.testimonials.eyebrow = v))} />
      <Text label="Başlık" value={content.testimonials.title} onChange={(v) => update((d) => (d.testimonials.title = v))} />
      <div className="space-y-3 pt-2">
        {content.testimonials.items.map((t, i) => (
          <Card key={i} title={`Yorum ${i + 1}`} onRemove={() => update((d) => d.testimonials.items.splice(i, 1))}>
            <Area label="Yorum" value={t.quote} onChange={(v) => update((d) => (d.testimonials.items[i].quote = v))} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Text label="İsim" value={t.name} onChange={(v) => update((d) => (d.testimonials.items[i].name = v))} />
              <Text label="Rol" value={t.role} onChange={(v) => update((d) => (d.testimonials.items[i].role = v))} />
              <Text label="Baş Harfler" value={t.initials} onChange={(v) => update((d) => (d.testimonials.items[i].initials = v))} />
            </div>
          </Card>
        ))}
        <AddButton label="Yorum Ekle" onClick={() => update((d) => d.testimonials.items.push({ quote: "", name: "", role: "", initials: "" }))} />
      </div>
    </div>
  );
}

function FaqEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Sıkça Sorulan Sorular" />
      <Text label="Üst Etiket" value={content.faq.eyebrow} onChange={(v) => update((d) => (d.faq.eyebrow = v))} />
      <Text label="Başlık" value={content.faq.title} onChange={(v) => update((d) => (d.faq.title = v))} />
      <div className="space-y-3 pt-2">
        {content.faq.items.map((f, i) => (
          <Card key={i} title={`Soru ${i + 1}`} onRemove={() => update((d) => d.faq.items.splice(i, 1))}>
            <Text label="Soru" value={f.q} onChange={(v) => update((d) => (d.faq.items[i].q = v))} />
            <Area label="Cevap" value={f.a} onChange={(v) => update((d) => (d.faq.items[i].a = v))} />
          </Card>
        ))}
        <AddButton label="Soru Ekle" onClick={() => update((d) => d.faq.items.push({ q: "", a: "" }))} />
      </div>
    </div>
  );
}

function ContactEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="İletişim" />
      <Text label="Üst Etiket" value={content.contact.eyebrow} onChange={(v) => update((d) => (d.contact.eyebrow = v))} />
      <Area label="Başlık" value={content.contact.title} onChange={(v) => update((d) => (d.contact.title = v))} />
      <Area label="Alt Metin" value={content.contact.subtitle} onChange={(v) => update((d) => (d.contact.subtitle = v))} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Text label="E-posta" value={content.contact.email} onChange={(v) => update((d) => (d.contact.email = v))} />
        <Text label="Telefon" value={content.contact.phone} onChange={(v) => update((d) => (d.contact.phone = v))} />
        <Text label="Adres" value={content.contact.address} onChange={(v) => update((d) => (d.contact.address = v))} />
      </div>
    </div>
  );
}

function FooterEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Footer" />
      <Area label="Hakkında Metni" value={content.footer.about} onChange={(v) => update((d) => (d.footer.about = v))} />
      <div className="space-y-3 pt-2">
        {content.footer.social.map((s, i) => (
          <Card key={i} title={`Sosyal ${i + 1}`} onRemove={() => update((d) => d.footer.social.splice(i, 1))}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select label="İkon" value={s.icon} options={SOCIAL_OPTIONS} onChange={(v) => update((d) => (d.footer.social[i].icon = v))} />
              <Text label="Etiket" value={s.label} onChange={(v) => update((d) => (d.footer.social[i].label = v))} />
              <Text label="Bağlantı" value={s.href} onChange={(v) => update((d) => (d.footer.social[i].href = v))} />
            </div>
          </Card>
        ))}
        <AddButton label="Sosyal Bağlantı Ekle" onClick={() => update((d) => d.footer.social.push({ icon: "web", href: "#", label: "Yeni" }))} />
      </div>
    </div>
  );
}

function SettingsEditor({ content, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionHead title="Ayarlar" desc="WhatsApp ve genel ayarlar." />
      <Text
        label="WhatsApp Numarası (ör. 905551112233)"
        value={content.settings.whatsappPhone}
        onChange={(v) => update((d) => (d.settings.whatsappPhone = v))}
      />
      <Area
        label="WhatsApp Ön Mesajı"
        value={content.settings.whatsappMessage}
        onChange={(v) => update((d) => (d.settings.whatsappMessage = v))}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Veri gorunumleri
// ---------------------------------------------------------------------------

function LeadsView({ leads }: { leads: VoidLead[] }) {
  if (leads.length === 0) {
    return (
      <Empty icon={<Inbox size={40} />} title="Henüz mesaj yok" desc="İletişim formundan gelen başvurular burada listelenir." />
    );
  }
  return (
    <div className="space-y-4">
      <SectionHead title={`Mesajlar (${leads.length})`} desc="İletişim formu başvuruları." />
      <div className="space-y-3">
        {leads.map((l, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-white">{l.name}</span>
              <span className="text-xs text-white/40">
                {new Date(l.receivedAt).toLocaleString("tr-TR")}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
              <a href={`mailto:${l.email}`} className="hover:text-violet-300">{l.email}</a>
              {l.company && l.company !== "-" && <span>{l.company}</span>}
              {l.budget && l.budget !== "-" && <span className="text-emerald-400/80">{l.budget}</span>}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/75">{l.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersView({
  orders,
  onStatus,
}: {
  orders: VoidOrder[];
  onStatus: (id: string, status: OrderStatus) => void;
}) {
  if (orders.length === 0) {
    return (
      <Empty
        icon={<ShoppingBag size={40} />}
        title="Henüz sipariş yok"
        desc="Ödeme talepleri burada listelenecek. iyzico entegrasyonu sonrası tahsilatlar otomatik güncellenir."
      />
    );
  }
  return (
    <div className="space-y-4">
      <SectionHead title={`Siparişler (${orders.length})`} desc="Ödeme talepleri ve durumları." />
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-white">{o.plan}</span>
              <span className="text-lg font-bold text-emerald-400">
                {o.amount.toLocaleString("tr-TR")} {o.currency}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
              <span>{o.customerName}</span>
              <a href={`mailto:${o.customerEmail}`} className="hover:text-violet-300">{o.customerEmail}</a>
              {o.customerPhone && <span>{o.customerPhone}</span>}
              <span className="text-white/30">{new Date(o.createdAt).toLocaleString("tr-TR")}</span>
            </div>
            {o.note && <p className="mt-2 text-sm text-white/70">{o.note}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onStatus(o.id, st)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    o.status === st
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                      : "border border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {STATUS_LABELS[st]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 text-center">
      <span className="text-white/25">{icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-white/80">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-white/40">{desc}</p>
    </div>
  );
}
