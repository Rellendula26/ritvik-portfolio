import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import ProjectBrief from "@/components/project-page/ProjectBrief";
import ProjectHero from "@/components/project-page/ProjectHero";
import PageSummary from "@/components/project-page/PageSummary";
import { projectSummary } from "@/data/page-summaries";
import {
  AnchorNav,
  BackToProjects,
  ProjectPageShell,
  SectionLabel,
} from "@/components/project-page/shared";
import type { CaseStudyMedia } from "@/data/engineering-case-study";
import type { Project } from "@/data/projects";

const MEDIA = "/projects/ecg-signal-conditioning";

function src(file: string) {
  return `${MEDIA}/${file}`;
}

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "decisions", label: "Decisions" },
  { id: "what-failed", label: "What failed" },
  { id: "layout", label: "Layout" },
  { id: "performance", label: "Performance" },
  { id: "diary", label: "Diary" },
  { id: "status", label: "Status" },
];

const DIARY_PAGES = Array.from({ length: 10 }, (_, index) => {
  const page = index + 1;
  const file = `diary/diary-page-${String(page).padStart(2, "0")}.jpg`;
  return {
    src: src(file),
    alt: `Project diary, page ${page} of 10.`,
  };
});

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-display mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4 text-base leading-relaxed text-zinc-800">
      {children}
    </div>
  );
}

function Figure({
  media,
  aspect,
}: {
  media: CaseStudyMedia;
  aspect: string;
}) {
  return <CaseStudyMediaFrame media={media} className={`${aspect} w-full`} />;
}

function OpenImage({
  src: imageSrc,
  alt,
  aspect,
  sizes,
}: {
  src: string;
  alt: string;
  aspect: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${aspect}`}>
      <ProjectMediaImage
        src={imageSrc}
        alt={alt}
        expandable
        className="object-contain object-center"
        sizes={sizes}
      />
    </div>
  );
}

const STAGES: Array<{
  title: string;
  body: React.ReactNode;
  equation?: string;
  image: string;
  alt: string;
  aspect: string;
}> = [
  {
    title: "Stage 1: AD623 + integrator",
    body: "The AD623 amplifies the difference between +IN and −IN and rejects anything common to both. U1A watches its output and drives the REF pin to cancel slow drift, so the output stays centred on 1.65 V while the heartbeat passes through.",
    equation: "G = 1 + 100 kΩ / 2.2 kΩ ≈ 46.5 (33 dB)",
    image: "schematic-stage1.png",
    alt: "AD623 with R4 gain resistor; U1A integrator driving REF.",
    aspect: "aspect-[865/685]",
  },
  {
    title: "Stage 2: 160 Hz low-pass + gain",
    body: "An RC filter at U1B's input rolls off everything above about 160 Hz before more gain is added. The gain resistor returns to 1.65 V, not ground, so the bias isn't amplified along with the signal.",
    equation: "fc = 1/(2π·10k·0.1µ) ≈ 159 Hz · G = 1 + 270k/12k = 23.5",
    image: "schematic-stage2.png",
    alt: "10 kΩ / 0.1 µF low-pass into a non-inverting gain stage (U1B).",
    aspect: "aspect-[810/565]",
  },
  {
    title: "Stage 3: high-pass + correction",
    body: (
      <>
        A series capacitor blocks any remaining DC. The R10 ∥ C4 feedback gives a ×2 boost at very low frequency, which undoes the dip that Stage 1&apos;s lossy integrator creates.
      </>
    ),
    equation: "(2 + sτ) / (1 + sτ), τ = 0.89 s",
    image: "schematic-stage3.png",
    alt: "High-pass at the + input, R10 ∥ C4 correction feedback (U2A).",
    aspect: "aspect-square",
  },
  {
    title: "1.65 V virtual ground",
    body: "Two 100 k resistors halve 3.3 V. U2B, wired as a follower, makes that half-supply stiff enough that the resistors tied to it can't drag it around. Every power port named 1.65V joins this net.",
    image: "schematic-virtual-ground.png",
    alt: "100 k / 100 k divider buffered by U2B onto the 1.65V net.",
    aspect: "aspect-[465/385]",
  },
];

const DECISIONS = [
  {
    title: "Gain split across three stages.",
    problem:
      "One amplifier at the full gain, about 60 dB, saturates on the electrode offset before the heartbeat shows up.",
    choice:
      "The AD623 takes the difference at about 46.5, and the two filter stages add the rest of the gain inside roughly 0.5–160 Hz.",
    tradeoff:
      "The low end is two shapes that have to cancel: Stage 1's dip, and Stage 3's boost.",
  },
  {
    title: "Signal zero at 1.65 V.",
    problem:
      "The Feather supplies one 3.3 V rail, and the op-amps cannot swing below ground.",
    choice:
      "Every stage is biased to 1.65 V, half the rail, from a divider buffered by U2B. Stage 2's gain resistor returns to that net, so the bias is not amplified with the signal.",
    tradeoff:
      "Resistors tied to an unbuffered divider will drag it, and a net that is only a name is not a voltage.",
  },
  {
    title: "A lossy integrator on REF.",
    problem: "REF has to cancel slow drift and still pass the heartbeat.",
    choice:
      "R5 across C2 cuts the lowest frequencies about in half, a 6 dB dip, and Stage 3's R10 ∥ C4 puts that back with a ×2 boost. The R/C node goes to U1A's − input, with + at 1.65 V.",
    tradeoff:
      "Neither stage is flat at the bottom by itself. Together the calculated −3 dB point is 0.53 Hz. Wiring the R/C node to + instead would latch REF to a rail.",
  },
  {
    title: "Through-hole everything.",
    problem: "I'm assembling the board by hand.",
    choice:
      "DIP and axial/radial parts only, including a custom DIP-8 footprint for the AD623.",
    tradeoff: "A bigger board, but every joint can be soldered and probed.",
  },
  {
    title: "−IN on a header, not ground.",
    problem:
      "The lab reference grounds −IN, which only suits the single-ended sine test.",
    choice: "Route −IN to its own pin on J1.",
    tradeoff:
      "One jumper wire for the sine test, but the same board works with real electrodes.",
  },
  {
    title: "Values from parts on hand.",
    problem: "I didn't have the lab's 330 k / 0.47 µF values.",
    choice: "100 k / 3.3 µF and 270 k parts, re-checked analytically.",
    tradeoff:
      "Different time constants, but nearly the same passband as the reference (see Performance).",
  },
];

const FAILURES: Array<{
  title: string;
  saw: React.ReactNode;
  checked: string;
  was: string;
  took: React.ReactNode;
  media?: Array<{ src: string; alt: string }>;
}> = [
  {
    title: "Vin reported as GND.",
    saw: "The Vin net kept showing as GND.",
    checked: "Junction dots along one long wire.",
    was: "A single wire had merged +IN, −IN, both gain pins and ground into one net.",
    took: "Crossing wires must not get junctions, so I read the dots.",
  },
  {
    title: "“Through-hole” parts that weren’t.",
    saw: "AD623BRZ and TLV2462IDG4 in the BOM.",
    checked: "The package codes and footprints.",
    was: "Both were SOIC, and the vault part was locked.",
    took: "The footprint decides THT or SMD, not the part name, so I built a DIP-8 footprint.",
    media: [
      {
        src: src("footprint-wizard.png"),
        alt: "Altium Footprint Wizard for a DIP-8 AD623.",
      },
      {
        src: src("footprint-dip8.png"),
        alt: "DIP-8 footprint drawing for the AD623.",
      },
      {
        src: src("footprint-dip8-3d.png"),
        alt: "3D body of the DIP-8 footprint for the AD623.",
      },
    ],
  },
  {
    title: "Decoupling caps in series.",
    saw: (
      <>
        3.3 V routed <em>through</em> a capacitor into pin 8.
      </>
    ),
    checked: "The power path on each chip.",
    was: "The chip would have had no DC power.",
    took: (
      <>
        Decoupling sits <em>across</em> the rails, one cap per package.
      </>
    ),
  },
  {
    title: "A reference with no source.",
    saw: "Resistors tied to a 1.65V port.",
    checked: "What actually drove that net.",
    was: "Nothing; a label is not a voltage.",
    took: "I added the divider + follower, and now every named net gets a “who drives this?” check.",
  },
];

const GAIN_ROWS = [
  ["0.5 Hz", "57.6 dB"],
  ["10 Hz", "60.7 dB (peak, ~1086×)"],
  ["100 Hz", "59.3 dB"],
  ["160 Hz", "57.7 dB"],
];

const LAYOUT_CHIPS = [
  "Validate: 0 errors",
  "Routed: 54/54",
  "DRC electrical: 0",
  "DRC silkscreen: 6 (cosmetic)",
  "Outputs: RS-274X + NC drill",
];

const STATUS = [
  {
    label: "Done",
    body: "Clean schematic, custom DIP-8 footprint, routed two-layer board, Gerbers exported.",
  },
  {
    label: "Open",
    body: "Add C5 (U2 decoupling) to the PCB, tidy four auto-generated designators and the BOM part numbers, then re-export.",
  },
  {
    label: "Next",
    body: "Fabricate and assemble, confirm 1.65 V, run the lab's stage-by-stage tests and Bode sweeps, then capture a live ECG on the Feather.",
  },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1.5 text-zinc-800">{children}</dd>
    </div>
  );
}

export default function EcgSignalConditioningPage({ project }: { project: Project }) {
  const pdf = project.documentLink?.href ?? `${MEDIA}/ecg-project-diary.pdf`;

  return (
    <ProjectPageShell>
      <BackToProjects />
      <ProjectHero project={project} />
      <div className="mt-8">
        <PageSummary {...projectSummary(project)} />
      </div>
      <AnchorNav items={NAV} />

      <div className="mt-10 space-y-12 md:space-y-14">
        <Section id="overview" label="Overview" title="What it does">
          <Prose>
            <p>
              An ECG at the skin is about 1 mV. It rides on electrode offsets hundreds of times larger and shares the wires with 60 Hz mains noise. One high-gain amplifier would saturate immediately, so the job is split across three stages. The instrumentation amplifier takes the <em>difference</em> between two electrodes. An integrator loop strips out the DC. Two filter stages then shape the band to about 0.5–160 Hz, where the PQRST waveform lives, and add the rest of the gain.
            </p>
            <p>
              Everything runs from the Feather&apos;s 3.3 V rail, so &apos;zero&apos; for the signal is 1.65 V, the middle of the supply, not 0 V. That gives the op-amps the most room to swing both ways.
            </p>
          </Prose>
          <div className="mt-6 space-y-5">
            <Figure
              aspect="aspect-[960/330]"
              media={{
                kind: "image",
                src: src("ecg-signal-chain.svg"),
                alt: "Signal chain: J1 input → AD623 → 160 Hz low-pass → 0.5 Hz high-pass → J3 output, with an integrator on REF and a buffered 1.65 V reference.",
                label: "Signal chain",
                caption:
                  "Signal chain: J1 input → AD623 → 160 Hz low-pass → 0.5 Hz high-pass → J3 output, with an integrator on REF and a buffered 1.65 V reference.",
                fit: "contain",
              }}
            />
            <Figure
              aspect="aspect-[1805/1409]"
              media={{
                kind: "image",
                src: src("schematic-full.png"),
                alt: "Full Altium schematic.",
                label: "Schematic",
                caption: "Full Altium schematic.",
                fit: "contain",
              }}
            />
          </div>
        </Section>

        <Section id="how-it-works" label="How it works" title="Four blocks, one reference">
          <div className="space-y-5">
            {STAGES.map((stage, index) => (
              <article
                key={stage.title}
                className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="grid items-center gap-6 p-5 md:p-7 lg:grid-cols-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-sm font-semibold text-orange-900">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-zinc-800">{stage.body}</p>
                    {stage.equation ? (
                      <p className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900">
                        {stage.equation}
                      </p>
                    ) : null}
                  </div>
                  <Figure
                    aspect={stage.aspect}
                    media={{
                      kind: "image",
                      src: src(stage.image),
                      alt: stage.alt,
                      label: stage.title,
                      caption: stage.alt,
                      fit: "contain",
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="decisions" label="Decisions" title="Design decisions">
          <div className="grid gap-4 lg:grid-cols-3">
            {DECISIONS.map((decision) => (
              <article
                key={decision.title}
                className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                  {decision.title}
                </h3>
                <dl className="mt-4 space-y-4 text-base leading-relaxed">
                  <Field label="Problem">{decision.problem}</Field>
                  <Field label="Choice">{decision.choice}</Field>
                  <Field label="Tradeoff">{decision.tradeoff}</Field>
                </dl>
              </article>
            ))}
          </div>
        </Section>

        <Section id="what-failed" label="What failed" title="What broke in the schematic">
          <div className="space-y-10">
            {FAILURES.map((item) => (
              <article key={item.title} className="border-t border-zinc-200 pt-6">
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {item.title}
                </h3>
                <dl className="mt-5 max-w-3xl space-y-5 text-base leading-relaxed">
                  <Field label="What I saw">{item.saw}</Field>
                  <Field label="What I checked">{item.checked}</Field>
                  <Field label="What it was">{item.was}</Field>
                  <Field label="What I took from it">{item.took}</Field>
                </dl>
                {item.media ? (
                  <div className="mt-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {item.media.map((shot) => (
                        <div
                          key={shot.src}
                          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                        >
                          <OpenImage
                            src={shot.src}
                            alt={shot.alt}
                            aspect="aspect-[4/3]"
                            sizes="(max-width: 640px) 100vw, 320px"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-zinc-700">
                      Building a DIP-8 footprint for the AD623 in Altium.
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Section>

        <Section id="layout" label="Layout" title="From ratsnest to Gerbers">
          <Prose>
            <p>
              Parts are grouped by chip in signal order (AD623 → U1 → U2), with the input header away from the output. Rules were set for hand fabrication: 15–30 mil traces and 14 mil clearance. The Situs autorouter completed 54 of 54 connections on two layers.
            </p>
          </Prose>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Figure
              aspect="aspect-[555/635]"
              media={{
                kind: "image",
                src: src("pcb-placement.png"),
                alt: "Placement: each chip clustered with its own parts.",
                label: "Placement",
                caption: "Placement: each chip clustered with its own parts.",
                fit: "contain",
              }}
            />
            <Figure
              aspect="aspect-[566/638]"
              media={{
                kind: "image",
                src: src("pcb-routed.png"),
                alt: "Two-layer ECG front-end PCB, 54/54 nets routed. Red = top copper, blue = bottom.",
                label: "Routed",
                caption:
                  "Two-layer ECG front-end PCB, 54/54 nets routed. Red = top copper, blue = bottom.",
                fit: "contain",
              }}
            />
          </div>
          <div className="mt-5 max-w-xl">
            <Figure
              aspect="aspect-[7/3]"
              media={{
                kind: "image",
                src: src("schematic-headers.png"),
                alt: "J1 input, J2 power, J3 output headers.",
                label: "Headers",
                caption: "J1 input, J2 power, J3 output headers.",
                fit: "contain",
              }}
            />
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {LAYOUT_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[11px] font-medium text-orange-900"
              >
                {chip}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="performance" label="Performance" title="Predicted response">
          <p className="max-w-2xl rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm font-medium leading-relaxed text-amber-950">
            Calculated from component values with ideal op-amps, not yet measured on hardware.
          </p>
          <div className="mt-6 space-y-5">
            <Figure
              aspect="aspect-[2/1]"
              media={{
                kind: "image",
                src: src("bode-overall.png"),
                alt: "Predicted overall gain: ~60.7 dB peak, −3 dB at 0.53 Hz and 160 Hz.",
                label: "Overall",
                caption:
                  "Predicted overall gain: ~60.7 dB peak, −3 dB at 0.53 Hz and 160 Hz.",
                fit: "contain",
              }}
            />
            <Figure
              aspect="aspect-[12/5]"
              media={{
                kind: "image",
                src: src("bode-per-stage.png"),
                alt: "Gain of each stage alone.",
                label: "Per stage",
                caption: "Gain of each stage alone.",
                fit: "contain",
              }}
            />
          </div>
          <div className="mt-6 max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Predicted gain from the component values, ideal op-amps
              </caption>
              <thead className="bg-[#f7f1e8] text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Frequency
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Predicted gain
                  </th>
                </tr>
              </thead>
              <tbody>
                {GAIN_ROWS.map(([frequency, gain]) => (
                  <tr key={frequency} className="border-t border-zinc-200">
                    <th scope="row" className="px-4 py-3 font-medium text-zinc-900">
                      {frequency}
                    </th>
                    <td className="px-4 py-3 text-zinc-700">{gain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-800">
            A 2 mVpp, 100 Hz test signal should come out at about 1.85 Vpp centred on 1.65 V, inside the 3.3 V rails.
          </p>
        </Section>

        <Section id="diary" label="Diary" title="Project diary">
          <Prose>
            <p>
              The full engineering write-up: every stage, every fix, the footprint work and the layout, as a 10-page diary in the same format as my other project journals.
            </p>
          </Prose>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {DIARY_PAGES.map((page, index) => (
              <li
                key={page.src}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              >
                <OpenImage
                  src={page.src}
                  alt={page.alt}
                  aspect="aspect-[1105/1430]"
                  sizes="(max-width: 1024px) 50vw, 18vw"
                />
                <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                  Page {index + 1}
                </p>
              </li>
            ))}
          </ul>
          <a
            href={pdf}
            target="_blank"
            rel="noreferrer"
            className="btn-lift mt-6 inline-flex items-center rounded-full border border-orange-300 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 shadow-sm hover:bg-orange-50"
          >
            Read the full diary (PDF)
          </a>
          <div className="mt-6 hidden overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.06)] lg:block">
            <p className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
              ECG project diary (PDF, 10 pages).
            </p>
            <iframe
              src={pdf}
              title="ECG project diary (PDF, 10 pages)."
              className="h-[900px] w-full"
              loading="lazy"
            />
          </div>
        </Section>

        <Section id="status" label="Status" title="Where it stands">
          <div className="grid gap-4 md:grid-cols-3">
            {STATUS.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800">
                  {item.label}
                </p>
                <p className="mt-3 text-base leading-relaxed text-zinc-700">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <ProjectBrief project={project} className="mt-2" />
      </div>
    </ProjectPageShell>
  );
}
