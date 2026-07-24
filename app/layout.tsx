import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteChrome from "@/components/site-chrome";
import { getSiteContent } from "@/lib/void-content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VOID Yazılım | Fikirden Ürüne, Üründen Markaya",
  description:
    "Kurumsal web siteleri, e-ticaret altyapıları, yapay zeka sistemleri ve özel yazılım çözümleri geliştiren dijital ürün stüdyosu.",
  metadataBase: new URL("https://voidyazilim.com.tr"),
  openGraph: {
    title: "VOID Yazılım — Dijital Ürün Geliştirme Stüdyosu",
    description:
      "Modern web, e-ticaret, yapay zeka ve özel yazılım projeleri.",
    type: "website",
    locale: "tr_TR",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html lang="tr" className={inter.variable}>
      <body className="void-root min-h-screen bg-black font-sans text-white antialiased">
        {children}
        <SiteChrome phone={content.settings.whatsappPhone} />
      </body>
    </html>
  );
}
