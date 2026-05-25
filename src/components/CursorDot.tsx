"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const running = useRef(false);

  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      if (!running.current) {
        running.current = true;
        raf.current = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        running.current = false;
        raf.current = null;
        return;
      }

      current.current.x += dx * 0.18;
      current.current.y += dy * 0.18;

      const transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      if (dotRef.current) dotRef.current.style.transform = transform;
      if (glowRef.current) glowRef.current.style.transform = transform;

      raf.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden && raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
        running.current = false;
      }
    };

    const onPointerOver = (e: Event) => {
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest("a, button, [data-cursor]")
      ) {
        setActive(true);
      }
    };

    const onPointerOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget;
      if (
        related instanceof Element &&
        related.closest("a, button, [data-cursor]")
      ) {
        return;
      }
      const t = e.target;
      if (
        t instanceof Element &&
        t.closest("a, button, [data-cursor]")
      ) {
        setActive(false);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={dotRef}
        className={[
          "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "transition-[width,height,background-color] duration-150 ease-out",
          active ? "h-4 w-4 bg-amber-500" : "h-3 w-3 bg-amber-600",
        ].join(" ")}
      />
      <div
        ref={glowRef}
        className={[
          "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl",
          "transition-[width,height,opacity] duration-150 ease-out",
          active
            ? "h-16 w-16 bg-amber-400/30 opacity-100"
            : "h-10 w-10 bg-amber-400/15 opacity-70",
        ].join(" ")}
      />
    </div>
  );
}
