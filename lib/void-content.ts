import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";

/**
 * VOID Yazilim site icerigi icin tek kaynak.
 *
 * Site geneli tum duzenlenebilir metin/veri buradaki SiteContent tipinde
 * tutulur. Admin paneli bu icerigi okur/gunceller, landing sayfasi ise
 * server tarafinda okuyup section'lara prop olarak gecirir.
 *
 * Kalicilik (leads ile ayni desen):
 *  - DATABASE_URL varsa: `void_content` tablosunda tek satir (key='site').
 *  - Yoksa: data/void-content.json dosyasi (yerel gelistirme).
 *  - Her ikisi de yoksa: koddaki DEFAULT_CONTENT.
 *
 * Okuma her zaman DEFAULT_CONTENT ile derin birlestirilir; boylece yeni
 * alanlar eklendiginde eski kayitlar bozulmaz.
 */

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const CONTENT_FILE = path.join(process.cwd(), "data", "void-content.json");
const CONTENT_KEY = "site";

// ---------------------------------------------------------------------------
// Tipler
// ---------------------------------------------------------------------------

export interface ServiceItem {
  icon: string; // ICON_MAP anahtari (globe | cart | ai | code ...)
  title: string;
  desc: string;
}

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  highlight: boolean;
}

export interface ProjectItem {
  title: string;
  tag: string;
  gradient: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SocialItem {
  icon: string; // web | linkedin | x | instagram
  href: string;
  label: string;
}

export interface SiteContent {
  brand: { name: string; tagline: string };
  hero: {
    badge: string;
    heading: string;
    subtitle: string;
    words: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  stats: { items: StatItem[] };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    plans: PricingPlan[];
  };
  references: {
    eyebrow: string;
    title: string;
    subtitle: string;
    projects: ProjectItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: TestimonialItem[];
  };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    address: string;
  };
  footer: { about: string; social: SocialItem[] };
  settings: {
    whatsappPhone: string;
    whatsappMessage: string;
  };
}

// ---------------------------------------------------------------------------
// Varsayilan icerik (mevcut siteyle birebir ayni)
// ---------------------------------------------------------------------------

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "VOID Yazılım",
    tagline: "Fikirden Ürüne, Üründen Markaya",
  },
  hero: {
    badge: "🚀 Dijital Ürün Geliştirme Stüdyosu",
    heading: "Markanızı Dijitalde Rakiplerinizden Ayırın",
    subtitle:
      "Kurumsal web siteleri, e-ticaret altyapıları, özel yazılım çözümleri ve yapay zeka sistemleri geliştiriyoruz.",
    words: ["VOID", "YAZILIM", "WEB", "ECOMMERCE", "AI", "MOBILE", "AUTOMATION"],
    ctaPrimary: "Proje Başlat",
    ctaSecondary: "Teklif Al",
  },
  services: {
    eyebrow: "Hizmetler",
    title: "Fikirden Ürüne, Üründen Markaya",
    subtitle:
      "Modern web siteleri, e-ticaret sistemleri, yapay zeka çözümleri ve özel yazılım projeleri geliştiriyoruz.",
    items: [
      {
        icon: "globe",
        title: "Kurumsal Web Siteleri",
        desc: "Hızlı, SEO uyumlu ve markanızı yansıtan modern kurumsal web deneyimleri.",
      },
      {
        icon: "cart",
        title: "E-Ticaret Sistemleri",
        desc: "Ölçeklenebilir, güvenli ve dönüşüm odaklı e-ticaret altyapıları.",
      },
      {
        icon: "ai",
        title: "Yapay Zeka Çözümleri",
        desc: "LLM entegrasyonları, akıllı asistanlar ve süreçleri otomatikleştiren AI sistemleri.",
      },
      {
        icon: "code",
        title: "Özel Yazılım Geliştirme",
        desc: "İş süreçlerinize özel, uçtan uca tasarlanmış yazılım projeleri.",
      },
    ],
  },
  stats: {
    items: [
      { value: 1250, suffix: "+", label: "Tamamlanan Proje" },
      { value: 1080, suffix: "+", label: "Mutlu Müşteri" },
      { value: 91, prefix: "%", label: "Memnuniyet" },
      { value: 7, suffix: "/24", label: "Destek" },
    ],
  },
  pricing: {
    eyebrow: "Fiyatlandırma",
    title: "Projenize Uygun Paket",
    subtitle:
      "Şeffaf başlangıç bütçeleri; kapsam netleştikçe size özel teklif hazırlarız.",
    plans: [
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
    ],
  },
  references: {
    eyebrow: "Referanslar",
    title: "Referanslarımız",
    subtitle: "Dünya standartlarında premium markalar seviyesinde deneyimler.",
    projects: [
      { title: "Apple", tag: "Marka", gradient: "from-violet-600/40 to-fuchsia-600/30" },
      { title: "Tesla", tag: "Marka", gradient: "from-blue-600/40 to-cyan-600/30" },
      { title: "Spotify", tag: "Marka", gradient: "from-indigo-600/40 to-violet-600/30" },
      { title: "Nike", tag: "Marka", gradient: "from-sky-600/40 to-blue-600/30" },
      { title: "Airbnb", tag: "Marka", gradient: "from-violet-600/40 to-fuchsia-600/30" },
      { title: "Netflix", tag: "Marka", gradient: "from-blue-600/40 to-cyan-600/30" },
      { title: "Mercedes-Benz", tag: "Marka", gradient: "from-indigo-600/40 to-violet-600/30" },
      { title: "Porsche", tag: "Marka", gradient: "from-sky-600/40 to-blue-600/30" },
      { title: "Samsung", tag: "Marka", gradient: "from-violet-600/40 to-fuchsia-600/30" },
      { title: "Adobe", tag: "Marka", gradient: "from-blue-600/40 to-cyan-600/30" },
    ],
  },
  testimonials: {
    eyebrow: "Referanslar",
    title: "Müşterilerimiz Ne Diyor?",
    items: [
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
    ],
  },
  faq: {
    eyebrow: "SSS",
    title: "Sıkça Sorulan Sorular",
    items: [
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
    ],
  },
  contact: {
    eyebrow: "İletişim",
    title: "Bir Sonraki Büyük Projenizi Birlikte İnşa Edelim",
    subtitle:
      "Formu doldurun; 24 saat içinde size özel bir yol haritası ve teklifle dönüş yapalım.",
    email: "merhaba@voidyazilim.com",
    phone: "+90 553 929 47 13",
    address: "Maslak, İstanbul",
  },
  footer: {
    about:
      "Fikirden ürüne, üründen markaya. Modern web, e-ticaret, yapay zeka ve özel yazılım geliştiren dijital ürün stüdyosu.",
    social: [
      { icon: "web", href: "#", label: "Web" },
      { icon: "linkedin", href: "#", label: "LinkedIn" },
      { icon: "x", href: "#", label: "X" },
      { icon: "instagram", href: "#", label: "Instagram" },
    ],
  },
  settings: {
    whatsappPhone: "905539294713",
    whatsappMessage:
      "Merhaba, VOID Yazılım'dan bir proje için bilgi almak istiyorum.",
  },
};

// ---------------------------------------------------------------------------
// Derin birlestirme (stored -> defaults uzerine)
// ---------------------------------------------------------------------------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Diziler tamamen degistirilir; nesneler alan alan birlestirilir. */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const b = (base as Record<string, unknown>)[key];
    const o = override[key];
    out[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o;
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// Kalicilik
// ---------------------------------------------------------------------------

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady || !DATABASE_URL) return;
  const sql = neon(DATABASE_URL);
  await sql`
    CREATE TABLE IF NOT EXISTS void_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  schemaReady = true;
}

async function readFromDatabase(): Promise<Partial<SiteContent> | null> {
  if (!DATABASE_URL) return null;
  try {
    const sql = neon(DATABASE_URL);
    await ensureSchema();
    const rows = (await sql`
      SELECT value FROM void_content WHERE key = ${CONTENT_KEY} LIMIT 1
    `) as { value: unknown }[];
    if (rows.length === 0) return null;
    return rows[0].value as Partial<SiteContent>;
  } catch (err) {
    console.error("[VOID] Icerik DB okuma hatasi:", err);
    return null;
  }
}

async function writeToDatabase(content: SiteContent): Promise<boolean> {
  if (!DATABASE_URL) return false;
  try {
    const sql = neon(DATABASE_URL);
    await ensureSchema();
    await sql`
      INSERT INTO void_content (key, value, updated_at)
      VALUES (${CONTENT_KEY}, ${JSON.stringify(content)}, now())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `;
    return true;
  } catch (err) {
    console.error("[VOID] Icerik DB yazma hatasi:", err);
    return false;
  }
}

async function readFromFile(): Promise<Partial<SiteContent> | null> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return JSON.parse(raw) as Partial<SiteContent>;
  } catch {
    return null;
  }
}

async function writeToFile(content: SiteContent): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[VOID] Icerik dosya yazma hatasi:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Genel API
// ---------------------------------------------------------------------------

/** Yayindaki site icerigini doner (stored + defaults birlesimi). */
export async function getSiteContent(): Promise<SiteContent> {
  const stored = (await readFromDatabase()) ?? (await readFromFile());
  if (!stored) return DEFAULT_CONTENT;
  return deepMerge(DEFAULT_CONTENT, stored);
}

/** Tam icerigi kalici hale getirir. Kullanilan yontemi doner. */
export async function saveSiteContent(
  content: SiteContent
): Promise<"db" | "file" | "none"> {
  if (await writeToDatabase(content)) return "db";
  if (await writeToFile(content)) return "file";
  return "none";
}
