"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TERMINAL_LINES = [
  "$ ./mycc test.c && ./a.out",
  "→ compiling: lexer ✓ parser ✓ tacky ✓ codegen ✓",
  "exit code: 0",
  "$ ollama run minitorch --train",
  "loss: 0.42 → 0.08 (epoch 12)",
];

const MODULES = [
  {
    id: "scope",
    label: "Oscilloscope",
    icon: "scope",
    hint: "Signal trace · ECE",
  },
  {
    id: "arm",
    label: "Robotic Arm",
    icon: "arm",
    hint: "BloomBot · Servos",
  },
  {
    id: "pcb",
    label: "PCB",
    icon: "pcb",
    hint: "Hardware · CAD",
  },
  {
    id: "terminal",
    label: "Compiler",
    icon: "terminal",
    hint: "Systems · OCaml",
  },
  {
    id: "eeg",
    label: "EEG",
    icon: "eeg",
    hint: "BCI · Medtech",
  },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

function Waveform({ active }: { active: boolean }) {
  const points = Array.from({ length: 48 }, (_, i) => {
    const x = i * 4;
    const y = 24 + Math.sin(i * 0.35) * 10 + Math.sin(i * 0.12) * 6;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 192 48" className="h-12 w-full" aria-hidden>
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <motion.polyline
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
        animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.4 }}
        transition={{ duration: 2, repeat: active ? Infinity : 0 }}
      />
      <line x1="0" y1="24" x2="192" y2="24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}

function RoboticArm({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-full" aria-hidden>
      <rect x="48" y="58" width="24" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
      <motion.line
        x1="60" y1="58" x2="60" y2="38"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        animate={active ? { rotate: [-8, 8, -8] } : {}}
        style={{ transformOrigin: "60px 58px" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line
        x1="60" y1="38" x2="78" y2="22"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={active ? { rotate: [12, -5, 12] } : {}}
        style={{ transformOrigin: "60px 38px" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <circle cx="78" cy="22" r="4" fill="#f59e0b" opacity={active ? 1 : 0.5} />
    </svg>
  );
}

function PCB({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 100 80" className="h-20 w-full" aria-hidden>
      <rect
        x="10" y="10" width="80" height="60" rx="4"
        fill="none"
        stroke="rgba(245,158,11,0.4)"
        strokeWidth="1.5"
      />
      {[
        [25, 25], [50, 25], [75, 25],
        [25, 50], [50, 50], [75, 50],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="#f59e0b"
          animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <motion.path
        d="M25 25 L50 25 L50 50 L75 50"
        fill="none"
        stroke="rgba(245,158,11,0.5)"
        strokeWidth="1"
        strokeDasharray="4 3"
        animate={active ? { strokeDashoffset: [0, -14] } : {}}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

function TerminalPanel({ active }: { active: boolean }) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setLineIdx((i) => (i + 1) % TERMINAL_LINES.length);
    }, 2800);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="font-mono text-[10px] leading-relaxed text-emerald-400/90 md:text-xs">
      <div className="mb-2 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {TERMINAL_LINES[lineIdx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function EEG({ active }: { active: boolean }) {
  const d = Array.from({ length: 40 }, (_, i) => {
    const x = i * 3;
    const y =
      30 +
      Math.sin(i * 0.5) * 8 +
      Math.sin(i * 1.2) * 4 +
      (i % 7 === 0 ? -6 : 0);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 120 60" className="h-14 w-full" aria-hidden>
      <motion.path
        d={d}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={active ? { pathLength: [0.3, 1, 0.3] } : { pathLength: 0.5 }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  );
}

function ModuleVisual({ id, active }: { id: ModuleId; active: boolean }) {
  switch (id) {
    case "scope":
      return <Waveform active={active} />;
    case "arm":
      return <RoboticArm active={active} />;
    case "pcb":
      return <PCB active={active} />;
    case "terminal":
      return <TerminalPanel active={active} />;
    case "eeg":
      return <EEG active={active} />;
  }
}

export default function RitviksLab() {
  const [active, setActive] = useState<ModuleId>("scope");
  const [hovered, setHovered] = useState<ModuleId | null>(null);
  const display = hovered ?? active;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)]"
      aria-label="Ritvik's Lab, interactive engineering workbench"
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

      <div className="relative p-5 md:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
              Ritvik&apos;s Lab
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              systems · embedded · medtech · ML
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] text-zinc-500">ONLINE</span>
          </div>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
          {MODULES.map((mod) => {
            const isActive = display === mod.id;
            return (
              <motion.button
                key={mod.id}
                type="button"
                onClick={() => setActive(mod.id)}
                onMouseEnter={() => setHovered(mod.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(mod.id)}
                onBlur={() => setHovered(null)}
                className={[
                  "relative flex flex-col items-center rounded-xl border p-3 text-left transition-colors duration-200 md:p-4",
                  isActive
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
                ].join(" ")}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mb-2 h-14 w-full md:h-16">
                  <ModuleVisual id={mod.id} active={isActive} />
                </div>
                <span
                  className={[
                    "text-[10px] font-medium uppercase tracking-wider md:text-xs",
                    isActive ? "text-amber-300" : "text-zinc-400",
                  ].join(" ")}
                >
                  {mod.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <motion.div
          key={display}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
        >
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-amber-400">
              {MODULES.find((m) => m.id === display)?.label}
            </span>
            <span className="text-zinc-600">, </span>
            {MODULES.find((m) => m.id === display)?.hint}
          </p>
        </motion.div>

        {/* Schematic footer */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          <span>ECE @ Penn</span>
          <span>·</span>
          <span>Builder / Founder</span>
          <span>·</span>
          <span>Medtech → Robotics</span>
        </div>
      </div>
    </div>
  );
}
