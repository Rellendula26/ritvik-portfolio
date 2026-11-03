"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EXPERIENCE_KIND_LABELS,
  EXPERIENCE_TRACK_LABELS,
  experienceHref,
  type Experience,
} from "@/data/experiences";
import CoverFrame from "@/components/media/CoverFrame";
import {
  revealReduced,
  revealVariants,
  transitionBase,
} from "@/lib/motion";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ExperienceCard({
  experience,
  index = 0,
}: {
  experience: Experience;
  index?: number;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const kindLabel = EXPERIENCE_KIND_LABELS[experience.kind];
  const trackLabel = EXPERIENCE_TRACK_LABELS[experience.track];
  const href = experienceHref(experience.slug);

  function go() {
    router.push(href);
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={reduce ? revealReduced : revealVariants}
      transition={{ ...transitionBase, delay: index * 0.07 }}
    >
      <article
        role="link"
        tabIndex={0}
        onClick={go}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            go();
          }
        }}
        data-cursor
        className={cx(
          "group relative grid cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 bg-white/85",
          "shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700",
          "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]"
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-amber-700 transition-transform duration-500 ease-out group-hover:scale-y-100"
        />

        <div className="p-3 md:p-4">
          <CoverFrame
            media={experience.cover}
            sizes="(max-width: 768px) 100vw, 40vw"
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col justify-center px-5 py-6 md:px-8 md:py-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">
            {kindLabel}
            <span className="text-stone-300"> · </span>
            <span className="text-stone-500">{experience.dates}</span>
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {trackLabel}
            {experience.location ? ` · ${experience.location}` : ""}
          </p>
          <h3 className="text-display mt-2 text-2xl text-stone-950 md:text-3xl">
            {experience.org}
          </h3>
          <p className="mt-1 text-sm font-medium text-stone-700 md:text-base">
            {experience.role}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-600 line-clamp-3">
            {experience.oneLiner}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-amber-800 transition-colors group-hover:text-amber-950">
            Open this role
            <ArrowRight className="btn-arrow h-4 w-4" />
          </div>
        </div>
      </article>
    </motion.div>
  );
}
