import GENERATED_INTAKE_PROJECTS from "@/data/projects.generated.json";
import type { ProjectBrief } from "@/data/project-brief";
import { PROJECT_BRIEFS } from "@/data/project-briefs";
import { projectVideo } from "@/data/project-media";

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
      /** cover crops to the frame. contain keeps schematics and plots whole. */
      fit?: "cover" | "contain";
      featured?: boolean;
      priority?: number;
      /** Tall subject. The hero uses a portrait frame instead of 16:9. */
      portrait?: boolean;
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
      /** Phone-shot clip. Hero uses a tall frame instead of a wide one with side bars. */
      portrait?: boolean;
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
  /** When true, project is listed only in local development — hidden from production builds. */
  devOnly?: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  oneLine: string;
  /** Project-page lead. Homepage cards keep using oneLine. */
  pageLead?: string;
  overview: string;
  techStack: string[];
  /** When set, hero meta shows these under "Disciplines" instead of Stack. */
  disciplines?: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Optional second CTA for a YouTube demo/skit when liveUrl is already used. */
  youtubeUrl?: string;
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
  /** Opening hero shows these photos together, each with its own label. */
  heroFrames?: Array<{ src: string; alt: string; label: string }>;
  tags: string[];
  href: string;
  signal: string;
  /** Parent experience slug, when this build happened inside a role. */
  experienceSlug?: string;
  /** One specific thing I did, shown on cards. Falls back to the first highlight. */
  contribution?: string;
  /** Short visual summary at the bottom of the project page. */
  brief?: ProjectBrief;
  /**
   * Documentation state, separate from `status`.
   * A project can be in progress in the lab while the page write-up is still short.
   */
  writeUp?: "published" | "coming-soon";
  /**
   * Featured badge on the detail hero.
   * Does not add the project to the homepage featured band. That band uses `featured`.
   */
  pageFeatured?: boolean;
  /** Hero meta row. The directory card still prints `signal` as the org line. */
  course?: string;
  /** Directory-card tech chips. Defaults to 5 so other cards stay as they are. */
  cardTechLimit?: number;
  /** PDF or note linked from the card, the hero, and the glance. */
  documentLink?: { href: string; cardLabel: string; heroLabel: string };
  /** Page metadata when it should not follow `pageLead`. */
  seo?: { title: string; description: string; image: string; imageAlt: string };
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
  const safeThumbnail =
    input.writeUp === "coming-soon"
      ? input.thumbnail || ""
      : input.thumbnail || SAFE_MEDIA_FALLBACK;
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

  if (input.writeUp !== "coming-soon" && !media.some((item) => item.kind === "image" || item.kind === "video")) {
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

  const brief = PROJECT_BRIEFS[input.slug];
  if (!brief) {
    throw new Error(`Missing project brief for ${input.slug}`);
  }

  return {
    ...input,
    demoVideoUrl: safeDemoVideoUrl,
    thumbnail: safeThumbnail,
    images: safeImages,
    href: `/projects/${input.slug}`,
    media,
    brief,
  };
}

export function pickProjectPrimaryMedia(project: Project): ProjectMedia | undefined {
  const explicitVisual = project.media.find((item) => item.kind === "visual");
  if (explicitVisual) return explicitVisual;

  const fromExplicitHero = project.media.find(
    (item) => item.kind === "visual" || item.mediaType === "demo"
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
    oneLine:
      "OCaml compiler from a supported C subset to runnable x86-64, with TACKY IR and instruction fixups in between.",
    overview:
      "I got tired of treating compilers like magic, so I started building one. Nora Sandler's book gave me the roadmap; I wrote the passes myself. Lexer and parser into an AST, then TACKY to flatten nested expressions, then stack-backed x86 with a fixup pass when memory-to-memory ops are illegal. Right now it honestly covers return constants and nested unaries like return ~(-2);. Broader C is next, but only after each stage stays correct.",
    techStack: [
      "OCaml",
      "Recursive Descent",
      "AST",
      "Semantic Analysis",
      "TACKY IR",
      "x86-64",
      "AT&T Syntax",
      "Make",
      "Testing",
    ],
    githubUrl: "https://github.com/Rellendula26/c-compiler",
    thumbnail: "/projects/gallery/c-compiler-pipeline.svg",
    images: [
      "/projects/gallery/c-compiler-pipeline.svg",
      "/projects/gallery/c-compiler-source.svg",
      "/projects/gallery/c-compiler-ast.svg",
      "/projects/gallery/c-compiler-tacky.svg",
      "/projects/gallery/c-compiler-asm.svg",
    ],
    date: "Spring 2026",
    buildStage: "In development",
    disciplines: ["Frontend", "IR", "Backend", "Testing"],
    keyHighlights: [
      "Recursive-descent parser that handles nested unaries like return ~(-2);",
      "TACKY IR so nested expressions become temporaries before touching x86",
      "Backend fixups rewrite illegal memory-to-memory ops through %r10d",
    ],
    architecture: [
      "Lexer tokenizes source into typed tokens.",
      "Parser builds AST; resolve/label passes make names and control targets explicit.",
      "TACKY IR flattens expressions before architecture-specific codegen.",
      "Emitter outputs AT&T x86-64 with fixups, then assembler/linker produce an executable.",
    ],
    challenges: [
      "Direct AST-to-assembly stopped scaling once expressions nested.",
      "Memory-to-memory x86 forms required an explicit scratch-register fixup pass.",
      "Apple Silicon hosts need explicit x86-64 target handling for generated binaries.",
    ],
    lessonsLearned: [
      "The hard part is keeping the program's meaning while it moves from C to assembly.",
      "A test on one pass finds the bug faster than only running the finished compiler.",
      "When the output is wrong, I read the assembly.",
    ],
    technicalNotes: [
      "Honest scope today: return constants and nested unaries in official tests; broader C is incremental.",
      "Correctness and clean lowering before optimization or register allocation.",
    ],
    media: [
      {
        kind: "visual",
        visualId: "compiler-pipeline",
        alt: "Compiler pipeline visual",
        label: "Pipeline visual",
        mediaType: "visual",
        featured: true,
        priority: 20,
      },
      {
        kind: "image",
        src: "/projects/gallery/c-compiler-pipeline.svg",
        alt: "End-to-end compiler pipeline",
        label: "E2E pipeline",
        mediaType: "diagram",
      },
      { kind: "image", src: "/projects/gallery/c-compiler-ast.svg", alt: "Compiler AST output", label: "AST output" },
      { kind: "image", src: "/projects/gallery/c-compiler-asm.svg", alt: "Generated assembly output", label: "Assembly output" },
    ],
    tags: [
      "OCaml",
      "Recursive Descent",
      "AST",
      "Semantic Analysis",
      "TACKY IR",
      "x86-64",
      "AT&T Syntax",
      "Make",
      "Testing",
    ],
    signal: "Compiler Systems",
  }),
  normalizeProject({
    id: "P02",
    title: "MiniTorch-OCaml",
    slug: "minitorch-ocaml",
    featured: true,
    category: "ml",
    status: "iterating",
    oneLine:
      "Reverse-mode autodiff in OCaml. The forward pass builds a graph, backpropagation fills the gradients, and I check them with finite differences.",
    overview:
      "Framework backprop always felt like a black box, so I wrote my own. Nodes store values, grads, parents, and ops. Forward grows the graph; backward walks it. Most bugs do not show up in the forward pass; they show up when a shared node silently gets the wrong accumulated gradient. Finite-difference gradcheck is what I trust. The tiny MLP with SGD/Adam is just a smoke test that the pieces still talk to each other.",
    techStack: ["OCaml", "Autodiff", "Computation Graphs", "Gradient Checking", "SGD/Adam"],
    githubUrl: "https://github.com/Rellendula26/minitorch-ocaml",
    thumbnail: "/projects/gallery/minitorch-graph.svg",
    images: [
      "/projects/gallery/minitorch-graph.svg",
      "/projects/gallery/minitorch-forward.svg",
      "/projects/gallery/minitorch-backprop.svg",
      "/projects/gallery/minitorch-gradcheck.svg",
    ],
    date: "Spring 2026",
    buildStage: "In development",
    disciplines: ["Graph Construction", "Reverse-Mode AD", "Numerical Validation"],
    keyHighlights: [
      "Graph nodes with values, grads, parents, and op metadata for reverse-mode",
      "Backward rules for arithmetic, activations, reductions, transpose, and matmul",
      "Central-difference gradchecks before I believe any training curve",
    ],
    architecture: [
      "Tensor ops construct a directed graph during the forward pass.",
      "Backward traversal propagates gradients through parent references.",
      "Optimizer updates parameters from accumulated gradients.",
    ],
    challenges: [
      "Gradient bugs rarely show in forward outputs.",
      "Shared subgraphs require accumulation, not overwrite.",
      "API had to stay small while remaining extensible.",
    ],
    lessonsLearned: [
      "A gradient can be wrong even when the forward numbers look fine, so I check it against finite differences.",
      "The types catch a broken graph. They do not catch a wrong derivative.",
      "A falling loss tells me the pieces are connected. The finite-difference check is what tells me the math is right.",
    ],
    technicalNotes: [
      "New operators should ship with forward, backward, and gradcheck.",
      "Vectorized backend waits until the core operator set is stable.",
    ],
    media: [
      {
        kind: "visual",
        visualId: "minitorch-autodiff",
        alt: "MiniTorch autodiff visual",
        label: "Autodiff visual",
        mediaType: "visual",
        featured: true,
        priority: 20,
      },
      { kind: "image", src: "/projects/gallery/minitorch-backprop.svg", alt: "Backprop flow", label: "Backprop flow" },
      { kind: "image", src: "/projects/gallery/minitorch-gradcheck.svg", alt: "Gradient check", label: "Gradcheck" },
    ],
    tags: ["ml-systems", "autodiff", "ocaml", "backprop", "gradcheck"],
    signal: "ML Systems",
  }),
  normalizeProject({
    id: "P03",
    title: "BloomBot IoT",
    slug: "bloombot",
    featured: true,
    category: "embedded",
    status: "shipped",
    oneLine:
      "IoT flower for long-distance check-ins: proximity opens the bloom, and remote messages blink out in Morse on an LED heart.",
    overview:
      "The idea was simple: people far apart should still have something physical to share. BloomBot lives on an Arduino UNO R4 WiFi with Blynk. Get close and an ultrasonic sensor drives the servos to open the flower. Send a message from the app and an LED heart inside blinks that message in Morse. LCD output helps when I cannot sit on serial during a demo. The cute part is the flower. The hard part was WiFi, the sensor, Morse timing, and servo current peaks on one board without browning the rail out.",
    techStack: ["Arduino UNO R4 WiFi", "Blynk", "WiFiS3", "Servos", "Ultrasonic", "I2C LCD"],
    githubUrl: "https://github.com/Rellendula26/bloombot-iot",
    liveUrl: "https://devpost.com/software/bloombot-8syfva",
    youtubeUrl: "https://www.youtube.com/watch?v=D3Kk4IFN1ps",
    demoVideoUrl: "/projects/bloombot-web.mp4",
    thumbnail: "/projects/bloombot-poster.jpg",
    images: ["/projects/bloombot-poster.jpg"],
    date: "Spring 2026",
    buildStage: "Working prototype",
    disciplines: [
      "Electromechanical Actuation",
      "Embedded Control",
      "Wireless Integration",
      "Power & Packaging",
    ],
    keyHighlights: [
      "Ultrasonic proximity opens the flower through coordinated servo motion",
      "Remote Blynk messages blink on an interior LED heart in Morse code",
      "Shipped a public demo after fixing brownouts and timing under concurrent servo load",
    ],
    architecture: [
      "Ultrasonic distance gates the open/close servo sequence for the bloom.",
      "Blynk message handlers encode text into Morse and drive the LED heart.",
      "LCD status keeps the interaction readable without a laptop on the floor.",
    ],
    challenges: [
      "Power rails brown out under concurrent servo peaks without margin and sequencing.",
      "Demo WiFi needs retry logic, not optimism.",
      "Timing collisions appear when actuators and sensing share one loop carelessly.",
    ],
    lessonsLearned: [
      "The servos pulled the rail down when they moved together, so I had to sequence them and leave some current margin.",
      "I rehearsed the WiFi failures before the demo. A retry in the code is not the same as a dead network in the room.",
      "The LCD let me see what the flower was doing without a laptop on the floor.",
    ],
    technicalNotes: [
      "Next: cleaner enclosure/harness and smoother interpolation.",
      "Optional sentiment-driven motion maps later.",
    ],
    media: [
      projectVideo("bloombot"),
      {
        kind: "video",
        src: "/projects/makingbloombot-web.mp4",
        alt: "Building BloomBot",
        label: "Build process",
        poster: "/projects/bloombot-poster.jpg",
        mediaType: "process",
      },
    ],
    tags: ["iot", "embedded", "robotics", "mechatronics", "integration"],
    signal: "Embedded Robotics",
  }),
  normalizeProject({
    id: "P04",
    title: "Analog Electromechanical Lightsaber",
    slug: "saber",
    featured: true,
    category: "hardware",
    status: "shipped",
    oneLine:
      "A handheld saber from Detkin Lab. An NE555 and a PN2222A make the sound, and the blade is an LED strip on a switched 9 V pack.",
    overview:
      "I built this so it could leave the breadboard: a printed hilt, emitter, and battery carrier, plus a discrete audio circuit and an LED blade, soldered with 40+ through-hole joints. The circuit was the easy part. The polycarbonate blade acts like a lever, and that bending load broke the printed hilt twice. I changed the hilt geometry. A short LED lead after final assembly meant I had to salvage a pad, because there was no spare strip.",
    techStack: [
      "Fusion 360",
      "3D Printing",
      "NE555",
      "PN2222A",
      "Perfboard",
      "Through-hole Soldering",
      "LED Strip",
      "9V Power",
      "Oscillator Design",
    ],
    liveUrl: "https://youtu.be/iIqSYOqp9UE",
    demoVideoUrl: "/projects/lightsaber/fullsaber-web.mp4",
    thumbnail: "/projects/lightsaber/saberwhite.png",
    images: [
      "/projects/lightsaber/saberwhite.png",
      "/projects/lightsaber/breadboardaudiocircuit.png",
      "/projects/lightsaber/perfboardaudiocircuit.png",
    ],
    date: "Spring 2026",
    buildStage: "Working prototype",
    disciplines: [
      "Mechanical Design",
      "Analog Circuit Design",
      "Electrical Integration",
      "Manufacturing",
      "Product Engineering",
    ],
    keyHighlights: [
      "The blade broke the printed hilt twice at the root. I changed the hilt geometry instead of adding glue.",
      "Designed and assembled a discrete analog audio circuit using an NE555 timer, RC timing network, and PN2222A transistor to generate sound alongside LED blade illumination",
      "Transitioned from breadboard validation to a soldered perfboard assembly with 40+ through-hole joints, improving durability, electrical reliability, and portability",
    ],
    architecture: [
      "9V through a hilt switch, then split to LED strip and analog audio.",
      "NE555 astable into RC timing, PN2222A driver, 8Ω speaker.",
      "Printed hilt, emitter, and battery carrier package the harness under impact loads.",
    ],
    challenges: [
      "Polycarbonate blade as a lever arm concentrated bending moment at the printed hilt.",
      "LED strip lead too short after final assembly; no replacement strip available.",
      "Measured NE555 sweep disagreed with the textbook RC prediction.",
    ],
    lessonsLearned: [
      "The circuit was the easy part. The blade bent the printed hilt until I changed the geometry.",
      "Glue would not have fixed a load that was already in the wrong place.",
      "The LED lead was too short after assembly, so I had to salvage the pad.",
    ],
    technicalNotes: [
      "Detkin Lab build; whiteboard circuit plan through lab checkout.",
      "Next revision: cleaner internal harness and battery optimization.",
    ],
    media: [projectVideo("saber")],
    tags: [
      "Fusion 360",
      "3D Printing",
      "NE555",
      "PN2222A",
      "Perfboard",
      "Soldering",
      "LED Strip",
      "Analog",
    ],
    signal: "Electromechanical Systems",
  }),
  normalizeProject({
    id: "P16",
    title: "Automatic Tennis Ball Shooter",
    slug: "tennis-ball-shooter",
    featured: true,
    category: "embedded",
    status: "shipped",
    oneLine:
      "A BrainChild tennis-ball launcher. An ESP32 sequences two RS-775 flywheels and a NEMA 17 feed from a Replit app.",
    overview:
      "I moved sequencing off an Arduino Mega onto an ESP32 for a BrainChild demo. MOSFET modules switch the flywheels. A NEMA 17 on an A4988 indexes the balls. A fused 12 V pack feeds the motors, and a buck makes about 5 V for the ESP32 board's VIN. The chip itself runs at 3.3 V. The bench demo runs from the Replit app. A later PWM test left a flywheel much faster than commanded, the fuse did not open, pack-side joints detached, and a wire's insulation melted. I did not measure the current.",
    techStack: [
      "ESP32",
      "C++",
      "NEMA 17 Stepper",
      "A4988",
      "RS-775 DC Motors",
      "MOSFET Modules",
      "PWM",
      "Buck Converter",
      "Fuse Protection",
      "Breadboard",
      "CAD",
      "3D Printing",
      "Replit",
    ],
    disciplines: [
      "Embedded Systems",
      "Electrical Engineering",
      "Mechanical Design",
      "Power Electronics",
      "Robotics",
    ],
    liveUrl:
      "https://ee4462e9-ad7c-4104-ad14-777a0503092c-00-3mxmj40uiv8vv.worf.replit.dev/",
    thumbnail: "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
    images: [
      "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
      "/projects/tennis-ball-shooter/chassis.jpg",
      "/projects/tennis-ball-shooter/buck-converter.jpg",
      "/projects/tennis-ball-shooter/connection-diagram.jpg",
      "/projects/tennis-ball-shooter/burned-wire.jpg",
    ],
    demoVideoUrl: "/projects/tennis-ball-shooter/demo-with-app.mp4",
    date: "2025–2026",
    buildStage: "Working prototype",
    keyHighlights: [
      "PWM into MOSFET modules sets the flywheel voltage waveform. Speed still depends on the motor and the load.",
      "Fused 12 V for the motors. A buck feeds about 5 V to the ESP32 board. The chip runs at 3.3 V.",
      "The Replit app sequences the feed and the flywheels on the bench.",
    ],
    architecture: [
      "Replit UI → ESP32 → MOSFET PWM + A4988 → RS-775s / NEMA 17 → feed + launch.",
      "12 V pack → fuse → MOSFET / VMOT; buck → 5 V for ESP32 and driver logic.",
      "PWM hard-switches the pack across the motor; inductance averages the pulses.",
    ],
    challenges: [
      "Without the buck, the ESP32 board would not run from the 12 V pack.",
      "A PWM test left a flywheel much faster than commanded. The fuse did not open, pack-side joints came off, and insulation melted. No current measurement, so the cause is not established.",
      "First 3D-printed stepper interface was too flimsy and poorly fastened under load.",
    ],
    lessonsLearned: [
      "PWM changes the voltage waveform applied to the motor. Actual speed also depends on load and the motor.",
      "An open joint interrupts that path. Melted insulation still needs a measured cause, and I don't have one.",
      "A soft print makes STEP/DIR look guilty. Raise infill before rewriting the ISR.",
    ],
    technicalNotes: [
      "BrainChild Engineering client prototype, not production-ready.",
      "Next: custom interface PCB, fuse/fault validation, closed-loop sensing, hardened feed mechanics.",
    ],
    nextImprovements: [
      "Custom PCB for power / motor interface with deliberate fuse and flyback paths",
      "Stuck-high MOSFET / overspeed fault testing",
      "Closed-loop launch / feed sensing",
    ],
    media: [
      {
        kind: "video",
        src: "/projects/tennis-ball-shooter/demo-with-app.mp4",
        alt: "Tennis ball shooter controlled from the Replit web app",
        label: "App demo",
        poster: "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
        mediaType: "demo",
        featured: true,
        priority: 10,
        caption:
          "BrainChild client demo path: Replit UI into the ESP32 launcher stack.",
      },
      {
        kind: "video",
        src: "/projects/tennis-ball-shooter/app-interface.mp4",
        alt: "Replit TENNIS control interface on a laptop",
        label: "Control UI",
        mediaType: "process",
        caption:
          "Replit app: LIVE rail readout, pace presets, START FEED, emergency stop.",
      },
      {
        kind: "video",
        src: "/projects/tennis-ball-shooter/post-motor-overspeed.mp4",
        alt: "Bench after motor overspeed and joint failure",
        label: "Overspeed aftermath",
        mediaType: "process",
        caption:
          "After the PWM test: the fuse did not open, pack-side joints came off, and this conductor's insulation melted.",
      },
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/burned-wire.jpg",
        alt: "Charred melted yellow wire from overspeed event",
        label: "Melted wire",
        mediaType: "image",
        caption: "Insulation after the pack-side joint failed during overspeed.",
      },
    ],
    tags: [
      "ESP32",
      "BrainChild",
      "MOSFET",
      "PWM",
      "Buck Converter",
      "Fuse",
      "3D Printing",
      "Robotics",
    ],
    signal: "Electromechanical Systems",
  }),
  normalizeProject({
    id: "P15",
    title: "Custom Arduino Sensor PCB",
    slug: "ultrasonic-pcb",
    featured: false,
    category: "hardware",
    status: "shipped",
    oneLine:
      "First complete PCB: KiCad schematic through two-layer layout and Gerbers for an Arduino Nano, HC-SR04, and status LED.",
    overview:
      "I built this to learn the real board house pipeline, not to invent a fancy circuit. Custom HC-SR04 footprint from measured dimensions, two-layer routing with a ground plane, DRC, then Gerber and Excellon export for PCBWay. Breadboards were familiar. Owning symbols, copper, mask, and fab files was the point.",
    techStack: [
      "KiCad",
      "Arduino Nano",
      "HC-SR04",
      "Through-Hole PCB",
      "Gerber",
      "PCBWay",
    ],
    thumbnail: "/projects/ultrasonic-pcb/final-3d-render.png",
    images: [
      "/projects/ultrasonic-pcb/final-3d-render.png",
      "/projects/ultrasonic-pcb/pcb-editor.png",
      "/projects/ultrasonic-pcb/schematic.png",
      "/projects/ultrasonic-pcb/ultrasonic-symbol.png",
      "/projects/ultrasonic-pcb/pre-trace-3d.png",
    ],
    date: "Summer 2026",
    buildStage: "Fabrication files ready",
    disciplines: [
      "PCB Design",
      "Electrical Design",
      "Manufacturing Prep",
    ],
    keyHighlights: [
      "Designed my first complete PCB from schematic capture through fab-ready Gerbers",
      "Built a custom KiCad footprint for the HC-SR04 from measured dimensions",
      "Routed a two-layer board with ground plane, DRC, and PCBWay export",
    ],
    architecture: [
      "Arduino Nano as the controller footprint on a through-hole board.",
      "Custom four-pin HC-SR04 footprint plus status LED and power/signal routing.",
      "Two-layer copper with ground plane; Gerber + Excellon package for fab.",
    ],
    challenges: [
      "Stock connector footprints did not match the real ultrasonic module.",
      "First pass learning copper layers, plated holes, mask, and silkscreen as constraints.",
      "Missing a Gerber layer would fail silently at the board house.",
    ],
    lessonsLearned: [
      "The circuit was simple. Getting a footprint, a board outline, and Gerbers out was the actual work.",
      "A custom footprint is what lets the part sit on the pads I drew.",
      "The 3D view is where a part can pass the electrical checks and still not fit.",
    ],
    technicalNotes: [
      "Electrically intentional simple; process was the goal.",
      "Populate and bring up after boards return from fab.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/final-3d-render.png",
        alt: "Final 3D render of the ultrasonic sensor PCB",
        label: "Final 3D render",
        mediaType: "image",
        featured: true,
        priority: 20,
      },
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/pcb-editor.png",
        alt: "KiCad PCB editor routed board",
        label: "PCB layout",
      },
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/schematic.png",
        alt: "KiCad schematic",
        label: "Schematic",
      },
    ],
    tags: ["kicad", "pcb", "hardware", "ultrasonic", "arduino", "gerber"],
    signal: "PCB Design",
  }),
  normalizeProject({
    id: "P18",
    title: "PER Power Electronics Design Challenge",
    slug: "per-power-electronics",
    featured: true,
    category: "hardware",
    status: "shipped",
    oneLine:
      "A Penn Electric Racing recruiting circuit, not a part on the car. Brake and current both have to cross a threshold before an indicator trips.",
    overview:
      "I worked this circuit for the recruiting challenge. Comparators turn the brake and current signals into yes-or-no levels, then logic and a timing network drive the indicator. I first treated 0.5 s as a minimum delay. The written requirement is a maximum response time, so a delay that looks fine can still miss the window. I don't have a pass or fail number for the revised timing. For the 12–17 V to 5 V rail I compared the LM5164 and the LMR33630 on current headroom, ripple, EMI, and the package, not on whether the label said 5 V.",
    contribution:
      "I first read 0.5 s as a minimum delay. The requirement is a maximum response time. There is no pass or fail number on this page for that timing.",
    techStack: [
      "Power Electronics",
      "Circuit Design",
      "Comparators",
      "Buck Converters",
      "EMI",
      "CircuitLab",
    ],
    thumbnail: "/projects/per-power-electronics/cover.svg",
    images: [
      "/projects/per-power-electronics/cover.svg",
      "/projects/per-power-electronics/schematic.jpg",
      "/projects/per-power-electronics/transient-analysis.jpg",
      "/projects/per-power-electronics/ic-selection-p01.jpg",
    ],
    date: "Fall 2026",
    buildStage: "Analysis complete",
    disciplines: [
      "Power Electronics",
      "Circuit Design",
      "Engineering Design Challenge",
    ],
    keyHighlights: [
      "Comparator path converts brake/current analog signals into digital threshold decisions before logic gating",
      "Timing analysis centered on the 0.5 s response constraint and caught an early requirement misread",
      "Buck selection compared LM5164 vs LMR33630 around current headroom, ripple, EMI behavior, and package/thermal tradeoffs",
    ],
    architecture: [
      "12 V automotive-style supply into regulated low-voltage rail.",
      "Brake and current sensing into comparator thresholds.",
      "Logic + timing into indicator.",
    ],
    challenges: [
      "Response-time wording is easy to misread as a minimum delay.",
      "A 5 V label does not guarantee a quiet or stiff rail.",
    ],
    lessonsLearned: [
      "Picking a 5 V buck meant comparing current, ripple, and EMI, not just reading the voltage on the label.",
      "I first read 0.5 s as a minimum delay. The requirement is a maximum response time.",
    ],
    technicalNotes: [
      "Recruitment challenge · independent analysis.",
      "Datasheet cells stay blank where the sheet did not give a number.",
    ],
    tags: [
      "Power Electronics",
      "Circuit Design",
      "Comparators",
      "Buck Converters",
      "EMI",
      "CircuitLab",
      "PER",
      "Design Challenge",
    ],
    signal: "Power Electronics · Design Challenge",
  }),
  normalizeProject({
    id: "P19",
    title: "Hyperloop VFD Design Challenge",
    slug: "hyperloop-vfd",
    featured: false,
    category: "hardware",
    status: "shipped",
    oneLine:
      "Analyzed a three-phase variable-frequency drive from AC rectification through DC-link energy storage and PWM inverter control.",
    overview:
      "Independent engineering analysis for Penn Hyperloop's recruitment process; this is not Hyperloop vehicle hardware. Maps 480 V three-phase AC through a diode rectifier, DC link, and PWM inverter so motor frequency/voltage control is understandable as a chain of energy conversions, with PWM carrier kept distinct from fundamental output frequency.",
    techStack: [
      "Power Electronics",
      "VFD",
      "Three-Phase AC",
      "PWM",
      "Motor Control",
      "Power Semiconductors",
    ],
    thumbnail: "/projects/hyperloop-vfd/cover.svg",
    images: [
      "/projects/hyperloop-vfd/cover.svg",
      "/projects/hyperloop-vfd/pages/diagram-480v-p01.jpg",
      "/projects/hyperloop-vfd/pages/submission-p03.jpg",
      "/projects/hyperloop-vfd/pages/submission-p09.jpg",
    ],
    date: "Fall 2026",
    buildStage: "Analysis complete",
    disciplines: [
      "Power Electronics",
      "Motor Control",
      "Engineering Design Challenge",
    ],
    keyHighlights: [
      "End-to-end VFD energy path: rectify → store → invert → motor",
      "PWM switching frequency separated from fundamental motor frequency",
      "Losses, EMI, ratings, and protection treated as first-class concerns",
    ],
    architecture: [
      "Three-phase rectifier into DC link.",
      "Six-switch inverter with PWM synthesis.",
      "Motor as the load that makes the waveform choices matter.",
    ],
    challenges: [
      "Easy to confuse carrier frequency with fundamental frequency.",
      "A correct topology still fails without thermal and EMI thinking.",
    ],
    lessonsLearned: [
      "Each stage is there because the previous one cannot do the next job. The rectifier does not make a variable frequency.",
      "A control description only helps if it maps to which switches are on.",
    ],
    technicalNotes: [
      "Recruitment challenge · independent analysis.",
      "Educational switching demo; not a full circuit simulator.",
    ],
    tags: [
      "Power Electronics",
      "VFD",
      "Three-Phase AC",
      "PWM",
      "Motor Control",
      "Power Semiconductors",
      "Hyperloop",
      "Design Challenge",
    ],
    signal: "Power Electronics · Design Challenge",
  }),
  normalizeProject({
    id: "P17",
    title: "Afterthought",
    slug: "afterthought",
    featured: false,
    category: "fullstack",
    status: "shipped",
    oneLine:
      "Built a deployed personal media archive that separates perceived film quality from personal impact, captures short post-watch reflections, and organizes them into a searchable theme-based knowledge base.",
    overview:
      "I kept remembering that a movie was an 8/10 and forgetting why it stayed with me. Existing trackers are excellent at logging titles and scores; they lose scenes, questions, and takeaways. I designed Afterthought as a Next.js App Router product with dual-axis ratings (Overall vs Personal Impact), a hard 2–3 minute capture constraint centered on one prompt (“What stuck with you?”), browser voice notes with transcription and AI organization, TMDB-backed media identity, and a persistence boundary that runs on a seeded Zustand demo store or Supabase auth/Postgres/storage. The hard problem was not adding fields. A multi-section journal felt like homework, so I forced capture and organization apart: the user writes the thought; AI may suggest themes afterward, never overwrite the original.",
    techStack: [
      "Next.js",
      "TypeScript",
      "React",
      "Supabase",
      "TMDB API",
      "OpenAI",
      "Zustand",
      "Zod",
      "React Hook Form",
      "Tailwind CSS",
      "shadcn/ui",
      "Vercel",
    ],
    githubUrl: "https://github.com/Rellendula26/Afterthought",
    liveUrl: "https://afterthought-phi.vercel.app",
    thumbnail: "/projects/afterthought/landing.jpg",
    images: [
      "/projects/afterthought/landing.jpg",
      "/projects/afterthought/reflection.jpg",
      "/projects/afterthought/movie-detail.jpg",
      "/projects/afterthought/dashboard.jpg",
      "/projects/afterthought/themes.jpg",
    ],
    date: "Summer 2026",
    buildStage: "Working prototype",
    disciplines: [
      "Full-Stack Engineering",
      "Product Design",
      "Data Modeling",
      "API Integration",
      "AI Systems",
    ],
    keyHighlights: [
      "Modeled Overall Rating and Personal Impact as independent attributes so “best films” and “films that mattered” can diverge in the library",
      "Collapsed an 8+ section reflection editor into a 2–3 minute default flow: two scores, one primary prompt, one save; moved structure behind optional expansion and AI post-processing",
      "Separated TMDB media identity from user-media records (ratings, reflections, voice transcripts, themes) and kept a demo-first persistence path that runs without cloud credentials",
    ],
    architecture: [
      "Client: search, media detail, reflection editor, library, themes, voice capture.",
      "App routes: TMDB normalization, OpenAI transcribe/organize (Zod-validated JSON), persistence abstraction.",
      "TMDB identifies the title; Supabase or Zustand demo store owns the user’s relationship to it.",
    ],
    challenges: [
      "A richer schema (lessons, scenes, quotes, techniques) made post-movie capture feel like a questionnaire.",
      "Generative rewrite sounded polished and drifted from what I actually meant.",
      "Requiring TMDB + Supabase + OpenAI keys made the portfolio demo fragile.",
    ],
    lessonsLearned: [
      "Writing down a movie and organizing the log are different jobs. If I combine them, I stop halfway.",
      "One score mixes whether the movie was good with whether it mattered to me.",
      "The catalog id for a film and my private note about it should not be the same record.",
    ],
    technicalNotes: [
      "MVP validates interaction flow and architecture seams, not long-term retention.",
      "Next: semantic retrieval across reflections, resurfacing, stronger multi-user cloud path.",
    ],
    nextImprovements: [
      "Semantic search across reflections",
      "Resurfacing old notes (“you wrote this six months ago”)",
      "Unified movie + TV discovery polish",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/afterthought/landing.jpg",
        alt: "Afterthought landing page with dual-axis rating promise",
        label: "Product entry",
        mediaType: "image",
        featured: true,
        priority: 10,
        caption:
          "Public landing: dual-axis promise and one-click path into the seeded demo journal.",
      },
      {
        kind: "image",
        src: "/projects/afterthought/reflection.jpg",
        alt: "Reflection editor with Overall and Personal Impact scores",
        label: "Reflection capture",
        mediaType: "image",
        caption:
          "Default capture path after the credits: two independent scores plus “What stuck with you?”",
      },
      {
        kind: "image",
        src: "/projects/afterthought/themes.jpg",
        alt: "Theme-based browsing of film reflections",
        label: "Theme retrieval",
        mediaType: "image",
        caption:
          "Browse by ideas such as ambition or identity once the archive exists.",
      },
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "TMDB",
      "OpenAI",
      "Zustand",
      "Zod",
      "Product Design",
    ],
    signal: "Product Systems",
  }),
  normalizeProject({
    id: "P05",
    title: "Loan Default Risk (CIS 5450)",
    slug: "cis5450-loan-default",
    featured: false,
    category: "ml",
    status: "shipped",
    oneLine:
      "Lending Club default model for CIS 5450: clean the data, kill leakage, then rank risk under a messy class balance.",
    pageLead:
      "Lending Club default model for CIS 5450. I dropped the columns that leak the outcome, split the data before fitting anything, and ranked risk when most loans are paid.",
    overview:
      "Course project on ~1M Lending Club loans. I filtered to paid vs charged-off, threw out post-outcome cheat columns like recoveries and total_pymnt, and only fitted transforms after the train/test split. Models went from logistic regression up to tuned XGBoost around 0.7175 AUC. Tuning barely moved the needle once the columns were honest. Accuracy was a trap with an 80/20 split, so I cared about AUC, PR, and the fact that a 0.5 threshold is not a business decision.",
    techStack: [
      "Python",
      "Pandas",
      "scikit-learn",
      "XGBoost",
      "imbalanced-learn",
      "SMOTE",
      "K-Means",
      "Matplotlib/Seaborn",
    ],
    githubUrl: "https://github.com/Rellendula26/CIS5450",
    thumbnail: "/projects/gallery/cis5450-cover.svg",
    images: [
      "/projects/gallery/cis5450-cover.svg",
      "/projects/gallery/cis5450-pipeline.svg",
    ],
    date: "Spring 2026",
    buildStage: "Analysis complete",
    disciplines: ["Data Cleaning", "EDA", "Modeling", "Evaluation"],
    keyHighlights: [
      "Dropped post-outcome leakage before any model saw the data",
      "Split first; impute, winsorize, encode, and SMOTE only on train",
      "Tuned XGBoost ~0.7175 AUC; spent more time on features than hyperparams",
    ],
    architecture: [
      "Filter outcomes and drop leakage columns.",
      "EDA, then stratified 80/20 split and train-only transforms.",
      "Model ladder plus threshold / cost thinking on the holdout.",
    ],
    challenges: [
      "Some of the strongest-looking columns only exist after default.",
      "Accuracy looks great if you always predict paid.",
      "Hyperparameter search did almost nothing once leakage was gone.",
    ],
    lessonsLearned: [
      "A messy column will mislead the model before the choice of algorithm does.",
      "I fit the model only after the split. Otherwise the score is partly memorizing the test rows.",
      "A threshold of 0.5 is the library default. It is not a decision about who gets flagged.",
    ],
    technicalNotes: [
      "Notebook analysis, not a deployed underwriting system.",
      "Grade and interest rate already encode Lending Club's own risk call.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/gallery/cis5450-cover.svg",
        alt: "CIS 5450 loan default risk cover",
        label: "Cover",
        mediaType: "diagram",
        featured: true,
        priority: 20,
      },
      {
        kind: "image",
        src: "/projects/gallery/cis5450-pipeline.svg",
        alt: "CIS 5450 modeling pipeline diagram",
        label: "Pipeline",
        mediaType: "diagram",
      },
    ],
    tags: ["cis5450", "tabular-ml", "leakage", "xgboost", "credit-risk"],
    signal: "ML Pipelines",
  }),
  normalizeProject({
    id: "P06",
    title: "LabReach AI",
    slug: "labreach-ai",
    featured: false,
    category: "ml",
    status: "iterating",
    oneLine:
      "Research outreach helper: scrape lab pages, draft with a local LLM option, and never send until I review.",
    overview:
      "Cold email prep was eating time, so I automated the boring parts and refused to automate the dangerous one. LabReach finds faculty pages, pulls context, drafts with Ollama when I want text to stay local, and writes a review artifact before Gmail can do anything. JS-heavy department sites break naive scrapers. That is fine. Guessing an email and blasting it is not.",
    techStack: ["Python", "Ollama", "BeautifulSoup", "Playwright", "SQLite", "Gmail API"],
    githubUrl: "https://github.com/Rellendula26/labreach-ai",
    thumbnail: "/projects/website-2.png",
    images: ["/projects/website-2.png", "/projects/website-1.png", "/projects/website-cover.png"],
    date: "2026",
    buildStage: "In development",
    disciplines: ["Scraping", "LLM Drafting", "Send Control"],
    keyHighlights: [
      "Hybrid scrape path for JS-heavy faculty pages",
      "Local drafting option so research notes do not have to hit a cloud API",
      "Hard review step before any send",
    ],
    architecture: [
      "Scrape/extract modules feed structured profile context.",
      "LLM stage drafts outreach text from context templates.",
      "Campaign layer stores history; send is explicit after review.",
    ],
    challenges: [
      "JS-heavy faculty pages break static scrapers.",
      "Email extraction quality varies by site.",
      "Automation without brakes is a reputation risk.",
    ],
    lessonsLearned: [
      "Someone has to review what the tool drafts before it goes out. That is what keeps a bad extraction from becoming an email.",
      "When extraction fails, I keep the failure instead of filling the field with a guess.",
    ],
    technicalNotes: [
      "Discovery + review tooling now matters more than single-email generation.",
      "Next: stronger campaign observability and retries.",
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
    oneLine:
      "Dance practice tool: scrub a waveform, get BPM for that section, keep rehearsing.",
    overview:
      "I kept losing time hunting song sections and tempos, so I built the tool I wanted. Pick a region on the waveform, send it for tempo analysis, get numbers back without breaking rehearsal flow. Started in Colab, ended as a deployed Next.js app with Python on the backend. When the selection edges are wrong, the BPM looks wrong, and dancers blame the model. Sync mattered more than fancy DSP.",
    techStack: ["Next.js", "WaveSurfer", "Librosa", "Python", "Vercel"],
    githubUrl: "https://github.com/Rellendula26/fresh-count-coach",
    liveUrl: "https://fresh-count-coach.vercel.app",
    demoVideoUrl: "/projects/count-coach-demo.mp4",
    thumbnail: "/projects/count-coach-poster.png",
    images: ["/projects/count-coach-1.png", "/projects/count-coach-2.png", "/projects/count-coach-poster.png"],
    date: "2025-2026",
    buildStage: "Deployed",
    disciplines: ["Signal Processing", "Full-Stack UX"],
    keyHighlights: [
      "Waveform region select tied straight to analysis",
      "Server-side tempo so the practice UI stays light",
      "Colab prototype to a deployed app I still use",
    ],
    architecture: [
      "Client selects clip region and posts audio segment metadata.",
      "Backend runs tempo analysis and returns practice metrics.",
      "UI overlays tempo guidance for targeted repetition.",
    ],
    challenges: [
      "Selection boundaries must match what the analyzer hears.",
      "Analysis latency cannot break rehearsal flow.",
    ],
    lessonsLearned: [
      "The useful part is not having to stop rehearsal to ask what the count is.",
      "If the screen is confusing while I am dancing, the BPM math does not matter.",
    ],
    technicalNotes: ["Next: richer loop controls and movement-aware cues."],
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
    oneLine:
      "Handheld Tetris on Arduino Nano + ST7735: game loop, SPI draw, buttons, and sound all on-device.",
    overview:
      "I wanted a real embedded game loop, not a simulation. Everything runs on the Nano: gravity, collision, scoring, SPI redraw, piezo cues. Half the 'bugs' were solder joints on the display. I staged controls on a two-button harness first so I was not debugging mechanics and firmware at the same time.",
    techStack: ["Arduino Nano", "C++", "ST7735", "SPI", "Adafruit GFX"],
    githubUrl: "https://github.com/Rellendula26/arduino-tetris",
    demoVideoUrl: "/projects/arduinotetris.mp4",
    thumbnail: "/projects/tetrissettup.jpg",
    images: ["/projects/initialmaterials.jpg", "/projects/tetrissettup.jpg", "/projects/gallery/arduino-tetris-gameplay.svg"],
    date: "2026",
    buildStage: "Working prototype",
    disciplines: ["Embedded Software", "Hardware Bring-up"],
    keyHighlights: [
      "On-device game loop with collision, scoring, and piezo cues",
      "SPI redraw tuned so controls stayed responsive",
      "Fixed flaky display joints before rewriting game logic again",
    ],
    architecture: [
      "Main loop handles input, state update, collision, and redraw.",
      "Grid/tetromino state stored in a compact board representation.",
      "Piezo signals fire on lock/clear events.",
    ],
    challenges: [
      "Intermittent SPI looked like sprite corruption.",
      "ST7735 init quirks vary by panel variant.",
      "Overdraw kills responsiveness.",
    ],
    lessonsLearned: [
      "A bad joint and a logic bug look the same when a piece does not move.",
      "I got the game running on the bench before I worried about a case.",
    ],
    technicalNotes: ["Upgrades: rotation polish, difficulty ramps, enclosure."],
    media: [
      projectVideo("arduino-tetris"),
      {
        kind: "video",
        src: "/projects/fixingtetrissolder.mp4",
        alt: "Display solder fixes",
        label: "Display bring-up",
        mediaType: "process",
      },
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
    oneLine:
      "CV dance coach: compare your form to a reference clip and get cues that actually mean something.",
    pageLead:
      "A dance coach that compares a clip to a reference and names a cue I would fix on the next run.",
    overview:
      "I dance, so I care when feedback is useless. Bhangra Coach uploads a clip, runs MediaPipe landmarks, aligns against a reference when tempos differ, then surfaces deltas in a Next.js UI with FastAPI and Supabase behind it. Raw joint error is not coaching. Alignment and wording are the product right now, and both still need work.",
    techStack: ["Next.js", "FastAPI", "MediaPipe", "Supabase", "Computer Vision"],
    githubUrl: "https://github.com/Rellendula26/bhangra-coach",
    liveUrl: "https://bhangra-coach.vercel.app",
    demoVideoUrl: "/projects/coverbhangraform.mp4",
    thumbnail: "/projects/bc1.png",
    images: ["/projects/bc1.png", "/projects/bcfeedback.png"],
    date: "2026",
    buildStage: "In development",
    disciplines: ["Computer Vision", "Full-Stack Product"],
    keyHighlights: [
      "Pose landmarks on user and reference clips",
      "Temporal alignment before scoring movement diffs",
      "Upload / process / review loop with stored clip metadata",
    ],
    architecture: [
      "Frontend handles upload and review.",
      "FastAPI computes landmarks and delta metrics.",
      "Supabase stores clip metadata and outputs.",
    ],
    challenges: [
      "Tempo differences break naive frame-wise compare.",
      "Raw pose deltas need interpretation to become cues.",
      "Camera angle and lighting shift landmark quality.",
    ],
    lessonsLearned: [
      "A joint angle on screen is useless if I would not know what to fix in the mirror.",
      "I already know the technique, so the cue has to match how I think about the move.",
    ],
    technicalNotes: ["Still open: how well a cue holds up from another camera angle or in different light."],
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
    oneLine:
      "Campus dining social app from Penn SPARK: auth, profiles, and a small student loop that actually shipped.",
    pageLead:
      "Campus dining app from Penn SPARK. We finished auth, profiles, and a small loop in time to demo it.",
    overview:
      "SPARK project with a real deadline. We built Penn Plates on Next.js and Supabase so students could coordinate around dining without a bloated feature list. Auth and RLS had to be right. Scope cuts hurt, but they are why we had a demo instead of half-finished screens.",
    techStack: ["Next.js", "Supabase", "React"],
    demoVideoUrl: "/projects/pennplates.mp4",
    thumbnail: "/projects/website-1.png",
    images: ["/projects/website-1.png"],
    date: "2026",
    buildStage: "Working prototype",
    disciplines: ["Product", "Auth & Data"],
    keyHighlights: [
      "Supabase auth and RLS for student profiles",
      "Cut features to protect one usable dining loop",
      "Demo-ready under the SPARK timeline",
    ],
    architecture: [
      "Next.js client with Supabase-backed auth and data access.",
      "Feature set optimized for practical student interaction loops.",
    ],
    challenges: [
      "Ambition versus timeline.",
      "Keeping UX simple while supporting social coordination.",
    ],
    lessonsLearned: [
      "The deadline was part of the design, so I cut features to ship.",
      "A clear way to coordinate dinner mattered more than another screen.",
    ],
    technicalNotes: ["I have not gone back to measure whether people kept using it."],
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
    oneLine:
      "Living engineering portfolio that turns projects into structured technical case studies instead of a static screenshot gallery.",
    overview:
      "I built this site so recruiters and engineers can evaluate my work the way I want it evaluated: systems thinking, design decisions, iterations, evidence, and reflection. Hardware, software, research, embedded, ML, CAD, and product work all land in one visual and narrative system. Typed project data drives cards, routes, heroes, and media. Case studies attach by slug. Featured work and supporting builds get different homepage weight so experiments stay archived without competing with flagship projects. Adding a project should feel like publishing into a system, not redesigning a page.",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "Lucide React",
      "Vercel",
    ],
    disciplines: [
      "Frontend Engineering",
      "Product Design",
      "Technical Communication",
      "Information Architecture",
    ],
    githubUrl: "https://github.com/Rellendula26/ritvik-portfolio",
    liveUrl: "https://ritvikellendula.dev",
    demoVideoUrl: "/projects/portfoliosite/sitewalkthrough-web.mp4",
    thumbnail: "/projects/portfoliosite/homesite.jpg",
    images: [
      "/projects/portfoliosite/homesite.jpg",
      "/projects/portfoliosite/sampleproductpage.png",
      "/projects/portfoliosite/website-1.png",
      "/projects/website-cover.png",
      "/projects/website-2.png",
    ],
    date: "2025-2026",
    buildStage: "Deployed",
    keyHighlights: [
      "Typed project model powering home, list, and detail routes",
      "Structured case-study shell: motivation through reflection",
      "Featured vs supporting homepage hierarchy",
      "Mixed media system (images, video, diagrams, custom visuals)",
      "Project-intake workflow for repeatable publishing",
    ],
    architecture: [
      "Centralized TypeScript project objects + optional case studies by slug.",
      "Shared EngineeringCaseStudyLayout for deep narrative pages.",
      "Homepage bands: staged hero → featured → supporting → personal direction.",
      "Intake tooling for sync, analysis, and media import.",
    ],
    challenges: [
      "Earlier pages showed outcomes without process, failures, or tradeoffs.",
      "Equal visual weight made every project compete with the strongest work.",
      "Keeping the interface personal while making documentation scalable.",
    ],
    lessonsLearned: [
      "A list of projects does not explain the work.",
      "The pages got better when I wrote down what failed, not when I added more motion.",
      "Deciding what a visitor sees first took longer than the animation.",
    ],
    technicalNotes: [
      "Warm stone/amber editorial system on purpose; avoiding generic neon portfolio aesthetics.",
      "Disciplines replace generic stack framing when the work is multidisciplinary.",
      "Repo: github.com/Rellendula26/ritvik-portfolio · Live: ritvikellendula.dev",
    ],
    nextImprovements: [
      "Stronger evidence on older project pages (diagrams, measurements, build photos)",
    ],
    media: [
      {
        kind: "video",
        src: "/projects/portfoliosite/sitewalkthrough-web.mp4",
        alt: "Portfolio site walkthrough",
        label: "Site walkthrough",
        poster: "/projects/portfoliosite/homesite.jpg",
        mediaType: "demo",
        featured: true,
        priority: 10,
        caption: "Eight-second pass through the homepage and project structure.",
      },
      {
        kind: "image",
        src: "/projects/portfoliosite/homesite.jpg",
        alt: "Portfolio homepage",
        label: "Homepage",
        mediaType: "image",
        caption: "Staged hero and project hierarchy.",
      },
      {
        kind: "image",
        src: "/projects/portfoliosite/sampleproductpage.png",
        alt: "Sample project case study page",
        label: "Case study page",
        mediaType: "image",
        caption: "Exec summary first, deeper engineering narrative below.",
      },
    ],
    tags: ["meta", "frontend", "design-system", "documentation"],
    signal: "Meta",
  }),
  normalizeProject({
    id: "P12",
    title: "3D Brain Model",
    slug: "brain",
    featured: false,
    category: "cad",
    status: "archived",
    oneLine:
      "Maya brain model that I cleaned up and 3D printed as a labeled study piece.",
    overview:
      "Early project. I modeled cortical detail in Maya, fought overhangs and wall thickness for FDM, then printed and labeled it. Pretty geometry that will not print is useless. Kept here because it is one of the first times I cared about a physical artifact, not just a screenshot.",
    techStack: ["Maya", "CAD", "3D Printing"],
    thumbnail: "/projects/brain-1.png",
    images: ["/projects/brain-1.png"],
    date: "High School",
    buildStage: "Archived",
    disciplines: ["CAD", "Digital Fabrication"],
    keyHighlights: [
      "Modeled anatomy with print constraints in mind",
      "Printed and labeled a physical study model",
    ],
    architecture: ["Digital sculpting → print preparation → physical labeling."],
    challenges: ["Detail versus FDM reliability.", "Labels without obscuring form."],
    lessonsLearned: ["A model that looks right on screen can still be impossible to print. Overhangs and wall thickness showed up only when I tried."],
    technicalNotes: ["Early build evidence; not a research-grade atlas."],
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
    oneLine:
      "OIDD capstone: socioeconomic factors and health outcomes, with models I could actually explain.",
    overview:
      "Course analysis in Python. Clean the data, plot what matters, try interpretable trees, and write the assumptions next to the charts. Observational data does not get to pretend it is causal. The deadline was real, so communication had to travel with the numbers.",
    techStack: ["Python", "Pandas", "Seaborn", "Decision Trees"],
    thumbnail: "/projects/OIDD.png",
    images: ["/projects/OIDD.png", "/projects/oidd-1.png", "/projects/oidd-2.png"],
    date: "Course project",
    buildStage: "Archived",
    disciplines: ["Data Analysis", "Statistical Communication"],
    keyHighlights: [
      "End-to-end cleaning, viz, and interpretable model exploration",
      "Assumptions written up with the results, not buried",
    ],
    architecture: ["Dataset prep → feature analysis → model fitting → interpretation."],
    challenges: [
      "Rigor versus deadline.",
      "Avoiding causal language the data cannot support.",
    ],
    lessonsLearned: ["The score did not explain the result until I wrote down what the model was assuming."],
    technicalNotes: ["Context project; not a flagship systems build."],
    tags: ["data", "analysis", "coursework"],
    signal: "Data",
  }),
  normalizeProject({
    id: "P14",
    title: "Drift",
    slug: "drift-balancer",
    featured: true,
    devOnly: true,
    category: "hardware",
    status: "iterating",
    oneLine:
      "A page template, not a robot I built. The balancer, the 200 Hz loop, and the measurements below are placeholders.",
    overview:
      "This page shows how a future project write-up is laid out. The chassis, the star ground, the 200 Hz loop, and the hold numbers are example copy. They are not measurements from a machine I built.",
    techStack: ["STM32", "Cascade PID", "Complementary Filter", "Custom PCB", "PETG"],
    githubUrl: "https://github.com/Rellendula26",
    thumbnail: "/projects/gallery/drift-architecture.svg",
    images: [
      "/projects/gallery/drift-architecture.svg",
      "/projects/gallery/drift-chassis.svg",
      "/projects/gallery/drift-pcb.svg",
      "/projects/gallery/drift-control-loop.svg",
    ],
    date: "Template 2026",
    buildStage: "Page template",
    keyHighlights: [
      "Placeholder only. Do not read the 200 Hz loop or the hold numbers as a machine I built.",
      "Chassis and star-ground PCB co-designed around battery CG.",
      "Validation with hold RMS, recovery angle, and rail-dip measurements.",
    ],
    architecture: [
      "IMU → complementary filter → cascade PID → PWM → H-bridge.",
      "Mechanical spine sets CG and IMU mount stiffness.",
      "Ring-buffered UART telemetry never blocks the control ISR.",
    ],
    challenges: [
      "PWM-coupled IMU noise from shared motor return current.",
      "Frame flex that masqueraded as sensor noise.",
      "Gains that looked perfect on a full pack and oscillated when voltage sagged.",
    ],
    lessonsLearned: [
      "Once the robot exists, I care more about seeing the control loop than about making the controller clever.",
      "Where the battery sits changes the balance. It is not only a question of where the wires fit.",
      "Sampling at a fixed rate made tuning something I could repeat.",
    ],
    technicalNotes: [
      "Placeholder diagrams; replace with real CAD, PCB, and scope captures when migrating a live project.",
      "Use this page as the structural reference for future case studies.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/gallery/drift-architecture.svg",
        alt: "Drift system architecture",
        label: "System architecture",
        mediaType: "diagram",
        featured: true,
        priority: 10,
        caption: "Sensors → estimator → cascade PID → actuators.",
      },
      {
        kind: "image",
        src: "/projects/gallery/drift-chassis.svg",
        alt: "Drift chassis",
        label: "Chassis v3",
      },
      {
        kind: "image",
        src: "/projects/gallery/drift-pcb.svg",
        alt: "Drift PCB",
        label: "PCB v2",
      },
    ],
    tags: ["control", "embedded", "pcb", "mechatronics", "template"],
    signal: "Hardware + Control",
  }),
];

function isProjectVisible(project: Project) {
  // Production builds hide template/dev-only projects. Local `next dev` keeps them.
  if (process.env.NODE_ENV === "development") return true;
  return !project.devOnly;
}
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
    disciplines: input.disciplines,
    githubUrl: input.githubUrl,
    liveUrl: input.liveUrl,
    youtubeUrl: input.youtubeUrl,
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
    localMediaImported: input.localMediaImported,
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

const EXPERIENCE_SLUG_BY_PROJECT: Record<string, string> = {
  "vend-a-shoe": "brainchild-engineering",
  "tennis-ball-shooter": "brainchild-engineering",
  pennplates: "penn-spark",
};

/**
 * Media for a new project: put files in public/projects/<slug>/ and point
 * media[].src at those paths. Captions and alt text live on the media record.
 * Do not use a raw Google Drive share link as src. Export the file first.
 */
const MAJOR_PROJECT_INPUTS: ProjectInput[] = [
  {
    id: "P20",
    title: "Leader–Follower Robotic Arm",
    slug: "leader-follower-robotic-arm",
    featured: false,
    category: "embedded",
    status: "in-progress",
    experienceSlug: "serpent-robotics",
    oneLine:
      "A small leader on the ground, and a follower up on the robot, so the cut can happen with the operator still down here.",
    overview:
      "Serpent wants the operator to stay on the ground with a small leader arm, and a follower arm up on the climbing robot, so the robot can actually cut. I built the bridge that makes that teleoperation work. On two Raspberry Pis it reads the leader's joint angles and drives six Feetech STS3215 servos on the follower. LeRobot is the stack those scripts sit on. Shop Wi-Fi used a fixed follower address, 10.177.7.163. An iPhone hotspot moved that address to 172.20.10.8, and a Razr hotspot moved it to 192.168.118.37. The sender now looks up serpentpi-follower.local every 15 seconds. The bench pair is not on SR-01. When the follower sat still, a multimeter showed the motor pack was dead. After it was replaced, the board read 12 V, and I checked each motor connection for a voltage drop. The motion that runs still jitters.",
    contribution:
      "Wrote the angle bridge, moved teleoperation off a fixed IP onto a name lookup, and metered a dead motor pack before checking each motor connection for a drop.",
    techStack: ["SO-101", "STS3215", "Raspberry Pi", "LeRobot"],
    thumbnail: "/projects/leader-follower-robotic-arm/bench.jpg",
    images: [],
    date: "Sep. 2026 – Present",
    buildStage: "In development",
    keyHighlights: [
      "I wrote the bridge. Pi 1 sends leader joint angles. Pi 2 drives six STS3215 servos. Silence for 300 ms holds, and a step is limited to 15°.",
      "Shop Wi-Fi used a fixed IP. Each hotspot changed it. The sender now looks the follower up by name every 15 seconds.",
      "The motor pack was dead on the meter. With the board at 12 V, I checked each motor connection for a voltage drop. The motion that runs still jitters.",
    ],
    architecture: [
      "On one Pi, all six follower motors tracked the leader within about 2°. The next step was a second Pi over the network.",
      "Pi 1 sends leader joint angles. Pi 2 drives six STS3215 servos on a 12 V battery. A 300 ms silence holds position, and a step is limited to 15°.",
      "I wrote the bridge. Teleoperation worked on Wi-Fi, then one hotspot, then hotspots both Pis connect to.",
    ],
    challenges: [
      "The motion is still jittery. The servos report 4.8 to 5.0 V while the board measured 12 V. That servo figure still needs a meter at the plug.",
      "A dead motor pack, a hard-coded follower address, and a process that already holds the serial port all look like a follower that will not move.",
      "The gripper clips are a hand moving the printed linkage. They are not the follower tracking the leader.",
    ],
    lessonsLearned: [
      "A sender that is logging on time does not prove the follower received the packet.",
      "Do not run the Pi and the motors from one battery that can no longer hold voltage.",
    ],
    technicalNotes: [
      "Follower servos are Feetech STS3215. The Pis run LeRobot.",
      "Still open: jitter, a meter check of the 4.8 to 5.0 V servo report, Pi 2's undervoltage, and a power cycle.",
    ],
    nextImprovements: [
      "Confirm the servo supply with a multimeter instead of the reported 5 V figure.",
      "Put this teleop on the follower mounted up on SR-01. The bench clip is not that.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/leader-follower-robotic-arm/bench.jpg",
        alt: "Blue leader arm and white follower arm on a shop bench",
        label: "Bench pair",
        caption:
          "The smaller blue arm is the leader. The larger white arm is the follower. This photo is the bench pair, not the SR-01 chassis.",
        mediaType: "image",
        priority: 5,
      },
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/with-me.mp4",
        poster: "/projects/leader-follower-robotic-arm/with-me-poster.jpg",
        alt: "Ritvik moving the blue leader while the white follower sits on a shop frame",
        label: "Teleop, 20 seconds",
        caption:
          "I move the blue leader for 20 seconds. The white follower is on the shop frame, not on SR-01. This is the hotspot session.",
        mediaType: "demo",
        featured: true,
        priority: 30,
      },
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/bench.mp4",
        poster: "/projects/leader-follower-robotic-arm/bench-poster.jpg",
        alt: "Hand on the blue leader while the white follower gripper changes pose",
        label: "Bench teleop",
        caption:
          "A hand moves the blue leader. The white gripper changes pose in this clip. This is the bench pair, not the follower mounted on SR-01.",
        mediaType: "process",
        priority: 8,
        portrait: true,
      },
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/gripper.mp4",
        poster: "/projects/leader-follower-robotic-arm/gripper-poster.jpg",
        alt: "Hand moving a light blue printed gripper linkage",
        label: "Gripper linkage",
        caption:
          "Printed gripper linkage, moved by hand in this clip. A Feetech box is in the background. This is not a teleop recording.",
        mediaType: "image",
      },
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/printed-arm.mp4",
        poster: "/projects/leader-follower-robotic-arm/printed-arm-poster.jpg",
        alt: "Light blue printed arm held upright, with servo housings and wires visible",
        label: "Printed arm",
        caption:
          "The printed arm held up so the joint housings and wiring are visible. A person is moving it. The clip does not show leader tracking.",
        mediaType: "image",
      },
    ],
    tags: ["Leader-follower", "SO-101", "Serpent"],
    signal: "Controls",
    writeUp: "published",
  },
  {
    id: "P21",
    title: "Logic and Power PCB",
    slug: "logic-pcb",
    featured: false,
    category: "hardware",
    status: "in-progress",
    experienceSlug: "serpent-robotics",
    oneLine:
      "Power and logic boards for SR-01. The logic board's servo path is a Teensy 4.1 into a PCA9685 at 50 Hz. A grip test fried the control board, and that replacement is still open.",
    pageLead:
      "SR-01 climbs a rope and cuts a branch from the ground. The power board feeds the actuators. The logic board is the controller. I modified both, and I brought up the servo path on the V2 logic board.",
    overview:
      "Rails I have metered are 12 V and 6 V. The fuse markings are not a map yet. A grip test broke a printed link and fried the control board. That fault has its own section, and the replacement is still open.",
    contribution:
      "Modified the power and logic boards, checked the 12 V and 6 V rails, and brought up the Teensy servo path, including the output-enable fix.",
    techStack: ["Teensy 4.1", "PCA9685", "TCA9548A", "I2C", "Logic PCB", "Power PCB"],
    thumbnail: "/projects/logic-pcb/logic-populated.jpg",
    heroFrames: [
      {
        src: "/projects/logic-pcb/logic-populated.jpg",
        alt: "V2 logic board on a blue mat, with a Teensy 4.1 installed",
        label: "V2 logic",
      },
      {
        src: "/projects/logic-pcb/power-modules.jpg",
        alt: "V2 power board with an XT60, ATAZ converter modules, and terminal blocks",
        label: "V2 power",
      },
    ],
    images: [],
    date: "Sep. 2026 – Present",
    buildStage: "In development",
    keyHighlights: [
      "Teensy 4.1 to a TCA9548A to a PCA9685. 16 channels of 12-bit PWM, set to 50 Hz. A register write reads back.",
      "The servo stayed still until firmware drove the PCA9685 output-enable pin on GPIO 6. OE is active low.",
      "5–20 A fused paths, modular DC-DC, and RS-485 and I2C stay one set of board changes. 12 V and 6 V are meter checks, not an endurance test.",
    ],
    architecture: [
      "Servo commands: Teensy 4.1, then the TCA9548A, then the PCA9685, then the servo. Output enable is Teensy GPIO 6 into PCA9685 OE, not another I2C hop.",
      "V1 is the bare pair on the homework sheet. The boards went through more than one revision. The V2 logic board I tested has the Teensy. The V2 power board has the XT60, blade fuses, and ATAZ UMD40 modules marked for 12 V and 5 V.",
      "Fusing, DC-DC, and the buses are one set of changes. I have not assigned each fuse or each converter to one load.",
    ],
    challenges: [
      "Shop note from a branch-grip test: the linkage was 3D printed, and it broke while grabbing the branch. The stepper current dropped suddenly and fed back into the electrical system. Signals were delayed by about 5 seconds. Half the actuators and the control board were fried.",
      "In that same cascade the note says one signal kept getting sent, the saw actuated past a full turn, and a Hall-sensor wire came out.",
      "The note also says the saw was being changed from a brushed DC motor to a BLDC because the brushless saw draws less current. It often got stuck. That change is not described as finished.",
    ],
    lessonsLearned: [
      "A controller that stores an I2C write can still hold the outputs off. On the PCA9685 that pin is OE, and it is active low.",
      "A printed grip link is part of the electrical story. When it broke, the current spike took out the control board, not just the plastic.",
      "The numbers written on the homework sheet under the boards are from ESE 2150. I measured 12 V and 6 V later, on V2.",
    ],
    technicalNotes: [
      "SDA is bidirectional. A one-direction isolator cannot carry it. I looked at bidirectional I2C isolators, including the Si8600, and checked the bus across separate supplies.",
      "Visible on the power board: blade fuses are installed, including one marked 15. I am not reading every fuse value off that photo. The UMD40 labels say 12 V and 5 V. I have not assigned those modules to loads.",
      "A rotating base and a way to move along the branch were added because the machine was hard to position in the tree. I do not have a separate design note for that mechanism.",
      "A power cycle was not tested, so turn-on and turn-off behavior is still unknown. Endurance, current logging, and a long voltage check are also still open.",
    ],
    nextImprovements: [
      "Log servo current and watch the rail over a long run. Those tests have not started.",
      "Map the fuse markings to branches. CURRENT_S and VOLTAGE_S are on the power schematic and have not been logged.",
      "Replace the fried control board in the write-up only after there is a photo or a bring-up note for the replacement.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/logic-pcb/logic-populated.jpg",
        alt: "Logic board on a blue bench mat, with a Teensy 4.1 installed and a DC-DC module at the top",
        label: "Logic board in bring-up",
        caption:
          "V2 logic board during bring-up. This is the revision I tested. The Teensy 4.1 is installed. This photo is the board, not a meter reading.",
        fit: "contain",
        mediaType: "diagram",
        featured: true,
        priority: 20,
      },
      {
        kind: "image",
        src: "/projects/logic-pcb/logic-board.jpg",
        alt: "Green logic PCB with white connectors, labeled for stepper, encoder, and RS-485",
        label: "Logic board",
        caption:
          "An earlier bare logic board. Silkscreen includes stepper, encoder, RS-485, and power inputs marked 12 V, 5 V, and ground. This is not the populated V2 board from the servo bring-up.",
        fit: "contain",
        mediaType: "diagram",
        priority: 10,
      },
      {
        kind: "image",
        src: "/projects/logic-pcb/both-boards.jpg",
        alt: "Logic board and power board lying on an ESE 2150 homework page",
        label: "Both boards",
        caption:
          "V1 of both boards, on an ESE 2150 homework sheet. The handwriting is homework, not a measurement. Bring-up was on V2, not on this pair.",
        fit: "contain",
        mediaType: "diagram",
      },
    ],
    tags: ["PCB", "Bring-up", "Serpent"],
    signal: "Electronics",
    writeUp: "published",
  },
  {
    id: "P22",
    title: "Multimodal 3D Printer",
    slug: "multimodal-3d-printer",
    featured: false,
    category: "hardware",
    status: "in-progress",
    experienceSlug: "grasp-laboratory",
    oneLine:
      "A multimodal printer, headed for a military demo. The rotating nozzle has to show a measured angle, not a step count.",
    overview:
      "AddLab's Aerotech is a multimodal printer: one rotating toolhead places more than one material. The reason for this axis right now is a demo to the military. Someone at the machine has to set how far the nozzle turns, and the screen has to show where the shaft actually went. A potentiometer on A0 is that command, from the wiper voltage. An AS5600 reads the shaft, and that reading is what the LCD is supposed to show. The screen still doesn't. The motor is a 5:1 geared NEMA 17 on an A4988, with 24 V on VMOT.",
    contribution:
      "The newer drawing: pot voltage as the move command, encoder angle for the LCD, and the sketch split into stepper, encoder, and PID files.",
    techStack: ["Arduino Uno", "A4988", "AS5600", "NEMA 17"],
    thumbnail: "/projects/multimodal-3d-printer/toolhead.jpg",
    images: [],
    date: "August 2026 – Present",
    buildStage: "In development",
    keyHighlights: [
      "The axis is for a military demo of the multimodal printer: set how far the nozzle turns, and show the measured angle.",
      "The motor is a 5:1 geared NEMA 17. STEP is D3 and DIR is D2 on an A4988, with 24 V on the motor supply.",
      "The breadboard LCD lights up and still isn't showing degrees. The carousel clip moves, and it doesn't record an angle.",
    ],
    architecture: [
      "The newer drawing is an Arduino Uno, a potentiometer on A0, a mode button and a go button, an LCD, an A4988, and a magnetic encoder. The wiper voltage is how far to drive the motor. The encoder reading is what the LCD is supposed to show. STEP is D3, DIR is D2, the blue encoder wire is A4 (SDA), and the yellow wire is A5 (SCL). The drawing puts 220 Ω on the backlight and 1.5 kΩ on the contrast pin. The wire colors still need a check against the encoder pinout.",
      "The week 3 note splits the sketch into ToolheadRefactor.ino, Config.h, StepperDriver, MagneticEncoder for the AS5600, PIDController, and RobotController. The Arduino turns the potentiometer command into steps, the driver turns the motor, the encoder reads position, and the code compares that with the goal.",
    ],
    challenges: [
      "The nozzle note says friction in the rotating assembly can stall the motor, jerk it, or make it miss steps. The 5:1 gearbox is there for torque at lower speed. Current limit, microstepping, acceleration, and a different motor or driver are still open questions in that note. I don't have a logged stall.",
      "Week 4's goal is an LCD that reads how many degrees the stepper moved. The breadboard has a character LCD wired to an Arduino. The screen in that photo isn't showing a degree reading.",
    ],
    lessonsLearned: [
      "A step command is not a shaft angle. That's why the encoder is on this axis.",
    ],
    technicalNotes: [
      "The role describes the machine as a 4-axis, 6-material printer. These photos show the rotating carousel. They don't show the other axes, and they don't show six tubes loaded.",
      "The blue housing is marked 5, 3, and 1. The photo doesn't say which of those parts is the NEMA 17.",
    ],
    nextImprovements: [
      "Get a degree reading on the LCD. The photo doesn't show one.",
      "Write down one real stall, or one current-limit and microstepping trial, if either happens.",
    ],
    finalOutcome:
      "The toolhead is on the Aerotech. The newer drawing sets the move from the potentiometer voltage and sends the encoder angle to the LCD. There is no angle on the screen, and no logged move from that voltage.",
    media: [
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/toolhead.jpg",
        alt: "Blue motor housing marked 5, 3, and 1, with a gray motor above it on a printed bracket",
        label: "Toolhead",
        caption:
          "Blue housing marked 5, 3, and 1, gray motor above it. The black column reads Aerotech. A wider frame of this same column reads PRO115SL.",
        mediaType: "image",
        featured: true,
        priority: 10,
      },
      {
        kind: "video",
        src: "/projects/multimodal-3d-printer/carousel.mp4",
        poster: "/projects/multimodal-3d-printer/carousel-poster.jpg",
        alt: "Tube carousel under the blue motor on the Aerotech toolhead",
        label: "Carousel",
        caption:
          "The tube carousel under that housing. It sits in a different position at the end of the clip than at the start. No angle is written down from this clip.",
        mediaType: "demo",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/control-schematic.jpg",
        alt: "Wiring drawing of an Arduino Uno with a potentiometer, two buttons, an LCD, an A4988, a 24 volt supply, and a magnetic encoder",
        label: "Command and angle",
        caption:
          "Potentiometer on A0, mode and go buttons, LCD, A4988 on 24 V, encoder on A4 and A5. The LCD is supposed to show the encoder angle.",
        fit: "contain",
        mediaType: "diagram",
      },
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/bench-stepper.jpg",
        alt: "Stepper motor on the bench with a shaft coupling, next to a small green board",
        label: "Stepper off the gantry",
        caption:
          "A stepper on the bench, off the gantry, next to a small green board. This is from the reassembly, not a mounted measurement.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/breadboard.jpg",
        alt: "Character LCD on a breadboard, wired to an Arduino, not showing a degree reading",
        label: "LCD breadboard",
        caption:
          "Character LCD on a breadboard, wired to an Arduino. The backlight is on. The screen isn't showing degrees.",
        fit: "contain",
        mediaType: "image",
      },
    ],
    tags: ["GRASP", "AddLab", "Motion"],
    signal: "Controls",
    writeUp: "published",
  },
  {
    id: "P23",
    title: "360° UAV Imaging",
    slug: "3d-imaging-uav",
    featured: false,
    category: "embedded",
    status: "in-progress",
    writeUp: "published",
    experienceSlug: "grasp-laboratory",
    oneLine:
      "A TSL1401 line sensor on an nRF54L15. One scan is 128 brightness values. The live plot and the panorama are still the plan.",
    overview:
      "A GRASP prototype for a panorama built from one line of pixels. The TSL1401 exposes 128 photodiodes together, then the nRF54L15 samples each analog voltage. The hardware readout and the Bluetooth stream are in the source and have not been run on this board. A later flash never took, and the spinner on the bench does not have the sensor on it.",
    contribution:
      "I'm integrating the TSL1401 on the nRF54L15. The ADC and GPIOs are how a scan becomes numbers. I'm not calling the hardware readout or the Bluetooth stream done.",
    techStack: ["TSL1401", "nRF54L15", "nRF Connect SDK", "J-Link"],
    thumbnail: "/projects/3d-imaging-uav/setup.jpg",
    images: [],
    date: "August 2026 – Present",
    buildStage: "In development",
    keyHighlights: [
      "128 photodiodes expose together. The ADC sample is where each analog voltage becomes a number.",
      "The source loops every 25 ms, subtracts a dark frame, and can average a second pair 12.5 ms later.",
      "That hardware readout and the Bluetooth packet have not been run on this board.",
      "A later flash never took. The wires had come loose, and the laptop couldn't see a toolchain path.",
    ],
    architecture: [
      "Light, photocurrent, a held analog voltage on AO, then one ADC sample per pixel.",
      "A scan is pix[128]. The first laptop demo is pixel index against brightness, not a panorama.",
      "Angle is the missing axis. The sensor is not rotating.",
    ],
    challenges: [
      "The J-Link is the 3.3 V supply today. That Vcc clip and a second supply cannot be on together.",
      "The BLE image still prints every line over RTT. A blocking RTT mode will stall the scan when no debugger is reading.",
      "The hardware readout and the Bluetooth path are in the source. There is no build output, and neither has been run on this board.",
      "The lens is on the bench, not on the row. It still has to get smaller and then stay fixed.",
    ],
    lessonsLearned: [
      "A line of analog voltages is not an image until each one is sampled, and a stack of lines is not a panorama until each line has an angle.",
    ],
    technicalNotes: [
      "HJ-N54L-SIP_EVB, nRF54L15, nRF Connect SDK v3.4.1. Board target nrf54l15dk/nrf54l15/cpuapp. AO P1.11, SI P1.12, CLK P1.08.",
      "Full scale is 3.6 V, 12 bits. Pixels 0-3 are copies of pixel 4. The BLE packet is 206 bytes on the Nordic UART Service, and nothing is retransmitted.",
    ],
    nextImprovements: [
      "Flash the BLE image once with the J-Link and confirm it advertises as 360imager.",
      "Move the board to its own 3.3 V supply and unplug the J-Link before plotting a scan.",
      "Pair each scan with an angle only after a live line plot exists.",
    ],
    finalOutcome:
      "The signal path is specified, and the readout source is written. Not a live plot, not a 360° reconstruction, and not a flight.",
    media: [
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/setup.jpg",
        alt: "nRF board wired through a breadboard to a J-Link, with a note labeled TSL1401 imager",
        label: "Bench",
        caption:
          "TSL1401 bring-up. J-Link on the left, nRF board above the breadboard. Not the rotating mount.",
        fit: "contain",
        mediaType: "image",
        featured: true,
        priority: 20,
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/finger-test.png",
        alt: "Finger test: 128 pixels vertically, time horizontally, broad dark bars",
        label: "Finger test",
        caption:
          "Vertical is the 128 pixels. Horizontal is time. Not a panoramic image.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/flicker-before.png",
        alt: "Vertical stripes from 120 Hz room-light flicker",
        label: "Flicker, before",
        caption: "120 Hz room light, before the paired exposures.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/flicker-after.png",
        alt: "Stationary scene after paired exposures removed the flicker stripes",
        label: "Flicker, after",
        caption: "After the 12.5 ms pair. Still time along the horizontal axis.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "video",
        src: "/projects/3d-imaging-uav/spin.mp4",
        poster: "/projects/3d-imaging-uav/spin-poster.jpg",
        alt: "A small assembly spinning on the bench, with a ribbon cable off the center",
        label: "Spinner",
        caption:
          "The assembly turning. The line sensor is not mounted on it. No speed is written down.",
        mediaType: "video",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/over-spinner.jpg",
        alt: "A wired perfboard and green board held over a black spinner on the lab bench",
        label: "Over the spinner",
        caption:
          "The wired board held over the spinner. The row is not mounted, and this is not a scan.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/lens.jpg",
        alt: "A black lens sitting on the bench, not mounted on a sensor",
        label: "Lens",
        caption:
          "The lens on the bench. It still has to get smaller, and it has to stay fixed. It is not on the row.",
        fit: "contain",
        mediaType: "image",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/meter.jpg",
        alt: "Handheld multimeter on the bench, probes held on a wired board, display not a recorded reading",
        label: "Meter check",
        caption:
          "Probes on the wired board. The display is not a voltage I wrote down.",
        fit: "contain",
        mediaType: "image",
      },
    ],
    tags: ["ModLab", "GRASP", "TSL1401"],
    signal: "Sensing",
  },
  {
    id: "P24",
    title: "Bionic Arm",
    slug: "bionic-arm",
    featured: false,
    category: "hardware",
    status: "in-progress",
    experienceSlug: "penn-adapt",
    oneLine:
      "I design the EMG boards and mounts for a Penn ADAPT arm. One sensor board is built. The eight-channel armband is the architecture.",
    pageLead:
      "I design the EMG boards and the mounts for a Penn ADAPT arm. One sensor board is built. Eight channels is the plan on paper, not the hardware in hand.",
    overview:
      "Each sensor board is a two-electrode differential pair into one ADS1291 channel, with protection and filtering ahead of the amplifier. The main board is the STM32 acquisition, processing, and power interface. One sensor board is in hand. The architecture is eight of those modules on a 20-pin flex, plus servos and a linear actuator. The team tested the main board and started the first fixture. Firmware reads raw EMG from one ADS1291 and can run a fixed motor test. It does not map EMG to motion.",
    contribution:
      "I design the boards and the mounts. The sensing supply in my note is a 7.2 V pack, a buck to 4 V, then an LDO. That rail powers the sensing circuitry. The electrodes are the signal inputs. Two longer wires still keep a board out of the CAD mount.",
    techStack: ["EMG", "ADS1291", "STM32", "PCB"],
    thumbnail: "/projects/bionic-arm/main-board.jpg",
    images: [],
    date: "Fall 2026",
    buildStage: "In development",
    keyHighlights: [
      "Filtering and protection, then an ADS1291 that digitizes one differential EMG channel.",
      "One sensor board is built. The eight-module armband, two servos, and a linear actuator are the architecture.",
      "Bring-up reads raw EMG from one ADS1291. A fixed motor test is optional. There is no gesture or closed-loop control.",
    ],
    architecture: [
      "Current hardware is one sensor PCB. The architecture document is eight modules around the forearm, tied by a 20-pin flex, with a sensor main board between those modules and the main board.",
      "Each module takes the difference between two electrodes and digitizes it with an ADS1291. The sheets break out a chip select per device and a shared START.",
      "The main board is an STM32 for acquisition, processing, and the power and control interfaces. A Nucleo-F446RE in the photos looks like the ST-LINK. That wiring is not confirmed on the schematic.",
    ],
    challenges: [
      "The progress slide says SPI daisy-chain. Architecture V4, and the sensor schematic with CS1 through CS8, use a separate chip select per ADS1291. I don't know which one the team settled on.",
      "My power note steps a 7.2 V LiPo down to 4 V with a buck, then an LDO, so the EMG supply stays quiet. The main-board schematic, dated 9/20/2026, marks a 2-cell pack from 6.0 V to 8.4 V, plus a 12 V actuator rail, a 6 V servo rail, and 3.3 V electronics. Those two descriptions don't match.",
      "A note in the folder asks for a skin-flush fixture and a weight fixture. I don't know how that work is split.",
    ],
    lessonsLearned: [
      "A buck drops the pack voltage efficiently. The LDO after it is a quieter supply for the sensing circuitry. It does not remove every switching artifact, and the electrodes are not loads on that rail.",
    ],
    technicalNotes: [
      "Three schematics, drawn-by left blank. sensor_main2.SchDoc is dated 9/19/2026. Main.SchDoc is 9/20/2026. Sensor_normal.SchDoc is 9/27/2026.",
      "The progress slide counts one sensor main, seven sensor normal boards, and one main board. The same notes say the sensor main connects onward through another 20-pin flex.",
      "The sensor sheets use an ADS1291. The 3.3 V regulator on them is a TPS7A2033. The main board labels a 12 V actuator rail and a 6 V servo rail.",
    ],
    nextImprovements: [
      "Get the board into the mount. The two long wires are what block it.",
      "Settle the power story: my 7.2 V to 4 V note, or the schematic's 6.0 V to 8.4 V pack.",
    ],
    finalOutcome:
      "I have schematics for the sensor module, the sensor main, and the main board, and one sensor board in hand. Firmware captures raw EMG from one channel. I don't have a saved EMG recording, a mount that fits, or EMG-driven motion.",
    media: [
      {
        kind: "image",
        src: "/projects/bionic-arm/cover.jpg",
        alt: "Block diagram of one electrode module: differential pads, series resistors, an ADS1291, and an SPI link to an MCU, marked times eight",
        label: "Architecture",
        caption:
          "Architecture V4. The page this figure comes from says eight small rigid boards, about 10 to 20 mm, on flat flex, instead of one flex board. Each module is a differential pair into an ADS1291, then SPI to the microcontroller.",
        fit: "contain",
        mediaType: "diagram",
      },
      {
        kind: "image",
        src: "/projects/bionic-arm/main-board.jpg",
        alt: "Main board schematic with a 2-cell LiPo note, actuator, servo, and 3.3 V rails, and an STM32",
        label: "Main board",
        caption:
          "Main sheet, 9/20/2026. A 2-cell pack, 6.0 V to 8.4 V, with actuator, servo, and 3.3 V rails.",
        fit: "contain",
        mediaType: "diagram",
        featured: true,
        priority: 10,
      },
      {
        kind: "image",
        src: "/projects/bionic-arm/sensor-main.jpg",
        alt: "Sensor main schematic with an ADS1291, bias network, and two 20-pin flat-flex connectors",
        label: "Sensor main",
        caption:
          "sensor_main2.SchDoc, 9/19/2026. One ADS1291, the bias network, and two 20-pin flex connectors: one toward the main board and one toward the other sensor modules.",
        fit: "contain",
        mediaType: "diagram",
      },
      {
        kind: "image",
        src: "/projects/bionic-arm/sensor-normal.jpg",
        alt: "Sensor normal schematic with an ADS1291, electrode protection, and one 20-pin flex connector",
        label: "Sensor module",
        caption:
          "Sensor_normal.SchDoc, 9/27/2026. The repeated electrode module: ADS1291, the series resistors and filter cap, and one 20-pin flex. Chip-select pins are broken out individually.",
        fit: "contain",
        mediaType: "diagram",
      },
      {
        kind: "image",
        src: "/projects/bionic-arm/electrical-team-slide.jpg",
        alt: "Photograph of a projector slide titled Electrical Team, describing eight EMG modules and three PCB schematics",
        label: "Team slide",
        caption:
          "A photo of the Electrical Team progress slide, shot off a projector, with a rainbow glare across it. It counts eight modules and three schematics. It says SPI daisy-chain, which doesn't match CS1 through CS8 on the sensor sheet.",
        fit: "contain",
        mediaType: "diagram",
      },
    ],
    tags: ["ADAPT", "EMG", "PCB"],
    signal: "Electronics",
    writeUp: "published",
  },
  {
    id: "P25",
    title: "ECG Signal-Conditioning PCB",
    slug: "ecg-signal-conditioning",
    // Directory section marks the card featured. pageFeatured is the hero badge.
    // `featured` stays false so this does not join the homepage band.
    featured: false,
    pageFeatured: true,
    category: "hardware",
    status: "in-progress",
    oneLine:
      "A three-stage analog front end that turns a ~1 mV heart signal into a ~1 V signal for a microcontroller ADC, on a custom through-hole PCB.",
    pageLead:
      "An AD623 instrumentation amplifier and two op-amp filter stages, taken from a lab reference schematic to my own fabrication-ready board. It runs from a single 3.3 V rail and feeds a Feather's ADC.",
    overview:
      "An AD623 instrumentation amplifier and two op-amp filter stages, taken from a lab reference schematic to my own fabrication-ready board. It runs from a single 3.3 V rail and feeds a Feather's ADC.",
    contribution:
      "Schematic validates clean; board 100% routed with 0 electrical DRC violations; Gerbers ready.",
    course: "ESE 2150 Lab 9",
    cardTechLimit: 6,
    documentLink: {
      href: "/projects/ecg-signal-conditioning/ecg-project-diary.pdf",
      cardLabel: "Project diary",
      heroLabel: "Project diary (PDF)",
    },
    seo: {
      title: "ECG Signal-Conditioning PCB · Ritvik Ellendula",
      description:
        "A three-stage analog front end that turns a ~1 mV heart signal into a ~1 V signal for a microcontroller ADC, on a custom through-hole PCB.",
      image: "/projects/ecg-signal-conditioning/pcb-routed.png",
      imageAlt:
        "Two-layer ECG front-end PCB, 54/54 nets routed. Red = top copper, blue = bottom.",
    },
    techStack: [
      "AD623",
      "TLV2462",
      "Altium Designer",
      "PCB",
      "Analog filters",
      "Feather nRF52840",
    ],
    disciplines: ["Analog design", "PCB layout"],
    thumbnail: "/projects/ecg-signal-conditioning/pcb-routed.png",
    images: [],
    date: "Nov. 2026",
    buildStage: "Ready for fabrication",
    keyHighlights: [],
    architecture: [
      "AD623 difference stage, a 160 Hz low-pass with gain, then a high-pass that corrects the integrator.",
      "A buffered 1.65 V reference is the signal zero on the Feather's 3.3 V rail.",
    ],
    challenges: [
      "One wire had merged +IN, −IN, both gain pins, and ground into a single net.",
      "The vault AD623 and TLV2462 were SOIC. The board is through-hole, so the AD623 needed a DIP-8 footprint.",
    ],
    lessonsLearned: [
      "A net label is not a source. The 1.65 V port needed the divider and follower that actually drive it.",
    ],
    technicalNotes: [
      "The Bode numbers are calculated from the component values with ideal op-amps. The board is not built yet.",
    ],
    media: [
      {
        kind: "image",
        src: "/projects/ecg-signal-conditioning/pcb-routed.png",
        alt: "Two-layer ECG front-end PCB, 54/54 nets routed. Red = top copper, blue = bottom.",
        label: "Routed board",
        caption:
          "Two-layer ECG front-end PCB, 54/54 nets routed. Red = top copper, blue = bottom.",
        fit: "contain",
        mediaType: "diagram",
        featured: true,
        priority: 10,
        portrait: true,
      },
    ],
    tags: [
      "AD623",
      "TLV2462",
      "Altium Designer",
      "Footprint Wizard",
      "Situs autorouter",
      "Gerber RS-274X",
      "single-supply design",
      "active filters",
    ],
    signal: "ESE 2150",
    writeUp: "published",
  },
];

export const PROJECTS: Project[] = [
  ...MAJOR_PROJECT_INPUTS.map(normalizeProject),
  ...BASE_PROJECTS,
  ...INTAKE_PROJECTS,
]
  .filter(isProjectVisible)
  .map((project) =>
    project.experienceSlug || !EXPERIENCE_SLUG_BY_PROJECT[project.slug]
      ? project
      : { ...project, experienceSlug: EXPERIENCE_SLUG_BY_PROJECT[project.slug] }
  );

/** Homepage featured order: lead with strongest robotics/systems work. */
const FEATURED_SLUG_ORDER = [
  "vend-a-shoe",
  "c-compiler",
  "per-power-electronics",
  "tennis-ball-shooter",
  "saber",
  "bloombot",
  "minitorch-ocaml",
  "drift-balancer",
] as const;

function featuredRank(slug: string) {
  const index = (FEATURED_SLUG_ORDER as readonly string[]).indexOf(slug);
  return index === -1 ? FEATURED_SLUG_ORDER.length : index;
}

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured).sort(
  (a, b) => featuredRank(a.slug) - featuredRank(b.slug)
);
const CURRENT_WORK_SLUGS = [
  "leader-follower-robotic-arm",
  "logic-pcb",
  "multimodal-3d-printer",
  "3d-imaging-uav",
  "bionic-arm",
];

/** Directory pages only. Kept out of the homepage "More builds" slice. */
const HOMEPAGE_EXCLUDED_SLUGS = ["ecg-signal-conditioning"];

export const SUPPORTING_PROJECTS = PROJECTS.filter(
  (project) =>
    !project.featured &&
    project.status !== "archived" &&
    project.writeUp !== "coming-soon" &&
    !CURRENT_WORK_SLUGS.includes(project.slug) &&
    !HOMEPAGE_EXCLUDED_SLUGS.includes(project.slug)
);
export const ARCHIVE_PROJECTS = PROJECTS.filter((project) => project.status === "archived");

export const MAJOR_PROJECTS = PROJECTS.filter((project) =>
  CURRENT_WORK_SLUGS.includes(project.slug)
);

/**
 * Projects directory only. Homepage bands keep FEATURED_PROJECTS, MAJOR_PROJECTS,
 * and SUPPORTING_PROJECTS so the home page does not follow this order.
 */
export const PROJECT_DIRECTORY: {
  title: string;
  subtitle: string;
  slugs: string[];
  featured?: boolean;
}[] = [
  {
    title: "Selected engineering projects",
    subtitle:
      "Boards, teleoperation, sensing, and a client machine. These are the systems I would open first.",
    featured: true,
    slugs: [
      "logic-pcb",
      "leader-follower-robotic-arm",
      "bionic-arm",
      "vend-a-shoe",
      "ecg-signal-conditioning",
      "multimodal-3d-printer",
      "3d-imaging-uav",
    ],
  },
  {
    title: "Other hardware and systems builds",
    subtitle:
      "A launcher, an analog saber, power-electronics problems, and smaller boards.",
    slugs: [
      "tennis-ball-shooter",
      "saber",
      "per-power-electronics",
      "hyperloop-vfd",
      "ultrasonic-pcb",
      "bloombot",
    ],
  },
  {
    title: "Software and personal projects",
    subtitle:
      "Compilers, a small autodiff library, course models, and apps.",
    slugs: [
      "c-compiler",
      "minitorch-ocaml",
      "pennplates",
      "website",
      "cis5450-loan-default",
      "labreach-ai",
      "count-coach",
      "bhangra-coach",
      "afterthought",
    ],
  },
  {
    title: "Earlier work and coursework",
    subtitle:
      "Older class projects. Drift Balancer is still a page template, not a robot I built.",
    slugs: ["arduino-tetris", "drift-balancer", "brain", "OIDD"],
  },
];

export function projectsInDirectory(slugs: string[]) {
  return slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => Boolean(project));
}

export function getProjectsForExperience(experienceSlug: string) {
  return PROJECTS.filter((project) => project.experienceSlug === experienceSlug);
}

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
