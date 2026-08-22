import Link from "next/link";
import CaseStudyVideo from "@/components/project-page/CaseStudyVideo";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";

export type LinkItem = { label: string; href: string };

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string; alt?: string };

export function ProjectPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(to_bottom,#fff7ed_0%,#fffaf5_18%,#ffffff_42%,#fffaf5_100%)]">
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
      {/* Faint schematic texture — decorative only */}
      <svg
        aria-hidden
        className="pointer-events-none absolute right-6 top-24 hidden h-28 w-40 text-orange-400/20 md:block motion-safe:animate-hero-drift"
        viewBox="0 0 160 112"
        fill="none"
      >
        <path d="M8 56 H40 L56 40 H96" stroke="currentColor" strokeWidth="1" />
        <circle cx="40" cy="56" r="2.5" fill="currentColor" />
        <circle cx="96" cy="40" r="2.5" fill="currentColor" />
        <rect x="100" y="32" width="20" height="16" rx="2" stroke="currentColor" />
        <path d="M120 40 H148" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-14">{children}</div>
    </main>
  );
}

export function BackToProjects() {
  return (
    <Link
      href="/projects"
      className="btn-lift mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-orange-600"
    >
      ← Back to Projects
    </Link>
  );
}

export function ProjectBadge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "warm" | "dark" | "yellow";
}) {
  const styles = {
    default: "border-orange-200 bg-orange-50 text-orange-900",
    warm:
      "border-orange-300/70 bg-gradient-to-br from-orange-100 to-amber-50 text-orange-950",
    dark: "border-zinc-800 bg-zinc-900 text-white",
    yellow: "border-amber-300 bg-amber-300 text-zinc-950",
  };

  return (
    <span
      className={`tech-chip inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide shadow-sm transition-[transform,border-color,background-color] duration-300 motion-safe:hover:-translate-y-0.5 ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export function ActionLink({ label, href }: LinkItem) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="btn-lift inline-flex items-center rounded-full border border-orange-300 bg-white/90 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-900 shadow-sm hover:bg-orange-50"
    >
      {label}
    </a>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-900">
      {children}
    </p>
  );
}

export function BrowserFrame({
  label,
  media,
  className = "h-[300px] md:h-[380px]",
}: {
  label: string;
  media: ProjectMedia;
  className?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-200/45 via-amber-100/30 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-orange-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-zinc-300" />
          <span className="ml-2 text-xs font-medium text-zinc-500">{label}</span>
        </div>
        <div className={`relative w-full ${className}`}>
          {media.kind === "image" ? (
            <ProjectMediaImage
              src={media.src}
              alt={media.alt}
              priority
              sizes="(max-width: 768px) 100vw, 520px"
            />
          ) : (
            <CaseStudyVideo
              src={media.src}
              poster={media.poster}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { default as AnchorNav } from "@/components/project-page/AnchorNav";
