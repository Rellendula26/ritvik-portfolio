# Project Intake Workflow

Use this folder as the local intake zone for messy project material before it becomes a polished portfolio entry.

## Folder shape

```txt
content/projects/
  <project-slug>/
    project.md
    PROJECT_ANALYSIS.md
    media/
      images/
      videos/
      diagrams/
      thumbnails/
      media.json
    notes/
      build-log.md
      debugging.md
      links.md
```

Copy `content/projects/_template/` whenever you start a new project intake.

Or scaffold one automatically:

```bash
npm run projects:intake:new -- vend-a-shoe "Vend-A-Shoe"
```

## Source flow

GitHub repository + Google Drive folder + local notes -> `PROJECT_ANALYSIS.md` -> synced generated data -> project cards/detail pages

Google Drive media should be treated as intake only:

Google Drive folder -> manually downloaded/exported folder -> local `content/projects/<slug>/media/*` -> synced public assets.

## Sync command

Run:

```bash
npm run projects:intake:sync
```

This command will:

1. Parse each `project.md`
2. Copy media into `public/projects/intake/<slug>/...` from local intake folders
3. Generate `src/data/projects.generated.json`
4. Automatically merge generated projects into your existing project system

No frontend component edits are required for new intake projects.

If a Drive URL exists but no local media has been imported yet, project pages show a small
development warning instead of trying to load private Drive media.

## Google Drive media import command

Run:

```bash
npm run projects:intake:import-drive -- <project-slug> <downloaded-drive-folder-path>
```

Example:

```bash
npm run projects:intake:import-drive -- vend-a-shoe ~/Downloads/vend-a-shoe-drive
```

This command:

1. Copies local exported Drive assets into:
   - `media/images`
   - `media/videos`
   - `media/diagrams`
   - `media/thumbnails`
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

Run:

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

## One-command intake setup

Run:

```bash
npm run projects:intake:new -- <project-slug> [optional title]
```

This command creates:

- `content/projects/<project-slug>/project.md` (prefilled intake template)
- `content/projects/<project-slug>/PROJECT_ANALYSIS.md` (repo-analysis template)
- `content/projects/<project-slug>/media/images/`
- `content/projects/<project-slug>/media/videos/`
- `content/projects/<project-slug>/media/diagrams/`
- `content/projects/<project-slug>/media/thumbnails/`
- `content/projects/<project-slug>/media/media.json`
- `content/projects/<project-slug>/notes/build-log.md`
- `content/projects/<project-slug>/notes/debugging.md`
- `content/projects/<project-slug>/notes/links.md`

Recommended sequence for each new project:

1. `npm run projects:intake:new -- <slug> "<title>"`
2. Fill `project.md`; add Google Drive link and rough notes
3. Download/export Drive folder locally, then run `npm run projects:intake:import-drive -- <slug> <folder>`
4. `npm run projects:intake:analyze -- <slug> <repo-url>`
5. Review/refine `PROJECT_ANALYSIS.md`
6. `npm run projects:intake:sync`
