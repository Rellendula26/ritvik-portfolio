#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");
const CACHE_ROOT = path.join(ROOT, ".cache", "repo-analysis");

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function usage() {
  console.log("Usage:");
  console.log("  npm run projects:intake:analyze -- <project-slug> [repo-url]");
  console.log("");
  console.log("Example:");
  console.log("  npm run projects:intake:analyze -- vend-a-shoe https://github.com/user/repo");
}

function firstUrl(text) {
  if (!text) return undefined;
  const match = text.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : undefined;
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return { frontmatter: {}, body: markdown };
  const closing = markdown.indexOf("\n---\n", 4);
  if (closing === -1) return { frontmatter: {}, body: markdown };
  const raw = markdown.slice(4, closing).trim();
  const body = markdown.slice(closing + 5);
  const frontmatter = {};

  raw.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) frontmatter[key] = value;
  });

  return { frontmatter, body };
}

function parseSections(markdownBody) {
  const sections = {};
  const lines = markdownBody.split("\n");
  let current = "";
  let buffer = [];

  function flush() {
    if (!current) return;
    sections[current.toLowerCase()] = buffer.join("\n").trim();
    buffer = [];
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      current = line.replace(/^##\s+/, "").trim();
      continue;
    }
    if (current) buffer.push(line);
  }
  flush();

  return sections;
}

async function runGit(args, cwd) {
  const { stdout } = await execFileAsync("git", args, { cwd });
  return stdout.trim();
}

async function cloneOrUpdate(repoUrl, repoPath) {
  if (await exists(path.join(repoPath, ".git"))) {
    await runGit(["fetch", "--all", "--prune"], repoPath);
    await runGit(["pull", "--ff-only"], repoPath);
    return;
  }

  await ensureDir(path.dirname(repoPath));
  await execFileAsync("git", ["clone", "--depth", "200", repoUrl, repoPath], { cwd: ROOT });
}

function detectCategoryFromRepo(fileSet) {
  const hasPythonWorker = fileSet.has("pi_worker.py") || fileSet.has("servo_motor.py");
  const hasHardwareHints = [...fileSet].some((file) =>
    /(gpio|servo|kicad|schematic|cad|bom|firmware)/i.test(file)
  );
  if (hasPythonWorker || hasHardwareHints) return "embedded";
  if (fileSet.has("package.json")) return "fullstack";
  return "systems";
}

function detectStack(fileSet, pkgJson, readmeText) {
  const frontend = [];
  const backend = [];
  const hardware = [];

  if (pkgJson?.dependencies?.next) frontend.push("Next.js");
  if (pkgJson?.dependencies?.react) frontend.push("React");
  if (fileSet.has("tsconfig.json")) frontend.push("TypeScript");
  if (fileSet.has("tailwind.config.js") || fileSet.has("tailwind.config.ts"))
    frontend.push("Tailwind CSS");
  if (pkgJson?.dependencies?.["lucide-react"]) frontend.push("Lucide icons");
  if (pkgJson?.dependencies?.["@supabase/supabase-js"])
    backend.push("Supabase JS client");
  if (fileSet.has("supabase.sql")) backend.push("Supabase Postgres schema + policies");
  if (fileSet.has(".vercel/project.json") || fileSet.has(".vercel")) backend.push("Vercel deploy config");
  if (fileSet.has("pi_worker.py")) {
    hardware.push("Raspberry Pi Python worker");
    backend.push("Command queue worker polling");
  }
  if (fileSet.has("servo_motor.py")) hardware.push("RPi.GPIO PWM servo control");
  if (readmeText.includes("MG996R")) hardware.push("MG996R servo integration");
  if (readmeText.includes("Raspberry Pi 4")) hardware.push("Raspberry Pi 4 target");

  return {
    frontend: [...new Set(frontend)],
    backend: [...new Set(backend)],
    hardware: [...new Set(hardware)],
  };
}

function buildArchitectureNotes(fileSet) {
  const notes = [];
  if (fileSet.has("app/page.tsx"))
    notes.push("UI writes command rows into `device_commands` through Supabase client.");
  if (fileSet.has("pi_worker.py"))
    notes.push(
      "Pi worker polls oldest `pending` command, claims atomically by status transition, executes servo script, then marks `completed` or `failed`."
    );
  if (fileSet.has("supabase.sql"))
    notes.push(
      "`supabase.sql` defines queue table, status indexes, and permissive MVP RLS policies for select/insert/update."
    );
  if (fileSet.has("servo_motor.py"))
    notes.push(
      "Servo script performs PWM sweep from home duty to target duty and returns home; supports per-bin duty overrides."
    );
  if (fileSet.has("pi-worker.service"))
    notes.push(
      "Systemd unit keeps worker process alive on boot with restart semantics and environment-based credentials."
    );
  return notes;
}

async function main() {
  const [, , rawSlug, repoArg] = process.argv;
  if (!rawSlug || rawSlug === "-h" || rawSlug === "--help") {
    usage();
    process.exit(rawSlug ? 0 : 1);
  }

  const slug = rawSlug.trim();
  const projectDir = path.join(CONTENT_ROOT, slug);
  const projectMdPath = path.join(projectDir, "project.md");
  if (!(await exists(projectMdPath))) {
    console.error(`Missing intake file: content/projects/${slug}/project.md`);
    process.exit(1);
  }

  const projectMd = await fs.readFile(projectMdPath, "utf8");
  const { frontmatter, body } = parseFrontmatter(projectMd);
  const sections = parseSections(body);
  const repoUrl = repoArg || firstUrl(sections.github || "") || frontmatter.githubUrl;
  if (!repoUrl) {
    console.error("No repo URL found. Pass it explicitly or add it to project.md ## GitHub.");
    process.exit(1);
  }

  const repoPath = path.join(CACHE_ROOT, slug);
  await cloneOrUpdate(repoUrl, repoPath);

  const defaultBranch = await runGit(["rev-parse", "--abbrev-ref", "HEAD"], repoPath);
  const commitCount = await runGit(["rev-list", "--count", "HEAD"], repoPath);
  const lastCommitDate = await runGit(["log", "-1", "--format=%ad", "--date=short"], repoPath);
  const recentCommitsRaw = await runGit(
    ["log", "-n", "12", "--date=short", "--pretty=format:%h|%ad|%s"],
    repoPath
  );
  const recentCommits = recentCommitsRaw
    ? recentCommitsRaw.split("\n").map((line) => {
        const [hash, date, subject] = line.split("|");
        return `- ${hash} (${date}): ${subject}`;
      })
    : [];

  const fileListRaw = await runGit(["ls-files"], repoPath);
  const fileList = fileListRaw ? fileListRaw.split("\n").filter(Boolean) : [];
  const fileSet = new Set(fileList);

  let pkgJson = null;
  if (fileSet.has("package.json")) {
    const pkgRaw = await fs.readFile(path.join(repoPath, "package.json"), "utf8");
    pkgJson = JSON.parse(pkgRaw);
  }

  const readmePath = fileSet.has("README.md") ? path.join(repoPath, "README.md") : null;
  const readmeText = readmePath ? await fs.readFile(readmePath, "utf8") : "";
  const readmePreview = readmeText
    .split("\n")
    .slice(0, 20)
    .filter((line) => !line.startsWith("#"))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const category = frontmatter.category || detectCategoryFromRepo(fileSet);
  const stack = detectStack(fileSet, pkgJson, readmeText);
  const architectureNotes = buildArchitectureNotes(fileSet);
  const technicalHighlights = [];

  if (fileSet.has("pi_worker.py"))
    technicalHighlights.push("Queue worker claims commands by status to reduce duplicate execution.");
  if (fileSet.has("servo_motor.py"))
    technicalHighlights.push("Servo control script sweeps gradually with configurable target duty.");
  if (fileSet.has("supabase.sql"))
    technicalHighlights.push("Schema includes queue-oriented indexes and explicit command lifecycle fields.");
  if (readmeText.includes("pending → running → completed"))
    technicalHighlights.push("Command lifecycle states are documented and surfaced for observability.");

  const debuggingEvidence = [];
  if (recentCommits.some((line) => /Tune Bin 3 servo travel/i.test(line))) {
    debuggingEvidence.push(
      "Bin 3 over-rotation was addressed with per-bin target duty override in worker + servo invocation."
    );
  }
  if (recentCommits.some((line) => /four-bin motor control/i.test(line))) {
    debuggingEvidence.push(
      "System evolved from single `dispense` action to `dispense_bin_1..4` command routing with GPIO mapping."
    );
  }
  if (recentCommits.some((line) => /responsive bin selection ui/i.test(line))) {
    debuggingEvidence.push("UI iteration added responsive bin cards and stronger device-state feedback.");
  }

  const implementationDetails = [
    fileSet.has("pi-worker.service")
      ? "Worker deployment uses systemd with restart-on-failure and explicit env variables."
      : null,
    fileSet.has(".env.local.example")
      ? "Environment file separates public client keys from worker runtime configuration."
      : null,
    pkgJson?.scripts?.dev ? `Frontend run command: \`npm run dev\`.` : null,
  ].filter(Boolean);

  const mediaFiles = fileList.filter((file) =>
    /\.(png|jpe?g|webp|gif|svg|mp4|mov|webm|m4v)$/i.test(file)
  );
  const mediaRecommendations = [
    "Set one clear hero: either a main demo clip or one clean system photo.",
    "Use diagrams for architecture section; keep screenshots in image gallery.",
    "Add at least one process photo or clip so iteration is visible.",
  ];

  const analysisLines = [
    "# PROJECT_ANALYSIS",
    "",
    "## Project overview",
    `- ${readmePreview || "Repository inspected and summarized from source files."}`,
    "- Goal: remote cloud command submission that triggers physical vending hardware.",
    "",
    "## Repository evidence",
    `- Repo URL: ${repoUrl}`,
    `- Default branch: ${defaultBranch}`,
    `- Approximate commit count: ${commitCount}`,
    `- Last active date: ${lastCommitDate}`,
    "",
    "## Technical stack (specific)",
    "### Frontend",
    ...(stack.frontend.length > 0 ? stack.frontend.map((item) => `- ${item}`) : ["- Not clearly detected"]),
    "",
    "### Backend / Infrastructure",
    ...(stack.backend.length > 0 ? stack.backend.map((item) => `- ${item}`) : ["- Not clearly detected"]),
    "",
    "### Hardware / Embedded (if applicable)",
    ...(stack.hardware.length > 0 ? stack.hardware.map((item) => `- ${item}`) : ["- Not detected"]),
    "",
    "## Architecture",
    ...architectureNotes.map((item) => `- ${item}`),
    "",
    "## Major components",
    ...(fileSet.has("app/page.tsx") ? ["- `app/page.tsx`: command UI and Supabase insert flow for bin-specific dispense actions."] : []),
    ...(fileSet.has("pi_worker.py")
      ? ["- `pi_worker.py`: queue consumer loop, command claiming, action parsing, command status updates."]
      : []),
    ...(fileSet.has("servo_motor.py")
      ? ["- `servo_motor.py`: GPIO PWM motor sweep with safe return to home duty cycle."]
      : []),
    ...(fileSet.has("supabase.sql")
      ? ["- `supabase.sql`: command queue table, indexes, RLS policies for MVP access model."]
      : []),
    ...(fileSet.has("pi-worker.service")
      ? ["- `pi-worker.service`: Linux service definition for persistent worker execution."]
      : []),
    "",
    "## Engineering decisions",
    "- Decision: queue-based cloud-to-device architecture through Supabase",
    "  - Why: avoids exposing Raspberry Pi directly to internet; keeps command history durable.",
    "  - Tradeoff: introduces polling delay and status reconciliation complexity.",
    "- Decision: status transitions (`pending`, `running`, `completed`, `failed`)",
    "  - Why: gives observability and recovery semantics for physical actions.",
    "  - Tradeoff: requires extra state management in worker and UI.",
    "- Decision: per-bin GPIO mapping + optional per-bin duty-cycle override",
    "  - Why: bins have different mechanical behavior; one motion profile was not enough.",
    "  - Tradeoff: calibration overhead increases as hardware lanes grow.",
    "",
    "## Debugging stories and iteration",
    ...(debuggingEvidence.length > 0
      ? debuggingEvidence.map((item) => `- ${item}`)
      : ["- No clear debugging commit evidence detected in sampled history."]),
    "",
    "## Implementation details worth surfacing",
    ...implementationDetails.map((item) => `- ${item}`),
    ...(technicalHighlights.length > 0 ? technicalHighlights.map((item) => `- ${item}`) : []),
    "",
    "## What makes this non-tutorial",
    "- Cross-domain integration: web UI, queue backend, worker process, and physical servo actuation in one loop.",
    "- Commit history shows calibration and architecture evolution, not just initial scaffolding.",
    "- Includes deployment/runtime concerns via service unit + env management.",
    "",
    "## Lessons learned",
    "- Mechanical variance forces software-level calibration hooks.",
    "- State transitions make hardware workflows debuggable when remote.",
    "- Cloud intermediaries simplify security for internet-controlled devices.",
    "",
    "## Future improvements",
    "- Add push-based updates instead of pure polling for faster UX.",
    "- Harden RLS and command auth model beyond MVP open policies.",
    "- Add sensor feedback to verify successful dispense actions.",
    "",
    "## Final outcome",
    "- Repository demonstrates a working command pipeline from browser action to bin-specific motor actuation with observable status lifecycle.",
    "",
    "## Media available in repository",
    ...(mediaFiles.length > 0
      ? mediaFiles.slice(0, 15).map((file) => `- ${file}`)
      : ["- No obvious media assets were detected in the repository tree."]),
    "",
    "## Project page recommendations",
    ...mediaRecommendations.map((item) => `- ${item}`),
    "",
    "## Recent commit evidence",
    ...recentCommits,
  ];

  const analysisPath = path.join(projectDir, "PROJECT_ANALYSIS.md");
  await fs.writeFile(analysisPath, `${analysisLines.join("\n")}\n`, "utf8");

  const suggestedTitle = frontmatter.title || slug;
  const suggestedOneLine = `Remote shoe dispenser control system with cloud queue + Raspberry Pi worker.`;
  const suggestedCategory = category;

  console.log(`Generated PROJECT_ANALYSIS.md for ${slug}`);
  console.log(`Path: content/projects/${slug}/PROJECT_ANALYSIS.md`);
  console.log("");
  console.log("Suggested intake updates:");
  console.log(`- title: ${suggestedTitle}`);
  console.log(`- category: ${suggestedCategory}`);
  console.log(`- one-line summary: ${suggestedOneLine}`);
  console.log("");
  console.log("Next:");
  console.log("1) Review PROJECT_ANALYSIS.md");
  console.log("2) Refine project.md summary/links if needed");
  console.log("3) Run npm run projects:intake:sync");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
