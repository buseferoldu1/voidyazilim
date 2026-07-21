"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * ParticleTextEffect
 * ------------------
 * Tam ekran, canvas tabanli, sinematik "particle text morph" efekti.
 * Verilen kelimeler sirayla particle'lardan olusur; her gecISte
 * neon beyaz -> mor (#8B5CF6) -> mavi (#3B82F6) renk gradyani kullanilir.
 *
 * Performans notlari:
 *  - Tek requestAnimationFrame dongusu; React re-render'i yok (tum durum ref'te).
 *  - Kelimeler devicePixelRatio'ya gore ornekleniyor, ekstra canvas cizimleri
 *    yalnizca kelime degistiginde yapiliyor.
 *  - prefers-reduced-motion aktifse animasyon durur, son kelime sabit gosterilir.
 */

type RGB = { r: number; g: number; b: number };

const NEON_WHITE: RGB = { r: 255, g: 255, b: 255 };
const NEON_PURPLE: RGB = { r: 139, g: 92, b: 246 }; // #8B5CF6
const NEON_BLUE: RGB = { r: 59, g: 130, b: 246 }; // #3B82F6

// Renk duraklari: gradyan bu uc renk arasinda gezinir.
const PALETTE: RGB[] = [NEON_WHITE, NEON_PURPLE, NEON_BLUE, NEON_PURPLE, NEON_WHITE];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Hedef (kelime) konumu
  tx: number;
  ty: number;
  // Renk tonu icin sabit ofset (0-1) -> canli neon gecisi
  hue: number;
  size: number;
  active: boolean;
}

export interface ParticleTextEffectProps {
  words?: string[];
  /** Kelime degisim suresi (ms) */
  interval?: number;
  /** Particle yogunlugu: piksel ornekleme adimi. Kucuk = daha yogun. */
  density?: number;
  className?: string;
}

const DEFAULT_WORDS = [
  "VOID",
  "YAZILIM",
  "WEB",
  "ECOMMERCE",
  "AI",
  "MOBILE",
  "AUTOMATION",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** PALETTE uzerinde 0-1 konumuna gore renk uretir. */
function sampleGradient(t: number): RGB {
  const clamped = ((t % 1) + 1) % 1;
  const scaled = clamped * (PALETTE.length - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;
  const a = PALETTE[i];
  const b = PALETTE[Math.min(i + 1, PALETTE.length - 1)];
  return {
    r: Math.round(lerp(a.r, b.r, frac)),
    g: Math.round(lerp(a.g, b.g, frac)),
    b: Math.round(lerp(a.b, b.b, frac)),
  };
}

export default function ParticleTextEffect({
  words = DEFAULT_WORDS,
  interval = 5000,
  density = 4,
  className = "",
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const wordIndexRef = useRef<number>(0);
  const lastWordChangeRef = useRef<number>(0);
  const dprRef = useRef<number>(1);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const wordList = useMemo(
    () => (words.length > 0 ? words : DEFAULT_WORDS),
    [words]
  );

  /**
   * Verilen kelimeyi gecici bir canvas'a cizip opak pikselleri ornekleyerek
   * particle hedef konumlarini uretir.
   */
  const computeTargets = useCallback(
    (word: string): Array<{ x: number; y: number }> => {
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) return [];

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      if (!octx) return [];

      // Kelime uzunluguna gore olcekli, ekrana sigacak font boyutu.
      const fontSize = Math.min(
        h * 0.42,
        (w * 1.6) / Math.max(word.length, 1)
      );
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      // Not: Canvas `font` ozelligi CSS degiskenlerini (var(--...)) cozemez;
      // somut bir sans-serif yigini kullanilir.
      octx.font = `800 ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
      octx.fillText(word, w / 2, h / 2);

      const image = octx.getImageData(0, 0, w, h).data;
      const targets: Array<{ x: number; y: number }> = [];
      const step = Math.max(2, density);

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const alpha = image[(y * w + x) * 4 + 3];
          if (alpha > 128) {
            targets.push({ x, y });
          }
        }
      }
      return targets;
    },
    [density]
  );

  /** Particle havuzunu hedef konumlara gore hazirlar/gunceller. */
  const assignWord = useCallback(
    (word: string) => {
      const targets = computeTargets(word);
      const { w, h } = sizeRef.current;
      const pool = particlesRef.current;

      // Havuzu hedef sayisina genislet.
      while (pool.length < targets.length) {
        pool.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          tx: w / 2,
          ty: h / 2,
          hue: Math.random(),
          size: 1,
          active: false,
        });
      }

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (i < targets.length) {
          p.tx = targets[i].x;
          p.ty = targets[i].y;
          p.active = true;
          p.size = 1 + Math.random() * 1.4;
          p.hue = Math.random();
        } else {
          // Fazla particle'lar disariya dagilip sonuk gorunur.
          p.tx = Math.random() * w;
          p.ty = Math.random() * h;
          p.active = false;
        }
      }
    },
    [computeTargets]
  );

  /**
   * Canvas tampon boyutunu ebeveyn olculerine gore ayarlar.
   * Gecerli bir olcum yapabildiyse true doner (0 genislik/yukseklikte false).
   */
  const setupSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const parent = canvas.parentElement;
    const rect = parent
      ? parent.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    // Layout henuz oturmadiysa (0 boyut) bekle; ResizeObserver tekrar cagirir.
    if (w < 2 || h < 2) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    sizeRef.current = { w, h };

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let ready = false;
    wordIndexRef.current = 0;
    lastWordChangeRef.current = performance.now();

    // Ilk gecerli olcum alinana kadar bekler, sonra kelimeyi yerlestirir.
    const ensureReady = () => {
      if (ready) return true;
      if (setupSize()) {
        assignWord(wordList[0]);
        lastWordChangeRef.current = performance.now();
        ready = true;
      }
      return ready;
    };
    ensureReady();

    const render = (now: number) => {
      if (!running) return;
      if (!ensureReady()) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }
      const { w, h } = sizeRef.current;

      // Kelime dongusu
      if (!prefersReduced && now - lastWordChangeRef.current > interval) {
        lastWordChangeRef.current = now;
        wordIndexRef.current = (wordIndexRef.current + 1) % wordList.length;
        assignWord(wordList[wordIndexRef.current]);
      }

      // Hafif iz birakan koyu arka plan (sinematik parlama izi).
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Zamana bagli global renk gezinmesi.
      const globalShift = (now / 6000) % 1;
      const pool = particlesRef.current;

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];

        // Yaya benzeri yumusak cekme (spring) + surtunme.
        const ax = (p.tx - p.x) * 0.045;
        const ay = (p.ty - p.y) * 0.045;
        p.vx = (p.vx + ax) * 0.82;
        p.vy = (p.vy + ay) * 0.82;
        p.x += p.vx;
        p.y += p.vy;

        if (prefersReduced) {
          // Hareketsiz: dogrudan hedefte.
          p.x = p.tx;
          p.y = p.ty;
        }

        const color = sampleGradient(p.hue + globalShift);
        const alpha = p.active ? 0.95 : 0.12;
        const size = p.active ? p.size : p.size * 0.6;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      if (prefersReduced) return; // Tek kare cizip dur.
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    // Ebeveyn boyutu degistikce (ilk layout dahil) yeniden olcup kelimeyi
    // guncelle. Kucuk siciramalari yumusatmak icin debounce uygulanir.
    let resizeTimer: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (setupSize()) {
          assignWord(wordList[wordIndexRef.current]);
          ready = true;
          if (prefersReduced) {
            // Statik modda tek kareyi yeniden ciz.
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(render);
          }
        }
      }, 120);
    };

    const parent = canvas.parentElement;
    const ro = parent ? new ResizeObserver(handleResize) : null;
    if (ro && parent) ro.observe(parent);
    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      ro?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, [wordList, interval, assignWord, setupSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
