"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import {
  FEATURED_PROJECTS,
  SUPPORTING_PROJECTS,
  ARCHIVE_PROJECTS,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

const FILTERS: { label: string; value: "all" | ProjectCategory }[] = [
  { label: "All", value: "all" },
  { label: "Systems", value: "systems" },
  { label: "ML", value: "ml" },
  { label: "Embedded", value: "embedded" },
  { label: "Hardware", value: "hardware" },
  { label: "Full-Stack", value: "fullstack" },
  { label: "CAD", value: "cad" },
  { label: "Data", value: "data" },
];

const TIER_SHADES = {
  header: "bg-[#faf8f5]",
  featured: "bg-[#f0e8dc]",
  supporting: "bg-[#f7f2ea]",
  archive: "bg-[#fdfbf7]",
} as const;

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
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-stone-900 bg-stone-950 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TierBand({
  title,
  subtitle,
  projects,
  featured,
  shade,
}: {
  title: string;
  subtitle: string;
  projects: Project[];
  featured?: boolean;
  shade: keyof typeof TIER_SHADES;
}) {
  if (projects.length === 0) return null;

  return (
    <section className={`border-t border-stone-200/40 ${TIER_SHADES[shade]}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <div className="mb-8">
          <h2 className="text-display text-2xl text-stone-950 md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-stone-600 md:text-base">
            {subtitle}
          </p>
        </div>
        <div
          className={[
            "grid gap-6",
            featured ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          ].join(" ")}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              featured={featured}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function useFiltered(list: Project[], filter: "all" | ProjectCategory) {
  return useMemo(
    () => (filter === "all" ? list : list.filter((p) => p.category === filter)),
    [filter, list]
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  const featured = useFiltered(FEATURED_PROJECTS, filter);
  const supporting = useFiltered(SUPPORTING_PROJECTS, filter);
  const archive = useFiltered(ARCHIVE_PROJECTS, filter);

  return (
    <div className="min-h-screen">
      <section className={TIER_SHADES.header}>
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
          <header className="max-w-2xl">
            <h1 className="text-display text-4xl text-stone-950 md:text-5xl">
              Projects
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-stone-700">
              This page is basically my engineering notebook: what I built, what
              broke, what I changed, and what I learned while shipping things
              across software and hardware.
            </p>
          </header>

          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      <TierBand
        title="Featured engineering work"
        subtitle="Compiler pipelines, autodiff, embedded IoT, and hardware integration."
        projects={featured}
        featured
        shade="featured"
      />
      <TierBand
        title="Supporting builds"
        subtitle="Smaller builds, but still real engineering: web apps, CV pipelines, signal processing experiments, and embedded games that made me sharper across different parts of the stack."
        projects={supporting}
        shade="supporting"
      />
      <TierBand
        title="Earlier work"
        subtitle="Course and earlier builds. I keep them here for context because they show how my approach changed over time."
        projects={archive}
        shade="archive"
      />
    </div>
  );
}
