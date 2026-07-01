import GENERATED_INTAKE_PROJECTS from "@/data/projects.generated.json";

export type ProjectCategory =
  | "systems"
  | "ml"
  | "embedded"
  | "hardware"
  | "fullstack"
  | "research"
  | "cad"
  | "data";

export type ProjectVisualId =
  | "compiler-pipeline"
  | "minitorch-autodiff"
  | "snapfuel-preview"
  | "labreach-preview"
  | "portfolio-preview";

export type ProjectStatus = "shipped" | "in-progress" | "iterating" | "archived";

export type ProjectMediaType =
  | "image"
  | "video"
  | "diagram"
  | "demo"
  | "process"
  | "visual";

export type ProjectMedia =
  | {
      kind: "image";
      src: string;
      alt: string;
      title?: string;
      label?: string;
      mediaType?: Exclude<ProjectMediaType, "visual">;
      caption?: string;
      description?: string;
      featured?: boolean;
      priority?: number;
    }
  | {
      kind: "video";
      src: string;
      alt: string;
      title?: string;
      label?: string;
      poster?: string;
      mediaType?: Exclude<ProjectMediaType, "visual">;
      caption?: string;
      description?: string;
      featured?: boolean;
      priority?: number;
    }
  | {
      kind: "visual";
      visualId: ProjectVisualId;
      alt: string;
      title?: string;
      label?: string;
      mediaType?: "visual";
      caption?: string;
      description?: string;
      featured?: boolean;
      priority?: number;
    };

export interface Project {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  oneLine: string;
  overview: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
  thumbnail: string;
  images: string[];
  date: string;
  buildStage: string;
  keyHighlights: string[];
  architecture: string[];
  challenges: string[];
  lessonsLearned: string[];
  technicalNotes: string[];
  nextImprovements?: string[];
  buildNotes?: string[];
  debuggingNotes?: string[];
  architectureImages?: string[];
  imageGallery?: string[];
  videoGallery?: string[];
  driveFolderUrl?: string;
  finalOutcome?: string;
  intakeSourcePath?: string;
  localMediaImported?: boolean;
  media: ProjectMedia[];
  tags: string[];
  href: string;
  signal: string;
}

type ProjectInput = Omit<Project, "href" | "media"> & { media?: ProjectMedia[] };

/**
 * Add a new project by dropping one object in PROJECTS below.
 * normalizeProject() auto-generates:
 * - href from slug
 * - media cards from demoVideoUrl/images/thumbnail
 * so new entries usually do not need custom UI work.
 */
function inferImageLabel(index: number) {
  if (index === 0) return "Build snapshot";
  if (index === 1) return "Iteration snapshot";
  return `Gallery ${index + 1}`;
}

const SAFE_MEDIA_FALLBACK = "/projects/placeholder-media.svg";

function isTrustedProjectAsset(src: string | undefined) {
  if (!src) return false;
  return true;
}

function normalizeProject(input: ProjectInput): Project {
  const safeThumbnail = input.thumbnail || SAFE_MEDIA_FALLBACK;
  const safeImages = (input.images ?? []).filter((src) => isTrustedProjectAsset(src));
  const safeDemoVideoUrl =
    input.demoVideoUrl && isTrustedProjectAsset(input.demoVideoUrl)
      ? input.demoVideoUrl
      : undefined;

  const media: ProjectMedia[] = [...(input.media ?? [])].filter((item) => {
    if (item.kind === "visual") return true;
    return isTrustedProjectAsset(item.src);
  });

  if (safeDemoVideoUrl && !media.some((item) => item.kind === "video" && item.src === safeDemoVideoUrl)) {
    media.unshift({
      kind: "video",
      src: safeDemoVideoUrl,
      alt: `${input.title} demo`,
      label: "Demo",
      poster: safeThumbnail,
      mediaType: "demo",
      featured: true,
      priority: 10,
    });
  }

  safeImages.forEach((src, index) => {
    if (!media.some((item) => "src" in item && item.src === src)) {
      media.push({
        kind: "image",
        src,
        alt: `${input.title} media ${index + 1}`,
        label: inferImageLabel(index),
        mediaType: "image",
      });
    }
  });

  if (!media.some((item) => item.kind === "image" || item.kind === "video")) {
    media.unshift({
      kind: "image",
      src: safeThumbnail,
      alt: `${input.title} thumbnail`,
      label: "Preview",
      mediaType: "image",
      featured: true,
      priority: 1,
    });
  }

  return {
    ...input,
    demoVideoUrl: safeDemoVideoUrl,
    thumbnail: safeThumbnail,
    images: safeImages,
    href: `/projects/${input.slug}`,
    media,
  };
}

export function pickProjectPrimaryMedia(project: Project): ProjectMedia | undefined {
  const explicitVisual = project.media.find((item) => item.kind === "visual");
  if (explicitVisual) return explicitVisual;

  const fromExplicitHero = project.media.find(
    (item) => item.mediaType === "demo" || item.mediaType === "visual"
  );
  if (fromExplicitHero) return fromExplicitHero;

  const byPriority = [...project.media]
    .filter((item) => item.featured || typeof item.priority === "number")
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  if (byPriority.length > 0) return byPriority[0];

  const thumbnailMatch = project.media.find(
    (item) => "src" in item && item.src === project.thumbnail
  );
  if (thumbnailMatch) return thumbnailMatch;

  const firstImage = project.media.find((item) => item.kind === "image");
  if (firstImage) return firstImage;

  const firstVideo = project.media.find((item) => item.kind === "video");
  if (firstVideo) return firstVideo;

  return project.media[0];
}

const BASE_PROJECTS: Project[] = [
  normalizeProject({
    id: "P01",
    title: "C Compiler",
    slug: "c-compiler",
    featured: true,
    category: "systems",
    status: "iterating",
    oneLine: "OCaml compiler pipeline from C source to x86-64 assembly.",
    overview:
      "As I gained a deeper interest in understanding lower level systems, I realized that I never understood the basis behind compilers, the actual foundation of programming. Thus, I researched what I could about compilers, and I stumbled upon Nora Sandler's book on writing compilers. Here, I learnt the principles behind developing a compiler starting with a real lexer -> parser -> IR -> codegen pipeline where I could inspect every stage. One cool thing is that the book didn't spoonfeed me the code; rather, it gave the foundations, which I had to apply to the best of my ability.",
    techStack: ["OCaml", "Recursive Descent", "TACKY IR", "x86-64", "Make"],
    githubUrl: "https://github.com/Rellendula26/c-compiler",
    thumbnail: "/projects/gallery/c-compiler-source.svg",
    images: [
      "/projects/gallery/c-compiler-source.svg",
      "/projects/gallery/c-compiler-ast.svg",
      "/projects/gallery/c-compiler-tacky.svg",
      "/projects/gallery/c-compiler-asm.svg",
    ],
    date: "Spring 2026",
    buildStage: "Actively expanding language features",
    keyHighlights: [
      "Recursive-descent parser supporting nested unary expressions.",
      "Custom IR lowered into stack-backed assembly with fixup passes.",
      "Incremental tests from return literals to structured control flow.",
    ],
    architecture: [
      "Lexer tokenizes source into typed tokens.",
      "Parser builds AST, then semantic analysis resolves symbols and scopes.",
      "TACKY IR flattens expressions before architecture-specific codegen.",
      "Emitter outputs AT&T syntax x86-64 assembly for clang linking.",
    ],
    challenges: [
      "Memory-to-memory instructions in x86 required explicit scratch-register fixups.",
      "Nested unary operations exposed edge cases in AST lowering.",
      "Apple Silicon workflow needed careful x86_64 target handling.",
    ],
    lessonsLearned: [
      "As expression increases, IR becomes everso more important.",
      "To optimize debugging, testing each compiler stage independently is a necessity.",
      "Reading generated assembly is still the fastest debug loop.",
    ],
    technicalNotes: [
      "Roadmap: binary operators, local variables, richer control flow, function calls.",
      "Current priority is correctness and clean lowering, not optimization passes.",
    ],
    media: [
      { kind: "visual", visualId: "compiler-pipeline", alt: "Compiler pipeline visual", label: "Pipeline visual" },
      { kind: "image", src: "/projects/gallery/c-compiler-ast.svg", alt: "Compiler AST output", label: "AST output" },
      { kind: "image", src: "/projects/gallery/c-compiler-asm.svg", alt: "Generated assembly output", label: "Assembly output" },
    ],
    tags: ["compiler", "systems", "ir", "debugging", "ocaml"],
    signal: "Systems",
  }),
  normalizeProject({
    id: "P02",
    title: "MiniTorch-OCaml",
    slug: "minitorch-ocaml",
    featured: true,
    category: "ml",
    status: "iterating",
    oneLine: "Reverse-mode autodiff engine with custom computation graphs.",
    overview:
      "I wanted to understand backprop beyond framework APIs, so I implemented graph nodes, reverse traversal, and gradient checks in OCaml.",
    techStack: ["OCaml", "Autodiff", "Computation Graphs", "Gradient Checking"],
    githubUrl: "https://github.com/Rellendula26/minitorch-ocaml",
    thumbnail: "/projects/gallery/minitorch-graph.svg",
    images: [
      "/projects/gallery/minitorch-graph.svg",
      "/projects/gallery/minitorch-forward.svg",
      "/projects/gallery/minitorch-backprop.svg",
      "/projects/gallery/minitorch-gradcheck.svg",
    ],
    date: "Spring 2026",
    buildStage: "Extending toward richer tensor operations",
    keyHighlights: [
      "Typed graph nodes with values, gradients, parents, and operations.",
      "Reverse-mode engine validated against finite-difference gradchecks.",
      "Training loops show consistent loss decrease on toy problems.",
    ],
    architecture: [
      "Tensor ops construct a directed graph during forward pass.",
      "Backward traversal propagates gradients through parent references.",
      "Optimizer updates parameters from accumulated gradients.",
    ],
    challenges: [
      "Gradient bugs were subtle and rarely obvious from forward outputs.",
      "Type-safe abstractions had to stay flexible enough for new operations.",
      "Keeping the API small while preserving useful experimentation loops.",
    ],
    lessonsLearned: [
      "Math correctness needs numerical checks, not confidence.",
      "Strong types catch structure issues, not calculus mistakes.",
      "Loss curves are the practical proof that autodiff is working.",
    ],
    technicalNotes: [
      "Adding new operators now always includes forward + backward + gradcheck tests.",
      "Vectorized backend is a future step once core operator set is stable.",
    ],
    media: [
      { kind: "visual", visualId: "minitorch-autodiff", alt: "MiniTorch autodiff visual", label: "Autodiff visual" },
      { kind: "image", src: "/projects/gallery/minitorch-backprop.svg", alt: "Backprop flow", label: "Backprop flow" },
    ],
    tags: ["ml-systems", "autodiff", "ocaml", "backprop"],
    signal: "ML Systems",
  }),
  normalizeProject({
    id: "P03",
    title: "BloomBot IoT",
    slug: "bloombot",
    featured: true,
    category: "embedded",
    status: "shipped",
    oneLine: "IoT robotic flower with servos, sensors, LCD, and remote control.",
    overview:
      "This project came from wanting something expressive and physical, not just another board demo. I integrated Blynk controls, servo choreography, sensor feedback, and display output into one system.",
    techStack: ["Arduino UNO R4 WiFi", "Blynk", "WiFiS3", "Servos", "Ultrasonic", "I2C LCD"],
    githubUrl: "https://github.com/Rellendula26/bloombot-iot",
    liveUrl: "https://devpost.com/software/bloombot-8syfva",
    demoVideoUrl: "/projects/bloombotsetup.mp4",
    thumbnail: "/projects/placeholder-media.svg",
    images: ["/projects/placeholder-media.svg"],
    date: "Spring 2026",
    buildStage: "Shipped demo + iterating on next hardware revision",
    keyHighlights: [
      "Remote interaction over WiFi through Blynk virtual pins.",
      "Multi-servo movement coordinated with sensor + display feedback.",
      "Public demo and full build documentation on Devpost.",
    ],
    architecture: [
      "Blynk app events map to virtual pin handlers on the Arduino.",
      "Firmware coordinates servo motion loops with sensor checks.",
      "LCD and Morse LED signaling provide user feedback state.",
    ],
    challenges: [
      "Power rails had to be stabilized to avoid brownouts during concurrent servo loads.",
      "WiFi reliability under demo conditions needed repeated retry logic.",
      "Timing collisions appeared when actuators and sensing ran simultaneously.",
    ],
    lessonsLearned: [
      "Hardware reliability is mostly integration discipline.",
      "Live demo confidence comes from failure-mode rehearsals.",
      "A simple feedback channel (LCD/LED) makes debugging way easier.",
    ],
    technicalNotes: [
      "Future iterations: improved enclosure, cleaner wiring harness, smoother interpolation.",
      "I also want to map sentiment-driven inputs to movement patterns.",
    ],
    media: [
      {
        kind: "video",
        src: "/projects/bloombotsetup.mp4",
        alt: "Building BloomBot",
        label: "Build process",
        poster: "/projects/placeholder-media.svg",
        mediaType: "demo",
        featured: true,
        priority: 20,
      },
      { kind: "video", src: "/projects/bloombotsetup.mp4", alt: "BloomBot hardware setup", label: "Hardware setup" },
    ],
    tags: ["iot", "embedded", "robotics", "actuators", "integration"],
    signal: "Robotics",
  }),
  normalizeProject({
    id: "P04",
    title: "Lightsaber Build",
    slug: "saber",
    featured: true,
    category: "hardware",
    status: "shipped",
    oneLine: "CAD + circuitry + soldering to ship a handheld lightsaber build.",
    overview:
      "I used this as a hands-on integration project: sketching, CAD, soldering, wiring, and iteration until the final object felt robust in-hand and not like a fragile prototype.",
    techStack: ["Fusion 360", "LED Strip", "Soldering", "3D Printing", "Circuit Design"],
    thumbnail: "/projects/placeholder-media.svg",
    images: ["/projects/placeholder-media.svg"],
    date: "Spring 2026",
    buildStage: "Shipped physical build",
    keyHighlights: [
      "40+ solder joints across power/signal paths.",
      "Iterated CAD tolerances for fit and cable routing.",
      "Integrated mechanical structure with functional electronics.",
    ],
    architecture: [
      "Battery and switch path drives segmented LED strip inside blade.",
      "Printed hilt houses battery carrier, wire routing, and control switch.",
      "Mechanical tolerances tuned to keep parts secure under motion.",
    ],
    challenges: [
      "Wire management inside the hilt was harder than schematic planning.",
      "Solder rework was needed when joint strength wasn't enough for movement.",
      "Fit issues from early prints required repeated CAD adjustments.",
    ],
    lessonsLearned: [
      "Integration and packaging can dominate project complexity.",
      "CAD tolerance choices directly affect electrical reliability.",
      "Build quality is what turns a cool prototype into a real artifact.",
    ],
    technicalNotes: [
      "Documented each stage from whiteboard circuits to final lab testing.",
      "Next version could be battery-optimized with a cleaner internal harness.",
    ],
    media: [],
    tags: ["hardware", "cad", "soldering", "mechanical-design"],
    signal: "Hardware",
  }),
  normalizeProject({
    id: "P05",
    title: "SnapFuel",
    slug: "snapfuel",
    featured: false,
    category: "fullstack",
    status: "iterating",
    oneLine: "Photo-first calorie logging with AI estimation and human confirmation.",
    overview:
      "I built SnapFuel to reduce food logging friction while keeping the user in control. The core idea is: AI suggests, user confirms, dashboard reflects confirmed values.",
    techStack: ["Next.js", "TypeScript", "Supabase", "OpenAI Vision", "Vercel"],
    githubUrl: "https://github.com/Rellendula26/snapfuel",
    thumbnail: "/projects/placeholder-media.svg",
    images: [],
    date: "2026",
    buildStage: "MVP shipped, improving reliability and integrations",
    keyHighlights: [
      "End-to-end flow from image upload to confirmed meal persistence.",
      "Vision output structured with validation and editable review UI.",
      "Data model supports manual + AI-assisted entries side by side.",
    ],
    architecture: [
      "Client upload triggers analysis endpoint for structured meal estimation.",
      "User review step edits calories/macros before save.",
      "Dashboard queries confirmed records, not raw model output.",
    ],
    challenges: [
      "Model confidence needed transparent communication, not fake precision.",
      "RLS policies had to be tuned for user-specific meal access.",
      "Timezone boundaries affect daily summaries if not handled explicitly.",
    ],
    lessonsLearned: [
      "Human confirmation is the actual product feature.",
      "Schema-first planning made API/UI integration much smoother.",
    ],
    technicalNotes: [
      "Garmin-style burn integration is currently abstracted behind an interface.",
      "Still balancing UX speed with data correctness safeguards.",
    ],
    media: [
      {
        kind: "visual",
        visualId: "snapfuel-preview",
        alt: "SnapFuel preview",
        label: "Product preview",
        mediaType: "visual",
        featured: true,
        priority: 12,
      },
    ],
    tags: ["fullstack", "health-tech", "vision-api", "product"],
    signal: "Full-Stack",
  }),
  normalizeProject({
    id: "P06",
    title: "LabReach AI",
    slug: "labreach-ai",
    featured: false,
    category: "ml",
    status: "iterating",
    oneLine: "Research outreach copilot: scrape, summarize, draft, review, then send.",
    overview:
      "LabReach started as a script to reduce repetitive outreach prep. I kept a human-review checkpoint as a hard requirement so automation helps without blindly sending.",
    techStack: ["Python", "Ollama", "BeautifulSoup", "Playwright", "SQLite", "Gmail API"],
    githubUrl: "https://github.com/Rellendula26/labreach-ai",
    thumbnail: "/projects/website-2.png",
    images: ["/projects/website-2.png", "/projects/website-1.png", "/projects/website-cover.png"],
    date: "2026",
    buildStage: "CLI pipeline working, expanding campaign tooling",
    keyHighlights: [
      "URL discovery pipeline for department listing pages.",
      "Local LLM drafting option to keep sensitive content off cloud services.",
      "Review artifacts generated before any send action.",
    ],
    architecture: [
      "Scrape/extract modules feed structured profile context.",
      "LLM stage drafts outreach text from context templates.",
      "Campaign layer stores history and controls send scheduling.",
    ],
    challenges: [
      "JS-heavy faculty pages broke simple scraping logic.",
      "Email extraction quality varied across lab websites.",
      "Automation required strict safeguards around send behavior.",
    ],
    lessonsLearned: [
      "Speed without brakes is not useful in outreach workflows.",
      "A review layer is both an ethics and quality requirement.",
    ],
    technicalNotes: [
      "Discovery + review tooling now matters more than single-email generation.",
      "Next step is stronger campaign observability and retry handling.",
    ],
    media: [{ kind: "visual", visualId: "labreach-preview", alt: "LabReach preview", label: "Workflow preview" }],
    tags: ["ml-tools", "automation", "scraping", "workflow"],
    signal: "ML + Tools",
  }),
  normalizeProject({
    id: "P07",
    title: "Count Coach",
    slug: "count-coach",
    featured: false,
    category: "fullstack",
    status: "shipped",
    oneLine: "Dance practice tool with waveform selection and BPM analysis.",
    overview:
      "Built from a dance practice pain point: finding the right section and tempo quickly. The app combines waveform interactions with server-side tempo analysis.",
    techStack: ["Next.js", "WaveSurfer", "Librosa", "Python", "Vercel"],
    githubUrl: "https://github.com/Rellendula26/fresh-count-coach",
    liveUrl: "https://fresh-count-coach.vercel.app",
    demoVideoUrl: "/projects/count-coach-demo.mp4",
    thumbnail: "/projects/count-coach-poster.png",
    images: ["/projects/count-coach-1.png", "/projects/count-coach-2.png", "/projects/count-coach-poster.png"],
    date: "2025-2026",
    buildStage: "Shipped and used as a personal practice tool",
    keyHighlights: [
      "Waveform-based segment selection tied directly to analysis calls.",
      "Server-side BPM inference integrated into a lightweight UX.",
      "From Colab prototype to deployed app.",
    ],
    architecture: [
      "Client selects clip region and posts audio segment metadata.",
      "Backend processing runs tempo analysis and returns practice metrics.",
      "UI overlays tempo guidance for targeted repetition.",
    ],
    challenges: [
      "Syncing waveform selection with backend analysis boundaries.",
      "Balancing analysis latency with smooth interaction flow.",
    ],
    lessonsLearned: [
      "Niche tools can be valuable if they remove repetitive friction.",
      "UX clarity matters as much as model/output quality.",
    ],
    technicalNotes: [
      "Future direction includes richer loop controls and movement-aware cues.",
    ],
    tags: ["signal-processing", "audio", "fullstack", "dance"],
    signal: "Signal + Web",
  }),
  normalizeProject({
    id: "P08",
    title: "Arduino TFT Tetris",
    slug: "arduino-tetris",
    featured: false,
    category: "embedded",
    status: "shipped",
    oneLine: "Bare-metal handheld Tetris on Arduino Nano + ST7735 display.",
    overview:
      "I built this to practice embedded game loops and real hardware debugging. Everything runs on-device: rendering, input handling, collision checks, scoring, and sound cues.",
    techStack: ["Arduino Nano", "C++", "ST7735", "SPI", "Adafruit GFX"],
    githubUrl: "https://github.com/Rellendula26/arduino-tetris",
    demoVideoUrl: "/projects/arduinotetris.mp4",
    thumbnail: "/projects/tetrissettup.jpg",
    images: ["/projects/initialmaterials.jpg", "/projects/tetrissettup.jpg", "/projects/gallery/arduino-tetris-gameplay.svg"],
    date: "2026",
    buildStage: "Playable prototype complete",
    keyHighlights: [
      "Real-time game loop with falling pieces and collision logic.",
      "SPI display pipeline tuned for constrained hardware.",
      "Physical button controls with debounce handling.",
    ],
    architecture: [
      "Main loop handles input, state update, collision, and redraw.",
      "Grid/tetromino state stored in compact board representation.",
      "Piezo signals triggered on key events like line clear/lock.",
    ],
    challenges: [
      "Intermittent display issues required solder-level debugging.",
      "ST7735 initialization quirks varied by panel variant.",
      "Rendering performance had to be tuned to keep controls responsive.",
    ],
    lessonsLearned: [
      "Hardware faults and software bugs are tightly coupled in embedded work.",
      "Prototype staging (two-button dev setup first) reduced risk a lot.",
    ],
    technicalNotes: [
      "Potential upgrades: rotation polish, difficulty ramps, enclosure design.",
    ],
    media: [
      { kind: "video", src: "/projects/fixingtetrissolder.mp4", alt: "Display solder fixes", label: "Display bring-up" },
      { kind: "video", src: "/projects/twobuttonandcomputertetrist.mp4", alt: "Control prototype", label: "Control prototype" },
    ],
    tags: ["embedded", "game-loop", "hardware-debugging", "spi"],
    signal: "Embedded",
  }),
  normalizeProject({
    id: "P09",
    title: "Bhangra Coach",
    slug: "bhangra-coach",
    featured: false,
    category: "ml",
    status: "in-progress",
    oneLine: "Computer vision dance coach with pose comparison feedback.",
    overview:
      "This project explores whether movement feedback can feel useful instead of robotic. The pipeline compares user dance clips against references and surfaces actionable differences.",
    techStack: ["Next.js", "FastAPI", "MediaPipe", "Supabase", "Computer Vision"],
    githubUrl: "https://github.com/Rellendula26/bhangra-coach",
    liveUrl: "https://bhangra-coach.vercel.app",
    demoVideoUrl: "/projects/coverbhangraform.mp4",
    thumbnail: "/projects/bc1.png",
    images: ["/projects/bc1.png"],
    date: "2026",
    buildStage: "Actively iterating on feedback quality",
    keyHighlights: [
      "Pose landmark extraction across user and reference clips.",
      "Temporal alignment layer for movement comparison.",
      "Full-stack upload, processing, and feedback interface.",
    ],
    architecture: [
      "Frontend handles upload and review flow.",
      "FastAPI service computes landmark and delta metrics.",
      "Supabase stores clip metadata and processing outputs.",
    ],
    challenges: [
      "Movement alignment is hard when tempo differs between performers.",
      "Raw pose deltas needed interpretation to become useful coaching cues.",
    ],
    lessonsLearned: [
      "Feedback UX is as important as model pipeline quality.",
      "Domain context (dance technique) matters for feature design.",
    ],
    technicalNotes: ["Current focus is improving robustness across camera angles and lighting."],
    tags: ["computer-vision", "ml", "fullstack", "product-iteration"],
    signal: "CV + ML",
  }),
  normalizeProject({
    id: "P10",
    title: "Penn Plates",
    slug: "pennplates",
    featured: false,
    category: "fullstack",
    status: "shipped",
    oneLine: "Campus dining social app built through Penn SPARK.",
    overview:
      "A real product-focused build with practical constraints, team collaboration, and user-oriented iteration. The goal was connecting students around dining in a way that felt lightweight and usable.",
    techStack: ["Next.js", "Supabase", "React"],
    demoVideoUrl: "/projects/pennplates.mp4",
    thumbnail: "/projects/website-1.png",
    images: ["/projects/website-1.png"],
    date: "2026",
    buildStage: "Demo-ready build completed",
    keyHighlights: [
      "Auth and profile experience grounded in Supabase RLS.",
      "Product iteration driven by student use cases.",
    ],
    architecture: [
      "Next.js client with Supabase-backed auth and data access.",
      "Feature set optimized for practical student interaction loops.",
    ],
    challenges: [
      "Balancing feature ambition with limited project timeline.",
      "Keeping UX simple while still supporting social coordination.",
    ],
    lessonsLearned: [
      "Shipping on time is often a bigger challenge than coding features.",
      "Product clarity usually beats feature density.",
    ],
    technicalNotes: ["Good reminder that systems thinking applies to product scope too."],
    tags: ["fullstack", "product", "student-build"],
    signal: "Product",
  }),
  normalizeProject({
    id: "P11",
    title: "Portfolio Website",
    slug: "website",
    featured: false,
    category: "fullstack",
    status: "iterating",
    oneLine: "This site, built as an evolving engineering journal.",
    overview:
      "I treat this as a living system instead of a static portfolio. The project section itself now runs from reusable data so future additions are faster and more consistent.",
    techStack: ["Next.js", "React", "Tailwind", "Framer Motion"],
    githubUrl: "https://github.com/Rellendula26/ritvik-portfolio",
    thumbnail: "/projects/website-cover.png",
    images: ["/projects/website-cover.png", "/projects/website-1.png", "/projects/website-2.png"],
    date: "2025-2026",
    buildStage: "Continuous iteration",
    keyHighlights: [
      "Reusable card and detail layouts across projects.",
      "Media support for images, videos, and generated visuals.",
      "Structured project data model for scalable updates.",
    ],
    architecture: [
      "Centralized project objects power home cards, list page, and detail pages.",
      "Components handle mixed media without custom per-project UI work.",
    ],
    challenges: [
      "Keeping the site personal while scaling structure and consistency.",
    ],
    lessonsLearned: [
      "A portfolio should show process, not just polished outcomes.",
    ],
    technicalNotes: [
      "This system is intentionally set up so adding projects is mostly data entry.",
    ],
    media: [{ kind: "visual", visualId: "portfolio-preview", alt: "Portfolio preview visual", label: "Site preview" }],
    tags: ["meta", "design-system", "documentation"],
    signal: "Meta",
  }),
  normalizeProject({
    id: "P12",
    title: "3D Brain Model",
    slug: "brain",
    featured: false,
    category: "cad",
    status: "archived",
    oneLine: "Anatomical 3D brain model built and printed from Maya.",
    overview:
      "An earlier project that taught me a lot about turning conceptual anatomy into tangible physical models and labels.",
    techStack: ["Maya", "CAD", "3D Printing"],
    thumbnail: "/projects/brain-1.png",
    images: ["/projects/brain-1.png"],
    date: "High School",
    buildStage: "Archived",
    keyHighlights: ["Modeled gyri/sulci forms and produced a physical labeled print."],
    architecture: ["Digital sculpting workflow -> print preparation -> physical labeling."],
    challenges: ["Maintaining anatomical clarity while keeping print geometry stable."],
    lessonsLearned: ["Physical artifacts force precision in a different way than software."],
    technicalNotes: ["Preserved here as early evidence of build curiosity."],
    tags: ["cad", "3d-print", "neuroscience"],
    signal: "CAD",
  }),
  normalizeProject({
    id: "P13",
    title: "Health Outcomes Analysis",
    slug: "OIDD",
    featured: false,
    category: "data",
    status: "archived",
    oneLine: "Socioeconomic health outcomes analysis for an OIDD capstone.",
    overview:
      "Course project using statistical and ML tooling to analyze relationships between socioeconomic factors and poor health outcomes.",
    techStack: ["Python", "Pandas", "Seaborn", "Decision Trees"],
    thumbnail: "/projects/OIDD.png",
    images: ["/projects/OIDD.png"],
    date: "Course project",
    buildStage: "Archived",
    keyHighlights: ["Data cleaning, visualization, and model exploration in one analysis workflow."],
    architecture: ["Dataset prep -> feature analysis -> model fitting -> interpretation."],
    challenges: ["Balancing statistical rigor with interpretable outputs under course timeline."],
    lessonsLearned: ["Communicating assumptions is as important as model performance."],
    technicalNotes: ["Included for context, not as a flagship engineering project."],
    tags: ["data", "analysis", "coursework"],
    signal: "Data",
  }),
];

function normalizeIntakeProject(
  input: Partial<Project> &
    Pick<
      Project,
      | "title"
      | "slug"
      | "category"
      | "status"
      | "oneLine"
      | "overview"
      | "techStack"
      | "thumbnail"
      | "images"
      | "date"
      | "buildStage"
      | "keyHighlights"
      | "architecture"
      | "challenges"
      | "lessonsLearned"
      | "technicalNotes"
    >
): Project {
  return normalizeProject({
    id: input.id ?? `I-${input.slug}`,
    title: input.title,
    slug: input.slug,
    featured: input.featured ?? false,
    category: input.category,
    status: input.status,
    oneLine: input.oneLine,
    overview: input.overview,
    techStack: input.techStack,
    githubUrl: input.githubUrl,
    liveUrl: input.liveUrl,
    demoVideoUrl: input.demoVideoUrl,
    thumbnail: input.thumbnail,
    images: input.images,
    date: input.date,
    buildStage: input.buildStage,
    keyHighlights: input.keyHighlights,
    architecture: input.architecture,
    challenges: input.challenges,
    lessonsLearned: input.lessonsLearned,
    technicalNotes: input.technicalNotes,
    nextImprovements: input.nextImprovements,
    buildNotes: input.buildNotes,
    debuggingNotes: input.debuggingNotes,
    architectureImages: input.architectureImages,
    imageGallery: input.imageGallery,
    videoGallery: input.videoGallery,
    driveFolderUrl: input.driveFolderUrl,
    finalOutcome: input.finalOutcome,
    intakeSourcePath: input.intakeSourcePath,
    media: input.media,
    tags: input.tags ?? [input.category, "intake"],
    signal: input.signal ?? "Build",
  });
}

const INTAKE_PROJECTS: Project[] = (GENERATED_INTAKE_PROJECTS as Partial<Project>[]).map(
  (project) =>
    normalizeIntakeProject(
      project as Partial<Project> &
        Pick<
          Project,
          | "title"
          | "slug"
          | "category"
          | "status"
          | "oneLine"
          | "overview"
          | "techStack"
          | "thumbnail"
          | "images"
          | "date"
          | "buildStage"
          | "keyHighlights"
          | "architecture"
          | "challenges"
          | "lessonsLearned"
          | "technicalNotes"
        >
    )
);

export const PROJECTS: Project[] = [...BASE_PROJECTS, ...INTAKE_PROJECTS];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);
export const SUPPORTING_PROJECTS = PROJECTS.filter(
  (project) => !project.featured && project.status !== "archived"
);
export const ARCHIVE_PROJECTS = PROJECTS.filter((project) => project.status === "archived");

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
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

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  iterating: "Iterating",
  archived: "Archived",
};
