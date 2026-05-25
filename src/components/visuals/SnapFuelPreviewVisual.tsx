"use client";

import { motion } from "framer-motion";

export default function SnapFuelPreviewVisual({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#0a0a0a] ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(245,158,11,0.12),transparent_50%)]" />

      <div className="relative flex h-full flex-col p-3">
        <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.24em] text-amber-500/85">
          snapfuel · concept
        </p>

        <div className="mt-2 flex min-h-0 flex-1 gap-2">
          {/* Phone mock */}
          <div className="flex w-[42%] flex-col rounded-xl border border-white/10 bg-black/60 p-2">
            <div className="aspect-[3/4] overflow-hidden rounded-lg border border-white/5 bg-stone-900">
              <div className="flex h-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-stone-800 to-stone-950 p-2">
                <div className="h-8 w-8 rounded-lg border border-amber-500/30 bg-amber-500/10" />
                <p className="font-mono text-[7px] text-stone-500">meal photo</p>
              </div>
            </div>
            <p className="mt-1.5 text-center font-mono text-[7px] text-emerald-400/80">
              AI estimate → confirm
            </p>
          </div>

          {/* Dashboard */}
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2 py-1.5">
              <p className="font-mono text-[7px] text-stone-500">today</p>
              <p className="font-mono text-sm font-semibold text-amber-200/90">
                1,840 <span className="text-[9px] text-stone-500">kcal in</span>
              </p>
            </div>

            <div className="flex-1 rounded-lg border border-white/[0.06] bg-black/40 p-2">
              <p className="font-mono text-[7px] text-stone-500">net vs garmin</p>
              <div className="mt-2 flex items-end gap-1">
                {[65, 45, 80, 55, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t bg-amber-500/60"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    style={{ maxHeight: 36 }}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-[8px] text-violet-300/80">
                burned 2,210 · net −370
              </p>
            </div>

            <div className="rounded border border-white/[0.06] px-2 py-1 font-mono text-[7px] text-stone-400">
              OpenAI vision · Supabase · Next.js
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
