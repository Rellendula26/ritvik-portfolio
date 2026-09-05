"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import type { DesignChallengeExtras } from "@/data/engineering-case-study";

function TodoChip({ label = "TODO" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-amber-400/80 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-900">
      {label}
    </span>
  );
}

function EngineeringFlowDiagram({
  title,
  stages,
}: {
  title?: string;
  stages: NonNullable<DesignChallengeExtras["flowStages"]>;
}) {
  return (
    <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-7">
      {title ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {title}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center gap-3 md:contents">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.15rem] border border-zinc-200 bg-zinc-50/90 px-4 py-3 md:flex-none md:min-w-[8.5rem]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-[10px] font-semibold text-orange-950">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-zinc-900">{stage.label}</span>
            </div>
            {index < stages.length - 1 ? (
              <>
                <span
                  aria-hidden
                  className="hidden h-px w-6 bg-gradient-to-r from-orange-400 to-orange-200 md:inline-block"
                />
                <span
                  aria-hidden
                  className="ml-3.5 h-5 w-px bg-gradient-to-b from-orange-400 to-orange-200 md:hidden"
                />
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureBlocks({
  title,
  intro,
  blocks,
}: {
  title?: string;
  intro?: string;
  blocks: NonNullable<DesignChallengeExtras["architectureBlocks"]>;
}) {
  return (
    <div>
      <h3 className="text-display text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
        {title ?? "Circuit architecture"}
      </h3>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{intro}</p>
      ) : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {blocks.map((block) => (
          <article
            key={block.id}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow] hover:border-orange-300/80 hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
              {block.title}
            </p>
            <p className="mt-2 text-base font-semibold leading-snug text-zinc-950">
              {block.question}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{block.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function DatasheetComparison({
  comparison,
}: {
  comparison: NonNullable<DesignChallengeExtras["datasheetComparison"]>;
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="border-b border-zinc-200 bg-zinc-50/80 px-5 py-4 md:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Datasheet comparison
        </p>
        <h3 className="text-display mt-2 text-2xl font-semibold text-zinc-950">
          {comparison.partA}{" "}
          <span className="text-zinc-400">vs</span> {comparison.partB}
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Exact numbers left as placeholders until datasheet values are filled in.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <th className="px-7 py-3 font-semibold">Metric</th>
              <th className="px-4 py-3 font-semibold">{comparison.partA}</th>
              <th className="px-4 py-3 font-semibold">{comparison.partB}</th>
              <th className="px-7 py-3 font-semibold">Why it matters</th>
            </tr>
          </thead>
          <tbody>
            {comparison.metrics.map((metric) => (
              <tr key={metric.id} className="border-b border-zinc-100 align-top">
                <td className="px-7 py-4 font-semibold text-zinc-900">{metric.label}</td>
                <td className="px-4 py-4 text-zinc-700">
                  {metric.valueA ?? <TodoChip label="TODO · datasheet" />}
                </td>
                <td className="px-4 py-4 text-zinc-700">
                  {metric.valueB ?? <TodoChip label="TODO · datasheet" />}
                </td>
                <td className="px-7 py-4 text-zinc-600">{metric.whyItMatters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 md:hidden">
        {comparison.metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-[1.25rem] border border-zinc-200 bg-zinc-50/70 p-4"
          >
            <p className="font-semibold text-zinc-950">{metric.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600">{metric.whyItMatters}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
                <p className="font-semibold text-zinc-500">{comparison.partA}</p>
                <p className="mt-1 text-zinc-800">
                  {metric.valueA ?? <TodoChip />}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2">
                <p className="font-semibold text-zinc-500">{comparison.partB}</p>
                <p className="mt-1 text-zinc-800">
                  {metric.valueB ?? <TodoChip />}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmiSection({
  emi,
}: {
  emi: NonNullable<DesignChallengeExtras["emi"]>;
}) {
  return (
    <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {emi.title ?? "Understanding EMI"}
      </p>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-zinc-950 px-5 py-8 text-zinc-100">
          <div className="pointer-events-none absolute inset-x-8 top-6 flex justify-center gap-3 text-orange-300/80">
            <span className="text-lg tracking-[0.35em]">~ ~ ~</span>
          </div>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300/90">
            Radiated EMI
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-semibold">
              Buck converter
            </div>
            <span className="hidden text-orange-300 sm:inline">→</span>
            <span className="text-orange-300 sm:hidden">↓</span>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-sm">
              Nearby analog / CAN
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-orange-300">↓</span>
            <div className="rounded-xl border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-center text-sm">
              5 V rail → sensor / MCU
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200/90">
              Conducted noise on the supply path
            </p>
          </div>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-700">
          <div>
            <p className="font-semibold text-zinc-950">Conducted noise</p>
            <p className="mt-1">{emi.conducted}</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-950">Radiated noise</p>
            <p className="mt-1">{emi.radiated}</p>
          </div>
          <p className="rounded-[1.15rem] border border-orange-200/80 bg-orange-50/70 px-4 py-3 text-zinc-800">
            {emi.context}
          </p>
        </div>
      </div>
    </div>
  );
}

function VerificationTable({
  rows,
}: {
  rows: NonNullable<DesignChallengeExtras["verificationRows"]>;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-[1.5rem] border border-zinc-200 md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <th className="px-5 py-3 font-semibold">Requirement</th>
              <th className="px-5 py-3 font-semibold">Design mechanism</th>
              <th className="px-5 py-3 font-semibold">Verification method</th>
              <th className="px-5 py-3 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.requirement} className="border-b border-zinc-100 align-top">
                <td className="px-5 py-4 font-medium text-zinc-900">{row.requirement}</td>
                <td className="px-5 py-4 text-zinc-600">{row.mechanism}</td>
                <td className="px-5 py-4 text-zinc-600">{row.method}</td>
                <td className="px-5 py-4 text-zinc-700">
                  {row.result ?? <TodoChip label="TODO · result" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div
            key={row.requirement}
            className="rounded-[1.25rem] border border-zinc-200 bg-white p-4"
          >
            <p className="font-semibold text-zinc-950">{row.requirement}</p>
            <p className="mt-2 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-800">Mechanism:</span> {row.mechanism}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-800">Method:</span> {row.method}
            </p>
            <p className="mt-2 text-xs text-zinc-700">
              {row.result ?? <TodoChip label="TODO · result" />}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function IterationTimeline({
  title,
  intro,
  steps,
}: {
  title?: string;
  intro?: string;
  steps: NonNullable<DesignChallengeExtras["iterationSteps"]>;
}) {
  return (
    <div>
      <h3 className="text-display text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
        {title ?? "Iteration"}
      </h3>
      {intro ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">{intro}</p>
      ) : null}
      <ol className="relative mt-8 space-y-0 border-l-2 border-orange-300/80 pl-6">
        {steps.map((step, index) => (
          <li key={step.id} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[1.95rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-orange-400 bg-orange-100 text-[10px] font-bold text-orange-950">
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-zinc-950">{step.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StageCards({
  cards,
}: {
  cards: NonNullable<DesignChallengeExtras["stageCards"]>;
}) {
  const [openId, setOpenId] = useState<string | null>(cards[0]?.id ?? null);

  return (
    <div className="grid gap-3">
      {cards.map((card) => {
        const open = openId === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => setOpenId(open ? null : card.id)}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.03)] transition-[border-color] hover:border-orange-300/80"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-zinc-950">{card.title}</p>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                {open ? "Hide" : "What / Why"}
              </span>
            </div>
            {open ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.1rem] border border-zinc-200 bg-zinc-50/80 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    What it does
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{card.what}</p>
                </div>
                <div className="rounded-[1.1rem] border border-orange-200/80 bg-orange-50/60 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900">
                    Why the system needs it
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{card.why}</p>
                </div>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function InverterSwitchingDemo() {
  const states = [
    {
      id: "u-high",
      label: "U high / V low",
      path: "U high-side and V low-side conduct; current leaves U and returns through V.",
    },
    {
      id: "v-high",
      label: "V high / W low",
      path: "V high-side and W low-side conduct; phase relationship rotates around the DC bus.",
    },
    {
      id: "w-high",
      label: "W high / U low",
      path: "W high-side and U low-side conduct; the inverter synthesizes the next sector.",
    },
  ];
  const [active, setActive] = useState(states[0].id);
  const current = states.find((s) => s.id === active) ?? states[0];

  return (
    <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 md:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Switching states
      </p>
      <h3 className="text-display mt-2 text-2xl font-semibold text-zinc-950">
        Six switches, one DC bus
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
        A three-phase bridge connects each motor phase to either the DC+ or DC− rail.
        Hover or tap a state to see the educational current-path story.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-950 p-5 text-zinc-100">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>DC+</span>
            <span>DC−</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {["U", "V", "W"].map((phase) => (
              <div key={phase} className="space-y-2">
                <div
                  className={`rounded-lg border px-2 py-3 ${
                    current.label.includes(`${phase} high`)
                      ? "border-orange-400 bg-orange-400/20 text-orange-100"
                      : "border-white/15 bg-white/5"
                  }`}
                >
                  High
                </div>
                <p className="font-semibold tracking-wider">{phase}</p>
                <div
                  className={`rounded-lg border px-2 py-3 ${
                    current.label.includes(`${phase} low`) ||
                    (phase === "V" && current.id === "u-high") ||
                    (phase === "W" && current.id === "v-high") ||
                    (phase === "U" && current.id === "w-high")
                      ? "border-sky-400 bg-sky-400/20 text-sky-100"
                      : "border-white/15 bg-white/5"
                  }`}
                >
                  Low
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Educational diagram · not a live simulation
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <button
                key={state.id}
                type="button"
                onClick={() => setActive(state.id)}
                onMouseEnter={() => setActive(state.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active === state.id
                    ? "border-orange-400 bg-orange-50 text-orange-950"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">{current.path}</p>
        </div>
      </div>
    </div>
  );
}

export default function DesignChallengeExtrasSection({
  content,
}: {
  content: DesignChallengeExtras;
}) {
  return (
    <section id="design-challenge" className="scroll-mt-28 space-y-12">
      <div>
        <SectionLabel>Design Challenge Deep Dive</SectionLabel>
        <p className="mt-3 max-w-3xl rounded-[1.25rem] border border-orange-200/80 bg-orange-50/70 px-4 py-3 text-sm leading-relaxed text-orange-950/90">
          {content.disclaimer}
        </p>
      </div>

      {content.flowStages?.length ? (
        <EngineeringFlowDiagram title={content.flowTitle} stages={content.flowStages} />
      ) : null}

      {content.architectureBlocks?.length ? (
        <ArchitectureBlocks
          title={content.architectureTitle}
          intro={content.architectureIntro}
          blocks={content.architectureBlocks}
        />
      ) : null}

      {content.schematicPlaceholder ? (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Schematic
          </p>
          <CaseStudyMediaFrame media={content.schematicPlaceholder} />
        </div>
      ) : null}

      {content.datasheetComparison ? (
        <DatasheetComparison comparison={content.datasheetComparison} />
      ) : null}

      {content.emi ? <EmiSection emi={content.emi} /> : null}

      {(content.verificationMedia?.length || content.verificationRows?.length) && (
        <div>
          <h3 className="text-display text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
            Verification
          </h3>
          {content.verificationIntro ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
              {content.verificationIntro}
            </p>
          ) : null}
          {content.verificationMedia?.length ? (
            <div className="mt-6 grid gap-5">
              {content.verificationMedia.map((media) => (
                <CaseStudyMediaFrame key={media.src} media={media} />
              ))}
            </div>
          ) : null}
          {content.verificationRows?.length ? (
            <div className="mt-6">
              <VerificationTable rows={content.verificationRows} />
            </div>
          ) : null}
        </div>
      )}

      {content.iterationSteps?.length ? (
        <IterationTimeline
          title={content.iterationTitle}
          intro={content.iterationIntro}
          steps={content.iterationSteps}
        />
      ) : null}

      {content.stageCards?.length ? <StageCards cards={content.stageCards} /> : null}

      {content.frequencyVoltageNote ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Output frequency",
              body: content.frequencyVoltageNote.frequency,
            },
            {
              title: "Output voltage",
              body: content.frequencyVoltageNote.voltage,
            },
            {
              title: "PWM ≠ fundamental",
              body: content.frequencyVoltageNote.pwmVsFundamental,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                {card.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{card.body}</p>
            </div>
          ))}
        </div>
      ) : null}

      {content.showInverterSwitching ? <InverterSwitchingDemo /> : null}

      {content.engineeringConsiderations?.length ? (
        <div>
          <h3 className="text-display text-2xl font-semibold tracking-tight text-zinc-950">
            Engineering considerations
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.engineeringConsiderations.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.35rem] border border-zinc-200 bg-white px-4 py-4"
              >
                <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
