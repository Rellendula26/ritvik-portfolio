"use client";

import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import { Reveal } from "@/components/motion/Reveal";
import AnimatedMetric from "@/components/motion/AnimatedMetric";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, staggerItemReduced } from "@/lib/motion";
import type { ResultsContent } from "@/data/engineering-case-study";

export default function ResultsValidationSection({
  content,
}: {
  content: ResultsContent;
}) {
  const media = content.media ?? [];
  const reduce = useReducedMotion();

  return (
    <section id="results" className="scroll-mt-28">
      <Reveal>
        <SectionLabel>Results & Validation</SectionLabel>
        <div className="mt-3 max-w-2xl">
          <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
            What held up
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            What worked in the end, what I can show for it, and where it&apos;s still limited.
          </p>
        </div>
      </Reveal>

      <motion.div
        className="mt-8 grid gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
      >
        {content.items.map((item) => (
          <motion.article
            key={item.title}
            variants={reduce ? staggerItemReduced : staggerItem}
            className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-orange-200/80 hover:shadow-[0_18px_44px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                {item.title}
              </h3>
              {item.evidence &&
                (item.evidenceHref ? (
                  <a
                    href={item.evidenceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-lift rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[11px] font-medium text-orange-900 hover:bg-orange-100"
                  >
                    <AnimatedMetric value={item.evidence} />
                  </a>
                ) : (
                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[11px] font-medium text-orange-900">
                    <AnimatedMetric value={item.evidence} />
                  </span>
                ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.body}</p>
          </motion.article>
        ))}
      </motion.div>

      {media.length > 0 && (
        <div className="mt-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
              Photos and clips
            </p>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              The runs and stills that match the results above.
            </p>
          </Reveal>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {media.map((item, i) => (
              <Reveal key={`${item.kind}-${item.src}-${item.label ?? item.alt}`} delay={i * 0.05}>
                <CaseStudyMediaFrame
                  media={item}
                  className={
                    item.portrait ? undefined : "aspect-video w-full"
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {content.limitations.length > 0 && (
        <Reveal className="mt-6">
          <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50/90 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
              Limitations
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700">
              {content.limitations.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </section>
  );
}
