import type { ReactNode } from "react";
import CaseStudyVideo from "@/components/project-page/CaseStudyVideo";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import { ProjectBadge, type ProjectMedia } from "@/components/project-page/shared";

export type SystemSection = {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  summary: string;
  responsibilities: string[];
  tools: string[];
  media: ProjectMedia;
  /** Animated or custom preview (overrides image/video media) */
  visual?: ReactNode;
};

export default function SystemBlock({
  section,
  reverse = false,
}: {
  section: SystemSection;
  reverse?: boolean;
}) {
  return (
    <section
      id={section.id}
      className="relative scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.08),transparent_24%)]" />
      <div
        className={`relative grid grid-cols-1 gap-6 p-5 md:p-6 lg:grid-cols-[1.05fr_0.95fr] ${
          reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
        }`}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-sm font-semibold text-orange-900 shadow-sm">
              {section.step}
            </span>
            <ProjectBadge tone="warm">{section.title.toUpperCase()}</ProjectBadge>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            {section.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-zinc-500">
            {section.subtitle}
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-700">
            {section.summary}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                What it handles
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                {section.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[8px] h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                Tools used
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {section.tools.map((tool) => (
                  <ProjectBadge key={tool}>{tool}</ProjectBadge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-orange-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-zinc-300" />
              <span className="ml-2 text-xs font-medium text-zinc-500">
                {section.title}
              </span>
            </div>

            <div className="relative h-[240px] w-full overflow-hidden bg-[#070707] md:h-[300px]">
              {section.visual ? (
                <div className="absolute inset-0">{section.visual}</div>
              ) : section.media.kind === "image" ? (
                <ProjectMediaImage
                  src={section.media.src}
                  alt={section.media.alt}
                  sizes="(max-width: 768px) 100vw, 480px"
                  className={
                    /\.jpe?g$/i.test(section.media.src)
                      ? "object-contain object-center p-2"
                      : "object-cover object-top"
                  }
                />
              ) : (
                <CaseStudyVideo
                  src={section.media.src}
                  poster={section.media.poster}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
