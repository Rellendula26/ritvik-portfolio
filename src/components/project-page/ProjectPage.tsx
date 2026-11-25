import type { ReactNode } from "react";
import Link from "next/link";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import { BackToProjects, ProjectPageShell } from "@/components/project-page/shared";
import type { CaseStudyMedia } from "@/data/engineering-case-study";
import type { ProjectPageContent } from "@/data/project-page-content";
import { getProjectsForExperience, type ProjectMedia } from "@/data/projects";
import { getExperience } from "@/data/experiences";
import {
  Collapsible,
  DecisionTable,
  FailureCard,
  Prose,
  SplitRow,
  StatCallout,
} from "@/components/project-page/rhythm";

function MediaFrame({ media, priority = false }: { media: ProjectMedia | CaseStudyMedia; priority?: boolean }) {
  if (media.kind === "visual" && "visualId" in media) {
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
        poster={"poster" in media ? media.poster : undefined}
      />
    );
  }

  const contain = "fit" in media && media.fit === "contain";
  return (
    <ProjectMediaImage
      src={media.src}
      alt={media.alt}
      priority={priority}
      expandable={contain}
      className={contain ? "object-contain object-center bg-white" : "object-cover object-center"}
      sizes="(max-width: 768px) 100vw, 720px"
    />
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-stone-200/80 pt-8">
      <h2 className="text-display text-2xl text-stone-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-base leading-relaxed text-stone-800">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One project page. The recruiter card and the six body sections stay short.
 * `log` is the existing write-up, collapsed.
 */
export default function ProjectPage({
  content,
  experienceSlug,
  log,
}: {
  content: ProjectPageContent;
  experienceSlug?: string;
  log?: ReactNode;
}) {
  const experience = experienceSlug ? getExperience(experienceSlug) : undefined;
  const related = experienceSlug
    ? getProjectsForExperience(experienceSlug).filter((item) => item.slug !== content.slug)
    : [];
  const meta = [content.role, content.dates, content.status, content.org].filter(Boolean);
  const showHero = Boolean(content.hero && (content.hero.kind === "visual" || ("src" in content.hero && content.hero.src)));

  return (
    <ProjectPageShell>
      <BackToProjects />
      <header className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
        <div
          className={[
            "grid gap-8 px-6 py-8 md:px-8 md:py-10",
            showHero ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-start" : "",
          ].join(" ")}
        >
          <div className="min-w-0">
            <h1 className="text-display text-4xl text-stone-950 md:text-5xl">{content.title}</h1>
            {content.description ? (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-stone-700">{content.description}</p>
            ) : null}
            {meta.length ? (
              <p className="mt-4 text-sm font-medium text-stone-600">
                {content.role ? <span>{content.role}</span> : null}
                {content.role && (content.dates || content.status || content.org) ? " · " : null}
                {content.dates ? <span>{content.dates}</span> : null}
                {content.dates && (content.status || content.org) ? " · " : null}
                {content.status ? <span>{content.status}</span> : null}
                {content.status && content.org ? " · " : null}
                {content.org && experience ? (
                  <Link
                    href={`/experiences/${experience.slug}`}
                    className="text-amber-800 underline decoration-amber-300/80 underline-offset-4"
                  >
                    {content.org}
                  </Link>
                ) : content.org ? (
                  <span>{content.org}</span>
                ) : null}
              </p>
            ) : null}
            {content.stack.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {content.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-xs text-stone-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {content.bullets.length ? (
              <div className="mt-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">Key outcomes</h2>
                <BulletList items={content.bullets} />
              </div>
            ) : null}
            {content.links.length ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {content.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-lift inline-flex rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-stone-800 hover:border-amber-300 hover:bg-amber-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {showHero && content.hero ? (
            <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-[#f7f1e8]">
              <div
                className={
                  content.hero.kind === "image" && "portrait" in content.hero && content.hero.portrait
                    ? "relative aspect-[3/4] max-h-[32rem]"
                    : "relative aspect-video"
                }
              >
                <MediaFrame media={content.hero} priority />
              </div>
              {"caption" in content.hero && content.hero.caption ? (
                <figcaption className="border-t border-stone-200 px-4 py-3 text-xs leading-relaxed text-stone-600">
                  {content.hero.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </header>

      {content.stats.length ? (
        <div className="mt-8">
          <StatCallout items={content.stats} />
        </div>
      ) : null}

      {content.overview ? (
        <Section title="Project overview">
          <SplitRow media={content.figures[0]}>
            <Prose text={content.overview} />
          </SplitRow>
        </Section>
      ) : null}

      {content.subsystems.length || content.diagram || content.dataFlow ? (
        <Section title="System architecture">
          <SplitRow media={content.diagram ?? content.figures[1]}>
            {content.dataFlow ? <p className="text-base leading-relaxed text-stone-800">{content.dataFlow}</p> : null}
            {content.subsystems.length ? (
              <dl className="mt-3 space-y-3">
                {content.subsystems.map((item) => (
                  <div key={item.name}>
                    <dt className="text-sm font-semibold text-stone-950">{item.name}</dt>
                    <dd className="text-sm leading-relaxed text-stone-700">{item.role}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </SplitRow>
        </Section>
      ) : null}

      {content.decisionRows.length ? (
        <Section title="Engineering decisions">
          <DecisionTable rows={content.decisionRows} />
        </Section>
      ) : null}

      {content.contribution || content.depthNote ? (
        <Section title="Implementation">
          <SplitRow media={content.figures[content.diagram ? 1 : 2]} flip>
            {content.contribution ? <Prose text={content.contribution} /> : null}
            {content.depthNote ? (
              <p className="mt-3 text-base leading-relaxed text-stone-800">{content.depthNote}</p>
            ) : null}
          </SplitRow>
        </Section>
      ) : null}

      {content.failures.length ? (
        <Section title="Debugging and validation">
          <div className="space-y-5">
            {content.failures.map((item) => (
              <FailureCard key={item.title} {...item} />
            ))}
          </div>
        </Section>
      ) : content.broke.length ? (
        <Section title="Debugging and validation">
          <BulletList items={content.broke} />
        </Section>
      ) : null}

      {content.results || content.nextSteps.length ? (
        <Section title="Results and future work">
          <SplitRow media={content.resultsMedia} flip>
            {content.results ? <Prose text={content.results} /> : null}
            {content.limitations ? (
              <p className="mt-3 text-base leading-relaxed text-stone-800">
                <span className="font-medium text-stone-950">Still open. </span>
                {content.limitations}
              </p>
            ) : null}
            {content.nextSteps.length ? <BulletList items={content.nextSteps} /> : null}
          </SplitRow>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Related work">
          <ul className="flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-800 hover:border-amber-300 hover:bg-amber-50"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {log ? <Collapsible title="Full engineering log">{log}</Collapsible> : null}
    </ProjectPageShell>
  );
}
