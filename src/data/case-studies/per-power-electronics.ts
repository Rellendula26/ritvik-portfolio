import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * PER Power Electronics Design Challenge — recruitment / independent analysis.
 * Do not reproduce original challenge prompts.
 */
export const PER_POWER_ELECTRONICS_CASE_STUDY: EngineeringCaseStudy = {
  slug: "per-power-electronics",
  motivation: {
    why: "I wanted to prove I could turn a written electrical requirement into a circuit that monitors sensor thresholds, makes a logic decision, and drives an indicator under real timing and automotive supply constraints.",
    interest:
      "The interesting part was not drawing a schematic. It was deciding how threshold detection, logic, timing, and a 5 V rail from a noisy ~12 V vehicle supply should fit together without inventing convenience that the environment will punish.",
    learning:
      "I wanted a harder look at buck-converter selection: efficiency, headroom, ripple, EMI, and board area as a system, not as a single 'outputs 5 V' checkbox.",
  },
  systemOverview: {
    summary:
      "Independent engineering work for Penn Electric Racing's recruitment process. The circuit watches brake and current sensor conditions, decides when those conditions are satisfied together, and activates an indicator within a required response window. Power comes from an automotive-style 12 V domain that must be regulated for the sensing and logic stages.",
    subsystems: [
      {
        name: "Power regulation",
        role: "Steps the vehicle supply into a clean enough low-voltage rail for references, comparators, and logic.",
      },
      {
        name: "Sensor inputs",
        role: "Bring brake and current sensing into the threshold stage with usable reference levels.",
      },
      {
        name: "Threshold detection",
        role: "Comparators answer whether each sensor has crossed its required level.",
      },
      {
        name: "Logic + timing",
        role: "Combine conditions and shape the response so the indicator meets the timing requirement.",
      },
      {
        name: "Indicator",
        role: "Make the decision visible without loading the decision node incorrectly.",
      },
    ],
    dataFlow:
      "12 V supply → regulation → sensor/reference network → comparators → logic → timing → indicator.",
    controlFlow:
      "Analog thresholds become digital decisions; the timing network enforces response behavior before the LED stage.",
  },
  disciplines: [
    {
      id: "sensing-logic",
      discipline: "Sensing & Decision Logic",
      goal: "Detect when brake and current conditions are simultaneously satisfied and drive an indicator.",
      design:
        "Comparator stages for each threshold, logic that requires the concurrent condition, and a timing network that sets response behavior.",
      challenges: [
        "Reference and hysteresis choices change how noisy sensor edges look at the comparator.",
        "Response timing is a requirement, not a cosmetic RC preference.",
      ],
      iterations: [
        "First-pass threshold network.",
        "Logic combination of both conditions.",
        "Timing revised after checking the written response requirement.",
      ],
      finalImplementation:
        "Comparator + logic + timing path aimed at concurrent detection and bounded indicator response.",
    },
    {
      id: "power-stage",
      discipline: "Power Regulation",
      goal: "Generate a usable 5 V rail from an automotive ~12–17 V domain without treating the converter as a black box.",
      design:
        "Compared candidate buck architectures (LM5164 vs LMR33630 class parts) against efficiency, current headroom, transient behavior, ripple, EMI, footprint, and thermal story.",
      challenges: [
        "A part that 'makes 5 V' can still fail the rest of the board through noise or weak transient response.",
        "EMI couples into sensor and communication circuitry that lives next to the power stage.",
      ],
      iterations: [
        "List of metrics that matter for this PCB.",
        "Side-by-side datasheet reading (values still being filled in on the page).",
        "EMI framing for conducted vs radiated noise.",
      ],
      finalImplementation:
        "Documented selection criteria and comparison scaffold for the buck stage.",
    },
  ],
  designDecisions: [
    {
      id: "buck-choice",
      title: "Treat the buck as a system, not a voltage label",
      problem:
        "Generating 5 V from ~12–17 V looks simple until load steps, ripple, EMI, and packaging show up.",
      alternatives: [
        "Pick the first 5 V regulator that fits the pinout",
        "Compare candidates against efficiency, headroom, transient, ripple, EMI, footprint, thermal",
      ],
      tradeoffs:
        "A tiny or cheap part can still heat the board, ring the rail, or couple noise into analog paths.",
      choice:
        "Score candidates on system metrics first. Exact datasheet numbers remain TODO placeholders until filled from the sheets.",
    },
    {
      id: "timing-requirement",
      title: "Response time is a max, not a delay aesthetic",
      problem:
        "An RC timing network can satisfy 'the circuit waits' while still violating a maximum allowable response.",
      alternatives: [
        "Treat 0.5 s as a minimum delay",
        "Treat 0.5 s as a maximum allowable response and size timing accordingly",
      ],
      tradeoffs:
        "Misreading the written requirement produces a working waveform that fails the spec.",
      choice:
        "Re-check simulation against the requirement text, then revise the timing interpretation.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Draft",
      title: "Threshold path on the page",
      description:
        "Built the sensing → compare → logic → indicate story before locking the power stage.",
      media: {
        kind: "image",
        src: "/projects/per-power-electronics/notes-task-a-preview.jpg",
        alt: "Prep notes for the monitoring circuit",
        label: "Paper plan",
        portrait: true,
      },
    },
    {
      id: "e2",
      phase: "Simulate",
      title: "Transient check",
      description:
        "Ran CircuitLab transient analysis to see indicator timing against the intended behavior.",
      media: {
        kind: "image",
        src: "/projects/per-power-electronics/transient-analysis.jpg",
        alt: "Transient analysis waveform",
        label: "CircuitLab transient",
      },
    },
    {
      id: "e3",
      phase: "Correct",
      title: "Requirement mismatch",
      description:
        "Caught that the response-time wording was a maximum, not a minimum delay, and revised understanding/design.",
      media: {
        kind: "image",
        src: "/projects/per-power-electronics/schematic.jpg",
        alt: "Final CircuitLab schematic",
        label: "Revised schematic",
      },
    },
  ],
  results: {
    items: [
      {
        title: "Transient simulation captured",
        body: "CircuitLab transient analysis is on the page as primary verification evidence for response behavior.",
        evidence: "Transient waveform",
      },
      {
        title: "Measured response time",
        body: "Exact measured value still needs to be filled from the simulation readout.",
        evidence: "TODO · measured response",
      },
      {
        title: "Requirement check",
        body: "Pass/fail against the written response requirement is left as an explicit TODO so the page never invents a result.",
        evidence: "TODO · pass/fail",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/per-power-electronics/transient-analysis.jpg",
        alt: "CircuitLab transient analysis waveform for the PER sensor-monitor circuit",
        label: "Transient analysis",
        caption:
          "CircuitLab transient analysis from the submission package. Read timing from the plot; do not invent numbers here.",
      },
      {
        kind: "image",
        src: "/projects/per-power-electronics/schematic.jpg",
        alt: "Final CircuitLab schematic",
        label: "Schematic",
      },
    ],
    limitations: [
      "Datasheet comparison cells are filled from my Task C write-up; re-check against the latest datasheet revision when needed.",
      "Pass/fail interpretation of response time is intentionally unmarked until the transient readout is confirmed.",
      "Challenge-circuit rail used a 7805; the LMR33630 recommendation is for a sensor/DAQ PCB use case.",
    ],
  },
  reflection: {
    surprises: [
      "Power regulation stopped being 'does it output 5 V?' and became a system question about heat, ripple, EMI, and load steps.",
      "A circuit can look correct in simulation while still failing a written timing requirement if the requirement is misread.",
    ],
    redesign: [
      "Annotate the transient plot with cursor readouts for response time.",
      "Keep the 7805 vs LMR33630 distinction explicit so the page never looks inconsistent.",
    ],
    future: [
      "Bring the same datasheet-driven buck review into other automotive / drivetrain boards.",
      "Practice writing verification tables before schematic polish.",
    ],
    questions: [
      "How much EMI margin is enough for sensor and CAN neighbors on a denser PCB?",
      "Which transient cases should be mandatory before locking a buck choice?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Recruitment challenge only. This page is independent analysis, not PER vehicle hardware.",
    },
    {
      kind: "design-insight",
      text: "Requirement text is part of the design. Simulation without that check is incomplete.",
    },
  ],
  designChallenge: {
    disclaimer:
      "Independent engineering work completed as part of Penn Electric Racing's recruitment process. Not hardware designed for or used on the PER car.",
    flowTitle: "Signal / power path",
    flowStages: [
      { id: "supply", label: "12 V Supply" },
      { id: "reg", label: "Power Regulation" },
      { id: "sense", label: "Sensor Inputs" },
      { id: "thresh", label: "Threshold Detection" },
      { id: "logic", label: "Logic" },
      { id: "time", label: "Timing / Response" },
      { id: "led", label: "Indicator" },
    ],
    architectureTitle: "Why each block exists",
    architectureIntro:
      "Each stage answers one question. If a block cannot justify itself, it should not be on the board.",
    architectureBlocks: [
      {
        id: "c1",
        title: "Comparator 1",
        question: "Has the brake signal crossed its required threshold?",
        body: "Turns an analog brake condition into a clear decision edge for the logic stage.",
      },
      {
        id: "c2",
        title: "Comparator 2",
        question: "Has the current signal crossed its required threshold?",
        body: "Same idea for current sensing so both conditions share a comparable decision language.",
      },
      {
        id: "logic",
        title: "Logic",
        question: "Are the required conditions simultaneously true?",
        body: "Prevents an indicator trip on a single sensor event when concurrency is required.",
      },
      {
        id: "timing",
        title: "Timing",
        question: "Does the circuit satisfy the required response behavior?",
        body: "Shapes how quickly the decision becomes a visible indicator event.",
      },
      {
        id: "power",
        title: "Power regulation",
        question: "Is the low-voltage rail honest under automotive supply and load?",
        body: "Keeps references and logic alive without dumping switching pain into the sensing path.",
      },
      {
        id: "led",
        title: "Indicator",
        question: "Can a human see the decision without loading the circuit badly?",
        body: "Closes the loop from requirement to observable behavior.",
      },
    ],
    schematicPlaceholder: {
      kind: "image",
      src: "/projects/per-power-electronics/schematic.jpg",
      alt: "CircuitLab schematic for the sensor-monitoring indicator circuit",
      label: "CircuitLab schematic",
      caption:
        "12 V → 7805 rail, brake/current comparator windows, logic aggregation, RC timing, latch, and LED indicator.",
    },
    researchMedia: [
      {
        kind: "image",
        src: "/projects/per-power-electronics/notes-task-a-preview.jpg",
        alt: "Handwritten prep notes for the monitoring circuit",
        label: "Task A prep notes",
        caption: "Paper planning before the CircuitLab schematic.",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/per-power-electronics/notes-task-b-preview.jpg",
        alt: "Handwritten buck converter research notes",
        label: "Task B prep notes",
        caption: "Divider vs linear vs buck, ON/OFF paths, and duty-cycle knobs.",
        portrait: true,
      },
    ],
    datasheetComparison: {
      partA: "LM5164",
      partB: "LMR33630",
      metrics: [
        {
          id: "eff",
          label: "Efficiency",
          whyItMatters: "Less energy wasted as heat in a packed enclosure.",
          valueA: "High (no matched 12–17→5 V / 0.5 A curve in sheet)",
          valueB: "5 V curves published; >95% peak claimed",
        },
        {
          id: "rdson",
          label: "MOSFET R_DS(on)",
          whyItMatters:
            "Lower switch resistance reduces conduction loss as load current rises (P = I²R).",
          valueA: "HS 725 mΩ · LS 330 mΩ",
          valueB: "HS 75 mΩ · LS 50 mΩ (VQFN)",
        },
        {
          id: "iout",
          label: "Output-current capability / headroom",
          whyItMatters:
            "Provides margin when MCU, sensors, or CAN circuitry create transient loads.",
          valueA: "1 A class part (challenge shortlist)",
          valueB: "3 A class part (challenge shortlist)",
        },
        {
          id: "transient",
          label: "Transient response",
          whyItMatters:
            "Determines how well the 5 V rail stays regulated when load current suddenly changes.",
          valueA: "External L/C dominated",
          valueB: "External L/C dominated",
        },
        {
          id: "ripple",
          label: "Output-voltage ripple",
          whyItMatters:
            "Excessive supply noise can affect sensitive analog measurements.",
          valueA: "Passives + f_s set the result",
          valueB: "Higher f_s options help smaller passives",
        },
        {
          id: "emi",
          label: "EMI behavior",
          whyItMatters:
            "Fast switching edges can inject noise into nearby sensor and communication circuitry.",
          valueA: "CISPR 25 Class 5 documented",
          valueB: "Low EMI / HotRod package claimed",
        },
        {
          id: "fs",
          label: "Switching frequency",
          whyItMatters:
            "Higher frequency can shrink L and C; it also raises switching loss and EMI risk.",
          valueA: "Adjustable up to 1 MHz",
          valueB: "Fixed options: 400 kHz / 1.4 MHz / 2.1 MHz",
        },
        {
          id: "footprint",
          label: "PCB footprint",
          whyItMatters: "Matters in tightly packaged automotive electronics.",
          valueA: "SO PowerPAD ~4.9 × 6 mm",
          valueB: "VQFN ~3 × 2 mm",
        },
        {
          id: "cost",
          label: "Unit cost (approx.)",
          whyItMatters: "BOM pressure on a multi-board vehicle program.",
          valueA: "~$4.50",
          valueB: "~$3 (Detkin stock caveat for LM)",
        },
        {
          id: "thermal",
          label: "Thermal behavior",
          whyItMatters:
            "Heat that has nowhere to go becomes a reliability and layout problem.",
          valueA: "Package + conduction loss story",
          valueB: "Lower R_DS(on) helps conduction heat",
        },
      ],
    },
    comparisonMedia: [
      {
        kind: "image",
        src: "/projects/per-power-electronics/buck-research.jpg",
        alt: "One-page buck converter research write-up",
        label: "Task B · buck research",
        caption: "Duty cycle, ON/OFF energy path, and switching-frequency tradeoffs.",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/per-power-electronics/ic-selection-p01.jpg",
        alt: "IC selection comparison page for LM5164 vs LMR33630",
        label: "Task C · IC selection",
        caption: "Use-case-weighted comparison; recommended LMR33630 for this board.",
        portrait: true,
      },
      {
        kind: "image",
        src: "/projects/per-power-electronics/ic-selection-p02.jpg",
        alt: "IC selection conclusion page",
        label: "Task C · decision",
        caption: "Final pick with EMI counterargument kept explicit.",
        portrait: true,
      },
    ],
    emi: {
      conducted:
        "Switching disturbances travel through PCB traces, supply rails, or ground and show up as rail bounce or reference noise.",
      radiated:
        "Fast-changing currents and voltages create electromagnetic fields that can couple into nearby circuitry without a shared conductor.",
      context:
        "On a sensor / data-acquisition board near electrically noisy drivetrain hardware, both paths matter. A quiet schematic can still become a noisy measurement if the buck stage is treated as isolated from the analog neighborhood.",
    },
    verificationIntro:
      "Verification is where the design meets the written requirement. Waveform first; numbers only when measured.",
    verificationMedia: [
      {
        kind: "image",
        src: "/projects/per-power-electronics/transient-analysis.jpg",
        alt: "CircuitLab transient analysis for response timing",
        label: "CircuitLab transient",
        caption: "Primary simulation evidence from the challenge submission.",
      },
    ],
    verificationRows: [
      {
        requirement: "Indicator responds within the allowed response window",
        mechanism: "Comparator + logic + timing network",
        method: "CircuitLab transient analysis",
        result: null,
      },
      {
        requirement: "Both sensor conditions required before indication",
        mechanism: "Concurrent logic on comparator outputs",
        method: "Functional simulation / schematic review",
        result: null,
      },
      {
        requirement: "5 V rail suitable for sensing/logic under automotive input",
        mechanism: "Buck regulation stage",
        method: "Datasheet comparison + (TODO) rail simulation",
        result: null,
      },
    ],
    iterationTitle: "What changed after checking the requirement",
    iterationIntro:
      "Engineering was iterative. The circuit could function and still be wrong relative to the written response-time requirement.",
    iterationSteps: [
      {
        id: "i1",
        title: "Initial interpretation",
        body: "Treated 0.5 s more like a minimum delay aesthetic than a maximum allowable response.",
      },
      {
        id: "i2",
        title: "Simulation",
        body: "Captured transient behavior for the indicator path.",
      },
      {
        id: "i3",
        title: "Compare against the written requirement",
        body: "Re-read the response-time wording as a bound the design must stay inside.",
      },
      {
        id: "i4",
        title: "Identify the mismatch",
        body: "A 'working' delay story can still fail a maximum-response requirement.",
      },
      {
        id: "i5",
        title: "Revise understanding / design",
        body: "Updated the timing interpretation so verification targets the real constraint.",
      },
    ],
  },
};
