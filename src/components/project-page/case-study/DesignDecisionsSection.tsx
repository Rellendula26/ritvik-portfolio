import { SectionLabel } from "@/components/project-page/shared";
import type { DesignDecision } from "@/data/engineering-case-study";

export default function DesignDecisionsSection({
  decisions,
}: {
  decisions: DesignDecision[];
}) {
  if (decisions.length === 0) return null;

  return (
    <section id="design-decisions" className="scroll-mt-40">
      <SectionLabel>Key Design Decisions</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Design decisions
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          What was on the table, what got picked, and what that choice costs.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1.3fr)] gap-4 border-b border-zinc-200 bg-[#f7f1e8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 lg:grid">
          <p>Decision</p>
          <p>Problem</p>
          <p>Alternatives</p>
          <p>Tradeoff and choice</p>
        </div>
        {decisions.map((decision) => (
          <article
            key={decision.id}
            className="grid gap-3 border-t border-zinc-200 px-4 py-4 first:border-t-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,1.3fr)] lg:gap-4 lg:first:border-t"
          >
            <h3 className="text-base font-semibold text-zinc-950">{decision.title}</h3>
            <p className="text-base leading-relaxed text-zinc-700">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 lg:hidden">
                Problem
              </span>
              {decision.problem}
            </p>
            <ul className="space-y-1.5 text-base leading-relaxed text-zinc-700">
              <li className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 lg:hidden">
                Alternatives
              </li>
              {decision.alternatives.map((alt) => (
                <li key={alt}>{alt}</li>
              ))}
            </ul>
            <div className="space-y-2 text-base leading-relaxed text-zinc-800">
              <p>{decision.tradeoffs}</p>
              <p className="font-medium text-zinc-950">{decision.choice}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
