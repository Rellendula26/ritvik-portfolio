"use client";

import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import {
  CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  pickProjectPrimaryMedia,
} from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import LazyVideo from "@/components/LazyVideo";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";

function ExternalLink({
  href,
  label,
  featured,
  onNavigate,
}: {
  href: string;
  label: string;
  featured: boolean;
  onNavigate: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onNavigate}
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition",
        featured
          ? "border-white/15 bg-white/10 text-stone-200 hover:bg-white/15"
          : "border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:bg-amber-50",
      ].join(" ")}
    >
      {label}
    </a>
  );
}

export default function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: Project;
  featured?: boolean;
  index?: number;
}) {
  const router = useRouter();
  const isFeatured = featured || project.featured;
  const primaryMedia = pickProjectPrimaryMedia(project);

  function goToProject() {
    router.push(project.href);
  }

  function stopNav(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <article
        role="link"
        tabIndex={0}
        onClick={goToProject}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToProject();
          }
        }}
        className={[
          "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-300",
          isFeatured
            ? "border-stone-800/10 bg-stone-900 text-stone-100 shadow-[0_20px_60px_-20px_rgba(68,64,60,0.35)] hover:-translate-y-1 hover:shadow-[0_28px_70px_-18px_rgba(68,64,60,0.4)]"
            : "border-stone-200/70 bg-white/90 text-stone-900 shadow-sm hover:-translate-y-1 hover:border-amber-200/80 hover:shadow-lg",
        ].join(" ")}
        data-cursor
      >
        {isFeatured && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_50%)]"
            aria-hidden
          />
        )}

        {primaryMedia && (
          <motion.div className="relative aspect-[16/9] overflow-hidden">
            {primaryMedia.kind === "visual" ? (
              <ProjectCardVisual
                visualId={primaryMedia.visualId}
                className="transition duration-500 group-hover:scale-[1.01]"
              />
            ) : primaryMedia.kind === "image" ? (
              <ProjectMediaImage
                src={primaryMedia.src}
                alt={primaryMedia.alt}
                className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <>
                <LazyVideo
                  src={primaryMedia.src}
                  poster={primaryMedia.poster}
                  className="absolute inset-0 h-full w-full object-contain object-center bg-black transition duration-500 group-hover:scale-[1.01]"
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
                primaryMedia.kind === "visual"
                  ? isFeatured
                    ? "from-stone-950/50 via-transparent"
                    : "from-stone-950/40 via-transparent"
                  : isFeatured
                    ? "from-stone-950/80 via-stone-950/20"
                    : "from-white/90 via-transparent",
              ].join(" ")}
            />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge variant={isFeatured ? "featured" : "default"}>
                {CATEGORY_LABELS[project.category]}
              </Badge>
              {isFeatured && (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-950">
                  Featured
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
          </motion.div>
        )}

        <div className="relative flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={[
                "text-[10px] font-semibold uppercase tracking-[0.2em]",
                isFeatured ? "text-amber-400/90" : "text-stone-500",
              ].join(" ")}
            >
              {project.signal}
            </span>
            {project.date && (
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
                  {project.date}
                </span>
              </>
            )}
          </div>

          <motion.div className="flex items-start justify-between gap-3">
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
                isFeatured
                  ? "text-amber-400"
                  : "text-stone-300 group-hover:text-stone-600",
              ].join(" ")}
            >
              ↗
            </span>
          </motion.div>

          <p
            className={[
              "mt-1 line-clamp-2 text-sm font-medium",
              isFeatured ? "text-amber-200/80" : "text-amber-800/90",
            ].join(" ")}
          >
            {project.oneLine}
          </p>

          <p
            className={[
              "mt-3 line-clamp-4 text-sm leading-relaxed",
              isFeatured ? "text-stone-300" : "text-stone-700",
            ].join(" ")}
          >
            <span className={isFeatured ? "text-amber-300/90" : "text-amber-900/80"}>
              Motivation:{" "}
            </span>
            {project.overview}
          </p>

          {project.challenges[0] && (
            <p
              className={[
                "mt-3 line-clamp-2 text-xs leading-relaxed",
                isFeatured ? "text-amber-300/90" : "text-amber-900/80",
              ].join(" ")}
            >
              <span className="font-semibold uppercase tracking-wide">Challenge: </span>
              {project.challenges[0]}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, isFeatured ? 6 : 5).map((tag) => (
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

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                isFeatured
                  ? "border-white/20 bg-white/10 text-stone-200"
                  : "border-stone-200 bg-stone-50 text-stone-600",
              ].join(" ")}
            >
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
            <span
              className={[
                "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide",
                isFeatured
                  ? "border-amber-500/30 text-amber-200/90"
                  : "border-amber-200 bg-amber-50 text-amber-800/90",
              ].join(" ")}
            >
              {project.buildStage}
            </span>
          </div>

          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-4 flex flex-wrap gap-2" onClick={stopNav}>
              {project.githubUrl && (
                <ExternalLink
                  href={project.githubUrl}
                  label="GitHub"
                  featured={isFeatured}
                  onNavigate={stopNav}
                />
              )}
              {project.liveUrl && (
                <ExternalLink
                  href={project.liveUrl}
                  label={project.slug === "bloombot" ? "Devpost" : "Live"}
                  featured={isFeatured}
                  onNavigate={stopNav}
                />
              )}
              <Link
                href={project.href}
                onClick={stopNav}
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition",
                  isFeatured
                    ? "border-amber-500/30 text-amber-300/90 hover:bg-amber-500/10"
                    : "border-stone-200 text-stone-600 hover:border-amber-200",
                ].join(" ")}
              >
                Engineering breakdown
              </Link>
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
}
