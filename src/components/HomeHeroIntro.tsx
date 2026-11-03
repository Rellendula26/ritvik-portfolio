"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

type Segment = {
  text: string;
  accent?: boolean;
  href?: string;
};

const HEADLINE = "Hey, I'm Ritvik!";

const PARAGRAPHS: Segment[][] = [
  [
    { text: "I'm an electrical engineering student at Penn. I'm interested in " },
    { text: "embedded systems", accent: true },
    { text: " and " },
    { text: "robotics", accent: true },
    { text: ", especially " },
    { text: "medical and surgical robotics", accent: true },
    { text: "." },
  ],
  [
    {
      text: "I like working through something difficult and gradually figuring it out. That's part of why I do endurance sports: stay patient when progress is slow. Engineering gives me that same feeling, and a chance to build something someone else can use.",
    },
  ],
  [
    {
      text: "I made this site to keep a record of the work, not just the finished version. The ",
    },
    { text: "projects", href: "/projects" },
    {
      text: " include the decisions and the setbacks.",
    },
  ],
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function AccentText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-amber-800 underline decoration-amber-300/80 underline-offset-4">
      {children}
    </span>
  );
}

function renderSegment(segment: Segment, key: string) {
  if (segment.href) {
    return (
      <Link
        key={key}
        href={segment.href}
        className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 hover:text-amber-900"
      >
        {segment.text}
      </Link>
    );
  }

  if (segment.accent) {
    return <AccentText key={key}>{segment.text}</AccentText>;
  }

  return <span key={key}>{segment.text}</span>;
}

/**
 * Home hero copy:
 * - Headline keeps the typewriter "pop"
 * - Body paragraphs use a quieter staggered fade/rise (not more typing)
 *
 * Say "full back" in chat to revert this intro motion to the prior all-typewriter version.
 */
export default function HomeHeroIntro({
  onProgress,
}: {
  /** 0 → 1 progress so the photo / workbench can ease in with the copy */
  onProgress?: (progress: number) => void;
}) {
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);
  const headlineDone = typed >= HEADLINE.length;

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Defer so we don't sync-set state in the effect body (eslint + cascading render).
      const frame = window.requestAnimationFrame(() => {
        setTyped(HEADLINE.length);
        setStarted(true);
        setBodyVisible(true);
        onProgress?.(1);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const startTimer = window.setTimeout(() => setStarted(true), 280);
    return () => window.clearTimeout(startTimer);
  }, [onProgress]);

  useEffect(() => {
    if (!started || headlineDone) return;

    const char = HEADLINE[typed];
    const delay = char === " " ? 28 : char === "!" || char === "," ? 70 : 42;

    const timer = window.setTimeout(() => {
      setTyped((c) => Math.min(c + 1, HEADLINE.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [started, typed, headlineDone]);

  useEffect(() => {
    if (!headlineDone || bodyVisible) return;

    const pause = prefersReducedMotion() ? 0 : 220;
    const timer = window.setTimeout(() => setBodyVisible(true), pause);
    return () => window.clearTimeout(timer);
  }, [headlineDone, bodyVisible]);

  useEffect(() => {
    if (!onProgress) return;
    if (bodyVisible) {
      onProgress(1);
      return;
    }
    // Headline owns the first half of the entrance; body/photo take the rest.
    onProgress(HEADLINE.length === 0 ? 0 : (typed / HEADLINE.length) * 0.55);
  }, [typed, bodyVisible, onProgress]);

  const headlineText = HEADLINE.slice(0, typed);
  const showCaret = started && !headlineDone;

  return (
    <div>
      <h1 className="text-display text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl lg:text-[3.35rem] lg:leading-[1.08]">
        {headlineText}
        {showCaret ? (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[0.85em] w-[0.08em] translate-y-[0.1em] bg-amber-700 align-middle animate-pulse"
          />
        ) : null}
      </h1>

      <div
        className="mt-8 min-h-[14rem] space-y-5 text-lg leading-8 text-stone-700 md:min-h-[12rem]"
        aria-busy={!bodyVisible}
      >
        {PARAGRAPHS.map((segments, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className="transition-[opacity,transform,filter] duration-700 ease-out"
            style={{
              opacity: bodyVisible ? 1 : 0,
              transform: bodyVisible ? "translateY(0)" : "translateY(10px)",
              filter: bodyVisible ? "blur(0)" : "blur(2px)",
              transitionDelay: bodyVisible ? `${120 + paragraphIndex * 140}ms` : "0ms",
            }}
          >
            {segments.map((segment, segmentIndex) =>
              renderSegment(segment, `${paragraphIndex}-${segmentIndex}`)
            )}
          </p>
        ))}
      </div>

      <div
        className={[
          "mt-10 lg:mt-12",
          bodyVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
          "transition-[opacity,transform] duration-700 ease-out",
        ].join(" ")}
        style={{ transitionDelay: bodyVisible ? "520ms" : "0ms" }}
      >
        <SocialLinks />
      </div>
    </div>
  );
}
