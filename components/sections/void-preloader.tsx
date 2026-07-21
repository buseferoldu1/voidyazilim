"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Ilk yuklemede gorunen sinematik preloader. VOID logosu belirir, kisa bir
 * ilerleme sonrasi perde yukari kayarak sahneyi acar. Hareket hassasiyeti
 * olanlarda aninda kaybolur.
 */
export default function VoidPreloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setDone(true), reduced ? 0 : 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="pl-[0.5em] text-3xl font-extrabold text-white sm:text-4xl"
            >
              VOID
            </motion.span>
            <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-violet-500 to-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
