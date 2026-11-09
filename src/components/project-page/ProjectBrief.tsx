"use client";

import { useState } from "react";
import type { ProjectBriefSlide, ProjectBriefVisual } from "@/data/project-brief";
import type { Project } from "@/data/projects";

type Slide = {
  id: string;
  label: string;
  note?: string;
  visuals: ProjectBriefVisual[];
};

function linkLabel(href: string) {
  const host = href.toLowerCase();
  if (host.includes("github.com")) return "Repository";
  if (host.includes("youtu.be") || host.includes("youtube.com")) return "Video";
  if (host.includes("devpost.com")) return "Devpost";
  if (host.includes("arxiv.org")) return "Paper";
  return "Demo";
}

function projectLinks(project: Project) {
  const seen = new Set<string>();
  const links: { href: string; label: string }[] = [];
  for (const href of [project.githubUrl, project.liveUrl, project.youtubeUrl]) {
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label: linkLabel(href) });
  }
  return links;
}

function OutreachReviewDiagram() {
  const steps = [
    { title: "Scrape", detail: "Faculty pages" },
    { title: "Draft", detail: "Local model" },
    { title: "Review", detail: "Before any send" },
  ];
  return (
    <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-2xl border border-stone-200 bg-[#f6f1ea] px-4 py-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            {index + 1}
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">{step.title}</p>
          <p className="mt-1 text-sm text-stone-600">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function BriefVisual({ visual }: { visual: ProjectBriefVisual }) {
  if (visual.kind === "diagram") {
    return (
      <figure className="min-w-0">
        <OutreachReviewDiagram />
        <figcaption className="mt-2 text-sm leading-relaxed text-stone-600">
          {visual.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="min-w-0">
      <div className="flex items-center justify-center rounded-2xl bg-[#f6f1ea] p-2">
        {/* Native img: next/image has been returning 400 for some local photos. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visual.src}
          alt={visual.alt}
          className="max-h-[32rem] w-full object-contain"
          decoding="async"
        />
      </div>
      <figcaption className="mt-2 text-sm leading-relaxed text-stone-600">
        {visual.caption}
      </figcaption>
    </figure>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-zinc-800 sm:text-base">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectBrief({
  project,
  className = "mt-14",
}: {
  project: Project;
  className?: string;
}) {
  const brief = project.brief;
  const [index, setIndex] = useState(0);
  if (!brief) return null;

  const slides: Slide[] = [
    { id: "overview", label: "Overview", visuals: brief.visuals },
    ...(brief.slides ?? []),
  ];
  const safeIndex = index >= 0 && index < slides.length ? index : 0;
  const slide = slides[safeIndex];
  const multiple = slides.length > 1;
  const links = projectLinks(project);
  const hasVisuals = slide.visuals.length > 0;

  function go(next: number) {
    const count = slides.length;
    setIndex((next + count) % count);
  }

  return (
    <section
      id="at-a-glance"
      aria-roledescription={multiple ? "carousel" : undefined}
      aria-label="Project at a glance"
      className={`${className} scroll-mt-24 border-t border-amber-200/80 pt-10 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700`}
      tabIndex={multiple ? 0 : undefined}
      onKeyDown={
        multiple
          ? (event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                go(safeIndex + 1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(safeIndex - 1);
              }
            }
          : undefined
      }
      onTouchStart={
        multiple
          ? (event) => {
              const x = event.changedTouches[0]?.clientX;
              if (x === undefined) return;
              event.currentTarget.dataset.touchX = String(x);
            }
          : undefined
      }
      onTouchEnd={
        multiple
          ? (event) => {
              const start = Number(event.currentTarget.dataset.touchX);
              const end = event.changedTouches[0]?.clientX;
              if (!Number.isFinite(start) || end === undefined) return;
              const delta = end - start;
              if (delta < -48) go(safeIndex + 1);
              if (delta > 48) go(safeIndex - 1);
            }
          : undefined
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
        Project at a glance
      </p>

      <article className="mt-4 min-w-0 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-7">
        <div
          className={
            hasVisuals
              ? "grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10"
              : "min-w-0 max-w-3xl"
          }
        >
          <div className="min-w-0">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {[brief.context, project.date, project.buildStage].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-800 sm:text-base">
              {brief.what}
            </p>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              What I did
            </h3>
            <BulletList items={brief.contribution} />
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Where it stands
            </h3>
            <BulletList items={brief.results} />

            <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-sm text-stone-600">
              {brief.tech.map((item, itemIndex) => (
                <li key={item} className="flex items-center gap-2">
                  {itemIndex > 0 ? <span aria-hidden="true">·</span> : null}
                  {item}
                </li>
              ))}
            </ul>
            {links.length > 0 ? (
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                  >
                    {link.label}
                  </a>
                ))}
              </p>
            ) : null}
          </div>

          {hasVisuals ? (
            <div className="grid min-w-0 gap-4">
              {slide.note ? (
                <p className="text-sm leading-relaxed text-stone-600">{slide.note}</p>
              ) : null}
              {slide.visuals.map((visual) => (
                <BriefVisual
                  key={visual.kind === "image" ? visual.src : visual.id}
                  visual={visual}
                />
              ))}
            </div>
          ) : null}
        </div>

        {multiple ? (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-200 pt-4">
            <p className="text-sm text-stone-500" aria-live="polite">
              {slide.label}
              <span className="sr-only">, </span>
              <span aria-hidden="true"> · </span>
              {safeIndex + 1} / {slides.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(safeIndex - 1)}
                aria-label="Previous slide"
                className="rounded-full border border-stone-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => go(safeIndex + 1)}
                aria-label="Next slide"
                className="rounded-full border border-stone-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
