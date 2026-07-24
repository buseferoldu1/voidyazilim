"use client";

import { usePathname } from "next/navigation";
import VoidCursor from "@/components/sections/void-cursor";
import ScrollProgress from "@/components/sections/scroll-progress";
import VoidPreloader from "@/components/sections/void-preloader";
import BackToTop from "@/components/sections/back-to-top";
import VoidWhatsapp from "@/components/sections/void-whatsapp";
import VoidAiChat from "@/components/sections/void-ai-chat";

/**
 * Pazarlama sitesine ozgu susler (imlec, preloader, WhatsApp, AI sohbet...).
 * Yonetim paneli (/void-admin) altinda gizlenir; panel sade kalir.
 */
export default function SiteChrome({ phone }: { phone?: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/void-admin")) return null;

  return (
    <>
      <VoidPreloader />
      <ScrollProgress />
      <VoidCursor />
      <BackToTop />
      <VoidAiChat />
      <VoidWhatsapp phone={phone} />
    </>
  );
}
