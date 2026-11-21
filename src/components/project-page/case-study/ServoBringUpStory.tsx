"use client";

import { useState } from "react";
import CaseStudyMediaFrame from "@/components/project-page/case-study/CaseStudyMediaFrame";
import { SectionLabel } from "@/components/project-page/shared";

type ChainId = "teensy" | "i2c" | "mux" | "pwm" | "servo" | "gpio" | "oe";

const CHAIN: Array<{ id: ChainId; title: string; plain: string; tech: string }> = [
  {
    id: "teensy",
    title: "Teensy 4.1",
    plain: "The embedded controller. This is the board that runs my code and decides what an actuator should do.",
    tech: "It talks to the chips on its Wire2 I2C port. GPIO 6 is a separate pin. It is not part of that bus, and a successful bus scan does not set it.",
  },
  {
    id: "i2c",
    title: "I2C, both ways",
    plain: "The conversation between the controller and the chips. A command is not finished until the other chip can answer.",
    tech: "SDA has to carry data in both directions, because a device acknowledges a message and can send data back. SCL is the clock. A device can also hold that clock if it needs more time. A one-direction part drops the reply.",
  },
  {
    id: "mux",
    title: "TCA9548A",
    plain: "A communication switch. It chooses which group of devices the controller is allowed to see. One conversation at a time, eight choices.",
    tech: "The multiplexer answers at address 0x70. Channel 7 is the branch that reaches the pulse controller.",
  },
  {
    id: "pwm",
    title: "PCA9685",
    plain: "A chip whose only job is pulses. The Teensy sends a number. This chip turns that number into a timed electrical pulse, on up to 16 outputs, so the controller is not building each pulse itself.",
    tech: "It sits at address 0x40, behind multiplexer channel 7. Each output is a 12-bit pulse width. I set the frame to about 50 Hz. The chip can store those widths and still keep the pins quiet until output enable is on.",
  },
  {
    id: "servo",
    title: "Servo",
    plain: "The motor that turns a pulse into a position. If the pulse never leaves the chip, the horn does not move, even when the chip remembers the command.",
    tech: "The frame I configured is about 20 ms, which is 50 pulses a second. Inside that frame, a pulse near 1 ms, 1.5 ms, or 2 ms is a different position request. I have not measured the angle each width produced.",
  },
];

const ENABLE: Array<{ id: ChainId; title: string; plain: string; tech: string }> = [
  {
    id: "gpio",
    title: "Teensy GPIO 6",
    plain: "The pin that flips the hardware switch. It is not an I2C message. The bus can be perfect and this pin can still hold every output off.",
    tech: "GPIO 6 is wired to the pulse controller's output-enable pin. pinMode makes the Teensy actually drive it. Until then, firmware is not in control of that line.",
  },
  {
    id: "oe",
    title: "Output enable",
    plain: "A hardware switch on the pulse chip. Off, the pulses stay inside the chip. On, they reach the servo wires.",
    tech: "PCA9685 OE is active low. Driving GPIO 6 low turns the outputs on. High, or never driven, leaves them off. That is separate from the PWM registers, which can already hold the right numbers.",
  },
];

const FAILURES = [
  "The motor supply never arrived",
  "The bus never connected",
  "The switch was on the wrong channel",
  "The pulse width was wrong",
  "The connector was miswired",
  "The servo or the pulse pin was damaged",
  "The outputs were switched off in hardware",
];

const STAGES: Array<{
  id: string;
  title: string;
  hypothesis: string;
  test: string;
  result: string;
  why: string;
}> = [
  {
    id: "talk",
    title: "Could the controller see anyone?",
    hypothesis: "If the bus is dead, or its supply is missing, nothing downstream can answer.",
    test: "Diagnostic C++ on the Teensy scanned its I2C ports. A meter checked the supply the communication parts actually need.",
    result: "That circuitry wanted its own power connection. Once it had it, the scan found the multiplexer at 0x70.",
    why: "There is no point setting a pulse width if the controller cannot see the switch that leads to the pulse chip.",
  },
  {
    id: "find",
    title: "Which door is the pulse chip behind?",
    hypothesis: "The multiplexer has eight channels. The pulse chip is on one of them, or it is not there.",
    test: "The firmware selected each channel in turn and scanned for devices behind it.",
    result: "Channel 7 answered with the PCA9685 at 0x40. The other channels were not where this servo lives.",
    why: "A command sent down the wrong channel looks exactly like a chip that is ignoring you.",
  },
  {
    id: "both-ways",
    title: "Can it answer, or only listen?",
    hypothesis: "A chip that accepts a write might still be handing back garbage. Both directions have to work.",
    test: "I wrote 0x55, read it back, then did the same with 0xAA, through the multiplexer to the pulse chip.",
    result: "Both patterns came back unchanged. The controller can send a command and retrieve what the chip stored.",
    why: "This retired the bus, the channel, and a one-way connection. The command was really landing.",
  },
  {
    id: "pulse",
    title: "Did the chip store a servo pulse?",
    hypothesis: "The conversation can work while the pulse settings are still wrong for a servo.",
    test: "I set the frame to about 50 Hz and wrote a width on all 16 channels, then read those registers back.",
    result: "The registers matched. The chip was holding the instructions. That still does not mean a pin was moving.",
    why: "Servo position is the width of a short pulse inside a 20 ms frame. Storing the width is the software half of that.",
  },
  {
    id: "bench",
    title: "Is the pulse actually on the wire?",
    hypothesis: "The connector, the supply at the servo, the channel I probed, or a damaged output could still hide a good register.",
    test: "A meter checked the connector supply and the wiring. A scope looked for a pulse. I tried more than one output so a single mislabeled channel was not the whole story. I also checked whether a short had killed the path.",
    result: "The digital path was still answering, so the architecture had not been destroyed. The servo still did not move. I am not reading a pulse width off the scope photo.",
    why: "This is the handoff from 'the chip remembers it' to 'the wire is doing it.' Those are different facts.",
  },
  {
    id: "cause",
    title: "The outputs were never unlocked",
    hypothesis: "Something downstream of a correct register was still blocking the pin.",
    test: "I traced output enable on the schematic to Teensy GPIO 6 and checked whether firmware had driven it.",
    result: "It had not. The pulse generator inside the chip was programmed. The output stage in front of the pins was held off.",
    why: "A register write and a pin are not the same circuit. OE sits between them.",
  },
  {
    id: "fix",
    title: "Drive the enable, then watch the horn",
    hypothesis: "If OE is the only gate left, driving it the way the pin expects will let the stored pulses out.",
    test: "I set GPIO 6 as an output and drove it low, because this enable is active low.",
    result: "The servo moved. One channel, on the bench. Not a life test.",
    why: "The change is two lines because the bug was a gate, not a bad pulse calculation. The earlier checks are what made those two lines the right edit.",
  },
];

const DONE = [
  "Multiplexed I2C: the switch at 0x70, and the pulse chip at 0x40 on channel 7.",
  "A write of 0x55 and a write of 0xAA, each read back through that same path.",
  "About 50 Hz on the pulse chip, with widths stored and read back on all 16 channels.",
  "Output enable traced to GPIO 6, then driven low.",
  "One servo moved after that enable.",
];

const OPEN = [
  "Running a servo long enough to call it an endurance test.",
  "Current draw, and whether the supply holds under that load.",
  "Temperature of the boards and the servo.",
  "A measured reverse-current or transient test.",
  "The rest of the actuators and sensors on these connectors.",
];

function ChainButton({
  title,
  pressed,
  onSelect,
}: {
  title: string;
  pressed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={[
        "min-w-0 flex-1 rounded-xl border px-3 py-3 text-left transition-colors",
        pressed
          ? "border-orange-300 bg-orange-50"
          : "border-amber-200/80 bg-[#faf8f5] hover:border-orange-200",
      ].join(" ")}
    >
      <span className="text-sm font-semibold text-zinc-950">{title}</span>
    </button>
  );
}

function ChainRow({
  steps,
  active,
  onSelect,
}: {
  steps: Array<{ id: ChainId; title: string }>;
  active: ChainId;
  onSelect: (id: ChainId) => void;
}) {
  return (
    <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
      {steps.map((step, index) => (
        <li key={step.id} className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-stretch">
          <ChainButton
            title={step.title}
            pressed={active === step.id}
            onSelect={() => onSelect(step.id)}
          />
          {index < steps.length - 1 ? (
            <span aria-hidden className="self-center px-0.5 font-medium text-amber-800">
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function Detail({ plain, tech }: { plain: string; tech: string }) {
  return (
    <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">In plain terms</p>
      <p className="mt-2 text-base leading-relaxed text-zinc-800">{plain}</p>
      <details className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
          Addresses, pins, and timing
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">{tech}</p>
      </details>
    </div>
  );
}

function ServoWaveform() {
  const pulses = [
    { label: "1 ms", ms: 1 },
    { label: "1.5 ms", ms: 1.5 },
    { label: "2 ms", ms: 2 },
  ];
  return (
    <figure className="mt-4 rounded-[1.25rem] border border-zinc-200 bg-white p-4">
      <figcaption className="text-sm font-semibold text-zinc-950">
        Three position requests inside one 20 ms frame
      </figcaption>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600">
        About 50 of these frames fit in a second. A wider pulse asks for a different position. The drawing shows the first 3 ms, stretched so the widths are easy to compare. The other 17 ms of each frame stays low. These are the widths I configured, not a trace I read off the scope.
      </p>
      <div className="mt-4 space-y-3">
        {pulses.map((pulse) => {
          const high = (pulse.ms / 3) * 200;
          return (
            <div key={pulse.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
              <span className="font-mono text-xs text-zinc-700">{pulse.label}</span>
              <svg viewBox="0 0 200 28" className="h-7 w-full" role="img" aria-label={`${pulse.label} high, then low, inside a 20 millisecond frame`}>
                <line x1="0" y1="20" x2="200" y2="20" stroke="#d6d3d1" strokeWidth="1" />
                <polyline
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="2"
                  points={`0,20 0,6 ${high},6 ${high},20 200,20`}
                />
              </svg>
            </div>
          );
        })}
      </div>
      <details className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
          How a 12-bit count becomes those widths
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          The PCA9685 splits one frame into 4096 counts. Across 20 ms, one count is about 4.9 µs. A 1 ms pulse is about 205 counts, 1.5 ms is about 307, and 2 ms is about 410. That is the register value the width maps to. It is not a measurement of the pin.
        </p>
      </details>
    </figure>
  );
}

function DiagnosticLog() {
  const lines = [
    "TCA: PASS",
    "Channel 7 selection: PASS",
    "PCA9685: PASS",
    "",
    "Written: 0x55 | Read: 0x55 | PASS",
    "Written: 0xAA | Read: 0xAA | PASS",
  ];
  return (
    <figure className="mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-[#1c1917]">
      <figcaption className="border-b border-white/10 px-4 py-2 text-xs font-medium text-stone-400">
        Register check, through the multiplexer
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 text-amber-50">
        {lines.join("\n")}
      </pre>
    </figure>
  );
}

function GateDiagram({
  title,
  steps,
  tone,
}: {
  title: string;
  steps: string[];
  tone: "before" | "after";
}) {
  const on = tone === "after";
  return (
    <figure className={`rounded-[1.25rem] border p-4 ${on ? "border-amber-300 bg-amber-50/70" : "border-zinc-200 bg-zinc-50"}`}>
      <figcaption className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{title}</figcaption>
      <ol className="mt-3 space-y-2">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-800">
            <span aria-hidden className="mt-0.5 font-medium text-amber-800">
              {index < steps.length - 1 ? "→" : on ? "→" : "×"}
            </span>
            <span className={index === steps.length - 1 ? "font-semibold" : ""}>{step}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">{children}</p>
    </div>
  );
}

export default function ServoBringUpStory() {
  const [active, setActive] = useState<ChainId>("teensy");
  const selected = [...CHAIN, ...ENABLE].find((step) => step.id === active) ?? CHAIN[0];

  return (
    <div className="space-y-12 md:space-y-14">
      <section id="system-overview" className="scroll-mt-36">
        <SectionLabel>Bring-up</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          A command, a pulse, and a horn that did not move
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            {
              k: "The robot",
              v: "SR-01 climbs a rope and cuts a branch so the arborist can stay on the ground. The boards have to feed the actuators, read the sensors, and carry commands between those parts.",
            },
            {
              k: "The problem",
              v: "On the logic board, the servo chip accepted commands and the servo did not move. A valid message was not a motion.",
            },
            {
              k: "The fix",
              v: "Output enable, on Teensy pin 6, had never been turned on. Driving that pin low let the stored pulses out. The servo moved.",
            },
          ].map((card) => (
            <article key={card.k} className="rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">{card.k}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-800">{card.v}</p>
            </article>
          ))}
        </div>
        <nav aria-label="Bring-up sections" className="mt-4 flex flex-wrap gap-2">
          {[
            ["#board-architecture", "The two boards"],
            ["#actuation-challenge", "The fault"],
            ["#signal-chain", "The chain"],
            ["#debug-path", "The debug"],
            ["#logic-board", "The logic sheets"],
            ["#bringup-results", "What held"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-900"
            >
              {label}
            </a>
          ))}
        </nav>
      </section>

      <section id="actuation-challenge" className="scroll-mt-36">
        <SectionLabel>The engineering challenge</SectionLabel>
        <h2 className="text-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950">
          When a good command still doesn&apos;t move the servo
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          During logic-board bring-up, the microcontroller was talking to the servo controller. The connected servo did not move. Software that the chip accepted was not, by itself, a hardware response.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          Any of these looks the same from the bench. The work was to find which one it was, instead of editing code at random or replacing parts.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {FAILURES.map((item) => (
            <li key={item} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="signal-chain" className="scroll-mt-36">
        <SectionLabel>How a position request gets out</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          The chain, and the switch that is not on it
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          Select a block. The short version is open. Addresses and timing stay folded until you want them.
        </p>
        <div className="mt-6 rounded-[1.75rem] border border-zinc-200 bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:p-6">
          <p className="text-sm font-semibold text-zinc-950">Command path</p>
          <div className="mt-3">
            <ChainRow steps={CHAIN} active={active} onSelect={setActive} />
          </div>
          <p className="mt-6 text-sm font-semibold text-zinc-950">Output enable, on its own pin</p>
          <div className="mt-3">
            <ChainRow steps={ENABLE} active={active} onSelect={setActive} />
          </div>
          <div className="mt-5">
            <Detail plain={selected.plain} tech={selected.tech} />
          </div>
        </div>
      </section>

      <section id="debug-path" className="scroll-mt-36">
        <SectionLabel>How I narrowed it</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Seven checks, in order
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          Each step retires one way the servo can sit still. I did not skip to the pin that was wrong.
        </p>
        <ol className="relative mt-8 space-y-8">
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-orange-300 via-zinc-200 to-transparent" />
          {STAGES.map((stage, index) => (
            <li key={stage.id} className="relative pl-12">
              <span className="absolute left-4 top-0 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-orange-300 bg-orange-100 text-xs font-semibold text-orange-950">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{stage.title}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Field label="Hypothesis">{stage.hypothesis}</Field>
                <Field label="Test">{stage.test}</Field>
                <Field label="Result">{stage.result}</Field>
                <Field label="Why that step mattered">{stage.why}</Field>
              </div>
              {stage.id === "both-ways" ? <DiagnosticLog /> : null}
              {stage.id === "pulse" ? <ServoWaveform /> : null}
              {stage.id === "bench" ? (
                <div className="mt-4 max-w-xl">
                  <CaseStudyMediaFrame
                    media={{
                      kind: "image",
                      src: "/projects/logic-pcb/scope-pwm.jpg",
                      alt: "Oscilloscope, the logic board, and a small servo on the bench during the pulse check",
                      label: "On the scope",
                      fit: "contain",
                      caption:
                        "Scope, logic board, and a servo while I looked for a pulse. This photo is the setup. It is not a measured width.",
                    }}
                    className="aspect-video w-full"
                  />
                </div>
              ) : null}
              {stage.id === "cause" ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <GateDiagram
                    title="Before"
                    tone="before"
                    steps={[
                      "Valid I2C command",
                      "Pulse width stored",
                      "Outputs still disabled",
                      "No servo motion",
                    ]}
                  />
                  <GateDiagram
                    title="After"
                    tone="after"
                    steps={[
                      "Valid I2C command",
                      "Pulse width stored",
                      "Outputs enabled",
                      "The servo moved",
                    ]}
                  />
                </div>
              ) : null}
              {stage.id === "fix" ? (
                <figure className="mt-4 max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-[#1c1917]">
                  <figcaption className="border-b border-white/10 px-4 py-2 text-xs font-medium text-stone-400">
                    The enable, and nothing else
                  </figcaption>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-sm leading-6 text-amber-50">
                    {`pinMode(6, OUTPUT);\ndigitalWrite(6, LOW);`}
                  </pre>
                  <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-stone-300">
                    The first line makes pin 6 drive the wire. The second turns the outputs on, because OE is active low. Until then, a correct pulse width had a closed gate in front of it.
                  </p>
                </figure>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section id="bringup-results" className="scroll-mt-36">
        <SectionLabel>What held, and what has not been run</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          One moving servo is not a finished robot
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-amber-200 bg-amber-50/50 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-950">Done on the bench</h3>
            <ul className="mt-4 space-y-3">
              {DONE.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-zinc-800">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-900">Not done</h3>
            <ul className="mt-4 space-y-3">
              {OPEN.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-zinc-700">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
