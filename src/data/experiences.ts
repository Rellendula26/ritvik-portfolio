export type ExperienceTrack = "industry" | "club";

export type ExperienceKind =
  | "internship"
  | "leadership"
  | "role";

export type ExperienceMedia =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; alt: string; poster?: string; caption?: string };

export type Experience = {
  slug: string;
  org: string;
  role: string;
  kind: ExperienceKind;
  /** Internships/orgs vs school clubs — used by the list filter */
  track: ExperienceTrack;
  /** Display range, e.g. "Summer 2026" */
  dates: string;
  location?: string;
  /** ~2 second skim under the role title */
  oneLiner: string;
  /** 60–90 word executive overview */
  overview: string;
  /** Concrete ownership / outcomes for the exec block */
  highlights: string[];
  /** Skimmable focus tags */
  focus?: string[];
  /** Card + hero cover */
  cover: ExperienceMedia;
  /** Proof gallery on the detail page — prefer /experiences/<org>/… */
  gallery?: ExperienceMedia[];
  /** Optional related portfolio work */
  relatedProjects?: Array<{ label: string; href: string }>;
  /** Optional external org link */
  externalHref?: string;
};

export const EXPERIENCE_KIND_LABELS: Record<ExperienceKind, string> = {
  internship: "Internship",
  leadership: "Leadership",
  role: "Role",
};

export const EXPERIENCE_TRACK_LABELS: Record<ExperienceTrack, string> = {
  industry: "Internships",
  club: "School clubs",
};

/**
 * Official roles + school clubs.
 * Newest first. Detail lives at /experiences/[slug].
 * Media: web-safe files under public/experiences/<folder>/.
 */
export const EXPERIENCES: Experience[] = [
  {
    slug: "brainchild-engineering",
    org: "BrainChild Engineering",
    role: "Hardware Engineering Intern",
    kind: "internship",
    track: "industry",
    dates: "Summer 2026",
    location: "Client / workshop builds",
    oneLiner:
      "Designed, fabricated, and shipped client electromechanical systems spanning packaging, power, embedded control, and cloud-triggered actuation.",
    overview:
      "At BrainChild I owned hardware that had to leave the bench for real client demos and handoffs. The work cut across mechanical packaging, electrical distribution, embedded control, and cloud command queues. The hard part was never one subsystem alone; packaging moved the harness, electrical changes moved the enclosure, and software had to absorb manufacturing tolerances under internship deadlines.",
    highlights: [
      "Shipped Vend-A-Shoe: custom enclosure, wall AC→DC / USB-C PD path, Raspberry Pi control, and a cloud dispense queue for a client unit.",
      "Prototyped an automatic tennis-ball launcher on ESP32 with dual RS-775 flywheels, NEMA 17 feed, and MOSFET PWM switching for a phone-driven demo.",
      "Debugged failures that stacked across mechanical clearance, current budget, and software state instead of staying isolated.",
    ],
    focus: [
      "Electromechanical",
      "Embedded",
      "Power distribution",
      "Client delivery",
      "Raspberry Pi",
      "ESP32",
    ],
    cover: {
      kind: "image",
      src: "/experiences/brainchild/IMG_7410.jpeg",
      alt: "BrainChild Engineering team in the workshop",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/brainchild/IMG_7417.jpeg",
        alt: "BrainChild Engineering internship team",
        caption: "Team at BrainChild during the internship",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/unit.jpg",
        alt: "Assembled client hardware unit",
        caption: "Assembled unit off the breadboard",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/wall-power.jpg",
        alt: "Wall AC to DC power path",
        caption: "Wall power path from the internship",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/protoboard.jpg",
        alt: "Soldered protoboard",
        caption: "Soldered distribution board for actuators and accessories",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/raspberry-pi.jpg",
        alt: "Raspberry Pi control setup",
        caption: "Embedded control on Raspberry Pi",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/tennis-chassis.jpg",
        alt: "Tennis ball shooter chassis",
        caption: "Tennis-ball launcher chassis prototype",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/tennis-circuit.jpg",
        alt: "Launcher circuit and chassis",
        caption: "ESP32 launcher power and drive electronics",
      },
    ],
    relatedProjects: [
      { label: "Vend-A-Shoe", href: "/projects/vend-a-shoe" },
      { label: "Tennis Ball Shooter", href: "/projects/tennis-ball-shooter" },
    ],
    externalHref: "https://brainchildengineering.com/",
  },
  {
    slug: "quantum-opus",
    org: "Quantum Opus",
    role: "Engineering Intern",
    kind: "internship",
    track: "industry",
    dates: "Internship",
    location: "Plymouth, MI · SNSPD systems",
    oneLiner:
      "Hands-on lab work around superconducting nanowire single-photon detectors, high-speed pulse measurement, and fiber / optical test setups.",
    overview:
      "Quantum Opus builds turnkey Opus One™ systems: superconducting nanowire single-photon detectors (SNSPDs) with push-button cryogenics, used by teams at places like NASA, NIST, and national labs. Their detectors also supported Artemis II optical communications on the ground side, helping receive high-rate laser downlinks from cislunar space. In the lab I worked around that hardware stack: fiber paths, optical attenuation, and GHz-class scopes capturing detector pulses.",
    highlights: [
      "Brought up and probed SNSPD / pulse-readout paths on lab benches with fiber interconnects and optical attenuator modules.",
      "Captured and interpreted nanosecond-scale detector pulses on GHz oscilloscopes (including LeCroy WaveMaster and Tektronix scopes) while debugging live signal chains.",
      "Worked inside a company whose Opus One detectors supported Artemis II space-to-ground laser communications for HD video from the lunar vicinity.",
    ],
    focus: [
      "SNSPD",
      "Photon detection",
      "Fiber optics",
      "Oscilloscopes",
      "Cryogenics",
      "Artemis II (company)",
    ],
    cover: {
      kind: "image",
      src: "/experiences/quantum-opus/IMG_6360.jpg",
      alt: "LeCroy WaveMaster scope capturing high-speed pulses at Quantum Opus",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_5990.jpg",
        alt: "Tektronix optical attenuator modules with fiber connections",
        caption: "Optical attenuator / fiber path on the lab cart",
      },
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_6352.jpg",
        alt: "Tektronix TDS3054B oscilloscope on the Quantum Opus bench",
        caption: "Bench scope used while probing detector electronics",
      },
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_6360.jpg",
        alt: "High-speed pulse capture on LeCroy WaveMaster",
        caption: "Nanosecond pulse capture on a 6 GHz WaveMaster",
      },
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_6356.jpg",
        alt: "Quantum Opus lab equipment",
        caption: "Lab hardware during bring-up",
      },
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_5991.jpg",
        alt: "Quantum Opus lab setup",
        caption: "Fiber and electronics on the bench",
      },
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_6353.jpg",
        alt: "Quantum Opus lab workbench",
        caption: "Workbench during measurement",
      },
      {
        kind: "video",
        src: "/experiences/quantum-opus/IMG_5985.mp4",
        poster: "/experiences/quantum-opus/IMG_5983.jpg",
        alt: "Lab demo clip from Quantum Opus",
        caption: "Bench demo clip",
      },
      {
        kind: "video",
        src: "/experiences/quantum-opus/IMG_6355.mp4",
        poster: "/experiences/quantum-opus/IMG_6354.jpg",
        alt: "Measurement clip from Quantum Opus",
        caption: "Measurement clip",
      },
      {
        kind: "video",
        src: "/experiences/quantum-opus/IMG_6364.mp4",
        poster: "/experiences/quantum-opus/IMG_6362.jpg",
        alt: "Longer lab clip from Quantum Opus",
        caption: "Extended lab clip",
      },
    ],
    externalHref: "https://www.quantumopus.com/",
  },
  {
    slug: "stealth-startup",
    org: "Stealth AI Startup",
    role: "AI Engineering Intern",
    kind: "internship",
    track: "industry",
    dates: "Apr 2026 – Jun 2026",
    location: "Philadelphia, PA · Penn Innovation Award Winner",
    oneLiner:
      "Instrumented and sped up a latency-sensitive conversational AI pipeline spanning Next.js, Pipecat Cloud, Daily WebRTC, Tavus, and LLM/TTS services.",
    overview:
      "AI Engineering Intern at a stealth AI startup in Philadelphia (Penn Innovation Award Winner). The work focused on a live conversational avatar stack where startup latency and session reliability mattered in production. I profiled the critical path across Next.js, Pipecat Cloud, Daily WebRTC, Tavus, and LLM/TTS services, then redesigned session init so the avatar and first speech came up faster and more reliably.",
    highlights: [
      "Instrumented and profiled a latency-sensitive conversational AI pipeline spanning Next.js, Pipecat Cloud, Daily WebRTC, Tavus, and LLM/TTS services to isolate critical-path startup bottlenecks.",
      "Redesigned session initialization through asynchronous preconnection, connection-state synchronization, and WebRTC sequencing.",
      "Cut post-countdown avatar load to ~5s and first speech to ~7s, and improved production reliability.",
    ],
    focus: [
      "Next.js",
      "Pipecat Cloud",
      "Daily WebRTC",
      "Tavus",
      "LLM/TTS",
      "Latency",
    ],
    cover: {
      kind: "image",
      src: "/experiences/stealth-startup/cover.svg",
      alt: "Stealth AI startup engineering cover",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/stealth-startup/cover.svg",
        alt: "Stealth AI startup cover",
        caption: "Stealth company; public branding kept minimal",
      },
    ],
  },
  {
    slug: "penn-adapt",
    org: "Penn ADAPT",
    role: "Hardware Engineer · ADAPTLab",
    kind: "role",
    track: "club",
    dates: "Current",
    location: "Assistive tech · HMS collaboration",
    oneLiner:
      "Building an assistive button with ADAPTLab so disabled students can type through presses that map to space, tab, and other keyboard actions.",
    overview:
      "On Penn ADAPT's ADAPTLab team I work as a hardware engineer on an accessibility button for disabled students, in collaboration with HMS schools. The idea is simple to say and hard to get right: one physical press should become a reliable keyboard action (space, tab, and similar), so typing is possible without a full conventional keyboard. That means thinking about switch debounce, mapping, and a path that actually works for the students using it.",
    highlights: [
      "Hardware engineering on an assistive input button for disabled students in an HMS schools collaboration.",
      "Mapping physical presses to keyboard actions such as space and tab so typing can happen through the button.",
      "Working inside ADAPTLab's product loop: accessibility constraints first, then the electrical and firmware details that make presses trustworthy.",
    ],
    focus: [
      "Assistive hardware",
      "Accessibility",
      "Embedded input",
      "Human-centered design",
      "ADAPTLab",
    ],
    cover: {
      kind: "image",
      src: "/experiences/penn-adapt/cover.jpg",
      alt: "Penn ADAPT website homepage",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/penn-adapt/cover.jpg",
        alt: "Penn ADAPT website",
        caption: "pennadapt.com",
      },
    ],
    externalHref: "https://www.pennadapt.com/",
  },
  {
    slug: "penn-spark",
    org: "Penn SPARK",
    role: "Software Engineer",
    kind: "role",
    track: "club",
    dates: "Current",
    location: "Student engineering · product builds",
    oneLiner:
      "Software engineer in Penn SPARK; shipped Penn Plates, a campus dining app with real auth and a usable student loop.",
    overview:
      "At Penn SPARK I work as a software engineer on student products with real deadlines. My main shipped piece is Penn Plates: a Next.js and Supabase campus dining app where students can coordinate around dining without a bloated feature list. Auth and RLS had to be right; scope cuts are why we had a demo instead of half-finished screens.",
    highlights: [
      "Software engineer on Penn SPARK product teams.",
      "Built and shipped Penn Plates (Next.js + Supabase) with student auth, profiles, and a focused dining coordination loop.",
      "Cut scope to protect one usable flow under the SPARK timeline instead of chasing feature density.",
    ],
    focus: ["Next.js", "Supabase", "Product", "Auth", "Student apps"],
    cover: {
      kind: "image",
      src: "/experiences/penn-spark/cover.jpg",
      alt: "Penn SPARK website homepage",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/penn-spark/cover.jpg",
        alt: "Penn SPARK website",
        caption: "pennspark.org",
      },
      {
        kind: "video",
        src: "/projects/pennplates.mp4",
        alt: "Penn Plates demo",
        caption: "Penn Plates demo from the SPARK build",
      },
    ],
    relatedProjects: [
      { label: "Penn Plates (case study)", href: "/projects/pennplates" },
      { label: "Penn Plates (live)", href: "https://www.pennplates.org/" },
    ],
    externalHref: "https://pennspark.org/",
  },
];

export const FEATURED_EXPERIENCES = EXPERIENCES.filter(
  (experience) => experience.track === "industry"
).slice(0, 3);

export function getExperience(slug: string): Experience | undefined {
  return EXPERIENCES.find((experience) => experience.slug === slug);
}

export function experienceHref(slug: string) {
  return `/experiences/${slug}`;
}
