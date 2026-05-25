import React from "react";
import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";
import { PROJECT_CARD_VIDEOS } from "@/data/project-media";

type LinkItem = { label: string; href: string };

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
    dark: "border-slate-800 bg-slate-900 text-white",
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

function MiniCard({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">{text}</p>
    </div>
  );
}

export default function Page() {
  const title = "Penn Plates";
  const subtitle =
    "A social dining platform that helps Penn students meet new people through small-group dining hall meals.";

  const liveUrl = "https://www.pennplates.org/";
  const heroVideo = PROJECT_CARD_VIDEOS.pennplates;
  const galleryImages = ["/projects/website-1.png", "/projects/website-2.png"];

  const actions: LinkItem[] = [
    { label: "LIVE DEMO", href: liveUrl },
    { label: "OVERVIEW", href: "#overview" },
    { label: "V1", href: "#v1" },
    { label: "V2", href: "#v2" },
  ];

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(to_bottom,#fff8f2_0%,#fffdf9_24%,#ffffff_48%,#fffaf5_100%)]">
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.06),transparent_20%),radial-gradient(circle_at_60%_20%,rgba(251,191,36,0.08),transparent_18%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.07)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.12),transparent_30%)]" />

          <div className="relative grid grid-cols-1 gap-8 px-6 py-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge tone="dark">SOCIAL PRODUCT CASE STUDY</Badge>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                {title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
                {subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge>Web Application</Badge>
                <Badge>Campus Used</Badge>
                <Badge>Mini Social Media Platform</Badge>
                <Badge>Supabase</Badge>
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-700 md:text-base">
                Penn Plates is built around a simple idea: meeting new people
                should not require a huge event or a whole night of planning.
                Sometimes all it takes is a meal, a small group, and a better
                way to make that introduction happen. I'm working with this app through
                Penn SPARK, a computer science club at Penn, so this is a collaboration project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {actions.map((action) => (
                  <ActionLink key={action.label} {...action} />
                ))}
              </div>
            </div>

            <div>
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-200/45 via-amber-100/30 to-pink-100/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-orange-300" />
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-3 rounded-full bg-zinc-300" />
                    <span className="ml-2 text-xs font-medium text-zinc-500">
                      Penn Plates Preview
                    </span>
                  </div>

                  <div className="relative h-[300px] w-full md:h-[380px]">
                    <LazyVideo
                      src={heroVideo.src}
                      poster={heroVideo.poster}
                      className="h-full w-full object-cover object-top"
                      playWhenVisible
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="overview" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <SectionLabel>Overview</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                A lighter way to meet people on campus
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Small Groups</Badge>
              <Badge>Dining Hall Matching</Badge>
              <Badge>Low-Friction Social</Badge>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MiniCard
              label="Problem"
              title="Underclassmen don't know upperclassmen"
              text="As an underclassmen, a big problem that I faced is not knowing many upperclassmen, which made course registration and navigating life @ Penn difficult."
            />
            <MiniCard
              label="Solution"
              title="Use meals as the setting"
              text="Penn Plates matches students into small dining hall groups so meeting new people feels more natural, casual, and easier to commit to."
            />
            <MiniCard
              label="Why it works"
              title="Small, simple, low-pressure"
              text="The format is intentionally lightweight. You sign up, get matched, receive messages through the backend, and you're all set!"
            />
          </div>
        </section>

        <section id="v1" className="mt-14">
          <SectionLabel>V1</SectionLabel>
          <div className="mt-4 rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 gap-6 p-6 md:p-7 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge tone="warm">PAST BUILD</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                  Validate the core interaction first
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 md:text-base">
                  The first version focuses on proving the main flow works:
                  students pick a dining hall slot, get matched into a small
                  group, and actually show up for the meal. The point was not to
                  overcomplicate the product early, but to make sure the basic
                  coordination experience felt smooth and real.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                    In V1
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                    <li>Dining hall + time slot signup</li>
                    <li>Small-group matching</li>
                    <li>Simple coordination flow</li>
                    <li>Fast, lightweight user experience</li>
                  </ul>
                </div>

                <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                    Focus
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                    <li>Reduce social friction</li>
                    <li>Keep the flow minimal</li>
                    <li>Make commitment feel easy</li>
                    <li>Test real campus usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="v2" className="mt-14">
          <SectionLabel>V2</SectionLabel>
          <div className="mt-4 rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 gap-6 p-6 md:p-7 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge tone="warm">CURRENT DIRECTION</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                  Adding backend functionality
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700 md:text-base">
                  The second version builds on the validated matching flow and starts
                  pushing the product toward a stronger social experience. Prior, it was 
                  manual matching, but now there is a Supabase database in order to help with matching.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                    In V2
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                    <li>Better backend</li>
                    <li>Automatic Pairing</li>
                  </ul>
                </div>

                <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
                    Goal
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
                    <li>Increased product independence (No longer manual additions)</li>
                    <li>Pairing Algorithm for App's self-sustenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="mt-14">
          <SectionLabel>Project Demo</SectionLabel>
          <div className="mt-4 rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-white to-orange-50/60 p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Live product
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 md:text-base">
                  The current live version of Penn Plates is available here.
                </p>
              </div>

              <ActionLink label="OPEN PENN PLATES" href={liveUrl} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}