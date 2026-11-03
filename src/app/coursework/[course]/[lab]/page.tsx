import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReportReader from "@/components/coursework/ReportReader";
import {
  LABS,
  courseHref,
  getCourse,
  getLab,
  getLabsForCourse,
  labHref,
  type LabDownload,
} from "@/data/coursework";

export function generateStaticParams() {
  return LABS.map((lab) => ({ course: lab.courseSlug, lab: lab.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lab: string }>;
}): Promise<Metadata> {
  const { course, lab } = await params;
  const record = getLab(course, lab);
  const parent = getCourse(course);
  if (!record || !parent) return {};
  return {
    title: `${parent.code} Lab ${record.number}: ${record.title} | Ritvik Ellendula`,
    description: record.description,
  };
}

function DownloadLink({ file }: { file: LabDownload }) {
  return (
    <a
      href={file.href}
      download
      className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
    >
      {file.label}
    </a>
  );
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ course: string; lab: string }>;
}) {
  const { course: courseSlug, lab: labSlug } = await params;
  const course = getCourse(courseSlug);
  const lab = getLab(courseSlug, labSlug);
  if (!course || !lab) notFound();

  const labs = getLabsForCourse(course.slug);
  const index = labs.findIndex((item) => item.slug === lab.slug);
  const previous = index > 0 ? labs[index - 1] : undefined;
  const next = index >= 0 && index < labs.length - 1 ? labs[index + 1] : undefined;
  const downloads = [lab.latexSource, lab.data, lab.code, lab.simulation].filter(
    (file): file is LabDownload => Boolean(file)
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
      <p className="text-sm text-stone-600">
        <Link
          href="/coursework"
          className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Coursework
        </Link>
        <span aria-hidden> / </span>
        <Link
          href={courseHref(course.slug)}
          className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          {course.code}
        </Link>
      </p>

      <header className="mt-4">
        {lab.devOnly ? (
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
            Development sample. Not a published lab.
          </p>
        ) : null}
        <p className="mt-2 text-sm text-stone-500">Lab {lab.number}</p>
        <h1 className="text-display mt-2 text-4xl text-stone-950">{lab.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">{lab.description}</p>
      </header>

      {lab.objective ? (
        <section id="objective" className="mt-12 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Objective</h2>
          <p className="mt-3 text-base leading-relaxed text-stone-700">{lab.objective}</p>
        </section>
      ) : null}

      {lab.takeaway ? (
        <section id="takeaway" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Takeaway</h2>
          <p className="mt-3 text-base leading-relaxed text-stone-700">{lab.takeaway}</p>
        </section>
      ) : null}

      {lab.setup ? (
        <section id="setup" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Setup</h2>
          <p className="mt-3 text-base leading-relaxed text-stone-700">{lab.setup}</p>
        </section>
      ) : null}

      {lab.media?.length ? (
        <section id="figures" className="mt-10 scroll-mt-40 space-y-6">
          {lab.media.map((item) => (
            <figure key={item.src} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="relative aspect-[4/3] bg-stone-50">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </div>
              {item.caption ? (
                <figcaption className="border-t border-stone-200 px-4 py-3 text-xs text-stone-600">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </section>
      ) : null}

      {lab.equation ? (
        <section id="equation" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Equation</h2>
          <p className="mt-3 font-serif text-xl text-stone-900">{lab.equation}</p>
        </section>
      ) : null}

      {lab.discussion ? (
        <section id="discussion" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Discussion</h2>
          <p className="mt-3 text-base leading-relaxed text-stone-700">{lab.discussion}</p>
        </section>
      ) : null}

      {lab.report ? (
        <section id="report" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Report</h2>
          <div className="mt-4">
            <ReportReader
              href={lab.report.href}
              title={`${course.code} lab ${lab.number} report`}
            />
          </div>
        </section>
      ) : null}

      {downloads.length ? (
        <section id="files" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Files</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {downloads.map((file) => (
              <DownloadLink key={file.href} file={file} />
            ))}
          </div>
        </section>
      ) : null}

      {lab.references?.length ? (
        <section id="references" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">References</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-700">
            {lab.references.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {lab.collaborators?.length ? (
        <section id="credits" className="mt-10 scroll-mt-40">
          <h2 className="text-display text-2xl text-stone-950">Credits</h2>
          <p className="mt-3 text-sm text-stone-700">{lab.collaborators.join(", ")}</p>
        </section>
      ) : null}

      <nav className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6 text-sm">
        {previous ? (
          <Link
            href={labHref(course.slug, previous.slug)}
            className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Lab {previous.number}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={courseHref(course.slug)}
          className="font-medium text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Back to {course.code}
        </Link>
        {next ? (
          <Link
            href={labHref(course.slug, next.slug)}
            className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Lab {next.number}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
