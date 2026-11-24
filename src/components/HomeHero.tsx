"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import HomeHeroIntro from "@/components/HomeHeroIntro";
import HeroAtmosphere from "@/components/HeroAtmosphere";

const BOOT_MS = 1800;

export default function HomeHero() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const first = document.documentElement.dataset.boot === "start";
    if (!first || reduce) {
      root.style.setProperty("--boot", "1");
      root.dataset.live = "1";
      document.documentElement.removeAttribute("data-boot");
      return;
    }

    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / BOOT_MS);
      root.style.setProperty("--boot", t.toFixed(4));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      sessionStorage.setItem("bench-powered", "1");
      document.documentElement.removeAttribute("data-boot");
      root.dataset.live = "1";
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      className="workbench-hero relative mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-8 md:pt-16"
    >
      <HeroAtmosphere />

      <div className="grid items-stretch gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
        <HomeHeroIntro />

        <div className="group relative flex min-h-[380px] md:min-h-[420px]">
          <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-amber-200/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-4 shadow-md transition-shadow duration-500 group-hover:shadow-lg">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
              <Image
                src="/ritvik.jpg"
                alt="Ritvik Ellendula"
                fill
                className="img-zoom object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="mt-4 text-center text-base font-semibold text-stone-900">
              Ritvik Ellendula
            </p>
            <p className="pb-1 text-center text-sm text-stone-500">
              Building stuff I find cool.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
