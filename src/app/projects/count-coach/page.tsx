import React from "react";
import Image from "next/image";

type LinkItem = { label: string; href: string };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function ActionLink({ label, href }: LinkItem) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

type Stage = {
  id: string;
  title: string;
  when: string;
  goal: string;
  decisions: string[];
  shipped: string[];
  learned: string[];
  media?: { kind: "image" | "video"; src: string; alt?: string };
};

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <details className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-900">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{stage.title}</p>
            <p className="mt-1 text-sm text-zinc-600">
              <span className="font-medium text-zinc-700">{stage.when}</span> ·{" "}
              {stage.goal}
            </p>
          </div>
        </div>

        <span className="mt-1 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 group-open:bg-amber-50 group-open:text-amber-900">
          Expand
        </span>
      </summary>

      <div className="border-t border-zinc-100 px-5 pb-5 pt-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-zinc-900">
              KEY DECISIONS
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
              {stage.decisions.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest text-zinc-900">
              WHAT SHIPPED
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
              {stage.shipped.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest text-zinc-900">
              WHAT I LEARNED
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
              {stage.learned.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        {stage.media ? (
          <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
            {stage.media.kind === "image" ? (
              <div className="relative h-64 w-full">
                <Image
                  src={stage.media.src}
                  alt={stage.media.alt ?? "Stage media"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <video
                src={stage.media.src}
                className="h-[420px] w-full object-cover"
                controls
                playsInline
              />
            )}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export default function Page() {
  const title = "Count Coach";
  const subtitle =
    "A full-stack Next.js audio analysis tool that visualizes waveforms, using time ranges, and estimates BPM to help rookie dancers learn to estimate beats better and stay on 'count'.";
  const coverSrc = "/projects/count-coach-poster.png";

  const repoUrl = "https://github.com/Rellendula26/fresh-count-coach";
  const demoUrl =
    "https://fresh-count-coach-eyjdqm4nc-ritvik-ellendula-s-projects.vercel.app/";
  const demoVideoSrc = "/projects/count-coach-demo.mp4";

  const badges = ["Independent", "Next.js", "Audio", "Signal Processing"];
  const actions: LinkItem[] = [
    { label: "VERCEL APP", href: demoUrl },
    { label: "SOURCE CODE", href: repoUrl },
    { label: "WRITEUP", href: "#overview" },
    { label: "PROCESS", href: "#process" },
    { label: "GALLERY", href: "#gallery" },
  ];

  const stages: Stage[] = [
    {
      id: "problem",
      title: "V1",
      when: "Week 0-2",
      goal: "Initial Goal was to get the counts from any song ( later developed to mix-specific ).",
      decisions: [
        "First, I began coding on Google Colab, using Spotify API to let the user search for any song." ,
        "This Spotify API didn't work though, so I used file uploading",
      ],
      shipped: [
        "Basic Google Colab skeleton, using Python to extract time information",
        "At this point, there's no in-depth metronome overlay, solely beat analysis",
      ],
      learned: [
        "Usages of different sound-specific libraries like librosa",
        "Limitations of Spotify API",
      ],
      media: {
        kind: "video",
        src: "/projects/ccv1demo.mp4",
        alt: "Waveform UI",
      },
    },
    {
      id: "V2",
      title: "Successful Metronome Overlay in Python",
      when: "Week 2-3",
      goal: "Pass an audio file through the code, and returns an audio file with metronome overlay",
      decisions: [
        "Using Librosa and Pandas dataframes",
      ],
      shipped: [
        "Now, if you pass an audio file through, it successfully returns the metronome overlay.",
        "Additionally, returns extensive information on the beats in the song.",
      ],
      learned: [
        "Extracting sound data w/ Librosa and mainly using Panda Dataframes in versatile ways",
      ],
      media: {
        kind: "video",
        src: "/projects/ccv2demo.mp4",
        alt: "Waveform UI",
      },
    },
    {
      id: "V3",
      title: "V2 + Optional Modulations",
      when: "Week 3-4",
      goal: "Adding Different Features to the prior code",
      decisions: [
        "Utilized more libraries like numpy",
        "Loaded in voice samples for actual 'human' counting",
        "Utilized several UDFs for easier iterability",
      ],
      shipped: [
        "V3 is able to deliver multiple different audio files that are slowed down/human counted versions of the original mix ",
        "User can decide which different audio file they want, and the degree of slowness.",
      ],
      learned: [
        "Key Limitation: The beat analysis is too generalized, especially for mixes seen in DDN, where BPM varies heavily.",
      ],
      media: {
        kind: "video",
        src: "/projects/ccv3demo.mp4",
        alt: "Tempo result UI",
      },
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-14">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[320px] w-full md:h-[420px]">
            <Image
              src={coverSrc}
              alt={`${title} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1000px"
              priority
            />
          </div>
        </div>

        {/* Action strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-900">
            PROJECT CASE STUDY
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {actions.map((a) => (
              <ActionLink key={a.label} {...a} />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div id="overview" className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                Count Coach started from my personal struggles in dance. I like
                to think of myself as relatively athletic; however, the one
                thing that I CAN'T DO is counting beats in mixes. I am always
                off timing, so I decided to try and create a way to visualize
                beats and mixes. The tool also helps isolates a section that
                you're struggling with, and returns a tempo with a metronome to
                help rookie dancers like myself improve their ability to "count
                beats." Intentionality at it's finest.
              </p>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                The app combines a waveform UI (for range selection + playback)
                with server-side audio processing for tempo inference. The goal
                is simple: faster practice loops, clearer rhythm intuition, and
                less time rewinding the same 8-count.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I BUILT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Waveform visualization and scrub/playback UX (WaveSurfer),
                  designed for “loop this exact section” practice.
                </li>
                <li>
                  Range selection (start/end) that propagates cleanly through
                  the UI and into the analysis pipeline.
                </li>
                <li>
                  Tempo inference endpoint (Next.js API routes) that processes
                  the selected region and returns BPM + confidence.
                </li>
                <li>
                  A frontend workflow focused on fast iteration: upload/choose
                  audio → select region → analyze → practice.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                TECHNICAL APPROACH
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Audio is decoded and analyzed server-side to keep the client
                  lightweight and avoid browser inconsistencies.
                </li>
                <li>
                  Tempo estimation is based on extracting rhythmic periodicity
                  from energy/onset patterns (signal-processing style) rather
                  than guessing from metadata.
                </li>
                <li>
                  The UI is designed for practice: fewer clicks, clearer state,
                  and minimal friction between “find the beat” and “train it.”
                </li>
              </ul>
            </div>

            {/* DESIGN PROCESS */}
            <section id="process" className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                    DESIGN PROCESS
                  </h2>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-700">
                    The project developed in numerous iterations over time. 
                    With each rendition, I learned a different component I wanted to add.
                    Then, I learned how to create it using React & Next.js frameworks. 
                  </p>
                </div>
                <span className="hidden rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 md:inline">
                  Click a stage to expand
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {stages.map((s, i) => (
                  <StageCard key={s.id} stage={s} index={i} />
                ))}
              </div>
            </section>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Made tempo debugging tangible—dancers can isolate a messy
                  transition and get a tempo anchor instantly.
                </li>
                <li>
                  Turned practice into a tighter feedback loop: visualize →
                  select → infer → drill.
                </li>
                <li>
                  Shipped as a deployable Next.js app with a reusable component
                  structure for future “dance coaching” features.
                </li>
                <li>Deployed on Vercel for public usage.</li>
              </ul>
            </div>

            {/* Demo */}
            <section id="demo">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                DEMO
              </h2>

              <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <video
                  src={demoVideoSrc}
                  className="h-[650px] w-full object-cover"
                  controls
                  playsInline
                />
              </div>

              <div className="mt-3 flex gap-2">
                <ActionLink label="OPEN LIVE DEMO" href={demoUrl} />
                <ActionLink label="SOURCE CODE" href={repoUrl} />
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
              DETAILS
            </h3>

            <dl className="mt-4 space-y-4 text-sm text-zinc-700">
              <div>
                <dt className="text-zinc-500">Role</dt>
                <dd className="font-medium">Full-Stack Developer</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Context</dt>
                <dd className="font-medium">Independent Project</dd>
              </div>

              <div>
                <dt className="text-zinc-500">Core Features</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Waveform UI",
                    "Range Selection",
                    "Tempo Inference",
                    "API Routes",
                  ].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Iterations</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["V0 Waveform", "V1 Tempo API", "V2 Metronome", "Next Steps"].map(
                    (t) => (
                      <Badge key={t}>{t}</Badge>
                    )
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "React",
                    "TypeScript",
                    "WaveSurfer.js",
                    "Signal Processing",
                  ].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2">
              <a
                href="/projects"
                className="block text-sm font-medium text-amber-800 hover:underline"
              >
                ← Back to Projects
              </a>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-medium text-zinc-700 hover:underline"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mt-16">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
          GALLERY
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {["/projects/count-coach-1.png", "/projects/count-coach-2.png"].map(
            (src) => (
              <div
                key={src}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={src}
                    alt="Count Coach gallery image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )
          )}
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          Replace the gallery images with your actual screenshots (waveform UI,
          tempo result panel, range selection, etc.).
        </p>
      </section>
    </main>
  );
}
