import type { Metadata } from "next";
import Link from "next/link";
import CoverFrame from "@/components/media/CoverFrame";
import { COURSES, courseHref } from "@/data/coursework";

export const metadata: Metadata = {
  title: "Coursework | Ritvik Ellendula",
  description:
    "Penn labs with the measurements attached: band gaps, LEDs, a silicon cell, and the circuits around them.",
};

export default function CourseworkPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-amber-800">Penn</p>
        <h1 className="text-display mt-2 text-4xl text-stone-950 md:text-5xl">
          Coursework
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          Two Fall 2026 courses, with the reports attached. ESE 2180 is semiconductors
          on a spectrophotometer, a laser bench, and a solar cell. ESE 2150 is the
          circuits those devices sit in, from a Wheatstone bridge to an LM324AN
          comparator and a 3-bit DAC.
        </p>
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {COURSES.map((course) => (
          <li key={course.slug}>
            <Link
              href={courseHref(course.slug)}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              {course.cover ? (
                <div className="p-3">
                  <CoverFrame media={course.cover} sizes="(max-width: 768px) 100vw, 50vw" className="rounded-xl" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col px-6 py-6">
                <p className="text-sm font-medium text-amber-800">
                  {course.code}
                  {course.semester ? ` · ${course.semester}` : ""}
                </p>
                <h2 className="text-display mt-1 text-2xl text-stone-950 group-hover:text-amber-900 md:text-3xl">
                  {course.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone-700">
                  {course.description}
                </p>
                {course.highlights?.length ? (
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-stone-800">
                    {course.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
