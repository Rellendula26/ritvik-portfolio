import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHero from "@/components/HomeHero";
import ProjectCard from "@/components/ProjectCard";
import {
  FEATURED_PROJECTS,
  SUPPORTING_PROJECTS,
} from "@/data/projects";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeHero />

      {/* Featured projects: darkest band */}
      <section className="border-t border-stone-200/50 bg-[#f0e8dc]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Recent work</p>
              <h2 className="text-display mt-2 text-3xl text-stone-950 md:text-4xl">
                Projects I&apos;m especially proud of
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              All projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

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
          <div>
            <p className="text-sm font-medium text-amber-800/90">Also worth a look</p>
            <h2 className="text-display mt-2 text-2xl text-stone-950 md:text-3xl">
              More builds
            </h2>
            <p className="mt-2 max-w-xl text-base text-stone-600">
              Apps, tools, and experiments that still taught me a lot.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORTING_PROJECTS.slice(0, 6).map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              View full project archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightest band */}
      <section className="border-t border-stone-200/30 bg-[#fdfbf7]">
        <div className="mx-auto max-w-6xl px-6 py-20 pb-24 md:px-8">
          <div className="rounded-3xl border border-stone-200/80 bg-stone-900 px-8 py-12 text-stone-300 md:px-12">
            <p className="text-sm font-medium text-amber-400/90">
              What I&apos;m usually thinking about
            </p>
            <p className="text-display mt-4 max-w-3xl text-2xl leading-snug text-white md:text-3xl">
              How can I create things that can provide utility to life? Whether its practical application or just fun usage.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "Medical devices",
                "Embedded & robotics",
                "Systems & compilers",
                "Machine learning",
                "Dance & music",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-stone-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
