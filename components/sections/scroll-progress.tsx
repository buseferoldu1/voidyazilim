"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Sayfa ustunde kayma ilerlemesini gosteren ince gradyan cubuk. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-0.5 origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-blue-500"
    />
  );
}
