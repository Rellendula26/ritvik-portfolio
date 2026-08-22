"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type CountParsed = {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
  rest: string;
};

/**
 * Parse short evidence-like strings for a leading countable number.
 * Examples: "40+ joints", "8 weeks", "70k+", "±1.2°", "2.1 ms / 5 ms"
 */
function parseMetric(
  text: string
): { kind: "static"; text: string } | ({ kind: "count" } & CountParsed) {
  const trimmed = text.trim();
  const match = trimmed.match(
    /^([±~≈]?)(\d+(?:\.\d+)?)(k|m|K|M)?(\+?)([\s\S]*)$/
  );
  if (!match) return { kind: "static", text: trimmed };

  const [, prefix, numStr, scaleRaw, plus, rest] = match;
  const scale = (scaleRaw ?? "").toLowerCase();
  if (rest.length > 36) return { kind: "static", text: trimmed };

  let value = Number(numStr);
  if (Number.isNaN(value)) return { kind: "static", text: trimmed };
  if (scale === "k") value *= 1000;
  if (scale === "m") value *= 1_000_000;

  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;

  return {
    kind: "count",
    prefix,
    value,
    decimals: scale ? 0 : decimals,
    suffix: `${scale}${plus}`,
    rest,
  };
}

function formatCounted(
  value: number,
  decimals: number,
  originalSuffix: string
): string {
  if (originalSuffix.toLowerCase().startsWith("k")) {
    const n = value / 1000;
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}k${
      originalSuffix.includes("+") ? "+" : ""
    }`;
  }
  if (originalSuffix.toLowerCase().startsWith("m")) {
    const n = value / 1_000_000;
    return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}m${
      originalSuffix.includes("+") ? "+" : ""
    }`;
  }
  const body =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return `${body}${originalSuffix.includes("+") ? "+" : ""}`;
}

function CountUpMetric({
  parsed,
  finalText,
  className,
}: {
  parsed: CountParsed;
  finalText: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(() =>
    `${parsed.prefix}${formatCounted(0, parsed.decimals, parsed.suffix)}${parsed.rest}`
  );
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const durationMs = 700;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = parsed.value * eased;
      setDisplay(
        `${parsed.prefix}${formatCounted(
          current,
          parsed.decimals,
          parsed.suffix
        )}${parsed.rest}`
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(finalText);
    };

    // Start from zero on the next frame (avoids sync setState in effect body).
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed, finalText]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0.55 }}
      animate={inView ? { opacity: 1 } : undefined}
      transition={{ duration: 0.35 }}
    >
      {display}
    </motion.span>
  );
}

export default function AnimatedMetric({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parseMetric(value), [value]);

  if (parsed.kind === "static" || reduce) {
    return <span className={className}>{value}</span>;
  }

  return (
    <CountUpMetric
      parsed={parsed}
      finalText={value}
      className={className}
    />
  );
}
