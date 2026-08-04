import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import { SectionLabel } from "@/components/project-page/shared";
import type {
  ExecutiveAssessment,
  RootCauseAnalysis,
  ScheduleAnalysis,
  TimelineEntry,
  TransferableSkill,
  Version2Plan,
} from "@/data/engineering-case-study";

export function ExecutiveAssessmentSection({
  content,
}: {
  content: ExecutiveAssessment;
}) {
  return (
    <section id="executive-assessment" className="scroll-mt-28">
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
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EngineeringTimelineSection({
  entries,
}: {
  entries: TimelineEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <section id="engineering-timeline" className="scroll-mt-28">
      <SectionLabel>Timeline</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          How the summer actually went
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          June 11 to July 28. Part-time, with one travel week in the middle. Dates below are
          reconstructed from notes and media.
        </p>
      </div>

      <ol className="relative mt-8 space-y-0 border-l border-zinc-200 pl-6">
        {entries.map((entry) => (
          <li key={entry.period} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[1.92rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-orange-400 bg-white" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
              {entry.period}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-800">{entry.work}</p>
            {entry.friction ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
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
    <section id="root-cause" className="scroll-mt-28">
      <SectionLabel>When It Broke</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Failures that looked the same until I measured
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          A quiet motor, a dead SSH session, and a bad joint all feel like “it just does not
          work.” The job was proving which layer actually failed.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-xl font-semibold tracking-tight text-zinc-900">
              {item.title}
            </h3>
            <dl className="mt-5 space-y-4 text-sm leading-relaxed">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  What I saw
                </dt>
                <dd className="mt-1.5 text-zinc-700">{item.symptoms}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  What it actually was
                </dt>
                <dd className="mt-1.5 text-zinc-700">{item.rootCause}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  How I isolated it
                </dt>
                <dd className="mt-1.5 text-zinc-700">{item.method}</dd>
              </div>
              <div className="rounded-[1.25rem] border border-orange-200 bg-orange-50/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-900">
                  What I would do next time
                </dt>
                <dd className="mt-1.5 text-orange-950/90">{item.improvement}</dd>
              </div>
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
    <section id="what-took-time" className="scroll-mt-28">
      <SectionLabel>What Took Time</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Where the calendar went
        </h2>
        {content.note ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{content.note}</p>
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
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-zinc-700">
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
    <section id="version-2" className="scroll-mt-28">
      <SectionLabel>Version 2</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          How I would build the next one
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{content.target}</p>
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
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{phase.body}</p>
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
              <p className="text-sm leading-relaxed text-zinc-700">{upgrade.change}</p>
              <p className="text-sm leading-relaxed text-zinc-500">{upgrade.benefit}</p>
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
    <section id="transferable-skills" className="scroll-mt-28">
      <SectionLabel>What This Built</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Habits I want to keep carrying
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
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
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{skill.evidence}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{skill.phrasing}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
