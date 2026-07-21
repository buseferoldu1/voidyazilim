/**
 * VOID Yazılım dijital asistanı — kural tabanlı niyet eşleyici.
 *
 * NOT: Bu harici bir dil modeli DEĞİLDİR. Bir LLM API anahtarı, ek maliyet
 * ve gizlilik derdi olmadan; sitenin kendi bilgisi (hizmetler, paketler,
 * fiyatlar, süreç, teknolojiler, iletişim) üzerinde çalışan akıllı bir
 * niyet eşleyicidir. Bilmediği şeyde uydurmaz, insana / iletişim formuna
 * yönlendirir. Gerçek bir LLM istenirse cevap üretimi sunucuda bir
 * sağlayıcıya (örn. Claude API) taşınır; buradaki bilgi özeti sistem
 * promptu olarak verilir.
 */

export interface VoidReply {
  text: string;
  /** Kullanıcıya önerilecek hızlı yanıtlar */
  suggestions?: string[];
  /** Opsiyonel eylem: bir bölüme kaydır / iletişime yönlendir */
  action?: { label: string; href: string };
}

/** Türkçe'yi sadeleştir: küçük harf + aksan/özel harf normalizasyonu. */
const norm = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();

const has = (m: string, ...k: string[]) => k.some((x) => m.includes(norm(x)));

/** Mesajdaki bütçe ipucunu yakala: "50 bin", "250.000", "100000 tl" */
function butceBul(m: string): number | null {
  const bin = /(\d+(?:[.,]\d+)?)\s*bin/.exec(m);
  if (bin) return Math.round(parseFloat(bin[1].replace(",", ".")) * 1000);
  const temiz = m.replace(/[.\s]/g, (c) => (c === "." ? "" : " "));
  const sayilar = temiz.match(/\d{4,7}/g);
  if (!sayilar) return null;
  return Math.max(...sayilar.map(Number));
}

const GREETING_SUG = [
  "Fiyatlar nasıl?",
  "Hangi hizmetleri veriyorsunuz?",
  "Proje ne kadar sürede biter?",
];

export function voidCevap(soru: string): VoidReply {
  const m = norm(soru);

  if (!m) {
    return {
      text: "Bir şeyler yazın; hizmetler, fiyatlar, süreç ya da projeleriniz hakkında yardımcı olayım.",
      suggestions: GREETING_SUG,
    };
  }

  /* ---------------- Selamlama ---------------- */
  if (has(m, "merhaba", "selam", "iyi gunler", "gunaydin", "hey", "hello", "sa", "nasilsin")) {
    return {
      text: "Merhaba! 👋 Ben VOID'in dijital asistanıyım. Web sitesi, e-ticaret, yapay zeka veya özel yazılım projeniz için buradayım. Ne yapmak istediğinizi anlatın, size en doğru yolu önereyim.",
      suggestions: GREETING_SUG,
    };
  }

  /* ---------------- Teşekkür / veda ---------------- */
  if (has(m, "tesekkur", "sagol", "sag ol", "eyvallah", "gorusuruz", "hosca kal")) {
    return {
      text: "Rica ederim! 🙌 Aklınıza bir soru takılırsa buradayım. Hazır olduğunuzda ‘Proje Başlat’ diyerek ücretsiz bir görüşme planlayabilirsiniz.",
      action: { label: "Proje Başlat", href: "#iletisim" },
    };
  }

  /* ---------------- Fiyat / paket (bütçeye göre öneri) ---------------- */
  const butce = butceBul(m);
  if (
    has(m, "fiyat", "ucret", "kac para", "ne kadar", "maliyet", "paket", "butce", "tutar") ||
    (butce !== null && has(m, "tl", "lira", "butcem", "param"))
  ) {
    if (butce !== null) {
      if (butce < 25000) {
        return {
          text: `${butce.toLocaleString("tr")} ₺ bütçe, kurumsal bir web projesi için başlangıç seviyemizin (₺25.000) biraz altında kalıyor. Kapsamı sadeleştirerek yine de bir yol bulabiliriz — en doğrusu ihtiyacı birlikte netleştirmek. Ücretsiz görüşmede size şeffaf bir teklif çıkarırız.`,
          action: { label: "Ücretsiz Görüşme", href: "#iletisim" },
          suggestions: ["Başlangıç pakette neler var?", "Fiyatları göster"],
        };
      }
      if (butce < 50000) {
        return {
          text: `${butce.toLocaleString("tr")} ₺ bütçe **Başlangıç** paketimize (₺25.000'den başlar) çok uygun: kurumsal 5 sayfalık site, responsive tasarım, temel SEO, iletişim formu, analytics ve hız optimizasyonu dahil. E-ticaret gerekiyorsa Profesyonel'e (₺50.000) yükseltebiliriz.`,
          action: { label: "Fiyatları Gör", href: "#fiyatlandirma" },
          suggestions: ["Profesyonel farkı ne?", "E-ticaret istiyorum"],
        };
      }
      return {
        text: `${butce.toLocaleString("tr")} ₺ bütçeyle **Profesyonel** paket (₺50.000'den başlar) rahatça mümkün: özel tasarım e-ticaret, interaktif 3D deneyimler, ödeme/kargo entegrasyonları, yönetim paneli ve gelişmiş SEO dahil. Daha kapsamlı özel yazılım/AI için Kurumsal özel teklif hazırlarız.`,
        action: { label: "Fiyatları Gör", href: "#fiyatlandirma" },
        suggestions: ["Profesyonel pakette neler var?", "Kurumsal ne sunuyor?"],
      };
    }
    return {
      text: "Üç paketimiz var:\n\n• **Başlangıç — ₺25.000'den**: kurumsal web sitesi, responsive tasarım, temel SEO, iletişim formu, analytics, hız optimizasyonu.\n• **Profesyonel — ₺50.000'den**: özel e-ticaret, interaktif 3D deneyimler, ödeme & kargo entegrasyonları, CMS, gelişmiş SEO.\n• **Kurumsal — özel teklif**: özel yazılım/SaaS, yapay zeka & otomasyon, API entegrasyonları, 7/24 SLA.\n\nBütçenizi yazarsanız size en uygun olanı önereyim.",
      action: { label: "Fiyatlandırmayı Gör", href: "#fiyatlandirma" },
      suggestions: ["50 bin bütçem var", "Kurumsal pakette neler var?"],
    };
  }

  /* ---------------- Paket içerikleri ---------------- */
  if (has(m, "baslangic") && has(m, "paket", "ne var", "icerik", "neler")) {
    return {
      text: "**Başlangıç (₺25.000'den):** kurumsal web sitesi (5 sayfa), mobil uyumlu responsive tasarım, temel SEO, iletişim formu entegrasyonu, Google Analytics, SSL & hız optimizasyonu ve 1 ay ücretsiz destek.",
      action: { label: "Fiyatlandırma", href: "#fiyatlandirma" },
      suggestions: ["Profesyonel farkı ne?", "Teklif al"],
    };
  }
  if (has(m, "profesyonel") && has(m, "paket", "ne var", "icerik", "neler", "fark")) {
    return {
      text: "**Profesyonel (₺50.000'den):** Başlangıç'taki her şey + özel tasarım web/e-ticaret, **interaktif 3D ürün & web deneyimleri**, ödeme & kargo entegrasyonları, yönetim paneli (CMS), gelişmiş SEO/analitik/animasyonlar ve 3 ay öncelikli destek.",
      action: { label: "Fiyatlandırma", href: "#fiyatlandirma" },
      suggestions: ["3D deneyim nedir?", "Kurumsal ne sunuyor?"],
    };
  }
  if (has(m, "kurumsal") && has(m, "paket", "ne var", "icerik", "neler", "ozel teklif")) {
    return {
      text: "**Kurumsal (özel teklif):** Profesyonel'deki her şey + özel yazılım/SaaS geliştirme, yapay zeka & otomasyon sistemleri, API & üçüncü parti entegrasyonlar, ölçeklenebilir bulut altyapısı, adanmış proje ekibi ve 7/24 SLA destek. Kapsamı görüşmede netleştirip size özel fiyat çıkarırız.",
      action: { label: "Teklif Al", href: "#iletisim" },
      suggestions: ["Yapay zeka neler yapabilir?", "Görüşme planla"],
    };
  }

  /* ---------------- 3D ---------------- */
  if (has(m, "3d", "uc boyut", "three", "webgl", "dondur", "360")) {
    return {
      text: "İnteraktif 3D deneyimler işimizin gözde alanlarından. Ürünlerinizi WebGL ile 360° döndürülebilir hale getiriyor, sinematik giriş sahneleri ve etkileşimli görseller tasarlıyoruz — tam da bu sayfadaki 3D bölüm gibi. Bu özellik Profesyonel paketle geliyor.",
      action: { label: "3D Bölümünü Gör", href: "#uc-boyut" },
      suggestions: ["Profesyonel pakette neler var?", "Örnek projeler"],
    };
  }

  /* ---------------- Hizmetler ---------------- */
  if (has(m, "e-ticaret", "eticaret", "magaza", "satis sitesi", "online satis", "sepet", "odeme sistemi")) {
    return {
      text: "E-ticaret altyapıları kurumumuzun uzmanlık alanı: ödeme (iyzico/Stripe) ve kargo entegrasyonları, ürün/sipariş yönetim paneli, dönüşüm odaklı tasarım ve güvenli, ölçeklenebilir bir mimari. Genelde **Profesyonel** paket (₺50.000'den) kapsamında ilerliyoruz.",
      action: { label: "Teklif Al", href: "#iletisim" },
      suggestions: ["Ne kadar sürede biter?", "Fiyatları göster"],
    };
  }
  if (has(m, "yapay zeka", "ai", "asistan", "chatbot", "otomasyon", "llm", "makine ogren")) {
    return {
      text: "Yapay zeka tarafında: akıllı müşteri asistanları, içerik ve süreç otomasyonu, öneri sistemleri ve LLM tabanlı özel entegrasyonlar geliştiriyoruz. İş akışınıza göre süreçleri otomatikleştirip destek yükünüzü ciddi biçimde azaltıyoruz. Bu çözümler Kurumsal paket kapsamında.",
      action: { label: "Görüşme Planla", href: "#iletisim" },
      suggestions: ["Kurumsal ne sunuyor?", "Bir asistan istiyorum"],
    };
  }
  if (has(m, "web sitesi", "kurumsal site", "internet sitesi", "web sayfasi", "landing")) {
    return {
      text: "Kurumsal web siteleri: hızlı, SEO uyumlu, markanızı yansıtan modern arayüzler. Responsive tasarım, animasyonlar ve yönetilebilir içerik standart. **Başlangıç** paketimiz (₺25.000'den) tam da bunun için.",
      action: { label: "Fiyatları Gör", href: "#fiyatlandirma" },
      suggestions: ["Başlangıç pakette neler var?", "Ne kadar sürede biter?"],
    };
  }
  if (has(m, "mobil", "uygulama", "app", "ios", "android", "react native")) {
    return {
      text: "Mobil uygulama geliştirme de yaptığımız işler arasında — React Native ile hem iOS hem Android için tek kod tabanından performanslı uygulamalar üretiyoruz. Kapsamı görüşmede netleştirip Kurumsal teklif hazırlıyoruz.",
      action: { label: "Teklif Al", href: "#iletisim" },
      suggestions: ["Ne kadar sürer?", "Fiyat aralığı nedir?"],
    };
  }
  if (has(m, "ozel yazilim", "saas", "yazilim gelistir", "sistem", "panel", "crm", "erp")) {
    return {
      text: "Özel yazılım & SaaS: iş süreçlerinize özel, uçtan uca tasarlanmış sistemler. Mevcut ERP/CRM ve üçüncü parti API'lerle sorunsuz entegre eder, ölçeklenebilir bulut altyapısında yayınlarız. Bu tür projeler Kurumsal paket kapsamında.",
      action: { label: "Görüşme Planla", href: "#iletisim" },
      suggestions: ["Entegrasyon mümkün mü?", "Süreç nasıl işliyor?"],
    };
  }
  if (has(m, "hizmet", "neler yap", "ne yapiyor", "ne is", "servis")) {
    return {
      text: "Dört ana alanda çalışıyoruz:\n\n1. **Kurumsal Web Siteleri**\n2. **E-Ticaret Sistemleri**\n3. **Yapay Zeka Çözümleri**\n4. **Özel Yazılım Geliştirme**\n\nHangisi ilginizi çekiyor? Detaylandırayım.",
      action: { label: "Hizmetleri Gör", href: "#hizmetler" },
      suggestions: ["E-ticaret istiyorum", "Yapay zeka çözümleri", "Web sitesi lazım"],
    };
  }

  /* ---------------- Süreç / süre ---------------- */
  if (has(m, "ne kadar sur", "ne zaman", "kac gun", "kac hafta", "teslim", "sure", "zaman ciz")) {
    return {
      text: "Süre kapsama göre değişir: kurumsal web siteleri genelde **3-5 hafta**, e-ticaret ve özel yazılım projeleri **6-12 hafta** arasında teslim edilir. İlk görüşmede size net bir zaman çizelgesi çıkarırız.",
      action: { label: "Süreci Gör", href: "#hakkimizda" },
      suggestions: ["Süreç nasıl işliyor?", "Hemen başlayabilir miyiz?"],
    };
  }
  if (has(m, "surec", "nasil calis", "asama", "adim", "yol harita", "metodoloji")) {
    return {
      text: "Dört aşamalı, şeffaf bir süreç izliyoruz:\n\n1. **Analiz** — ihtiyaç ve hedefleri netleştiririz.\n2. **Tasarım** — markanıza uygun premium arayüzler.\n3. **Geliştirme** — modern, ölçeklenebilir kod.\n4. **Yayınlama** — test, canlıya alma ve sürekli destek.\n\nHer aşamada demolar ve geri bildirim döngüleriyle sizi sürece dahil ederiz.",
      action: { label: "Süreç Bölümü", href: "#hakkimizda" },
      suggestions: ["Ne kadar sürer?", "Destek veriyor musunuz?"],
    };
  }

  /* ---------------- Teknoloji ---------------- */
  if (has(m, "teknoloji", "hangi dil", "framework", "next", "react", "stack", "altyapi", "hangi teknoloji")) {
    return {
      text: "Modern ve kanıtlanmış bir yığın kullanıyoruz: **Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Tailwind CSS, React Native**, ayrıca OpenAI, Vercel, AWS ve Docker. Projeye en uygun araçları seçeriz.",
      suggestions: ["Yapay zeka çözümleri", "Mevcut sistemle entegrasyon?"],
    };
  }

  /* ---------------- Entegrasyon ---------------- */
  if (has(m, "entegrasyon", "entegre", "mevcut sistem", "api baglan", "birlikte calis")) {
    return {
      text: "Kesinlikle mümkün. ERP, CRM, ödeme sistemleri ve üçüncü parti API'ler dahil mevcut altyapınızla sorunsuz entegrasyon sağlıyoruz. Mevcut sisteminizi anlatın, en temiz entegrasyon yolunu birlikte planlayalım.",
      action: { label: "Görüşme Planla", href: "#iletisim" },
      suggestions: ["Özel yazılım geliştiriyor musunuz?"],
    };
  }

  /* ---------------- Destek / garanti ---------------- */
  if (has(m, "destek", "bakim", "garanti", "sonra ne olur", "yayin sonrasi")) {
    return {
      text: "Evet. Tüm paketlerde ücretsiz destek süresi var (Başlangıç 1 ay, Profesyonel 3 ay, Kurumsal 7/24 SLA). Ayrıca bakım, güncelleme ve büyüme odaklı sürekli iş birliği paketleri sunuyoruz — yayından sonra da yanınızdayız.",
      suggestions: ["Fiyatları göster", "Görüşme planla"],
    };
  }

  /* ---------------- Projeler / referanslar ---------------- */
  if (has(m, "proje", "referans", "portfoy", "ornek", "is yapt", "musteri", "kimlerle")) {
    return {
      text: "Farklı sektörlerden markalarla çalıştık: Nova Commerce (e-ticaret), Atlas Kurumsal (web platformu), Lumen AI (yapay zeka) ve Pulse Mobile (mobil uygulama). Projeler bölümünde seçki çalışmalarımıza göz atabilirsiniz.",
      action: { label: "Projeleri Gör", href: "#projeler" },
      suggestions: ["Müşteriler ne diyor?", "Benzer bir proje istiyorum"],
    };
  }

  /* ---------------- İletişim ---------------- */
  if (has(m, "iletisim", "telefon", "numara", "adres", "nerede", "mail", "e-posta", "eposta", "ulasabilir")) {
    return {
      text: "Bize şu kanallardan ulaşabilirsiniz:\n📧 merhaba@voidyazilim.com\n📞 +90 (212) 000 00 00\n📍 Maslak, İstanbul\n\nEn hızlısı: aşağıdaki formu doldurun, 24 saat içinde dönüş yapalım.",
      action: { label: "İletişim Formu", href: "#iletisim" },
      suggestions: ["Görüşme planla"],
    };
  }

  /* ---------------- Başla / teklif ---------------- */
  if (has(m, "basla", "teklif", "gorusme", "randevu", "iletisime gec", "calismak istiyorum", "anlasma")) {
    return {
      text: "Harika! 🚀 En doğru adım ücretsiz bir keşif görüşmesi. Aşağıdaki formu doldurun — bütçe ve kapsamı konuşalım, 24 saat içinde size özel bir yol haritası ve teklifle dönelim.",
      action: { label: "Proje Başlat", href: "#iletisim" },
      suggestions: ["Fiyatları göster", "Ne kadar sürede biter?"],
    };
  }

  /* ---------------- Firma / hakkında ---------------- */
  if (has(m, "kimsiniz", "hakkinda", "void nedir", "siz kim", "firma", "ekip", "stüdyo", "studyo")) {
    return {
      text: "VOID Yazılım, fikirden ürüne, üründen markaya uzanan bir dijital ürün geliştirme stüdyosudur. Modern web, e-ticaret, yapay zeka ve özel yazılım projeleri geliştiriyoruz; 50+ tamamlanan proje ve %98 memnuniyetle çalışıyoruz.",
      suggestions: ["Hangi hizmetleri veriyorsunuz?", "Projeleri gör"],
    };
  }

  /* ---------------- Bilinmeyen: uydurmadan yönlendir ---------------- */
  return {
    text: "Bunu tam anlayamadım — uydurmak yerine dürüst olayım. 🙂 Şu konularda net yardımcı olabilirim: hizmetler (web, e-ticaret, yapay zeka, özel yazılım), paket & fiyatlar, süreç ve teslim süresi, teknolojiler, entegrasyon ve iletişim. Ya da doğrudan bir görüşme planlayabiliriz.",
    action: { label: "Görüşme Planla", href: "#iletisim" },
    suggestions: ["Hangi hizmetleri veriyorsunuz?", "Fiyatlar nasıl?", "Ne kadar sürede biter?"],
  };
}
