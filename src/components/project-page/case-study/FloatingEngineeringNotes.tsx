"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  ENGINEERING_NOTE_LABELS,
  type EngineeringNote,
} from "@/data/engineering-case-study";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Floating margin notes that cycle in/out.
 *
 * Wide desktops: sit in side gutters.
 * Normal laptop widths: dock to the viewport corners so they stay readable
 * without needing ultra-wide margins.
 */
export default function FloatingEngineeringNotes({
  notes,
}: {
  notes: EngineeringNote[];
}) {
  const order = useMemo(() => shuffle(notes), [notes]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"gutter" | "dock">("dock");

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 1680px)");
    const mqShow = window.matchMedia("(min-width: 900px)");
    const update = () => {
      setEnabled(mqShow.matches);
      setMode(mqWide.matches ? "gutter" : "dock");
    };
    update();
    mqWide.addEventListener("change", update);
    mqShow.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqShow.removeEventListener("change", update);
    };
  }, []);

  // Cycle through notes so the appear/disappear motion stays, and more notes get seen.
  useEffect(() => {
    if (!enabled || dismissed || order.length <= 1) return;
    const id = window.setInterval(() => {
      setSlotIndex((prev) => (prev + 1) % order.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [enabled, dismissed, order.length]);

  if (!enabled || dismissed || order.length === 0) return null;

  const note = order[slotIndex % order.length];
  const side: "left" | "right" = slotIndex % 2 === 0 ? "right" : "left";
  const top = mode === "gutter" ? (slotIndex % 3 === 0 ? "28%" : slotIndex % 3 === 1 ? "52%" : "72%") : "auto";

  const gutter = "max(0.75rem, calc((100vw - 80rem) / 2 - 14.5rem))";
  const dockStyle =
    side === "left"
      ? { left: "0.75rem", bottom: "5.5rem" }
      : { right: "0.75rem", bottom: "5.5rem" };
  const gutterStyle =
    side === "left"
      ? { left: gutter, top }
      : { right: gutter, top };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden min-[900px]:block">
      <AnimatePresence mode="wait">
        <motion.aside
          key={`${note.kind}-${slotIndex}-${note.text.slice(0, 24)}`}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={mode === "gutter" ? gutterStyle : dockStyle}
          className="pointer-events-auto absolute w-[220px] max-w-[calc(100vw-1.5rem)]"
        >
          <div className="rounded-2xl border border-orange-200/80 bg-white/95 p-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.10)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-800">
                {ENGINEERING_NOTE_LABELS[note.kind]}
              </p>
              <button
                type="button"
                aria-label="Dismiss notes"
                onClick={() => setDismissed(true)}
                className="rounded-md p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-700">
              “{note.text}”
            </p>
          </div>
        </motion.aside>
      </AnimatePresence>
    </div>
  );
}
