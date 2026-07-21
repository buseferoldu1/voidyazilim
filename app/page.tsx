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

export default function HomePage() {
  return (
    <main>
      <VoidNavbar />
      <Hero />
      <TechStack />
      <Services />
      <Stats />
      <Pricing />
      <References />
      <Void3DSection />
      <Process />
      <VoidTestimonials />
      <VoidFaq />
      <ContactSection />
      <VoidFooter />
    </main>
  );
}
