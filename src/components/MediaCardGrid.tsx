"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

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
    | { kind: "video"; src: string; poster?: string };
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 backdrop-blur">
      {children}
    </span>
  );
}

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
        "rounded-full border px-4 py-2 text-sm transition backdrop-blur",
        active
          ? "border-zinc-300 bg-white/80 text-zinc-900 shadow-sm"
          : "border-zinc-200 bg-white/55 text-zinc-700 hover:bg-white/75",
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
}: {
  item: MediaCardItem;
  showTypePill?: boolean;
  typeLabelMap: Record<string, string>;
}) {
  const prettyType = item.type ? typeLabelMap[item.type] ?? item.type : null;

  const inner = (
    <div
      data-cursor
      className="group overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/65 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* MEDIA */}
      {item.media ? (
        <div className="relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {item.media.kind === "image" ? (
              <Image
                src={item.media.src}
                alt={item.media.alt}
                fill
                className="object-cover transition group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={item.id === "001"}
              />
            ) : (
              <video
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                src={item.media.src}
                poster={item.media.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            )}
          </div>

          {/* ID chip */}
          <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-zinc-700 backdrop-blur">
            {item.id}
          </div>

          {/* optional type pill (top-right) */}
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

      {/* TEXT */}
      <div className="p-6">
        {item.eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
            {item.eyebrow}
          </p>
        ) : null}

        <div className={item.eyebrow ? "mt-3" : "mt-2"}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-950">{item.title}</h2>
            <span className="text-zinc-400 transition group-hover:text-zinc-700">
              ↗
            </span>
          </div>

          {item.blurb ? (
            <p className="mt-2 text-sm leading-6 text-zinc-700">{item.blurb}</p>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.slice(0, 4).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className="block">
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className="block">
      {inner}
    </Link>
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
        {filteredItems.map((item) => (
          <Card
            key={`${item.id}-${item.title}`}
            item={item}
            showTypePill={showTypePill}
            typeLabelMap={typeLabelMap}
          />
        ))}
      </div>
    </div>
  );
}
