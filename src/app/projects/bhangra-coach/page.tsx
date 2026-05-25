import React from "react";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import Link from "next/link";

type LinkItem = { label: string; href: string };

type SystemSection = {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  summary: string;
  responsibilities: string[];
  tools: string[];
  media: {
    kind: "image" | "video";
    src: string;
    alt?: string;
    poster?: string;
  };
};

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "warm" | "dark";
}) {
  const styles = {
    default: "border-orange-200 bg-orange-50 text-orange-900",
    warm:
      "border-orange-300/70 bg-gradient-to-br from-orange-100 to-amber-50 text-orange-950",
    dark: "border-zinc-800 bg-zinc-900 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function ActionLink({ label, href }: LinkItem) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center rounded-full border border-orange-300 bg-white/90 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
    >
      {label}
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-900">
      {children}
    </p>
  );
}

function SystemBlock({
  section,
  reverse = false,
}: {
  section: SystemSection;
  reverse?: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.08),transparent_24%)]" />
      <div
        className={`relative grid grid-cols-1 gap-6 p-5 md:p-6 lg:grid-cols-[1.05fr_0.95fr] ${
          reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
        }`}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-sm font-semibold text-orange-900 shadow-sm">
              {section.step}
            </span>
            <Badge tone="warm">{section.title.toUpperCase()}</Badge>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            {section.title}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-zinc-500">
            {section.subtitle}
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-700">
            {section.summary}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                What it handles
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                {section.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-[8px] h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                Tools used
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {section.tools.map((tool) => (
                  <Badge key={tool}>{tool}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-orange-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-zinc-300" />
              <span className="ml-2 text-xs font-medium text-zinc-500">
                {section.title}
              </span>
            </div>

            <div className="relative h-[240px] w-full md:h-[300px]">
              {section.media.kind === "image" ? (
                <ProjectMediaImage
                  src={section.media.src}
                  alt={section.media.alt ?? section.title}
                  className="object-cover object-top"
                />
              ) : (
                <video
                  src={section.media.src}
                  poster={section.media.poster}
                  className="h-full w-full object-cover object-top"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const title = "Bhangra Coach";
  const subtitle =
    "A full-stack dance feedback tool for analyzing Bhangra fundamentals using computer vision and other libraries to compare to a reference, and add feedback.";

  const liveUrl = "https://bhangra-coach.vercel.app";
  const repoUrl = "https://github.com/Rellendula26/bhangra-coach";

  const actions: LinkItem[] = [
    { label: "LIVE APP", href: liveUrl },
    { label: "SOURCE CODE", href: repoUrl },
    { label: "SYSTEMS", href: "#systems" },
    { label: "GALLERY", href: "#gallery" },
  ];

  const systems: SystemSection[] = [
    {
      id: "frontend",
      step: "01",
      title: "Frontend Experience",
      subtitle: "Upload and review flow",
      summary:
        "User can sign in, numerous different options to look at progress & history. Then, user uploads a clip, and sees their clip analysis",
      responsibilities: ["Upload flow", "Reference selection", "Results UI"],
      tools: ["Next.js", "React", "TypeScript", "Tailwind"],
      media: {
        kind: "video",
        src: "/projects/coverbhangraform.mp4",
        poster: "/projects/bc1.png",
        alt: "Frontend UI demo",
      },
    },
    {
      id: "backend",
      step: "02",
      title: "Backend Pipeline",
      subtitle: "Processing and comparison",
      summary: "Implements the video processing pipeline using FastAPI and Python. Uploaded clips are processed with MediaPipe to extract pose landmarks frame-by-frame, which are then temporally aligned with a reference sequence to compute movement deltas returned to the frontend as structured feedback.",
      responsibilities: ["Processing", "Comparison logic", "Structured results"],
      tools: ["Python", "FastAPI"],
      media: {
        kind: "video",
        src: "/projects/bcbackend.mp4",
        alt: "Backend system",
      },
    },
    {
      id: "supabase",
      step: "03",
      title: "Supabase Layer",
      subtitle: "Storage and persistence",
      summary: "Stores reference videos and practice videos inputted from the user are also stored here. Supabase is pretty critical for supplying the videos for the users to look at with reference",
      responsibilities: ["File storage", "Database", "Sessions"],
      tools: ["Supabase"],
      media: {
        kind: "video",
        src: "/projects/bcsupabase.mp4",
        alt: "Supabase storage",
      },
    },
    {
      id: "feedback",
      step: "04",
      title: "Feedback Engine",
      subtitle: "Movement comparison",
      summary: "Transforms pose comparison into coaching feedback. Furthermore, also displays the reference VERSUS the user's video",
      responsibilities: ["Pose signals", "Timing differences", "Readable feedback"],
      tools: ["Pose analysis", "CV logic"],
      media: {
        kind: "image",
        src: "/projects/bcfeedback.png",
        alt: "Feedback results",
      },
    },
  ];

  const gallery: {
    src: string;
    alt: string;
    label: string;
    kind?: "image" | "video";
    poster?: string;
  }[] = [
    {
      src: "/projects/coverbhangraform.mp4",
      alt: "Bhangra Coach product walkthrough and upload flow",
      label: "Product walkthrough",
      kind: "video",
      poster: "/projects/bc1.png",
    },
    {
      src: "/projects/bc1.png",
      alt: "Home screen and clip upload entry",
      label: "Upload flow",
    },
    {
      src: "/projects/bc2.png",
      alt: "Progress tracking and practice history",
      label: "Progress & history",
    },
    {
      src: "/projects/bc3.png",
      alt: "Clip analysis and reference comparison view",
      label: "Clip analysis",
    },
    {
      src: "/projects/bcfeedback.png",
      alt: "Reference vs user video with coaching feedback",
      label: "Feedback comparison",
    },
    {
      src: "/projects/bcbackend.mp4",
      alt: "FastAPI backend and pose processing pipeline",
      label: "Backend pipeline",
      kind: "video",
    },
    {
      src: "/projects/bcsupabase.mp4",
      alt: "Supabase storage for reference and user videos",
      label: "Supabase storage",
      kind: "video",
    },
    {
      src: "/projects/bc4.png",
      alt: "Implementation and codebase overview",
      label: "Codebase",
    },
  ];

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(to_bottom,#fff7ed_0%,#fffaf5_18%,#ffffff_42%,#fffaf5_100%)]">
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14">
        <Link
  href="/projects"
  className="mb-6 inline-flex items-center text-sm font-medium text-zinc-600 hover:text-orange-600"
>
  ← Back to Projects
</Link>
        <header className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
          <div className="relative grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <Badge tone="dark">DANCE TECH CASE STUDY</Badge>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
                {subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge tone="warm">V1</Badge>
                <Badge>Next.js</Badge>
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Supabase</Badge>
                <Badge>Python</Badge>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <ActionLink key={action.label} {...action} />
                ))}
              </div>
            </div>

            <div>
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-200/45 via-amber-100/30 to-transparent blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-orange-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-zinc-300" />
                    <span className="ml-2 text-xs font-medium text-zinc-500">
                      Product Demo
                    </span>
                  </div>

                  <div className="relative h-[300px] w-full md:h-[380px]">
                    <video
                      className="h-full w-full object-cover object-top"
                      src="/projects/coverbhangraform.mp4"
                      poster="/projects/bc1.png"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      preload="metadata"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="systems" className="mt-14 space-y-5">
          <SectionLabel>System Breakdown</SectionLabel>
          {systems.map((section, index) => (
            <SystemBlock
              key={section.id}
              section={section}
              reverse={index % 2 === 1}
            />
          ))}
        </section>

        <section id="gallery" className="mt-16">
          <SectionLabel>Gallery</SectionLabel>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {gallery.map((item) => {
              const isVideo = item.kind === "video";
              return (
                <div
                  key={item.src}
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-orange-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-zinc-300" />
                    <span className="ml-2 text-xs font-medium text-zinc-500">
                      {item.label}
                    </span>
                  </div>

                  <div className="relative h-[280px] w-full bg-zinc-950 md:h-[340px]">
                    {isVideo ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        className="h-full w-full object-cover object-top"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <ProjectMediaImage
                        src={item.src}
                        alt={item.alt}
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}