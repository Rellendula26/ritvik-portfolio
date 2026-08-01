import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import type { DisciplineBreakdown } from "@/data/engineering-case-study";

function DisciplineBlock({
  discipline,
  index,
}: {
  discipline: DisciplineBreakdown;
  index: number;
}) {
  const reverse = index % 2 === 1;

  return (
    <article
      id={discipline.id}
      className="relative scroll-mt-28 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.06),transparent_24%)]" />
      <div
        className={`relative grid gap-6 p-5 md:p-7 lg:grid-cols-[1.05fr_0.95fr] ${
          reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-sm font-semibold text-orange-900 shadow-sm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-900">
              {discipline.discipline}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            {discipline.discipline}
          </h3>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Goal
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{discipline.goal}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Design
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{discipline.design}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                  Challenges
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-700">
                  {discipline.challenges.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                  Iterations
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-700">
                  {discipline.iterations.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-amber-200/70 bg-amber-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                Final implementation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
                {discipline.finalImplementation}
              </p>
            </div>
          </div>
        </div>

        {discipline.media ? (
          <div className="flex items-center">
            <div className="flex w-full flex-col gap-4">
              {(Array.isArray(discipline.media)
                ? discipline.media
                : [discipline.media]
              ).map((item) => (
                <CaseStudyMediaFrame
                  key={`${item.kind}-${item.src}-${item.label ?? item.alt}`}
                  media={item}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden lg:block" />
        )}
      </div>
    </article>
  );
}

export default function EngineeringBreakdownSection({
  disciplines,
}: {
  disciplines: DisciplineBreakdown[];
}) {
  if (disciplines.length === 0) return null;

  return (
    <section id="engineering-breakdown" className="scroll-mt-28">
      <SectionLabel>Engineering Breakdown</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Broken down by discipline
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Each block covers the goal, the design, what broke, what changed, and what
          shipped.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {disciplines.map((discipline, index) => (
          <DisciplineBlock
            key={discipline.id}
            discipline={discipline}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
