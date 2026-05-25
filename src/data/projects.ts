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
  | "labreach-preview"
  | "portfolio-preview";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  thesis?: string;
  bullets?: string[];
  systemsSignal?: string;
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
  // ── FEATURED (ordered by engineering signal) ───────────────
  {
    id: "F01",
    slug: "c-compiler",
    title: "C Compiler",
    tagline: "OCaml · lexer → TACKY IR → x86-64",
    blurb:
      "A real compiler pipeline in OCaml — not calling clang, actually lowering source to stack-backed assembly.",
    thesis:
      "Built an OCaml-based C compiler lowering source programs through lexer → AST → semantic analysis → TACKY IR → x86-64 assembly, with support for lexical scoping, control flow, loops, and structured IR lowering.",
    bullets: [
      "Recursive descent parser + AST construction for nested unary ops",
      "Semantic pass: symbol resolution, lexical scoping, break/continue loop labels",
      "Custom TACKY IR + control-flow lowering (labels/jumps) before x86-64 codegen",
    ],
    systemsSignal: "Compiler pipeline · IR design · stack lowering · x86-64 emit",
    tier: "featured",
    category: "systems",
    type: "independent",
    tags: [
      "OCaml",
      "Compilers",
      "Recursive Descent",
      "TACKY IR",
      "x86-64",
      "Semantic Analysis",
    ],
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
    tagline: "Reverse-mode autodiff in OCaml",
    blurb:
      "PyTorch-style autodiff without the framework — graphs, backprop, and gradchecks I wrote myself.",
    thesis:
      "Built a PyTorch-inspired autodiff engine in OCaml, modeling computations as graph-based tensor operations and implementing reverse-mode differentiation through explicit graph traversal.",
    bullets: [
      "Computation graph construction with typed tensor nodes and ops",
      "Reverse-mode backprop via explicit tape traversal (not magic .backward())",
      "OCaml modules + gradcheck harness; roadmap toward vectorized tensor backend",
    ],
    systemsSignal: "Autodiff engine · computation graph · ML systems in OCaml",
    tier: "featured",
    category: "ml",
    type: "independent",
    tags: [
      "OCaml",
      "Autodiff",
      "Backpropagation",
      "Computation Graphs",
      "Gradient Checking",
    ],
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
    tagline: "WiFi actuators · Blynk · embedded integration",
    blurb:
      "Robotic flower with servos, sensors, and Morse LEDs — debugged across power rails, WiFi, and timing at 2am.",
    thesis:
      "IoT robotic flower on Arduino UNO R4 WiFi: Blynk remote control, multi-servo petal actuation, LCD + ultrasonic sensing, and Morse-code LED feedback in one embedded pipeline.",
    bullets: [
      "Blynk virtual pins → servo sequences over WiFiS3",
      "I2C LCD status + ultrasonic proximity events alongside motion",
      "Power/timing debug across concurrent actuators and wireless drops",
    ],
    systemsSignal: "Embedded IoT · actuators · sensors · wireless control loop",
    tier: "featured",
    category: "embedded",
    type: "independent",
    tags: [
      "Arduino UNO R4 WiFi",
      "Blynk",
      "Servos",
      "Ultrasonic",
      "I2C LCD",
      "Embedded C++",
    ],
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
    tagline: "Fusion 360 CAD · LED power · soldered integration",
    blurb:
      "CAD-fitted hilt, LED strip segmentation, and 40+ solder joints that had to survive being swung around.",
    thesis:
      "Handheld lightsaber build integrating Fusion 360 CAD, 3D-printed hilt/battery packaging, LED strip power routing, and switch wiring with solder joints rated for motion.",
    bullets: [
      "3D-printed hilt, emitter, battery carrier with tolerance iteration",
      "LED strip segmentation + switch path for even blade glow under load",
      "Contact/solder reliability under flex — integration, not bench-only wiring",
    ],
    systemsSignal: "Hardware integration · CAD + circuits · power under motion",
    tier: "featured",
    category: "hardware",
    type: "independent",
    tags: [
      "Fusion 360",
      "3D Print",
      "LED Strip",
      "Soldering",
      "Circuit Design",
      "CAD",
    ],
    signal: "Hardware",
    href: "/projects/saber",
    timeline: "2026",
    media: projectVideo("saber"),
  },

  // ── SUPPORTING ─────────────────────────────────────────────
  {
    id: "S01",
    slug: "snapfuel",
    title: "SnapFuel",
    tagline: "Vision API → calorie JSON → user edit loop",
    blurb:
      "Photo-first calorie tracking with honest uncertainty — AI estimates, human confirmation, Garmin-aware net calories.",
    thesis:
      "Full-stack meal logging: photo upload → OpenAI vision JSON → user edit → Supabase persistence with log_method tracking.",
    bullets: [
      "Next.js 16 + Supabase auth and meal schema",
      "OpenAI Vision structured output with user correction flow",
    ],
    systemsSignal: "Full-stack · vision API · health data pipeline",
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
    tagline: "Lab scrape → local LLM draft → Gmail review",
    blurb:
      "Research outreach copilot: scrape a lab page, draft with Ollama, review before anything sends.",
    thesis:
      "Python outreach pipeline: lab page scraping, Ollama local LLM drafts, SQLite history, Gmail API send-after-review.",
    bullets: [
      "Scrape + structured prompt assembly for lab-specific emails",
      "Local LLM (Ollama) to keep drafts off cloud until reviewed",
    ],
    systemsSignal: "ML tooling · scraping · email automation",
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
    tagline: "Waveform UI · Librosa BPM · practice loops",
    blurb:
      "Audio analysis for dancers — isolate a section, infer tempo, drill with a metronome overlay.",
    thesis:
      "Next.js audio tool: WaveSurfer range selection → server-side Librosa tempo inference → practice-focused UX.",
    bullets: [
      "Colab prototype → Vercel-shipped Next.js app",
      "Range selection propagates into analysis pipeline",
    ],
    systemsSignal: "Signal processing · web audio · practice UX",
    tier: "supporting",
    category: "fullstack",
    type: "independent",
    tags: ["Signal Processing", "Next.js", "Librosa", "WaveSurfer"],
    signal: "Signal + Web",
    href: "/projects/count-coach",
    github: "https://github.com/Rellendula26/fresh-count-coach",
    demo: "https://fresh-count-coach.vercel.app",
    timeline: "2025–2026",
    media: projectVideo("count-coach"),
  },
  {
    id: "S04",
    slug: "arduino-tetris",
    title: "Arduino TFT Tetris",
    tagline: "SPI TFT · bare-metal game loop · piezo SFX",
    blurb:
      "Tetris on Arduino Nano + ST7735: SPI rendering, collision engine, debounced buttons, piezo beeps — no OS.",
    thesis:
      "Handheld Tetris on constrained MCU hardware: SPI framebuffer, tetromino engine, input debounce, and piezo tone() feedback.",
    bullets: [
      "Adafruit GFX → ST7735 SPI flush in fixed-timestep loop",
      "Display solder bring-up + two-button dev iteration before handheld layout",
    ],
    systemsSignal: "Embedded · SPI graphics · real-time game loop",
    tier: "supporting",
    category: "embedded",
    type: "independent",
    tags: ["Arduino", "C++", "SPI", "ST7735", "Embedded"],
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
    tagline: "MediaPipe poses · FastAPI pipeline · Supabase",
    blurb:
      "CV dance coach: pose landmarks, temporal alignment vs reference, structured feedback in a full-stack app.",
    thesis:
      "Full-stack dance feedback: Next.js upload flow, FastAPI + MediaPipe processing, Supabase storage for clips and references.",
    bullets: [
      "Frame-by-frame pose extraction and movement delta computation",
      "Reference vs user comparison UI with coaching feedback layer",
    ],
    systemsSignal: "CV pipeline · full-stack · pose estimation",
    tier: "supporting",
    category: "ml",
    type: "independent",
    tags: ["MediaPipe", "FastAPI", "Supabase", "Computer Vision", "Next.js"],
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
    tagline: "Campus dining social · Next.js + Supabase",
    blurb:
      "Penn SPARK full-stack app connecting students around campus dining — real product constraints, real users.",
    thesis:
      "Full-stack social dining app: Next.js frontend, Supabase auth/data, designed for Penn SPARK student usage.",
    bullets: [
      "Auth + profile flows with Supabase RLS patterns",
      "Product iteration from prototype to demo-ready build",
    ],
    systemsSignal: "Product engineering · full-stack · campus deployment",
    tier: "supporting",
    category: "fullstack",
    type: "clubs",
    tags: ["Next.js", "Supabase", "React", "Penn SPARK"],
    signal: "Product",
    href: "/projects/pennplates",
    timeline: "2026",
    media: projectVideo("pennplates"),
  },

  // ── ARCHIVE (preserved) ────────────────────────────────────
  {
    id: "A01",
    slug: "website",
    title: "Portfolio Website",
    tagline: "This site",
    blurb:
      "Custom Next.js portfolio with reusable components, case study layouts, and Vercel deployment — the meta project documenting everything else.",
    tier: "archive",
    category: "fullstack",
    type: "independent",
    tags: ["Next.js", "React", "Tailwind", "Framer Motion"],
    signal: "Meta",
    href: "/projects/website",
    github: "https://github.com/Rellendula26/ritvik-portfolio",
    timeline: "2025–2026",
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
    tagline: "Anatomical CAD · Maya · 3D print",
    blurb:
      "High school neuroscience project: gyri/sulci brain model in Maya, 3D printed with physical region labels.",
    tier: "archive",
    category: "cad",
    type: "independent",
    tags: ["Maya", "CAD", "3D Print", "Neuroscience"],
    signal: "CAD",
    href: "/projects/brain",
    timeline: "High School",
    media: {
      kind: "image",
      src: "/projects/brain-1.png",
      alt: "3D printed interactive brain model with region labels",
    },
  },
  {
    id: "A03",
    slug: "OIDD",
    title: "Health Outcomes Analysis",
    tagline: "STAT 7770 · pandas · decision trees",
    blurb:
      "Socioeconomic factors vs poor health outcomes — pandas, seaborn, and decision trees for OIDD capstone.",
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
