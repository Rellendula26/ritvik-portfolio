import { SectionLabel } from "@/components/project-page/shared";
import type { MotivationContent } from "@/data/engineering-case-study";

export default function MotivationSection({
  content,
}: {
  content: MotivationContent;
}) {
  return (
    <section id="motivation" className="scroll-mt-28">
      <SectionLabel>Motivation</SectionLabel>
      <div className="mt-6 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] md:p-8">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Why this exists
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Context before architecture; what pulled me into the problem.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { label: "Why I built it", body: content.why },
            { label: "What interested me", body: content.interest },
            { label: "What I wanted to learn", body: content.learning },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/80 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
