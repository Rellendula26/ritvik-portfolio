#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");
const PUBLIC_PROJECTS_ROOT = path.join(ROOT, "public", "projects");
const PUBLIC_INTAKE_ROOT = path.join(PUBLIC_PROJECTS_ROOT, "intake");
const OUTPUT_JSON = path.join(ROOT, "src", "data", "projects.generated.json");
const CASE_STUDY_TS = path.join(ROOT, "src", "data", "engineering-case-study.ts");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".m4v", ".MOV"]);
const PLACEHOLDER_MEDIA = "/projects/placeholder-media.svg";

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

/** iPhone HEIC often gets renamed to .jpg; browsers cannot decode that. */
async function looksLikeHeic(filePath) {
  try {
    const fh = await fs.open(filePath, "r");
    const buf = Buffer.alloc(64);
    await fh.read(buf, 0, 64, 0);
    await fh.close();
    const head = buf.toString("latin1");
    return (
      head.includes("ftyp") &&
      (head.includes("heic") || head.includes("heif") || head.includes("mif1"))
    );
  } catch {
    return false;
  }
}

async function convertHeicNamedJpeg(filePath) {
  if (!(await looksLikeHeic(filePath))) return false;
  const tmp = `${filePath}.real.jpg`;
  try {
    await execFileAsync("sips", ["-s", "format", "jpeg", filePath, "--out", tmp]);
    const stat = await fs.stat(tmp);
    // sips can "succeed" with an EXIF-only stub (~3–4KB) when HEIC decode fails.
    if (stat.size < 50_000) {
      await fs.unlink(tmp);
      console.warn(
        `HEIC-as-jpg convert produced a tiny stub (${stat.size} bytes); left original in place: ${path.relative(ROOT, filePath)}`
      );
      console.warn("Re-export as a real JPEG from Photos, or run sips outside a restricted environment.");
      return false;
    }
    await fs.rename(tmp, filePath);
    console.warn(`Converted HEIC-as-jpg -> real JPEG: ${path.relative(ROOT, filePath)}`);
    return true;
  } catch (error) {
    try {
      await fs.unlink(tmp);
    } catch {
      /* ignore */
    }
    console.warn(
      `HEIC-as-jpg detected but could not convert (macOS sips): ${path.relative(ROOT, filePath)}`
    );
    console.warn(String(error?.message || error));
    return false;
  }
}

async function normalizeJpegDir(dirPath) {
  if (!(await exists(dirPath))) return;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg") continue;
    await convertHeicNamedJpeg(path.join(dirPath, entry.name));
  }
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return { frontmatter: {}, body: markdown };
  }

  const closing = markdown.indexOf("\n---\n", 4);
  if (closing === -1) {
    return { frontmatter: {}, body: markdown };
  }

  const raw = markdown.slice(4, closing).trim();
  const body = markdown.slice(closing + 5);
  const frontmatter = {};

  function stripOuterQuotes(text) {
    const value = text.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      return value.slice(1, -1).trim();
    }
    if (
      (value.startsWith('\\"') && value.endsWith('\\"')) ||
      (value.startsWith("\\'") && value.endsWith("\\'"))
    ) {
      return value.slice(2, -2).trim();
    }
    return value;
  }

  raw.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).replace(/\r/g, "").trim();
    value = stripOuterQuotes(stripOuterQuotes(value));
    if (!key) return;
    frontmatter[key] = value;
  });

  return { frontmatter, body };
}

function parseSections(markdownBody) {
  const sections = {};
  const lines = markdownBody.split("\n");
  let h1 = "";
  let currentHeading = "";
  let buffer = [];

  function flush() {
    if (!currentHeading) return;
    sections[currentHeading.toLowerCase()] = buffer.join("\n").trim();
    buffer = [];
  }

  for (const line of lines) {
    if (!h1 && line.startsWith("# ")) {
      h1 = line.replace(/^#\s+/, "").trim();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      currentHeading = line.replace(/^##\s+/, "").trim();
      continue;
    }
    if (currentHeading) buffer.push(line);
  }
  flush();

  return { h1, sections };
}

function listFromSection(content) {
  if (!content) return [];
  const bullets = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- ") || line.startsWith("* "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);

  if (bullets.length > 0) return bullets;

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function firstUrl(content) {
  if (!content) return undefined;
  const match = content.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : undefined;
}

function oneLine(content, fallback = "") {
  if (!content) return fallback;
  const compact = content
    .replace(/\n+/g, " ")
    .replace(/(?:^|\s)[-*]\s+/g, " ")
    .trim();
  return compact || fallback;
}

function collapseListToParagraph(items) {
  if (!items || items.length === 0) return "";
  return items.map((item) => item.replace(/^[-*]\s+/, "").trim()).join("; ");
}

function trimList(items, max = 8) {
  return [...new Set((items || []).filter(Boolean))].slice(0, max);
}

async function copyMediaBucket(sourceDir, outputDir, slug, bucketName) {
  if (!(await exists(sourceDir))) return [];
  await ensureDir(outputDir);

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const copied = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (bucketName === "videos") {
      if (!VIDEO_EXTS.has(ext)) continue;
    } else if (!IMAGE_EXTS.has(ext)) {
      continue;
    }

    const src = path.join(sourceDir, entry.name);
    const dest = path.join(outputDir, entry.name);
    await fs.copyFile(src, dest);
    copied.push(`/projects/intake/${slug}/${bucketName}/${entry.name}`);
  }

  return copied;
}

/**
 * Case-study pages reference /projects/<slug>/<filename>.
 * Mirror intake media there (flat) so hero/gallery and case study stay in sync.
 * Never deletes existing files in the destination (manual drops stay put).
 */
async function mirrorCanonicalProjectMedia(slug, projectDir) {
  const destRoot = path.join(PUBLIC_PROJECTS_ROOT, slug);
  await ensureDir(destRoot);

  const buckets = ["images", "videos", "diagrams", "thumbnails"];
  let mirrored = 0;

  for (const bucket of buckets) {
    const sourceDir = path.join(projectDir, "media", bucket);
    if (!(await exists(sourceDir))) continue;
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || entry.name.startsWith(".")) continue;
      const ext = path.extname(entry.name).toLowerCase();
      // Case-study public folder is browser-facing; skip camera dumps browsers choke on.
      const allowed =
        IMAGE_EXTS.has(ext) || ext === ".mp4" || ext === ".webm" || ext === ".m4v";
      if (!allowed) continue;
      await fs.copyFile(path.join(sourceDir, entry.name), path.join(destRoot, entry.name));
      mirrored += 1;
    }
  }

  return mirrored;
}

async function assertCaseStudyMediaExists() {
  if (!(await exists(CASE_STUDY_TS))) return;
  const raw = await fs.readFile(CASE_STUDY_TS, "utf8");
  const paths = [...raw.matchAll(/src:\s*"(\/projects\/[^"]+)"/g)].map((m) => m[1]);
  const missing = [];
  for (const publicPath of paths) {
    const diskPath = path.join(ROOT, "public", publicPath.replace(/^\//, ""));
    if (!(await exists(diskPath))) missing.push(publicPath);
  }
  if (missing.length > 0) {
    console.warn("\nCase study media missing on disk (black panels until fixed):");
    for (const item of missing) console.warn(`  - ${item}`);
    console.warn("Put files under public/projects/<slug>/ or content/.../media/ then re-sync.\n");
  }
}

function mediaTypeToKind(mediaType) {
  if (mediaType === "video" || mediaType === "demo") return "video";
  return "image";
}

function normalizeMediaPath(src, slug) {
  if (!src) return "";
  if (src.startsWith("/")) return src;
  return `/projects/intake/${slug}/${src.replace(/^\.?\//, "")}`;
}

async function readMediaManifest(projectDir, slug) {
  const manifestPath = path.join(projectDir, "media", "media.json");
  if (!(await exists(manifestPath))) return { items: [] };
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.items) ? parsed.items : [];
    return {
      thumbnail: normalizeMediaPath(parsed.thumbnail || "", slug),
      hero: normalizeMediaPath(parsed.hero || "", slug),
      items: items.map((item) => ({
        src: normalizeMediaPath(item.src || "", slug),
        type: item.type || "image",
        alt: item.alt || `${slug} media`,
        title: item.title,
        caption: item.caption,
        description: item.description,
        featured: Boolean(item.featured),
        priority: typeof item.priority === "number" ? item.priority : undefined,
      })),
    };
  } catch {
    return { items: [] };
  }
}

function section(sections, ...names) {
  for (const name of names) {
    const value = sections[name.toLowerCase()];
    if (value) return value;
  }
  return "";
}

function parseCsv(value) {
  return (value || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

async function buildProjectFromFolder(slug, index) {
  const projectDir = path.join(CONTENT_ROOT, slug);
  const markdownPath = path.join(projectDir, "project.md");
  if (!(await exists(markdownPath))) return null;

  const raw = await fs.readFile(markdownPath, "utf8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const { h1, sections } = parseSections(body);
  const analysisPath = path.join(projectDir, "PROJECT_ANALYSIS.md");
  const analysisRaw = (await exists(analysisPath)) ? await fs.readFile(analysisPath, "utf8") : "";
  const { sections: analysisSections } = analysisRaw
    ? parseSections(analysisRaw)
    : { sections: {} };

  const publicProjectDir = path.join(PUBLIC_INTAKE_ROOT, slug);
  const mediaManifest = await readMediaManifest(projectDir, slug);
  const images = await copyMediaBucket(
    path.join(projectDir, "media", "images"),
    path.join(publicProjectDir, "images"),
    slug,
    "images"
  );
  const videos = await copyMediaBucket(
    path.join(projectDir, "media", "videos"),
    path.join(publicProjectDir, "videos"),
    slug,
    "videos"
  );
  const diagrams = await copyMediaBucket(
    path.join(projectDir, "media", "diagrams"),
    path.join(publicProjectDir, "diagrams"),
    slug,
    "diagrams"
  );
  const thumbnails = await copyMediaBucket(
    path.join(projectDir, "media", "thumbnails"),
    path.join(publicProjectDir, "thumbnails"),
    slug,
    "thumbnails"
  );
  await mirrorCanonicalProjectMedia(slug, projectDir);
  await normalizeJpegDir(path.join(projectDir, "media", "images"));
  await normalizeJpegDir(path.join(projectDir, "media", "thumbnails"));
  await normalizeJpegDir(path.join(projectDir, "media", "diagrams"));
  await normalizeJpegDir(path.join(publicProjectDir, "images"));
  await normalizeJpegDir(path.join(publicProjectDir, "thumbnails"));
  await normalizeJpegDir(path.join(PUBLIC_PROJECTS_ROOT, slug));

  const summary = section(sections, "Summary");
  const whatBuilt = section(sections, "What I built");
  const analysisOverview = listFromSection(section(analysisSections, "Project overview"));
  const analysisStackFrontend = listFromSection(
    section(analysisSections, "Technical stack (specific)", "Frontend")
  );
  const analysisStackBackend = listFromSection(
    section(analysisSections, "Backend / Infrastructure")
  );
  const analysisStackHardware = listFromSection(
    section(analysisSections, "Hardware / Embedded (if applicable)")
  );
  const analysisArchitecture = listFromSection(section(analysisSections, "Architecture"));
  const analysisDecisions = listFromSection(section(analysisSections, "Engineering decisions"));
  const analysisDebugging = listFromSection(
    section(analysisSections, "Debugging stories and iteration")
  );
  const analysisLessons = listFromSection(section(analysisSections, "Lessons learned"));
  const analysisFuture = listFromSection(section(analysisSections, "Future improvements"));
  const analysisFinalOutcome = oneLine(section(analysisSections, "Final outcome"));
  const analysisRepoEvidence = listFromSection(section(analysisSections, "Repository evidence"));
  const analysisImplementation = listFromSection(
    section(analysisSections, "Implementation details worth surfacing")
  );
  const analysisHighlights = listFromSection(
    section(analysisSections, "Major components", "What makes this non-tutorial")
  );
  const github = firstUrl(section(sections, "GitHub"));
  const demo = firstUrl(section(sections, "Demo"));
  const drive = firstUrl(section(sections, "Google Drive Folder"));
  const techStack = [
    ...listFromSection(section(sections, "Tech stack")),
    ...analysisStackFrontend,
    ...analysisStackBackend,
    ...analysisStackHardware,
  ];
  const highlights = [
    ...listFromSection(section(sections, "Technical highlights")),
    ...analysisHighlights,
  ];
  const buildProcess = [
    ...listFromSection(section(sections, "Build process")),
    ...analysisDecisions,
    ...analysisImplementation,
  ];
  const architecture = [
    ...listFromSection(section(sections, "Architecture")),
    ...analysisArchitecture,
  ];
  const debugging = [
    ...listFromSection(section(sections, "Bugs / debugging", "Debugging notes")),
    ...analysisDebugging,
  ];
  const challenges = listFromSection(section(sections, "Technical challenges"));
  const lessons = [
    ...listFromSection(section(sections, "Lessons learned")),
    ...analysisLessons,
  ];
  const technicalNotesFromAnalysis = [
    ...analysisRepoEvidence,
    ...analysisFuture,
  ];
  const finalOutcome = oneLine(section(sections, "Final outcome"));
  const whatBuiltList = listFromSection(section(sections, "What I built"));
  const whatBuiltLooksLikeBullets = /^\s*[-*]\s+/m.test(whatBuilt || "");
  const overviewSource = whatBuiltLooksLikeBullets
    ? collapseListToParagraph(whatBuiltList)
    : (whatBuilt || "").trim() ||
      collapseListToParagraph(whatBuiltList) ||
      summary ||
      analysisOverview.join(" ");

  const thumbnail =
    frontmatter.thumbnail ||
    mediaManifest.thumbnail ||
    thumbnails[0] ||
    images[0] ||
    diagrams[0] ||
    PLACEHOLDER_MEDIA;

  const media = [];
  if (mediaManifest.hero) {
    const heroMeta = mediaManifest.items.find((item) => item.src === mediaManifest.hero);
    const kind = mediaTypeToKind(heroMeta?.type ?? "image");
    media.push({
      kind,
      src: mediaManifest.hero,
      alt: heroMeta?.alt || `${h1 || slug} hero`,
      title: heroMeta?.title,
      label: heroMeta?.title || heroMeta?.caption || "Hero",
      caption: heroMeta?.caption,
      description: heroMeta?.description,
      featured: true,
      priority: 100,
      mediaType: heroMeta?.type || (kind === "video" ? "demo" : "image"),
      ...(kind === "video" ? { poster: thumbnail } : {}),
    });
  } else if (videos[0]) {
    media.push({
      kind: "video",
      src: videos[0],
      alt: `${h1 || slug} demo`,
      label: "Demo",
      poster: thumbnail,
      caption: "Demo",
      featured: true,
      priority: 50,
      mediaType: "demo",
    });
  }
  if (diagrams[0]) {
    media.push({
      kind: "image",
      src: diagrams[0],
      alt: `${h1 || slug} architecture diagram`,
      label: "Architecture",
      caption: "Architecture diagram",
      mediaType: "diagram",
    });
  }
  if (images[0]) {
    media.push({
      kind: "image",
      src: images[0],
      alt: `${h1 || slug} preview`,
      label: "Preview",
      caption: "Preview image",
      mediaType: "image",
    });
  }
  for (const item of mediaManifest.items) {
    if (!item.src || media.some((existing) => "src" in existing && existing.src === item.src)) {
      continue;
    }
    const kind = mediaTypeToKind(item.type);
    media.push({
      kind,
      src: item.src,
      alt: item.alt,
      title: item.title,
      label: item.title || item.caption || item.type,
      caption: item.caption,
      description: item.description,
      featured: item.featured,
      priority: item.priority,
      mediaType: item.type,
      ...(kind === "video" ? { poster: thumbnail } : {}),
    });
  }

  return {
    id: frontmatter.id || `INT-${String(index + 1).padStart(2, "0")}`,
    title: frontmatter.title || h1 || slug,
    slug: frontmatter.slug || slug,
    featured: frontmatter.featured === "true",
    category: frontmatter.category || "fullstack",
    status: frontmatter.status || "iterating",
    oneLine: oneLine(summary, analysisOverview[0] || `${h1 || slug} project`),
    overview: oneLine(overviewSource, "Build summary coming soon."),
    techStack:
      trimList(techStack, 14).length > 0
        ? trimList(techStack, 14)
        : parseCsv(frontmatter.techStack),
    disciplines: parseCsv(frontmatter.disciplines),
    githubUrl: github || frontmatter.githubUrl,
    liveUrl: demo || frontmatter.liveUrl,
    demoVideoUrl:
      mediaManifest.hero &&
      (mediaManifest.items.find((item) => item.src === mediaManifest.hero)?.type === "video" ||
        mediaManifest.items.find((item) => item.src === mediaManifest.hero)?.type === "demo")
        ? mediaManifest.hero
        : videos[0],
    thumbnail,
    images: [...images, ...diagrams],
    imageGallery: images,
    videoGallery: videos,
    architectureImages: diagrams,
    date: frontmatter.date || "In progress",
    buildStage: frontmatter.buildStage || "Intake draft",
    keyHighlights:
      trimList(highlights, 8).length > 0
        ? trimList(highlights, 8)
        : ["Highlight bullets pending intake refinement."],
    architecture:
      trimList(architecture, 8).length > 0
        ? trimList(architecture, 8)
        : ["Architecture notes pending from intake folder."],
    challenges:
      trimList(challenges, 6).length > 0
        ? trimList(challenges, 6)
        : ["Challenges pending; add details in project.md."],
    lessonsLearned:
      trimList(lessons, 6).length > 0
        ? trimList(lessons, 6)
        : ["Lessons pending; update intake notes."],
    technicalNotes:
      trimList([...buildProcess, ...technicalNotesFromAnalysis], 10).length > 0
        ? trimList([...buildProcess, ...technicalNotesFromAnalysis], 10)
        : ["Build notes pending."],
    nextImprovements: trimList(analysisFuture, 6),
    buildNotes: trimList(buildProcess, 8),
    debuggingNotes: trimList(debugging, 8),
    driveFolderUrl: drive,
    finalOutcome: finalOutcome || analysisFinalOutcome || undefined,
    intakeSourcePath: `content/projects/${slug}`,
    localMediaImported:
      images.length > 0 ||
      videos.length > 0 ||
      diagrams.length > 0 ||
      thumbnails.length > 0 ||
      mediaManifest.items.length > 0,
    media,
    tags:
      parseCsv(frontmatter.tags).length > 0
        ? parseCsv(frontmatter.tags)
        : [frontmatter.category || "fullstack", "intake"],
    signal: frontmatter.signal || "Build",
  };
}

async function main() {
  await ensureDir(path.dirname(OUTPUT_JSON));
  await ensureDir(PUBLIC_INTAKE_ROOT);
  await ensureDir(CONTENT_ROOT);

  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("_"))
    .sort();

  const projects = [];
  for (let i = 0; i < folders.length; i += 1) {
    const project = await buildProjectFromFolder(folders[i], i);
    if (project) projects.push(project);
  }

  await fs.writeFile(OUTPUT_JSON, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  console.log(`Synced ${projects.length} intake project(s) -> ${path.relative(ROOT, OUTPUT_JSON)}`);
  await assertCaseStudyMediaExists();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
