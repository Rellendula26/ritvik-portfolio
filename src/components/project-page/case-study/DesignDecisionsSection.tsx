import { SectionLabel } from "@/components/project-page/shared";
import { DecisionTable } from "@/components/project-page/rhythm";
import { capWords } from "@/data/experience-summary";
import type { DesignDecision } from "@/data/engineering-case-study";

export default function DesignDecisionsSection({
  decisions,
}: {
  decisions: DesignDecision[];
}) {
  if (decisions.length === 0) return null;

  const rows = decisions.map((decision) => ({
    decision: capWords(decision.title, 20),
    alternative: capWords(decision.alternatives[0] || decision.problem, 20),
    why: capWords(decision.choice || decision.tradeoffs, 20),
  }));

  return (
    <section id="design-decisions" className="scroll-mt-40">
      <SectionLabel>Key Design Decisions</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Design decisions
        </h2>
      </div>

      <div className="mt-6">
        <DecisionTable rows={rows} />
      </div>

      <details className="mt-4 rounded-2xl border border-stone-200 bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-stone-950 [&::-webkit-details-marker]:hidden">
          Notes on these decisions
        </summary>
        <div className="space-y-6 border-t border-stone-200 px-4 py-4">
          {decisions.map((decision) => (
            <article key={decision.id}>
              <h3 className="font-semibold text-stone-950">{decision.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">{decision.problem}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">{decision.tradeoffs}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-800">{decision.choice}</p>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
