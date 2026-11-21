"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import {
  PROJECTS,
  PROJECT_DIRECTORY,
  projectsInDirectory,
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
        "btn-lift rounded-full border px-4 py-2 text-sm",
        active
          ? "border-stone-900 bg-stone-950 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-amber-50/60",
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
  directory = false,
}: {
  title: string;
  subtitle: string;
  projects: Project[];
  featured?: boolean;
  shade: keyof typeof TIER_SHADES;
  directory?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <section className={`border-t border-stone-200/40 ${TIER_SHADES[shade]}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <Reveal className="mb-8">
          <h2 className="text-display text-2xl text-stone-950 md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-stone-600 md:text-base">
            {subtitle}
          </p>
        </Reveal>
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
              directory={directory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function applyFilter(list: Project[], filter: "all" | ProjectCategory) {
  return filter === "all" ? list : list.filter((project) => project.category === filter);
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  const sections = useMemo(() => {
    const shades = ["featured", "supporting", "header", "archive"] as const;
    return PROJECT_DIRECTORY.map((section, index) => ({
      ...section,
      projects: applyFilter(projectsInDirectory(section.slugs), filter),
      shade: shades[index] ?? "archive",
    }));
  }, [filter]);

  const remainder = useMemo(() => {
    const listed = new Set(PROJECT_DIRECTORY.flatMap((section) => section.slugs));
    return applyFilter(
      PROJECTS.filter((project) => !listed.has(project.slug)),
      filter
    );
  }, [filter]);

  return (
    <div className="min-h-screen">
      <section className={TIER_SHADES.header}>
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
          <Reveal>
            <header className="max-w-2xl">
              <h1 className="text-display text-4xl text-stone-950 md:text-5xl">
                Projects
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-stone-700">
                The first group is the electrical and robotics work: Serpent boards and teleoperation, the ADAPT arm, Vend-A-Shoe, and the GRASP printer and imager. The other groups are hardware, software, and older coursework.
              </p>
            </header>
          </Reveal>

          <Reveal delay={0.06} className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </FilterChip>
            ))}
          </Reveal>
        </div>
      </section>

      {sections.map((section) => (
        <TierBand
          key={section.title}
          title={section.title}
          subtitle={section.subtitle}
          projects={section.projects}
          featured={section.featured}
          shade={section.shade}
          directory
        />
      ))}
      <TierBand
        title="Also on the site"
        subtitle="Projects that are not in the groups above."
        projects={remainder}
        shade="archive"
        directory
      />
    </div>
  );
}
