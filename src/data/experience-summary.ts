import type { Experience, TextRun } from "@/data/experiences";

export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function sentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/** Keep whole sentences. If the first sentence is already over the cap, keep that sentence. */
export function capWords(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean || wordCount(clean) <= max) return clean;
  let out = "";
  for (const sentence of sentences(clean)) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (wordCount(next) > max) break;
    out = next;
  }
  return out || sentences(clean)[0] || clean;
}

export function plainRuns(runs: TextRun[]) {
  return runs
    .map((run) => {
      if (typeof run === "string") return run;
      if ("label" in run) return run.label;
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** What the org does, from the existing about copy. First sentence that fits. */
export function orgOneLiner(experience: Experience) {
  const about = experience.about ? plainRuns(experience.about) : "";
  const fit = sentences(about).find((sentence) => wordCount(sentence) <= 15);
  if (fit) return fit;
  const fallback = sentences(experience.oneLiner).find((sentence) => wordCount(sentence) <= 15);
  return fallback ?? capWords(about || experience.oneLiner, 15);
}

export function experienceBullets(experience: Experience) {
  return experience.highlights.slice(0, 3).map((highlight) => capWords(highlight, 25));
}
