import React from "react";

type Result = {
  name: string;
  when: string;
  detail: string;
  note: string;
  links: { label: string; href: string }[];
};

const HALVES: Result[] = [
  {
    name: "Trenton Summerfest Half Marathon",
    when: "June 28, 2025 · Trenton, MI",
    detail: "Chip time 1:19:58.58. Clock time 1:19:59.44. Pace 6:06. 2nd overall.",
    note: "Timed by Trivium Racing. The RunSignup link is the overall results, and my line is bib 1162.",
    links: [
      {
        label: "RunSignup results",
        href: "https://runsignup.com/Race/Results/55242#resultSetId-562053;perpage:10",
      },
      {
        label: "Trivium Racing",
        href: "https://triviumracing.com/results/",
      },
    ],
  },
  {
    name: "Saucony Love Run Philly Half Marathon",
    when: "March 29, 2026 · Philadelphia",
    detail: "1:23:36. 137th overall.",
    note: "That time and place are on the Endorphins page. The other link is the full race results.",
    links: [
      {
        label: "My result",
        href: "https://endorphinsrunning.com/race-results/ritvik-ellendula-732889",
      },
      {
        label: "Full results",
        href: "https://results.laurelt.com/luv/results?race=167942",
      },
    ],
  },
];

function ResultCard({ item }: { item: Result }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">{item.name}</h3>
      <p className="mt-1 text-sm text-zinc-500">{item.when}</p>
      <p className="mt-3 text-sm font-semibold text-amber-800">{item.detail}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.note}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {item.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-amber-800 hover:underline"
          >
            {link.label} →
          </a>
        ))}
      </div>
    </article>
  );
}

export default function EndurancePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Endurance
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          {`I like staying with something when it is slow. Running and swimming are the long version of that. Two half marathons, and one 2 mile open-water swim.`}
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Half marathons
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {HALVES.map((item) => (
            <ResultCard key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Open water
        </h2>
        <article className="mt-5 max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">
            Swim Across America · Motor City Mile
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            July 10, 2026 · Belle Isle, Detroit
          </p>
          <p className="mt-3 text-sm font-semibold text-amber-800">2 mile swim</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            {`Open-water swim for cancer research at the University of Michigan Rogel Cancer Center. I swam the 2 mile. The page below is the event, not a finish time, so I don't have a time listed here.`}
          </p>
          <a
            href="https://www.swimacrossamerica.org/site/TR?fr_id=8721&pg=entry"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-medium text-amber-800 hover:underline"
          >
            Event page →
          </a>
        </article>
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
