import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import type { EvolutionMilestone } from "@/data/engineering-case-study";

export default function EvolutionSection({
  milestones,
}: {
  milestones: EvolutionMilestone[];
}) {
  if (milestones.length === 0) return null;

  return (
    <section id="evolution" className="scroll-mt-28">
      <SectionLabel>Evolution</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          How it got here
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Bench bring-up, CAD fits, soldering, and the demos in between. Not just the
          final photo.
        </p>
      </div>

      <div className="relative mt-10">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-orange-300 via-zinc-200 to-transparent md:left-1/2" />

        <ol className="space-y-10">
          {milestones.map((milestone, index) => {
            const onRight = index % 2 === 1;

            return (
              <li
                key={milestone.id}
                className={`relative grid gap-6 md:grid-cols-2 ${
                  onRight ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div
                  className={`absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-orange-400 bg-white shadow-sm md:left-1/2 ${
                    onRight ? "" : ""
                  }`}
                />

                <div className={`pl-10 md:pl-0 ${onRight ? "md:pl-10" : "md:pr-10"}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
                    {milestone.phase}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                    {milestone.description}
                  </p>
                </div>

                <div className={`pl-10 md:pl-0 ${onRight ? "md:pr-10" : "md:pl-10"}`}>
                  {milestone.media ? (
                    <CaseStudyMediaFrame
                      media={milestone.media}
                      className="aspect-video w-full"
                    />
                  ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-white/60 px-5 py-8 text-sm text-zinc-500">
                      No media for this milestone yet.
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
