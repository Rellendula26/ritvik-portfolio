import { SectionLabel } from "@/components/project-page/shared";
import type { ContributionContent } from "@/data/engineering-case-study";

export default function ContributionSection({
  content,
}: {
  content: ContributionContent;
}) {
  return (
    <section id="contribution" className="scroll-mt-36">
      <SectionLabel>My part</SectionLabel>
      <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
        What I took on
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-800">{content.summary}</p>
      <div className="mt-6 grid gap-8 border-t border-zinc-200 pt-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-900">
            Work I did
          </h3>
          <ul className="mt-3 space-y-2.5 text-base leading-relaxed text-zinc-800">
            {content.mine.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Already there
          </h3>
          <ul className="mt-3 space-y-2.5 text-base leading-relaxed text-zinc-700">
            {content.alreadyThere.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
