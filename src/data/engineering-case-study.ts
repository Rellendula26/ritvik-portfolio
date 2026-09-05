/**
 * Engineering case-study model.
 *
 * Project (projects.ts) remains the Executive Summary / hero source of truth.
 * EngineeringCaseStudy holds the narrative below the hero.
 *
 * Wire a case study by slug. Pages without a case study fall back to the
 * legacy insight-card layout until migrated.
 */

import { C_COMPILER_CASE_STUDY } from "@/data/case-studies/c-compiler";
import { MINITORCH_CASE_STUDY } from "@/data/case-studies/minitorch";
import { BLOOMBOT_CASE_STUDY } from "@/data/case-studies/bloombot";
import { CIS5450_CASE_STUDY } from "@/data/case-studies/cis5450";
import { ULTRASONIC_PCB_CASE_STUDY } from "@/data/case-studies/ultrasonic-pcb";
import { PRODUCT_APP_CASE_STUDIES } from "@/data/case-studies/product-apps";
import { WEBSITE_CASE_STUDY } from "@/data/case-studies/website";
import { VEND_A_SHOE_CASE_STUDY } from "@/data/case-studies/vend-a-shoe";
import { TENNIS_BALL_SHOOTER_CASE_STUDY } from "@/data/case-studies/tennis-ball-shooter";
import { AFTERTHOUGHT_CASE_STUDY } from "@/data/case-studies/afterthought";
import { PER_POWER_ELECTRONICS_CASE_STUDY } from "@/data/case-studies/per-power-electronics";
import { HYPERLOOP_VFD_CASE_STUDY } from "@/data/case-studies/hyperloop-vfd";

export type EngineeringNoteKind =
  | "engineering-note"
  | "design-insight"
  | "observation";

export type CaseStudyMedia =
  | {
      kind: "image";
      src: string;
      alt: string;
      label?: string;
      caption?: string;
      /** Taller frame for phone-shot / vertical subject matter. */
      portrait?: boolean;
    }
  | {
      kind: "video";
      src: string;
      alt: string;
      poster?: string;
      label?: string;
      caption?: string;
      /** Taller frame for phone-shot / vertical subject matter. */
      portrait?: boolean;
    };

export interface EngineeringNote {
  kind: EngineeringNoteKind;
  text: string;
}

export interface MotivationContent {
  why: string;
  interest: string;
  learning: string;
}

export interface Subsystem {
  name: string;
  role: string;
}

export interface SystemOverviewContent {
  summary: string;
  subsystems: Subsystem[];
  dataFlow?: string;
  controlFlow?: string;
  diagram?: CaseStudyMedia;
}

export interface DisciplineBreakdown {
  id: string;
  discipline: string;
  goal: string;
  design: string;
  challenges: string[];
  iterations: string[];
  finalImplementation: string;
  /** One figure or a short stack of figures for the discipline. */
  media?: CaseStudyMedia | CaseStudyMedia[];
}

export interface DesignDecision {
  id: string;
  title: string;
  problem: string;
  alternatives: string[];
  tradeoffs: string;
  choice: string;
}

export interface EvolutionMilestone {
  id: string;
  phase: string;
  title: string;
  description: string;
  media?: CaseStudyMedia;
}

export interface ValidationResult {
  title: string;
  body: string;
  evidence?: string;
  /** When set, the evidence chip becomes a link (e.g. YouTube skit). */
  evidenceHref?: string;
}

export interface ResultsContent {
  items: ValidationResult[];
  /** Photos, clips, scope captures that prove the system works. */
  media?: CaseStudyMedia[];
  limitations: string[];
}

export interface ReflectionContent {
  surprises: string[];
  redesign: string[];
  future: string[];
  questions: string[];
}

/** Optional recruiter-facing assessment shown near the top of a case study. */
export interface ExecutiveAssessment {
  shipped: string;
  difficulty: string;
  next: string;
}

export interface TimelineEntry {
  period: string;
  work: string;
  friction: string;
  assessment?: string;
}

/** Optional heading copy for the timeline block (avoids project-specific hardcoding). */
export interface TimelineSectionCopy {
  title?: string;
  description?: string;
}

export interface RootCauseAnalysis {
  id: string;
  title: string;
  symptoms: string;
  rootCause: string;
  method: string;
  improvement: string;
  media?: CaseStudyMedia;
}

export interface ScheduleAnalysis {
  required: string[];
  preventable: string[];
  organizational: string[];
  note?: string;
}

export interface Version2Phase {
  name: string;
  hours?: string;
  body: string;
}

export interface Version2Upgrade {
  area: string;
  change: string;
  benefit: string;
}

export interface Version2Plan {
  target: string;
  phases: Version2Phase[];
  upgrades: Version2Upgrade[];
}

export interface TransferableSkill {
  context: string;
  evidence: string;
  phrasing: string;
}

/** Optional recruitment / design-challenge storytelling blocks. */
export interface DesignChallengeFlowStage {
  id: string;
  label: string;
}

export interface DesignChallengeArchitectureBlock {
  id: string;
  title: string;
  question: string;
  body: string;
}

export interface DesignSheetComparison {
  partA: string;
  partB: string;
  metrics: Array<{
    id: string;
    label: string;
    whyItMatters: string;
    /** Datasheet value; null renders as a TODO placeholder. */
    valueA: string | null;
    valueB: string | null;
  }>;
}

export interface DesignVerificationRow {
  requirement: string;
  mechanism: string;
  method: string;
  /** null → TODO placeholder */
  result: string | null;
}

export interface DesignIterationStep {
  id: string;
  title: string;
  body: string;
}

export interface DesignChallengeStageCard {
  id: string;
  title: string;
  what: string;
  why: string;
}

export interface DesignChallengeExtras {
  disclaimer: string;
  flowTitle?: string;
  flowStages?: DesignChallengeFlowStage[];
  architectureTitle?: string;
  architectureIntro?: string;
  architectureBlocks?: DesignChallengeArchitectureBlock[];
  schematicPlaceholder?: CaseStudyMedia;
  datasheetComparison?: DesignSheetComparison;
  emi?: {
    title?: string;
    conducted: string;
    radiated: string;
    context: string;
  };
  verificationIntro?: string;
  verificationMedia?: CaseStudyMedia[];
  verificationRows?: DesignVerificationRow[];
  iterationTitle?: string;
  iterationIntro?: string;
  iterationSteps?: DesignIterationStep[];
  /** Hyperloop-style stage cards */
  stageCards?: DesignChallengeStageCard[];
  frequencyVoltageNote?: {
    frequency: string;
    voltage: string;
    pwmVsFundamental: string;
  };
  engineeringConsiderations?: Array<{ id: string; title: string; body: string }>;
  showInverterSwitching?: boolean;
}

export interface EngineeringCaseStudy {
  slug: string;
  motivation: MotivationContent;
  systemOverview: SystemOverviewContent;
  disciplines: DisciplineBreakdown[];
  designDecisions: DesignDecision[];
  evolution: EvolutionMilestone[];
  results: ResultsContent;
  reflection: ReflectionContent;
  engineeringNotes: EngineeringNote[];
  /** Optional deeper retrospective blocks (used by Vend-A-Shoe). */
  executiveAssessment?: ExecutiveAssessment;
  timeline?: TimelineEntry[];
  /** Heading/description for the timeline section when `timeline` is present. */
  timelineCopy?: TimelineSectionCopy;
  rootCauseAnalyses?: RootCauseAnalysis[];
  scheduleAnalysis?: ScheduleAnalysis;
  version2Plan?: Version2Plan;
  transferableSkills?: TransferableSkill[];
  /** Optional recruitment-challenge visuals / tables (PER, Hyperloop, …). */
  designChallenge?: DesignChallengeExtras;
}

export const ENGINEERING_NOTE_LABELS: Record<EngineeringNoteKind, string> = {
  "engineering-note": "Engineering Note",
  "design-insight": "Design Insight",
  observation: "Observation",
};

/** Canonical dummy case study; template every future project page follows. */
export const DRIFT_CASE_STUDY: EngineeringCaseStudy = {
  slug: "drift-balancer",
  motivation: {
    why: "I kept seeing balancing robots treated as demos rather than control systems. I wanted a platform where every oscillation had a measurable cause (sensor noise, loop timing, mechanical compliance), and where fixing one subsystem didn't mask another.",
    interest:
      "The interesting part wasn't 'make it stand up.' It was the coupling: battery placement changes the inertia tensor, which changes the plant model, which changes which PID gains are even reachable before the motors saturate.",
    learning:
      "I wanted to learn complementary filtering on real IMU data, cascade control under tight timing, and how mechanical tolerances show up as control instability rather than as obvious mechanical failure.",
  },
  systemOverview: {
    summary:
      "Drift is a differential-drive inverted pendulum on two wheels. An IMU estimates pitch, a cascade PID commands wheel torque, and a custom power/sensing board keeps the loop deterministic. The chassis, electronics, and firmware were co-designed so that wiring length, CG, and sample rate were treated as first-class constraints.",
    subsystems: [
      {
        name: "Chassis & drivetrain",
        role: "Sets CG, wheelbase, and torsional stiffness. Everything else is bounded by this geometry.",
      },
      {
        name: "Power & sensing board",
        role: "Delivers motor current, conditions IMU signals, and exposes clean voltage rails for the MCU.",
      },
      {
        name: "State estimation",
        role: "Fuses accel + gyro into a pitch estimate fast enough for the inner rate loop.",
      },
      {
        name: "Cascade controller",
        role: "Inner rate loop + outer angle loop + outermost position trim. Runs at a fixed 200 Hz.",
      },
      {
        name: "Telemetry link",
        role: "Streams loop timing, estimates, and duty cycle so I can tune without guessing.",
      },
    ],
    dataFlow:
      "IMU → complementary filter → pitch/rate estimates → cascade PID → PWM → H-bridge → motors. Encoder ticks feed an outer position trim that slowly centers the robot on the start line.",
    controlFlow:
      "A hardware timer ISR samples sensors and runs the controller. The main loop only handles telemetry and parameter updates; never the balance loop itself.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/drift-architecture.svg",
      alt: "Drift system architecture diagram",
      label: "System architecture",
      caption: "Sensors → estimator → cascade PID → actuators, with telemetry off the critical path.",
    },
  },
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "A chassis stiff enough that flex doesn't look like sensor noise, with a CG low enough that recovery from ±15° is still within motor torque.",
      design:
        "Two 3D-printed side plates, a carbon cross-tube for battery mounting, and aluminum motor brackets. Wheel hubs are press-fit onto motor shafts with a flat keyed with epoxy as a backup. Battery sits between the wheels, slightly below axle height.",
      challenges: [
        "v1 side plates twisted under motor torque; the angle estimate looked fine while the frame was actually warping.",
        "Battery straps that 'felt secure' still shifted CG enough overnight to make yesterday's gains unstable.",
        "Printed wheel hubs cracked at the bore after a few hard recoveries.",
      ],
      iterations: [
        "v1: single-wall PLA plates; light, but torsional compliance polluted the plant.",
        "v2: thicker walls + cross-rib; better, still flexed at the motor mount.",
        "v3: aluminum motor brackets bolted through the plate, carbon tube as a structural spine.",
      ],
      finalImplementation:
        "PETG side plates with aluminum brackets, keyed hubs, and a captive battery cradle. Measured frame twist under stall torque dropped from ~0.8° to under 0.15° at the IMU mount.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-chassis.svg",
        alt: "Drift chassis cross-section",
        label: "Chassis v3",
        caption: "Battery below axle line; IMU hard-mounted on the carbon spine.",
      },
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Clean power under aggressive PWM, and an IMU path that doesn't share return current with the motors.",
      design:
        "A two-layer board with a discrete H-bridge per motor, a dedicated 3.3 V LDO for the IMU/MCU, and Kelvin-ish sensing for battery voltage. Motor returns star back to the pack connector; logic ground is a separate pour tied at one point.",
      challenges: [
        "Early breadboard builds brown-out reset whenever both motors hit a hard recovery.",
        "Shared ground between motors and IMU produced a pitch estimate that twitched with PWM duty.",
        "Hand-soldered H-bridge legs lifted pads after a few reworks.",
      ],
      iterations: [
        "Breadboard + module boards; proved the control idea, lied about noise and brown-outs.",
        "v1 PCB: functional layout, but motor return current still crossed the IMU.",
        "v2 PCB: star ground, thicker power traces, TVS across the pack, and a ferrite on the IMU rail.",
      ],
      finalImplementation:
        "v2 board with star grounding and a local bulk cap bank at the H-bridges. Under worst-case recovery, the 3.3 V rail dipped <80 mV instead of collapsing into brown-out.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-pcb.svg",
        alt: "Drift PCB revision diagram",
        label: "Power board v2",
        caption: "Motor returns and logic ground meet at a single star point near the pack connector.",
      },
    },
    {
      id: "embedded",
      discipline: "Embedded",
      goal: "A deterministic 200 Hz control loop that never shares a thread with logging or Bluetooth.",
      design:
        "STM32 timer interrupt samples the IMU over SPI, runs the filter + PID, and updates PWM. A free-running main loop drains a lock-free ring buffer for UART telemetry. Parameters are written from the host into a double-buffered config that swaps at loop boundaries.",
      challenges: [
        "SPI + floating-point PID in the same ISR initially overran the 5 ms budget by ~600 µs.",
        "Logging printf from the ISR made timing jitter look like controller instability.",
        "Updating gains mid-loop produced one-sample discontinuities that kicked the robot.",
      ],
      iterations: [
        "Arduino-style loop(); fine for bring-up, useless for measuring phase margin.",
        "ISR control + blocking UART; jitter returned as soon as telemetry was enabled.",
        "ISR control + ring-buffered telemetry + double-buffered params.",
      ],
      finalImplementation:
        "Fixed 200 Hz ISR with measured worst-case execution ~2.1 ms. Telemetry at 50 Hz never touches the control path. Gain updates apply on the next loop tick with no intermediate hybrid state.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-control-loop.svg",
        alt: "Drift control loop timing",
        label: "Loop timing",
        caption: "Control stays in the ISR; telemetry is strictly best-effort.",
      },
    },
    {
      id: "algorithms",
      discipline: "Algorithms",
      goal: "A pitch estimate and cascade controller that stay stable across battery voltage swing and mild floor tilt.",
      design:
        "Complementary filter (α ≈ 0.98 on gyro) for pitch. Cascade: inner rate PID → outer angle PID → slow position trim from wheel encoders. Anti-windup on every integrator. Duty cycle soft-limited before the H-bridge so saturation is visible in telemetry.",
      challenges: [
        "Accel-only tilt was unusable under acceleration; the robot 'saw' pitch whenever it drove.",
        "A single PID on angle fought the plant's rate dynamics and oscillated near ±8°.",
        "Position trim that was too aggressive walked the robot into a wall while 'balancing.'",
      ],
      iterations: [
        "Accel tilt + single PID; stood for seconds, then diverged.",
        "Complementary filter + single PID; better estimate, still oscillatory.",
        "Cascade + anti-windup + soft duty limits; recoverable from ±12–15° on carpet.",
      ],
      finalImplementation:
        "Cascade with rate P/D dominant, angle PI for bias rejection, and a position trim an order of magnitude slower. On a flat floor with a full pack, it holds ±1.2° RMS over a 60 s window.",
    },
  ],
  designDecisions: [
    {
      id: "loop-rate",
      title: "200 Hz fixed ISR vs. free-running loop",
      problem:
        "I needed reproducible tuning. A free-running loop made every gain change also a timing change, so I couldn't tell whether an improvement was the controller or accidental phase shift.",
      alternatives: [
        "Free-running main loop with micros()-based dt",
        "RTOS task at 'approximately' 200 Hz",
        "Hardware-timed ISR at a fixed period",
      ],
      tradeoffs:
        "An ISR constrains what you can do inside the loop and complicates debugging. A free-running loop is easier to write and nearly impossible to characterize. An RTOS adds overhead and another source of jitter I didn't need yet.",
      choice:
        "Hardware timer ISR. The cost was discipline: no prints, no allocations, no blocking SPI retries. The payoff was being able to treat the plant + controller as a system with a known sample period.",
    },
    {
      id: "filter",
      title: "Complementary filter vs. Kalman",
      problem:
        "Need a pitch estimate under motion. Accel alone is wrong under linear acceleration; gyro alone drifts.",
      alternatives: [
        "Accel low-pass only",
        "Complementary filter",
        "1D Kalman / Madgwick",
      ],
      tradeoffs:
        "Kalman would be more principled and more knobs. Complementary is one α, easy to reason about in telemetry, and plenty accurate for a stiff mechanical plant at 200 Hz. Accel-only was already ruled out by the first drive test.",
      choice:
        "Complementary filter. I can explain every term in the estimate, and when something looks wrong I know whether to blame α, gyro bias, or the mount; not a covariance matrix I hand-tuned once.",
    },
    {
      id: "battery",
      title: "Battery between the wheels, below axle height",
      problem:
        "Pack placement dominates inertia and CG. Too high and recovery torque saturates; too far forward and the trim loop fights a constant lean.",
      alternatives: [
        "Pack on top of the chassis (easy wiring)",
        "Pack behind the wheels (simpler print)",
        "Pack centered between wheels, low",
      ],
      tradeoffs:
        "Top mount simplified harness routing but raised CG enough that ±10° recoveries saturated the motors. Rear mount created a persistent pitch bias. Centered low made wiring ugly and forced a custom cradle.",
      choice:
        "Centered low, with the harness designed around the cradle instead of the other way around. Battery placement became a mechanical constraint that the electrical and control designs had to respect; not an afterthought.",
    },
    {
      id: "grounding",
      title: "Star ground on v2 after IMU noise on v1",
      problem:
        "Pitch estimate twitched in sync with PWM. The filter couldn't reject it because the noise was real voltage on the sensor reference.",
      alternatives: [
        "Heavier digital filtering on the estimate",
        "Slow the PWM / add dead-time",
        "Fix the return path so motor current doesn't modulate the IMU reference",
      ],
      tradeoffs:
        "Filtering would hide the symptom and add phase lag. Slowing PWM hurts torque response. Reworking the ground is more board spins, but it attacks the actual coupling.",
      choice:
        "Respin for star grounding. Once motor return current stopped sharing the IMU reference, the 'mysterious' 200 Hz twitch in the estimate disappeared; and I stopped chasing it in software.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Week 1–2",
      title: "Breadboard upright, barely",
      description:
        "Modules on a breadboard, PLA plates, single PID. Stood for a few seconds. Taught me that 'it balances' and 'I understand why it balances' are different statements.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-evolution-v1.svg",
        alt: "Drift prototype v1",
        label: "v1 bring-up",
        caption: "Proof of concept. Timing, noise, and stiffness were all lies.",
      },
    },
    {
      id: "e2",
      phase: "Week 3–5",
      title: "First PCB, still noisy",
      description:
        "Moved to a custom board and cascade control. Balance improved, but PWM-coupled IMU noise made tuning feel random until I looked at the raw estimate against duty cycle.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-pcb.svg",
        alt: "Drift PCB v1 layout",
        label: "PCB v1",
        caption: "Functional, but motor return current still crossed the sensor reference.",
      },
    },
    {
      id: "e3",
      phase: "Week 6–8",
      title: "Mechanical spine + star ground",
      description:
        "Carbon cross-tube, aluminum motor brackets, PCB v2. Frame twist and electrical coupling both dropped enough that gain sweeps became monotonic instead of mystical.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-chassis.svg",
        alt: "Drift chassis v3",
        label: "Chassis v3",
        caption: "Stiffness and CG finally matched the plant model I was tuning against.",
      },
    },
    {
      id: "e4",
      phase: "Week 9–10",
      title: "Telemetry-driven tuning",
      description:
        "50 Hz stream of pitch, rate, duty, and ISR overrun flags. Tuned on plots, not vibes. Held ±1.2° RMS on flat floor; documented where carpet and low battery still break it.",
      media: {
        kind: "image",
        src: "/projects/gallery/drift-control-loop.svg",
        alt: "Drift telemetry view",
        label: "Tuned system",
        caption: "Evidence over anecdotes; the plots decided the final gains.",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Hold performance",
        body: "On a flat hardwood floor with a full 3S pack, pitch stayed within ±1.2° RMS over a 60-second window after a manual upright.",
        evidence: "±1.2° RMS @ 60 s",
      },
      {
        title: "Disturbance recovery",
        body: "Hand pushes that induced ~12° lean recovered without wheel slip on hardwood. Beyond ~15°, motors saturated and the robot walked out of the recoverable region.",
        evidence: "Recoverable to ~12–15°",
      },
      {
        title: "Loop timing",
        body: "ISR worst-case execution measured at 2.1 ms against a 5 ms period. Zero overruns across a 10-minute soak with telemetry enabled.",
        evidence: "2.1 ms / 5 ms, 0 overruns",
      },
      {
        title: "Electrical integrity",
        body: "3.3 V rail dip under dual-motor recovery <80 mV on v2 vs. brown-out resets on the breadboard and occasional resets on PCB v1.",
        evidence: "<80 mV rail dip",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/gallery/drift-control-loop.svg",
        alt: "Telemetry capture during a 60s hold test",
        label: "Hold test telemetry",
        caption: "Pitch, rate, and duty cycle over a 60 s upright hold; the plot behind the ±1.2° RMS claim.",
      },
      {
        kind: "image",
        src: "/projects/gallery/drift-chassis.svg",
        alt: "Drift balancing upright",
        label: "Upright capture",
        caption: "Still frame from a recovery test. Swap this for a real photo or demo clip when migrating a live project.",
      },
      {
        kind: "image",
        src: "/projects/gallery/drift-pcb.svg",
        alt: "Scope capture of 3.3V rail during dual-motor recovery",
        label: "Rail integrity",
        caption: "Placeholder for a scope shot of the 3.3 V rail under recovery; evidence for the <80 mV dip.",
      },
    ],
    limitations: [
      "Carpet and soft mats change the effective plant enough that hardwood-tuned gains oscillate.",
      "No automatic gyro bias calibration at boot; a long powered-down period still needs a short still-bias sample.",
      "Position trim assumes a flat floor; a sustained slope makes the robot creep downhill while 'balanced.'",
      "This page uses placeholder diagrams; treat measurements as representative of the engineering process, not lab-certified data.",
    ],
  },
  reflection: {
    surprises: [
      "The complementary filter wasn't the hard part. Building a telemetry path that didn't poison the control loop was.",
      "I spent more calendar time on mechanical stiffness and grounding than on PID math. The math was waiting on an honest plant.",
      "A gain set that looked perfect at 4.0 V looked broken at 3.6 V. Voltage sag was a first-order controller change I underweighted early.",
    ],
    redesign: [
      "I'd design the battery cradle and star-ground connector as one mechanical-electrical assembly from day one.",
      "I'd put a current sense path on each motor early; duty cycle is a weak proxy when the pack sags.",
      "I'd budget a third PCB spin instead of pretending v2 would be final.",
    ],
    future: [
      "On-boot gyro bias calibration with a stillness detector.",
      "Gain scheduling against measured pack voltage.",
      "A simple floor-type classifier (or at least a soft-surface gain set) before calling it 'done.'",
    ],
    questions: [
      "How much of the remaining oscillation is tire compliance vs. estimator lag?",
      "Would a cheap optical flow sensor make position trim robust on slopes?",
      "At what point does a Kalman filter earn its complexity on this plant?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "The controller wasn't the hardest part. Building tools to observe the controller without disturbing it was.",
    },
    {
      kind: "design-insight",
      text: "Battery placement determined nearly every mechanical constraint; and quietly constrained the electrical layout too.",
    },
    {
      kind: "observation",
      text: "I initially optimized for simplicity. Later I realized debuggability mattered much more.",
    },
    {
      kind: "engineering-note",
      text: "When the estimate twitched in sync with PWM, no amount of filter tuning was going to help. The ground was wrong.",
    },
    {
      kind: "design-insight",
      text: "A free-running loop makes every gain change also a timing change. Fixed-rate sampling turned tuning into an experiment again.",
    },
    {
      kind: "observation",
      text: "Frame flex looked exactly like sensor noise until I instrumented the mount separately from the IMU.",
    },
    {
      kind: "engineering-note",
      text: "Anti-windup is not optional once motors can saturate. Without it, recovery from a hard lean becomes a delayed overcorrection.",
    },
    {
      kind: "observation",
      text: "Yesterday's perfect gains on a full pack are today's oscillation on a tired pack. Voltage is part of the plant.",
    },
  ],
};

export const LIGHTSABER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "saber",
  motivation: {
    why: "A friend said they made a lightsaber. I pictured a physical build; it was only CAD. That mismatch stuck. I wanted to become the kind of person who could build what I dreamed of, so I started here.",
    interest:
      "Not the prop fantasy; the gap after a circuit works on a breadboard. Packaging, impact loads, and analog sound in one handheld object felt like real freedom as an engineer.",
    learning:
      "Structural reliability under bending, discrete analog audio, and how manufacturing and cable length become the design once the schematic is done.",
  },
  systemOverview: {
    summary:
      "A 9V pack feeds a hilt switch, then splits. One branch lights an LED strip in the polycarbonate blade. The other is an analog audio chain: NE555 astable, RC timing, PN2222A driver, 8Ω speaker. Custom Fusion parts (hilt, emitter, battery carrier) are the load path and the harness envelope, not decoration.",
    subsystems: [
      {
        name: "Hilt structure",
        role: "Printed geometry that must take blade bending moments and still leave room for battery, switch, and boards.",
      },
      {
        name: "Power & switch",
        role: "9V primary with a single hilt switch as the master enable for light and sound.",
      },
      {
        name: "LED illumination",
        role: "Strip inside the blade; electrically simple, mechanically constrained by lead length and strain.",
      },
      {
        name: "Analog audio",
        role: "NE555 + RC network for ignition/hum character; transistor stage into the speaker.",
      },
      {
        name: "Manufactured boards",
        role: "Breadboard validation, then point-to-point perfboard with 40+ joints before packaging.",
      },
    ],
    dataFlow:
      "Battery to switch; parallel branches to LED strip and NE555; RC sets timing; PN2222A drives speaker current.",
    controlFlow:
      "No MCU in the loop. The switch is the control surface; frequency behavior is set by the RC network and the NE555, not firmware.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/lightsaber-architecture.svg",
      alt: "Lightsaber power and analog audio block diagram",
      label: "Power split",
      caption: "Battery and switch, then parallel LED and NE555 audio paths.",
    },
  },
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "A hilt that packages the electronics and survives repeated impact without losing alignment of the internals.",
      design:
        "Custom hilt, emitter, and battery holder in Fusion 360, printed around the real electrical envelope rather than around a pretty silhouette.",
      challenges: [
        "Two catastrophic hilt failures during lightsaber impacts. Early instinct blamed a weak print; the load case was the real issue.",
        "The polycarbonate blade is a long lever. Force at the tip concentrates bending moment at the printed hilt root.",
        "The schematic never failed under those hits; the packaging did. Stronger glue would have masked a bad load path.",
      ],
      iterations: [
        "Failure inspection on the fracture surfaces and how the blade loaded the hilt.",
        "CAD redesign with more structural reinforcement around the root and emitter interface.",
        "Print settings changed: higher infill and thicker walls where the bending moment peaked.",
      ],
      finalImplementation:
        "Redesigned assembly held through repeated impacts while keeping battery, boards, and switch aligned inside the hilt.",
      media: {
        kind: "video",
        src: "/projects/lightsaber/sabercadp1.mp4",
        alt: "Fusion 360 CAD modeling of lightsaber hilt components",
        label: "CAD design",
        caption: "Hilt and emitter geometry sized to electronics and to bending loads, not just fitment.",
      },
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Integrate a simple lighting circuit into a handheld package without creating a fragile service joint.",
      design:
        "9V through the hilt switch into the LED strip. Electrically short; the hard work was lead length, routing, and strain once the hilt closed.",
      challenges: [
        "After final assembly, one LED strip lead was too short to reach the switch. No spare strips on hand.",
        "Rebuilding the CAD around a longer lead would have burned a working packaging cycle. I modified the strip instead.",
        "Exposed copper pads inside the strip and soldered to them. Pads are tiny and not meant for repeated mechanical load; the first joint failed when the cable moved.",
      ],
      iterations: [
        "Pad exposure and first solder attempt under magnification-level care.",
        "Mechanical failure of the joint under cable pull.",
        "Strain relief and tape reinforcement until the joint survived repeated handling.",
      ],
      finalImplementation:
        "Salvaged strip stayed in the final build. Lighting works without a replacement part or a second enclosure spin.",
      media: {
        kind: "video",
        src: "/projects/lightsaber/sabersauder1.mp4",
        alt: "Soldering LED strip pads and power joints",
        label: "LED pad salvage",
        caption:
          "Pad-level solder and strain relief after the strip lead came up short in the closed hilt.",
      },
    },
    {
      id: "analog",
      discipline: "Analog Circuit Design",
      goal: "Ignition and continuous hum from discrete analog parts; no microcontroller audio path.",
      design:
        "NE555 as an astable oscillator. RC network sets the timing character. PN2222A amplifies into an 8Ω speaker.",
      challenges: [
        "Textbook RC math predicted a much longer frequency sweep than the hardware produced.",
        "Speaker response and NE555 nonidealities made the ear the better instrument than the first calculation.",
        "Component tolerances showed up as character change, not as a clean scale factor on the formula.",
      ],
      iterations: [
        "Breadboard RC sweeps against what the speaker actually rendered.",
        "Adjust timing network until ignition and hum read as intentional, not as a random square wave.",
        "Transfer the working network to perfboard without losing the tuned behavior.",
      ],
      finalImplementation:
        "Packaged analog chain runs inside the closed hilt and produces recognizable ignition and hum. Theory framed the design; measurement closed it.",
      media: [
        {
          kind: "video",
          src: "/projects/lightsaber/onlyanalogcircuit.mp4",
          alt: "Analog audio circuit running alone on a bench power supply",
          label: "Analog circuit alone",
          caption:
            "NE555 path on the supply by itself; sound character without the hilt in the loop.",
        },
        {
          kind: "image",
          src: "/projects/lightsaber/breadboardaudiocircuit.png",
          alt: "Breadboard analog audio circuit for the lightsaber",
          label: "Breadboard bring-up",
          caption: "RC network tuned against real speaker behavior before freezing the design.",
        },
      ],
    },
    {
      id: "manufacturing",
      discipline: "Manufacturing",
      goal: "Move from a floating prototype to a reworkable, soldered assembly that fits the printed envelope.",
      design:
        "Breadboard for validation, manual transfer to perfboard, then integrate into the printed housing. Point-to-point wiring; no custom PCB for this revision.",
      challenges: [
        "40+ through-hole joints; each one is a future failure site if the joint is cold or the lead has no strain path.",
        "Perfboard layout had to match hilt volume, not a generous bench footprint.",
        "Every packaging change threatened a previously good solder joint.",
      ],
      iterations: [
        "Breadboard proof of light and sound.",
        "Perfboard transfer with continuity checks before closing the hilt.",
        "Multiple packaging fits before the harness lengths stopped fighting the CAD.",
      ],
      finalImplementation:
        "Soldered audio and power distribution inside the printed assembly; joints that survive handling once the hilt closes.",
      media: {
        kind: "image",
        src: "/projects/lightsaber/perfboardaudiocircuit.png",
        alt: "Perfboard analog audio circuit for the lightsaber",
        label: "Perfboard permanence",
        caption:
          "Point-to-point assembly after breadboard validation; 40+ joints sized for the hilt envelope.",
      },
    },
    {
      id: "integration",
      discipline: "Product Engineering",
      goal: "One handheld object where structure, power, light, and sound share constraints without constant teardown.",
      design:
        "Co-design loop: CAD envelope, board size, cable lengths, and switch reach were negotiated together. Integration was the product.",
      challenges: [
        "A working breadboard lied about clearance and lead length.",
        "Mechanical redesigns after impact failure forced electrical re-routing.",
        "Salvaged LED joint had to stay reliable after the hilt was closed.",
      ],
      iterations: [
        "Separate bring-up of light and sound.",
        "First packaged assembly and impact failures.",
        "Structural redesign, LED salvage, final closed hilt.",
      ],
      finalImplementation:
        "Assembled lightsaber with illumination, analog sound, and a hilt that takes repeated hits after the redesign.",
      media: {
        kind: "video",
        src: "/projects/lightsaber/analogcircuit-in-saber.mp4",
        alt: "Analog audio circuit running inside the assembled lightsaber",
        label: "Circuit in the saber",
        caption:
          "Discrete analog board alive inside the packaged hilt; light and sound as one object.",
      },
    },
  ],
  designDecisions: [
    {
      id: "analog-audio",
      title: "Analog audio instead of microcontroller playback",
      problem: "Need ignition and hum without turning the project into a firmware demo.",
      alternatives: ["Arduino or MCU with sample playback", "NE555 + RC + transistor driver"],
      tradeoffs:
        "MCU audio is flexible and hides oscillator design. Discrete analog forces timing networks, drive current, and speaker limits into the open.",
      choice:
        "Analog path. The learning target was oscillator behavior and board-level audio, not WAV playback.",
    },
    {
      id: "custom-cad",
      title: "Custom CAD enclosure over a generic tube",
      problem: "Off-the-shelf hilts fight battery placement, switch reach, and board volume.",
      alternatives: ["Generic tube or kit hilt", "Custom Fusion hilt, emitter, battery carrier"],
      tradeoffs:
        "Generic is faster day one. Custom costs print cycles; it buys a load path and cable routes you can redesign after failure.",
      choice:
        "Custom CAD. Packaging and structural rigidity were design variables, not afterthoughts.",
    },
    {
      id: "redesign-vs-glue",
      title: "Redesign the housing instead of stronger adhesive",
      problem: "Hilt failed twice under impact at the blade root.",
      alternatives: ["More glue / clamp force", "Geometry and print-parameter redesign from the bending load case"],
      tradeoffs:
        "Adhesive can hold a bad interface for a demo. It does not fix a lever arm concentrating moment into weak plastic.",
      choice:
        "Treat it as failure analysis. Change geometry and infill where the moment peaks.",
    },
    {
      id: "perfboard",
      title: "Perfboard instead of jumping straight to a PCB",
      problem: "Need permanence past Duponts while the hilt envelope was still moving.",
      alternatives: ["Stay on breadboard", "Perfboard point-to-point", "Custom PCB"],
      tradeoffs:
        "Breadboard lies under motion. PCB is right when connectors freeze. Perfboard is temporary permanence.",
      choice:
        "Perfboard with 40+ joints. Enough reliability to package; flexible enough for one more mechanical spin.",
    },
    {
      id: "led-salvage",
      title: "Solder to LED strip pads instead of redesigning for a new strip",
      problem: "Lead too short after assembly; no replacement strip available.",
      alternatives: ["Wait for a new strip and reprint routing", "Expose strip pads and extend with solder + strain relief"],
      tradeoffs:
        "Replacement is cleaner electrically. Salvage is uglier and more delicate; it keeps the packaging cycle alive under a hard constraint.",
      choice:
        "Pad solder plus strain relief. Resourcefulness under part scarcity was the engineering move.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Concept",
      title: "Whiteboard and breadboard",
      description:
        "Circuit sketch and first power-on for light and sound before any hilt geometry was trusted.",
      media: {
        kind: "image",
        src: "/projects/lightsaber/saberwhite.png",
        alt: "Whiteboard planning for the lightsaber",
        label: "Whiteboard",
        caption: "Plan before the first print assumed the load case was kind.",
      },
    },
    {
      id: "e2",
      phase: "Analog",
      title: "Sound circuit on the bench",
      description:
        "NE555 path tuned on breadboard against what the speaker actually produced, not against the first RC estimate.",
      media: {
        kind: "image",
        src: "/projects/lightsaber/breadboardaudiocircuit.png",
        alt: "Breadboard audio bring-up",
        label: "Audio bring-up",
        caption: "Where theory and the ear disagreed.",
      },
    },
    {
      id: "e3",
      phase: "CAD v1",
      title: "First printed enclosure",
      description:
        "Initial hilt and emitter prints packaged the boards. Fit looked fine until impact testing started.",
      media: {
        kind: "video",
        src: "/projects/lightsaber/sabercadp1.mp4",
        alt: "CAD modeling of hilt parts",
        label: "CAD v1",
        caption: "Geometry before the bending-moment lesson.",
      },
    },
    {
      id: "e4",
      phase: "Failure",
      title: "Two hilt failures under impact",
      description:
        "Blade tip loads showed up as root fractures. That is when the lever-arm story replaced the weak-print story.",
    },
    {
      id: "e5",
      phase: "Structure",
      title: "CAD and print redesign",
      description:
        "Reinforced root geometry; infill and wall thickness raised where the moment peaked. Same electronics, different load path.",
    },
    {
      id: "e6",
      phase: "Permanence",
      title: "Perfboard and LED salvage",
      description:
        "Audio moved to perfboard. Short LED lead forced pad-level soldering and strain relief instead of a parts swap.",
      media: {
        kind: "image",
        src: "/projects/lightsaber/perfboardaudiocircuit.png",
        alt: "Perfboard audio circuit",
        label: "Perfboard",
        caption: "Joints meant to survive the closed hilt.",
      },
    },
    {
      id: "e7",
      phase: "Ship",
      title: "Final handheld assembly",
      description:
        "Closed unit with light, analog sound, and a hilt that takes hits after the redesign. Lab checkout closed the loop.",
      media: {
        kind: "video",
        src: "/projects/lightsaber/fullsaber-web.mp4",
        alt: "Final lightsaber demo",
        label: "Final demo",
        caption: "Integrated system on the redesigned structure.",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Impact durability after redesign",
        body: "Post-redesign hilt survived repeated blade impacts that had previously caused two catastrophic failures.",
        evidence: "Impact retest",
      },
      {
        title: "Illumination",
        body: "LED strip lights the blade from the packaged 9V path, including the salvaged pad joint.",
        evidence: "Functional light",
      },
      {
        title: "Analog sound",
        body: "Ignition and continuous hum from the NE555 chain on the handheld unit.",
        evidence: "Functional audio",
      },
      {
        title: "Integrated packaging",
        body: "Battery, switch, boards, and speaker inside custom printed parts; not a breadboard in a shell.",
        evidence: "Closed assembly",
      },
      {
        title: "Manufacturing volume",
        body: "40+ through-hole joints across the power and audio path; multiple CAD revisions driven by failure analysis.",
        evidence: "40+ joints; CAD revs",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/lightsaber/fullsaber-web.mp4",
        alt: "Working lightsaber demo",
        label: "Validation demo",
        caption: "Light and sound on the assembled unit after the structural redesign.",
      },
      {
        kind: "image",
        src: "/projects/lightsaber/saberwhite.png",
        alt: "Whiteboard circuit and hilt planning sketch",
        label: "Whiteboard plan",
        caption: "Early mechanical and electrical layout before print iterations.",
      },
      {
        kind: "video",
        src: "/projects/lightsaber/sabersecurity.mp4",
        alt: "Lightsaber blade carried through an airport",
        label: "Airport bit",
        caption:
          "Not evidence. Just me taking the blade through the airport; funny travel still, zero engineering substance.",
        portrait: true,
      },
    ],
    limitations: [
      "Analog character is fixed in hardware; no runtime tone profiles.",
      "Pad-soldered LED joint is robust enough for use; it is still a scar from a packaging miss.",
      "9V alkaline path is simple and heavy; battery optimization is a next revision, not this one.",
    ],
  },
  reflection: {
    surprises: [
      "The electrical schematic was the easy part. Mechanical packaging, structural loading, manufacturability, and integration decided whether the project worked.",
      "I underestimated bending loads until the hilt failed twice; the blade as a lever arm was obvious only after the fractures.",
      "Salvaging the LED strip under a hard parts constraint taught more about hardware debugging than a clean reorder would have.",
    ],
    redesign: [
      "Design cable reach and service loops before freezing CAD.",
      "Add intentional flex relief at every pad-level repair.",
      "Consider a small PCB once the hilt envelope stops moving.",
    ],
    future: [
      "Lighter power architecture without losing the analog sound path.",
      "Cleaner internal harness with keyed connectors for rework.",
      "Blade interface designed explicitly as a bending member from revision one.",
    ],
    questions: [
      "When does custom CAD stop being freedom and start being the only honest way to learn load paths?",
      "How do you budget packaging risk when the schematic looks finished?",
      "What should a first hardware project optimize for: features, or surviving contact with the real world?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Failure analysis drove the CAD revisions; stronger glue would have hidden the load path.",
    },
    {
      kind: "design-insight",
      text: "Packaging constraints created the hardest decisions, including the LED pad salvage.",
    },
    {
      kind: "observation",
      text: "Resourcefulness mattered as much as theory when the replacement strip did not exist.",
    },
    {
      kind: "engineering-note",
      text: "Validate RC predictions against the speaker and the NE555 you actually soldered.",
    },
    {
      kind: "design-insight",
      text: "A long blade is a bending member. Design the hilt root for moment, not just for fit.",
    },
    {
      kind: "observation",
      text: "Gateway project: the point was becoming someone who ships physical systems, not someone who stops at a schematic.",
    },
  ],
};

const CASE_STUDY_BY_SLUG: Record<string, EngineeringCaseStudy> = {
  [DRIFT_CASE_STUDY.slug]: DRIFT_CASE_STUDY,
  [VEND_A_SHOE_CASE_STUDY.slug]: VEND_A_SHOE_CASE_STUDY,
  [LIGHTSABER_CASE_STUDY.slug]: LIGHTSABER_CASE_STUDY,
  [C_COMPILER_CASE_STUDY.slug]: C_COMPILER_CASE_STUDY,
  [MINITORCH_CASE_STUDY.slug]: MINITORCH_CASE_STUDY,
  [BLOOMBOT_CASE_STUDY.slug]: BLOOMBOT_CASE_STUDY,
  [CIS5450_CASE_STUDY.slug]: CIS5450_CASE_STUDY,
  [ULTRASONIC_PCB_CASE_STUDY.slug]: ULTRASONIC_PCB_CASE_STUDY,
  [TENNIS_BALL_SHOOTER_CASE_STUDY.slug]: TENNIS_BALL_SHOOTER_CASE_STUDY,
  [AFTERTHOUGHT_CASE_STUDY.slug]: AFTERTHOUGHT_CASE_STUDY,
  [WEBSITE_CASE_STUDY.slug]: WEBSITE_CASE_STUDY,
  [PER_POWER_ELECTRONICS_CASE_STUDY.slug]: PER_POWER_ELECTRONICS_CASE_STUDY,
  [HYPERLOOP_VFD_CASE_STUDY.slug]: HYPERLOOP_VFD_CASE_STUDY,
  ...Object.fromEntries(PRODUCT_APP_CASE_STUDIES.map((cs) => [cs.slug, cs])),
};

export function getCaseStudyBySlug(
  slug: string
): EngineeringCaseStudy | undefined {
  return CASE_STUDY_BY_SLUG[slug];
}

export function getAllCaseStudySlugs(): string[] {
  return Object.keys(CASE_STUDY_BY_SLUG);
}
