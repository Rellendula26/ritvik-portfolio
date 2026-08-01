"use client";

import { useState } from "react";
import Image from "next/image";
import HomeHeroIntro from "@/components/HomeHeroIntro";
import EngineeringWorkbench from "@/components/lab/EngineeringWorkbench";

export default function HomeHero() {
  const [progress, setProgress] = useState(0);

  // Photo uses a soft side settle after the headline; different from body fade/rise.
  const photoIn = progress >= 0.5;
  const workbenchIn = progress >= 0.95;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-8 md:pt-16">
      <div className="grid items-stretch gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-h-0 flex-col justify-between">
          <HomeHeroIntro onProgress={setProgress} />
        </div>

        <div
          className="group relative flex min-h-[380px] md:min-h-[420px]"
          data-cursor
          style={{
            opacity: photoIn ? 1 : 0,
            transform: photoIn
              ? "translateX(0) scale(1)"
              : "translateX(18px) scale(0.985)",
            transition:
              "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: photoIn ? "80ms" : "0ms",
          }}
        >
          <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-amber-200/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-4 shadow-md">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
              <Image
                src="/ritvik.jpg"
                alt="Ritvik Ellendula"
                fill
                className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
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

      <div
        className="mx-auto mt-14 max-w-xl md:mt-16 lg:max-w-2xl"
        data-cursor
        style={{
          opacity: workbenchIn ? 1 : 0,
          transition: "opacity 600ms ease-out",
          transitionDelay: workbenchIn ? "120ms" : "0ms",
        }}
      >
        <EngineeringWorkbench />
      </div>
    </section>
  );
}
