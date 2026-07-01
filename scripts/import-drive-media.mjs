#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content", "projects");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm", ".m4v", ".MOV"]);
const METADATA_FILE = "media-metadata.json";

function usage() {
  console.log("Usage:");
  console.log(
    "  npm run projects:intake:import-drive -- <project-slug> <downloaded-folder-path>"
  );
  console.log("");
  console.log("Example:");
  console.log(
    "  npm run projects:intake:import-drive -- vend-a-shoe ~/Downloads/vend-a-shoe-drive"
  );
}

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

function pickBucket(fileName, ext) {
  const lower = fileName.toLowerCase();
  if (VIDEO_EXTS.has(ext)) return "videos";
  if (!IMAGE_EXTS.has(ext)) return null;

  if (
    lower.includes("thumb") ||
    lower.includes("cover") ||
    lower.includes("hero") ||
    lower.includes("thumbnail")
  ) {
    return "thumbnails";
  }
  if (
    lower.includes("diagram") ||
    lower.includes("arch") ||
    lower.includes("schematic") ||
    lower.includes("flow")
  ) {
    return "diagrams";
  }
  return "images";
}

async function walkFiles(targetDir) {
  const stack = [targetDir];
  const files = [];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  return files;
}

async function loadManifest(manifestPath) {
  if (!(await exists(manifestPath))) {
    return { thumbnail: "", hero: "", items: [] };
  }
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    return { thumbnail: parsed.thumbnail || "", hero: parsed.hero || "", items };
  } catch {
    return { thumbnail: "", hero: "", items: [] };
  }
}

function toTitleFromFileName(fileName) {
  return fileName
    .replace(path.extname(fileName), "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMetadataRecord(record) {
  if (!record || typeof record !== "object") return null;
  return {
    title: typeof record.title === "string" ? record.title.trim() : undefined,
    caption: typeof record.caption === "string" ? record.caption.trim() : undefined,
    description: typeof record.description === "string" ? record.description.trim() : undefined,
    alt: typeof record.alt === "string" ? record.alt.trim() : undefined,
    featured: typeof record.featured === "boolean" ? record.featured : undefined,
    priority: typeof record.priority === "number" ? record.priority : undefined,
    type: typeof record.type === "string" ? record.type.trim() : undefined,
  };
}

async function loadDriveMetadata(sourceDir) {
  const metadataPath = path.join(sourceDir, METADATA_FILE);
  if (!(await exists(metadataPath))) return new Map();

  try {
    const parsed = JSON.parse(await fs.readFile(metadataPath, "utf8"));
    const map = new Map();

    if (Array.isArray(parsed)) {
      for (const row of parsed) {
        if (!row || typeof row !== "object" || typeof row.file !== "string") continue;
        const key = path.basename(row.file).toLowerCase();
        const normalized = normalizeMetadataRecord(row);
        if (normalized) map.set(key, normalized);
      }
      return map;
    }

    if (parsed && typeof parsed === "object") {
      for (const [fileName, record] of Object.entries(parsed)) {
        const key = path.basename(fileName).toLowerCase();
        const normalized = normalizeMetadataRecord(record);
        if (normalized) map.set(key, normalized);
      }
    }

    return map;
  } catch {
    return new Map();
  }
}

async function main() {
  const [, , slugRaw, sourceRaw] = process.argv;
  if (slugRaw === "-h" || slugRaw === "--help") {
    usage();
    process.exit(0);
  }
  if (!slugRaw || !sourceRaw) {
    usage();
    process.exit(1);
  }

  const slug = slugRaw.trim();
  const sourceDir = path.resolve(sourceRaw);
  const projectDir = path.join(CONTENT_ROOT, slug);
  const mediaRoot = path.join(projectDir, "media");

  if (!(await exists(projectDir))) {
    console.error(`Missing intake folder: content/projects/${slug}`);
    console.error("Run: npm run projects:intake:new -- <slug> \"Title\"");
    process.exit(1);
  }
  if (!(await exists(sourceDir))) {
    console.error(`Source folder not found: ${sourceDir}`);
    process.exit(1);
  }

  await ensureDir(path.join(mediaRoot, "images"));
  await ensureDir(path.join(mediaRoot, "videos"));
  await ensureDir(path.join(mediaRoot, "diagrams"));
  await ensureDir(path.join(mediaRoot, "thumbnails"));

  const files = await walkFiles(sourceDir);
  const driveMetadata = await loadDriveMetadata(sourceDir);
  const copied = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const bucket = pickBucket(fileName, ext);
    if (!bucket) continue;

    const targetPath = path.join(mediaRoot, bucket, fileName);
    await fs.copyFile(filePath, targetPath);
    copied.push({ bucket, fileName, relative: `${bucket}/${fileName}` });
  }

  const manifestPath = path.join(mediaRoot, "media.json");
  const manifest = await loadManifest(manifestPath);
  const existing = new Map(
    manifest.items.map((item, index) => [`${item.src}|${item.type || "image"}`, index])
  );

  for (const item of copied) {
    const metadata = driveMetadata.get(item.fileName.toLowerCase());
    const type =
      metadata?.type ||
      (item.bucket === "videos"
        ? "video"
        : item.bucket === "diagrams"
          ? "diagram"
          : item.bucket === "thumbnails"
            ? "image"
            : "image");
    const src = item.relative;
    const key = `${src}|${type}`;
    const inferredTitle = toTitleFromFileName(item.fileName);
    const title = metadata?.title || inferredTitle;
    const caption = metadata?.caption || title;
    const nextItem = {
      src,
      type,
      alt: metadata?.alt || `${slug} ${title}`,
      title,
      caption,
      description: metadata?.description,
      featured: metadata?.featured ?? item.bucket === "thumbnails",
      priority:
        metadata?.priority ??
        (item.bucket === "thumbnails" ? 9 : item.bucket === "videos" ? 8 : 4),
    };

    const existingIndex = existing.get(key);
    if (typeof existingIndex === "number") {
      manifest.items[existingIndex] = {
        ...manifest.items[existingIndex],
        ...nextItem,
      };
      continue;
    }

    manifest.items.push(nextItem);
  }

  if (!manifest.thumbnail) {
    const thumbnail = copied.find((item) => item.bucket === "thumbnails");
    if (thumbnail) manifest.thumbnail = thumbnail.relative;
  }
  if (!manifest.hero) {
    const heroVideo = copied.find((item) => item.bucket === "videos");
    const heroImage = copied.find((item) => item.bucket === "images");
    manifest.hero = (heroVideo || heroImage)?.relative || manifest.hero;
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Imported ${copied.length} media file(s) into content/projects/${slug}/media`);
  console.log(`Updated media manifest: content/projects/${slug}/media/media.json`);
  if (driveMetadata.size > 0) {
    console.log(`Applied metadata from ${METADATA_FILE} (${driveMetadata.size} entries).`);
  } else {
    console.log(`Tip: add ${METADATA_FILE} in the Drive export folder for titles/captions.`);
  }
  console.log("Next: run npm run projects:intake:sync");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
