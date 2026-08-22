"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LazyVideo from "@/components/LazyVideo";
import TechChip from "@/components/motion/TechChip";
import {
  revealReduced,
  revealVariants,
  transitionBase,
} from "@/lib/motion";

export type MediaCardItem = {
  id: string; // "001"
  eyebrow?: string; // "Featured"
  title: string;
  blurb?: string;
  href: string; // internal "/projects/..." or external "https://..."
  external?: boolean;
  tags?: string[];

  // NEW: used for filtering + label
  type?: string; // e.g. "independent" | "course" | "affiliated"

  media?:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; alt: string; poster?: string };
};

type FilterOption = {
  label: string; // what user sees
  value: string; // what we match against item.type
};

type Props = {
  title: string;
  subtitle?: string;
  items: MediaCardItem[];
  columns?: 1 | 2 | 3;
  className?: string;

  // NEW
  filters?: FilterOption[]; // e.g. [{label:"All", value:"all"}, ...]
  defaultFilter?: string; // e.g. "all"
  showTypePill?: boolean; // show type on card
};

function Chip({
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
        "btn-lift rounded-full border px-4 py-2 text-sm backdrop-blur",
        active
          ? "border-zinc-300 bg-white/80 text-zinc-900 shadow-sm"
          : "border-zinc-200 bg-white/55 text-zinc-700 hover:border-amber-300 hover:bg-white/75",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TypePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
      {children}
    </span>
  );
}

function Card({
  item,
  showTypePill,
  typeLabelMap,
  index = 0,
}: {
  item: MediaCardItem;
  showTypePill?: boolean;
  typeLabelMap: Record<string, string>;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const prettyType = item.type ? typeLabelMap[item.type] ?? item.type : null;

  const inner = (
    <div
      data-cursor
      className="group relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/65 shadow-sm backdrop-blur transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-1.5 hover:border-amber-300/80 hover:shadow-md"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-amber-500 via-amber-300/80 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {item.media ? (
        <div className="group/media relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {item.media.kind === "image" ? (
              <Image
                src={item.media.src}
                alt={item.media.alt}
                fill
                className="img-zoom object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={item.id === "001"}
              />
            ) : (
              <LazyVideo
                src={item.media.src}
                poster={item.media.poster}
                className="img-zoom h-full w-full object-cover"
                playOnHover
                playWhenVisible={false}
              />
            )}
          </div>

          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-700 backdrop-blur">
            {item.id}
          </div>

          {showTypePill && prettyType ? (
            <div className="pointer-events-none absolute right-4 top-4">
              <TypePill>{prettyType}</TypePill>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="p-6 pb-0">
          <div className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-700">
            {item.id}
          </div>
        </div>
      )}

      <div className="relative p-6">
        {item.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
            {item.eyebrow}
          </p>
        ) : null}

        <div className={item.eyebrow ? "mt-3" : "mt-2"}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-950">{item.title}</h2>
            <span
              className="text-zinc-400 transition-all duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-0.5 group-hover:text-amber-700"
              aria-hidden
            >
              ↗
            </span>
          </div>

          {item.blurb ? (
            <p className="mt-2 text-sm leading-6 text-zinc-700">{item.blurb}</p>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.slice(0, 4).map((t) => (
                <TechChip key={t} className="rounded-full px-3 py-1 text-xs">
                  {t}
                </TechChip>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const wrapped = item.external ? (
    <a href={item.href} target="_blank" rel="noreferrer" className="relative block">
      {inner}
    </a>
  ) : (
    <Link href={item.href} className="relative block">
      {inner}
    </Link>
  );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={reduce ? revealReduced : revealVariants}
      transition={{ ...transitionBase, delay: index * 0.05 }}
    >
      {wrapped}
    </motion.div>
  );
}

export default function MediaCardGrid({
  title,
  subtitle,
  items,
  columns = 2,
  className,
  filters,
  defaultFilter = "all",
  showTypePill = true,
}: Props) {
  const [active, setActive] = useState(defaultFilter);

  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";

  // map values -> pretty labels (so pills can show "Independent" not "independent")
  const typeLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    (filters ?? []).forEach((f) => {
      if (f.value !== "all") map[f.value] = f.label;
    });
    return map;
  }, [filters]);

  const filteredItems = useMemo(() => {
    if (!filters || active === "all") return items;
    return items.filter((it) => it.type === active);
  }, [items, filters, active]);

  return (
    <div className={className}>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-700">
          {subtitle}
        </p>
      ) : null}

      {/* FILTER CHIPS */}
      {filters?.length ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((f) => (
            <Chip
              key={f.value}
              active={active === f.value}
              onClick={() => setActive(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      ) : null}

      <div className={`mt-10 grid ${gridCols} gap-6`}>
        {filteredItems.map((item, i) => (
          <Card
            key={`${item.id}-${item.title}`}
            item={item}
            showTypePill={showTypePill}
            typeLabelMap={typeLabelMap}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
