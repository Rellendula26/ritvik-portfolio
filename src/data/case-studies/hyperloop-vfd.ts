import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Hyperloop VFD Design Challenge — recruitment / independent analysis.
 * Do not reproduce original challenge prompts.
 */
export const HYPERLOOP_VFD_CASE_STUDY: EngineeringCaseStudy = {
  slug: "hyperloop-vfd",
  motivation: {
    why: "I started with limited intuition for how a variable-frequency drive actually turns fixed three-phase AC into controllable motor waveforms. I wanted a system-level map of every conversion stage and why it exists.",
    interest:
      "The interesting part was the chain: rectify, store energy on a DC link, then switch that bus with PWM so the motor sees a controllable fundamental—not memorizing a block diagram.",
    learning:
      "I wanted to separate PWM carrier frequency from fundamental output frequency, and to see losses, ratings, EMI, and protection as first-class design concerns—not afterthoughts once the motor spins in a slide deck.",
  },
  systemOverview: {
    summary:
      "Independent engineering analysis for Penn Hyperloop's recruitment process. The write-up follows a three-phase VFD path from 480 V AC input through rectification, DC-link storage, PWM inversion, and variable-frequency output to a motor.",
    subsystems: [
      {
        name: "6-diode rectifier",
        role: "Converts fixed three-phase AC into a unidirectional DC bus candidate.",
      },
      {
        name: "DC link",
        role: "Stores energy and smooths the rectified voltage for the inverter.",
      },
      {
        name: "PWM inverter",
        role: "Uses semiconductor switches to synthesize controllable three-phase AC from the DC bus.",
      },
      {
        name: "Motor",
        role: "Converts the synthesized electrical waveform into mechanical behavior.",
      },
    ],
    dataFlow:
      "480 V 3φ AC → rectifier → DC link → PWM inverter → variable-frequency 3φ AC → motor.",
    controlFlow:
      "PWM commands decide switch states; switch states decide which DC rail each phase sees over time.",
  },
  disciplines: [
    {
      id: "front-end",
      discipline: "AC → DC front end",
      goal: "Explain why fixed grid AC is rectified before motor control happens.",
      design:
        "Three-phase diode bridge into a DC link so later stages are not fighting the grid's fixed waveform directly.",
      challenges: [
        "Rectified voltage is not yet a finished motor supply.",
        "Ripple and energy storage become the inverter's problem if the link is weak.",
      ],
      iterations: [
        "Map the power path on paper.",
        "Separate rectifier job from inverter job.",
      ],
      finalImplementation:
        "Documented rectifier + DC-link roles as the front half of the VFD chain.",
    },
    {
      id: "inverter",
      discipline: "DC → AC inversion",
      goal: "Show how six switches and PWM create controllable three-phase output.",
      design:
        "High-side / low-side bridge per phase, with PWM shaping the effective waveform while the fundamental sets motor-relevant frequency content.",
      challenges: [
        "People confuse PWM switching frequency with the fundamental the motor 'hears.'",
        "Switching and conduction losses show up as heat even when the topology looks correct.",
      ],
      iterations: [
        "Educational switching-state walkthrough.",
        "Frequency / voltage / PWM distinction cards.",
      ],
      finalImplementation:
        "Stage cards plus switching demo for intuition, not a full circuit simulator.",
    },
  ],
  designDecisions: [
    {
      id: "ac-dc-ac",
      title: "Why AC → DC → AC instead of 'just change the AC'",
      problem:
        "Incoming grid AC has fixed characteristics; motors want controllable frequency and voltage relationships.",
      alternatives: [
        "Try to control the motor directly from fixed grid AC",
        "Rectify to a DC bus, then synthesize controllable three-phase with PWM",
      ],
      tradeoffs:
        "The extra conversion stages add semiconductors, capacitors, losses, and EMI work—but they buy waveform control.",
      choice:
        "Use the DC bus as an energy buffer and let the inverter synthesize the motor waveform.",
    },
    {
      id: "pwm-vs-f",
      title: "Keep PWM carrier and fundamental frequency distinct",
      problem:
        "Switching rate and motor electrical frequency are easy to conflate when first learning VFDs.",
      alternatives: [
        "Talk about 'the frequency' as one number",
        "Separate carrier (switching) from fundamental (motor-relevant)",
      ],
      tradeoffs:
        "Mixing the two makes speed/torque intuition and EMI/loss conversations fall apart.",
      choice:
        "Treat PWM as the mechanism; treat fundamental frequency/voltage as the motor-facing command.",
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Map",
      title: "Draw the energy path",
      description:
        "Forced every stage to answer what enters, what leaves, and why the stage exists.",
    },
    {
      id: "e2",
      phase: "Control",
      title: "Connect PWM to switch states",
      description:
        "Linked abstract PWM talk to high-side / low-side conduction paths on a three-phase bridge.",
    },
    {
      id: "e3",
      phase: "System",
      title: "Add the non-ideal list",
      description:
        "Losses, thermal, ratings, ripple, EMI, and protection as first-class considerations.",
    },
  ],
  results: {
    items: [
      {
        title: "System-level VFD map",
        body: "Clear story from 480 V three-phase AC through rectifier, DC link, inverter, and motor.",
        evidence: "Power-flow diagram",
      },
      {
        title: "PWM vs fundamental distinction",
        body: "Documented so motor behavior is not confused with switching rate.",
        evidence: "Frequency / voltage section",
      },
      {
        title: "No invented numbers",
        body: "Ratings and measured results are left as considerations / TODOs rather than fake datasheet claims.",
        evidence: "Engineering considerations",
      },
    ],
    limitations: [
      "No proprietary challenge figures are reproduced on this page.",
      "Switching demo is educational, not a SPICE-accurate model.",
      "Specific device ratings remain to be filled if you want datasheet callouts later.",
    ],
  },
  reflection: {
    surprises: [
      "The VFD stopped being a mysterious box and became a sequence of energy conversions with clear jobs.",
      "PWM frequency and fundamental frequency answer different questions.",
    ],
    redesign: [
      "Add annotated waveform screenshots if you want measurement evidence on-page.",
      "Optionally drop in a hand-drawn or CAD inverter diagram under public/projects/hyperloop-vfd/.",
    ],
    future: [
      "Carry the same stage-by-stage 'why' habit into other power-electronics learning.",
      "Practice loss and thermal estimates once a specific switch family is chosen.",
    ],
    questions: [
      "Which DC-link ripple budget is realistic for the motor current you care about?",
      "How should switching frequency trade EMI against losses in a pod packaging constraint?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Recruitment challenge only. Independent analysis, not Hyperloop vehicle hardware.",
    },
    {
      kind: "design-insight",
      text: "If you cannot explain why a conversion stage exists, you do not understand the drive yet.",
    },
  ],
  designChallenge: {
    disclaimer:
      "Independent engineering analysis completed as part of Penn Hyperloop's recruitment process. Not hardware designed for or used on a Hyperloop vehicle.",
    flowTitle: "Energy conversion chain",
    flowStages: [
      { id: "ac", label: "480 V 3φ AC" },
      { id: "rect", label: "6-Diode Rectifier" },
      { id: "dc", label: "DC Link" },
      { id: "inv", label: "PWM Inverter" },
      { id: "out", label: "Variable-Frequency 3φ AC" },
      { id: "motor", label: "Motor" },
    ],
    architectureTitle: "Why convert AC → DC → AC?",
    architectureIntro:
      "Grid AC is fixed. Rectification makes a DC bus. The inverter then switches that bus with PWM to synthesize controllable three-phase output for the motor.",
    architectureBlocks: [
      {
        id: "grid",
        title: "Grid / input AC",
        question: "What is fixed about the incoming supply?",
        body: "Frequency and waveform come from the utility side. The drive should not pretend those are free control knobs.",
      },
      {
        id: "bus",
        title: "DC bus",
        question: "What do you gain by stopping at DC?",
        body: "A stored energy reservoir the inverter can draw from while synthesizing a new AC waveform.",
      },
      {
        id: "synth",
        title: "Inverter synthesis",
        question: "How does control show up electrically?",
        body: "Switch states and PWM decide the effective voltage/frequency content delivered to the motor.",
      },
    ],
    stageCards: [
      {
        id: "rectifier",
        title: "Rectifier",
        what: "Turns three-phase AC into unidirectional voltage using a diode bridge.",
        why: "Gives the drive a DC source it can re-shape instead of fighting the grid waveform directly.",
      },
      {
        id: "dc-link",
        title: "DC-link capacitors",
        what: "Store energy and smooth the rectified voltage.",
        why: "The inverter needs a relatively stable DC source; weak linking shows up as ripple and control pain.",
      },
      {
        id: "inverter",
        title: "Inverter",
        what: "Uses semiconductor switches to connect phases to DC+ / DC− in timed patterns.",
        why: "That switching is how controllable three-phase AC is synthesized from DC.",
      },
      {
        id: "switches",
        title: "MOSFETs / IGBTs",
        what: "Act as fast controlled switches in the bridge.",
        why: "Without devices that can chop the bus cleanly, PWM control is fiction.",
      },
      {
        id: "pwm",
        title: "PWM control",
        what: "Varies switching behavior to shape the effective output waveform.",
        why: "It is the software/firmware-facing lever that becomes electrical reality in the bridge.",
      },
      {
        id: "motor",
        title: "Motor",
        what: "Converts the synthesized electrical waveform into torque and speed behavior.",
        why: "The whole conversion chain only matters if the motor sees the right fundamental content.",
      },
    ],
    frequencyVoltageNote: {
      frequency:
        "Fundamental output frequency is strongly related to motor electrical speed.",
      voltage:
        "Output voltage matters for magnetic flux and torque-producing behavior; it is not optional garnish on frequency control.",
      pwmVsFundamental:
        "PWM switching frequency is the carrier / chopping rate. It is not the same thing as the fundamental frequency the motor uses for speed. Mixing them confuses both control and EMI conversations.",
    },
    showInverterSwitching: true,
    engineeringConsiderations: [
      {
        id: "sw-loss",
        title: "Switching losses",
        body: "Every hard edge costs energy. Faster chopping is not free.",
      },
      {
        id: "cond-loss",
        title: "Conduction losses",
        body: "On-state drops add heat even when switching looks gentle.",
      },
      {
        id: "thermal",
        title: "Thermal management",
        body: "Losses that cannot leave the package become derating or failure.",
      },
      {
        id: "ratings",
        title: "Voltage / current ratings",
        body: "Devices must survive bus peaks and motor current, not just average conditions.",
      },
      {
        id: "ripple",
        title: "DC-link ripple",
        body: "A soft bus makes the inverter fight its own supply.",
      },
      {
        id: "emi",
        title: "EMI",
        body: "Fast edges couple into nearby control and sensor circuitry.",
      },
      {
        id: "fsw",
        title: "Switching frequency",
        body: "Trades loss, audible noise, filter size, and EMI against control smoothness.",
      },
      {
        id: "imotor",
        title: "Motor current",
        body: "Sets device stress, cable needs, and protection thresholds.",
      },
      {
        id: "protect",
        title: "Protection",
        body: "Overcurrent, overvoltage, and desat-style protections are part of the design, not a bumper sticker.",
      },
    ],
  },
};
