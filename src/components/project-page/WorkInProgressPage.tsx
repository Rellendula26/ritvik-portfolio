import Link from "next/link";
import { BackToProjects, ProjectBadge, ProjectPageShell } from "@/components/project-page/shared";

export default function WorkInProgressPage({
  title,
  description,
  github,
}: {
  title: string;
  description?: string;
  github?: string;
}) {
  return (
    <ProjectPageShell>
      <BackToProjects />

      <div className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white px-8 py-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.07)] md:px-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.14),transparent_45%)]" />

        <div className="relative">
          <ProjectBadge tone="warm">Work in progress</ProjectBadge>

          <h1 className="text-display mt-6 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-600">
            Project page work in progress — case study, gallery, and walkthrough
            coming soon.
          </p>

          {description && (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
              {description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex rounded-full border border-orange-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-orange-50"
            >
              ← Back to projects
            </Link>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                View source code
              </a>
            )}
          </div>
        </div>
      </div>
    </ProjectPageShell>
  );
}
