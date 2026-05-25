"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const STAGES = [
  {
    id: "source",
    label: "C Source",
    snippet: "return ~(-2);",
    tone: "text-emerald-400/90",
  },
  {
    id: "lexer",
    label: "Lexer",
    snippet: "RETURN ~ ( - INT )",
    tone: "text-amber-200/80",
  },
  {
    id: "ast",
    label: "AST",
    snippet: "Return(Complement(Negate(2)))",
    tone: "text-violet-300/90",
  },
  {
    id: "sem",
    label: "Semantic",
    snippet: "✓ types · scopes",
    tone: "text-sky-300/80",
  },
  {
    id: "loop",
    label: "Loop Labels",
    snippet: "L0: · L1:",
    tone: "text-rose-300/80",
  },
  {
    id: "tacky",
    label: "TACKY IR",
    snippet: "tmp.1 = ~tmp.0",
    tone: "text-amber-300/90",
  },
  {
    id: "asm",
    label: "x86-64",
    snippet: "notl -4(%rbp)",
    tone: "text-emerald-300/80",
  },
  {
    id: "regs",
    label: "Registers",
    snippet: "%eax ← 1",
    tone: "text-amber-400",
  },
] as const;

const REGISTERS = [
  { name: "%rax", value: "0x01" },
  { name: "%rbp", value: "-0x8" },
  { name: "%r10d", value: "scratch" },
  { name: "tmp.0", value: "-0x4" },
];

const PARTICLE_COUNT = 5;

export default function CompilerPipelineVisual({
  className = "",
}: {
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 22 });
  const parallaxBgX = useTransform(springX, (v) => v);
  const parallaxBgY = useTransform(springY, (v) => v);
  const parallaxFgX = useTransform(springX, (v) => v * 1.4);
  const parallaxFgY = useTransform(springY, (v) => v * 1.4);
  const glowX = useMotionTemplate`${useTransform(springX, (v) => 50 + v * 2)}%`;
  const glowY = useMotionTemplate`${useTransform(springY, (v) => 30 + v * 2)}%`;

  useEffect(() => {
    const tick = setInterval(
      () => setActive((i) => (i + 1) % STAGES.length),
      2400
    );
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  function onMove(e: React.MouseEvent) {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    pointerX.set(Math.max(-1, Math.min(1, nx)) * 6);
    pointerY.set(Math.max(-1, Math.min(1, ny)) * 4);
  }

  function onLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const stage = STAGES[active];
  const progress = (active + 0.5) / STAGES.length;

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full overflow-hidden bg-[#070707] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden
    >
      {/* Ambient grid */}
      <motion.div
        style={{ x: parallaxBgX, y: parallaxBgY }}
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute h-48 w-48 rounded-full blur-3xl"
        style={{
          left: glowX,
          top: glowY,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex h-full flex-col px-3 pb-2.5 pt-3 sm:px-4">
        {/* Header + source terminal */}
        <motion.div style={{ x: parallaxFgX, y: parallaxFgY }} className="shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-amber-500/90">
              mycc pipeline
            </p>
            <span className="rounded border border-amber-500/20 bg-amber-500/5 px-1.5 py-0.5 font-mono text-[8px] text-amber-400/80">
              x86_64 · OCaml
            </span>
          </div>

          <div className="mt-2 rounded-lg border border-white/[0.06] bg-black/50 px-2.5 py-1.5 shadow-inner">
            <p className="font-mono text-[8px] text-stone-600">unary.c</p>
            <p className="mt-0.5 font-mono text-[10px] leading-snug text-stone-300">
              <span className="text-violet-400/90">int</span>{" "}
              <span className="text-amber-200/90">main</span>
              <span className="text-stone-500">(void) {"{"}</span>
            </p>
            <p className="font-mono text-[10px] leading-snug text-emerald-400/90">
              {"  "}return ~(-2);
              <span
                className={`ml-0.5 inline-block w-[6px] bg-amber-400 transition-opacity ${
                  cursorOn ? "opacity-100" : "opacity-0"
                }`}
              >
                ▏
              </span>
            </p>
          </div>
        </motion.div>

        {/* Pipeline track */}
        <div className="relative mt-2 min-h-0 flex-1">
          <svg
            className="pointer-events-none absolute inset-x-0 top-[18px] h-8 w-full"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(245,158,11,0.15)" />
                <stop offset="50%" stopColor="rgba(245,158,11,0.55)" />
                <stop offset="100%" stopColor="rgba(245,158,11,0.2)" />
              </linearGradient>
            </defs>
            <line
              x1="4"
              y1="4"
              x2="96"
              y2="4"
              stroke="url(#pipeGrad)"
              strokeWidth="0.4"
              strokeLinecap="round"
            />
            <motion.line
              x1="4"
              y1="4"
              x2="96"
              y2="4"
              stroke="rgba(251,191,36,0.7)"
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeDasharray="3 5"
              animate={{ strokeDashoffset: [0, -16] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          {/* Flowing particles */}
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute top-[15px] z-10 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
              initial={{ left: "4%", opacity: 0 }}
              animate={{
                left: ["4%", "96%"],
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1, 1, 0.6],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                delay: i * 0.65,
                ease: "linear",
              }}
            />
          ))}

          <motion.div
            className="pointer-events-none absolute top-[12px] z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-amber-300/50 bg-amber-400/90 shadow-[0_0_14px_rgba(251,191,36,1)]"
            animate={{ left: `${4 + progress * 92}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />

          {/* Stage nodes */}
          <div className="grid h-full grid-cols-4 gap-x-1 gap-y-1.5 pt-7 sm:grid-cols-8 sm:gap-x-0.5">
            {STAGES.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <motion.div
                  key={s.id}
                  layout
                  className={[
                    "relative flex flex-col rounded-md border px-1 py-1 transition-colors",
                    isActive
                      ? "border-amber-400/45 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                      : isPast
                        ? "border-amber-500/15 bg-white/[0.02]"
                        : "border-white/[0.06] bg-black/30",
                  ].join(" ")}
                  animate={{
                    scale: isActive ? 1.03 : 1,
                    opacity: isPast || isActive ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="truncate font-mono text-[7px] font-semibold uppercase tracking-wider text-amber-500/80 sm:text-[8px]">
                    {s.label}
                  </p>
                  <p
                    className={`mt-0.5 line-clamp-2 font-mono text-[6.5px] leading-tight sm:text-[7px] ${s.tone}`}
                  >
                    {s.snippet}
                  </p>
                  {isActive && (
                    <motion.span
                      layoutId="stage-glow"
                      className="pointer-events-none absolute -inset-px rounded-md ring-1 ring-amber-400/30"
                      transition={{ type: "spring", stiffness: 200, damping: 26 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active stage detail + registers */}
        <motion.div
          style={{ x: parallaxFgX, y: parallaxFgY }}
          className="mt-1.5 shrink-0 space-y-1.5"
        >
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.06] to-transparent px-2 py-1.5"
          >
            <p className="font-mono text-[8px] uppercase tracking-widest text-amber-500/70">
              {stage.label}
            </p>
            <p className={`mt-0.5 truncate font-mono text-[9px] sm:text-[10px] ${stage.tone}`}>
              {stage.id === "tacky"
                ? "tmp.0 = -2 · tmp.1 = ~tmp.0 · return tmp.1"
                : stage.id === "asm"
                  ? "movl $2,-4(%rbp) · notl -4(%rbp) · movl -4(%rbp,%eax"
                  : stage.snippet}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-1">
            {REGISTERS.map((reg, i) => (
              <motion.div
                key={reg.name}
                className="rounded border border-white/[0.06] bg-black/40 px-1.5 py-0.5"
                animate={{
                  borderColor:
                    active >= 6 && i === 0
                      ? "rgba(251,191,36,0.45)"
                      : "rgba(255,255,255,0.06)",
                }}
              >
                <span className="font-mono text-[7px] text-stone-500">{reg.name}</span>
                <span className="ml-1 font-mono text-[7px] text-amber-300/90">
                  {reg.value}
                </span>
              </motion.div>
            ))}
            <span className="ml-auto self-center font-mono text-[7px] text-stone-600">
              ./mycc → exit 1
            </span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/40" />
    </div>
  );
}
