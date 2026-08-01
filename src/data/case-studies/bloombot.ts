import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * BloomBot case study.
 * Signal: embedded robotics / mechatronics integration.
 * Media hygiene: one primary clip per discipline; demo reserved for results/hero.
 */
export const BLOOMBOT_CASE_STUDY: EngineeringCaseStudy = {
  slug: "bloombot",
  motivation: {
    why: "I wanted a physical way for long-distance couples or friends to check in, not another chat notification. Something you walk up to, that opens, and that can carry a short message across WiFi.",
    interest:
      "Proximity has to open the bloom cleanly, and a remote message has to become Morse on the LED heart without starving the servo loop. Wireless, sensing, and actuation share the same board and power budget.",
    learning:
      "Demo day is a reliability problem. Retries, rail margin, and readable local feedback mattered as much as the flower motion itself.",
  },
  systemOverview: {
    summary:
      "BloomBot is an Arduino UNO R4 WiFi flower for remote check-ins. Walk close and ultrasonics trigger servos to open the bloom. Send a message over Blynk and an LED heart inside blinks that text in Morse. LCD status keeps the interaction readable. The application is connection at a distance. The engineering is keeping those loops honest together.",
    subsystems: [
      {
        name: "Wireless control plane",
        role: "Blynk delivers remote messages and control events over WiFi into firmware handlers.",
      },
      {
        name: "Proximity sensing",
        role: "Ultrasonic distance decides when someone is close enough to open the flower.",
      },
      {
        name: "Bloom actuation",
        role: "Servo motors open and close the flower as a coordinated motion, not a single sweep.",
      },
      {
        name: "Morse LED heart",
        role: "Submitted messages are encoded and blinked on an interior LED heart.",
      },
      {
        name: "LCD status",
        role: "On-device text so state is visible without a laptop during demos.",
      },
      {
        name: "Power & packaging",
        role: "Rails and harness have to survive concurrent servo current without brownouts.",
      },
    ],
    dataFlow:
      "Ultrasonic distance -> open/close servo sequence. Blynk message -> Morse encoder -> LED heart blink pattern. LCD mirrors status for the person next to the flower.",
    controlFlow:
      "Firmware interleaves sensor reads, servo updates, WiFi handlers, and Morse timing. Retries and timing guards keep a remote message from freezing the bloom mid-open.",
    diagram: {
      kind: "image",
      src: "/projects/bloombot-poster.jpg",
      alt: "BloomBot assembled platform",
      label: "Integrated platform",
      caption: "Proximity opens the bloom; remote messages become Morse on the LED heart.",
    },
  },
  disciplines: [
    {
      id: "mechatronics",
      discipline: "Electromechanical Actuation",
      goal: "Open and close the flower with multiple servos when someone steps into range, without killing the rail.",
      design:
        "Ultrasonic proximity gates a coordinated open sequence. Concurrent servo peaks are treated as a power and timing problem, not just a PWM list.",
      challenges: [
        "Concurrent servo loads brown out rails if sequencing and supply margin are wrong.",
        "Opening on noisy distance readings looks broken even when the mechanics are fine.",
        "Demo lighting and camera setups hide intermittent stalls that show up on stage.",
      ],
      iterations: [
        "Single-servo bring-up.",
        "Multi-servo open/close with staggered peaks.",
        "Distance-gated bloom so presence, not a button mash, opens the flower.",
      ],
      finalImplementation:
        "Proximity-triggered bloom motion integrated with the wireless message path and validated in live demos.",
      media: {
        kind: "video",
        src: "/projects/bloombot-web.mp4",
        alt: "BloomBot motion and interaction demo",
        poster: "/projects/bloombot-poster.jpg",
        label: "Live behavior",
        caption: "Get close and the flower opens; remote interaction stays on the same system.",
      },
    },
    {
      id: "embedded-control",
      discipline: "Embedded Control & Sensing",
      goal: "Keep ultrasonic reads, Morse LED timing, and Blynk handlers from stepping on each other during a public demo.",
      design:
        "Distance samples decide open/close. Message handlers encode text into Morse for the interior LED heart. LCD shows enough state that I do not need serial on the floor.",
      challenges: [
        "WiFi under demo RF conditions needs retry logic, not optimism.",
        "Blocking Morse or network calls in the wrong place freeze the bloom mid-motion.",
        "Sensor noise can false-trigger opens when nobody is actually close.",
      ],
      iterations: [
        "Local-only motion tests.",
        "Blynk message path into Morse LED.",
        "LCD status so remote and local interaction are both readable.",
      ],
      finalImplementation:
        "Firmware that couples proximity, remote messaging, Morse output, and bloom actuation into one interaction loop.",
      media: {
        kind: "video",
        src: "/projects/bloombotblynk.mp4",
        alt: "Blynk wireless control of BloomBot",
        label: "Wireless control",
        caption: "Remote messages hit the robot over Blynk and become on-device Morse.",
      },
    },
    {
      id: "integration",
      discipline: "Systems Integration",
      goal: "Ship a single platform where packaging, power, firmware, and UX fail as one system or not at all.",
      design:
        "Build documentation and public demo materials treat BloomBot as an integrated product. Harness routing, enclosure constraints, and software retries were co-debugged rather than owned by separate 'parts owners.'",
      challenges: [
        "Integration bugs present as 'WiFi is flaky' or 'servo is weak' when the real issue is shared power or loop timing.",
        "Demo rehearsal surfaces failure modes that bench tests miss.",
      ],
      iterations: [
        "Breadboarded subsystems.",
        "Packaged harness and enclosure bring-up.",
        "Full demo rehearsal with reconnect and brownout drills.",
      ],
      finalImplementation:
        "Shipped demo with Devpost documentation; next hardware revision targets cleaner harnessing and smoother interpolation.",
      media: {
        kind: "video",
        src: "/projects/makingbloombot-web.mp4",
        alt: "Building and integrating BloomBot",
        poster: "/projects/bloombot-poster.jpg",
        label: "Build process",
        caption: "Assembly and integration work behind the expressive demo.",
      },
    },
  ],
  designDecisions: [
    {
      id: "blynk",
      title: "Blynk for the control plane",
      problem: "How should remote intent reach firmware quickly for a demo?",
      alternatives: ["Custom mobile app", "Raw sockets", "Blynk virtual pins"],
      tradeoffs:
        "Custom apps cost schedule. Raw sockets need more UX. Blynk trades platform dependency for speed to a reliable control surface.",
      choice: "Blynk virtual pins. Integration time went to motion and power, not app chrome.",
    },
    {
      id: "feedback-channels",
      title: "On-robot feedback versus laptop-only debug",
      problem: "How do operators know state on the floor?",
      alternatives: ["Serial-only", "LCD + LED signaling", "App-only status"],
      tradeoffs:
        "Serial dies when the laptop is away. App-only status lies when WiFi drops. Local feedback survives both.",
      choice: "I2C LCD and Morse LED as first-class state channels.",
    },
    {
      id: "power-margin",
      title: "Power architecture under servo load",
      problem: "How do concurrent actuators stay within rail limits?",
      alternatives: ["Hope the USB rail holds", "Sequence peaks + dedicated margin", "Fewer servos"],
      tradeoffs:
        "Fewer servos kills expression. Sequencing and supply discipline preserve both motion and uptime.",
      choice: "Treat peak current as a design constraint; stabilize rails and stagger motion.",
    },
  ],
  evolution: [
    {
      id: "b1",
      phase: "Stage 1",
      title: "Motion bring-up",
      description: "Prove servos and basic choreography before networking.",
    },
    {
      id: "b2",
      phase: "Stage 2",
      title: "Wireless + sensing",
      description: "Blynk handlers and ultrasonic feedback enter the loop.",
    },
    {
      id: "b3",
      phase: "Stage 3",
      title: "Demo hardening",
      description: "Retries, feedback channels, and power fixes for public presentation.",
    },
    {
      id: "b4",
      phase: "Next",
      title: "Hardware revision",
      description: "Cleaner enclosure, harness, and smoother interpolation; optional sentiment-driven motion maps.",
    },
  ],
  results: {
    items: [
      {
        title: "Public demo",
        body: "People could walk up, trigger the bloom with proximity, and send remote messages that blinked Morse on the LED heart.",
        evidence: "Demo video + Devpost writeup",
      },
      {
        title: "Concept skit",
        body: "Short skit for the long-distance check-in idea: why a physical flower beats another chat ping when people are far apart.",
        evidence: "Watch on YouTube",
        evidenceHref: "https://www.youtube.com/watch?v=D3Kk4IFN1ps",
      },
      {
        title: "Integrated stack",
        body: "Proximity sensing, servo open/close, Blynk messaging, and Morse LED timing were validated together, not as isolated peripherals.",
        evidence: "Live interaction clips and build documentation",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/bloombot-web.mp4",
        alt: "BloomBot final demo evidence",
        poster: "/projects/bloombot-poster.jpg",
        label: "Demo evidence",
        caption: "Proximity opens the flower; remote messages land on the same system.",
      },
    ],
    limitations: [
      "Enclosure and harness still warrant a cleaner manufacturing revision.",
      "Motion interpolation and sentiment-driven mapping are future work.",
      "Demo WiFi environments remain a reliability variable.",
    ],
  },
  reflection: {
    surprises: [
      "Power and timing failures masqueraded as 'bad servos' or 'bad WiFi.'",
      "A cheap local feedback channel saved more demo time than another feature.",
    ],
    redesign: [
      "Design the harness and peak-current budget before locking choreography.",
      "Make reconnect behavior part of the state machine from day one.",
    ],
    future: [
      "Improved enclosure and wiring harness.",
      "Smoother servo interpolation.",
      "Richer mapping from external signals to motion patterns.",
    ],
    questions: [
      "How should expressive robots budget electrical margin the way they budget degrees of freedom?",
      "What feedback is worth putting on the robot versus in the client app?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "The product idea is long-distance presence. The engineering story is still wireless, sensing, and actuation sharing one power and timing budget.",
    },
    {
      kind: "design-insight",
      text: "If brownouts and retries are not designed, the flower open and the Morse heart are both fiction.",
    },
    {
      kind: "observation",
      text: "Demo confidence comes from failure-mode rehearsal, not from a clean bench video.",
    },
  ],
};
