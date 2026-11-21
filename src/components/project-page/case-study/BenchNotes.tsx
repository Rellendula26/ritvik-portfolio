"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Long history stays on the page, collapsed, so the architecture and the outcome stay first. */
export default function BenchNotes({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function openForHash() {
      const id = window.location.hash.replace("#", "");
      const details = ref.current;
      if (!details || !id) return;
      if (id === "record" || details.querySelector(`#${CSS.escape(id)}`)) {
        details.open = true;
      }
    }

    openForHash();
    window.addEventListener("hashchange", openForHash);
    return () => window.removeEventListener("hashchange", openForHash);
  }, []);

  return (
    <details
      id="record"
      ref={ref}
      className="scroll-mt-28 rounded-[2rem] border border-stone-200 bg-[#fdfbf7] px-5 py-5 md:px-8 md:py-6"
    >
      <summary className="cursor-pointer text-display text-2xl text-stone-950 md:text-3xl">
        Bench notes
      </summary>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">
        The longer design notes, the timeline, and the revisions. The sections above are the system and what I measured.
      </p>
      <div className="mt-8 space-y-12 md:space-y-14">{children}</div>
    </details>
  );
}
