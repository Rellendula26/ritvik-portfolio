"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    const activate = () => setActive(true);
    const deactivate = () => setActive(false);

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);

    const els = Array.from(
      document.querySelectorAll("a, button, [data-cursor]")
    );
    els.forEach((el) => {
      el.addEventListener("mouseenter", activate);
      el.addEventListener("mouseleave", deactivate);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);

      els.forEach((el) => {
        el.removeEventListener("mouseenter", activate);
        el.removeEventListener("mouseleave", deactivate);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* main dot */}
      <div
        ref={dotRef}
        className={[
          "absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "transition-[width,height,background-color] duration-150 ease-out",
          active
            ? "h-4 w-4 bg-amber-500"
            : "h-3 w-3 bg-amber-600",
        ].join(" ")}
      />

      {/* soft glow */}
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

