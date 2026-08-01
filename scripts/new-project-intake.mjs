#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");
const TEMPLATE_ROOT = path.join(CONTENT_ROOT, "_template");

function usage() {
  console.log("Usage:");
  console.log("  npm run projects:intake:new -- <project-slug> [optional title]");
  console.log("");
  console.log("Example:");
  console.log("  npm run projects:intake:new -- vend-a-shoe \"Vend-A-Shoe\"");
}

function toTitleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((token) => token[0].toUpperCase() + token.slice(1))
    .join(" ");
}

function sanitizeSlug(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTemplate(relativePath) {
  return fs.readFile(path.join(TEMPLATE_ROOT, relativePath), "utf8");
}

async function writeFileIfMissing(filePath, content) {
  if (await exists(filePath)) return false;
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
  return true;
}

async function touchFile(filePath) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, "", "utf8");
}

async function main() {
  const [, , rawSlug, ...titleParts] = process.argv;
  if (!rawSlug || rawSlug === "--help" || rawSlug === "-h") {
    usage();
    process.exit(rawSlug ? 0 : 1);
  }

  const slug = sanitizeSlug(rawSlug);
  if (!slug) {
    console.error("Invalid slug. Use letters, numbers, and hyphens.");
    process.exit(1);
  }

  const titleFromArgs = titleParts.join(" ").trim();
  const title = titleFromArgs || toTitleCase(slug);
  const projectDir = path.join(CONTENT_ROOT, slug);

  if (await exists(projectDir)) {
    console.error(`Project intake folder already exists: content/projects/${slug}`);
    console.error("Use a new slug or remove the existing folder.");
    process.exit(1);
  }

  await ensureDir(projectDir);
  await ensureDir(path.join(projectDir, "media", "images"));
  await ensureDir(path.join(projectDir, "media", "videos"));
  await ensureDir(path.join(projectDir, "media", "diagrams"));
  await ensureDir(path.join(projectDir, "notes"));

  await touchFile(path.join(projectDir, "media", "images", ".gitkeep"));
  await touchFile(path.join(projectDir, "media", "videos", ".gitkeep"));
  await touchFile(path.join(projectDir, "media", "diagrams", ".gitkeep"));
  await ensureDir(path.join(projectDir, "media", "thumbnails"));
  await touchFile(path.join(projectDir, "media", "thumbnails", ".gitkeep"));

  const projectTemplate = await readTemplate("project.md");
  const projectMarkdown = projectTemplate
    .replace('title: "Project Name"', `title: "${title.replace(/"/g, '\\"')}"`)
    .replace('slug: "project-slug"', `slug: "${slug}"`)
    .replace("# Project Intake Template", `# ${title} Intake`);

  await writeFileIfMissing(path.join(projectDir, "project.md"), projectMarkdown);
  await writeFileIfMissing(
    path.join(projectDir, "CASE_STUDY.md"),
    await readTemplate("CASE_STUDY.md")
  );
  await writeFileIfMissing(
    path.join(projectDir, "media", "media.json"),
    await readTemplate("media/media.json")
  );
  await writeFileIfMissing(
    path.join(projectDir, "PROJECT_ANALYSIS.md"),
    await readTemplate("PROJECT_ANALYSIS.md")
  );
  await writeFileIfMissing(
    path.join(projectDir, "notes", "build-log.md"),
    await readTemplate("notes/build-log.md")
  );
  await writeFileIfMissing(
    path.join(projectDir, "notes", "debugging.md"),
    await readTemplate("notes/debugging.md")
  );
  await writeFileIfMissing(
    path.join(projectDir, "notes", "links.md"),
    await readTemplate("notes/links.md")
  );

  console.log(`Created intake project scaffold at content/projects/${slug}`);
  console.log("");
  console.log("Next steps:");
  console.log(`1) Fill content/projects/${slug}/project.md (hero / executive summary)`);
  console.log(`2) Fill content/projects/${slug}/CASE_STUDY.md (engineering narrative)`);
  console.log(
    `3) Drop media into content/projects/${slug}/media/{images,videos,diagrams,thumbnails}`
  );
  console.log(
    `   or import Drive export: npm run projects:intake:import-drive -- ${slug} <folder>`
  );
  console.log(`4) Set hero in content/projects/${slug}/media/media.json (prefer .mp4)`);
  console.log(`5) Run: npm run projects:intake:sync`);
  console.log(
    `6) Optional: ask the agent to promote CASE_STUDY.md into the full case-study layout`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
