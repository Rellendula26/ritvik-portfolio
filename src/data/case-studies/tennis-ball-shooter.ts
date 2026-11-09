import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Automatic Tennis Ball Shooter — BrainChild Engineering client prototype.
 * Media: public/projects/tennis-ball-shooter/
 * Each asset is used once on the page; captions name what the photo/clip actually shows.
 */
export const TENNIS_BALL_SHOOTER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "tennis-ball-shooter",
  motivation: {
    why: "This was a client build at BrainChild Engineering. The brief was an automatic tennis ball launcher the team could demo from a phone, not a one-off bench trick that only worked with USB power and babysitting.",
    interest:
      "The interesting part was not “make a ball fly.” It was getting wireless control, motor sequencing, a fused 12 V actuator rail, a bucked 5 V logic rail, and a mechanical feed to behave like one machine under client demo pressure.",
    learning:
      "Coursework had given me programming and basic electronics separately. This was practice when voltage domains, print strength, PWM switching, and app timing fail with the same external symptom until you isolate a layer.",
  },
  systemOverview: {
    summary:
      "A Replit web app talks to an ESP32. Firmware turns those commands into motor sequencing through breadboard interface circuitry: MOSFET modules that PWM-switch the flywheel motors, an A4988-class stepper driver for the feed, a fused 12 V battery rail for the loads, and a buck converter that steps that rail down to 5 V for the ESP32. Two RS-775 DC motors spin printed flywheels; a NEMA 17 stepper indexes balls into the launch path.",
    subsystems: [
      {
        name: "Web / wireless control",
        role: "Replit control UI sends commands; ESP32 owns sequencing / timing in firmware.",
      },
      {
        name: "Power architecture",
        role: "12 V battery → fuse → splitters → MOSFET VIN + stepper VMOT; buck → 5 V for ESP32 / A4988 logic. Fuse is there to open the pack path if current goes wrong.",
      },
      {
        name: "MOSFET PWM drive",
        role: "MCU PWM into the MOSFET gates. Duty cycle changes the voltage waveform. Flywheel speed also depends on the motor and the load.",
      },
      {
        name: "Ball feed",
        role: "NEMA 17 stepper-driven indexing on a printed coupler / mount that had to survive torque.",
      },
      {
        name: "Launcher drive",
        role: "Dual RS-775 DC motors on printed flywheels. PWM duty changes the applied waveform. Release speed also depends on the load.",
      },
      {
        name: "Chassis & mounts",
        role: "Panel enclosure with printed brackets so actuators can move during iteration.",
      },
    ],
    dataFlow:
      "Replit UI → ESP32 → GPIO / PWM / STEP·DIR → MOSFET modules + A4988 → RS-775s + NEMA 17 → feed + launch.",
    controlFlow:
      "Firmware owns motor timing and release behavior. The app sends commands; it does not drive actuators directly. Logic never shares the raw 12 V rail. The fuse sits on the pack path as the last hard stop if current spikes.",
    diagram: {
      kind: "image",
      src: "/projects/tennis-ball-shooter/connection-diagram.jpg",
      alt: "Power and signal wiring diagram with 12V battery, fuse, MOSFETs, and buck to 5V",
      label: "Power architecture",
      caption:
        "3S battery through a fuse and splitters to MOSFET VIN and stepper VMOT. Buck IN+ takes the same high rail and makes 5 V for ESP32 VIN and A4988 VDD. The fuse is meant to open the pack connection if current runs away.",
    },
  },
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "Hold two flywheel motors and a stepper feed in a layout that could change without reprinting the whole machine, and keep printed interfaces stiff enough under real torque.",
      design:
        "Panel chassis with printed corner braces and motor mounts. Two RS-775s on L-brackets; NEMA 17 on a center printed stack for indexing. Early coupler / mount prints were too flimsy under stepper load.",
      challenges: [
        "The first 3D-printed part on the stepper was under-infilled and poorly fastened. It flexed and would not hold under torque.",
        "Clearances only became real once both RS-775s and the stepper occupied the same volume.",
      ],
      iterations: [
        "Low-infill coupler / mount that looked fine on the bench and failed under load.",
        "Reprint in Bambu Studio (PETG, Strength tab) with higher infill density so the part was heavier and stiffer.",
        "Re-fastened the stepper interface once the printed geometry could take the load path.",
      ],
      finalImplementation:
        "A modular mechanical stack good enough for prototype integration once the stepper print stopped being the weak link.",
      media: [
        {
          kind: "video",
          src: "/projects/tennis-ball-shooter/flimsy-stepper-part.mp4",
          alt: "Flimsy 3D-printed stepper interface under load",
          label: "Print failure",
          caption:
            "First printed interface on the stepper: too flimsy and not fastened well enough. Flex under torque made the feed look like a firmware bug until we blamed the plastic.",
        },
        {
          kind: "image",
          src: "/projects/tennis-ball-shooter/printed-part-reprint.jpg",
          alt: "Bambu Studio Strength settings for reprinting the stepper mount",
          label: "Higher-infill reprint",
          caption:
            "Bambu Lab P1P / PETG prepare view with the Strength tab open. Reprinted the U-bracket / mount denser so it could take stepper torque without folding.",
        },
      ],
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Run high-current flywheels and a stepper off a 12 V pack without killing a 5 V ESP32, switch motors efficiently with PWM, and keep a fuse in the pack path for overcurrent.",
      design:
        "Fused 12 V battery rail for MOSFET modules and stepper VMOT. A buck steps that rail to about 5 V for the ESP32 board's VIN and the driver logic. The ESP32 chip runs at 3.3 V from the board regulator. The ESP32 drives the MOSFET gates with PWM, so each device switches between on and off. Duty cycle changes the voltage waveform. Motor inductance and inertia smooth the pulses, and the resulting speed still depends on the motor and the load.",
      challenges: [
        "Early bring-up had no buck. The pack was 12 V. Without the step-down, the ESP32 board would not run from the battery.",
        "During MOSFET PWM testing a flywheel ran much faster than commanded. The fuse did not open. I did not measure the current, so I am not treating high speed as proof of overcurrent.",
        "Solder joints on the buck and battery path were detached afterward, and a wire's insulation melted. An open joint interrupts that path. I have not established whether the heating came from a resistive joint, a short, arcing, or something else.",
      ],
      iterations: [
        "Battery toward the logic side without regulation: dead end.",
        "Added a buck module so ESP32 VIN and A4988 VDD sat on a real 5 V rail, with a fuse on the pack feed.",
        "MOSFET PWM modules for the flywheels. After the fast spin, detached joints, and melted insulation, I still don't have a current measurement or a confirmed sequence.",
      ],
      finalImplementation:
        "Prototype interface: fused 12 V rail for actuators, about 5 V for the ESP32 board, MOSFET PWM for flywheels, A4988 for the NEMA 17. The damaged harness was not retested against a known fault.",
      media: [
        {
          kind: "image",
          src: "/projects/tennis-ball-shooter/buck-converter.jpg",
          alt: "Buck converter module held above ESP32 breadboard",
          label: "12 V → 5 V buck",
          caption:
            "Buck board labeled IN-/OUT-/IN+/OUT+/5V above the ESP32 breadboard and red A4988. Logic lives here; motors stay on the fused high rail.",
        },
        {
          kind: "video",
          src: "/projects/tennis-ball-shooter/mosfet-switch-module.mp4",
          alt: "MOSFET switch module with PWM gate wiring",
          label: "MOSFET PWM switch",
          caption:
            "Blue dual-MOSFET module: MCU PWM into the gate / SIG path, screw terminals on the motor rail. Hard on/off switching at PWM rate, not a linear 6 V drop across the FET.",
        },
      ],
    },
    {
      id: "embedded",
      discipline: "Embedded",
      goal: "Coordinate web-app commands, stepper indexing pulses, and flywheel PWM on one controller the client could demo.",
      design:
        "Started on an Elegoo Mega 2560 with Bluetooth-side phone control. Migrated to ESP32 so wireless and motor timing lived on one board. A Replit web UI (feed pace, rest interval, emergency stop, live rail readout) sends commands; firmware owns STEP/DIR to the A4988 and PWM into the MOSFET TRIG pins.",
      challenges: [
        "Arduino + Bluetooth was fine in controlled tests and unreliable for consistent app-level control.",
        "Multi-motor timing only makes sense once the power path and mounts are stable enough to trust.",
        "App / firmware / hardware faults presented as the same “it doesn’t shoot” until we isolated a layer.",
      ],
      iterations: [
        "Mega 2560 + Bluetooth path for phone control.",
        "Migration to ESP32 for integrated wireless.",
        "Replit control UI: START FEED, pace presets, rest between shots, emergency stop, live voltage.",
      ],
      finalImplementation:
        "ESP32 as the control brain: web commands in, sequenced STEP/DIR + PWM out through the interface circuitry.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/app-interface.mp4",
        alt: "Replit TENNIS control UI on a laptop",
        label: "Replit control UI",
        caption:
          "Web app on Replit: LIVE rail readout, REST BETWEEN, FAST/MED/SLOW pace, START FEED, and emergency stop. This is the client-facing command surface into the ESP32.",
      },
    },
  ],
  designDecisions: [
    {
      id: "controller",
      title: "ESP32 over Arduino Bluetooth",
      problem: "Phone / web control needed to stay reliable for a client demo while the machine was still changing.",
      alternatives: ["Arduino Mega + Bluetooth module", "ESP32 with integrated wireless"],
      tradeoffs:
        "The Mega path was familiar and already partly wired. ESP32 meant a redesign, but the communication path stopped being the main failure mode.",
      choice:
        "Migrate to ESP32. Changing the architecture beat endlessly patching an unsuitable link.",
    },
    {
      id: "pwm-mosfet",
      title: "PWM-switched MOSFETs instead of linear drive",
      problem: "Flywheel speed had to be a firmware parameter without cooking the switch.",
      alternatives: [
        "Pot speed controllers",
        "Hold the MOSFET “halfway on” like a resistor",
        "Hard-switch with PWM duty cycle",
      ],
      tradeoffs:
        "A MOSFET held between on and off dissipates voltage times current as heat. PWM keeps each switch near fully on or fully off. Duty cycle changes the waveform. Speed still depends on the motor and the load.",
      choice:
        "ESP32 PWM into MOSFET gates on the 12 V motor path. The motor's inductance and inertia smooth the pulses.",
    },
    {
      id: "fuse",
      title: "Series fuse on the 12 V pack rail",
      problem: "A short or runaway motor current needs a hard interrupt, not hope.",
      alternatives: ["No protection", "Software current limit only", "Inline fuse on the battery feed"],
      tradeoffs:
        "A fuse opens on current and time, not on motor speed. This one did not open during the fast spin. That does not by itself prove the current was under the rating, or that it was over it.",
      choice:
        "The fuse stays in the pack path. I have not verified a rating or a placement that would have opened before the insulation melted.",
    },
    {
      id: "buck",
      title: "Buck converter between 12 V pack and ESP32",
      problem: "The pack is about 12 V. The ESP32 board expects about 5 V on VIN. The chip runs at 3.3 V.",
      alternatives: ["Feed the MCU somehow off the pack without regulation", "Step down with a buck module"],
      tradeoffs:
        "Skipping the buck looks simpler until nothing boots. A buck adds one more module and wiring, but it is the difference between a demo and a dead board.",
      choice:
        "Fused 12 V for motors; bucked 5 V for ESP32 and driver logic.",
    },
    {
      id: "print-strength",
      title: "Higher-infill reprint for the stepper interface",
      problem: "The printed part on the stepper flexed and would not stay fastened under torque.",
      alternatives: ["Glue / tape the weak print", "Reprint denser and re-fasten"],
      tradeoffs:
        "A denser print is heavier and slower. A light print is fast until the feed path is a joke.",
      choice:
        "Reprint with higher infill density and treat fastening as part of the mechanical design.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Electronics",
      title: "Mega, pot controllers, and a stepper driver",
      description:
        "First bench stack: Elegoo Mega 2560 for logic, two heatsinked DC speed controllers for the flywheels, and a red A4988-class driver for the feed. Flywheel RPM was still a manual pot.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/initial-circuit.jpg",
        alt: "Elegoo Mega 2560 with two DC speed controllers and a red stepper driver",
        label: "V0 electrical stack",
        caption:
          "Blue Mega 2560 at left. Two black pot-and-heatsink DC speed controllers for the RS-775 rails. Red stepper driver on the mini breadboard. Wagos as the power split.",
        portrait: true,
      },
    },
    {
      id: "e2",
      phase: "Power",
      title: "Buck, fuse, and a real 5 V logic rail",
      description:
        "Battery bring-up failed without regulation. The architecture became: pack → fuse → high-current splits for MOSFETs / VMOT, and a buck branch for ESP32 + driver logic.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/circuit-v2.jpg",
        alt: "ESP32 breadboard with fused DC rail and Wago power distribution",
        label: "Control + power hub",
        caption:
          "ESP32 on the breadboard after the power architecture settled: fused high-current bus, Wagos, jumpers out to MOSFET PWM and the stepper driver.",
        portrait: true,
      },
    },
    {
      id: "e3",
      phase: "Failure",
      title: "Fast spin, intact fuse, melted insulation",
      description:
        "While testing MOSFET PWM, a flywheel ran much faster than commanded. The fuse did not open. Afterward, solder joints on the buck and battery path were detached and a wire's insulation had melted. I did not measure current, and I have not established the order. An open joint interrupts current on that path. The melted insulation still needs a measured cause.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/post-motor-overspeed.mp4",
        alt: "Bench aftermath after motor overspeed event",
        label: "After overspeed",
        caption:
          "Post-overspeed bench: MOSFET module, buck, and harness after the motor ran away and the pack-side joints failed.",
      },
    },
    {
      id: "e4",
      phase: "Mechanics",
      title: "Stepper print that could take torque",
      description:
        "Feed bring-up looked like a firmware bug until the printed interface was the real failure. Higher-infill reprint plus better fastening fixed the mechanical half of “it won’t index.”",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/stepper-driver-motor.mp4",
        alt: "Stepper driver and motor integration test",
        label: "Stepper + driver",
        caption:
          "A4988 / stepper path under test once the printed mount was stiff enough to trust the motion.",
      },
    },
    {
      id: "e5",
      phase: "Client demo",
      title: "App-controlled launcher on the bench",
      description:
        "BrainChild demo path: Replit UI → ESP32 sequencing → feed + flywheels. Still a prototype enclosure and breadboard interface, but the multidisciplinary loop closed.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/demo-with-app.mp4",
        alt: "Tennis ball shooter demo controlled from a mobile app",
        label: "App demo",
        caption:
          "End-to-end client demo clip: control UI into the ESP32 launcher stack.",
        portrait: true,
      },
    },
  ],
  results: {
    items: [
      {
        title: "Client-demoable wireless path",
        body: "ESP32 could take Replit UI commands and turn them into sequenced STEP/DIR and flywheel PWM for a BrainChild demo.",
        evidence: "App demo",
      },
      {
        title: "Honest 12 V / 5 V split",
        body: "Buck converter kept the ESP32 on 5 V while MOSFET and stepper loads stayed on the fused battery rail.",
        evidence: "Buck + fuse rail",
      },
      {
        title: "PWM flywheel drive",
        body: "MOSFET modules hard-switch the pack rail under MCU PWM so speed is duty cycle, not a linear drop across the FET.",
        evidence: "MOSFET PWM",
      },
      {
        title: "Harness damage, cause not isolated",
        body: "Observed: a flywheel much faster than commanded, a fuse that did not open, detached pack-side joints, and melted insulation. Not measured: current. Not established: the sequence, or that high speed meant overcurrent.",
        evidence: "Burned wire",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/burned-wire.jpg",
        alt: "Melted and charred yellow wire after overspeed event",
        label: "Melted wire",
        caption:
          "Yellow conductor after the PWM test. The insulation melted. The photo does not show the current or the order of the failures.",
      },
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/chassis.jpg",
        alt: "Open chassis with dual RS-775 flywheels and NEMA 17 stepper",
        label: "Actuator layout",
        caption:
          "RS-775s on L-brackets with printed flywheel; NEMA 17 on the center feed stack inside the panel chassis.",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
        alt: "Chassis harnessed to ESP32 bench",
        label: "System on the bench",
        caption:
          "Mechanical enclosure wired across to the ESP32 breadboard and fused battery path.",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/challenges-bench.jpg",
        alt: "Bench layout during tennis ball shooter debugging",
        label: "Debug bench",
        caption:
          "Bring-up mess that held the real lessons: power domains, prints, PWM, and joints before polish.",
      },
    ],
    limitations: [
      "Not production-ready; breadboard interface would need a custom PCB for a durable unit.",
      "The fuse did not open during the fast spin. No later test shows a rating that would have.",
      "Launcher mechanics and closed-loop current / speed sensing were not finished.",
      "App integration was demo-grade, not a polished consumer UX.",
    ],
  },
  reflection: {
    surprises: [
      "The first “ESP32 is dead” bug was a missing buck converter, not firmware.",
      "The first “stepper won’t index” bug was a soft print and weak fastening, not STEP/DIR timing.",
      "PWM is a switched waveform, not a DC voltage inside the MOSFET. Speed still depends on the motor and the load. A motor that runs flat out can look hard-tied to the pack, and that appearance is not a current measurement.",
      "A fuse opens on current and time, not because the shaft is fast. An open solder joint interrupts current. It does not force current somewhere else.",
    ],
    redesign: [
      "Custom power / motor-interface PCB with deliberate fuse rating, Kelvin sense, and flyback paths.",
      "Validate PWM fault modes so a stuck-high gate cannot mean continuous full pack on the flywheel.",
      "Design printed feed parts for torque and fastening from revision one.",
      "Add closed-loop current / speed sensing so commanded duty is not the only success signal.",
    ],
    future: [
      "PCB revision of the interface circuitry.",
      "Feed reliability and launch consistency tests.",
      "Packaging pass once the electrical map stops moving.",
    ],
    questions: [
      "Which failure mode do you check first when the symptom is only “it doesn’t shoot” or “it won’t stop speeding”?",
      "What fuse rating and placement actually interrupts a stuck-MOSFET fault before insulation melts?",
      "What sensor proves a ball left the launcher, not just that a motor spun?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "12 V packs and 5 V MCUs do not negotiate. Use a buck or stay on USB forever.",
    },
    {
      kind: "design-insight",
      text: "MOSFET PWM is hard switching. Duty cycle is average voltage to the motor, not a DC voltage inside the FET.",
    },
    {
      kind: "engineering-note",
      text: "A fuse that does not open, plus a joint that does, is how you melt a wire.",
    },
    {
      kind: "observation",
      text: "BrainChild client work: the demo is the deadline. Power and packaging fail earlier than clever features.",
    },
  ],
};
