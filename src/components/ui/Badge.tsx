export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "signal" | "featured" | "muted";
}) {
  const styles = {
    default: "border-zinc-200/80 bg-white/80 text-zinc-700",
    signal: "border-amber-500/30 bg-amber-500/10 text-amber-900",
    featured: "border-amber-400/50 bg-amber-400/15 text-amber-950 font-medium",
    muted: "border-zinc-200/60 bg-zinc-50 text-zinc-500",
  };
  return (
    <span
      className={`tech-chip inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-wide backdrop-blur-sm transition-[transform,border-color,background-color] duration-300 motion-safe:hover:-translate-y-0.5 ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
