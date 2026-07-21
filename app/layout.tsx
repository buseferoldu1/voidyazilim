import type { Metadata } from "next";
import { Inter } from "next/font/google";
import VoidCursor from "@/components/sections/void-cursor";
import ScrollProgress from "@/components/sections/scroll-progress";
import VoidPreloader from "@/components/sections/void-preloader";
import BackToTop from "@/components/sections/back-to-top";
import VoidWhatsapp from "@/components/sections/void-whatsapp";
import VoidAiChat from "@/components/sections/void-ai-chat";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="void-root min-h-screen bg-black font-sans text-white antialiased">
        <VoidPreloader />
        <ScrollProgress />
        <VoidCursor />
        {children}
        <BackToTop />
        <VoidAiChat />
        <VoidWhatsapp />
      </body>
    </html>
  );
}
