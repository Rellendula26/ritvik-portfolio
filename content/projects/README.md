# Project Intake Workflow

Use this folder as the single intake zone for new projects. Fill the template,
drop media in, then either run the sync commands yourself or hand the whole
`<slug>/` folder to the agent.

Prefer this over a PDF — structured markdown + files is what the site and agent
can actually turn into a page without retyping.

**Writing bar for filled templates:** treat your markdown as reference, not scripture.
The page should stay concise and specific. Prefer concrete constraints, numbers, and
failure modes over exhaustive section-filling. Leave blank what you do not know.

## Folder shape

```txt
content/projects/
  <project-slug>/
    project.md              # Executive summary (hero) fields
    CASE_STUDY.md           # Full engineering narrative (optional but preferred)
    PROJECT_ANALYSIS.md     # Repo analysis notes (optional)
    media/
      images/
      videos/               # Prefer .mp4 for web (not .MOV)
      diagrams/
      thumbnails/
      media.json            # Marks hero/demo + captions
    notes/
      build-log.md
      debugging.md
      links.md
```

## Scaffold a new project

```bash
npm run projects:intake:new -- <slug> "Project Title"
```

Example:

```bash
npm run projects:intake:new -- drift-balancer "Drift"
```

Then fill:

1. `project.md` — title, one-liner, stack, GitHub, demo link, highlights
2. `CASE_STUDY.md` — motivation → system → breakdown → decisions → evolution → results → reflection
3. Drop media into `media/videos`, `media/images`, `media/diagrams`
4. Edit `media/media.json` so `hero` points at the cover demo (usually a `.mp4`)

## Executive summary / project card copy

Before filling `project.md`, read [`EXECUTIVE_SUMMARY.md`](./EXECUTIVE_SUMMARY.md).
It covers one-liner vs overview length, engineering highlights, metrics, Focus/Build stage/Disciplines wording, and tech pills.

## Media rules (important)

**Supported extensions**

| Kind | Use these |
|------|-----------|
| Photos / diagrams | `.jpg` `.jpeg` `.png` `.webp` `.svg` |
| Videos | `.mp4` (preferred) `.webm` `.m4v` |

Do **not** drop `.heic` / `.HEIC` or raw camera `.MOV` for page media; browsers will not show HEIC, and MOV is flaky. Convert photos to real `.jpg`/`.png` and clips to `.mp4`.

**Common failure:** exporting from iPhone Photos as “JPG” that is still HEIC bytes with a `.jpg` name. Browsers fail, and a bad convert can leave a ~3–4KB empty JPEG that looks like a faded/missing image. PNG does not fix that.

Prefer exporting **true JPEG** (or PNG) from Photos / Preview. `npm run projects:intake:sync` tries to convert HEIC-as-jpg on macOS via `sips` and refuses tiny stub outputs.

**Where files go for case-study pages**

Put project photos and videos in:

`public/projects/<slug>/`

Example: `public/projects/vend-a-shoe/seconddemo.mp4`

Case study content should reference that exact path (`/projects/vend-a-shoe/seconddemo.mp4`).
Do not delete files from this folder after wiring; that is what caused black media panels before.

Intake sync copies media into:

1. `public/projects/intake/<slug>/...` (hero card pipeline)
2. `public/projects/<slug>/` (flat copy for case-study pages)

So drop files in `content/projects/<slug>/media/{images,videos,diagrams,thumbnails}/`, mark the hero in `media.json`, then run `npm run projects:intake:sync`. Sync also warns if any case-study `src` path is missing on disk.

| Do | Don't |
|----|-------|
| Use compressed `.mp4` for hero/demo | Use raw `.MOV` as the hero |
| Name files clearly (`seconddemo.mp4`, `coverCAD.jpg`) | Leave only `IMG_5123.MOV` unmarked as hero |
| Set `hero` + `type: "demo"` in `media.json` | Assume the newest file becomes the hero |
| Keep hero clips under ~40MB when possible | Delete files from `public/projects/<slug>/` after the page references them |

Mark the cover video like this in `media/media.json`:

```json
{
  "hero": "videos/hero-demo.mp4",
  "items": [
    {
      "src": "videos/hero-demo.mp4",
      "type": "demo",
      "alt": "Short description of what the clip shows",
      "caption": "Hero demo",
      "featured": true,
      "priority": 20
    }
  ]
}
```

## Commands

```bash
# 1) Create folder from template
npm run projects:intake:new -- <slug> "Title"

# 2) Optional: import a downloaded Drive export into media/
npm run projects:intake:import-drive -- <slug> ~/Downloads/<drive-folder>

# 3) Optional: analyze the GitHub repo into PROJECT_ANALYSIS.md
npm run projects:intake:analyze -- <slug> https://github.com/you/repo

# 4) Sync → public assets + src/data/projects.generated.json
npm run projects:intake:sync
```

After sync, the project appears on `/projects` and `/projects/<slug>`.

If you also filled `CASE_STUDY.md`, tell the agent to promote it into an
`EngineeringCaseStudy` so the page uses the full case-study layout (not just
the legacy insight cards).

## Handing work to the agent

Best handoff:

> “Intake ready for `<slug>`. Folder is `content/projects/<slug>/`.
> Hero video is `media/videos/<file>.mp4`. Please sync and wire the case study.”

That is enough. You do not need a PDF.

## Drive import details

```bash
npm run projects:intake:import-drive -- <project-slug> <downloaded-drive-folder-path>
```

Example:

```bash
npm run projects:intake:import-drive -- vend-a-shoe ~/Downloads/vend-a-shoe-drive
```

This command:

1. Copies local exported Drive assets into `media/images`, `media/videos`, `media/diagrams`, `media/thumbnails`
2. Updates `media/media.json` with metadata entries
3. Lets `projects:intake:sync` render local assets in cards/pages

If your Drive export includes a `media-metadata.json` file, titles/captions/descriptions are
applied automatically during import.

`media-metadata.json` can be either:

- object map by filename:

```json
{
  "IMG_1485.MOV": {
    "title": "Dispense flow demo",
    "caption": "Bin trigger from dashboard",
    "description": "Shows UI click, queue insert, and physical dispense response."
  }
}
```

- or array rows:

```json
[
  {
    "file": "IMG_1485.MOV",
    "title": "Dispense flow demo",
    "caption": "Bin trigger from dashboard",
    "description": "Shows UI click, queue insert, and physical dispense response."
  }
]
```

After import, you can still edit `content/projects/<slug>/media/media.json` directly.

## Repository analysis command

```bash
npm run projects:intake:analyze -- <project-slug> [repo-url]
```

Example:

```bash
npm run projects:intake:analyze -- vend-a-shoe https://github.com/Rellendula26/vend-a-shoe
```

This command will:

1. Clone or update the project repository in `.cache/repo-analysis/<slug>`
2. Inspect repository files, stack config, architecture hints, and commit history
3. Generate `content/projects/<slug>/PROJECT_ANALYSIS.md`
4. Provide suggested next steps before syncing

## Recommended sequence per project

1. `npm run projects:intake:new -- <slug> "<title>"`
2. Fill `project.md` (hero / executive summary)
3. Fill `CASE_STUDY.md` (engineering narrative)
4. Drop media; set `hero` in `media.json`
5. `npm run projects:intake:sync`
6. Open `/projects/<slug>`, review, then ask the agent to promote `CASE_STUDY.md` if you want the full layout

## Google Drive

Treat Drive as a dump zone only:

Drive folder → download locally → `projects:intake:import-drive` → refine names/captions → sync.

Do not expect the site to load private Drive URLs directly.
