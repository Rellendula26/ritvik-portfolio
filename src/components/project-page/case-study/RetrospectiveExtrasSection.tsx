import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import { SectionLabel } from "@/components/project-page/shared";
import type {
  ExecutiveAssessment,
  RootCauseAnalysis,
  ScheduleAnalysis,
  TimelineEntry,
  TimelineSectionCopy,
  TransferableSkill,
  Version2Plan,
} from "@/data/engineering-case-study";

export function ExecutiveAssessmentSection({
  content,
}: {
  content: ExecutiveAssessment;
}) {
  return (
    <section id="executive-assessment" className="scroll-mt-40">
      <SectionLabel>At a Glance</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Shipped, hard parts, next revision
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "What shipped", body: content.shipped },
          { label: "What made it hard", body: content.difficulty },
          { label: "What changes next", body: content.next },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
              {item.label}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-700">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EngineeringTimelineSection({
  entries,
  copy,
}: {
  entries: TimelineEntry[];
  copy?: TimelineSectionCopy;
}) {
  if (entries.length === 0) return null;

  const title = copy?.title ?? "How the build actually went";
  const description =
    copy?.description ??
    "Dates below are reconstructed from notes and media.";

  return (
    <section id="engineering-timeline" className="scroll-mt-40">
      <SectionLabel>Timeline</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">{description}</p>
      </div>

      <ol className="relative mt-8 space-y-0 border-l border-zinc-200 pl-6">
        {entries.map((entry) => (
          <li key={entry.period} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[1.92rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-orange-400 bg-white" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
              {entry.period}
            </p>
            <p className="mt-2 text-base leading-relaxed text-zinc-800">{entry.work}</p>
            {entry.friction ? (
              <p className="mt-2 text-base leading-relaxed text-zinc-500">
                <span className="font-medium text-zinc-700">What slowed it: </span>
                {entry.friction}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RootCauseAnalysesSection({
  items,
}: {
  items: RootCauseAnalysis[];
}) {
  if (items.length === 0) return null;

  return (
    <section id="root-cause" className="scroll-mt-40">
      <SectionLabel>When It Broke</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          What failed
        </h2>
      </div>

      <div className="mt-8 space-y-10">
        {items.map((item) => (
          <article
            key={item.id}
            className="border-t border-zinc-200 pt-6"
          >
            <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {item.title}
            </h3>
            <dl className="mt-5 max-w-3xl space-y-5 text-base leading-relaxed">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What I saw
                </dt>
                <dd className="mt-1.5 text-zinc-800">{item.symptoms}</dd>
              </div>
              {item.alsoConsidered ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    What else could look like that
                  </dt>
                  <dd className="mt-1.5 text-zinc-800">{item.alsoConsidered}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What I checked
                </dt>
                <dd className="mt-1.5 text-zinc-800">{item.method}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What that narrowed it to
                </dt>
                <dd className="mt-1.5 text-zinc-800">{item.rootCause}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  What I took from it
                </dt>
                <dd className="mt-1.5 text-zinc-800">{item.improvement}</dd>
              </div>
              {item.notYet ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
                    Checks I have not run
                  </dt>
                  <dd className="mt-1.5 text-zinc-800">{item.notYet}</dd>
                </div>
              ) : null}
            </dl>
            {item.media ? (
              <div className="mt-5">
                <CaseStudyMediaFrame media={item.media} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ScheduleAnalysisSection({
  content,
}: {
  content: ScheduleAnalysis;
}) {
  return (
    <section id="schedule-analysis" className="scroll-mt-40">
      <SectionLabel>What Took Time</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Where the calendar went
        </h2>
        {content.note ? (
          <p className="mt-2 text-base leading-relaxed text-zinc-600">{content.note}</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Had to happen",
            items: content.required,
            tone: "border-zinc-200 bg-white",
          },
          {
            label: "I could have prevented",
            items: content.preventable,
            tone: "border-orange-200 bg-orange-50/50",
          },
          {
            label: "Environment around me",
            items: content.organizational,
            tone: "border-zinc-200 bg-zinc-50/80",
          },
        ].map((column) => (
          <div
            key={column.label}
            className={`rounded-[1.75rem] border p-5 shadow-[0_14px_40px_rgba(0,0,0,0.05)] ${column.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
              {column.label}
            </p>
            <ul className="mt-4 space-y-3">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-base leading-relaxed text-zinc-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Version2PlanSection({ content }: { content: Version2Plan }) {
  return (
    <section id="version-2" className="scroll-mt-40">
      <SectionLabel>Version 2</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          How I would build the next one
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">{content.target}</p>
      </div>

      <ol className="mt-8 space-y-3">
        {content.phases.map((phase, index) => (
          <li
            key={phase.name}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-zinc-900">{phase.name}</h3>
              {phase.hours ? (
                <span className="text-xs font-medium text-zinc-500">{phase.hours}</span>
              ) : null}
            </div>
            <p className="mt-2 text-base leading-relaxed text-zinc-700">{phase.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
        <div className="border-b border-zinc-200 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Design changes I would make
          </p>
        </div>
        <div className="divide-y divide-zinc-100">
          {content.upgrades.map((upgrade) => (
            <div
              key={upgrade.area}
              className="grid gap-2 px-5 py-4 md:grid-cols-[8rem_1fr_1fr]"
            >
              <p className="text-sm font-semibold text-zinc-900">{upgrade.area}</p>
              <p className="text-base leading-relaxed text-zinc-700">{upgrade.change}</p>
              <p className="text-base leading-relaxed text-zinc-500">{upgrade.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TransferableSkillsSection({
  skills,
}: {
  skills: TransferableSkill[];
}) {
  if (skills.length === 0) return null;

  return (
    <section id="transferable-skills" className="scroll-mt-40">
      <SectionLabel>What This Built</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Habits I want to keep carrying
        </h2>
        <p className="mt-2 text-base leading-relaxed text-zinc-600">
          Not a résumé keyword list. These are the instincts this build forced.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <article
            key={skill.context}
            className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.05)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
              {skill.context}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-700">{skill.evidence}</p>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">{skill.phrasing}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
