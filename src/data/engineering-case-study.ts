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
import { PRODUCT_APP_CASE_STUDIES } from "@/data/case-studies/product-apps";

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

/** Vend-A-Shoe case study. Media lives in public/projects/vend-a-shoe/. */
export const VEND_A_SHOE_CASE_STUDY: EngineeringCaseStudy = {
  slug: "vend-a-shoe",
  motivation: {
    why: "I built this at BrainChild Engineering for a client who needed a unit that could leave the lab. A breadboard demo was never the finish line.",
    interest:
      "BloomBot got me comfortable with servos on Arduino. This one stacked packaging, a dense harness, power distribution for motors plus eight LEDs and a fan, and a Pi that had to stay alive on a wall adapter; that mix is what pulled me in.",
    learning:
      "I wanted sharper instincts for debugging across systems, not inside one tidy layer. Mechanical clearance, rail voltage, GPIO maps, and queue state fail together; the useful skill is deciding which system to trust first, then proving it with a supply and a meter instead of rewriting code on a guess.",
  },
  systemOverview: {
    summary:
      "A Next.js dashboard drops bin dispense commands into Supabase. A Raspberry Pi worker claims each row, drives MG996R servos off a soldered protoboard that also feeds eight LEDs and a cooling fan, then writes completed or failed. The harness was the product as much as the queue was; enclosure, power, and dozens of connections were in the loop from the start.",
    subsystems: [
      {
        name: "Enclosure & mounts",
        role: "Onshape assembly with printed mounts, wire covers, and a laser-cut rear panel you can actually open again.",
      },
      {
        name: "Power & protoboard",
        role: "Wall AC to DC conversion into a soldered protoboard with common ground; one outlet path feeds servos, eight LEDs, the fan, and the Pi.",
      },
      {
        name: "Harness",
        role: "Forty-plus wires for motors, LED runs, fan, and control; lengths and service loops were design constraints, not cleanup.",
      },
      {
        name: "Pi worker",
        role: "Python process claims pending commands, maps bin to GPIO, runs PWM sweeps, persists status.",
      },
      {
        name: "Command queue",
        role: "Supabase device_commands with pending to running to completed or failed; the Pi never needs a public port.",
      },
      {
        name: "Dashboard",
        role: "Existing frontend kept in place; the new backend had to meet its API shape and show queue state clearly.",
      },
    ],
    dataFlow:
      "UI insert; Supabase queue; Pi claim; GPIO and PWM; servos plus eight LEDs plus fan; status write-back.",
    controlFlow:
      "Only the worker owns actuation. The browser never talks to GPIO; claiming by status update keeps two polls from firing the same dispense.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/vend-a-shoe-architecture.svg",
      alt: "Vend-A-Shoe system architecture",
      label: "Control path",
      caption: "Dashboard to queue to Pi to protoboard to servos, LEDs, and fan.",
    },
  },
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "Fit the dispense mechanism, Pi, protoboard, fan, and a dense harness in a compact box that still opens for service.",
      design:
        "Custom Onshape enclosure; printed mounts and extenders; laser-cut rear panel. Clearances and harness paths for motors, eight LEDs, and the fan drove the layout more than the outer silhouette did.",
      challenges: [
        "Four servo positions plus LED runs and a fan left almost no slack once the harness existed.",
        "Eight LEDs needed unique lengths; four per side at different heights.",
        "Every early packing choice fought service access through a forty-plus-wire bundle.",
      ],
      iterations: [
        "CAD packing against real component envelopes, including fan clearance.",
        "Print, fit, remount cycles on brackets, covers, and extenders.",
        "Rear panel cut so cables and rework did not mean a full teardown.",
      ],
      finalImplementation:
        "Integrated mounts, organized routing, removable rear panel. It shipped as one assembly, not a pile of boards in a shell.",
      media: [
        {
          kind: "image",
          src: "/projects/vend-a-shoe/ENTIRECAD.jpg",
          alt: "Full Vend-A-Shoe CAD assembly",
          label: "Full enclosure CAD",
          caption: "Packaging built around servos, LEDs, fan, Pi, and harness; not a generic box.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/3dprintedextenders.jpg",
          alt: "3D-printed mechanical extenders",
          label: "Printed extenders",
          caption: "Printed parts that made the dispense geometry and mounts fit the real box.",
        },
      ],
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Take a normal AC wall outlet, convert it to usable DC, and power the protoboard, 4 MG996R servos, 8 LEDs, the fan, and the Raspberry Pi from that one path without brownouts or sketchy grounds.",
      design:
        "Bench supply for bring-up; multimeter checks on rails and grounds before trusting a channel. Then a wall AC to DC converter into a soldered protoboard with common ground so the whole unit can leave the bench. This was one of the clearest electrical lessons from the internship: wall power is not just plugging something in; it is conversion, distribution, and load budgeting. Actuator and accessory current stay off the Pi GPIO path; GPIO only signals.",
      challenges: [
        "We planned for four motors; a few were already fried from earlier high-voltage abuse and just sat dead. Sorting wiring versus software versus dead hardware became its own debug loop.",
        "Eight LEDs and a fan added continuous load on top of the servo harness; the wall converter and protoboard had to feed all of that plus the Pi.",
        "Shared Pi power sagged under multi-servo moves; breadboard contacts lied; forty-plus wires made routing a design problem, not a cleanup task.",
      ],
      iterations: [
        "Bench PSU for controlled bring-up; multimeter on voltage drop, continuity, and common ground before rewriting PWM code.",
        "Swap-test motors and channels; watch LED and fan rails while servos move.",
        "Soldered protoboard for permanence; wall AC to DC path so the packaged unit runs from a basic outlet.",
      ],
      finalImplementation:
        "One wall outlet path into DC distribution on the protoboard. That rail powers the motors, eight LEDs, the fan, and the Raspberry Pi in the shipped assembly.",
      media: [
        {
          kind: "image",
          src: "/projects/vend-a-shoe/wall-ac-dc.jpg",
          alt: "Wall AC to DC power converter for Vend-A-Shoe",
          label: "Wall AC to DC",
          caption:
            "AC wall outlet into DC for the protoboard. Same path feeds the motors, 8 LEDs, fan, and Pi; an internship lesson in conversion and distribution, not cloud hardware.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/solderedprotoboardfront.jpg",
          alt: "Soldered protoboard front",
          label: "Protoboard front",
          caption: "Soldered permanence after the breadboard stopped being trustworthy.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/solderedprotoboardback.jpg",
          alt: "Soldered protoboard back",
          label: "Protoboard back",
          caption: "Common-ground distribution for servos, LEDs, fan, and Pi power; GPIO stays signal-only.",
        },
      ],
    },
    {
      id: "embedded",
      discipline: "Embedded",
      goal: "Turn a queued cloud command into one clean dispense motion and a status you can trust.",
      design:
        "Raspberry Pi 4; Python worker; RPi.GPIO PWM. Parses dispense_bin_n, applies per-bin target duty, returns home. systemd keeps the worker up across reboot.",
      challenges: [
        "A silent motor looks identical to a bad pin map until you meter the rail, swap hardware, and prove which layer failed.",
        "One shared motion profile over-rotated Bin 3.",
        "Crashes mid-run left ambiguous state until running existed.",
      ],
      iterations: [
        "Standalone scripts on the bench; channel swap tests before blaming software.",
        "Polling worker with a single dispense action.",
        "Four-bin map, duty overrides, systemd unit.",
      ],
      finalImplementation:
        "Claim-by-status worker with bin to GPIO mapping and calibration hooks. The unit wakes into a working loop without a laptop attached.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/raspberrypimotormove.mp4",
        alt: "Raspberry Pi driving servo motion",
        label: "Pi motor bring-up",
        caption: "GPIO and PWM on the Pi once the channel and the motor were both known-good.",
      },
    },
    {
      id: "cloud",
      discipline: "Cloud & Integration",
      goal: "Remote dispense without exposing the Pi, while keeping the frontend that already existed.",
      design:
        "Supabase queue as the boundary. New backend bent to the existing Next.js UI instead of rewriting the client.",
      challenges: [
        "API shape had to match an independently built frontend.",
        "Polling delay versus double-fire under concurrent claims.",
        "Cross-stack failures only showed up end to end.",
      ],
      iterations: [
        "Local-only GPIO scripts.",
        "Cloud-connected single action.",
        "Multi-bin queue plus UI status badges.",
      ],
      finalImplementation:
        "Browser click to durable row to physical dispense; completed and failed show up where you already look. The cloud path is software and queueing; wall AC to DC power lives in the electrical section.",
    },
  ],
  designDecisions: [
    {
      id: "controller",
      title: "Raspberry Pi 4 over Arduino / ESP32",
      problem: "Need networking, a real OS, Python worker logic, and GPIO on one board.",
      alternatives: ["Arduino plus a separate network module", "ESP32", "Raspberry Pi 4"],
      tradeoffs:
        "MCU boards win on cost and boot time. Pi wins when the control path is a long-lived worker talking to Postgres.",
      choice:
        "Pi 4. One platform for queue client, GPIO, and systemd; fewer failure domains during client demos.",
    },
    {
      id: "power",
      title: "Wall AC to DC into a shared protoboard rail",
      problem:
        "MG996Rs, eight LEDs, a fan, and the Pi need honest DC from a client-site wall outlet; a Pi USB cable cannot carry that load.",
      alternatives: [
        "Power everything from the Pi",
        "Separate supplies without a shared ground",
        "Wall AC to DC into a common-ground protoboard",
      ],
      tradeoffs:
        "Pi-powered looks tidy until the first multi-servo move plus LED and fan load. Split grounds make GPIO references nasty. Wall conversion adds a part; it is what makes the unit shippable.",
      choice:
        "Wall AC to DC feeding the protoboard, motors, LEDs, fan, and Pi together. Bench PSU and multimeter first; outlet path second. Internship takeaway: conversion and distribution are the product, not an afterthought.",
    },
    {
      id: "assembly",
      title: "Soldered protoboard instead of breadboard or PCB",
      problem: "Need reliability past Duponts without freezing a PCB while mounts were still moving.",
      alternatives: ["Breadboard", "Soldered protoboard", "Custom KiCad PCB"],
      tradeoffs:
        "Breadboard is fast and lies. PCB is right and slow when connectors still drift daily.",
      choice:
        "Protoboard as temporary permanence. Next revision should be a PCB once connector positions stop moving.",
    },
    {
      id: "enclosure",
      title: "Custom enclosure over a generic box",
      problem: "Off-the-shelf cases fight servo geometry and harness exits.",
      alternatives: ["Generic project box", "Custom Onshape enclosure plus printed mounts"],
      tradeoffs:
        "Generic is faster day one. Custom costs CAD time; it buys serviceability.",
      choice:
        "Custom box, printed mounts, laser-cut rear panel. Packaging was a design constraint, not a shell.",
    },
    {
      id: "frontend",
      title: "Adapt backend to existing frontend",
      problem: "UI already existed; backend and hardware were new.",
      alternatives: ["Rewrite the frontend", "Shape the backend to the existing app"],
      tradeoffs:
        "Rewrite cleans the API. Adaptation keeps working UX and forces the interface to stay honest.",
      choice:
        "Keep the frontend. Integration bugs beat a second UI rewrite on an internship clock.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Bring-up",
      title: "Breadboard, four motors, and a bad assumption",
      description:
        "We started with four motors on a floating harness. A few would not move at all; the unanticipated part was that they had already been cooked by high-voltage abuse elsewhere. Wiring, software, and dead hardware all produce the same quiet servo. Proving which one it was became a microcosm of debugging across systems later.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/breadboardfirstmodel.mp4",
        alt: "First breadboard Vend-A-Shoe model",
        label: "First breadboard model",
        caption: "Early motion tests before anyone trusted the harness.",
      },
    },
    {
      id: "e2",
      phase: "Bench chaos",
      title: "Fan, LEDs, supply, and meter",
      description:
        "Eight LEDs and a cooling fan joined the servo load while the harness grew past forty wires. Bench power supply and multimeter work made sagging rails and bad grounds visible; without that, every flake looked like a software bug.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fanandbreadboard.mp4",
        alt: "Breadboard bring-up with cooling fan",
        label: "Bench bring-up",
        caption: "Fan in the loop; meter on the rail before rewriting code.",
      },
    },
    {
      id: "e3",
      phase: "First demo",
      title: "Initial dispense path",
      description:
        "Got a short end-to-end clip once a known-good motor and a known-good channel finally lined up. That was the bar the rest of the build had to clear again after packaging.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/initialdemo.mp4",
        alt: "Initial Vend-A-Shoe dispense demo",
        label: "Initial demo",
        caption: "First credible dispense before permanence and packaging.",
      },
    },
    {
      id: "e4",
      phase: "Permanence",
      title: "Soldered protoboard and screw terminals",
      description:
        "Moved signal and power for servos, LEDs, and fan onto soldered joints and Pi screw terminals so the harness survived transport and demos.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/soldering.mp4",
        alt: "Soldering the protoboard",
        label: "Protoboard build",
        caption: "Breadboard habits do not survive a dense harness and a client handoff.",
      },
    },
    {
      id: "e5",
      phase: "Packaging",
      title: "CAD enclosure and printed mounts",
      description:
        "Enclosure revisions tracked real clearances once harness lengths for motors, eight LEDs, and the fan were known; mounts, covers, rear panel.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/CAD.mp4",
        alt: "CAD enclosure walkthrough",
        label: "CAD iteration",
        caption: "Mounts designed around the harness, not the other way around.",
      },
    },
    {
      id: "e6",
      phase: "Integration",
      title: "Longer initial system run",
      description:
        "A longer clip of the early assembled path; useful for catching harness snags and motion that only shows up after a few cycles.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fullvideoinitialdemo.mp4",
        alt: "Longer initial Vend-A-Shoe demo",
        label: "Extended initial demo",
        caption: "More cycles; more chances for a weak joint to confess.",
      },
    },
    {
      id: "e7",
      phase: "Ship",
      title: "Wall power and end-to-end dispense",
      description:
        "Wall AC to DC cut the bench supply after the meter said the rails were honest. Multi-bin calibration and UI status closed the loop for delivery.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/seconddemo.mp4",
        alt: "Vend-A-Shoe dispense demo",
        label: "Dispense demo",
        caption: "Queued command to physical dispense on the assembled unit.",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Client delivery",
        body: "Assembled unit left as a working product; enclosure, dense harness, power, and cloud-triggered dispense included.",
        evidence: "Shipped",
      },
      {
        title: "Multi-bin actuation",
        body: "Each bin maps to its own GPIO path and motion profile; Bin 3 uses a reduced target duty after over-travel showed up in testing. Dead motors got swap-tested out before we trusted the map.",
        evidence: "Calibrated lanes",
      },
      {
        title: "Wall-powered stability",
        body: "Wall AC to DC into a common-ground protoboard carried servos, eight LEDs, the fan, and the Pi without brownouts after bench PSU and multimeter bring-up.",
        evidence: "Wall AC to DC",
      },
      {
        title: "Remote command path",
        body: "Dashboard enqueue; worker claim; status write-back. The Pi stays off the public internet.",
        evidence: "Queue loop",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/vend-a-shoe/entireworkingmodel.mp4",
        alt: "Fully working Vend-A-Shoe model",
        label: "Working model",
        caption: "Assembled system running the full dispense path.",
      },
      {
        kind: "video",
        src: "/projects/vend-a-shoe/seconddemo.mp4",
        alt: "Dispense demonstration",
        label: "Validation demo",
        caption: "End-to-end dispense on the packaged unit.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/demo1.jpg",
        alt: "Assembled Vend-A-Shoe",
        label: "Assembled unit",
        caption: "Final mechanical and electrical packaging.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/coverCAD.jpg",
        alt: "Enclosure CAD cover view",
        label: "Enclosure cover",
        caption: "CAD that matches what shipped.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/stage1.jpg",
        alt: "Early Vend-A-Shoe assembly stage",
        label: "Stage 1 assembly",
        caption: "Mid-build packaging before the harness settled.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/motivation1.jpg",
        alt: "Early Vend-A-Shoe bring-up still",
        label: "Early still",
        caption: "Bench state before permanence.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/raspberrypi.jpg",
        alt: "Raspberry Pi in the assembly",
        label: "Pi in place",
        caption: "Screw-terminal harness into the Pi; reworkable, not a Dupont nest.",
      },
    ],
    limitations: [
      "No sensor confirmation of a successful drop; motion complete is not the same as item dispensed.",
      "Protoboard wiring will not scale cleanly past this unit count.",
      "Queue auth is still MVP-grade for a public multi-user deployment.",
    ],
  },
  reflection: {
    surprises: [
      "The biggest lesson was how to debug across numerous systems at once. Mechanical, electrical, embedded, and cloud failures share symptoms; the work is picking a layer, measuring it, and only then moving.",
      "Some of the four motors were already fried from high-voltage abuse; the quiet failure looked like bad wiring or bad code until a swap test and a meter reading forced the assumption to break.",
      "Eight LEDs, a fan, and forty-plus wires ate more calendar than the PWM math; harness planning was the real schedule risk.",
      "Bench power supply and multimeter work caught sag and ground issues that software logs never would have named correctly.",
      "Breadboard success did not transfer; permanence changed the failure modes.",
    ],
    redesign: [
      "KiCad PCB with keyed servo, LED, and fan connectors plus onboard regulation.",
      "Closed-loop dispense sensing with an optical or limit switch.",
      "Standardized connectors so a failed servo is a module swap, not a re-solder.",
      "Incoming actuator burn-in so dead hardware does not masquerade as a software bug.",
    ],
    future: [
      "Injection-aware enclosure consolidation.",
      "OTA updates and basic device health.",
      "DFM pass once the connector map freezes.",
    ],
    questions: [
      "When does protoboard stop being honesty and start being technical debt?",
      "How should power topology change when every unit also carries LEDs, fans, and dozens of harness branches?",
      "What does maintainability look like when the first owner is not the builder?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Debugging across systems beats debugging inside one. Pick a layer, measure it, then move.",
    },
    {
      kind: "engineering-note",
      text: "A quiet servo is not a diagnosis. Wiring, software, and fried hardware all look the same until you challenge the assumption.",
    },
    {
      kind: "observation",
      text: "Bench PSU and multimeter first; rewrite the worker second.",
    },
    {
      kind: "engineering-note",
      text: "Eight LEDs, a fan, and forty-plus wires turn packaging into an electrical problem.",
    },
    {
      kind: "design-insight",
      text: "Enclosure design started from harness and service access, not from outer dimensions.",
    },
    {
      kind: "observation",
      text: "Bench power hid problems that only appeared once the unit had to run from a wall AC to DC path.",
    },
    {
      kind: "design-insight",
      text: "Wall AC to DC is conversion and load budgeting; it is what lets the protoboard, motors, LEDs, fan, and Pi share one outlet.",
    },
    {
      kind: "design-insight",
      text: "Protoboard was the right bridge between Duponts and a PCB; it was not the destination.",
    },
    {
      kind: "observation",
      text: "Integrating a new backend into an existing frontend forced the API to stay honest.",
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
