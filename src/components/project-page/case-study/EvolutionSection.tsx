import { SectionLabel } from "@/components/project-page/shared";
import { Timeline } from "@/components/project-page/rhythm";
import { capWords } from "@/data/experience-summary";
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
          The steps I can put in order from the notes. A clip opens from its still.
        </p>
      </div>

      <div className="mt-8">
        <Timeline
          steps={milestones.map((milestone) => ({
            id: milestone.id,
            date: milestone.phase,
            title: milestone.title,
            text: capWords(milestone.description, 40),
            media: milestone.media,
          }))}
        />
      </div>
    </section>
  );
}
