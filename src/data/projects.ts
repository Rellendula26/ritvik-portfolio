import { projectVideo } from "@/data/project-media";

export type ProjectTier = "featured" | "supporting" | "archive";
export type ProjectCategory =
  | "systems"
  | "ml"
  | "embedded"
  | "hardware"
  | "fullstack"
  | "research"
  | "cad"
  | "data";

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string; poster?: string }
  | { kind: "visual"; visualId: ProjectVisualId; alt: string };

export type ProjectVisualId =
  | "compiler-pipeline"
  | "minitorch-autodiff"
  | "snapfuel-preview"
  | "labreach-preview";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  tier: ProjectTier;
  category: ProjectCategory;
  type: "independent" | "course" | "clubs";
  tags: string[];
  signal: string;
  href: string;
  github?: string;
  demo?: string;
  timeline?: string;
  media?: ProjectMedia;
}

export const PROJECTS: Project[] = [
  // ── TOP TIER ──────────────────────────────────────────────
  {
    id: "F01",
    slug: "c-compiler",
    title: "C Compiler",
    tagline: "Lexer → AST → TACKY IR → x86-64",
    blurb:
      "I'm building a real C compiler in OCaml, lexer to x86 assembly, with an IR in the middle so nested expressions actually make sense. It's the project that made compilers click for me.",
    tier: "featured",
    category: "systems",
    type: "independent",
    tags: ["OCaml", "Compilers", "x86-64", "IR", "Parsing"],
    signal: "Systems",
    href: "/projects/c-compiler",
    github: "https://github.com/Rellendula26/c-compiler",
    timeline: "2026",
    media: {
      kind: "visual",
      visualId: "compiler-pipeline",
      alt: "C compiler pipeline visualization",
    },
  },
  {
    id: "F02",
    slug: "minitorch-ocaml",
    title: "MiniTorch-OCaml",
    tagline: "Autodiff engine from scratch",
    blurb:
      "PyTorch-style autodiff, but I wrote it in OCaml. Computational graphs, backprop, gradient checks, the stuff frameworks usually hide.",
    tier: "featured",
    category: "ml",
    type: "independent",
    tags: ["OCaml", "Autodiff", "ML Systems", "Neural Nets"],
    signal: "ML Systems",
    href: "/projects/minitorch-ocaml",
    github: "https://github.com/Rellendula26/minitorch-ocaml",
    timeline: "2026",
    media: {
      kind: "visual",
      visualId: "minitorch-autodiff",
      alt: "MiniTorch autodiff computation graph",
    },
  },
  {
    id: "F03",
    slug: "bloombot",
    title: "BloomBot IoT",
    tagline: "IoT robotic flower",
    blurb:
      "A robotic flower you can control from your phone, servos, LEDs, ultrasonic sensing, and way too much time debugging WiFi at 2am.",
    tier: "featured",
    category: "embedded",
    type: "independent",
    tags: ["Arduino", "IoT", "Servos", "Blynk", "Embedded C++"],
    signal: "Robotics",
    href: "/projects/bloombot",
    github: "https://github.com/Rellendula26/bloombot-iot",
    demo: "https://devpost.com/software/bloombot-8syfva",
    timeline: "2026",
    media: projectVideo("bloombot"),
  },
  {
    id: "F04",
    slug: "saber",
    title: "Lightsaber",
    tagline: "CAD + circuits + integration",
    blurb:
      "CAD'd the hilt, soldered the circuit, and ended up with a lightsaber that actually glows. My hands still remember the flux fumes.",
    tier: "featured",
    category: "hardware",
    type: "independent",
    tags: ["Fusion 360", "Circuits", "Soldering", "CAD", "LEDs"],
    signal: "Hardware",
    href: "/projects/saber",
    timeline: "2026",
    media: projectVideo("saber"),
  },

  // ── SECOND TIER ───────────────────────────────────────────
  {
    id: "S01",
    slug: "snapfuel",
    title: "SnapFuel",
    tagline: "Photo → calories → Garmin net",
    blurb:
      "Snap a meal, get a calorie estimate, fix it if the AI is wrong, and see how it stacks up against what Garmin says you burned.",
    tier: "supporting",
    category: "fullstack",
    type: "independent",
    tags: ["Next.js", "Supabase", "OpenAI Vision", "TypeScript"],
    signal: "Full-Stack",
    href: "/projects/snapfuel",
    github: "https://github.com/Rellendula26/snapfuel",
    timeline: "2026",
    media: {
      kind: "visual",
      visualId: "snapfuel-preview",
      alt: "SnapFuel calorie tracking concept",
    },
  },
  {
    id: "S02",
    slug: "labreach-ai",
    title: "LabReach AI",
    tagline: "Research outreach copilot",
    blurb:
      "Helps me write research outreach emails I'd actually send, scrape a lab page, draft with a local LLM, and review before anything goes out.",
    tier: "supporting",
    category: "ml",
    type: "independent",
    tags: ["Python", "Ollama", "Scraping", "Gmail API", "SQLite"],
    signal: "ML + Tools",
    href: "/projects/labreach-ai",
    github: "https://github.com/Rellendula26/labreach-ai",
    timeline: "2026",
    media: {
      kind: "visual",
      visualId: "labreach-preview",
      alt: "LabReach AI outreach workflow concept",
    },
  },
  {
    id: "S03",
    slug: "count-coach",
    title: "Count Coach",
    tagline: "Audio BPM for dancers",
    blurb:
      "I can't count beats in dance music, so I built a tool that shows waveforms and overlays a metronome. Started in Colab, shipped on Vercel.",
    tier: "supporting",
    category: "fullstack",
    type: "independent",
    tags: ["Signal Processing", "Next.js", "Librosa", "WaveSurfer"],
    signal: "Signal + Web",
    href: "/projects/count-coach",
    github: "https://github.com/Rellendula26/fresh-count-coach",
    demo: "https://fresh-count-coach.vercel.app",
    timeline: "2025 to 2026",
    media: projectVideo("count-coach"),
  },
  {
    id: "S04",
    slug: "arduino-tetris",
    title: "Arduino TFT Tetris",
    tagline: "TFT handheld on Nano",
    blurb:
      "Tetris on Arduino Nano + ST7735 TFT: SPI graphics, tetromino engine, collision detection, line clearing, and debounced button controls on constrained embedded hardware.",
    tier: "supporting",
    category: "embedded",
    type: "independent",
    tags: ["Arduino", "C++", "SPI", "Game Dev", "Embedded"],
    signal: "Embedded",
    href: "/projects/arduino-tetris",
    github: "https://github.com/Rellendula26/arduino-tetris",
    timeline: "2026",
    media: projectVideo("arduino-tetris"),
  },
  {
    id: "S05",
    slug: "bhangra-coach",
    title: "Bhangra Coach",
    tagline: "Pose estimation feedback",
    blurb:
      "Computer vision dance coach: MediaPipe pose estimation, movement comparison, timing/posture/bounce feedback, full-stack with Supabase backend.",
    tier: "supporting",
    category: "ml",
    type: "independent",
    tags: ["MediaPipe", "OpenCV", "Supabase", "Computer Vision"],
    signal: "CV + ML",
    href: "/projects/bhangra-coach",
    github: "https://github.com/Rellendula26/bhangra-coach",
    demo: "https://bhangra-coach.vercel.app",
    timeline: "2026",
    media: projectVideo("bhangra-coach"),
  },
  {
    id: "S06",
    slug: "pennplates",
    title: "Penn Plates",
    tagline: "Campus dining social app",
    blurb:
      "Full-stack Penn SPARK project connecting underclassmen and upperclassmen around campus dining, Next.js + Supabase with real student usage goals.",
    tier: "supporting",
    category: "fullstack",
    type: "clubs",
    tags: ["Next.js", "Supabase", "React", "Penn SPARK"],
    signal: "Product",
    href: "/projects/pennplates",
    timeline: "2026",
    media: projectVideo("pennplates"),
  },

  // ── ARCHIVE (preserved, deprioritized) ──────────────────
  {
    id: "A01",
    slug: "website",
    title: "Portfolio Website",
    tagline: "This site",
    blurb:
      "Custom Next.js portfolio with reusable components, case study layouts, and Vercel deployment, the meta project documenting everything else.",
    tier: "archive",
    category: "fullstack",
    type: "independent",
    tags: ["Next.js", "React", "Tailwind", "Framer Motion"],
    signal: "Meta",
    href: "/projects/website",
    github: "https://github.com/Rellendula26/ritvik-portfolio",
    timeline: "2025 to 2026",
    media: {
      kind: "image",
      src: "/projects/website-cover.png",
      alt: "Portfolio website",
    },
  },
  {
    id: "A02",
    slug: "brain",
    title: "3D Brain Model",
    tagline: "Anatomical CAD",
    blurb:
      "High school project: accurate gyri/sulci brain model in Maya, 3D printed with physical labels for neuroscience education.",
    tier: "archive",
    category: "cad",
    type: "independent",
    tags: ["Maya", "CAD", "3D Print", "Neuroscience"],
    signal: "CAD",
    href: "/projects/brain",
    timeline: "High School",
    media: { kind: "image", src: "/projects/bin.png", alt: "3D brain model" },
  },
  {
    id: "A03",
    slug: "OIDD",
    title: "Health Outcomes Analysis",
    tagline: "STAT 7770 capstone",
    blurb:
      "Data analysis of socioeconomic factors on poor health outcomes, pandas, seaborn, decision trees, and visualization for OIDD course final.",
    tier: "archive",
    category: "data",
    type: "course",
    tags: ["Python", "Pandas", "ML", "Data Viz"],
    signal: "Data",
    href: "/projects/OIDD",
    timeline: "Course",
    media: { kind: "image", src: "/projects/OIDD.png", alt: "OIDD analysis" },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.tier === "featured");
export const SUPPORTING_PROJECTS = PROJECTS.filter((p) => p.tier === "supporting");
export const ARCHIVE_PROJECTS = PROJECTS.filter((p) => p.tier === "archive");

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  systems: "Systems",
  ml: "Machine Learning",
  embedded: "Embedded",
  hardware: "Hardware",
  fullstack: "Full-Stack",
  research: "Research",
  cad: "CAD / Design",
  data: "Data Science",
};
