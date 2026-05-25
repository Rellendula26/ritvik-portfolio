"use client";

import { motion } from "framer-motion";

const STEPS = [
  { label: "scrape", text: "faculty listing → profiles" },
  { label: "summarize", text: "Ollama · lab page" },
  { label: "draft", text: "personalized email" },
  { label: "review", text: "human confirm-send" },
];

export default function LabReachPreviewVisual({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#0a0a0a] ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(167,139,250,0.1),transparent_45%),radial-gradient(ellipse_at_10%_90%,rgba(245,158,11,0.08),transparent_40%)]" />

      <div className="relative flex h-full flex-col p-3">
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-amber-500/85">
          labreach · outreach copilot
        </p>

        <div className="mt-2 min-h-0 flex-1 rounded-xl border border-white/10 bg-black/50 p-2">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-stone-600" />
            <span className="h-2 w-2 rounded-full bg-stone-600" />
            <span className="ml-1 font-mono text-[7px] text-stone-500">
              mech.hku.hk/research-assistant…
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-1"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity }}
              >
                <p className="font-mono text-[7px] uppercase text-violet-300/80">
                  {s.label}
                </p>
                <p className="font-mono text-[6.5px] leading-tight text-stone-500">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.05] px-2 py-1.5">
            <p className="font-mono text-[7px] text-stone-500">draft preview</p>
            <p className="mt-0.5 font-mono text-[8px] leading-snug text-stone-300">
              Dear Prof. Chen — I read your work on…
            </p>
            <p className="mt-1 font-mono text-[7px] text-amber-500/70">
              --confirm-send required
            </p>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[7px] text-stone-600">
          Python · SQLite · Gmail API · batch-listing
        </p>
      </div>
    </div>
  );
}
