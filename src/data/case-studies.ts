export interface CaseStudySection {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  bullets?: string[];
  code?: string;
  diagram?: string;
}

export type CaseStudyGalleryItem = {
  src: string;
  alt: string;
  label?: string;
  kind?: "image" | "video";
};

export interface CaseStudyData {
  slug: string;
  title: string;
  positioning: string;
  role: string;
  timeline: string;
  stack: string[];
  impact: string[];
  github?: string;
  demo?: string;
  tags: string[];
  signal: string;
  heroImage?: CaseStudyGalleryItem;
  heroVideo?: { src: string; poster?: string };
  gallery?: CaseStudyGalleryItem[];
  problem: CaseStudySection;
  constraints: CaseStudySection;
  technical: CaseStudySection;
  build: CaseStudySection;
  results: CaseStudySection;
  lessons: CaseStudySection;
  pipeline?: string;
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  "c-compiler": {
    slug: "c-compiler",
    title: "C Compiler",
    positioning:
      "Built an OCaml-based C compiler lowering source through lexer → AST → semantic analysis → TACKY IR → x86-64 assembly, with lexical scoping, control flow, and structured IR lowering.",
    role: "Solo builder",
    timeline: "Spring 2026",
    stack: ["OCaml", "Recursive Descent", "TACKY IR", "x86-64 AT&T", "Make"],
    impact: [
      "Compiles nested unary expressions (~(-2)) to correct exit codes",
      "Full pipeline: Lexer → Parser → AST → TACKY → Asm → emit",
      "Stack-backed pseudoregister lowering with memory-to-memory fixups",
    ],
    github: "https://github.com/Rellendula26/c-compiler",
    tags: ["OCaml", "Compilers", "x86-64", "IR"],
    signal: "Systems",
    heroImage: {
      src: "/projects/gallery/c-compiler-source.svg",
      alt: "C compiler source input",
    },
    gallery: [
      { src: "/projects/gallery/c-compiler-source.svg", alt: "C source for unary.c", label: "C Source" },
      { src: "/projects/gallery/c-compiler-ast.svg", alt: "AST from recursive descent parser", label: "AST" },
      { src: "/projects/gallery/c-compiler-tacky.svg", alt: "TACKY intermediate representation", label: "TACKY IR" },
      { src: "/projects/gallery/c-compiler-asm.svg", alt: "Emitted x86-64 assembly", label: "x86-64 Assembly" },
      { src: "/projects/website-1.png", alt: "Compiler workspace and source files", label: "Workspace" },
      { src: "/projects/website-2.png", alt: "Build output and assembly inspection", label: "Build output" },
      { src: "/projects/website-cover.png", alt: "C compiler project overview", label: "Overview" },
    ],
    problem: {
      id: "problem",
      eyebrow: "Problem",
      title: "Frameworks hide the machine",
      body: "Calling clang is not understanding compilation. I wanted to internalize how source becomes stack frames, temporaries, and real instructions, starting from a minimal C subset and expanding incrementally.",
      bullets: [
        "Most coursework stops at parsing; codegen feels like a black box",
        "Nested unary ops break naive AST→asm approaches",
        "x86 forbids memory-to-memory moves, requires explicit fixups",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Constraints",
      title: "Deliberate language subset",
      body: "Scope is intentionally narrow to keep each stage correct before adding operators, variables, and control flow.",
      bullets: [
        "Only int main(void) with return expressions today",
        "Unary - and ~ with arbitrary nesting; -- rejected explicitly",
        "Apple Silicon requires x86_64 target for emitted assembly",
        "No optimizer passes yet, correctness over performance",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Technical Deep Dive",
      title: "Pipeline architecture",
      body: "TACKY IR is the key abstraction, it flattens nested expressions into temporaries before hardware-specific instruction selection.",
      diagram: `C Source
   ↓ Lexer (tokens)
   ↓ Parser (recursive descent → AST)
   ↓ tackygen (AST → TACKY IR)
   ↓ codegen (TACKY → Asm IR)
   ↓ emit (AT&T syntax)
x86-64 .s file`,
      bullets: [
        "Recursive descent handles arbitrary nesting: ~(-(~2))",
        "TACKY temps (tmp.0, tmp.1) lower to -4(%rbp), -8(%rbp)",
        "Invalid movl mem, mem fixed via %r10d scratch register",
        "driver.ml orchestrates end-to-end compilation",
      ],
      code: `;; TACKY for: return ~(-2);
tmp.0 = -2
tmp.1 = ~tmp.0
return tmp.1`,
    },
    build: {
      id: "build",
      eyebrow: "Build Process",
      title: "Incremental correctness",
      bullets: [
        "Started with return 42, proved lexer/parser/emit path",
        "Added unary negation, then bitwise complement",
        "Introduced TACKY when direct AST→asm became unmaintainable",
        "Debugged stack slot assignment and fixup pass on real hardware",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Verified on metal",
      bullets: [
        "./mycc tests/unary.c → out.s → clang -arch x86_64 → ./unary exits 1",
        "Syntax errors caught at parse stage for malformed programs",
        "Roadmap: binary ops, locals, control flow, function calls",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Lessons Learned",
      title: "IR is not optional",
      body: "The moment expressions nest, you need an intermediate form. TACKY paid for itself immediately, flattening logic separated from instruction selection and stack layout.",
      bullets: [
        "Compiler engineering is mostly incremental constraint management",
        "Test each stage in isolation before expanding language surface",
        "Reading assembly output is the fastest debug loop",
      ],
    },
    pipeline: `return ~(-2);
  → AST: Return(Complement(Negate(2)))
  → TACKY: tmp.0=-2; tmp.1=~tmp.0; return tmp.1
  → Asm: negl/notl on stack slots with r10d fixups`,
  },

  bloombot: {
    slug: "bloombot",
    title: "BloomBot IoT",
    positioning:
      "An interactive IoT-powered robotic flower: servo-driven petals, LED Morse signaling, LCD status, ultrasonic sensing, and wireless control through Blynk.",
    role: "Hardware + firmware · Ritvik Ellendula",
    timeline: "Spring 2026",
    stack: [
      "Arduino UNO R4 WiFi",
      "Blynk",
      "WiFiS3",
      "Servos",
      "I2C LCD",
      "Ultrasonic",
    ],
    impact: [
      "WiFi-enabled remote petal animations via Blynk",
      "Multi-servo sync + LCD + Morse LED feedback pipeline",
      "Devpost demo + performance skit shipped",
    ],
    github: "https://github.com/Rellendula26/bloombot-iot",
    demo: "https://devpost.com/software/bloombot-8syfva",
    tags: ["Arduino", "IoT", "Robotics", "Embedded", "Blynk"],
    signal: "Robotics",
    heroVideo: {
      src: "/projects/bloombot-web.mp4",
      poster: "/projects/bloombot-poster.jpg",
    },
    gallery: [
      {
        src: "/projects/makingbloombot-web.mp4",
        alt: "Building and assembling the BloomBot flower robot",
        label: "Making BloomBot",
        kind: "video",
      },
      {
        src: "/projects/bloombot-web.mp4",
        alt: "BloomBot hardware setup with LCD display and wiring",
        label: "Hardware setup",
        kind: "video",
      },
      {
        src: "/projects/bloombotblynk.mp4",
        alt: "Controlling BloomBot remotely through the Blynk app",
        label: "Blynk control",
        kind: "video",
      },
    ],
    problem: {
      id: "problem",
      eyebrow: "Overview",
      title: "Expressive robotics through motion and light",
      body: "BloomBot explores physical computing through a robotic flower that responds dynamically to remote input — combining actuator control, sensor integration, and IoT infrastructure into one interactive hardware experience.",
      bullets: [
        "WiFi-enabled IoT control using Blynk",
        "Servo-driven petal animations with multi-servo sync",
        "LCD text display + Morse-code LED communication",
        "Ultrasonic proximity sensing for environmental interaction",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Challenges",
      title: "Power, WiFi, and concurrent actuators",
      bullets: [
        "Stabilizing multi-servo power delivery (external supply required)",
        "Managing concurrent actuator behavior without brownouts",
        "Debugging wireless IoT connectivity during live demos",
        "LCD/I2C communication reliability alongside motion timing",
        "Synchronizing physical motion with real-time user interaction",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "System architecture",
      title: "Wireless interaction pipeline",
      diagram: `User (Blynk app)
      ↓ WiFi
Arduino UNO R4 WiFi — command processing
      ├→ Servo motors (petal animations)
      ├→ I2C LCD (status / messages)
      ├→ LEDs (Morse-code signaling)
      └→ Ultrasonic sensor (proximity events)`,
      bullets: [
        "Arduino C++ firmware on UNO R4 WiFi",
        "Blynk virtual pins → petal open/close sequences",
        "WiFiS3 networking stack for remote commands",
        "Sensor-based event logic + LCD I2C driver",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Hardware",
      title: "Breadboard IoT prototype",
      bullets: [
        "Arduino UNO R4 WiFi, servos, ultrasonic sensor",
        "I2C LCD, LEDs, breadboard wiring, external power",
        "Iterated from single-servo proof to synchronized multi-servo moves",
        "Demo narrative: Devpost write-up + associated performance skit",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Shipped interactive demo",
      bullets: [
        "Real-time remote interaction over Blynk",
        "Unified motion + display + LED feedback loop",
        "Documented on Devpost with video walkthrough",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Future improvements",
      title: "Roadmap",
      body: "Next steps: emotion-responsive motion, smoother servo interpolation, battery-powered enclosure, 3D-printed chassis, and expanded sensing.",
      bullets: [
        "AI-based sentiment → motion mapping",
        "Mobile app UI redesign + speech/audio hooks",
        "Battery enclosure + 3D-printed flower shell",
      ],
    },
  },

  snapfuel: {
    slug: "snapfuel",
    title: "SnapFuel",
    positioning:
      "Photo-first calorie tracking with honest uncertainty, AI estimates, human confirmation, Garmin-aware net calories.",
    role: "Full-stack builder",
    timeline: "May 2026",
    stack: ["Next.js 16", "TypeScript", "Supabase", "OpenAI Vision", "Vercel"],
    impact: [
      "End-to-end: upload → vision JSON → user edit → dashboard",
      "log_method distinguishes photo_ai vs manual entries",
      "GarminService interface ready for real API integration",
    ],
    github: "https://github.com/Rellendula26/snapfuel",
    tags: ["Next.js", "Supabase", "OpenAI", "Health Tech"],
    signal: "Full-Stack",
    heroImage: {
      src: "/projects/count-coach-1.png",
      alt: "SnapFuel meal logging interface",
    },
    gallery: [
      { src: "/projects/count-coach-2.png", alt: "SnapFuel dashboard and review flow" },
      { src: "/projects/count-coach-poster.png", alt: "SnapFuel app overview" },
    ],
    problem: {
      id: "problem",
      eyebrow: "Problem",
      title: "Logging food is too much friction",
      body: "Calorie apps fail when estimation is slow or opaque. I wanted snap-and-confirm flow with transparent confidence, and net calories vs burn, starting with manual Garmin import.",
      bullets: [
        "Manual database search breaks flow for home-cooked meals",
        "Users need to correct AI, not trust it blindly",
        "Net calorie view requires both intake and burn data",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Constraints",
      title: "MVP scope decisions",
      bullets: [
        "Vision estimates are not lab-accurate, confidence scores required",
        "Garmin Connect OAuth deferred; manual entry via GarminService",
        "RLS + anon Supabase client for user routes; service role reserved",
        "Server UTC 'today' may edge-case near midnight locally",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Technical Deep Dive",
      title: "Architecture",
      diagram: `/log → POST /api/analyze-meal (OpenAI vision)
         → MealReviewCard (user edits)
         → POST /api/meals (confirmed_calories)
/dashboard → GET /api/dashboard/today
/garmin → POST /api/garmin/manual → garmin_daily_summary`,
      bullets: [
        "Zod-validated vision JSON: items, macros, confidence enum",
        "meal_items table for line-item photo meals",
        "confirmed_calories drives dashboard totals, not raw AI output",
        "Storage bucket meal-images with RLS policies",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Build Process",
      title: "Shipped in one session",
      bullets: [
        "Schema-first: supabase/schema.sql + migration_v2.sql",
        "Six UI components: upload, review, manual form, dashboard, etc.",
        "Prompt engineering for structured JSON, not free text",
        "Vercel deploy checklist: auth redirects, storage policies",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Deployable MVP",
      bullets: [
        "Auth, photo log, manual log, dashboard, Garmin page working",
        "API routes separated from UI for future mobile client",
        "Documented limitations openly in README",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Lessons Learned",
      title: "Confirm, don't auto-trust",
      body: "The product insight is the edit step. AI gets you 80% there; confirmed_calories is the source of truth for analytics.",
      bullets: [
        "Interface boundaries (GarminService) pay off before API access",
        "Confidence enum sets user expectations better than a single number",
      ],
    },
  },

  "labreach-ai": {
    slug: "labreach-ai",
    title: "LabReach AI",
    positioning:
      "Research outreach automation with human review, scrape, summarize, draft, batch, and optionally Gmail-send on schedule.",
    role: "Solo builder",
    timeline: "Spring 2026",
    stack: ["Python", "Ollama", "BeautifulSoup", "Playwright", "SQLite", "Gmail OAuth"],
    impact: [
      "batch-listing discovers all professor URLs from department pages",
      "Campaign review HTML + JSON skip controls before send",
      "Scheduled send with HKT timing and inter-email delays",
    ],
    github: "https://github.com/Rellendula26/labreach-ai",
    tags: ["Python", "LLM", "Scraping", "Automation"],
    signal: "ML + Tools",
    heroImage: {
      src: "/projects/website-2.png",
      alt: "LabReach AI workflow and tooling",
    },
    gallery: [
      { src: "/projects/website-1.png", alt: "CLI and review pipeline screenshots" },
      { src: "/projects/website-cover.png", alt: "Project README and architecture overview" },
    ],
    problem: {
      id: "problem",
      eyebrow: "Problem",
      title: "Research outreach doesn't scale manually",
      body: "Finding labs, reading pages, and writing personalized emails is hours per professor. I needed a copilot that drafts fast but keeps humans in the loop.",
      bullets: [
        "Department listing pages hide dozens of profile URLs",
        "JS-heavy faculty sites break simple requests scraping",
        "Bulk send without review is ethically unacceptable",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Constraints",
      title: "Responsible automation",
      bullets: [
        "Default: local drafts only, no auto-send",
        "--confirm-send required for Gmail send path",
        "Personal email on page required before send",
        "Fixed Jinja template constrains LLM to body paragraphs only",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Technical Deep Dive",
      title: "Pipeline modules",
      diagram: `scraper/ → extractor/ → llm/ (Ollama)
         → pipeline.py → db/ (SQLite)
         → output_writer (CSV + .txt)
         → gmail/ (OAuth drafts/send)
         → review HTML + campaign JSON`,
      bullets: [
        "discover command extracts all profile links from listing pages",
        "Playwright fallback for JS-rendered faculty sites",
        "Modular LLM interface, Ollama default, swappable provider",
        "send-campaign: --schedule-hkt 13:00 --attach-resume",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Build Process",
      title: "CLI-first iteration",
      bullets: [
        "Single URL process → batch CSV → batch-listing discovery",
        "Gmail OAuth flow with credentials.json + token.json",
        "Review page generation before any send capability",
        "Sender background template in src/templates/background.py",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "End-to-end outreach system",
      bullets: [
        "Tested HKU MECH listing with --max-profiles 2",
        "Outputs: SQLite runs, CSV append, per-email .txt files",
        "Campaign skip via JSON status field",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Lessons Learned",
      title: "Automation needs brakes",
      body: "The best feature is --confirm-send and review HTML. Tools that touch other humans need explicit consent layers, not just speed.",
      bullets: [
        "Heuristic extractors fail gracefully, human edits expected",
        "Batch without discovery would not scale to department pages",
      ],
    },
  },

  "minitorch-ocaml": {
    slug: "minitorch-ocaml",
    title: "MiniTorch-OCaml",
    positioning:
      "Built a PyTorch-inspired autodiff engine in OCaml — graph-based tensor ops and reverse-mode differentiation through explicit graph traversal.",
    role: "Solo builder",
    timeline: "Spring 2026",
    stack: ["OCaml", "Autodiff", "Computational Graphs", "Gradient Checking"],
    impact: [
      "Reverse-mode AD with numerically verified gradients",
      "Graph-based backprop over custom tensor ops",
      "Training convergence observed through decreasing loss",
    ],
    github: "https://github.com/Rellendula26/minitorch-ocaml",
    tags: ["OCaml", "Autodiff", "ML Systems"],
    signal: "ML Systems",
    heroImage: {
      src: "/projects/gallery/minitorch-graph.svg",
      alt: "MiniTorch computation graph",
    },
    gallery: [
      { src: "/projects/gallery/minitorch-graph.svg", alt: "Computation graph with x, w, b, loss", label: "Comp. Graph" },
      { src: "/projects/gallery/minitorch-forward.svg", alt: "Forward pass and loss", label: "Forward Pass" },
      { src: "/projects/gallery/minitorch-backprop.svg", alt: "Reverse-mode backpropagation", label: "Backprop" },
      { src: "/projects/gallery/minitorch-gradcheck.svg", alt: "Gradient check and training curve", label: "Gradcheck" },
    ],
    problem: {
      id: "problem",
      eyebrow: "Problem",
      title: "Frameworks hide the graph",
      body: "Calling torch.backward() teaches you the API, not the mechanism. I wanted to implement the graph, gradients, and training loop in a language with strong types and algebraic data types.",
      bullets: [
        "Understand how values, gradients, and ops connect in a graph",
        "Verify correctness with numerical gradient checking",
        "Train small networks to prove the engine actually learns",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Constraints",
      title: "Correctness over features",
      bullets: [
        "OCaml ADTs for tensor nodes and op types",
        "No CUDA, CPU reference implementation first",
        "Gradient bugs are subtle, numerical checks are mandatory",
        "API surface kept small to preserve invariants",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Technical Deep Dive",
      title: "Subsystems",
      diagram: `Tensor ops → Graph nodes (value, grad, parents)
       → reverse traversal (backprop)
       → optimizer step → loss decrease`,
      bullets: [
        "Each node stores value, gradient, generating op, parent refs",
        "Autodiff engine implements reverse-mode over custom ops",
        "Model layer: parameter counts, shapes, layer stacking",
        "Predictions vs labels validate learning, not just running code",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Build Process",
      title: "Layer by layer",
      bullets: [
        "Scalars and tensor ops before graph abstraction",
        "Gradient check harness before training loops",
        "Loss curves as the acceptance test for each milestone",
        "Refactored types when graph traversal got messy",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Demonstrated learning",
      bullets: [
        "Gradient checking passes on core ops",
        "Training loss decreases over iterations",
        "Model summaries and prediction outputs match expectations",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Lessons Learned",
      title: "Types help, math still wins",
      body: "The hard part was translating calculus into abstractions that compose. OCaml caught structural bugs early; numerical gradient checks caught the subtle ones.",
      bullets: [
        "Build the graph IR before the nn.Module ergonomics",
        "Every new op needs a gradient test, not just a forward test",
      ],
    },
  },

  saber: {
    slug: "saber",
    title: "Lightsaber",
    positioning:
      "From whiteboard sketch to soldered, CAD-fitted handheld build, electronics, mechanical design, and integration.",
    role: "Solo builder",
    timeline: "Spring 2026 · Detkin Lab",
    stack: ["Fusion 360", "LED strip", "Tactile switch", "Soldering", "3D print"],
    impact: [
      "40+ solder joints across power, signal, and LED paths",
      "Three CAD components: hilt, emitter, battery carrier",
      "Demonstrable final assembly with working switch + LEDs",
    ],
    tags: ["Hardware", "CAD", "Circuits"],
    signal: "Hardware",
    heroVideo: {
      src: "/projects/lightsaber/fullsaber-web.mp4",
      poster: "/projects/lightsaber/saberwhite.png",
    },
    gallery: [
      {
        src: "/projects/lightsaber/fullsaber-web.mp4",
        alt: "Full lightsaber build demo with glowing blade",
        label: "Full demo",
        kind: "video",
      },
      {
        src: "/projects/lightsaber/sabercadp1.mp4",
        alt: "Fusion 360 CAD modeling of hilt components",
        label: "CAD design",
        kind: "video",
      },
      {
        src: "/projects/lightsaber/sabersauder1.mp4",
        alt: "Soldering power, signal, and LED joints",
        label: "Soldering",
        kind: "video",
      },
      {
        src: "/projects/lightsaber/saberfirstdemo.mp4",
        alt: "First handheld lightsaber demo",
        label: "First demo",
        kind: "video",
      },
      {
        src: "/projects/lightsaber/sabersecurity.mp4",
        alt: "Lab checkout and safety testing at Detkin",
        label: "Lab testing",
        kind: "video",
      },
      {
        src: "/projects/lightsaber/saberwhite.png",
        alt: "Whiteboard circuit planning and hilt sketch",
        label: "Whiteboard plan",
      },
      {
        src: "/projects/lightsaber/breadboardaudiocircuit.png",
        alt: "Breadboard audio circuit for the lightsaber",
        label: "Breadboard circuit",
      },
      {
        src: "/projects/lightsaber/perfboardaudiocircuit.png",
        alt: "Perfboard audio circuit for the lightsaber",
        label: "Perfboard circuit",
      },
    ],
    problem: {
      id: "problem",
      eyebrow: "Problem",
      title: "Learn hardware by shipping an object",
      body: "Software portfolios rarely show soldering, power budgeting, or mechanical fit. I wanted a project where the final artifact is physical and demoable.",
      bullets: [
        "Combine CAD, circuit design, and assembly in one build",
        "Practice real soldering at volume, not just breadboard snaps",
        "Integrate aesthetics (hilt design) with function (LED + switch)",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Constraints",
      title: "Shop realities",
      bullets: [
        "First serious soldering, flux and copper pad challenges",
        "Wire routing inside constrained hilt geometry",
        "Materials sourced from Detkin Lab inventory",
        "Some final media paths still being consolidated to repo",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Technical Deep Dive",
      title: "Physical architecture",
      diagram: `Battery → switch → LED driver path
       → strip mounted in emitter
       → hilt houses carrier + wiring
       → Fusion 360 tolerances for press-fit`,
      bullets: [
        "Circuit diagram before second build iteration",
        "LED strip segmentation for even glow in transparent blade",
        "Mechanical layers: hilt grip, emitter collar, battery door",
        "Solder joints rated for handheld flex and transport",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Build Process",
      title: "Sketch → CAD → solder",
      bullets: [
        "Household materials mock during spring break for proportions",
        "Whiteboard circuit before wiring",
        "CAD printed components iterated for fit",
        "Security/testing videos documented at Penn lab",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Finished handheld build",
      bullets: [
        "Working switch-actuated LED saber",
        "Integrated assembly, not a bench-only prototype",
        "Documented materials, soldering, and CAD process",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Lessons Learned",
      title: "Integration is the product",
      body: "The LED circuit was only half the project. Fit, wire length, and structural rigidity determined whether it felt real in hand.",
      bullets: [
        "CAD tolerance matters as much as schematic correctness",
        "Plan wire routes before closing the hilt shell",
      ],
    },
  },

  "arduino-tetris": {
    slug: "arduino-tetris",
    title: "Arduino TFT Tetris",
    positioning:
      "A handheld Tetris prototype on Arduino Nano + Adafruit ST7735 TFT — SPI graphics, physical buttons, collision detection, and a falling tetromino engine with no OS.",
    role: "Solo builder · Ritvik Ellendula",
    timeline: "Spring 2026",
    stack: [
      "Arduino Nano",
      "ST7735 TFT",
      "Adafruit GFX",
      "Adafruit ST7735",
      "SPI",
      "C++",
    ],
    impact: [
      "Real-time falling-piece engine with line clear + score",
      "SPI TFT rendering on constrained MCU hardware",
      "Portable breadboard handheld architecture",
    ],
    github: "https://github.com/Rellendula26/arduino-tetris",
    tags: ["Arduino", "Embedded", "C++", "SPI", "TFT", "Piezo"],
    signal: "Embedded",
    heroVideo: {
      src: "/projects/arduinotetris.mp4",
    },
    gallery: [
      {
        src: "/projects/arduinotetris.mp4",
        alt: "Tetris gameplay on ST7735 TFT display",
        label: "Gameplay demo",
        kind: "video",
      },
      {
        src: "/projects/fixingtetrissolder.mp4",
        alt: "Soldering and repairing the ST7735 TFT display connections",
        label: "Display bring-up",
        kind: "video",
      },
      {
        src: "/projects/twobuttonandcomputertetrist.mp4",
        alt: "Early two-button control test wired through laptop",
        label: "Button + dev test",
        kind: "video",
      },
      {
        src: "/projects/initialmaterials.jpg",
        alt: "Initial Tetris project materials",
        label: "Initial materials",
      },
      {
        src: "/projects/tetrissettup.jpg",
        alt: "Fully assembled Arduino Tetris handheld",
        label: "Fully wired setup",
      },
      {
        src: "/projects/gallery/arduino-tetris-gameplay.svg",
        alt: "TFT grid schematic",
        label: "TFT schematic",
      },
      {
        src: "/projects/fixingtetrissolder.mp4",
        alt: "Soldering handheld Tetris hardware",
        label: "Hardware build",
        kind: "video",
      },
    ],
    problem: {
      id: "problem",
      eyebrow: "Overview",
      title: "Tetris on embedded hardware",
      body: "This project recreates a simplified Tetris on bare metal — exploring embedded systems, low-level graphics, and interactive hardware design. Game logic, rendering, collision detection, and tetromino physics all run directly on the microcontroller.",
      bullets: [
        "Real-time falling tetromino engine",
        "SPI TFT graphics rendering (Adafruit GFX + ST7735)",
        "Physical button controls with debouncing",
        "Collision detection, line clearing, score tracking",
        "Piezo buzzer beeps for line clears and piece locks",
      ],
    },
    constraints: {
      id: "constraints",
      eyebrow: "Challenges",
      title: "SPI, wiring, and performance",
      bullets: [
        "Debugging unstable SPI display communication",
        "TFT initialization offsets / tab variant quirks",
        "Wiring and debouncing tactile button inputs",
        "Rendering performance on constrained hardware",
        "Reliable game-state collision logic under timing pressure",
      ],
    },
    technical: {
      id: "technical",
      eyebrow: "Software",
      title: "Game loop on bare metal",
      diagram: `loop():
  read debounced buttons
  update falling piece (gravity timer)
  collision → lock piece → line clear → score
  redraw grid (Adafruit_GFX) → ST7735 SPI flush`,
      bullets: [
        "Arduino C++ · Adafruit GFX + ST7735 libraries",
        "SPI protocol for display communication",
        "Tetromino shapes as fixed grid / bitmask state",
        "No OS — portable USB/battery breadboard architecture",
      ],
    },
    build: {
      id: "build",
      eyebrow: "Hardware",
      title: "Handheld breadboard prototype",
      bullets: [
        "Arduino Nano + 1.8\" Adafruit ST7735 TFT + piezo buzzer",
        "Tactile push buttons, jumper wiring, breadboard layout",
        "Display solder/repair work to stabilize SPI connections",
        "Two-button laptop test before full handheld controls",
      ],
    },
    results: {
      id: "results",
      eyebrow: "Results",
      title: "Playable prototype",
      bullets: [
        "Full gameplay loop on device: fall, collide, clear, score",
        "Handheld form factor on breadboard power",
        "Documented build + demo videos in gallery",
      ],
    },
    lessons: {
      id: "lessons",
      eyebrow: "Future improvements",
      title: "Roadmap",
      body: "Next: piece rotation, smoother animations, battery enclosure, 3D-printed shell, sound effects, difficulty scaling, and start / game-over UI.",
      bullets: [
        "Piece rotation + improved visual effects",
        "Battery-powered enclosure + 3D-printed handheld shell",
        "Sound, music, and difficulty scaling",
      ],
    },
  },
};
