import { SectionLabel } from "@/components/project-page/shared";
import type { DesignDecision } from "@/data/engineering-case-study";

export default function DesignDecisionsSection({
  decisions,
}: {
  decisions: DesignDecision[];
}) {
  if (decisions.length === 0) return null;

  return (
    <section id="design-decisions" className="scroll-mt-28">
      <SectionLabel>Key Design Decisions</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Why, not just what
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          The decisions that shaped the system — alternatives considered, tradeoffs
          accepted, and the reasoning that survived contact with reality.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {decisions.map((decision, index) => (
          <article
            key={decision.id}
            className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] md:p-7"
          >
            <div className="flex flex-wrap items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                {decision.title}
              </h3>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  The problem
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  {decision.problem}
                </p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Alternatives considered
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700">
                  {decision.alternatives.map((alt) => (
                    <li key={alt} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                      <span>{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                    Tradeoffs
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {decision.tradeoffs}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-orange-200 bg-orange-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-900">
                    Why I chose this
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-orange-950/90">
                    {decision.choice}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
