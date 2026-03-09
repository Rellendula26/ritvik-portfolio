// app/projects/video-editing/page.tsx

"use client";

import React, { useMemo, useRef, useState } from "react";

type EditProject = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  year?: string;
  href?: string;
  thumb: string;
  video?: string;
};

const SKILLS = [
  "DaVinci Resolve",
  "Beat Sync",
  "Transitions",
  "Pacing",
  "Color",
];

const PROJECTS: EditProject[] = [
  {
    id: "edit-001",
    title: "Michigan vs. Ohio State",
    blurb:
      "My first real edit. Before, I would use CapCut to make small clips, but this is the first intentional edit I made.",
    tags: ["DaVinci Resolve", "Layering", "Transitions"],
    year: "2026",
    thumb: "/life/mich.jpg",
    video: "/life/mich.mp4",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm text-black/70 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function DarkPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="mb-6">
        {eyebrow ? (
          <div className="mb-2 text-xs font-semibold tracking-[0.25em] text-black/50">
            {eyebrow.toUpperCase()}
          </div>
        ) : null}
        <h2 className="text-2xl font-semibold tracking-tight text-black/90 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-black/60">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function HoverVideoCard({ project }: { project: EditProject }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHover, setIsHover] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const onEnter = async () => {
    setIsHover(true);
    if (!project.video || reduceMotion) return;
    try {
      videoRef.current?.play();
    } catch {}
  };

  const onLeave = () => {
    setIsHover(false);
    if (!project.video) return;
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } catch {}
  };

  const CardInner = (
    <div className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-transform duration-200 will-change-transform hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={project.thumb}
          alt={project.title}
          className="h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-70"
          loading="lazy"
        />

        {project.video ? (
          <video
            ref={videoRef}
            className={[
              "absolute inset-0 h-full w-full object-cover",
              "opacity-0 transition-opacity duration-200",
              isHover ? "opacity-100" : "opacity-0",
            ].join(" ")}
            muted
            playsInline
            loop
            preload="metadata"
            poster={project.thumb}
            src={project.video}
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-black/90">
              {project.title}
            </h3>
            {project.year ? (
              <div className="mt-1 text-sm text-black/45">{project.year}</div>
            ) : null}
          </div>

          <div className="mt-1 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-black/60">
            Preview
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-black/60">{project.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
    </div>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        className="block focus:outline-none focus:ring-2 focus:ring-black/20"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
      >
        {CardInner}
      </a>
    );
  }

  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {CardInner}
    </div>
  );
}

export default function VideoEditingPage() {
  return (
    <main className="min-h-screen bg-[#fbf8f2]">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src="/life/mich.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/life/mich.jpg"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <DarkPill>VIDEO EDITING</DarkPill>
            <DarkPill>Beginning</DarkPill>
            <DarkPill>Rhythm</DarkPill>
            <DarkPill>Motion</DarkPill>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Compilation of learning how to make clips into resonant film.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              This page is the start of my video editing journey, and all of the different edits I'm making along the way.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                ▶ See the Edit
              </a>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <DarkPill key={s}>{s}</DarkPill>
            ))}
          </div>
        </div>
      </header>

      <Section
        eyebrow="Where I'm at"
        title="Still early, but hype and always looking for new inspiration"
        subtitle=""
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              PACE
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Feeling out rhythm</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Right now I’m learning how cuts and timing can change the whole energy of a clip. This also falls under transitions and knowing when/how to use different ones.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              EFFECTS
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Trying techniques out</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              There are actually countless video fx out there, and everytime I watch or see a new one in action, I try to implement it (that's what I did with the opening text in the Michigan Edit)
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              VIDEOGRAPHY
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">All about telling stories</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Clips make an edit. So, I'm planning on learning strong videography techniques so the clips themselves can tell stories.
            </p>
          </div>
        </div>
      </Section>

      <div id="projects" />
      <Section
        eyebrow="First edit"
        title="Michigan Edit"
        subtitle="The first actual piece I put together while learning how editing can create energy instead of just showing footage."
      >
        <div className="grid grid-cols-1 gap-5">
          {PROJECTS.map((p) => (
            <HoverVideoCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-black/90">
            More coming soon
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
            This page is still growing. For now, it’s one edit and the beginning of learning what
            makes something feel sharp, intentional, and worth watching.
          </p>
        </div>
      </footer>
    </main>
  );
}