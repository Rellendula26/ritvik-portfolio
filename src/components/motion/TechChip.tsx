"use client";

type TechChipProps = {
  children: React.ReactNode;
  variant?: "light" | "dark" | "soft";
  className?: string;
};

const variants = {
  light:
    "border-stone-200/80 bg-stone-100 text-stone-600 hover:border-amber-300/80 hover:bg-amber-50 hover:text-stone-800",
  dark: "border-white/10 bg-white/10 text-stone-300 hover:border-amber-400/40 hover:bg-white/15 hover:text-stone-100",
  soft: "border-white/15 bg-white/5 text-stone-400 hover:border-amber-400/35 hover:bg-white/10 hover:text-stone-200",
} as const;

/**
 * Technology / interest chip with restrained hover (border + 1–2px lift).
 * Essential label is always visible — hover is polish only.
 */
export default function TechChip({
  children,
  variant = "light",
  className = "",
}: TechChipProps) {
  return (
    <span
      className={[
        "tech-chip inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-sm",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
