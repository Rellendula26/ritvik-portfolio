import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CoverFrame from "@/components/media/CoverFrame";
import ExperienceCard from "@/components/ExperienceCard";
import HomeHero from "@/components/HomeHero";
import ProjectCard from "@/components/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import TechChip from "@/components/motion/TechChip";
import { COURSES, courseHref } from "@/data/coursework";
import { FEATURED_EXPERIENCES } from "@/data/experiences";
import {
  FEATURED_PROJECTS,
  MAJOR_PROJECTS,
  SUPPORTING_PROJECTS,
} from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeHero />

      <section className="border-t border-stone-200/50 bg-[#faf6f0]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
          <Reveal>
            <p className="text-sm font-medium text-amber-800">Current work</p>
            <h2 className="text-display mt-2 text-3xl text-stone-950 md:text-4xl">
              Serpent, GRASP, and ADAPT
            </h2>
            <p className="mt-2 max-w-xl text-base text-stone-600">
              {`Serpent's arm and the logic and power boards have photos and notes. The bionic arm page has the September schematics. The AddLab printer page has the toolhead, the carousel clip, and the encoder drawing. The 360° imager page has the line-sensor bench and the flicker test. None of this work is finished.`}
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MAJOR_PROJECTS.filter((project) => !project.featured).map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects: darkest band */}
      <section className="border-t border-stone-200/50 bg-[#f0e8dc]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Core engineering work</p>
                <h2 className="text-display mt-2 text-3xl text-stone-950 md:text-4xl">
                  Embedded, robotics, and systems builds
                </h2>
              </div>
              <Link
                href="/projects"
                className="btn-lift inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                All projects
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {FEATURED_PROJECTS.map((project, i) => (
              <ProjectCard key={project.slug} project={project} featured index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* More builds: mid band */}
      <section className="border-t border-stone-200/40 bg-[#f7f2ea]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <Reveal>
            <div>
              <p className="text-sm font-medium text-amber-800/90">More project work</p>
              <h2 className="text-display mt-2 text-2xl text-stone-950 md:text-3xl">
                More builds
              </h2>
              <p className="mt-2 max-w-xl text-base text-stone-600">
                Supporting projects, research tools, and experiments that shaped how I build.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTING_PROJECTS.slice(0, 6).map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>

          <Reveal delay={0.08} className="mt-10 text-center">
            <Link
              href="/projects"
              className="btn-lift inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              View full project archive
              <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Experiences: clickable role cards */}
      <section className="border-t border-stone-200/40 bg-[#f7f2ea]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Official roles</p>
                <h2 className="text-display mt-2 text-3xl text-stone-950 md:text-4xl">
                  Experiences
                </h2>
                <p className="mt-2 max-w-xl text-base text-stone-600">
                  Internships and appointments; fewer entries, more ownership
                  under a real org.
                </p>
              </div>
              <Link
                href="/experiences"
                className="btn-lift inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                All experiences
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 flex flex-col gap-6">
            {FEATURED_EXPERIENCES.map((experience, i) => (
              <ExperienceCard
                key={experience.slug}
                experience={experience}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/50 bg-[#f7f1e8]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">Penn labs</p>
                <h2 className="text-display mt-2 text-3xl text-stone-950 md:text-4xl">
                  Coursework
                </h2>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-stone-600">
                  Measured devices and the circuits around them. The numbers below are the ones in the lab reports.
                </p>
              </div>
              <Link
                href="/coursework"
                className="btn-lift inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900"
              >
                All coursework
                <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {COURSES.map((course) => (
              <Link
                key={course.slug}
                href={courseHref(course.slug)}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                {course.cover ? (
                  <div className="p-3 pb-0">
                    <CoverFrame media={course.cover} sizes="(max-width: 768px) 100vw, 50vw" className="rounded-xl" />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-medium text-amber-800">
                  {course.code}
                  {course.semester ? ` · ${course.semester}` : ""}
                </p>
                <h3 className="text-display mt-1 text-2xl text-stone-950">{course.title}</h3>
                {course.highlights?.length ? (
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-stone-700">
                    {course.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lightest band */}
      <section className="border-t border-stone-200/30 bg-[#fdfbf7]">
        <div className="mx-auto max-w-6xl px-6 py-20 pb-24 md:px-8">
          <Reveal>
            <div className="rounded-3xl border border-stone-200/80 bg-stone-900 px-8 py-12 text-stone-300 md:px-12">
              <p className="text-sm font-medium text-amber-400/90">
                What I&apos;m usually thinking about
              </p>
              <p className="text-display mt-4 max-w-3xl text-2xl leading-snug text-white md:text-3xl">
                I keep coming back to a command, a sensor, and a motor or a rail that has to do what the code asked.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Electrical Engineering @ Penn",
                  "Robotics",
                  "Embedded systems",
                  "Electronics and power",
                  "Compilers and systems",
                ].map((t) => (
                  <TechChip key={t} variant="soft" className="rounded-full px-4 py-1.5 text-sm">
                    {t}
                  </TechChip>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
