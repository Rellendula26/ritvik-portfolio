"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Lightweight hero atmosphere: mouse-following amber wash + faint engineering grid.
 * CSS-variable driven; rAF only while the pointer moves. No layout impact.
 */
export default function HeroAtmosphere() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 40 });
  const current = useRef({ x: 50, y: 40 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;

    const apply = () => {
      el.style.setProperty("--hx", `${current.current.x}%`);
      el.style.setProperty("--hy", `${current.current.y}%`);
    };

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        current.current.x = target.current.x;
        current.current.y = target.current.y;
        apply();
        raf.current = null;
        return;
      }
      current.current.x += dx * 0.08;
      current.current.y += dy * 0.08;
      apply();
      raf.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf.current == null) raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    apply();
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [reduce]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={
        {
          "--hx": "50%",
          "--hy": "40%",
        } as React.CSSProperties
      }
    >
      {/* Mouse-following wash */}
      <div
        className="absolute inset-0 opacity-90 transition-opacity duration-500"
        style={{
          background: reduce
            ? "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(251, 191, 36, 0.1), transparent 65%)"
            : "radial-gradient(ellipse 50% 42% at var(--hx) var(--hy), rgba(251, 191, 36, 0.14), transparent 62%)",
        }}
      />

      {/* Faint engineering grid */}
      <div
        className={[
          "absolute inset-0 opacity-[0.35]",
          "[background-image:linear-gradient(rgba(120,113,108,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,113,108,0.07)_1px,transparent_1px)]",
          "[background-size:48px_48px]",
          "[mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]",
        ].join(" ")}
      />

      {/* Slow drift PCB-style nodes (CSS only; paused under reduced motion) */}
      <svg
        className="absolute left-[8%] top-[18%] h-24 w-40 text-amber-700/25 motion-safe:animate-hero-drift"
        viewBox="0 0 160 96"
        fill="none"
      >
        <path
          d="M8 48 H48 L64 32 H96 L112 48 H152"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="48" cy="48" r="2.5" fill="currentColor" />
        <circle cx="96" cy="32" r="2.5" fill="currentColor" />
        <circle cx="112" cy="48" r="2.5" fill="currentColor" />
        <rect
          x="70"
          y="24"
          width="12"
          height="8"
          rx="1"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <svg
        className="absolute bottom-[12%] right-[10%] h-20 w-32 text-stone-500/20 motion-safe:animate-hero-drift-delayed"
        viewBox="0 0 128 80"
        fill="none"
      >
        <path
          d="M4 60 V28 H36 L48 16 H92"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="36" cy="28" r="2" fill="currentColor" />
        <circle cx="48" cy="16" r="2" fill="currentColor" />
        <path
          d="M92 16 Q108 16 112 32 T120 60"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
