import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Meta case study: this portfolio site as an engineering / product-design project.
 * Source: ritvik-portfolio-design-process.md
 */
export const WEBSITE_CASE_STUDY: EngineeringCaseStudy = {
  slug: "website",
  motivation: {
    why: "My earlier portfolio showed what I built without consistently showing why it mattered, how the system worked, what failed, or which tradeoffs shaped the final version.",
    interest:
      "I wanted something closer to an engineering notebook than a polished résumé gallery. Substance first, then depth for anyone who wants to inspect the reasoning.",
    learning:
      "Technical communication is a design problem. The hard work was deciding what a reader needs in the first minute versus what rewards a longer read.",
  },
  systemOverview: {
    summary:
      "A Next.js portfolio that turns projects into structured technical case studies. Typed project data drives cards, routes, heroes, and media. Flagship work and supporting builds sit in separate homepage bands so not every experiment competes for equal weight.",
    subsystems: [
      {
        name: "Project data model",
        role: "Typed TypeScript objects for summary, stack/disciplines, media, links, and status. New projects are mostly data, not new page scaffolding.",
      },
      {
        name: "Case-study layout",
        role: "Shared narrative shell: motivation, system overview, disciplines, decisions, evolution, results, reflection.",
      },
      {
        name: "Homepage hierarchy",
        role: "Staged hero, featured band, supporting builds, then personal engineering direction.",
      },
      {
        name: "Media system",
        role: "Images, videos, diagrams, demos, and custom visuals with captions and hero selection.",
      },
      {
        name: "Intake tooling",
        role: "Scripts for project intake, sync, analysis, and media import so publishing becomes a workflow.",
      },
    ],
    dataFlow:
      "Project object (+ optional case study by slug) → home cards / list → project route → exec summary hero + narrative layout + media.",
    controlFlow:
      "Featured vs supporting is explicit in data. Missing case studies fall back to a lighter layout until migrated. Media trust checks keep broken local paths out of production heroes.",
    diagram: {
      kind: "image",
      src: "/projects/portfoliosite/homesite.jpg",
      alt: "Portfolio homepage",
      label: "Homepage",
      caption: "Hero, featured work, and supporting builds as one composition.",
    },
  },
  disciplines: [
    {
      id: "frontend",
      discipline: "Frontend Engineering",
      goal: "Ship a fast App Router site where structure scales without redesigning every page.",
      design:
        "Next.js 16, React 19, TypeScript, Tailwind CSS 4. Centralized project objects power home cards, list pages, and detail routes. Components handle mixed media without per-project UI forks.",
      challenges: [
        "Consistency across hardware, compilers, ML, and product work without flattening everything into one template voice.",
        "Keeping motion purposeful instead of decorative noise.",
      ],
      iterations: [
        "Conventional project gallery",
        "Reusable cards + detail layouts",
        "Structured case-study shell with staged hero motion",
      ],
      finalImplementation:
        "Typed project model, shared EngineeringCaseStudyLayout, Framer Motion / CSS for restrained interaction, Lucide for iconography, Vercel deploy.",
      media: {
        kind: "image",
        src: "/projects/portfoliosite/sampleproductpage.png",
        alt: "Sample project case study page",
        label: "Case study page",
        caption: "Exec summary up top, deeper engineering narrative below.",
      },
    },
    {
      id: "ia",
      discipline: "Information Architecture",
      goal: "Make every project readable in under a minute, then deep enough for an engineer to inspect.",
      design:
        "Executive summary first (one-liner, disciplines, stack, status, highlights, links, primary media). Then motivation, system overview, discipline breakdowns, design decisions, evolution, results, reflection.",
      challenges: [
        "Generic tech-stack lists hid the real work.",
        "Equal visual weight made flagship and experiment projects compete unfairly.",
      ],
      iterations: [
        "Screenshot gallery",
        "Featured vs supporting split",
        "Discipline framing + case-study sections",
      ],
      finalImplementation:
        "Homepage hierarchy plus a reusable case-study skeleton. Only relevant disciplines appear per project.",
    },
    {
      id: "product-design",
      discipline: "Product / Visual Design",
      goal: "Feel engineered and personal, not like a generic dark neon developer template.",
      design:
        "Warm stone and amber tones, large editorial type, rounded cards, generous spacing, restrained motion. Hero stages text, photo, then workbench instead of animating everything at once.",
      challenges: [
        "Corporate startup landing energy vs personality.",
        "Long-form technical writing needs calm surfaces, not glow effects.",
      ],
      iterations: [
        "Earlier gallery aesthetic",
        "Warm editorial palette lock-in",
        "Motion sequencing cleanup on the hero",
      ],
      finalImplementation:
        "Warm cream / stone / amber / black system that supports dense technical pages without drowning them.",
      media: {
        kind: "video",
        src: "/projects/portfoliosite/sitewalkthrough-web.mp4",
        alt: "Walkthrough of the portfolio site",
        poster: "/projects/portfoliosite/homesite.jpg",
        label: "Site walkthrough",
        caption: "Short compressed cut of the homepage and project structure.",
      },
    },
  ],
  designDecisions: [
    {
      id: "typed-data",
      title: "Typed project data instead of hand-built pages",
      problem: "How do you add projects without rebuilding UI each time?",
      alternatives: [
        "Separate hand-coded page per project",
        "Central typed project model + shared layouts",
      ],
      tradeoffs:
        "Hand-built pages are freer and diverge. Structured data is more consistent and scales.",
      choice:
        "Centralize project information in TypeScript. Case studies attach by slug when the narrative is ready.",
    },
    {
      id: "featured-split",
      title: "Separate featured work from supporting builds",
      problem: "Should every project compete for equal visual weight?",
      alternatives: ["Flat equal grid", "Featured band + supporting section"],
      tradeoffs:
        "Flat grids archive everything evenly and bury the strongest work. Split hierarchy guides attention without deleting smaller experiments.",
      choice:
        "Darker warm featured band for flagship projects; lighter supporting section for tools and learning builds.",
    },
    {
      id: "warm-editorial",
      title: "Warm editorial styling over neon developer aesthetic",
      problem: "What should the site feel like?",
      alternatives: ["Dark neon tech portfolio", "Warm stone / amber editorial system"],
      tradeoffs:
        "Neon reads as generic. Warm editorial is more personal and better for long technical writing.",
      choice: "Stone, cream, amber, and black with restrained motion.",
    },
    {
      id: "show-iteration",
      title: "Show failures and iterations as evidence",
      problem: "Do polished finals hide the real engineering?",
      alternatives: ["Final screenshot only", "Evolution, debugging, and limitations on-page"],
      tradeoffs:
        "Perfect finals look clean and shallow. Process media takes space but proves reasoning.",
      choice:
        "Evolution and results sections treat iteration, measurements, and limits as first-class content.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "v1",
      title: "Conventional gallery",
      description: "Projects existed, but depth and process were uneven.",
      media: {
        kind: "image",
        src: "/projects/website-cover.png",
        alt: "Earlier portfolio cover",
        label: "Earlier surface",
      },
    },
    {
      id: "e2",
      phase: "v2",
      title: "Homepage hierarchy",
      description:
        "Preserved the hero concept, staged its motion, and split featured work from supporting builds.",
      media: {
        kind: "image",
        src: "/projects/portfoliosite/homesite.jpg",
        alt: "Current homepage",
        label: "Homepage hierarchy",
      },
    },
    {
      id: "e3",
      phase: "v3",
      title: "Case-study system",
      description:
        "Replaced generic stack framing with disciplines where it mattered, and expanded project pages into structured case studies with reusable media handling.",
      media: {
        kind: "image",
        src: "/projects/portfoliosite/sampleproductpage.png",
        alt: "Case study product page",
        label: "Case study shell",
      },
    },
    {
      id: "e4",
      phase: "Now",
      title: "Publishing workflow",
      description:
        "Intake tooling for new entries, media import, and analysis so adding a project becomes a repeatable process instead of a one-off coding task.",
    },
  ],
  results: {
    items: [
      {
        title: "Living technical archive",
        body: "The site works as a recruiter-facing portfolio and as a record of how projects evolved across hardware, software, research, and product work.",
        evidence: "Live site",
        evidenceHref: "https://ritvikellendula.dev",
      },
      {
        title: "Reusable publishing system",
        body: "Typed project data, shared case-study layout, and intake tooling make new work easier to document without redesigning the interface.",
        evidence: "GitHub",
        evidenceHref: "https://github.com/Rellendula26/ritvik-portfolio",
      },
      {
        title: "Clearer attention hierarchy",
        body: "Featured vs supporting framing keeps flagship multidisciplinary work visible without deleting smaller experiments.",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/portfoliosite/sitewalkthrough-web.mp4",
        alt: "Portfolio site walkthrough",
        poster: "/projects/portfoliosite/homesite.jpg",
        label: "Walkthrough",
        caption: "Homepage through project structure in about eight seconds.",
      },
    ],
    limitations: [
      "Evidence quality still varies by project; some pages need stronger diagrams, measurements, and build photos.",
    ],
  },
  reflection: {
    surprises: [
      "A strong project can look shallow when the page only shows the final product.",
      "A smaller project becomes meaningful when the learning objective, failure modes, and next steps are clear.",
    ],
    redesign: [
      "Keep pushing architecture diagrams, measurements, and iteration timelines into every flagship page.",
      "Keep demo media short and web-compressed as new clips land.",
    ],
    future: [
      "Stronger validation media on older projects",
      "Tighter intake → published case study loop",
      "More process evidence instead of only polished finals",
    ],
    questions: [
      "What does a recruiter need in sixty seconds versus what should reward a deep read?",
      "When does structure help technical communication, and when does it flatten the story?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Technical work does not automatically communicate itself. The page is part of the engineering.",
    },
    {
      kind: "design-insight",
      text: "Featured vs supporting is information architecture, not ego. Attention is a scarce resource.",
    },
    {
      kind: "observation",
      text: "The most important work on this site was deciding what information belongs in the first viewport of a project, not picking another animation.",
    },
  ],
};
