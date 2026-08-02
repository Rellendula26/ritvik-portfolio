import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * First custom PCB: Arduino Nano + HC-SR04 + status LED.
 * Focus: end-to-end KiCad workflow to fabrication-ready Gerbers.
 */
export const ULTRASONIC_PCB_CASE_STUDY: EngineeringCaseStudy = {
  slug: "ultrasonic-pcb",
  motivation: {
    why: "I had only ever built on breadboards. I wanted one complete pass through a real PCB workflow before the next robotics board got complicated.",
    interest:
      "The circuit is intentionally simple. The work is schematic to footprint to two-layer layout to Gerbers you can send out.",
    learning:
      "Custom libraries, copper layers, plated holes, solder mask, silkscreen, DRC, and a fab package. That pipeline is what I wanted to own.",
  },
  systemOverview: {
    summary:
      "A compact two-layer through-hole PCB that seats an Arduino Nano, an HC-SR04 ultrasonic sensor on a custom four-pin footprint, a status LED, and the power/signal routing between them. Designed in KiCad and exported as Gerber + Excellon files for PCBWay.",
    subsystems: [
      {
        name: "Schematic",
        role: "Nano GPIO, power, ultrasonic interface, and LED wired with manufacturable footprints assigned.",
      },
      {
        name: "Custom HC-SR04 library",
        role: "Symbol and footprint from measured sensor dimensions instead of a wrong generic connector.",
      },
      {
        name: "Two-layer PCB",
        role: "Signal and power routing, ground plane, DRC-clean layout.",
      },
      {
        name: "Fab package",
        role: "Gerber layers and Excellon drills ready for commercial fabrication.",
      },
    ],
    dataFlow:
      "Ultrasonic echo/trigger pins and LED → Nano GPIO on the board. Power and ground distributed through the copper and ground plane.",
    controlFlow:
      "Firmware can live on the Nano later. This project stops at a board you can fabricate and populate.",
    diagram: {
      kind: "image",
      src: "/projects/ultrasonic-pcb/final-3d-render.png",
      alt: "KiCad 3D render of the finished ultrasonic sensor PCB",
      label: "Final 3D render",
      caption: "Fabrication-ready board in KiCad's 3D viewer after routing.",
    },
  },
  disciplines: [
    {
      id: "electrical",
      discipline: "Electrical / Schematic",
      goal: "Capture a Nano + HC-SR04 + LED circuit with footprints that can actually be manufactured.",
      design:
        "Full schematic in KiCad. Power and signal nets to the ultrasonic header and status LED. Every part gets a real footprint before layout starts.",
      challenges: [
        "Generic footprints lie about pin pitch and body size.",
        "Easy to leave a net unassigned until DRC or 3D view catches it.",
      ],
      iterations: [
        "Breadboard mental model.",
        "Schematic with stock parts.",
        "Custom HC-SR04 symbol once the stock connector was clearly wrong.",
      ],
      finalImplementation:
        "Schematic with Nano, custom ultrasonic symbol, LED, and manufacturable footprints ready for PCB.",
      media: {
        kind: "image",
        src: "/projects/ultrasonic-pcb/schematic.png",
        alt: "KiCad schematic for Nano, ultrasonic sensor, and LED",
        label: "Schematic",
        caption: "Schematic capture before layout.",
      },
    },
    {
      id: "pcb-design",
      discipline: "PCB Layout",
      goal: "Route a clean two-layer board with a ground plane and a custom sensor footprint that matches the real HC-SR04.",
      design:
        "Compact through-hole layout. Custom footprint from measured dimensions. Signal and power traces, then copper pour / ground plane. DRC until the board was legal for fab.",
      challenges: [
        "First time owning copper layers, plated through-holes, mask, and silkscreen as real constraints.",
        "Footprint errors only show up when the physical sensor will not sit on the pads.",
      ],
      iterations: [
        "Pre-trace placement and 3D check.",
        "Routed copper and ground plane.",
        "DRC cleanup before export.",
      ],
      finalImplementation:
        "Two-layer routed PCB with custom ultrasonic footprint, ground plane, and DRC-clean design.",
      media: [
        {
          kind: "image",
          src: "/projects/ultrasonic-pcb/pcb-editor.png",
          alt: "KiCad PCB editor view of the routed board",
          label: "PCB editor",
          caption: "Routed two-layer layout in KiCad.",
        },
        {
          kind: "image",
          src: "/projects/ultrasonic-pcb/ultrasonic-symbol.png",
          alt: "Custom HC-SR04 symbol and footprint editor",
          label: "Custom footprint",
          caption: "HC-SR04 library part from measured dimensions.",
        },
      ],
    },
    {
      id: "manufacturing",
      discipline: "Manufacturing Prep",
      goal: "Export a fab package a board house can build without guesswork.",
      design:
        "Gerber layers plus Excellon drills. Final check in the 3D viewer before packing files for PCBWay.",
      challenges: [
        "Missing a layer or drill file is a silent fab failure.",
        "3D view catches mechanical collisions that DRC does not.",
      ],
      iterations: [
        "Pre-trace 3D preview.",
        "Post-route 3D and Gerber export.",
        "Fab package for PCBWay.",
      ],
      finalImplementation:
        "Fabrication-ready Gerber and drill set generated from the finished layout.",
      media: {
        kind: "image",
        src: "/projects/ultrasonic-pcb/pre-trace-3d.png",
        alt: "KiCad 3D render before copper routing",
        label: "Pre-trace 3D",
        caption: "Early 3D check before finishing traces.",
      },
    },
  ],
  designDecisions: [
    {
      id: "simple-circuit",
      title: "Keep the circuit simple on purpose",
      problem: "First PCB: chase features or chase the workflow?",
      alternatives: ["Dense multi-sensor board", "Minimal Nano + ultrasonic + LED"],
      tradeoffs:
        "A denser board looks impressive and hides process mistakes. A small board makes library, layout, and fab mistakes obvious.",
      choice: "Minimal circuit. Learn the pipeline first.",
    },
    {
      id: "custom-footprint",
      title: "Custom HC-SR04 footprint",
      problem: "Trust a generic connector footprint or measure the part?",
      alternatives: ["Stock pin header footprint", "Custom footprint from calipers"],
      tradeoffs:
        "Stock is faster until the sensor will not mount. Measuring once beats a respin.",
      choice: "Custom symbol and footprint from physical dimensions.",
    },
    {
      id: "through-hole",
      title: "Through-hole for a first board",
      problem: "Through-hole or jump straight to SMD?",
      alternatives: ["SMD-first", "Through-hole Nano and sensor"],
      tradeoffs:
        "SMD is denser; through-hole is more forgiving for hand assembly and first-time fab.",
      choice: "Through-hole so assembly risk stays separate from layout learning.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Stage 1",
      title: "Schematic",
      description: "Nano, ultrasonic, LED nets with footprints assigned.",
      media: {
        kind: "image",
        src: "/projects/ultrasonic-pcb/schematic.png",
        alt: "Schematic stage",
        label: "Schematic",
      },
    },
    {
      id: "e2",
      phase: "Stage 2",
      title: "Custom library + placement",
      description: "HC-SR04 footprint and early 3D placement check.",
      media: {
        kind: "image",
        src: "/projects/ultrasonic-pcb/pre-trace-3d.png",
        alt: "Pre-trace 3D",
        label: "Placement",
      },
    },
    {
      id: "e3",
      phase: "Stage 3",
      title: "Route + Gerbers",
      description: "Copper, ground plane, DRC, fab export.",
      media: {
        kind: "image",
        src: "/projects/ultrasonic-pcb/final-3d-render.png",
        alt: "Final routed board",
        label: "Final board",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Custom library parts",
        body: "HC-SR04 symbol and footprint built for this board instead of forcing a generic header.",
        evidence: "Symbol / footprint editor stills",
      },
      {
        title: "Two-layer routed PCB",
        body: "Signal routing, power, ground plane, and DRC-clean layout in KiCad.",
        evidence: "PCB editor + final 3D render",
      },
      {
        title: "Fab package",
        body: "Gerber and Excellon files generated for commercial fabrication (PCBWay).",
        evidence: "Manufacturing export",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/final-3d-render.png",
        alt: "Final fabrication-ready PCB 3D render",
        label: "Fab-ready board",
        caption: "End state of the first complete PCB pass.",
      },
    ],
    limitations: [
      "Electrically simple by design; the point was process, not circuit novelty.",
      "Physical board bring-up and firmware validation come after fab returns.",
      "No public GitHub repo linked yet.",
    ],
  },
  reflection: {
    surprises: [
      "Most of the learning was libraries and fab hygiene, not drawing wires.",
      "3D view caught issues DRC was happy to ignore.",
    ],
    redesign: [
      "Lock mechanical keepouts earlier for the Nano USB and sensor cone.",
      "Document a Gerber checklist so export is mechanical next time.",
    ],
    future: [
      "Populate and bring up the fabbed board.",
      "Reuse this workflow on denser robotics and motor-driver PCBs.",
    ],
    questions: [
      "When does a first board's simplicity stop being discipline and start being avoidance?",
      "What should move to SMD once the through-hole fab loop is boring?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "A simple board is still a real PCB if the Gerbers are honest.",
    },
    {
      kind: "design-insight",
      text: "Custom footprints are not polish. They are how the sensor actually mounts.",
    },
    {
      kind: "observation",
      text: "This is the pipeline I want before the next motor driver or robot board.",
    },
  ],
};
