import { SectionLabel } from "@/components/project-page/shared";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import type { ResultsContent } from "@/data/engineering-case-study";

export default function ResultsValidationSection({
  content,
}: {
  content: ResultsContent;
}) {
  const media = content.media ?? [];

  return (
    <section id="results" className="scroll-mt-28">
      <SectionLabel>Results & Validation</SectionLabel>
      <div className="mt-3 max-w-2xl">
        <h2 className="text-display text-3xl font-semibold tracking-tight text-zinc-950">
          What held up
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          What worked in the end, what I can show for it, and where it&apos;s still limited.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {content.items.map((item) => (
          <article
            key={item.title}
            className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                {item.title}
              </h3>
              {item.evidence &&
                (item.evidenceHref ? (
                  <a
                    href={item.evidenceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[11px] font-medium text-orange-900 transition hover:bg-orange-100"
                  >
                    {item.evidence}
                  </a>
                ) : (
                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[11px] font-medium text-orange-900">
                    {item.evidence}
                  </span>
                ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{item.body}</p>
          </article>
        ))}
      </div>

      {media.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
            Photos and clips
          </p>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            The runs and stills that match the results above.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {media.map((item) => (
              <CaseStudyMediaFrame
                key={`${item.kind}-${item.src}-${item.label ?? item.alt}`}
                media={item}
                className={
                  item.portrait ? undefined : "aspect-video w-full"
                }
              />
            ))}
          </div>
        </div>
      )}

      {content.limitations.length > 0 && (
        <div className="mt-6 rounded-[2rem] border border-zinc-200 bg-zinc-50/90 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
            Limitations
          </p>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-700">
            {content.limitations.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
