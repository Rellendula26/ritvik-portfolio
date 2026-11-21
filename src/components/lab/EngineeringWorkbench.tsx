"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * The homepage bench is a drawing of work that already has a page.
 * Scope shapes are instrument drawings. The 12 V and 6 V marks are the
 * meter checks on the V2 power board. Current is not shown, because it
 * has not been logged.
 */

const PIECES = [
  {
    id: "scope",
    title: "Oscilloscope",
    body: "At Quantum Opus I set the attenuation and captured the detector pulse on a scope. The shapes here are ones you can switch.",
    href: "/experiences/quantum-opus",
    box: { left: "4%", top: "8%", width: "27%", height: "38%" },
    tip: "group/scope absolute rounded-xl bg-amber-400/0 transition-colors hover:bg-amber-400/10",
    tipPanel:
      "wb-tip pointer-events-none absolute left-1/2 top-0 z-20 hidden w-56 -translate-x-1/2 -translate-y-[108%] rounded-2xl border border-stone-200 bg-white/95 px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover/scope:opacity-100 md:block",
  },
  {
    id: "power",
    title: "Power board",
    body: "V2 power board for SR-01. I metered 12 V and 6 V. Branch current is not logged.",
    href: "/projects/logic-pcb",
    box: { left: "4%", top: "52%", width: "30%", height: "34%" },
    tip: "group/power absolute rounded-xl bg-amber-400/0 transition-colors hover:bg-amber-400/10",
    tipPanel:
      "wb-tip pointer-events-none absolute left-1/2 top-0 z-20 hidden w-56 -translate-x-1/2 -translate-y-[108%] rounded-2xl border border-stone-200 bg-white/95 px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover/power:opacity-100 md:block",
  },
  {
    id: "logic",
    title: "Logic board",
    body: "V2 logic board. Teensy 4.1, through a mux, to a PCA9685 at 50 Hz. The servo moved once GPIO 6 enabled the outputs.",
    href: "/projects/logic-pcb",
    box: { left: "36%", top: "40%", width: "34%", height: "42%" },
    tip: "group/logic absolute rounded-xl bg-amber-400/0 transition-colors hover:bg-amber-400/10",
    tipPanel:
      "wb-tip pointer-events-none absolute left-1/2 bottom-0 z-20 hidden w-56 -translate-x-1/2 translate-y-[108%] rounded-2xl border border-stone-200 bg-white/95 px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover/logic:opacity-100 md:block",
  },
  {
    id: "arm",
    title: "Leader arm",
    body: "I wrote the bridge from the leader arm to six servos on a second Pi. This drawing stays inside a short reach. The real motion still jitters.",
    href: "/projects/leader-follower-robotic-arm",
    box: { left: "72%", top: "14%", width: "24%", height: "48%" },
    tip: "group/arm absolute rounded-xl bg-amber-400/0 transition-colors hover:bg-amber-400/10",
    tipPanel:
      "wb-tip pointer-events-none absolute right-0 top-0 z-20 hidden w-56 translate-y-[8%] rounded-2xl border border-stone-200 bg-white/95 px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover/arm:opacity-100 md:block",
  },
  {
    id: "emg",
    title: "EMG sensor",
    body: "Penn ADAPT. I design the EMG boards and the mounts. One sensor board is built.",
    href: "/projects/bionic-arm",
    box: { left: "70%", top: "58%", width: "16%", height: "26%" },
    tip: "group/emg absolute rounded-xl bg-amber-400/0 transition-colors hover:bg-amber-400/10",
    tipPanel:
      "wb-tip pointer-events-none absolute right-0 bottom-0 z-20 hidden w-56 translate-y-[108%] rounded-2xl border border-stone-200 bg-white/95 px-3 py-2 text-left opacity-0 shadow-md transition-opacity group-hover/emg:opacity-100 md:block",
  },
] as const;

const SCOPE_MODES = [
  {
    id: "pwm",
    label: "PWM",
    freq: "50 Hz",
    volts: "2 V/div",
    time: "5 ms/div",
    note: "50 Hz is the servo rate I set on the PCA9685. The wide pulse is the 1.5 ms center from that configuration.",
    d: "M8 46 H22 V16 H40 V46 H78 V16 H96 V46 H116",
  },
  {
    id: "sine",
    label: "Sine",
    freq: "1 kHz",
    volts: "1 V/div",
    time: "200 µs/div",
    note: "A reference sine, so the screen has a familiar shape.",
    d: "M8 32 C16 12 24 12 32 32 S48 52 56 32 S72 12 80 32 S96 52 104 32 S116 18 120 28",
  },
  {
    id: "square",
    label: "Square",
    freq: "10 kHz",
    volts: "1 V/div",
    time: "50 µs/div",
    note: "A square wave drawn on the bezel.",
    d: "M8 46 H24 V16 H48 V46 H72 V16 H96 V46 H120",
  },
  {
    id: "i2c",
    label: "I2C",
    freq: "100 kHz",
    volts: "1 V/div",
    time: "20 µs/div",
    note: "An I2C-shaped drawing. On the logic board, the bring-up that passed was a register readback.",
    d: "M8 18 H120 M8 44 H18 V28 H28 V44 H40 V28 H52 V44 H70 V28 H78 V44 H96 V28 H108 V44 H120",
  },
] as const;

type ScopeMode = (typeof SCOPE_MODES)[number];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Two-link arm. +x is right, +y is down, which matches an SVG rotate. */
function solveArm(x: number, y: number) {
  const l1 = 92;
  const l2 = 74;
  const reach = Math.hypot(x, y) || 1;
  const dist = clamp(reach, 36, l1 + l2 - 2);
  const scale = dist / reach;
  const tx = x * scale;
  const ty = y * scale;
  const elbowInterior = Math.acos(
    clamp((l1 * l1 + l2 * l2 - dist * dist) / (2 * l1 * l2), -1, 1)
  );
  const shoulderOffset = Math.acos(
    clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1)
  );
  const shoulder = (Math.atan2(ty, tx) + shoulderOffset) * (180 / Math.PI);
  const elbow = -((Math.PI - elbowInterior) * (180 / Math.PI));
  return {
    shoulder: clamp(shoulder, 145, 205),
    elbow: clamp(elbow, -120, -36),
  };
}

export default function EngineeringWorkbench() {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shoulderRef = useRef<SVGGElement>(null);
  const elbowRef = useRef<SVGGElement>(null);
  const live = useRef(false);
  const [mode, setMode] = useState<ScopeMode>(SCOPE_MODES[0]);

  useEffect(() => {
    const shoulder = shoulderRef.current;
    const elbow = elbowRef.current;
    if (!shoulder || !elbow) return;
    elbow.setAttribute("transform", "translate(92 0) rotate(-62)");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const first = document.documentElement.dataset.boot === "start";

    const rest = () => {
      shoulder.setAttribute("transform", "rotate(164)");
      elbow.setAttribute("transform", "translate(92 0) rotate(-62)");
    };

    if (reduce || !first) {
      rest();
      live.current = fine && !reduce;
      return;
    }

    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (document.documentElement.dataset.boot !== "start") {
        rest();
        live.current = fine;
        return;
      }
      const boot = Math.min(1, (now - started) / 1800);
      const t = clamp((boot - 0.28) / 0.44, 0, 1);
      const eased = 1 - (1 - t) ** 3;
      shoulder.setAttribute("transform", `rotate(${198 + (164 - 198) * eased})`);
      if (boot < 1) raf = requestAnimationFrame(tick);
      else live.current = fine;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function pointInArm(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = ((clientX - rect.left) / rect.width) * 720 - 612;
    const y = ((clientY - rect.top) / rect.height) * 460 - 236;
    return { x, y };
  }

  function onMove(event: React.MouseEvent) {
    const card = cardRef.current;
    if (!card || !live.current) return;
    const rect = card.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    card.style.setProperty("--rx", `${clamp(-ny, -1, 1) * 3.5}deg`);
    card.style.setProperty("--ry", `${clamp(nx, -1, 1) * 4.5}deg`);

    const local = pointInArm(event.clientX, event.clientY);
    const shoulder = shoulderRef.current;
    const elbow = elbowRef.current;
    if (!local || !shoulder || !elbow) return;
    if (local.x > -16) return;
    const pose = solveArm(local.x, local.y);
    shoulder.setAttribute("transform", `rotate(${pose.shoulder})`);
    elbow.setAttribute("transform", `translate(92 0) rotate(${pose.elbow})`);
  }

  function onLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.dataset.hot = "";
    if (!live.current) return;
    shoulderRef.current?.setAttribute("transform", "rotate(164)");
    elbowRef.current?.setAttribute("transform", "translate(92 0) rotate(-62)");
  }

  function mark(id: string) {
    if (cardRef.current) cardRef.current.dataset.hot = id;
  }

  return (
    <div>
      <div
        ref={cardRef}
        className="wb-card wb-stage relative"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
      <svg
        ref={svgRef}
        viewBox="0 0 720 460"
        className="w-full"
        role="img"
        aria-label="Workbench drawing: scope, power board, logic board, leader arm, and an EMG sensor."
      >
        <defs>
          <linearGradient id="wb-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3dfc4" />
            <stop offset="55%" stopColor="#e4c39a" />
            <stop offset="100%" stopColor="#c9956a" />
          </linearGradient>
          <linearGradient id="wb-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a36b" />
            <stop offset="100%" stopColor="#8f6844" />
          </linearGradient>
          <linearGradient id="wb-mask" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1f7a45" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <radialGradient id="wb-lamp-grad" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#fde68a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <pattern id="wb-grid" width="16" height="12" patternUnits="userSpaceOnUse">
            <path d="M16 0 H0 V12" fill="none" stroke="#44403c" strokeWidth="0.6" />
          </pattern>
        </defs>

        <ellipse cx="360" cy="412" rx="250" ry="16" fill="#d6d3d1" opacity="0.45" />
        <ellipse className="wb-lamp" cx="360" cy="36" rx="260" ry="90" fill="url(#wb-lamp-grad)" />

        <g className="wb-equipment">
          <rect x="78" y="300" width="16" height="78" rx="2" fill="#8f6844" />
          <rect x="626" y="300" width="16" height="78" rx="2" fill="#8f6844" />
          <path d="M36 292 H684 L664 332 H56 Z" fill="url(#wb-front)" />
          <path d="M48 214 H672 L684 292 H36 Z" fill="url(#wb-wood)" />
          <path d="M70 226 H650" stroke="#fff7ed" strokeWidth="3" opacity="0.35" />

          {/* Scope */}
          <g className="wb-scope">
            <rect x="58" y="78" width="168" height="132" rx="8" fill="#3f3f46" />
            <rect x="70" y="90" width="144" height="86" rx="3" fill="#1c1917" />
            <rect x="76" y="96" width="132" height="74" fill="url(#wb-grid)" opacity="0.55" />
            <line className="wb-sweep" y1="98" y2="168" stroke="#fde68a" strokeWidth="1" opacity="0.45">
              <animate attributeName="x1" values="80;200;80" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="x2" values="80;200;80" dur="2.8s" repeatCount="indefinite" />
            </line>
            {SCOPE_MODES.map((item) => (
              <path
                key={item.id}
                d={item.d}
                transform="translate(78 100)"
                fill="none"
                stroke="#f5b942"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                pathLength="120"
                className={item.id === mode.id ? "wb-wave" : "hidden"}
              />
            ))}
            <circle cx="78" cy="196" r="5" fill="#292524" stroke="#a8a29e" />
            <circle cx="98" cy="196" r="5" fill="#292524" stroke="#a8a29e" />
            <circle cx="118" cy="196" r="5" fill="#292524" stroke="#a8a29e" />
          </g>

          {/* Power board */}
          <g className="wb-power">
            <rect x="52" y="248" width="196" height="78" rx="6" fill="#292524" />
            <rect x="64" y="260" width="28" height="16" rx="2" fill="#facc15" />
            <rect x="104" y="258" width="46" height="28" rx="2" fill="#44403c" />
            <rect x="158" y="258" width="46" height="28" rx="2" fill="#57534e" />
            <rect x="214" y="262" width="22" height="14" rx="1" fill="#a8a29e" />
            <path
              id="wb-power-path"
              className="wb-power-trace wb-draw"
              d="M78 268 H104 M150 272 H158 M204 272 H214 M150 300 H214"
              fill="none"
              stroke="#d6a15a"
              strokeWidth="2"
              pathLength="100"
            />
            <text x="108" y="276" fill="#fde68a" fontSize="8" fontFamily="ui-monospace, monospace">
              12 V
            </text>
            <text x="162" y="276" fill="#fde68a" fontSize="8" fontFamily="ui-monospace, monospace">
              6 V
            </text>
          </g>

          {/* Logic board */}
          <g className="wb-logic">
            <rect x="268" y="228" width="236" height="112" rx="6" fill="url(#wb-mask)" />
            <path
              className="wb-logic-trace wb-draw"
              d="M300 268 H360 V292 H430 M360 268 V248 H470 M300 310 H520 M430 292 V320"
              fill="none"
              stroke="#e7b56a"
              strokeWidth="2.2"
              pathLength="100"
            />
            <path
              id="wb-i2c"
              d="M300 268 H360 V292 H430"
              fill="none"
              stroke="none"
            />
            {[
              [310, 250],
              [360, 268],
              [430, 292],
              [470, 248],
              [390, 310],
            ].map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="2.4"
                fill="none"
                stroke="#f3dfc4"
                strokeWidth="1"
              />
            ))}
            <rect x="292" y="246" width="78" height="40" rx="3" fill="#1c1917" />
            <text x="304" y="270" fill="#e7e5e4" fontSize="9" fontFamily="ui-sans-serif, system-ui">
              Teensy
            </text>
            <rect x="392" y="276" width="48" height="28" rx="2" fill="#111827" />
            <text x="400" y="294" fill="#fde68a" fontSize="8" fontFamily="ui-monospace, monospace">
              50 Hz
            </text>
            {[0, 1, 2, 3, 4].map((pin) => (
              <rect
                key={pin}
                x={488}
                y={246 + pin * 16}
                width="12"
                height="8"
                rx="1"
                fill="#e7e5e4"
              />
            ))}
            <circle className="wb-led wb-led-live" cx="286" cy="242" r="3.2" fill="#facc15" />
            <circle className="wb-led" cx="300" cy="242" r="3.2" fill="#4ade80" />
            <circle
              className="wb-dot"
              r="2.6"
              fill="#fff7ed"
            >
              <animateMotion dur="2.6s" repeatCount="indefinite" rotate="0">
                <mpath href="#wb-i2c" />
              </animateMotion>
            </circle>
          </g>

          {/* Cable from the power board into the logic board */}
          <path
            d="M248 286 C270 286 258 300 268 300"
            fill="none"
            stroke="#78716c"
            strokeWidth="3"
          />
          <circle className="wb-dot" r="2.4" fill="#fbbf24">
            <animateMotion
              dur="3.4s"
              repeatCount="indefinite"
              path="M78 268 H150 H214"
            />
          </circle>

          {/* EMG sensor */}
          <g className="wb-emg">
            <rect className="wb-emg-fill" x="536" y="286" width="72" height="42" rx="5" fill="#44403c" />
            <circle cx="554" cy="307" r="7" fill="#e7e5e4" stroke="#a8a29e" />
            <circle cx="590" cy="307" r="7" fill="#e7e5e4" stroke="#a8a29e" />
            <path
              className="wb-emg wb-draw"
              d="M554 307 H590"
              stroke="#d6a15a"
              strokeWidth="1.5"
              pathLength="100"
            />
          </g>

          {/* Leader arm. Joints are at the local origin. */}
          <g transform="translate(612 236)">
            <ellipse cx="8" cy="28" rx="28" ry="10" fill="#44403c" />
            <g ref={shoulderRef} transform="rotate(164)">
              <rect className="wb-arm-fill" x="0" y="-8" width="92" height="16" rx="7" fill="#57534e" />
              <circle cx="0" cy="0" r="8" fill="#292524" />
              <g ref={elbowRef} transform="translate(92 0) rotate(-62)">
                <rect className="wb-arm-fill" x="0" y="-7" width="74" height="14" rx="6" fill="#78716c" />
                <circle cx="0" cy="0" r="7" fill="#292524" />
                <path
                  className="wb-arm"
                  d="M58 -12 H74 V12 H58 Z"
                  fill="#d6d3d1"
                  stroke="#a8a29e"
                  strokeWidth="1.5"
                />
                <path className="wb-arm" d="M66 -12 V12" stroke="#78716c" strokeWidth="1.5" />
              </g>
            </g>
          </g>
        </g>

        <circle className="wb-power-led" cx="86" cy="312" r="9" fill="#fbbf24" fillOpacity="0.28" />
        <circle className="wb-power-led" cx="86" cy="312" r="4" fill="#fde68a" />
      </svg>

      {PIECES.map((piece) => (
        <Link
          key={piece.id}
          href={piece.href}
          tabIndex={-1}
          aria-hidden
          className={piece.tip}
          style={piece.box}
          onMouseEnter={() => mark(piece.id)}
          onMouseLeave={() => mark("")}
        >
          <span className={piece.tipPanel}>
            <span className="block text-xs font-semibold text-stone-950">{piece.title}</span>
            <span className="mt-1 block text-xs leading-relaxed text-stone-600">{piece.body}</span>
          </span>
        </Link>
      ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-stone-200/80 px-1 pt-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">
            Scope
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Scope waveform">
            {SCOPE_MODES.map((item) => {
              const selected = item.id === mode.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMode(item)}
                  className={
                    selected
                      ? "rounded-full bg-stone-950 px-3 py-1 text-xs font-medium text-white"
                      : "rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:border-amber-500"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="font-mono text-[11px] leading-relaxed text-stone-500 sm:text-right">
          {mode.freq}
          <span className="px-1.5 text-stone-300">/</span>
          {mode.volts}
          <span className="px-1.5 text-stone-300">/</span>
          {mode.time}
        </p>
      </div>
      <p className="mt-2 px-1 text-sm leading-relaxed text-stone-600">{mode.note}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {PIECES.map((piece) => (
          <li key={piece.id}>
            <Link
              href={piece.href}
              className="inline-flex rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 hover:border-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              {piece.title}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-3 grid gap-2 md:hidden">
        {PIECES.map((piece) => (
          <li key={`${piece.id}-note`} className="rounded-2xl border border-stone-200/80 bg-white/70 px-3 py-2">
            <p className="text-sm font-medium text-stone-950">{piece.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-stone-600">{piece.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
