"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  { w: "72%", tone: "bg-stone-600" },
  { w: "48%", tone: "bg-amber-500/60" },
  { w: "86%", tone: "bg-stone-700" },
  { w: "36%", tone: "bg-stone-600" },
];

export default function PortfolioPreviewVisual({
  className = "",
}: {
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % 2), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#070707] ${className}`}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute h-40 w-40 rounded-full blur-3xl"
        animate={{ left: ["20%", "70%", "35%"], top: ["10%", "40%", "20%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.16) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div className="relative flex h-full flex-col p-3 sm:p-4">
        <motion.div className="flex items-center justify-between">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.26em] text-amber-500/90">
            ritvik-portfolio
          </p>
          <span className="rounded border border-amber-500/20 px-1.5 py-0.5 font-mono text-[8px] text-amber-400/80">
            Next.js 16
          </span>
        </motion.div>

        <motion.div className="mt-2 flex gap-1.5">
          {["Home", "Projects", "Research"].map((tab, i) => (
            <span
              key={tab}
              className={[
                "rounded-full px-2 py-0.5 font-mono text-[7px]",
                i === 1
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-stone-600",
              ].join(" ")}
            >
              {tab}
            </span>
          ))}
        </motion.div>

        <motion.div className="mt-3 grid flex-1 grid-cols-2 gap-2">
          {[0, 1].map((card) => (
            <motion.div
              key={card}
              className={[
                "flex flex-col rounded-lg border p-2",
                active === card
                  ? "border-amber-400/40 bg-amber-500/[0.06]"
                  : "border-white/[0.06] bg-black/40",
              ].join(" ")}
              animate={{ scale: active === card ? 1.02 : 1 }}
            >
              <div className="h-8 rounded-md bg-gradient-to-br from-stone-800 to-stone-950" />
              <motion.span
                className="mt-1.5 block h-1.5 rounded-full bg-amber-500/70"
                animate={{ width: active === card ? "70%" : "45%" }}
              />
              <span className="mt-1 block h-1 w-2/3 rounded-full bg-stone-700" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-2 rounded-lg border border-white/[0.06] bg-black/50 px-2 py-1.5">
          {LINES.map((line, i) => (
            <motion.div
              key={i}
              className={`mt-1 h-1 rounded-full ${line.tone}`}
              animate={{ width: line.w, opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        <motion.div className="mt-2 flex gap-1">
          {["Tailwind", "Framer", "Vercel"].map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/[0.06] px-1.5 py-0.5 font-mono text-[6px] text-stone-500"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.span
        className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
        animate={{ top: ["35%", "55%", "40%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
