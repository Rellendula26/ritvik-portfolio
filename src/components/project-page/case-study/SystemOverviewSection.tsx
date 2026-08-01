import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import type { SystemOverviewContent } from "@/data/engineering-case-study";

export default function SystemOverviewSection({
  content,
}: {
  content: SystemOverviewContent;
}) {
  return (
    <section id="system-overview" className="scroll-mt-28">
      <SectionLabel>System Overview</SectionLabel>
      <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.08),transparent_28%)]" />
        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
              How the system fits together
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">{content.summary}</p>

            <div className="mt-7 space-y-3">
              {content.subsystems.map((subsystem, index) => (
                <div
                  key={subsystem.name}
                  className="flex gap-4 rounded-[1.25rem] border border-zinc-200 bg-zinc-50/80 px-4 py-3"
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-xs font-semibold text-orange-900">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{subsystem.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                      {subsystem.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {(content.dataFlow || content.controlFlow) && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {content.dataFlow && (
                  <div className="rounded-[1.25rem] border border-amber-200/80 bg-amber-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                      Data flow
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
                      {content.dataFlow}
                    </p>
                  </div>
                )}
                {content.controlFlow && (
                  <div className="rounded-[1.25rem] border border-zinc-200 bg-zinc-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                      Control flow
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      {content.controlFlow}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {content.diagram && (
            <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <CaseStudyMediaFrame
                media={content.diagram}
                className="aspect-[4/3] w-full md:aspect-video"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
