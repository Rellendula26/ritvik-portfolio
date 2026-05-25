"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const PIPELINE = [
  { id: "inputs", label: "Tensor Inputs", snippet: "x · w · b" },
  { id: "graph", label: "Comp. Graph", snippet: "tape · nodes" },
  { id: "forward", label: "Forward Pass", snippet: "y = x*w + b" },
  { id: "backprop", label: "Backprop", snippet: "loss.backward()" },
  { id: "grads", label: "Gradients", snippet: "∂L/∂w · ∂L/∂x" },
] as const;

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  grad?: string;
};

const NODES: GraphNode[] = [
  { id: "x", label: "x", x: 14, y: 72, grad: "∂L/∂x" },
  { id: "w", label: "w", x: 32, y: 72, grad: "∂L/∂w" },
  { id: "b", label: "b", x: 50, y: 72, grad: "∂L/∂b" },
  { id: "mul", label: "×", x: 38, y: 48 },
  { id: "add", label: "+", x: 56, y: 48 },
  { id: "y", label: "y", x: 72, y: 48, grad: "∂L/∂y" },
  { id: "loss", label: "loss", x: 88, y: 28, grad: "1.0" },
];

const EDGES: { from: string; to: string; forward?: boolean }[] = [
  { from: "x", to: "mul", forward: true },
  { from: "w", to: "mul", forward: true },
  { from: "mul", to: "add", forward: true },
  { from: "b", to: "add", forward: true },
  { from: "add", to: "y", forward: true },
  { from: "y", to: "loss", forward: true },
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export type MiniTorchVisualMode =
  | "full"
  | "graph"
  | "forward"
  | "backprop"
  | "gradcheck";

const MODE_CONFIG: Record<
  Exclude<MiniTorchVisualMode, "full">,
  { active: number; phase: "forward" | "backward"; title: string }
> = {
  graph: { active: 1, phase: "forward", title: "computation graph" },
  forward: { active: 2, phase: "forward", title: "forward pass" },
  backprop: { active: 3, phase: "backward", title: "reverse-mode backprop" },
  gradcheck: { active: 4, phase: "backward", title: "gradients · gradcheck" },
};

export default function MiniTorchAutodiffVisual({
  className = "",
  mode = "full",
}: {
  className?: string;
  mode?: MiniTorchVisualMode;
}) {
  const locked = mode !== "full";
  const lockedCfg = locked ? MODE_CONFIG[mode] : null;

  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(lockedCfg?.active ?? 0);
  const [phase, setPhase] = useState<"forward" | "backward">(
    lockedCfg?.phase ?? "forward"
  );
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 22 });
  const parallaxFgX = useTransform(springX, (v) => v * 1.3);
  const parallaxFgY = useTransform(springY, (v) => v * 1.3);
  const glowX = useMotionTemplate`${useTransform(springX, (v) => 55 + v * 2)}%`;
  const glowY = useMotionTemplate`${useTransform(springY, (v) => 35 + v * 2)}%`;

  useEffect(() => {
    if (locked && lockedCfg) {
      setActive(lockedCfg.active);
      setPhase(lockedCfg.phase);
      return;
    }
    const tick = setInterval(() => {
      setActive((i) => {
        const next = (i + 1) % PIPELINE.length;
        if (next === 0) setPhase((p) => (p === "forward" ? "backward" : "forward"));
        return next;
      });
    }, 2200);
    return () => clearInterval(tick);
  }, [locked, lockedCfg]);

  function onMove(e: React.MouseEvent) {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pointerX.set(
      Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)) * 6
    );
    pointerY.set(
      Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)) * 4
    );
  }

  function onLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const isBackprop =
    mode === "backprop" ||
    mode === "gradcheck" ||
    phase === "backward" ||
    active >= 3;

  const showGradLabels = mode === "gradcheck" || (mode === "full" && isBackprop);

  const hotNodes = (() => {
    switch (mode) {
      case "graph":
        return ["x", "w", "b", "mul", "add", "y", "loss"];
      case "forward":
        return ["x", "w", "mul", "add", "y", "loss"];
      case "backprop":
        return ["loss", "y", "add", "mul", "w", "x", "b"];
      case "gradcheck":
        return ["loss", "y", "w", "x", "b"];
      default:
        return null;
    }
  })();

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full overflow-hidden bg-[#070707] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        className="pointer-events-none absolute h-40 w-40 rounded-full blur-3xl"
        style={{
          left: glowX,
          top: glowY,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.12) 0%, rgba(245,158,11,0.1) 45%, transparent 70%)",
        }}
      />

      <div className="relative flex h-full flex-col px-3 pb-2 pt-2.5 sm:px-3.5">
        <motion.div style={{ x: parallaxFgX, y: parallaxFgY }} className="shrink-0">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.26em] text-amber-500/90">
              minitorch · {lockedCfg?.title ?? "autodiff"}
            </p>
            <span
              className={`rounded border px-1.5 py-0.5 font-mono text-[8px] ${
                isBackprop
                  ? "border-violet-400/30 bg-violet-500/10 text-violet-300/90"
                  : "border-amber-500/25 bg-amber-500/5 text-amber-400/80"
              }`}
            >
              {isBackprop ? "backward" : "forward"}
            </span>
          </div>

          <div className="mt-1.5 rounded-lg border border-white/[0.06] bg-black/55 px-2 py-1.5">
            {mode === "graph" && (
              <p className="font-mono text-[9px] leading-snug text-stone-400">
                <span className="text-violet-300/80">tape</span>{" "}
                <span className="text-stone-500">·</span> nodes store value, op,
                parents
              </p>
            )}
            {mode === "forward" && (
              <p className="font-mono text-[9px] leading-snug text-stone-400">
                <span className="text-violet-300/80">let</span>{" "}
                <span className="text-amber-200/90">y</span>{" "}
                <span className="text-stone-500">=</span> x * w + b
                <span className="text-emerald-400/80"> → loss</span>
              </p>
            )}
            {(mode === "backprop" || mode === "gradcheck") && (
              <p className="font-mono text-[9px] text-rose-300/85">
                loss.backward()
                <span className="text-stone-600"> · ∂L/∂w · ∂L/∂x · ∂L/∂b</span>
              </p>
            )}
            {mode === "full" && (
              <>
                <p className="font-mono text-[9px] leading-snug text-stone-400">
                  <span className="text-violet-300/80">let</span>{" "}
                  <span className="text-amber-200/90">y</span>{" "}
                  <span className="text-stone-500">=</span> x * w + b
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-rose-300/85">
                  loss.backward()
                  <span className="text-stone-600"> · reverse-mode AD</span>
                </p>
              </>
            )}
            {mode === "gradcheck" && (
              <p className="mt-0.5 font-mono text-[9px] text-emerald-400/85">
                assert |analytic − numeric| &lt; ε
              </p>
            )}
          </div>
        </motion.div>

        {/* Computation graph */}
        <div className="relative mt-1 min-h-0 flex-1">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 80"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient id="fwdEdge" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(245,158,11,0.2)" />
                <stop offset="100%" stopColor="rgba(251,191,36,0.75)" />
              </linearGradient>
              <linearGradient id="bwdEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(167,139,250,0.75)" />
                <stop offset="100%" stopColor="rgba(244,114,182,0.25)" />
              </linearGradient>
            </defs>

            {EDGES.map((e) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              const back = isBackprop;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={back ? "url(#bwdEdge)" : "url(#fwdEdge)"}
                    strokeWidth="0.55"
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                  <motion.line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={back ? "rgba(196,181,253,0.9)" : "rgba(251,191,36,0.85)"}
                    strokeWidth="0.35"
                    strokeDasharray="2 3"
                    animate={{
                      strokeDashoffset: back ? [0, -10] : [0, 10],
                    }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Gradient flow particles (backward) */}
          {isBackprop &&
            ["loss", "y", "add", "mul"].map((nid, i) => {
              const n = nodeById(nid);
              const next =
                nid === "loss"
                  ? nodeById("y")
                  : nid === "y"
                    ? nodeById("add")
                    : nid === "add"
                      ? nodeById("mul")
                      : nodeById("w");
              return (
                <motion.span
                  key={`bwd-${nid}`}
                  className="pointer-events-none absolute z-20 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.95)]"
                  style={{
                    left: `${n.x}%`,
                    top: `${n.y}%`,
                  }}
                  animate={{
                    left: [`${n.x}%`, `${next.x}%`],
                    top: [`${n.y}%`, `${next.y}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {/* Forward particles */}
          {!isBackprop &&
            ["x", "w", "mul", "y"].map((nid, i) => {
              const n = nodeById(nid);
              const next =
                nid === "x" || nid === "w"
                  ? nodeById("mul")
                  : nid === "mul"
                    ? nodeById("y")
                    : nodeById("loss");
              return (
                <motion.span
                  key={`fwd-${nid}`}
                  className="pointer-events-none absolute z-20 h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  animate={{
                    left: [`${n.x}%`, `${next.x}%`],
                    top: [`${n.y}%`, `${next.y}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.28,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {NODES.map((n) => {
            const hot = hotNodes
              ? hotNodes.includes(n.id)
              : (isBackprop && ["loss", "y", "w", "x", "b"].includes(n.id)) ||
                (!isBackprop && ["mul", "y", "loss"].includes(n.id));
            return (
              <motion.div
                key={n.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                animate={{ scale: hot ? 1.06 : 1 }}
              >
                <div
                  className={[
                    "flex min-w-[28px] flex-col items-center rounded-md border px-1.5 py-1",
                    n.id === "loss"
                      ? "border-rose-400/40 bg-rose-500/10"
                      : hot
                        ? "border-amber-400/40 bg-amber-500/[0.08] shadow-[0_0_14px_rgba(245,158,11,0.12)]"
                        : "border-white/[0.08] bg-black/50",
                  ].join(" ")}
                >
                  <span className="font-mono text-[9px] font-semibold text-amber-100/90">
                    {n.label}
                  </span>
                  {showGradLabels && n.grad && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-0.5 font-mono text-[6px] text-violet-300/90"
                    >
                      {n.grad}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Loss curve hint */}
          <div
            className={`absolute bottom-0 right-1 flex items-end gap-0.5 ${
              mode === "gradcheck" ? "h-12 w-20" : "h-8 w-14"
            }`}
          >
            {[0.9, 0.7, 0.5, 0.35, 0.22, 0.12].map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-t-sm bg-amber-500/70"
                initial={{ height: 0 }}
                animate={{ height: `${h * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="mt-1 grid shrink-0 grid-cols-5 gap-0.5">
          {PIPELINE.map((s, i) => {
            const on = locked ? i === lockedCfg!.active : i === active;
            return (
              <motion.div
                key={s.id}
                className={[
                  "rounded-md border px-0.5 py-1 text-center",
                  on
                    ? mode === "backprop" || mode === "gradcheck"
                      ? "border-violet-400/40 bg-violet-500/[0.08]"
                      : "border-amber-400/40 bg-amber-500/[0.08]"
                    : "border-white/[0.05] bg-black/30",
                ].join(" ")}
                animate={{ opacity: on ? 1 : locked ? 0.35 : 0.5 }}
              >
                <p className="truncate font-mono text-[6px] font-semibold uppercase tracking-wide text-amber-500/75 sm:text-[7px]">
                  {s.label}
                </p>
                <p className="mt-0.5 truncate font-mono text-[6px] text-stone-500">
                  {s.snippet}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30" />
    </div>
  );
}
