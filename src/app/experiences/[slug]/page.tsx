import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import LazyVideo from "@/components/LazyVideo";
import TechChip from "@/components/motion/TechChip";
import { Reveal } from "@/components/motion/Reveal";
import {
  EXPERIENCES,
  EXPERIENCE_KIND_LABELS,
  EXPERIENCE_TRACK_LABELS,
  getExperience,
  type ExperienceMedia,
} from "@/data/experiences";

export function generateStaticParams() {
  return EXPERIENCES.map((experience) => ({ slug: experience.slug }));
}

function MediaBlock({ item }: { item: ExperienceMedia }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-950/5">
      <div className="relative aspect-[16/10] bg-stone-900">
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
            className="object-cover object-center"
          />
        )}
      </div>
      {item.caption ? (
        <figcaption className="border-t border-stone-200/70 bg-white/80 px-4 py-3 text-xs leading-relaxed text-stone-600">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) notFound();

  const kindLabel = EXPERIENCE_KIND_LABELS[experience.kind];
  const trackLabel = EXPERIENCE_TRACK_LABELS[experience.track];
  const gallery = experience.gallery?.length
    ? experience.gallery
    : [experience.cover];

  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
        <Link
          href="/experiences"
          className="btn-lift inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-950"
        >
          <ArrowLeft className="h-4 w-4" />
          All experiences
        </Link>

        {/* Executive summary — recruiter skim first (no fade gate above the fold) */}
        <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-stone-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-700">
                  {kindLabel}
                </span>
                <span className="rounded-sm border border-amber-200 bg-amber-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-950">
                  {trackLabel}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
                  {experience.dates}
                </span>
                {experience.location ? (
                  <>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-500">
                      {experience.location}
                    </span>
                  </>
                ) : null}
              </div>

            <h1 className="text-display mt-4 text-4xl text-stone-950 md:text-5xl">
              {experience.org}
            </h1>
            <p className="mt-2 text-lg font-medium text-stone-700 md:text-xl">
              {experience.role}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-800 md:text-lg">
              {experience.oneLiner}
            </p>

            <div className="mt-8 rounded-2xl border border-stone-200/80 bg-white/75 p-6 md:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                Executive summary
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-[15px]">
                {experience.overview}
              </p>

              <ul className="mt-5 space-y-3">
                {experience.highlights.map((item) => (
                  <li
                    key={item}
                    className="relative pl-4 text-sm leading-relaxed text-stone-700 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {experience.focus?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {experience.focus.map((tag) => (
                    <TechChip
                      key={tag}
                      variant="light"
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {tag}
                    </TechChip>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {experience.relatedProjects?.map((project) => {
                const external = project.href.startsWith("http");
                const className =
                  "btn-lift inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-950";

                return external ? (
                  <a
                    key={project.href}
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {project.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link key={project.href} href={project.href} className={className}>
                    {project.label}
                    <ArrowRight className="btn-arrow h-4 w-4" />
                  </Link>
                );
              })}
              {experience.externalHref ? (
                <a
                  href={experience.externalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-lift inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900"
                >
                  {experience.org} site
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-900 shadow-sm">
            <div className="relative aspect-[4/3]">
              {experience.cover.kind === "video" ? (
                <LazyVideo
                  src={experience.cover.src}
                  poster={experience.cover.poster}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  playWhenVisible
                />
              ) : (
                <Image
                  src={experience.cover.src}
                  alt={experience.cover.alt}
                  fill
                  priority
                  unoptimized={experience.cover.src.endsWith(".svg")}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
              )}
            </div>
          </div>
        </section>

        {/* Proof media */}
        <section className="mt-16 border-t border-stone-200/70 pt-12">
          <Reveal>
            <div>
              <p className="text-sm font-medium text-amber-800">Proof</p>
              <h2 className="text-display mt-2 text-2xl text-stone-950 md:text-3xl">
                Pictures and demos from the role
              </h2>
              <p className="mt-2 max-w-xl text-sm text-stone-600">
                Visual evidence first; deeper engineering write-ups live on the
                related project pages.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {gallery.map((item) => (
              <MediaBlock key={`${item.kind}-${item.src}`} item={item} />
            ))}
          </div>
        </section>

        {experience.relatedProjects?.length ? (
          <section className="mt-16 border-t border-stone-200/70 pt-12 pb-8">
            <Reveal>
              <p className="text-sm font-medium text-amber-800">Go deeper</p>
              <h2 className="text-display mt-2 text-2xl text-stone-950">
                Related project case studies
              </h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {experience.relatedProjects.map((project) => {
                  const external = project.href.startsWith("http");
                  const className =
                    "btn-lift inline-flex items-center justify-between gap-4 rounded-xl border border-stone-200/80 bg-white/80 px-5 py-4 text-sm font-medium text-stone-900 hover:border-amber-300";

                  return external ? (
                    <a
                      key={project.href}
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className={className}
                    >
                      {project.label}
                      <ArrowUpRight className="h-4 w-4 text-amber-800" />
                    </a>
                  ) : (
                    <Link key={project.href} href={project.href} className={className}>
                      {project.label}
                      <ArrowRight className="btn-arrow h-4 w-4 text-amber-800" />
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </section>
        ) : null}
      </main>
    </div>
  );
}
