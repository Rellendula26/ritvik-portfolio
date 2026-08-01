import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import { ProjectBadge } from "@/components/project-page/shared";
import {
  CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  pickProjectPrimaryMedia,
  type Project,
  type ProjectMedia,
} from "@/data/projects";

function renderMedia(media: ProjectMedia, priority = false) {
  if (media.kind === "visual") {
    return <ProjectCardVisual visualId={media.visualId} className="h-full w-full" />;
  }

  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        className="h-full w-full object-contain object-center bg-[#070707]"
        controls
        playsInline
        preload="metadata"
        poster={media.poster}
      />
    );
  }

  return (
    <ProjectMediaImage
      src={media.src}
      alt={media.alt}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 800px"
    />
  );
}

/**
 * Executive Summary hero — keep visually identical to the existing project page hero.
 * Optimized for a 30–60s skim: title, motivation, media, metadata, stack, CTAs.
 */
export default function ProjectHero({ project }: { project: Project }) {
  const hero = pickProjectPrimaryMedia(project);

  return (
    <header className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.10),transparent_28%)]" />
      <div className="relative grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <ProjectBadge>{CATEGORY_LABELS[project.category]}</ProjectBadge>
            <ProjectBadge tone="dark">{PROJECT_STATUS_LABELS[project.status]}</ProjectBadge>
            {project.featured && <ProjectBadge tone="yellow">Featured</ProjectBadge>}
          </div>

          <h1 className="text-display mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl font-medium leading-snug tracking-tight text-zinc-800 md:text-xl">
            {project.oneLine}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
            {project.overview}
          </p>

          {project.keyHighlights.length > 0 && (
            <div className="mt-5 max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Engineering highlights
              </p>
              <ul className="mt-2.5 space-y-2">
                {project.keyHighlights.slice(0, 3).map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-snug text-zinc-700"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Date", value: project.date },
              { label: "Focus", value: project.signal },
              { label: "Build stage", value: project.buildStage },
              project.disciplines && project.disciplines.length > 0
                ? {
                    label: "Disciplines",
                    value: project.disciplines.join(", "),
                  }
                : {
                    label: "Stack",
                    value: project.techStack.slice(0, 2).join(", "),
                  },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/90 px-3 py-3"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-xs font-medium leading-snug text-zinc-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Source code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
              >
                Live demo
              </a>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <ProjectBadge key={tag}>{tag}</ProjectBadge>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#070707] shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
            {hero?.label ?? "Project preview"}
          </div>
          <div className="relative aspect-video w-full bg-[#070707]">
            {hero ? (
              renderMedia(hero, true)
            ) : (
              <ProjectMediaImage
                src={project.thumbnail}
                alt={`${project.title} thumbnail`}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            )}
          </div>
          {hero?.caption && (
            <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
              {hero.caption}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
