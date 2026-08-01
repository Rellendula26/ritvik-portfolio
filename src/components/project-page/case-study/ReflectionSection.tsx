import { SectionLabel } from "@/components/project-page/shared";
import type { ReflectionContent } from "@/data/engineering-case-study";

export default function ReflectionSection({
  content,
}: {
  content: ReflectionContent;
}) {
  const groups = [
    { label: "What surprised me", items: content.surprises },
    { label: "What I would redesign", items: content.redesign },
    { label: "Future improvements", items: content.future },
    { label: "Questions that emerged", items: content.questions },
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="reflection" className="scroll-mt-28">
      <SectionLabel>Reflection</SectionLabel>
      <div className="mt-6 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] md:p-8">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          Looking back
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          What surprised me, what I&apos;d redo, and questions I&apos;m still chewing on.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.label}
              className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/80 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
                {group.label}
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
