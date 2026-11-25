import type { ReactNode } from "react";
import Link from "next/link";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import { BackToProjects, ProjectPageShell } from "@/components/project-page/shared";
import type { CaseStudyMedia } from "@/data/engineering-case-study";
import type { ProjectPageContent } from "@/data/project-page-content";
import type { ProjectMedia } from "@/data/projects";
import { getExperience } from "@/data/experiences";

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
      <div className="mt-3 max-w-3xl text-base leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
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
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">What I did</h2>
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

      {content.overview ? (
        <Section title="Overview">
          <p>{content.overview}</p>
          {content.diagram ? (
            <figure className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="relative aspect-[4/3] bg-[#f7f1e8]">
                <MediaFrame media={content.diagram} />
              </div>
              {content.diagram.caption ? (
                <figcaption className="border-t border-stone-200 px-4 py-3 text-xs leading-relaxed text-stone-600">
                  {content.diagram.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </Section>
      ) : null}

      {content.contribution ? (
        <Section title="My contribution">
          <p>{content.contribution}</p>
        </Section>
      ) : null}

      {content.decisions.length ? (
        <Section title="Key design decisions">
          <BulletList items={content.decisions} />
        </Section>
      ) : null}

      {content.broke.length ? (
        <Section title="What broke and how I fixed it">
          <BulletList items={content.broke} />
        </Section>
      ) : null}

      {content.results ? (
        <Section title="Results">
          <p>{content.results}</p>
          {content.limitations ? (
            <p className="mt-3">
              <span className="font-medium text-stone-950">Limitations. </span>
              {content.limitations}
            </p>
          ) : null}
        </Section>
      ) : null}

      {content.nextSteps.length ? (
        <Section title="Next steps">
          <BulletList items={content.nextSteps} />
        </Section>
      ) : null}

      {log ? (
        <details className="mt-12 rounded-[1.5rem] border border-stone-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
          <summary className="cursor-pointer list-none px-5 py-4 text-lg font-semibold text-stone-950 [&::-webkit-details-marker]:hidden">
            <span className="mr-2 text-amber-800" aria-hidden>
              +
            </span>
            Full engineering log
          </summary>
          <div className="border-t border-stone-200 px-3 py-6 md:px-5">{log}</div>
        </details>
      ) : null}
    </ProjectPageShell>
  );
}
