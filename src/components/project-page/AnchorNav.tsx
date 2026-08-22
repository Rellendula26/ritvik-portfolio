"use client";

import { useEffect, useState } from "react";

export default function AnchorNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="mt-8 flex flex-wrap gap-2 border-t border-zinc-200/80 pt-6">
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={active ? "true" : "false"}
            className={[
              "btn-lift rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
              active
                ? "border-orange-400 bg-orange-50 text-orange-950 shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-900",
            ].join(" ")}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
