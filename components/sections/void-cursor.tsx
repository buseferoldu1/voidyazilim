"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium imlec efekti: yerlesik imlec HER ZAMAN gorunur; bu bilesen yalnizca
 * imlecin arkasindan yumusakca gelen bir parilti/halka ekler (imleci gizlemez).
 * Link/buton uzerinde halka buyur. Dokunmatik cihazlarda ve hareket
 * hassasiyeti olanlarda tamamen devre disidir.
 */
export default function VoidCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!ring || !glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        'a, button, [role="button"], input, textarea, select, label'
      );
      ring.dataset.active = interactive ? "true" : "false";
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Yumusak parilti (imlecin arkasinda) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] h-16 w-16 rounded-full bg-violet-500/20 blur-2xl"
      />
      {/* Gecikmeli halka */}
      <div
        ref={ringRef}
        aria-hidden
        data-active="false"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-8 w-8 rounded-full border border-violet-300/50 transition-[width,height,border-color,background-color] duration-200 data-[active=true]:h-12 data-[active=true]:w-12 data-[active=true]:border-violet-300/80 data-[active=true]:bg-violet-400/10"
      />
    </>
  );
}
