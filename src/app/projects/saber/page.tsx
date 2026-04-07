"use client";

import React from "react";
import {
  ChevronRight,
  Github,
  CircuitBoard,
  Wrench,
  CheckCircle2,
  Package,
} from "lucide-react";

const tags = ["Hardware Build", "Physical Computing", "Circuit Design"];

const snapshot = [
  { label: "Role", value: "Builder" },
  { label: "Focus", value: "Interactive saber electronics" },
  { label: "Stack", value: "LEDs, Button, Wiring, Fusion 360 CAD" },
  { label: "Outcome", value: "Fully integrated handheld build" },
];

const originalIdeas = [
  {
    title: "Physical design concept",
    body: "During Spring Break, I just wanted to like model with household material how it could be.",
    image: "/images/saberfirst.png",
    alt: "Early physical design concept for the saber",
  },
  {
    title: "Whiteboard planning",
    body: "I wanted to sketch out how the initial plan could look and try building a sample circuit diagram.",
    image: "/images/saberwhite.png",
    alt: "Whiteboard planning sketch for the saber build",
  },
];

const majorSkills = [
  {
    icon: Wrench,
    title: "Soldering",
    body: "This project led to my first time actually having to solder. Within the project timeline, I probably soldered at least 40-50 different times, and I even had to use extensive flux to solder to copper.",
    image: "/images/saber-soldering.jpg",
    alt: "Soldering work on the saber electronics",
  },
  {
    icon: CircuitBoard,
    title: "Circuit design",
    body: "I wanted to create a circuit diagram to actually visualize how the connection would work to better reproduce it for my second saber..",
    image: "/images/saber-circuit.jpg",
    alt: "Circuit design or wiring layout for the saber",
  },
  {
    icon: Package,
    title: "Materials + integration",
    body: "This project required 3 different CADded components: the hilt, emitter, and battery carrier, as well as an LED strip, button, and transparent saber. Almost all the materials were available at Detkin.",
    image: "/projects/sabermats.png",
    alt: "Materials and components used in the saber build",
  },
];

const finalBuild = [
  "Integrated the electronics into a final handheld assembly.",
  "Combined technical function, packaging, and presentation into one build.",
  "Turned the original concept into a finished object that could actually be demonstrated and is sturdy.",
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {children}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-black/10 bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="text-base leading-7 text-neutral-600 md:text-lg">{body}</p>
      ) : null}
    </div>
  );
}

function MediaImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-black/10 bg-neutral-100 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

function MediaVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border border-black/10 bg-black ${className}`}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function SaberProjectPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ee] text-neutral-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(224, 161, 53, 0.22) 1.2px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-8 lg:px-10">
        <nav className="mb-10 flex items-center justify-between rounded-full border border-black/10 bg-white/90 px-6 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="text-xl font-semibold tracking-[0.24em]">
            RITVIK ELLENDULA
          </div>
          <div className="hidden gap-8 text-sm uppercase tracking-[0.22em] text-neutral-600 md:flex">
            <a href="#ideas" className="transition hover:text-neutral-950">
              Ideas
            </a>
            <a href="#skills" className="transition hover:text-neutral-950">
              Skills
            </a>
            <a href="#final" className="transition hover:text-neutral-950">
              Final Product
            </a>
          </div>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8 pt-6">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-[#f0d86b] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-900">
                Hardware Project Case Study
              </div>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-neutral-950 md:text-7xl">
                  Saber Build
                </h1>
                <p className="max-w-2xl text-xl leading-8 text-neutral-700 md:text-2xl md:leading-9">
                  A custom saber project that brought together electronics,
                  circuit design, and physical integration into one final handheld build.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {snapshot.map((item) => (
                <Card key={item.label} className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base font-medium leading-6 text-neutral-900">
                    {item.value}
                  </p>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#final"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                View final build <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <Card className="overflow-hidden p-4 md:p-5">
              <div className="rounded-[24px] border border-black/10 bg-[#fbfbfa] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      Hero Visual
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      Final Product Preview
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <MediaVideo
                  src="/projects/fullsaber.mp4"
                  poster="/projects/count-coach-poster.jpg"
                  className="h-[320px] md:h-[420px]"
                />
              </div>
            </Card>
          </div>
        </section>

        <section id="ideas" className="mt-24 space-y-10">
          <SectionHeading
            eyebrow="Original Ideas"
            title="Where the build started"
            body="The first phase was figuring out both the physical design and the logic of how the saber would actually work."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {originalIdeas.map((item) => (
              <Card key={item.title} className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-neutral-700">
                  {item.body}
                </p>

                <div className="mt-6">
                  <MediaImage
                    src={item.image}
                    alt={item.alt}
                    className="h-[280px]"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="skills" className="mt-24 space-y-10">
          <SectionHeading
            eyebrow="Major Skills"
            title="What the build required"
            body="The project came together through soldering, circuit work, and figuring out how the materials and components could all fit together."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {majorSkills.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3cf] text-neutral-900">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-neutral-700">
                    {item.body}
                  </p>

                  <div className="mt-6">
                    <MediaImage
                      src={item.image}
                      alt={item.alt}
                      className="h-[220px]"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section
          id="final"
          className="mt-24 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start"
        >
          <Card className="p-6 md:p-8">
            <SectionHeading
              eyebrow="Final Product"
              title="The finished saber"
              body="This section is the payoff. It shows the final build and frames it as the result of the design and integration work above."
            />

            <div className="mt-8 space-y-4">
              {finalBuild.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 text-base leading-7 text-neutral-700"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#b78410]" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden p-4 md:p-5">
            <div className="rounded-[24px] border border-black/10 bg-[#fbfbfa] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Final Media
                  </p>
                  <p className="mt-2 text-lg font-semibold text-neutral-900">
                    Videos and images
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-300" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                </div>
              </div>

              <div className="grid gap-4">
                <MediaVideo
                  src="/videos/saber-demo-1.mp4"
                  poster="/images/saber-demo-1-poster.jpg"
                  className="h-[260px]"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <MediaImage
                    src="/images/saber-final-1.jpg"
                    alt="Final saber build image one"
                    className="h-[220px]"
                  />
                  <MediaImage
                    src="/images/saber-final-2.jpg"
                    alt="Final saber build image two"
                    className="h-[220px]"
                  />
                </div>

                <MediaVideo
                  src="/videos/saber-demo-2.mp4"
                  poster="/images/saber-demo-2-poster.jpg"
                  className="h-[260px]"
                />
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-24">
          <Card className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                  Links
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                  Demo and source
                </h3>
                <p className="mt-3 text-base leading-7 text-neutral-600">
                  Give people a direct path to the final demo and the repo.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Live Demo <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition hover:border-black/20"
                >
                  GitHub <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}