import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReportReader from "@/components/coursework/ReportReader";
import CoverFrame from "@/components/media/CoverFrame";
import {
  COURSES,
  getCourse,
  getFeaturedLabs,
  getLabsForCourse,
  labHref,
} from "@/data/coursework";

export function generateStaticParams() {
  return COURSES.map((course) => ({ course: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.code}: ${course.title} | Ritvik Ellendula`,
    description: course.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const featured = getFeaturedLabs(course);
  const labs = getLabsForCourse(course.slug);
  const banner = course.hero ?? course.cover;
  const coverLab = course.coverLabSlug
    ? labs.find((lab) => lab.slug === course.coverLabSlug)
    : undefined;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <p className="text-sm text-stone-600">
        <Link
          href="/coursework"
          className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Coursework
        </Link>
      </p>
      <header className={`mt-8 grid gap-8 ${banner ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start" : ""}`}>
        <div className="max-w-3xl">
        <p className="text-sm font-medium text-amber-800">{course.code}</p>
        <h1 className="text-display mt-2 text-4xl text-stone-950 md:text-5xl">
          {course.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          {course.description}
        </p>
        {course.highlights?.length ? (
          <ul className="mt-5 space-y-2 text-base leading-relaxed text-stone-800">
            {course.highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {course.semester || course.tools?.length ? (
          <p className="mt-4 text-sm text-stone-600">
            {[course.semester, course.tools?.join(", ")].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        </div>
        {banner ? (
        <figure>
          {coverLab ? (
            <Link
              href={labHref(course.slug, coverLab.slug)}
              className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              <CoverFrame
                media={banner}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Link>
          ) : (
            <CoverFrame
              media={banner}
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          )}
          {banner.caption ? (
            <figcaption className="mt-3 text-sm leading-relaxed text-stone-600">
              {banner.caption}
              {coverLab ? (
                <>
                  {" "}
                  <Link
                    href={labHref(course.slug, coverLab.slug)}
                    className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4"
                  >
                    Open Lab {coverLab.number}
                  </Link>
                </>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
        ) : null}
      </header>

      {featured.length ? (
        <section id="featured-labs" className="mt-14 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Featured labs</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {featured.map((lab) => (
              <li key={lab.slug}>
                <Link
                  href={labHref(course.slug, lab.slug)}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  {lab.thumbnail ? (
                    <div className="relative aspect-[16/9] bg-white">
                      <Image
                        src={lab.thumbnail.src}
                        alt={lab.thumbnail.alt}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    {lab.devOnly ? (
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
                        Development sample
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-stone-500">Lab {lab.number}</p>
                    <h3 className="text-display mt-1 text-xl text-stone-950">{lab.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-stone-700">
                      {lab.description}
                    </p>
                    {lab.takeaway ? (
                      <p className="mt-3 text-base leading-relaxed text-stone-600">{lab.takeaway}</p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="labs" className="mt-14 scroll-mt-40">
        <h2 className="text-display text-2xl text-stone-950">All labs</h2>
        {labs.length === 0 ? (
          <p className="mt-4 max-w-xl text-sm text-stone-600">
            Lab pages will show up here once the reports are added.
          </p>
        ) : (
          <ol className="mt-6 divide-y divide-stone-200/80 border-y border-stone-200/80">
            {labs.map((lab) => (
              <li key={lab.slug} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start">
                {lab.thumbnail ? (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={lab.thumbnail.src}
                      alt={lab.thumbnail.alt}
                      fill
                      className="object-contain p-1"
                      sizes="112px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-stone-500">
                    Lab {lab.number}
                    {lab.devOnly ? " · Development sample" : ""}
                    {lab.report ? " · Report available" : ""}
                  </p>
                  <h3 className="text-display mt-1 text-xl text-stone-950">{lab.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-stone-700">{lab.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <Link
                      href={labHref(course.slug, lab.slug)}
                      className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                    >
                      Open lab
                    </Link>
                  </div>
                  {lab.report ? (
                    <div className="mt-4">
                      <ReportReader
                        href={lab.report.href}
                        title={`${course.code} lab ${lab.number} report`}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
