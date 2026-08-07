import GENERATED_INTAKE_PROJECTS from "@/data/projects.generated.json";
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
  /** When true, project is listed only in local development — hidden from production builds. */
  devOnly?: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  oneLine: string;
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
    buildStage: "Actively Expanding",
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
      "Compiler complexity is preserving meaning across representations, not recognizing syntax.",
      "Stage-local tests beat end-to-end-only debugging.",
      "Reading generated assembly is still the fastest debug loop.",
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
      "Reverse-mode autodiff in OCaml: forward builds a graph, backward fills grads, gradcheck keeps me honest.",
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
    buildStage: "Extending operator coverage",
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
      "Math correctness needs numerical checks, not confidence.",
      "Strong types catch structure issues, not calculus mistakes.",
      "Loss curves confirm integration; they do not replace gradcheck.",
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
      "The idea was simple: people far apart should still have something physical to share. BloomBot lives on an Arduino UNO R4 WiFi with Blynk. Get close and an ultrasonic sensor drives the servos to open the flower. Send a message from the app and an LED heart inside blinks that message in Morse. LCD output helps when I cannot sit on serial during a demo. The cute part is the flower. The hard part was keeping WiFi, sensing, multi-servo peaks, and Morse timing honest on one board without brownouts.",
    techStack: ["Arduino UNO R4 WiFi", "Blynk", "WiFiS3", "Servos", "Ultrasonic", "I2C LCD"],
    githubUrl: "https://github.com/Rellendula26/bloombot-iot",
    liveUrl: "https://devpost.com/software/bloombot-8syfva",
    youtubeUrl: "https://www.youtube.com/watch?v=D3Kk4IFN1ps",
    demoVideoUrl: "/projects/bloombot-web.mp4",
    thumbnail: "/projects/bloombot-poster.jpg",
    images: ["/projects/bloombot-poster.jpg"],
    date: "Spring 2026",
    buildStage: "Shipped demo; next hardware revision",
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
      "Hardware reliability is mostly integration discipline.",
      "Live demo confidence comes from failure-mode rehearsal.",
      "A local feedback channel beats laptop-only debug on the floor.",
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
      "Designed and fabricated a handheld electromechanical system integrating custom mechanical packaging, discrete analog electronics, embedded lighting control, and structural design into a durable wearable prototype.",
    overview:
      "I built this in Detkin Lab as a handheld system that had to leave the breadboard. The work meant designing a custom Fusion 360 hilt, emitter, and battery carrier across multiple print revisions; integrating a discrete analog audio circuit (NE555 timer, RC network, PN2222A transistor) alongside LED blade illumination on a switched 9V power architecture; and manufacturing the boards with 40+ through-hole joints. The electronics were straightforward; the challenge was packaging them into a handheld device that could survive repeated impact and handling. Blade bending loads broke the hilt twice; cable length forced an LED pad salvage.",
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
    buildStage: "Shipped Demo",
    disciplines: [
      "Mechanical Design",
      "Analog Circuit Design",
      "Electrical Integration",
      "Manufacturing",
      "Product Engineering",
    ],
    keyHighlights: [
      "Designed a custom Fusion 360 enclosure and iterated hilt CAD/print geometry after two catastrophic impact failures under blade bending loads",
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
      "The schematic is rarely the schedule risk; packaging and structural reliability are.",
      "Failure analysis beats stronger glue when the load path is wrong.",
      "Salvaging a component under constraint is as much engineering as picking a better part.",
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
      "Designed and fabricated a client tennis-ball launcher prototype at BrainChild Engineering integrating ESP32 wireless control, dual RS-775 flywheel drive, NEMA 17 stepper feed, MOSFET motor switching, and 12V-to-5V power regulation into a modular electromechanical system.",
    overview:
      "I built this at BrainChild Engineering for a client demo that had to leave USB babysitting. The work meant migrating from an Arduino Mega / Bluetooth path to an ESP32 that owned motor sequencing; driving dual RS-775 flywheels through MOSFET modules under MCU PWM instead of pot speed controllers; indexing balls with a NEMA 17 on an A4988; and splitting a fused 12 V pack so actuators stayed on the high rail while a buck fed 5 V logic. The MOSFETs are hard switches: PWM duty cycle sets average motor voltage, and the motor’s inductance / inertia smooth the pulses. Failures taught as much as the architecture: no buck at first left the ESP32 dead on battery, the stepper print was too flimsy until a denser reprint, and a PWM test oversped a motor so hard that the fuse did not open, buck / battery solder joints came off, and a wire melted. It stayed a prototype on purpose: enough for a Replit-controlled multi-motor demo, not a finished consumer launcher.",
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
    buildStage: "Client prototype / demo",
    keyHighlights: [
      "Drove flywheels with MOSFET modules under ESP32 PWM so speed is duty cycle, not a half-on FET dumping heat",
      "Split a fused 12 V pack: actuators on the high rail, bucked 5 V for ESP32 / driver logic",
      "Survived an overspeed event where the fuse missed, buck/battery joints failed, and a wire melted, then hardened the bring-up checklist around protection and joints",
    ],
    architecture: [
      "Replit UI → ESP32 → MOSFET PWM + A4988 → RS-775s / NEMA 17 → feed + launch.",
      "12 V pack → fuse → MOSFET / VMOT; buck → 5 V for ESP32 and driver logic.",
      "PWM hard-switches the pack across the motor; inductance averages the pulses.",
    ],
    challenges: [
      "12 V pack without a buck converter left the ESP32 unable to run correctly off battery.",
      "PWM test oversped a motor; fuse did not interrupt; buck/battery solder came off and a wire melted.",
      "First 3D-printed stepper interface was too flimsy and poorly fastened under load.",
    ],
    lessonsLearned: [
      "MOSFET PWM is on/off at high frequency. Duty cycle is average voltage to the motor, not a DC voltage inside the FET.",
      "A fuse on the diagram is not enough if joints fail first and current has nowhere safe to go.",
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
          "After the flywheel ran away: fuse miss, failed joints, melted conductor.",
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
    buildStage: "Fabrication-ready Gerbers",
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
      "A simple circuit is fine if the manufacturing workflow is complete.",
      "Custom footprints are how parts actually mount.",
      "3D view catches mechanical issues DRC ignores.",
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
    buildStage: "Deployed MVP",
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
      "Capture and organization are different jobs; mixing them kills completion.",
      "One score collapses two different questions: quality vs personal impact.",
      "External catalog IDs and private journal state need different ownership and lifecycles.",
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
    buildStage: "Course project complete",
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
      "In tabular risk work, column discipline beats model flexing.",
      "Fit nothing before the split if you want a number you can defend.",
      "0.5 is a default, not a policy.",
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
    buildStage: "CLI pipeline working; expanding campaign tooling",
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
      "The review layer is both ethics and product quality.",
      "Extraction failures should be data, not silent guesses.",
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
    buildStage: "Shipped personal practice tool",
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
      "Niche tools win when they delete repeated friction.",
      "UX clarity matters as much as analysis quality.",
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
    buildStage: "Playable prototype complete",
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
      "Hardware faults and software bugs are tightly coupled in embedded work.",
      "Prototype staging reduces risk before packaging controls.",
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
    overview:
      "I dance, so I care when feedback is useless. Bhangra Coach uploads a clip, runs MediaPipe landmarks, aligns against a reference when tempos differ, then surfaces deltas in a Next.js UI with FastAPI and Supabase behind it. Raw joint error is not coaching. Alignment and wording are the product right now, and both still need work.",
    techStack: ["Next.js", "FastAPI", "MediaPipe", "Supabase", "Computer Vision"],
    githubUrl: "https://github.com/Rellendula26/bhangra-coach",
    liveUrl: "https://bhangra-coach.vercel.app",
    demoVideoUrl: "/projects/coverbhangraform.mp4",
    thumbnail: "/projects/bc1.png",
    images: ["/projects/bc1.png", "/projects/bcfeedback.png"],
    date: "2026",
    buildStage: "Iterating on feedback quality",
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
      "Feedback UX is as important as pipeline quality.",
      "Domain technique knowledge shapes useful features.",
    ],
    technicalNotes: ["Focus: robustness across angles and lighting."],
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
    overview:
      "SPARK project with a real deadline. We built Penn Plates on Next.js and Supabase so students could coordinate around dining without a bloated feature list. Auth and RLS had to be right. Scope cuts hurt, but they are why we had a demo instead of half-finished screens.",
    techStack: ["Next.js", "Supabase", "React"],
    demoVideoUrl: "/projects/pennplates.mp4",
    thumbnail: "/projects/website-1.png",
    images: ["/projects/website-1.png"],
    date: "2026",
    buildStage: "Demo-ready build completed",
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
      "Shipping on time is an engineering constraint.",
      "Product clarity beats feature density.",
    ],
    technicalNotes: ["Systems thinking applies to product scope too."],
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
    buildStage: "Continuous iteration",
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
      "Technical work does not automatically communicate itself.",
      "A smaller project becomes meaningful when learning and failure modes are clear.",
      "The hard problem was information architecture, not more animation.",
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
    lessonsLearned: ["Physical artifacts force precision software can paper over."],
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
    lessonsLearned: ["Communicating assumptions is as important as model scores."],
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
      "Two-wheel balancing robot with complementary-filtered IMU and cascade PID.",
    overview:
      "A multi-discipline build where chassis stiffness, star grounding, and a fixed 200 Hz control loop matter as much as the PID math. This page is the canonical engineering case-study template — realistic placeholder content that shows how future project pages should read.",
    techStack: ["STM32", "Cascade PID", "Complementary Filter", "Custom PCB", "PETG"],
    githubUrl: "https://github.com/Rellendula26",
    liveUrl: "https://example.com/drift-balancer-demo",
    thumbnail: "/projects/gallery/drift-architecture.svg",
    images: [
      "/projects/gallery/drift-architecture.svg",
      "/projects/gallery/drift-chassis.svg",
      "/projects/gallery/drift-pcb.svg",
      "/projects/gallery/drift-control-loop.svg",
    ],
    date: "Template 2026",
    buildStage: "Case-study template (placeholder)",
    keyHighlights: [
      "Cascade PID on a fixed 200 Hz ISR with telemetry off the critical path.",
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
      "Debuggability beats cleverness once the plant is real.",
      "Battery placement is a system constraint, not a packaging detail.",
      "Fixed-rate sampling turns tuning back into an experiment.",
    ],
    technicalNotes: [
      "Placeholder diagrams — replace with real CAD, PCB, and scope captures when migrating a live project.",
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

export const PROJECTS: Project[] = [...BASE_PROJECTS, ...INTAKE_PROJECTS].filter(
  isProjectVisible
);

/** Homepage / featured grid order. Keep tennis after Vend-A-Shoe. */
const FEATURED_SLUG_ORDER = [
  "c-compiler",
  "minitorch-ocaml",
  "bloombot",
  "saber",
  "vend-a-shoe",
  "tennis-ball-shooter",
  "drift-balancer",
] as const;

function featuredRank(slug: string) {
  const index = (FEATURED_SLUG_ORDER as readonly string[]).indexOf(slug);
  return index === -1 ? FEATURED_SLUG_ORDER.length : index;
}

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured).sort(
  (a, b) => featuredRank(a.slug) - featuredRank(b.slug)
);
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
