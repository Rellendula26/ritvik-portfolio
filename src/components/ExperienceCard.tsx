"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  experienceHref,
  type Experience,
} from "@/data/experiences";
import { getProjectsForExperience } from "@/data/projects";
import { experienceBullets, orgOneLiner } from "@/data/experience-summary";
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
  /** Kept so existing call sites compile. The card always uses the same fields. */
  showResult?: boolean;
}) {
  const reduce = useReducedMotion();
  const href = experienceHref(experience.slug);
  const meta = [experience.location, experience.dates].filter(Boolean).join(" · ");
  const projects = [
    ...getProjectsForExperience(experience.slug).map((project) => ({
      label: project.title,
      href: project.href,
    })),
    ...(experience.relatedProjects ?? []),
  ].filter((project, index, all) => all.findIndex((item) => item.href === project.href) === index);
  const bullets = experienceBullets(experience);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={reduce ? revealReduced : revealVariants}
      transition={{ ...transitionBase, delay: index * 0.07 }}
    >
      <article
        className={cx(
          "group relative grid overflow-hidden rounded-2xl border border-stone-200/80 bg-white/85",
          "shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out",
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
          <h3 className="text-display text-2xl text-stone-950 md:text-3xl">
            <Link
              href={href}
              className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              {experience.role}
              <span className="text-stone-400"> — </span>
              {experience.org}
            </Link>
          </h3>
          {meta ? (
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
              {meta}
            </p>
          ) : null}
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-700">
            {orgOneLiner(experience)}
          </p>
          {bullets.length ? (
            <ul className="mt-3 max-w-xl space-y-1.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-stone-800">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {projects.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {projects.map((project) => (
                <li key={project.href}>
                  <Link
                    href={project.href}
                    className="inline-flex rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone-700 hover:border-amber-300 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                  >
                    {project.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </motion.div>
  );
}
