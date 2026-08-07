import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Automatic Tennis Ball Shooter — earlier exploratory robotics prototype.
 * Media: public/projects/tennis-ball-shooter/
 * Each asset is used once on the page; captions name what the photo/clip actually shows.
 */
export const TENNIS_BALL_SHOOTER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "tennis-ball-shooter",
  motivation: {
    why: "Commercial tennis ball launchers look simple from the outside and hide a lot of embedded work underneath. I wanted to understand that stack by building one instead of buying one.",
    interest:
      "The interesting part was not “make a ball fly.” It was getting wireless control, motor sequencing, power electronics, and a mechanical feed to behave like one machine.",
    learning:
      "Coursework had given me programming and basic electronics separately. This was practice making those layers share the same constraints: current, timing, and parts that move.",
  },
  systemOverview: {
    summary:
      "A mobile app talks to an ESP32. Firmware turns those commands into motor sequencing through breadboard interface circuitry: MOSFET switching modules, a fused external DC rail, and an A4988-class stepper driver for the feed. Two RS-775 DC motors spin printed flywheels; a NEMA 17 stepper indexes balls into the launch path. Modular printed brackets keep the mechanical side rearrangeable while the electronics are still changing.",
    subsystems: [
      {
        name: "Wireless control",
        role: "ESP32 receives app commands and owns sequencing / timing in firmware.",
      },
      {
        name: "Motor interface circuitry",
        role: "Breadboard power bus (Wago + fuse), MOSFET modules for the flywheels, A4988 path for the stepper.",
      },
      {
        name: "Ball feed",
        role: "NEMA 17 stepper-driven indexing to present balls to the flywheels.",
      },
      {
        name: "Launcher drive",
        role: "Dual RS-775 DC motors on printed flywheels; PWM duty sets release speed.",
      },
      {
        name: "Chassis & mounts",
        role: "Panel enclosure with printed corner braces and motor brackets so actuators can move during iteration.",
      },
    ],
    dataFlow:
      "Mobile app → ESP32 → GPIO / PWM / STEP·DIR → MOSFET modules + A4988 → RS-775s + NEMA 17 → feed + launch.",
    controlFlow:
      "Firmware owns motor timing and release behavior. The app sends commands; it does not drive actuators directly.",
    diagram: {
      kind: "image",
      src: "/projects/tennis-ball-shooter/circuit-v2.jpg",
      alt: "ESP32 breadboard with fused DC rail and Wago power distribution",
      label: "Control + power hub",
      caption:
        "ESP32 on the breadboard. Thick red rail through a 20 A blade fuse, then Wago lever nuts as the high-current bus. Jumpers leave for MOSFET TRIG/PWM and the stepper driver; logic stays off the motor current path.",
      portrait: true,
    },
  },
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "Hold two flywheel motors and a stepper feed in a layout I could change without reprinting the whole machine every time something moved.",
      design:
        "Panel chassis with blue printed corner braces, orange/white motor mounts, and an open top for service. Two RS-775s sit on L-brackets; a NEMA 17 (17HS13-0404S, 0.4 A) rides a center printed stack for indexing.",
      challenges: [
        "Launcher geometry and feed path changed as motor choices changed.",
        "Clearances only became real once both RS-775s and the stepper occupied the same volume.",
      ],
      iterations: [
        "Early motor placement experiments on printed adapters.",
        "Orange flywheel / coupler prints so the RS-775 shaft could grip a ball path.",
        "Open chassis so wiring and mounts stayed inspectable during bring-up.",
      ],
      finalImplementation:
        "A modular mechanical stack good enough for prototype integration, not a finished consumer enclosure.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/chassis.jpg",
        alt: "Open chassis showing dual RS-775 flywheels and NEMA 17 feed stepper",
        label: "Actuator layout",
        caption:
          "Left/rear: RS-775 DC motors on metal L-brackets with an orange printed flywheel. Center: NEMA 17 stepper (17HS13-0404S) on a white/orange printed feed stack. Blue corner braces hold the black panel box; twisted motor leads and the stepper’s 4-wire harness exit together.",
        portrait: true,
      },
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Connect low-voltage MCU logic to high-current flywheel motors and a stepper without letting brownouts or switching noise kill the control side.",
      design:
        "Started with two heatsinked DC speed controllers (pot-set) plus a red A4988-class driver under an Arduino Mega. Moved to dual MOSFET switch modules (JZ-MOS / dual-FET boards) so the MCU could PWM the flywheel rail directly, with Wago splits and a fused battery/DC input.",
      challenges: [
        "Pot speed controllers set RPM by hand; they did not give the firmware a clean release-speed knob.",
        "Logic and actuator currents do not belong on the same casual wire habit.",
        "Breadboard contacts and temporary wiring make intermittent faults look like firmware bugs.",
      ],
      iterations: [
        "Mega + two pot DC controllers + stepper driver on a mini board.",
        "Replaced pot controllers with MOSFET modules so PWM from the MCU owned flywheel duty.",
        "Fused the red rail and used Wagos as a real power bus instead of stacked jumper pins.",
      ],
      finalImplementation:
        "Prototype interface: fused external DC, MOSFET switching for the RS-775s, A4988 path for the NEMA 17, MCU on the logic side only.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/motor-controller.jpg",
        alt: "Two dual-MOSFET switch modules wired with Wago power splits",
        label: "MOSFET flywheel interface",
        caption:
          "Two blue dual-MOSFET trigger modules in parallel paths. Screw terminals carry the motor rails (white/black and orange/black). Thin yellow/orange leads are TRIG/PWM from the MCU. Grey Wago levers splice the thick red VIN bus so both modules share one fused supply.",
        portrait: true,
      },
    },
    {
      id: "embedded",
      discipline: "Embedded",
      goal: "Coordinate wireless commands, stepper indexing pulses, and flywheel PWM on one controller.",
      design:
        "Started on an Elegoo Mega 2560 with Bluetooth-side phone control. Migrated to ESP32 so wireless and motor timing lived on one board. Firmware owns STEP/DIR to the A4988 and PWM into the MOSFET TRIG pins; the app only sends commands.",
      challenges: [
        "Arduino + Bluetooth was fine in controlled tests and unreliable for consistent app-level control.",
        "Patching that stack kept hiding the real problem: the architecture did not match the job.",
        "Multi-motor timing only makes sense once the power path and mounts are stable enough to trust.",
      ],
      iterations: [
        "Mega 2560 + Bluetooth path for phone control.",
        "Migration to ESP32 for integrated wireless.",
        "Firmware sequencing: spin flywheels, step the feed, adjust release duty.",
      ],
      finalImplementation:
        "ESP32 as the control brain: wireless in, sequenced STEP/DIR + PWM out through the interface circuitry.",
    },
  ],
  designDecisions: [
    {
      id: "controller",
      title: "ESP32 over Arduino Bluetooth",
      problem: "Phone control needed to stay reliable while the rest of the machine was still changing.",
      alternatives: ["Arduino Mega + Bluetooth module", "ESP32 with integrated wireless"],
      tradeoffs:
        "The Mega path was familiar and already partly wired. ESP32 meant a redesign, but the communication path stopped being the main failure mode.",
      choice:
        "Migrate to ESP32. Changing the architecture beat endlessly patching an unsuitable link.",
    },
    {
      id: "switching",
      title: "MOSFET modules over pot speed controllers",
      problem: "Flywheel speed had to be a firmware parameter, not a knob I twisted between demos.",
      alternatives: ["Keep heatsinked pot DC speed controllers", "MCU PWM into MOSFET switch modules"],
      tradeoffs:
        "Pot controllers were easy for a first spin-up. MOSFET modules add wiring and gate drive care, but the ESP32 can set duty cycle per shot.",
      choice:
        "JZ-MOS / dual-FET modules on the high-current rail so release speed lives in firmware.",
    },
    {
      id: "prototyping",
      title: "Breadboard before a custom PCB",
      problem: "Motor count, switching, and connector placement were still moving.",
      alternatives: ["Jump straight to a PCB", "Stay on breadboard through exploration"],
      tradeoffs:
        "A PCB would have frozen the wrong interface. A breadboard is flaky, but it lets power and signal topology change daily.",
      choice:
        "Breadboard for the prototype. A custom PCB is the next milestone if the project continues.",
    },
    {
      id: "mechanics",
      title: "Modular replaceable subsystems",
      problem: "Feed, launcher, and mounts needed to change independently while debugging.",
      alternatives: ["One rigid assembly", "Independently replaceable mechanical subsystems"],
      tradeoffs:
        "Modular costs more CAD / print cycles. Rigid is faster until the first wrong assumption.",
      choice:
        "Printed brackets and modular mounts so one bad mechanical guess did not force a full rebuild.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Electronics",
      title: "Mega, pot controllers, and a stepper driver",
      description:
        "First bench stack: Elegoo Mega 2560 for logic, two heatsinked DC speed controllers for the flywheel motors, and a red A4988-class driver on a mini breadboard for the feed. Wagos split the supply. Flywheel RPM was still a manual pot, not a firmware value.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/initial-circuit.jpg",
        alt: "Elegoo Mega 2560 with two DC speed controllers and a red stepper driver",
        label: "V0 electrical stack",
        caption:
          "Blue Mega 2560 at left. Two black pot-and-heatsink DC speed controllers for the RS-775 rails. Red stepper driver on the mini breadboard. Grey/orange Wagos as the power split; blue printed mount plate waiting on the bench.",
        portrait: true,
      },
    },
    {
      id: "e2",
      phase: "Feed path",
      title: "A4988 bring-up on the Mega",
      description:
        "Before trusting the full launcher, I proved STEP/DIR into the red driver with a bulk electrolytic across VMOT. That clip is the feed electronics path, not the flywheels.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/v1-circuit.mp4",
        alt: "Arduino Mega driving an A4988 stepper driver on a breadboard",
        label: "Stepper driver on Mega",
        caption:
          "Mega headers → blue/brown/purple jumpers into the red A4988-class driver. Black electrolytic across the motor supply pins. Wago on the right joins the thicker motor leads. This is indexing control, not flywheel PWM.",
        portrait: true,
      },
    },
    {
      id: "e3",
      phase: "Interface",
      title: "MOSFET modules for MCU-owned flywheel PWM",
      description:
        "Pot controllers could not take a clean PWM command from firmware. I brought in JZ-MOS and dual-MOSFET switch modules so TRIG/PWM from the MCU could sit between the fused DC rail and the RS-775s.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/motor-controller.mp4",
        alt: "JZ-MOS and dual-MOSFET switch modules in an anti-static bag",
        label: "MOSFET modules",
        caption:
          "Parts, not a wired demo: JZ-MOS board with VIN+/VIN-/VOUT+/VOUT- screw terminals and TRIG/PWM · GND · VCC headers, plus smaller dual-FET switch boards for the high-current flywheel paths.",
        portrait: true,
      },
    },
    {
      id: "e4",
      phase: "ESP32",
      title: "ESP32 + A4988, then flywheel spin",
      description:
        "After the controller migration, the same stepper-driver pattern moved onto an ESP32 breadboard (driver + bulk cap next to the MCU). Short clip then cuts to a printed yellow flywheel spinning on an RS-775 under that control path.",
      media: {
        kind: "video",
        src: "/projects/tennis-ball-shooter/stepper-motor.mp4",
        alt: "ESP32 with A4988 stepper driver, then flywheel spinning",
        label: "ESP32 bring-up",
        caption:
          "First: ESP32 on a white breadboard with a red A4988-class driver and a bulk cap across VMOT; four leads out to the bipolar stepper. Then: yellow printed flywheel on an RS-775 spinning inside the printed mounts.",
      },
    },
    {
      id: "e5",
      phase: "Prototype",
      title: "Chassis harnessed to the ESP32 bench",
      description:
        "Electrical and mechanical halves meet: enclosure with motor and internal cooling fan, multi-color harness to the ESP32 breadboard, battery/DC through the fuse and Wagos. Proof-of-concept integration, not a packaged product.",
      media: {
        kind: "image",
        src: "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
        alt: "Tennis ball shooter chassis wired to ESP32 breadboard and fused battery rail",
        label: "System on the bench",
        caption:
          "Black chassis (RS-775 + orange coupler, small cooling fan inside) wired across the desk to the ESP32 breadboard. Blue pack / thick red-black leads through the inline fuse and Wagos. Soldering station and parts bin still in the loop.",
        portrait: true,
      },
    },
  ],
  results: {
    items: [
      {
        title: "Wireless embedded control",
        body: "ESP32 path could take app-side commands and turn them into sequenced STEP/DIR and flywheel PWM.",
        evidence: "ESP32 control",
      },
      {
        title: "Multi-motor coordination",
        body: "NEMA 17 feed and dual RS-775 flywheels were brought up through a shared interface approach instead of one-off wiring tricks.",
        evidence: "Feed + launch path",
      },
      {
        title: "MCU-owned flywheel duty",
        body: "Moving from pot speed controllers to MOSFET modules put release speed in firmware, with a fused external DC rail for the loads.",
        evidence: "MOSFET interface",
      },
      {
        title: "Honest stopping point",
        body: "Left as a proof-of-concept on purpose. Architecture, debugging, and iteration mattered more than forcing a polished shell.",
        evidence: "Prototype",
      },
    ],
    limitations: [
      "Not production-ready; breadboard interface would need a custom PCB for a durable unit.",
      "Launcher mechanics and closed-loop control were not finished.",
      "App integration stopped at a working command path, not a polished product UX.",
    ],
  },
  reflection: {
    surprises: [
      "Compared with Vend-A-Shoe, this is an earlier exploratory prototype. The value is the process more than final functionality.",
      "Architecture decisions beat implementation details. The ESP32 migration mattered more than another Bluetooth patch.",
      "The pot speed controllers were a dead end for software control even though they spun the flywheels fine.",
      "Multidisciplinary debugging dominated: power, firmware timing, and mounts failed with the same external symptom until I isolated a layer.",
    ],
    redesign: [
      "Replace the breadboard with a custom power / motor-interface PCB once the connector map freezes.",
      "Refine launcher mechanics and ball path tolerances.",
      "Add closed-loop sensing so commanded motion is not the only success signal.",
      "Finish application integration with clearer device state and safer command handling.",
    ],
    future: [
      "PCB revision of the interface circuitry.",
      "Better feed reliability and launch consistency tests.",
      "Packaging pass once the electrical map stops moving.",
    ],
    questions: [
      "When is a wireless stack “good enough” versus a reason to change controllers?",
      "What sensor actually proves a ball left the launcher, not just that a motor spun?",
      "How much modularity is worth the print cycles before the design should freeze?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "If the link layer is the main bug every day, the architecture is wrong.",
    },
    {
      kind: "design-insight",
      text: "A pot speed controller proves the motor. A MOSFET module proves the firmware can own the rail.",
    },
    {
      kind: "observation",
      text: "This project is earlier and more exploratory than Vend-A-Shoe. That is fine if the page says so.",
    },
  ],
};
