import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import type { CaseStudyData } from "@/data/case-studies";
import { Badge } from "@/components/ui/Badge";
import {
  CaseStudyGallery,
  CaseStudyHeroImage,
  CaseStudyHeroVideo,
} from "@/components/case-study/CaseStudyMedia";

function Section({
  data,
  children,
}: {
  data: { id: string; eyebrow: string; title: string; body?: string; bullets?: string[]; code?: string; diagram?: string };
  children?: React.ReactNode;
}) {
  return (
    <section id={data.id} className="scroll-mt-28">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {data.eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
        {data.title}
      </h2>
      {data.body && (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 md:text-lg">
          {data.body}
        </p>
      )}
      {data.diagram && (
        <pre className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-5 font-mono text-xs leading-relaxed text-amber-100/90 md:text-sm">
          {data.diagram}
        </pre>
      )}
      {data.code && (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-900 p-5 font-mono text-xs leading-relaxed text-emerald-400/90">
          {data.code}
        </pre>
      )}
      {data.bullets && data.bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {data.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-3 text-sm leading-relaxed text-zinc-700 md:text-base"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}

function resolveHeroMedia(study: CaseStudyData, heroMedia?: React.ReactNode) {
  if (heroMedia) return heroMedia;
  if (study.heroVideo) {
    return (
      <CaseStudyHeroVideo
        src={study.heroVideo.src}
        poster={study.heroVideo.poster}
      />
    );
  }
  if (study.heroImage) {
    return (
      <CaseStudyHeroImage
        src={study.heroImage.src}
        alt={study.heroImage.alt}
      />
    );
  }
  return null;
}

export default function CaseStudyLayout({
  study,
  heroMedia,
}: {
  study: CaseStudyData;
  heroMedia?: React.ReactNode;
}) {
  const resolvedHero = resolveHeroMedia(study, heroMedia);
  return (
    <article className="min-h-screen">
      {/* Hero */}
      <header className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-8 md:py-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            {study.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
            {study.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-zinc-600 md:text-2xl">
            {study.positioning}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Role", value: study.role },
              { label: "Timeline", value: study.timeline },
              { label: "Stack", value: study.stack.slice(0, 2).join(", ") + "…" },
              { label: "Impact", value: study.impact[0] },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 line-clamp-2">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {study.github && (
              <a
                href={study.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                <Github className="h-4 w-4" />
                Source
              </a>
            )}
            {study.demo && (
              <a
                href={study.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-300"
              >
                Live demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <a
              href="#technical"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              How it works
            </a>
          </div>
        </div>

        {resolvedHero && (
          <div className="mx-auto max-w-5xl px-6 pb-12 md:px-8">{resolvedHero}</div>
        )}
      </header>

      {/* Body */}
      <div className="mx-auto max-w-5xl space-y-20 px-6 py-16 md:px-8 md:py-20">
        <Section data={study.problem} />
        <Section data={study.constraints} />
        <Section data={{ ...study.technical, id: "technical" }} />
        <Section data={study.build} />
        <Section data={study.results} />
        <Section data={study.lessons} />

        {study.gallery && study.gallery.length > 0 && (
          <CaseStudyGallery images={study.gallery} />
        )}

        {study.pipeline && (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Pipeline snapshot
            </p>
            <pre className="mt-3 font-mono text-sm leading-relaxed text-amber-950/90">
              {study.pipeline}
            </pre>
          </div>
        )}

        {/* CTA */}
        <footer className="rounded-2xl border border-zinc-200 bg-zinc-950 px-6 py-8 text-center md:px-10 md:py-10">
          <p className="text-sm text-zinc-400">Questions about this project? I&apos;d love to chat.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {study.github && (
              <a
                href={study.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
              >
                View on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <a
              href="mailto:rellen26@seas.upenn.edu"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Get in touch
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}
