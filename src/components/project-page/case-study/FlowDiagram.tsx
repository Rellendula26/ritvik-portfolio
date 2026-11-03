import type { FlowNode } from "@/data/engineering-case-study";

/** Horizontal on desktop, stacked on a phone. Arrows are the only decoration. */
export default function FlowDiagram({
  title,
  steps,
  caption,
}: {
  title: string;
  steps: FlowNode[];
  caption?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <figure>
      <figcaption className="text-sm font-semibold text-zinc-950">{title}</figcaption>
      <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-stretch">
        {steps.map((step, index) => (
          <li
            key={`${step.title}-${index}`}
            className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-stretch"
          >
            <div className="min-w-0 flex-1 rounded-xl border border-amber-200/80 bg-[#faf8f5] px-3 py-3">
              <p className="text-sm font-semibold text-zinc-950">{step.title}</p>
              <p className="mt-1 text-base leading-relaxed text-zinc-700">{step.detail}</p>
            </div>
            {index < steps.length - 1 ? (
              <span aria-hidden className="self-center px-0.5 font-medium text-amber-800">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? (
        <p className="mt-2 text-base leading-relaxed text-zinc-600">{caption}</p>
      ) : null}
    </figure>
  );
}
