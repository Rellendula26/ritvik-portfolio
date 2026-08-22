"use client";

import { useMemo, useState } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import {
  EXPERIENCES,
  EXPERIENCE_TRACK_LABELS,
  type ExperienceTrack,
} from "@/data/experiences";

type FilterValue = "all" | ExperienceTrack;

const FILTERS: Array<{ label: string; value: FilterValue }> = [
  { label: "All", value: "all" },
  { label: EXPERIENCE_TRACK_LABELS.industry, value: "industry" },
  { label: EXPERIENCE_TRACK_LABELS.club, value: "club" },
];

function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "btn-lift rounded-full border px-4 py-2 text-sm backdrop-blur transition-colors",
        active
          ? "border-stone-300 bg-white/90 text-stone-950 shadow-sm"
          : "border-stone-200 bg-white/55 text-stone-700 hover:border-amber-300 hover:bg-white/75",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function ExperiencesList() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const items = useMemo(() => {
    if (filter === "all") return EXPERIENCES;
    return EXPERIENCES.filter((experience) => experience.track === filter);
  }, [filter]);

  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <FilterChip
            key={option.value}
            active={filter === option.value}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </FilterChip>
        ))}
      </div>

      <p className="mt-4 text-xs text-stone-500">
        {filter === "all"
          ? "Use the filters if you only want internships or only school clubs."
          : filter === "industry"
            ? "Company internships."
            : "Campus clubs and leadership."}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {items.length ? (
          items.map((experience, i) => (
            <ExperienceCard
              key={experience.slug}
              experience={experience}
              index={i}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-10 text-sm text-stone-600">
            No {EXPERIENCE_TRACK_LABELS[filter as ExperienceTrack].toLowerCase()}{" "}
            listed yet. Add them in{" "}
            <code className="text-stone-800">src/data/experiences.ts</code> with{" "}
            <code className="text-stone-800">track: &quot;club&quot;</code>.
          </p>
        )}
      </div>
    </div>
  );
}
