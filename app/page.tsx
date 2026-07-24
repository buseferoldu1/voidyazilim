import VoidNavbar from "@/components/sections/void-navbar";
import Hero from "@/components/sections/hero";
import TechStack from "@/components/sections/tech-stack";
import Services from "@/components/sections/services";
import Stats from "@/components/sections/stats";
import Pricing from "@/components/sections/pricing";
import References from "@/components/sections/references";
import Void3DSection from "@/components/sections/void-3d-section";
import Process from "@/components/sections/process";
import VoidTestimonials from "@/components/sections/void-testimonials";
import VoidFaq from "@/components/sections/void-faq";
import ContactSection from "@/components/sections/contact-section";
import VoidFooter from "@/components/sections/void-footer";
import { getSiteContent } from "@/lib/void-content";

// Icerik admin panelinden guncellenebildigi icin her istekte taze okunur.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const c = await getSiteContent();
  return (
    <main>
      <VoidNavbar brand={c.brand.name} ctaLabel={c.hero.ctaSecondary} />
      <Hero hero={c.hero} />
      <TechStack />
      <Services services={c.services} />
      <Stats stats={c.stats} />
      <Pricing pricing={c.pricing} />
      <References references={c.references} />
      <Void3DSection />
      <Process />
      <VoidTestimonials testimonials={c.testimonials} />
      <VoidFaq faq={c.faq} />
      <ContactSection contact={c.contact} />
      <VoidFooter footer={c.footer} brand={c.brand.name} contact={c.contact} />
    </main>
  );
}
