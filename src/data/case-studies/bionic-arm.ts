import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

export const BIONIC_ARM_CASE_STUDY: EngineeringCaseStudy = {
  slug: "bionic-arm",
  motivation: {
    why: "Penn ADAPT is building a small actuated arm with an EMG armband. I design the PCBs and the mounts. This is not the assistive button.",
    interest:
      "Eight electrode modules have to share one bus and still reject the noise that shows up on both pads of a pair.",
    learning:
      "A schematic date and a power note can describe two different batteries. I want those to be the same pack before I call the power path done.",
    narrative:
      "I design the PCBs and the mounts for a Penn ADAPT arm. One sensor board is built. It is a two-electrode differential pair into one ADS1291 channel. The architecture is eight of those modules, a main STM32 board, two servos, and a linear actuator. The team tested the main board and started the first fixture. This is not the assistive button.\n\nThe buck and LDO feed the sensing circuitry. The electrodes are the signal inputs, not a load on that rail. The September main sheet marks a 2-cell pack from 6.0 V to 8.4 V and also labels 12 V. My note is a 7.2 V pack, a buck to 4 V, then an LDO. Those are not the same description. Firmware reads raw EMG from one ADS1291, gain 6, 2000 samples per second, and can run a fixed motor test. It does not turn that signal into a gesture or a grip force. Two longer wires still keep a board out of the CAD mount.",
    requirements: [
      "Digitize eight EMG channels from differential pairs.",
      "Leave a quiet supply for the sensing circuitry.",
      "Provide the actuator, servo, and 3.3 V rails the main sheet labels.",
      "Hold the boards on the arm. Two long wires still block that fit.",
    ],
  },
  systemOverview: {
    summary:
      "I have one sensor PCB. The plan is eight small rigid modules around the forearm, each a differential electrode pair, tied with 20-pin flex. A sensor main board sits between those modules and the main board. The main board is an STM32 with a labeled 12 V actuator rail, a 6 V servo rail, and 3.3 V electronics. The team tested that board and started the first fixture. I design the boards and the mounts.",
    subsystems: [
      { name: "Sensor module", role: "ADS1291 on the differential pair. Eight chips, one SPI bus, a chip select each, shared START." },
      { name: "Sensor main", role: "One ADS1291, bias network, two 20-pin flex connectors." },
      { name: "Main board", role: "STM32 acquisition, processing, and the power and control interfaces." },
      { name: "Mounts", role: "CAD that should hold the boards on the arm. Two long wires still keep a board out." },
    ],
    dataFlow: "Electrodes, ADS1291, SPI, STM32. Firmware stores raw EMG and can run a fixed motor test. It does not close a loop on the signal.",
    controlFlow:
      "Architecture V4 gives each ADS1291 its own chip select, CS1 through CS8, and a shared START so the samples line up. A progress slide still says SPI daisy-chain. I am not treating either description as the one the team finished.",
    signalPath: [
      { title: "Electrodes", detail: "A differential pair on each module. Noise common to both pads drops out." },
      { title: "ADS1291", detail: "Digitizes that difference. The sheets show one chip per module." },
      { title: "SPI", detail: "Schematics use CS1 through CS8 and a shared START. The progress slide says daisy-chain." },
      { title: "STM32", detail: "Main board. Firmware reads one ADS1291 and can run a fixed motor test. It does not close a loop on EMG." },
    ],
    powerPath: [
      { title: "Pack", detail: "My plan is a 7.2 V LiPo. The 9/20 sheet marks a 2-cell pack, 6.0 V to 8.4 V." },
      { title: "Buck, then LDO", detail: "The plan steps 7.2 V to 4 V, then an LDO, for the sensing circuitry. The electrodes are inputs." },
      { title: "3.3 V", detail: "Sensor sheets use a TPS7A2033. The main sheet also labels 3.3 V." },
      { title: "Actuator and servo", detail: "The sheet labels 12 V and 6 V. It does not say how 12 V is made from the pack." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/bionic-arm/cover.jpg",
      alt: "Block diagram of an electrode pair into an ADS1291, times eight, then SPI to an MCU",
      fit: "contain",
      label: "Architecture",
      caption:
        "One differential pair, resistors, and an ADS1291, marked x8, then SPI into the MCU. This is the block diagram, not the chip-select wiring.",
    },
  },
  disciplines: [
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Digitize EMG channels and feed the sensing circuitry from a quieter supply than the buck alone.",
      design:
        "Each module takes the difference between two electrodes, so noise common to both drops out, then an ADS1291 digitizes it. The sensor sheets use a TPS7A2033 on 3.3 V. My power plan steps a 7.2 V LiPo to 4 V with a buck, then an LDO, for that sensing supply. The LDO reduces ripple. It does not remove every switching artifact. The electrodes stay signal inputs.",
      challenges: [
        "The main-board sheet, 9/20/2026, marks a 2-cell pack from 6.0 V to 8.4 V, plus 12 V, 6 V, and 3.3 V. That is not the 7.2 V to 4 V plan.",
        "A buck cannot make the 12 V actuator rail from an 8.4 V pack. The sheet labels 12 V. It does not say how that rail is made.",
        "Two longer wires keep the board out of the CAD mount.",
      ],
      iterations: [
        "sensor_main2 on 9/19/2026, Main on 9/20/2026, sensor_normal on 9/27/2026. Drawn-by is blank on the sheets.",
        "Bring-up reads one ADS1291: gain 6, 2000 samples per second. A fixed motor test is separate from that capture.",
      ],
      finalImplementation:
        "The schematics are drawn, and one sensor board is built. Firmware reads raw EMG from one ADS1291 and can run a fixed motor test. There is no saved EMG recording and no mount that fits.",
      media: [
        {
          kind: "image",
          src: "/projects/bionic-arm/main-board.jpg",
          alt: "Main board schematic with pack, actuator, servo, and 3.3 V rails",
          label: "Main board",
          fit: "contain",
          caption:
            "Main sheet, 9/20/2026. 2-cell pack marked 6.0 V to 8.4 V, with actuator, servo, and 3.3 V rails. A buck cannot make the labeled 12 V from 8.4 V.",
        },
        {
          kind: "image",
          src: "/projects/bionic-arm/sensor-main.jpg",
          alt: "Sensor main schematic with an ADS1291 and two 20-pin flex connectors",
          label: "Sensor main",
          fit: "contain",
          caption:
            "sensor_main2, 9/19/2026. One ADS1291 between the main board and the other modules, with two 20-pin flex connectors.",
        },
      ],
    },
  ],
  contribution: {
    summary:
      "I design the boards and the mounts. One sensor board is built. The team tested the main board and started the first fixture. Drawn-by is blank on the sheets.",
    mine: [
      "PCB drawings for the sensor modules, the sensor main, and the main board.",
      "The 7.2 V to 4 V buck-then-LDO plan for the sensing supply.",
      "The mounts. Two longer wires still keep a board out of the CAD.",
    ],
    alreadyThere: [
      "The team tested the main board and started the first fixture.",
      "Architecture V4's chip-select map, and a progress slide that still says SPI daisy-chain.",
      "Bring-up that reads one ADS1291 at gain 6 and 2000 samples per second, plus an optional fixed motor test.",
    ],
  },
  designDecisions: [
    {
      id: "ldo",
      title: "Buck, then an LDO, for the sensing supply",
      problem: "The EMG supply has to be quiet. Dropping a LiPo straight in a linear regulator burns the difference as heat.",
      alternatives: [
        "Run the sensing circuitry from the buck and live with its ripple.",
        "Drop most of the voltage in a buck, then use an LDO for the last, quieter step.",
      ],
      tradeoffs:
        "The extra regulator is another part. It gives the sensing circuitry a quieter supply than the buck alone, and it does not erase every switching artifact. The main-board voltages still don't match this plan.",
      choice:
        "I planned 7.2 V down to 4 V, then an LDO. I'm not calling the power path done until that lines up with the 6.0 V to 8.4 V sheet.",
    },
    {
      id: "one-channel",
      title: "Read one ADS1291 before the motors move",
      problem:
        "If the actuators are on while the analog path is unread, a bad sample and a moving motor look like the same failure.",
      alternatives: [
        "Enable the servos and the linear actuator and watch the arm.",
        "Compile the motors off and read one ADS1291 in the debugger.",
      ],
      tradeoffs:
        "Motors off means this bring-up does not show the arm moving. It does mean the samples are not fighting a mechanism that is already in motion.",
      choice:
        "The bring-up I'm using reads one ADS1291 at gain 6 and 2000 samples per second. Motion, when it runs, is a fixed test, not an EMG command.",
    },
    {
      id: "wires",
      title: "Treat the mount as a wire-length problem",
      problem: "The board does not sit in the CAD mount.",
      alternatives: [
        "Change the mount around the wires that are already there.",
        "Shorten the two long wires so the board can use the mount I drew.",
      ],
      tradeoffs:
        "A new mount hides a harness that is too long. Shorter wires are the fix if the board itself fits. I have not cut them yet.",
      choice:
        "I haven't cut the wires or redrawn the mount. The board still doesn't sit.",
    },
  ],
  rootCauseAnalyses: [
    {
      id: "rails",
      title: "The power note and the schematic are two packs",
      symptoms:
        "My sensing-supply note is a 7.2 V LiPo, a buck to 4 V, then an LDO. The main sheet from 9/20/2026 marks a 2-cell pack from 6.0 V to 8.4 V, and it also labels 12 V, 6 V, and 3.3 V.",
      alsoConsidered:
        "Those labels could be a buck, a boost, or a second supply. A buck cannot make 12 V from 8.4 V, so the actuator rail is not the same stage as the 7.2 V to 4 V plan. SPI could also be the thing blocking more channels: the sheets use CS1 through CS8 and a shared START, and the progress slide says daisy-chain.",
      method:
        "I set the sheet next to the plan and next to Architecture V4. I did not measure an EMG, and I did not probe a built 12 V rail. The main board was tested. That test was not mine.",
      rootCause:
        "The 12 V label does not say how the rail is made. The sensing-supply note and the 2-cell sheet are not the same battery. SPI is still two descriptions.",
      improvement:
        "I'm not calling the power path done, and I'm not bringing up CS2 through CS8 until the bus description is one thing. The sensor-normal sheet is the module that would be copied. The slide is the daisy-chain claim.",
      notYet:
        "A measurement of the 12 V rail. A choice between daisy-chain and chip select. An EMG trace. A mount the board actually sits in.",
    },
  ],
  evolution: [
    {
      id: "sheets",
      phase: "September 2026",
      title: "Three schematics",
      description:
        "Sensor main, main board, then sensor normal. The slide counts one sensor main, seven sensor normal boards, and one main board.",
      media: {
        kind: "image",
        src: "/projects/bionic-arm/sensor-normal.jpg",
        alt: "Sensor normal schematic",
        label: "Sensor normal",
        caption: "Sensor_normal, 9/27/2026.",
      },
    },
    {
      id: "fit",
      phase: "Now",
      title: "The board doesn't sit in the mount",
      description:
        "Two longer wires block the CAD fit. The team tested the main board and started the first fixture. The arm is not built.",
    },
  ],
  results: {
    items: [
      {
        title: "In hand",
        body: "Schematics for the sensor module, the sensor main, and the main board. One sensor board is built. Firmware reads raw EMG from one ADS1291 and can run a fixed motor test.",
      },
      {
        title: "Still open",
        body: "No saved EMG recording, no mount that fits, and no EMG-driven motion. The team started the fixture. Gesture recognition and closed-loop grip force are later work.",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/bionic-arm/electrical-team-slide.jpg",
        alt: "Photo of an Electrical Team progress slide",
        label: "Progress slide",
        caption:
          "The slide says SPI daisy-chain. The schematics use CS1 through CS8. Those two don't match.",
      },
    ],
    limitations: [
      "SPI is unresolved between daisy-chain and per-chip select.",
      "The 12 V rail is a label, not a confirmed boost or buck.",
      "Drawn-by is blank, so the sheets are the team's, not a signature line with my name.",
    ],
  },
  reflection: {
    surprises: [
      "The wire length, not the schematic symbol, is what keeps the board out of the mount.",
    ],
    redesign: ["Shorten those two wires, or change the mount, before adding channels."],
    future: [
      "Line the 7.2 V plan up with the 2-cell sheet.",
      "Settle daisy-chain versus CS1 through CS8 before the firmware brings up more than one ADS1291.",
    ],
    questions: ["How is the labeled 12 V actuator rail generated from the pack?"],
  },
  engineeringNotes: [
    {
      kind: "design-insight",
      text: "A buck drops the pack voltage without burning the drop as heat. The LDO after it is the quieter rail.",
    },
  ],
};
