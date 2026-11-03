import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import LazyVideo from "@/components/LazyVideo";
import CoverFrame from "@/components/media/CoverFrame";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import {
  EXPERIENCE_KIND_LABELS,
  type Experience,
  type ExperienceMedia,
  type TextRun,
} from "@/data/experiences";
import {
  PROJECT_STATUS_LABELS,
  getProjectBySlug,
  pickProjectPrimaryMedia,
  type Project,
  type ProjectMedia,
} from "@/data/projects";

/** Gap between major sections: ~32px mobile, ~48px desktop, plus sticky-nav clearance. */
const sectionClass = "scroll-mt-36 border-t border-stone-200/70 pt-8 md:scroll-mt-32 md:pt-12";

const textLinkClass =
  "font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-amber-700";

const WEBSITE_LABEL = {
  company: "Visit company website",
  lab: "Visit lab website",
  organization: "Visit organization website",
} as const;

function RichText({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, index) => {
        if (typeof run === "string") return <span key={index}>{run}</span>;
        if ("projectSlug" in run) {
          const project = getProjectBySlug(run.projectSlug);
          if (!project) return <span key={index}>{run.projectSlug}</span>;
          return (
            <Link key={index} href={project.href} className={textLinkClass}>
              {project.title}
            </Link>
          );
        }
        return (
          <a
            key={index}
            href={run.href}
            target="_blank"
            rel="noreferrer"
            className={textLinkClass}
          >
            {run.label}
          </a>
        );
      })}
    </>
  );
}

function hasRealMedia(media: ProjectMedia | undefined) {
  if (!media) return false;
  if (media.kind === "visual") return true;
  return Boolean(media.src && !media.src.includes("placeholder-media"));
}

function CompactProjectLink({ project }: { project: Project }) {
  const media = pickProjectPrimaryMedia(project);
  const showMedia = hasRealMedia(media);
  const contain = media && media.kind === "image" && media.fit === "contain";

  return (
    <Link
      href={project.href}
      className="flex items-center gap-3 rounded-xl border border-stone-200/80 bg-white p-2.5 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-amber-700"
    >
      {showMedia && media ? (
        <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f7f1e8]">
          {media.kind === "visual" ? (
            <ProjectCardVisual visualId={media.visualId} className="h-full w-full" />
          ) : media.kind === "video" ? (
            <video
              src={media.src}
              poster={media.poster}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="none"
            />
          ) : (
            <ProjectMediaImage
              src={media.src}
              alt=""
              className={contain ? "object-contain object-center p-1" : "object-cover object-center"}
              sizes="96px"
            />
          )}
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-stone-950">{project.title}</span>
        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          {PROJECT_STATUS_LABELS[project.status]}
          {project.writeUp === "coming-soon" ? " · Write-up coming soon" : ""}
        </span>
      </span>
    </Link>
  );
}

function WorkSplit({
  aside,
  children,
}: {
  aside?: ReactNode;
  children: ReactNode;
}) {
  if (!aside) {
    return <div className="mx-auto max-w-2xl">{children}</div>;
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
      <div className="max-w-2xl">{children}</div>
      {aside}
    </div>
  );
}

function MediaFigure({ item }: { item: ExperienceMedia }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
      <div
        className={`relative aspect-[16/10] ${
          item.kind === "image" && item.fit === "contain" ? "bg-[#f7f1e8]" : "bg-stone-900"
        }`}
      >
        {item.kind === "video" ? (
          <LazyVideo
            src={item.src}
            poster={item.poster}
            className="absolute inset-0 h-full w-full object-contain object-center"
            playWhenVisible
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            unoptimized={item.src.endsWith(".svg")}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={
              item.fit === "contain"
                ? "object-contain object-center"
                : "object-cover object-center"
            }
          />
        )}
      </div>
      {item.caption ? (
        <figcaption className="border-t border-stone-200/70 px-4 py-3 text-xs leading-relaxed text-stone-600">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function ExperiencePage({
  experience,
  projects,
}: {
  experience: Experience;
  projects: Project[];
}) {
  const inlineMedia = new Set(
    [
      ...(experience.examples ?? []).map((example) => example.media?.src),
      ...(experience.work ?? []).map((section) => section.media?.src),
    ].filter((src): src is string => Boolean(src))
  );
  const banner = experience.hero ?? experience.cover;
  if (experience.cover) inlineMedia.add(experience.cover.src);
  if (banner) inlineMedia.add(banner.src);

  const gallery = (experience.gallery ?? []).filter((item) => !inlineMedia.has(item.src));
  const work = experience.work ?? [];
  const paragraphs = work.length ? [] : (experience.roleParagraphs ?? []);
  const bullets = work.length ? [] : (experience.roleBullets ?? []);
  const examples = experience.examples ?? [];
  const hasWorkCopy = work.length > 0 || paragraphs.length > 0 || bullets.length > 0;
  const workHasAside = work.some((section) => section.media) || examples.some((example) => example.media);

  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-6 py-6 md:px-8 md:py-8">
        <Link
          href="/experiences"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-amber-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All experiences
        </Link>

        <header
          className={
            banner?.src
              ? "mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8"
              : "mx-auto mt-5 max-w-2xl"
          }
        >
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
              {EXPERIENCE_KIND_LABELS[experience.kind]}
              <span className="text-stone-300"> · </span>
              <span className="text-stone-600">{experience.dates}</span>
              {experience.location ? (
                <>
                  <span className="text-stone-300"> · </span>
                  <span className="text-stone-600">{experience.location}</span>
                </>
              ) : null}
            </p>
            <h1 className="text-display mt-2 text-4xl text-stone-950 md:text-5xl">
              {experience.org}
            </h1>
            <p className="mt-2 text-lg font-medium text-stone-700 md:text-xl">{experience.role}</p>
            {experience.about?.length ? (
              <p className="mt-3 text-base leading-relaxed text-stone-700 md:text-base">
                <RichText runs={experience.about} />
              </p>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-stone-800 md:text-lg">
                {experience.oneLiner}
              </p>
            )}
            {experience.externalHref && experience.websiteKind ? (
              <a
                href={experience.externalHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-amber-700"
              >
                {WEBSITE_LABEL[experience.websiteKind]}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>

          {banner?.src ? (
            <figure>
              <CoverFrame
                media={banner}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {banner.caption ? (
                <figcaption className="mt-3 text-xs leading-relaxed text-stone-600">
                  {banner.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </header>

        {hasWorkCopy ? (
          <section id="role" className={sectionClass}>
            <div className={workHasAside ? undefined : "mx-auto max-w-2xl"}>
            <h2 className="text-display text-2xl text-stone-950 md:text-3xl">
              My work
            </h2>
            {work.length ? (
              <div className="mt-4 space-y-6 md:mt-5 md:space-y-8">
                {work.map((section) => (
                  <WorkSplit
                    key={section.title}
                    aside={section.media ? <MediaFigure item={section.media} /> : null}
                  >
                    <h3 className="text-display text-xl text-stone-950">{section.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-stone-700 md:text-base">
                      <RichText runs={section.body} />
                    </p>
                  </WorkSplit>
                ))}
              </div>
            ) : (
              <WorkSplit>
                <div className="space-y-3">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed text-stone-700 md:text-base">
                      <RichText runs={paragraph} />
                    </p>
                  ))}
                </div>
                {bullets.length ? (
                  <ul className="mt-4 space-y-2">
                    {bullets.map((bullet, index) => (
                      <li
                        key={index}
                        className="relative pl-4 text-base leading-relaxed text-stone-800 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-700"
                      >
                        <RichText runs={bullet} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </WorkSplit>
            )}
            </div>
          </section>
        ) : null}

        {experience.tools?.length ? (
          <section id="tools" className={sectionClass}>
            <div className={workHasAside ? "max-w-3xl" : "mx-auto max-w-2xl"}>
              <h2 className="text-display text-2xl text-stone-950 md:text-3xl">Tools I used</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {experience.tools.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-sm text-stone-800"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {experience.deepDive ? (
          <section id="deep-dive" className={sectionClass}>
            <WorkSplit
              aside={
                experience.deepDive.media ? (
                  <MediaFigure item={experience.deepDive.media} />
                ) : null
              }
            >
              <h2 className="text-display text-2xl text-stone-950 md:text-3xl">A closer look</h2>
              <h3 className="text-display mt-3 text-xl text-stone-950">{experience.deepDive.title}</h3>
              <div className="mt-2 space-y-3">
                {experience.deepDive.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-base leading-relaxed text-stone-700 md:text-base">
                    <RichText runs={paragraph} />
                  </p>
                ))}
              </div>
            </WorkSplit>
          </section>
        ) : null}

        {projects.length ? (
          <section id="projects" className={sectionClass}>
            <h2 className="text-display text-2xl text-stone-950 md:text-3xl">Related projects</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {projects.map((project) => (
                <CompactProjectLink key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {examples.length ? (
          <section id="challenges" className={sectionClass}>
            <div className={examples.some((example) => example.media) ? undefined : "mx-auto max-w-2xl"}>
            <h2 className="text-display text-2xl text-stone-950 md:text-3xl">
              What I learned
            </h2>
            <div className="mt-4 space-y-6 md:mt-5 md:space-y-8">
              {examples.map((example) => (
                <WorkSplit
                  key={example.title}
                  aside={example.media ? <MediaFigure item={example.media} /> : null}
                >
                  <h3 className="text-display text-xl text-stone-950">{example.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-stone-700">
                    <span className="font-medium text-stone-900">Problem. </span>
                    {example.problem}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-stone-700">
                    <span className="font-medium text-stone-900">Approach. </span>
                    <RichText runs={example.approach} />
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-stone-700">
                    <span className="font-medium text-stone-900">Outcome. </span>
                    <RichText runs={example.outcome} />
                  </p>
                </WorkSplit>
              ))}
            </div>
            </div>
          </section>
        ) : null}

        {gallery.length ? (
          <section id="gallery" className={sectionClass}>
            <h2 className="text-display text-2xl text-stone-950 md:text-3xl">Photos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {gallery.map((item) => (
                <MediaFigure key={`${item.kind}-${item.src}`} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
