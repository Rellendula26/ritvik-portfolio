import type { ReactNode } from "react";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import ProjectCardVisual from "@/components/visuals/ProjectCardVisual";
import type { CaseStudyMedia } from "@/data/engineering-case-study";
import type { ProjectMedia } from "@/data/projects";

export type FigureMedia = ProjectMedia | CaseStudyMedia;

const prose = "text-base leading-relaxed text-stone-800";

export function splitParagraphs(text: string, maxWords = 60) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const paragraphs: string[] = [];
  let current: string[] = [];
  let words = 0;

  sentences.forEach((sentence) => {
    const count = sentence.split(/\s+/).length;
    if (current.length && words + count > maxWords) {
      paragraphs.push(current.join(" "));
      current = [];
      words = 0;
    }
    current.push(sentence);
    words += count;
  });

  if (current.length) paragraphs.push(current.join(" "));
  return paragraphs.length ? paragraphs : [text];
}

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {splitParagraphs(text).map((paragraph) => (
        <p key={paragraph} className={prose}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function mediaCaption(media: FigureMedia) {
  return "caption" in media ? media.caption : undefined;
}

export function MediaFigure({
  media,
  priority = false,
}: {
  media: FigureMedia;
  priority?: boolean;
}) {
  const caption = mediaCaption(media);
  const poster = "poster" in media ? media.poster : undefined;

  return (
    <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-[#f7f1e8]">
      <div className="relative aspect-video">
        {media.kind === "visual" && "visualId" in media ? (
          <ProjectCardVisual visualId={media.visualId} className="h-full w-full" />
        ) : media.kind === "video" ? (
          <video
            className="h-full w-full bg-[#070707] object-contain"
            controls
            playsInline
            preload="metadata"
            poster={poster}
            aria-label={media.alt}
            src={media.src}
          />
        ) : (
          <ProjectMediaImage
            src={media.src}
            alt={media.alt}
            priority={priority}
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="border-t border-stone-200 px-4 py-3 text-xs leading-relaxed text-stone-600">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function SplitRow({
  media,
  children,
  flip = false,
}: {
  media?: FigureMedia;
  children: ReactNode;
  flip?: boolean;
}) {
  if (!media) return <div className="max-w-3xl">{children}</div>;

  return (
    <div className={`grid items-center gap-5 lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <MediaFigure media={media} />
      <div className="max-w-xl">{children}</div>
    </div>
  );
}

export function StatCallout({ items }: { items: { value: string; label: string }[] }) {
  if (items.length < 2) return null;

  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.slice(0, 4).map((item) => (
        <div key={`${item.value}-${item.label}`} className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
          <dt className="text-2xl font-semibold tracking-tight text-stone-950">{item.value}</dt>
          <dd className="mt-1 text-sm leading-snug text-stone-600">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DecisionTable({
  rows,
}: {
  rows: { decision: string; alternative: string; why: string }[];
}) {
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm text-stone-800">
        <thead className="border-b border-stone-200 bg-[#f7f1e8] text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          <tr>
            <th className="px-4 py-3">Decision</th>
            <th className="px-4 py-3">Alternative</th>
            <th className="px-4 py-3">Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.decision} className="border-t border-stone-100 align-top">
              <td className="px-4 py-3 font-medium text-stone-950">{row.decision}</td>
              <td className="px-4 py-3">{row.alternative}</td>
              <td className="px-4 py-3">{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FailureCard({
  title,
  problem,
  diagnosis,
  fix,
  media,
}: {
  title: string;
  problem: string;
  diagnosis: string;
  fix: string;
  media?: FigureMedia;
}) {
  const card = (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <dl className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          ["Problem", problem],
          ["Diagnosis", diagnosis],
          ["Fix", fix],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{label}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-stone-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (!media) return card;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {card}
      <MediaFigure media={media} />
    </div>
  );
}

export function Timeline({
  steps,
}: {
  steps: { id: string; date?: string; title: string; text: string; media?: FigureMedia }[];
}) {
  if (!steps.length) return null;

  return (
    <ol className="flex flex-col gap-4 md:flex-row md:overflow-x-auto md:pb-2">
      {steps.map((step) => {
        const poster = step.media && "poster" in step.media ? step.media.poster : undefined;
        const still = step.media && step.media.kind === "image" ? step.media.src : poster;
        return (
        <li key={step.id} className="w-full rounded-2xl border border-stone-200 bg-white p-3 md:w-72 md:shrink-0">
          {step.media ? (
            <details>
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f7f1e8]">
                  {still ? (
                    <ProjectMediaImage src={still} alt={step.media.alt} className="object-cover" sizes="256px" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Play
                    </span>
                  )}
                </div>
              </summary>
              <div className="mt-3">
                <MediaFigure media={step.media} />
              </div>
            </details>
          ) : null}
          {step.date ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">{step.date}</p> : null}
          <h3 className="mt-1 text-base font-semibold text-stone-950">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">{step.text}</p>
        </li>
        );
      })}
    </ol>
  );
}

export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="mt-12 rounded-[1.5rem] border border-stone-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
      <summary className="cursor-pointer list-none px-5 py-4 text-lg font-semibold text-stone-950 [&::-webkit-details-marker]:hidden">
        <span className="mr-2 text-amber-800" aria-hidden>
          +
        </span>
        {title}
      </summary>
      <div className="border-t border-stone-200 px-3 py-6 md:px-5">{children}</div>
    </details>
  );
}
