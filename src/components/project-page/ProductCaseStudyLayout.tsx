import type { ReactNode } from "react";
import CaseStudyVideo from "@/components/project-page/CaseStudyVideo";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import type { CaseStudyData } from "@/data/case-studies";
import SystemBlock, { type SystemSection } from "@/components/project-page/SystemBlock";
import {
  ActionLink,
  AnchorNav,
  BackToProjects,
  BrowserFrame,
  ProjectBadge,
  ProjectPageShell,
  SectionLabel,
  type LinkItem,
  type ProjectMedia,
} from "@/components/project-page/shared";

function caseLabel(signal: string) {
  const map: Record<string, string> = {
    Systems: "SYSTEMS PROJECT CASE STUDY",
    "ML Systems": "ML SYSTEMS CASE STUDY",
    Robotics: "ROBOTICS PROJECT CASE STUDY",
    Hardware: "HARDWARE PROJECT CASE STUDY",
    "Full-Stack": "FULL-STACK CASE STUDY",
    "ML + Tools": "TOOLS + ML CASE STUDY",
    Embedded: "EMBEDDED PROJECT CASE STUDY",
  };
  return map[signal] ?? "PROJECT CASE STUDY";
}

function heroMediaFromStudy(study: CaseStudyData): ProjectMedia | null {
  if (study.heroVideo) {
    return {
      kind: "video",
      src: study.heroVideo.src,
      poster: study.heroVideo.poster,
      alt: study.title,
    };
  }
  if (study.heroImage) {
    return {
      kind: "image",
      src: study.heroImage.src,
      alt: study.heroImage.alt,
    };
  }
  return null;
}

function mediaPool(study: CaseStudyData): ProjectMedia[] {
  const pool: ProjectMedia[] = [];
  const hero = heroMediaFromStudy(study);
  if (hero) pool.push(hero);
  for (const img of study.gallery ?? []) {
    pool.push({ kind: "image", src: img.src, alt: img.alt });
  }
  if (pool.length === 0) {
    pool.push({
      kind: "image",
      src: "/projects/website-cover.png",
      alt: study.title,
    });
  }
  return pool;
}

function systemsFromStudy(study: CaseStudyData): SystemSection[] {
  const pool = mediaPool(study);
  const blocks = [
    {
      id: "overview",
      step: "01",
      title: study.problem.title,
      subtitle: study.problem.eyebrow,
      summary: study.problem.body ?? study.positioning,
      responsibilities: study.problem.bullets ?? [],
      tools: study.tags.slice(0, 5),
    },
    {
      id: "technical",
      step: "02",
      title: study.technical.title,
      subtitle: study.technical.eyebrow,
      summary: study.technical.body ?? study.impact[0],
      responsibilities: study.technical.bullets ?? [],
      tools: study.stack,
    },
    {
      id: "build",
      step: "03",
      title: study.build.title,
      subtitle: study.build.eyebrow,
      summary: study.build.body ?? study.results.title,
      responsibilities: study.build.bullets ?? [],
      tools: study.stack.slice(0, 4),
    },
  ];

  return blocks.map((block, index) => ({
    ...block,
    media: pool[index % pool.length],
  }));
}

function defaultActions(study: CaseStudyData): LinkItem[] {
  const actions: LinkItem[] = [
    { label: "SYSTEMS", href: "#systems" },
    { label: "GALLERY", href: "#gallery" },
  ];
  if (study.github) {
    actions.unshift({ label: "SOURCE CODE", href: study.github });
  }
  if (study.demo) {
    actions.unshift({ label: "LIVE DEMO", href: study.demo });
  }
  return actions;
}

export default function ProductCaseStudyLayout({
  study,
  systems: systemsOverride,
  actions: actionsOverride,
  extraTags,
  heroVisual,
}: {
  study: CaseStudyData;
  systems?: SystemSection[];
  actions?: LinkItem[];
  extraTags?: string[];
  heroVisual?: ReactNode;
}) {
  const hero = heroVisual ? null : heroMediaFromStudy(study);
  const systems = systemsOverride ?? systemsFromStudy(study);
  const actions = actionsOverride ?? defaultActions(study);
  const gallery = study.gallery ?? [];

  const navItems = [
    { id: "systems", label: "Systems" },
    ...(gallery.length > 0 ? [{ id: "gallery", label: "Gallery" }] : []),
    { id: "results", label: "Results" },
  ];

  return (
    <ProjectPageShell>
      <BackToProjects />

      <header className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.10),transparent_28%)]" />
        <div className="relative grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-8">
          <div>
            <ProjectBadge tone="dark">{caseLabel(study.signal)}</ProjectBadge>

            <h1 className="text-display mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              {study.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
              {study.positioning}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(extraTags ?? study.tags).map((tag) => (
                <ProjectBadge key={tag}>{tag}</ProjectBadge>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Role", value: study.role },
                { label: "Timeline", value: study.timeline },
                { label: "Stack", value: study.stack.slice(0, 2).join(", ") },
                { label: "Outcome", value: study.impact[0] },
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
              {actions.map((action) => (
                <ActionLink key={action.label} {...action} />
              ))}
            </div>

            <AnchorNav items={navItems} />
          </div>

          {heroVisual ? (
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-[#070707] shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-orange-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-zinc-300" />
                <span className="ml-2 text-xs font-medium text-zinc-500">
                  Pipeline preview
                </span>
              </div>
              <div className="relative aspect-video w-full">{heroVisual}</div>
            </div>
          ) : (
            hero && <BrowserFrame label="Product preview" media={hero} />
          )}
        </div>
      </header>

      <section id="systems" className="mt-14 space-y-5">
        <SectionLabel>System breakdown</SectionLabel>
        {systems.map((section, index) => (
          <SystemBlock
            key={section.id}
            section={section}
            reverse={index % 2 === 1}
          />
        ))}
      </section>

      <section id="results" className="mt-14 scroll-mt-28">
        <SectionLabel>Results & lessons</SectionLabel>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {study.results.eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-900">
              {study.results.title}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700">
              {study.results.bullets?.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {study.lessons.eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-900">
              {study.lessons.title}
            </h3>
            {study.lessons.body && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {study.lessons.body}
              </p>
            )}
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700">
              {study.lessons.bullets?.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {study.pipeline && (
          <pre className="mt-5 overflow-x-auto rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 font-mono text-xs leading-relaxed text-amber-950 md:text-sm">
            {study.pipeline}
          </pre>
        )}
      </section>

      {gallery.length > 0 && (
        <section id="gallery" className="mt-16 scroll-mt-28">
          <SectionLabel>Gallery</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {gallery.map((item, index) => {
              const isVideo =
                item.kind === "video" || item.src.endsWith(".mp4") || item.src.endsWith(".MP4");
              return (
                <div
                  key={item.src}
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-orange-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-zinc-300" />
                    <span className="ml-2 text-xs font-medium text-zinc-500">
                      {item.label ?? `Screen ${index + 1}`}
                    </span>
                  </div>
                  <div className="relative h-[280px] w-full bg-[#070707] md:h-[340px]">
                    {isVideo ? (
                      <video
                        src={item.src}
                        className="h-full w-full object-cover object-top"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <ProjectMediaImage
                        src={item.src}
                        alt={item.alt}
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </ProjectPageShell>
  );
}
