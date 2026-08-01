import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/** Shared lighter case studies for product / embedded / CAD pages. */

export const LABREACH_CASE_STUDY: EngineeringCaseStudy = {
  slug: "labreach-ai",
  motivation: {
    why: "Research outreach prep was repetitive, and fully automatic emailing felt reckless. I wanted help without a silent send button.",
    interest:
      "Faculty pages are messy. LLM drafts are easy. Sending the wrong email is expensive.",
    learning:
      "I built scrape, draft, review, then maybe send. Local Ollama is there when I do not want research notes leaving my machine.",
  },
  systemOverview: {
    summary:
      "LabReach finds lab pages, pulls context, drafts outreach, and forces a review step before Gmail can send anything.",
    subsystems: [
      { name: "Discovery", role: "Crawl department listings and candidate lab URLs." },
      { name: "Extraction", role: "Pull emails and research context from messy faculty pages." },
      { name: "Drafting", role: "Local or configured LLM turns context into outreach text." },
      { name: "Review gate", role: "Human checkpoint is mandatory before send scheduling." },
    ],
    dataFlow: "URLs → scrape/extract → structured profiles → LLM draft → review artifacts → optional send.",
    controlFlow: "Campaign state lives in SQLite. Send actions are explicit; drafts never auto-mail.",
  },
  disciplines: [
    {
      id: "extraction",
      discipline: "Acquisition & Extraction",
      goal: "Turn JS-heavy faculty pages into structured outreach context.",
      design: "BeautifulSoup plus Playwright for pages that defeat static HTML. Extraction quality varies; the pipeline records failures instead of guessing emails.",
      challenges: [
        "JS-rendered directories break naive scrapers.",
        "Email formats and robots policies vary by department.",
      ],
      iterations: ["Static scrape", "Playwright path", "Per-site failure logging"],
      finalImplementation: "Hybrid extraction with stored context for the drafting stage.",
    },
    {
      id: "copilot",
      discipline: "Drafting & Control Plane",
      goal: "Accelerate writing without removing human accountability.",
      design: "Ollama/local drafting option, template context, and review artifacts before Gmail API send.",
      challenges: [
        "Automation without brakes creates reputation risk.",
        "Draft quality still needs domain-aware editing.",
      ],
      iterations: ["Single-email script", "Campaign history", "Hard review gate"],
      finalImplementation: "CLI pipeline where review is part of the product, not an afterthought.",
    },
  ],
  designDecisions: [
    {
      id: "human-gate",
      title: "Human review as invariant",
      problem: "Can drafts ever send automatically?",
      alternatives: ["Auto-send", "Review required"],
      tradeoffs: "Auto-send is faster and unsafe for cold academic outreach.",
      choice: "Review artifacts required before send.",
    },
    {
      id: "local-llm",
      title: "Local drafting option",
      problem: "Where should sensitive research text go?",
      alternatives: ["Cloud-only LLM", "Local Ollama path"],
      tradeoffs: "Cloud is convenient; local keeps drafts off third-party servers.",
      choice: "Support local drafting for sensitive workflows.",
    },
  ],
  evolution: [
    { id: "l1", phase: "v1", title: "Script", description: "One-off scrape and draft." },
    { id: "l2", phase: "v2", title: "Pipeline", description: "Discovery, storage, and review gates." },
    { id: "l3", phase: "Next", title: "Observability", description: "Stronger campaign retries and metrics." },
  ],
  results: {
    items: [
      {
        title: "Working CLI pipeline",
        body: "End-to-end prep flow with a mandatory review step before mail.",
        evidence: "GitHub labreach-ai",
      },
    ],
    limitations: ["Not a hosted SaaS; extraction quality remains site-dependent."],
  },
  reflection: {
    surprises: ["The review layer mattered more than clever prompting."],
    redesign: ["More structured schema for faculty pages."],
    future: ["Campaign observability and safer retry policies."],
    questions: ["Where should academic outreach automation stop?"],
  },
  engineeringNotes: [
    { kind: "engineering-note", text: "Speed without a send brake is not a feature." },
    { kind: "design-insight", text: "Extraction failures should be data, not silent guesses." },
  ],
};

export const COUNT_COACH_CASE_STUDY: EngineeringCaseStudy = {
  slug: "count-coach",
  motivation: {
    why: "Rehearsal time kept disappearing into 'where's that count' and 'what's the BPM of this section.'",
    interest:
      "If the waveform selection and the analyzer disagree on boundaries, dancers think the tempo tool is broken.",
    learning:
      "I moved a Colab prototype into a deployed Next.js app with Python analysis so I could use it in real practice.",
  },
  systemOverview: {
    summary:
      "Pick a region on a waveform, get tempo back, keep practicing. Thin web UI, analysis on the server.",
    subsystems: [
      { name: "Waveform UI", role: "WaveSurfer selection bound to analysis requests." },
      { name: "Tempo analysis", role: "Server-side Librosa-style BPM inference on the selected segment." },
      { name: "Practice loop", role: "Overlay guidance for targeted repetition." },
    ],
    dataFlow: "Audio → region select → analysis API → BPM/metrics → UI overlay.",
  },
  disciplines: [
    {
      id: "signal-ui",
      discipline: "Signal × Interface",
      goal: "Make tempo tools feel immediate during rehearsal.",
      design: "Waveform selection posts segment metadata; backend returns practice metrics; UI stays minimal.",
      challenges: [
        "Selection boundaries must match what the analyzer hears.",
        "Latency kills rehearsal flow if every scrub blocks.",
      ],
      iterations: ["Colab prototype", "Deployed app", "Selection/analysis boundary fixes"],
      finalImplementation: "Shipped practice tool used personally for sectioned rehearsal.",
      media: {
        kind: "video",
        src: "/projects/count-coach-demo.mp4",
        alt: "Count Coach waveform and BPM demo",
        poster: "/projects/count-coach-poster.png",
        label: "Practice loop",
        caption: "Region select → analysis → rehearsal guidance.",
      },
    },
  ],
  designDecisions: [
    {
      id: "server-bpm",
      title: "Server-side tempo analysis",
      problem: "Where should Librosa-class work run?",
      alternatives: ["Fully client-side", "Server analysis"],
      tradeoffs: "Client keeps data local but fights package weight; server keeps UX light.",
      choice: "Server analysis with a thin Next.js client.",
    },
  ],
  evolution: [
    { id: "cc1", phase: "v1", title: "Colab", description: "Analysis prototype." },
    { id: "cc2", phase: "v2", title: "Deployed", description: "Waveform UI + API path." },
  ],
  results: {
    items: [
      {
        title: "Shipped practice tool",
        body: "Used for personal dance rehearsal with waveform-linked BPM analysis.",
        evidence: "live demo + demo video",
      },
    ],
    limitations: ["Niche UX; not a full studio suite."],
  },
  reflection: {
    surprises: ["Boundary sync bugs felt like 'wrong BPM' to users."],
    redesign: ["Richer loop controls."],
    future: ["Movement-aware cues."],
    questions: ["How little UI can a serious practice tool get away with?"],
  },
  engineeringNotes: [
    { kind: "observation", text: "Niche tools win when they delete repeated friction." },
  ],
};

export const ARDUINO_TETRIS_CASE_STUDY: EngineeringCaseStudy = {
  slug: "arduino-tetris",
  motivation: {
    why: "I wanted Tetris on hardware I could hold, with no host computer cheating on the game loop.",
    interest:
      "Most of the scary bugs were solder and SPI bring-up pretending to be logic errors.",
    learning:
      "Two-button harness first. Full controls later. Saves a lot of fake debugging.",
  },
  systemOverview: {
    summary:
      "Arduino Nano + ST7735 Tetris. Input, gravity, collision, scoring, redraw, and piezo cues all run on the board.",
    subsystems: [
      { name: "Game state", role: "Compact grid and active tetromino representation." },
      { name: "Display pipeline", role: "SPI ST7735 updates under Adafruit GFX." },
      { name: "Controls", role: "Physical buttons with debounce." },
      { name: "Audio cues", role: "Piezo events on lock/clear." },
    ],
    dataFlow: "Buttons → state update/collision → framebuffer/SPI → optional piezo.",
    controlFlow: "Single real-time loop; no OS scheduler to hide hitching.",
  },
  disciplines: [
    {
      id: "embedded-loop",
      discipline: "Embedded Game Loop",
      goal: "Keep controls responsive while redrawing on a constrained SPI panel.",
      design: "Main loop sequences input, gravity tick, collision, scoring, and redraw with a compact board representation.",
      challenges: [
        "Panel init quirks differ by ST7735 variant.",
        "Overdraw kills responsiveness.",
      ],
      iterations: ["Logic on serial", "Two-button prototype", "Full handheld controls"],
      finalImplementation: "Playable on-device Tetris with scoring and sound cues.",
      media: {
        kind: "video",
        src: "/projects/arduinotetris.mp4",
        alt: "Arduino Tetris gameplay",
        label: "On-device play",
        caption: "Game loop, rendering, and controls on the Nano.",
      },
    },
    {
      id: "hw-debug",
      discipline: "Hardware Bring-up",
      goal: "Separate solder faults from logic faults.",
      design: "Display intermittents were chased at the joint before rewriting game code. Two-button staging reduced variables.",
      challenges: [
        "Intermittent SPI looked like random sprite corruption.",
        "Debounce and mechanical bounce mimic 'missed inputs.'",
      ],
      iterations: ["Computer-driven prototype", "Solder rework", "Packaged buttons"],
      finalImplementation: "Stable display path after joint-level fixes; playable handheld.",
      media: {
        kind: "video",
        src: "/projects/fixingtetrissolder.mp4",
        alt: "Display solder bring-up",
        label: "Display bring-up",
        caption: "Hardware faults first; then software polish.",
      },
    },
  ],
  designDecisions: [
    {
      id: "on-device",
      title: "Fully on-device logic",
      problem: "Should a host computer own game state?",
      alternatives: ["Host-assisted", "Bare-metal on MCU"],
      tradeoffs: "Host is easier; on-device teaches real timing and memory limits.",
      choice: "Everything on the Nano.",
    },
  ],
  evolution: [
    { id: "t1", phase: "v1", title: "Two-button harness", description: "Prove controls and loop." },
    { id: "t2", phase: "v2", title: "SPI bring-up", description: "Fix joints and init quirks." },
    { id: "t3", phase: "v3", title: "Playable build", description: "Full rules + sound cues." },
  ],
  results: {
    items: [
      {
        title: "Playable prototype",
        body: "Real-time Tetris with physical controls on ST7735.",
        evidence: "Gameplay and bring-up videos",
      },
    ],
    limitations: ["Enclosure polish and difficulty ramps still open."],
  },
  reflection: {
    surprises: ["Most 'logic bugs' were solder."],
    redesign: ["Earlier fixture for display continuity tests."],
    future: ["Rotation polish, difficulty ramps, enclosure."],
    questions: ["How do you budget redraw vs input latency on 8-bit-class boards?"],
  },
  engineeringNotes: [
    { kind: "engineering-note", text: "In embedded games, the first debugger is often a multimeter." },
  ],
};

export const BHANGRA_COACH_CASE_STUDY: EngineeringCaseStudy = {
  slug: "bhangra-coach",
  motivation: {
    why: "As a dancer, 'your elbow is 12 degrees off' is not useful feedback. I wanted cues I would actually fix.",
    interest:
      "People dance at different tempos. Align first, then compare. Otherwise the numbers are noise.",
    learning:
      "Upload, MediaPipe, alignment, feedback UI, Supabase storage. Still iterating on cue quality.",
  },
  systemOverview: {
    summary:
      "Compare a user clip to a reference with pose landmarks, temporal alignment, and a review UI.",
    subsystems: [
      { name: "Upload UI", role: "Capture and review clips in Next.js." },
      { name: "Pose service", role: "FastAPI + MediaPipe landmark extraction." },
      { name: "Comparison", role: "Temporal alignment and delta metrics." },
      { name: "Storage", role: "Supabase metadata and outputs." },
    ],
    dataFlow: "Clips → landmarks → alignment → coaching cues → UI.",
  },
  disciplines: [
    {
      id: "cv-pipeline",
      discipline: "Vision Pipeline",
      goal: "Turn two performances into comparable motion signals.",
      design: "MediaPipe landmarks for user and reference; alignment layer before metric diffs; interpret deltas as cues.",
      challenges: [
        "Tempo differences break naive frame-wise compare.",
        "Camera angle and lighting shift landmark quality.",
      ],
      iterations: ["Raw pose overlay", "Alignment layer", "Cue wording pass"],
      finalImplementation: "Working upload/process/feedback loop under active iteration.",
      media: {
        kind: "video",
        src: "/projects/coverbhangraform.mp4",
        alt: "Bhangra Coach form feedback demo",
        poster: "/projects/bc1.png",
        label: "Feedback demo",
        caption: "Pose comparison surfaced as coaching feedback.",
      },
    },
  ],
  designDecisions: [
    {
      id: "alignment",
      title: "Explicit temporal alignment",
      problem: "How do you compare dancers at different speeds?",
      alternatives: ["Frame index compare", "Alignment before metrics"],
      tradeoffs: "Index compare is easy and wrong; alignment adds complexity and truth.",
      choice: "Align first, then score.",
    },
  ],
  evolution: [
    { id: "bc1", phase: "v1", title: "Pose extract", description: "Landmarks working." },
    { id: "bc2", phase: "v2", title: "Full stack", description: "Upload + storage + feedback UI." },
    { id: "bc3", phase: "Now", title: "Cue quality", description: "Robustness across angles/lighting." },
  ],
  results: {
    items: [
      {
        title: "End-to-end coach loop",
        body: "Clips can be uploaded, processed, and reviewed with pose-based feedback.",
        evidence: "Live app + demo video",
      },
    ],
    limitations: ["Feedback quality still iterating; not a finished pedagogy product."],
  },
  reflection: {
    surprises: ["UX wording mattered as much as landmark error."],
    redesign: ["Stronger camera-calibration guidance."],
    future: ["More robust multi-angle models."],
    questions: ["What numeric delta becomes a useful dance cue?"],
  },
  engineeringNotes: [
    { kind: "design-insight", text: "Pose deltas are measurements; coaching is interpretation." },
  ],
};

export const PENNPLATES_CASE_STUDY: EngineeringCaseStudy = {
  slug: "pennplates",
  motivation: {
    why: "SPARK project with a clock. Dining coordination for students, not a feature museum.",
    interest:
      "Auth and RLS had to work. Everything else had to survive cuts.",
    learning:
      "We shipped a smaller product that demoed instead of a larger one that did not.",
  },
  systemOverview: {
    summary:
      "Penn Plates: Next.js + Supabase campus dining app with auth and a small student interaction loop.",
    subsystems: [
      { name: "Auth/profile", role: "Supabase-backed identity with RLS." },
      { name: "Social dining flows", role: "Lightweight coordination features for students." },
    ],
    dataFlow: "Client actions → Supabase under RLS → shared dining state.",
  },
  disciplines: [
    {
      id: "product-systems",
      discipline: "Product Systems",
      goal: "Ship a usable student product on time.",
      design: "Next.js + Supabase with RLS-grounded profiles and a deliberately small interaction set.",
      challenges: [
        "Ambition vs timeline.",
        "Social features sprawl without a crisp loop.",
      ],
      iterations: ["Scope cuts", "Auth/profile hardening", "Demo-ready polish"],
      finalImplementation: "Demo-ready SPARK build with practical student flows.",
      media: {
        kind: "video",
        src: "/projects/pennplates.mp4",
        alt: "Penn Plates app demo",
        poster: "/projects/website-1.png",
        label: "Product demo",
        caption: "Student-facing dining coordination flow.",
      },
    },
  ],
  designDecisions: [
    {
      id: "scope",
      title: "Cut features to protect the core loop",
      problem: "What ships before demo day?",
      alternatives: ["Wide feature set", "Narrow usable loop"],
      tradeoffs: "Wide looks impressive and breaks; narrow ships.",
      choice: "Protect auth + core social dining loop.",
    },
  ],
  evolution: [
    { id: "p1", phase: "Build", title: "SPARK sprint", description: "Team execution to demo." },
  ],
  results: {
    items: [
      {
        title: "Demo-ready product",
        body: "Auth-backed student dining app completed under SPARK constraints.",
        evidence: "Demo video",
      },
    ],
    limitations: ["Campus-specific scope; not a consumer-scale launch."],
  },
  reflection: {
    surprises: ["Scope control was the real systems problem."],
    redesign: ["Earlier user tests on the core loop."],
    future: ["Richer coordination only after retention evidence."],
    questions: ["How do student teams practice saying no?"],
  },
  engineeringNotes: [
    { kind: "observation", text: "Shipping on time is an engineering constraint, not a soft skill footnote." },
  ],
};

export const BRAIN_CASE_STUDY: EngineeringCaseStudy = {
  slug: "brain",
  motivation: {
    why: "I wanted a brain I could hold, not another Maya screenshot.",
    interest:
      "Detail that will not print is just ego. Walls and overhangs decide what survives.",
    learning:
      "Early reminder that physical builds punish sloppy geometry.",
  },
  systemOverview: {
    summary:
      "Maya brain model cleaned for FDM, printed, and labeled as a study piece.",
    subsystems: [
      { name: "Digital sculpt", role: "Gyri/sulci forms in Maya." },
      { name: "Print prep", role: "Geometry cleaned for FDM stability." },
      { name: "Physical labeling", role: "Tangible study artifact." },
    ],
    dataFlow: "Maya model → print prep → physical labeled print.",
  },
  disciplines: [
    {
      id: "cad-print",
      discipline: "CAD → Print",
      goal: "Preserve anatomical readability in a printable solid.",
      design: "Sculpted cortical detail balanced against overhangs and wall stability; physical labels after print.",
      challenges: ["Detail vs print reliability.", "Label placement without obscuring form."],
      iterations: ["Digital only", "Print test", "Labeled study model"],
      finalImplementation: "Archived physical model kept as early build evidence.",
      media: {
        kind: "image",
        src: "/projects/brain-1.png",
        alt: "3D printed brain model",
        label: "Physical model",
        caption: "Printed anatomical study piece.",
      },
    },
  ],
  designDecisions: [
    {
      id: "clarity",
      title: "Clarity over micro-detail",
      problem: "How much cortical detail survives FDM?",
      alternatives: ["Maximum mesh detail", "Readable printable form"],
      tradeoffs: "Max detail shreds on printers; readability teaches more.",
      choice: "Readable printable anatomy.",
    },
  ],
  evolution: [
    { id: "br1", phase: "High school", title: "Model + print", description: "End-to-end physical artifact." },
  ],
  results: {
    items: [
      {
        title: "Physical artifact",
        body: "Labeled printed brain produced from Maya geometry.",
        evidence: "Photo of printed model",
      },
    ],
    limitations: ["Archived early work; not a research-grade atlas."],
  },
  reflection: {
    surprises: ["Print failures teach topology faster than tutorials."],
    redesign: ["Earlier overhang reviews."],
    future: ["Sectioned multi-color prints if revisited."],
    questions: ["What detail is pedagogically necessary versus decorative?"],
  },
  engineeringNotes: [
    { kind: "observation", text: "Physical artifacts force precision software can paper over." },
  ],
};

export const OIDD_CASE_STUDY: EngineeringCaseStudy = {
  slug: "OIDD",
  motivation: {
    why: "OIDD capstone. Messy health and socioeconomic data, and a writeup that had to stay honest.",
    interest:
      "Fitting a tree is easy. Not overclaiming causality from observational data is the actual work.",
    learning:
      "Clean, plot, model, interpret, and put assumptions next to the results.",
  },
  systemOverview: {
    summary:
      "Course analysis of socioeconomic factors and health outcomes in Python, with interpretable models and explicit limits.",
    subsystems: [
      { name: "Prep", role: "Cleaning and feature framing." },
      { name: "EDA", role: "Seaborn-driven visual analysis." },
      { name: "Models", role: "Decision-tree style exploration with interpretation." },
    ],
    dataFlow: "Dataset → cleaning → EDA → model fit → written interpretation.",
  },
  disciplines: [
    {
      id: "analysis",
      discipline: "Analysis Workflow",
      goal: "Produce interpretable findings under a fixed course schedule.",
      design: "Pandas cleaning, Seaborn visuals, decision-tree exploration with explicit assumptions.",
      challenges: [
        "Rigor vs deadline.",
        "Avoiding overclaiming causal stories from observational data.",
      ],
      iterations: ["Raw EDA", "Model exploration", "Interpretation pass"],
      finalImplementation: "Archived capstone analysis with documented assumptions.",
      media: {
        kind: "image",
        src: "/projects/OIDD.png",
        alt: "OIDD health outcomes analysis visual",
        label: "Analysis snapshot",
        caption: "Course capstone analysis artifact.",
      },
    },
  ],
  designDecisions: [
    {
      id: "interpretability",
      title: "Prefer interpretable models for the writeup",
      problem: "Maximize AUC or maximize explainability?",
      alternatives: ["Black-box chase", "Interpretable trees + clear limits"],
      tradeoffs: "Black boxes impress slides; trees teach stakeholders.",
      choice: "Interpretable exploration with stated limits.",
    },
  ],
  evolution: [
    { id: "o1", phase: "Course", title: "Capstone arc", description: "Prep → EDA → model → interpret." },
  ],
  results: {
    items: [
      {
        title: "Completed analysis",
        body: "End-to-end socioeconomic health outcomes workflow delivered for OIDD.",
        evidence: "Course project artifacts",
      },
    ],
    limitations: ["Archived coursework; not a deployment study."],
  },
  reflection: {
    surprises: ["Assumption writeups took as long as fitting."],
    redesign: ["Earlier data dictionary lock."],
    future: ["Stronger causal language discipline if revisited."],
    questions: ["How do you show uncertainty without drowning a non-technical reader?"],
  },
  engineeringNotes: [
    { kind: "engineering-note", text: "Communicating assumptions is part of the deliverable." },
  ],
};

export const PRODUCT_APP_CASE_STUDIES: EngineeringCaseStudy[] = [
  LABREACH_CASE_STUDY,
  COUNT_COACH_CASE_STUDY,
  ARDUINO_TETRIS_CASE_STUDY,
  BHANGRA_COACH_CASE_STUDY,
  PENNPLATES_CASE_STUDY,
  BRAIN_CASE_STUDY,
  OIDD_CASE_STUDY,
];
