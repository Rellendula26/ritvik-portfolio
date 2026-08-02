"use client";

import React, { useMemo, useRef, useState } from "react";

type EditProject = {
  id: string;
  title: string;
  blurb: string;
  context: string;
  tags: string[];
  year: string;
  role?: string;
  thumb: string;
  video: string;
  featured?: boolean;
};

const SKILLS = [
  "DaVinci Resolve",
  "CapCut",
  "Beat Sync",
  "Pacing",
  "Color",
  "Event Recap",
  "Osmo Pocket 3",
  "Sony ZV-1",
];

const PROJECTS: EditProject[] = [
  {
    id: "michigan-osu",
    title: "Michigan vs. Ohio State",
    blurb:
      "My first intentional edit. Before this I was just chopping CapCut clips. This one was me actually trying to build rhythm and energy on purpose.",
    context:
      "Learning cut timing, text openers, and transitions in DaVinci Resolve. Still rough in places, but it is the edit that made me take this seriously.",
    tags: ["DaVinci Resolve", "Layering", "Transitions", "First Edit"],
    year: "2026",
    thumb: "/life/mich.jpg",
    video: "/life/mich.mp4",
    featured: true,
  },
  {
    id: "holi-2026",
    title: "Holi 2026 Recap",
    blurb:
      "Quick recap for Holi at Penn so people who were there (and people who missed it) get the energy of the night back in under a minute.",
    context:
      "I cut this as Marketing Chair for HJA, the Hindu Jain Association. Goal was simple: make the event feel alive online without turning it into a corporate highlight reel.",
    tags: ["HJA", "Event Recap", "DaVinci Resolve", "Campus"],
    year: "2026",
    role: "Marketing Chair, HJA",
    thumb: "/life/holi2026.jpg",
    video: "/life/holi2026.mp4",
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
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-10">
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

function FeaturedPlayer({ project }: { project: EditProject }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-video w-full bg-black">
        <video
          className="h-full w-full object-contain"
          src={project.video}
          poster={project.thumb}
          controls
          playsInline
          preload="metadata"
        />
      </div>
      <div className="grid gap-4 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{project.year}</Pill>
            {project.role ? <Pill>{project.role}</Pill> : null}
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black/90">
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-black/70">{project.blurb}</p>
          <p className="mt-3 text-sm leading-relaxed text-black/55">{project.context}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-black/45">
            WHAT I CARED ABOUT
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function HoverVideoCard({
  project,
  onSelect,
  active,
}: {
  project: EditProject;
  onSelect: () => void;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHover, setIsHover] = useState(false);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const onEnter = async () => {
    setIsHover(true);
    if (reduceMotion) return;
    try {
      await videoRef.current?.play();
    } catch {
      /* autoplay can fail; ignore */
    }
  };

  const onLeave = () => {
    setIsHover(false);
    if (!videoRef.current) return;
    try {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={[
        "group w-full overflow-hidden rounded-3xl border bg-white text-left shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition",
        active
          ? "border-orange-300 ring-2 ring-orange-200"
          : "border-black/10 hover:-translate-y-1",
      ].join(" ")}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumb}
          alt={project.title}
          className="h-full w-full object-cover opacity-90 transition-opacity duration-200 group-hover:opacity-70"
          loading="lazy"
        />
        <video
          ref={videoRef}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
            isHover ? "opacity-100" : "opacity-0",
          ].join(" ")}
          muted
          playsInline
          loop
          preload="metadata"
          poster={project.thumb}
          src={project.video}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {active ? (
          <div className="absolute left-3 top-3 rounded-full bg-orange-400 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
            Playing
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-black/90">
              {project.title}
            </h3>
            <div className="mt-1 text-sm text-black/45">{project.year}</div>
          </div>
          {project.role ? (
            <div className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-black/60">
              {project.role}
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-black/60">{project.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function VideoEditingPage() {
  const heroProject =
    PROJECTS.find((project) => project.id === "michigan-osu") ?? PROJECTS[0];
  const [activeId, setActiveId] = useState(heroProject.id);
  const active = PROJECTS.find((project) => project.id === activeId) ?? heroProject;

  return (
    <main className="min-h-screen bg-[#fbf8f2]">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src={heroProject.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroProject.thumb}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <DarkPill>VIDEO EDITING</DarkPill>
            <DarkPill>VIDEOGRAPHY</DarkPill>
            <DarkPill>{PROJECTS.length} edits</DarkPill>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Edits, cameras, and learning how to shoot
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              I got into editing because I wanted my YouTube channel to look better, not because I
              woke up one day as a filmmaker. That meant learning both sides: how to cut, and how
              to actually capture usable footage. Some of these are practice. Some are HJA event
              recaps. All of them are me trying to get sharper.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#watch"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                Watch an edit
              </a>
              <a
                href="https://www.youtube.com/@RitvikEllendula26"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                YouTube channel
              </a>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <DarkPill key={skill}>{skill}</DarkPill>
            ))}
          </div>
        </div>
      </header>

      <Section
        eyebrow="Where I'm at"
        title="Editing is only half of it. The camera work matters too."
        subtitle="Because of my YouTube channel, I started learning videography and filmmaking gear for real, not just timeline tricks."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              EDITING
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Cuts that feel alive</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Most of my practice is timing. When to cut, when to hold, when a transition helps
              versus when it just screams CapCut template.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              VIDEOGRAPHY
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">Learning to shoot for the edit</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              Bad footage becomes a bad edit fast. I have been experimenting with the DJI Osmo
              Pocket 3, Sony ZV-1, and whatever else I can get my hands on so the clips themselves
              already tell a story.
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.25em] text-black/50">
              WHY
            </div>
            <h3 className="mt-2 text-lg font-semibold text-black/90">YouTube + campus events</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              My channel pushed me to care about filmmaking craft. HJA Marketing Chair work
              (like Holi) pushed me to ship recaps on a deadline. Both make me better.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/45">
            GEAR I HAVE BEEN PLAYING WITH
          </p>
          <p className="mt-3 text-sm leading-relaxed text-black/65">
            DJI Osmo Pocket 3 for run-and-gun / travel style clips. Sony ZV-1 when I want a more
            intentional vlogging / sit-down look. Still figuring out what I actually like shooting
            with versus what just looks cool on a desk.
          </p>
          <a
            href="https://www.youtube.com/@RitvikEllendula26"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-amber-800 hover:underline"
          >
            youtube.com/@RitvikEllendula26 →
          </a>
        </div>
      </Section>

      <Section
        id="watch"
        eyebrow="Now playing"
        title={active.title}
        subtitle="Pick any edit below. This player is the full watch, not just a hover preview."
      >
        <FeaturedPlayer project={active} />
      </Section>

      <Section
        id="library"
        eyebrow="Edit library"
        title="Everything so far"
        subtitle="Click a card to load it above. Hover previews if your browser allows it."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <HoverVideoCard
              key={project.id}
              project={project}
              active={project.id === active.id}
              onSelect={() => setActiveId(project.id)}
            />
          ))}
        </div>
      </Section>

      <footer className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6">
        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-black/90">
            More edits incoming
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
            This page is built to hold a growing stack, not one trophy clip. Next up is cleaner
            color, better A-roll from the cameras I am learning, and more event / dance footage
            that does not feel like a highlight dump.
          </p>
        </div>
      </footer>
    </main>
  );
}
