"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EXPERIENCE_KIND_LABELS,
  EXPERIENCE_TRACK_LABELS,
  experienceHref,
  type Experience,
} from "@/data/experiences";
import LazyVideo from "@/components/LazyVideo";
import {
  revealReduced,
  revealVariants,
  transitionBase,
} from "@/lib/motion";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CoverMedia({ experience }: { experience: Experience }) {
  const { cover } = experience;

  if (cover.kind === "video") {
    return (
      <LazyVideo
        src={cover.src}
        poster={cover.poster}
        className="img-zoom absolute inset-0 h-full w-full object-cover object-center"
        playOnHover
      />
    );
  }

  const isSvg = cover.src.endsWith(".svg");

  return (
    <Image
      src={cover.src}
      alt={cover.alt}
      fill
      unoptimized={isSvg}
      sizes="(max-width: 768px) 100vw, 42vw"
      className="img-zoom object-cover object-center"
    />
  );
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
          "motion-safe:hover:-translate-y-1 hover:border-amber-300/90 hover:shadow-lg",
          "md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]"
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-amber-700 transition-transform duration-500 ease-out group-hover:scale-y-100"
        />

        <div className="relative aspect-[16/10] overflow-hidden bg-stone-900 md:aspect-auto md:min-h-[220px]">
          <CoverMedia experience={experience} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white/10" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-sm bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-800 backdrop-blur">
              {kindLabel}
            </span>
            <span className="rounded-sm bg-amber-50/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-950 backdrop-blur">
              {experience.track === "club" ? "Club" : "Org"}
            </span>
            <span className="rounded-sm bg-stone-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100 backdrop-blur">
              {experience.dates}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center px-5 py-6 md:px-8 md:py-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-800">
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
            Read role
            <ArrowRight className="btn-arrow h-4 w-4" />
          </div>
        </div>
      </article>
    </motion.div>
  );
}
