import Image from "next/image";
import React from "react";

type LinkItem = { label: string; href: string };

type Performance = {
  title: string;
  event: string;
  result?: string;
  blurb: string;
  youtubeId: string;
  tags: string[];
};

const DHAMAKA_PERFORMANCES: Performance[] = [
  {
    title: "Legends 2026 · Front Row",
    event: "Desi Dance Network Nationals · Groove with XO",
    result: "1st Place · National Champions",
    blurb:
      "Front-row view of the Bill Nye–inspired set that closed out the season. This is the one that made us national champs.",
    youtubeId: "sCwGDU0esws",
    tags: ["Nationals", "Front Row", "2026"],
  },
  {
    title: "Legends 2026 · Back Row",
    event: "Desi Dance Network Nationals · Groove with XO",
    result: "1st Place · National Champions",
    blurb:
      "Back-row angle of the same nationals set. Different sightlines, same energy.",
    youtubeId: "I1_l74AIZr8",
    tags: ["Nationals", "Back Row", "2026"],
  },
  {
    title: "ATL Tamasha 2025 · Front Row",
    event: "ATL Tamasha · MxG Studios",
    result: "1st Place",
    blurb: "Early season first place on the road to Legends.",
    youtubeId: "Nd2n9cPYsWE",
    tags: ["Qualifier", "1st Place"],
  },
  {
    title: "Legacy on Broad 2026 · Front Row",
    event: "Legacy on Broad · Aaron K Wilson Media",
    result: "2nd Place",
    blurb: "Circuit reps mid-season. Placement still counted toward the grind.",
    youtubeId: "gjh7Ebsmmec",
    tags: ["Qualifier", "2nd Place"],
  },
  {
    title: "Tufaan 2026 · Front Row",
    event: "Tufaan · MxG Studios",
    result: "1st Place",
    blurb: "Another qualifying win before Austin.",
    youtubeId: "7Rx8JgS-HV8",
    tags: ["Qualifier", "1st Place"],
  },
];

const BACK_2_ROOTS_URL =
  "https://tickets.brampton.ca/Online/default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=EB79CBB0-0174-4F07-830D-F0EAB6817E5B&BOparam::WScontent::loadArticle::context_id=7F8CF266-7DDF-4225-BDD4-5E057150F2AD";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function ActionLink({ label, href }: LinkItem) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

function YouTubeCard({ item }: { item: Performance }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{item.event}</p>
        {item.result ? (
          <p className="mt-2 text-sm font-semibold text-amber-800">{item.result}</p>
        ) : null}
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.blurb}</p>
        <a
          href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-medium text-amber-800 hover:underline"
        >
          Open on YouTube →
        </a>
      </div>
    </article>
  );
}

function SeasonLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-900">
      {children}
    </span>
  );
}

export default function DancePage() {
  const nationals = DHAMAKA_PERFORMANCES.filter((p) => p.tags.includes("Nationals"));
  const qualifiers = DHAMAKA_PERFORMANCES.filter((p) => !p.tags.includes("Nationals"));

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-14">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              Dance
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600">
              Competitive South Asian fusion with Penn Dhamaka during the school year, summer
              training with Furteelay / D2G, plus the shorter clips I post when I am just messing
              around. Different rooms. Same obsession with getting cleaner.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge>Penn Dhamaka</Badge>
            <Badge>Furteelay / D2G</Badge>
            <Badge>Bhangra</Badge>
            <Badge>Fusion</Badge>
            <Badge>TikTok</Badge>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[320px] w-full md:h-[420px]">
            <Image
              src="/life/atl.jpg"
              alt="Penn Dhamaka competition"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1000px"
              priority
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-2">
            <SeasonLabel>Seasons</SeasonLabel>
            <Badge>College circuit</Badge>
            <Badge>Summer training</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActionLink label="Dhamaka 25–26" href="#season-dhamaka" />
            <ActionLink label="Summer D2G" href="#season-summer" />
            <ActionLink label="TikTok" href="#tiktok" />
          </div>
        </div>
      </header>

      {/* Season 1: Penn Dhamaka */}
      <section id="season-dhamaka" className="mt-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SeasonLabel>2025–2026 · COLLEGE SEASON</SeasonLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
              Penn Dhamaka
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Penn&apos;s all-male South Asian fusion team. Bollywood, Bhangra, hip-hop, late
              practices, and a nationals run that ended with Dhamaka&apos;s first Desi Dance
              Network title.
            </p>
          </div>
          <Badge>Competed</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">TEAM</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Penn Dhamaka</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Main competitive lane for me in college. Technique, staging, and surviving a long
              circuit season together.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">SEASON</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Legends national champs</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              April 18, 2026 in Austin: first national title. Season included first-place runs at
              comps like ATL Tamasha on the way there.
            </p>
            <a
              href="https://www.thedp.com/article/2026/04/penn-dhamaka-wins-desi-dance-network-national-circuit"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-amber-800 hover:underline"
            >
              Daily Pennsylvanian coverage →
            </a>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">SET</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Bill Nye theme</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Nationals set leaned into a Bill Nye / science-storytelling concept with multi-style
              choreography, props, and audience interaction.
            </p>
          </div>
        </div>

        <div id="nationals" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
                NATIONALS · LEGENDS 2026
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                Front and back row of the championship set. If you only watch two videos on this
                page, watch these.
              </p>
            </div>
            <Badge>1st Place</Badge>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {nationals.map((item) => (
              <YouTubeCard key={item.youtubeId} item={item} />
            ))}
          </div>
        </div>

        <div id="qualifiers" className="mt-10 scroll-mt-24">
          <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
            QUALIFYING COMPETITIONS
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Circuit footage from the season grind before Austin.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {qualifiers.map((item) => (
              <YouTubeCard key={item.youtubeId} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Season 2: Summer Furteelay / D2G */}
      <section id="season-summer" className="mt-16 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <SeasonLabel>SUMMER 2026 · TRAINING</SeasonLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
              Furteelay Dance Academy · D2G
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              After the college season, I spent the summer training with Furteelay Dance
              Academy&apos;s U18 team, Detroit De Gabroo (D2G). I danced and trained with them; I
              did not compete. They took the set to Back 2 Roots and Richmond Mela.
            </p>
          </div>
          <Badge>Trained · Did not compete</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">ACADEMY</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Furteelay</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Summer room for sharper Bhangra reps outside the college fusion circuit. Different
              coaching, different standards, useful pressure.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">TEAM</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">D2G · Detroit De Gabroo</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              U18 team I trained with over the summer. I was there for practice and process, not
              for the competition roster.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">COMPS</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Back 2 Roots · Richmond Mela</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              The team competed at both. I stayed on the training side and still got a lot out of
              learning the set with them.
            </p>
            <a
              href={BACK_2_ROOTS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-medium text-amber-800 hover:underline"
            >
              Back 2 Roots event page →
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <YouTubeCard
            item={{
              title: "D2G Richmond Mela Intro · 2026",
              event: "Furteelay Dance Academy · Detroit De Gabroo",
              blurb:
                "Team intro for Richmond Mela. Not my competition stage, but this is the room I trained in over the summer.",
              youtubeId: "DB_vI3zHIJc",
              tags: ["Summer", "D2G", "Intro"],
            }}
          />
          <div className="flex flex-col justify-center rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">
              WHY IT MATTERED
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
              Training without the scoreboard
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Summer was less about medals and more about staying sharp between college seasons.
              Furteelay / D2G gave me another standard to chase: cleaner footwork, tighter group
              timing, and reps in a dedicated Bhangra academy environment.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionLink
                label="Intro on YouTube"
                href="https://www.youtube.com/watch?v=DB_vI3zHIJc"
              />
              <ActionLink label="Back 2 Roots" href={BACK_2_ROOTS_URL} />
            </div>
          </div>
        </div>
      </section>

      <section id="tiktok" className="mt-16 scroll-mt-24">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm md:p-9">
          <p className="text-xs font-semibold tracking-[0.22em] text-zinc-500">
            PERSONAL CLIPS
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            TikTok · @ritcrazymovie
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Separate from team seasons. This is where I post dance TikToks, freestyles, and shorter
            form experiments.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://www.tiktok.com/@ritcrazymovie"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Open TikTok
            </a>
            <a
              href="https://www.instagram.com/penndhamaka/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Penn Dhamaka Instagram
            </a>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <a
          href="/life"
          className="text-sm font-medium text-amber-800 hover:text-amber-900 hover:underline"
        >
          ← Back
        </a>
      </div>
    </main>
  );
}
