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
    <section id="evolution" className="scroll-mt-40">
      <SectionLabel>Evolution</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          How it got here
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          The steps I can put in order from the notes.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-orange-300 via-zinc-200 to-transparent" />

        <ol className="space-y-8">
          {milestones.map((milestone) => {
            return (
              <li
                key={milestone.id}
                className={`relative pl-10 ${
                  milestone.media ? "grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start" : ""
                }`}
              >
                <div className="absolute left-4 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-orange-400 bg-white shadow-sm" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
                    {milestone.phase}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
                    {milestone.description}
                  </p>
                </div>

                {milestone.media ? (
                  <CaseStudyMediaFrame
                    media={milestone.media}
                    className={
                      milestone.media.portrait
                        ? undefined
                        : "aspect-video w-full"
                    }
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
