// app/projects/video-editing/page.tsx
// Drop this into your Next.js (App Router) project.
// Assumes Tailwind is set up.

"use client";

import React, { useMemo, useRef, useState } from "react";

type EditProject = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  year?: string;
  href?: string; // optional link to a detail page or external link
  thumb: string; // image poster
  video?: string; // optional hover-preview video
};

const SKILLS = [
  "Premiere Pro",
  "After Effects",
  "Color Grading",
  "Sound Design",
  "Beat Sync",
  "Short-form",
  "Cinematic",
  "Motion Graphics",
];

const PROJECTS: EditProject[] = [
  {
    id: "edit-001",
    title: "Dance Competition Hype Edit",
    blurb: "Fast cuts + beat sync + impact transitions designed for social attention.",
    tags: ["Short-form", "Beat Sync", "Transitions"],
    year: "2025",
    href: "/projects/video-editing/dance-hype",
    thumb: "/video-editing/dance-hype-poster.jpg",
    video: "/video-editing/dance-hype-preview.mp4",
  },
  {
    id: "edit-002",
    title: "Cinematic Travel Montage",
    blurb: "Mood-first pacing with warm grading and controlled motion.",
    tags: ["Cinematic", "Color Grade", "Pacing"],
    year: "2024",
    href: "/projects/video-editing/travel-montage",
    thumb: "/video-editing/travel-poster.jpg",
    video: "/video-editing/travel-preview.mp4",
  },
  {
    id: "edit-003",
    title: "Event Recap",
    blurb: "Tight highlights with clean audio + a narrative arc that lands.",
    tags: ["Recap", "Sound", "Story"],
    year: "2024",
    href: "/projects/video-editing/event-recap",
    thumb: "/video-editing/event-poster.jpg",
    video: "/video-editing/event-preview.mp4",
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

  // Respect reduced motion users
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const onEnter = async () => {
    setIsHover(true);
    if (!project.video || reduceMotion) return;
    try {
      videoRef.current?.play();
    } catch {
      // ignore
    }
  };

  const onLeave = () => {
    setIsHover(false);
    if (!project.video) return;
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } catch {
      // ignore
    }
  };

  const CardInner = (
    <div className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-transform duration-200 will-change-transform hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {/* Poster image */}
        <img
          src={project.thumb}
          alt={project.title}
          className="h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-70"
          loading="lazy"
        />

        {/* Hover preview video */}
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
            // no autoPlay; we start it on hover
            poster={project.thumb}
            src={project.video}
          />
        ) : null}

        {/* Subtle gradient to ensure text readability if you add overlays later */}
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
            View →
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
      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* background */}
        <div className="absolute inset-0">
          {/* Replace with your showreel clip or a strong still */}
          <video
            className="h-full w-full object-cover"
            src="/video-editing/showreel-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video-editing/showreel-hero-poster.jpg"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <DarkPill>VIDEO EDITING</DarkPill>
            <DarkPill>Rhythm</DarkPill>
            <DarkPill>Story</DarkPill>
            <DarkPill>Motion</DarkPill>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Editing that builds pace, mood, and payoff.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              I love the moment when raw clips turn into something intentional: tighter rhythm,
              cleaner emotion, and visuals that actually land.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#showreel"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                ▶ Watch Showreel
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                🎞 See Projects
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

      {/* SHOWREEL */}
      <div id="showreel" />
      <Section
        eyebrow="Featured"
        title="Showreel"
        subtitle="A quick montage of my favorite transitions, pacing, and color work."
      >
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
          <div className="aspect-video w-full">
            <video
              className="h-full w-full object-cover"
              controls
              preload="metadata"
              poster="/video-editing/showreel-poster.jpg"
              src="/video-editing/showreel.mp4"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>Beat sync</Pill>
          <Pill>Impact transitions</Pill>
          <Pill>Color grading</Pill>
          <Pill>Sound design</Pill>
        </div>
      </Section>

      {/* PROCESS */}
      <Section
        eyebrow="How I edit"
        title="My editing approach"
        subtitle="The three things I care about most when I’m building an edit."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              RHYTHM
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Pace first</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              I cut to the beat, but I’m really cutting to energy. The goal is flow that feels
              inevitable, not chaotic.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              MOOD
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Color & tone</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Grading is where the story becomes emotional. Warm nostalgia, cool cinematic tension,
              or clean modern contrast.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              IMPACT
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Motion that earns itself</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Speed ramps and transitions should feel like punctuation. If it’s loud, it needs a
              reason.
            </p>
          </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <div id="projects" />
      <Section
        eyebrow="Selected work"
        title="Projects"
        subtitle="Hover a card for a quick preview (optional). Click through for details."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <HoverVideoCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      {/* BEFORE / AFTER (Optional) */}
      <Section
        eyebrow="Optional"
        title="Before → After"
        subtitle="If you have one edit where the transformation is obvious, this section hits."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-black/90">Raw</h3>
              <p className="mt-1 text-sm text-black/60">
                Original footage (uncut / ungraded).
              </p>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                className="h-full w-full object-cover"
                controls
                preload="metadata"
                poster="/video-editing/before-poster.jpg"
                src="/video-editing/before.mp4"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-black/90">Final</h3>
              <p className="mt-1 text-sm text-black/60">
                Pacing, grading, audio, and transitions.
              </p>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                className="h-full w-full object-cover"
                controls
                preload="metadata"
                poster="/video-editing/after-poster.jpg"
                src="/video-editing/after.mp4"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER CTA */}
      <footer className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-black/90">
            Want to collaborate?
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
            If you have footage that needs tighter pacing, better story flow, or a more cinematic
            finish, I’d love to help.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
            >
              Contact →
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-black/5 px-5 py-3 text-sm font-semibold text-black/80 transition-transform hover:-translate-y-0.5"
            >
              Back to Projects
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
