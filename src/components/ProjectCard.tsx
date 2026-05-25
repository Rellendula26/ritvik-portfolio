"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { CATEGORY_LABELS } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import LazyVideo from "@/components/LazyVideo";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";

export default function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: Project;
  featured?: boolean;
  index?: number;
}) {
  const isFeatured = featured || project.tier === "featured";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link href={project.href} className="group block h-full" data-cursor>
        <article
          className={[
            "relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300",
            isFeatured
              ? "border-stone-800/10 bg-stone-900 text-stone-100 shadow-[0_20px_60px_-20px_rgba(68,64,60,0.35)] hover:-translate-y-1 hover:shadow-[0_28px_70px_-18px_rgba(68,64,60,0.4)]"
              : "border-stone-200/70 bg-white/90 text-stone-900 shadow-sm hover:-translate-y-1 hover:border-amber-200/80 hover:shadow-lg",
          ].join(" ")}
        >
          {isFeatured && (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_50%)]" />
          )}

          {/* Media */}
          {project.media && (
            <div className="relative aspect-[16/9] overflow-hidden">
              {project.media.kind === "visual" ? (
                <ProjectCardVisual
                  visualId={project.media.visualId}
                  className="transition duration-500 group-hover:scale-[1.01]"
                />
              ) : project.media.kind === "image" ? (
                <Image
                  src={project.media.src}
                  alt={project.media.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <>
                  <LazyVideo
                    src={project.media.src}
                    poster={project.media.poster}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    playOnHover={!isFeatured}
                    playWhenVisible={isFeatured}
                  />
                  {!isFeatured && (
                    <span className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      <span className="inline-block h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-white" />
                      Video
                    </span>
                  )}
                </>
              )}
              <div
                className={[
                  "pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent",
                  project.media.kind === "visual"
                    ? isFeatured
                      ? "from-stone-950/50 via-transparent"
                      : "from-stone-950/40 via-transparent"
                    : isFeatured
                      ? "from-stone-950/80 via-stone-950/20"
                      : "from-white/90 via-transparent",
                ].join(" ")}
              />
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge variant={isFeatured ? "featured" : "default"}>
                  {CATEGORY_LABELS[project.category]}
                </Badge>
                {isFeatured && (
                  <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-950">
                    Favorite
                  </span>
                )}
              </div>
              <span
                className={[
                  "absolute right-4 top-4 font-mono text-[10px] tracking-widest",
                  isFeatured ? "text-stone-500" : "text-stone-400",
                ].join(" ")}
              >
                {project.id}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="relative flex flex-1 flex-col p-5 md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={[
                  "text-[10px] font-semibold uppercase tracking-[0.2em]",
                  isFeatured ? "text-amber-400/90" : "text-stone-500",
                ].join(" ")}
              >
                {CATEGORY_LABELS[project.category]}
              </span>
              {project.timeline && (
                <>
                  <span className={isFeatured ? "text-stone-600" : "text-stone-300"}>
                    ·
                  </span>
                  <span
                    className={[
                      "text-[10px] uppercase tracking-wider",
                  isFeatured ? "text-stone-500" : "text-stone-400",
                ].join(" ")}
              >
                {project.timeline}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <h3
                className={[
                  "text-xl font-semibold tracking-tight md:text-2xl",
                  isFeatured ? "text-white" : "text-stone-950",
                ].join(" ")}
              >
                {project.title}
              </h3>
              <span
                className={[
                  "mt-1 shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  isFeatured ? "text-amber-400" : "text-stone-300 group-hover:text-stone-600",
                ].join(" ")}
              >
                ↗
              </span>
            </div>

            <p
              className={[
                "mt-1 text-sm font-medium",
                isFeatured ? "text-amber-200/80" : "text-amber-800/90",
              ].join(" ")}
            >
              {project.tagline}
            </p>

            <p
              className={[
                "mt-3 flex-1 text-sm leading-relaxed",
                isFeatured ? "text-stone-400" : "text-stone-600",
              ].join(" ")}
            >
              {project.blurb}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className={[
                    "rounded-md px-2 py-0.5 text-[11px]",
                    isFeatured
                      ? "bg-white/10 text-stone-300"
                      : "bg-stone-100 text-stone-600",
                  ].join(" ")}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
