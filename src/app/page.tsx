import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import EngineeringWorkbench from "@/components/lab/EngineeringWorkbench";
import ProjectCard from "@/components/ProjectCard";
import {
  FEATURED_PROJECTS,
  SUPPORTING_PROJECTS,
} from "@/data/projects";

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-amber-800 underline decoration-amber-300/80 underline-offset-4">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero: text + photo side by side, bench centered below */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 md:px-8 md:pt-16">
        <div className="grid items-stretch gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex min-h-0 flex-col justify-between">
            <div>
              <h1 className="text-display text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl lg:text-[3.35rem] lg:leading-[1.08]">
                Hey, I&apos;m Ritvik!
              </h1>

              <div className="mt-8 space-y-5 text-lg leading-8 text-stone-700">
                <p>
                  I&apos;m studying EE with potential minors in{" "}
                  <Accent>Engineering Entrepreneurship</Accent>, <Accent>Math</Accent>,
                  and <Accent>South Asian Studies</Accent>. I hope to build impactful, innovative, and equitable medical device technologies.
                </p>

                <p>
                  I like creating projects and doing work that have applications in my everyday life, use a little creativity, and teach me new skills.
                </p>

                <p>
                  If you&apos;re looking into embedded, robotics, medtech, or systems
                  work,{" "}
                  <Link
                    href="/projects"
                    className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 hover:text-amber-900"
                  >
                    my projects
                  </Link>{" "}
                  are where I show what I can do. If you&apos;re just browsing, hope you enjoy some of the things I've created.
                </p>
              </div>
            </div>

            <a
              href="mailto:rellen26@seas.upenn.edu"
              data-cursor
              className="mt-10 inline-flex items-center gap-2 text-base font-medium text-amber-800 transition hover:text-amber-900 lg:mt-12"
            >
              <Mail className="h-5 w-5 shrink-0" />
              <span>
                Let&apos;s connect:{" "}
                <span className="underline decoration-amber-300/80 underline-offset-4">
                  rellen26@seas.upenn.edu
                </span>
              </span>
            </a>
          </div>

          <div
            className="group relative flex min-h-[380px] md:min-h-[420px]"
            data-cursor
          >
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-amber-200/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-4 shadow-md">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
                <Image
                  src="/ritvik.jpg"
                  alt="Ritvik Ellendula"
                  fill
                  className="object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <p className="mt-4 text-center text-base font-semibold text-stone-900">
                Ritvik Ellendula
              </p>
              <p className="pb-1 text-center text-sm text-stone-500">
                Building stuff I find cool.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-xl md:mt-16 lg:max-w-2xl" data-cursor>
          <EngineeringWorkbench />
        </div>
      </section>

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
