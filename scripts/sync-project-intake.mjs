#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");
const PUBLIC_INTAKE_ROOT = path.join(ROOT, "public", "projects", "intake");
const OUTPUT_JSON = path.join(ROOT, "src", "data", "projects.generated.json");

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
    ...listFromSection(section(sections, "Technical highlights", "What I built")),
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
    overview: oneLine(
      collapseListToParagraph(whatBuiltList) ||
        whatBuilt ||
        summary ||
        analysisOverview.join(" "),
      "Build summary coming soon."
    ),
    techStack:
      trimList(techStack, 14).length > 0
        ? trimList(techStack, 14)
        : parseCsv(frontmatter.techStack),
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
