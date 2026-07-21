# VOID Yazılım

Dijital ürün geliştirme stüdyosu için premium landing sitesi.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
react-three-fiber (interaktif 3D) · kural tabanlı AI asistanı.

## Geliştirme

```bash
npm install
npm run dev
```

http://localhost:3000 adresinde açılır.

## Yayına Alma (Vercel)

1. Bu klasörü bir GitHub deposuna gönderin.
2. https://vercel.com → **Add New → Project** → depoyu **Import** edin
   (Framework otomatik **Next.js** algılanır, ayarları değiştirmeyin).
3. **Deploy**.
4. Vercel projesinde **Settings → Domains** → `voidyazilim.com.tr` ekleyin ve
   gösterilen DNS kayıtlarını alan adı sağlayıcınızda tanımlayın.

## İletişim Formu (opsiyonel kalıcılık)

Varsayılan olarak başvurular sunucu günlüğüne + `data/void-leads.json`
dosyasına yazılır. Kalıcı veritabanı için `DATABASE_URL` (Neon Postgres)
ortam değişkenini tanımlayın — bkz. `.env.example`.
