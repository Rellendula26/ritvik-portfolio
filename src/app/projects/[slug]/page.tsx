import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import {
  BackToProjects,
  ProjectBadge,
  ProjectPageShell,
  SectionLabel,
} from "@/components/project-page/shared";
import {
  CATEGORY_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECTS,
  getProjectBySlug,
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
        className="h-full w-full object-cover object-top"
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

function InsightList({
  title,
  eyebrow,
  items,
}: {
  title: string;
  eyebrow: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <article className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function limitItems(items: string[], max: number) {
  return items.slice(0, max);
}

function Hero({ project }: { project: Project }) {
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

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            {project.oneLine}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-700">
            {project.overview}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Date", value: project.date },
              { label: "Signal", value: project.signal },
              { label: "Build stage", value: project.buildStage },
              { label: "Stack", value: project.techStack.slice(0, 2).join(", ") },
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
                Live / demo
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
          <div className="relative aspect-video w-full">
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} | Ritvik Ellendula`,
    description: project.oneLine,
  };
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const primaryMedia = pickProjectPrimaryMedia(project);
  const detailMedia = project.media.filter((item) => item !== primaryMedia);
  const architectureMedia =
    project.architectureImages?.map((src, index) => ({
      kind: "image" as const,
      src,
      alt: `${project.title} architecture ${index + 1}`,
      label: `Architecture ${index + 1}`,
      caption: `Architecture ${index + 1}`,
    })) ?? [];
  const imageGalleryMedia =
    project.imageGallery?.map((src, index) => ({
      kind: "image" as const,
      src,
      alt: `${project.title} gallery image ${index + 1}`,
      label: `Image ${index + 1}`,
      caption: `Image ${index + 1}`,
    })) ?? [];
  const videoGalleryMedia =
    project.videoGallery?.map((src, index) => ({
      kind: "video" as const,
      src,
      alt: `${project.title} gallery video ${index + 1}`,
      label: `Video ${index + 1}`,
      caption: `Video ${index + 1}`,
      poster: project.thumbnail,
    })) ?? [];

  return (
    <ProjectPageShell>
      <BackToProjects />
      <Hero project={project} />

      {process.env.NODE_ENV === "development" &&
        project.driveFolderUrl &&
        !project.localMediaImported && (
          <section className="mt-8 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-sm text-amber-900">
            Drive folder is linked, but local media has not been imported yet. Run the intake
            import workflow, then `npm run projects:intake:sync` so this page can render local
            assets.
          </section>
        )}

      <section className="mt-14">
        <SectionLabel>Project notes</SectionLabel>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <InsightList
            eyebrow="Highlights"
            title="What I built"
            items={limitItems(project.keyHighlights, 6)}
          />
          <InsightList
            eyebrow="Architecture"
            title="How the system works"
            items={limitItems(project.architecture, 6)}
          />
          <InsightList
            eyebrow="Challenges"
            title="What made it hard"
            items={limitItems(project.challenges, 5)}
          />
          <InsightList
            eyebrow="Lessons"
            title="What I learned"
            items={limitItems(project.lessonsLearned, 5)}
          />
        </div>
      </section>

      {project.technicalNotes.length > 0 && (
        <section className="mt-12">
          <SectionLabel>Stack / materials</SectionLabel>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 14).map((stackItem) => (
              <span
                key={stackItem}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700"
              >
                {stackItem}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5">
            <ul className="space-y-2 text-sm leading-relaxed text-amber-950">
              {limitItems(project.technicalNotes, 8).map((note) => (
                <li key={note} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.nextImprovements && project.nextImprovements.length > 0 && (
        <section className="mt-12">
          <SectionLabel>What I would improve next</SectionLabel>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-700">
              {limitItems(project.nextImprovements, 6).map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.buildNotes && project.buildNotes.length > 0 && (
        <section className="mt-12">
          <SectionLabel>Build log</SectionLabel>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-700">
              {limitItems(project.buildNotes, 7).map((note) => (
                <li key={note} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.debuggingNotes && project.debuggingNotes.length > 0 && (
        <section className="mt-12">
          <SectionLabel>What broke; how I fixed it</SectionLabel>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-700">
              {limitItems(project.debuggingNotes, 7).map((note) => (
                <li key={note} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {project.finalOutcome && (
        <section className="mt-12">
          <SectionLabel>What changed from v1 to now</SectionLabel>
          <p className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 text-sm leading-relaxed text-zinc-700 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            {project.finalOutcome}
          </p>
        </section>
      )}

      {project.driveFolderUrl && (
        <section className="mt-10">
          <SectionLabel>Intake source</SectionLabel>
          <a
            href={project.driveFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition hover:bg-orange-50"
          >
            Open Google Drive intake folder
          </a>
        </section>
      )}

      {architectureMedia.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Architecture media</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {architectureMedia.map((item, index) => (
              <div
                key={`${project.slug}-arch-${index}`}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {item.label}
                </div>
                <div className="relative h-[280px] w-full bg-[#070707] md:h-[340px]">
                  {renderMedia(item)}
                </div>
                {item.caption && (
                  <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {imageGalleryMedia.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Image gallery</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {imageGalleryMedia.map((item, index) => (
              <div
                key={`${project.slug}-image-${index}`}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {item.label}
                </div>
                <div className="relative h-[280px] w-full bg-[#070707] md:h-[340px]">
                  {renderMedia(item)}
                </div>
                {item.caption && (
                  <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {videoGalleryMedia.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Video gallery</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {videoGalleryMedia.map((item, index) => (
              <div
                key={`${project.slug}-video-${index}`}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {item.label}
                </div>
                <div className="relative h-[280px] w-full bg-[#070707] md:h-[340px]">
                  {renderMedia(item)}
                </div>
                {item.caption && (
                  <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {detailMedia.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Media timeline</SectionLabel>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Build photos, clips, and process visuals. The goal is to show how the project evolved, not just the final screenshot.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {detailMedia.map((item, index) => (
              <div
                key={`${project.slug}-${index}-${item.alt}`}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  {item.label ?? `Media ${index + 1}`}
                </div>
                <div className="relative h-[280px] w-full bg-[#070707] md:h-[340px]">
                  {renderMedia(item)}
                </div>
                {item.caption && (
                  <p className="border-t border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </ProjectPageShell>
  );
}
