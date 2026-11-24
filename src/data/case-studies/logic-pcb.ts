import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

export const LOGIC_PCB_CASE_STUDY: EngineeringCaseStudy = {
  slug: "logic-pcb",
  servoBringUp: true,
  motivation: {
    why: "SR-01 climbs and cuts on a rope. The actuators pull real current, and the control board has to survive that. I modified the power and logic boards so the robot can switch that current and still talk to the actuators.",
    interest:
      "The interesting part is that a mechanical failure becomes an electrical one. A grip link that breaks can dump stepper current back into the board.",
    learning:
      "I wanted the rails and the connectors to be something I could check with a meter before I blamed the firmware.",
    narrative:
      "The boards and the servo path are above. This note is only the open fault: a grip test broke a printed link, and that story is written once under When it broke. Meter checks on the boards in hand are 12 V and 6 V. The fuse markings are still not a map.",
    requirements: [
      "Switch actuator current in the 5–20 A range without taking the control board with it.",
      "Keep a fused path on the power board and a regulated rail. The fuse markings are still not mapped to a branch.",
      "Talk to the actuators over RS-485 and I2C.",
      "Be able to check 12 V and 6 V with a meter before blaming firmware.",
    ],
  },
  systemOverview: {
    summary:
      "Two boards from the SR-01 set. Servo commands on the logic board go from a Teensy 4.1, through a TCA9548A, to a PCA9685, and out as 50 Hz PWM. Output enable is not another I2C hop. It is Teensy GPIO 6 into the PCA9685 OE pin, and OE is active low. RS-485 is still on the same board. The power board is the fused distribution: terminal blocks, blade fuses, a yellow XT60, and modular DC-DC converters. The fuse and regulator sheets are that board. I still have not mapped the fuse markings to branches.",
    subsystems: [
      {
        name: "Power board",
        role: "Fused distribution into the actuators. Blade fuses are installed, including one marked 15. A later photo shows modular DC-DC converters on this board.",
      },
      {
        name: "Logic board",
        role: "Teensy 4.1, plus stepper, encoder, RS-485, I2C, and proximity connectors. Power inputs are marked 12 V, 5 V, and ground.",
      },
      {
        name: "Servo path",
        role: "TCA9548A multiplexer into a PCA9685. Sixteen channels of 12-bit PWM, set to 50 Hz. Firmware scans the buses and reads a register back after a write.",
      },
    ],
    dataFlow:
      "I2C from the Teensy through the TCA9548A to the PCA9685. The scan names what answers, and a register write has to read back.",
    controlFlow:
      "PWM leaves the PCA9685 only if OE is enabled. GPIO 6 has to drive that pin. Actuator current stays on the power path, not on SDA and SCL.",
    signalPath: [
      { title: "Teensy 4.1", detail: "I2C host on the logic board." },
      { title: "TCA9548A", detail: "I2C multiplexer to the downstream devices." },
      {
        title: "PCA9685",
        detail: "16-channel, 12-bit PWM. I set the servo rate to 50 Hz.",
      },
      { title: "Servos", detail: "Actuator outputs. One channel moved on the bench." },
    ],
    enablePath: [
      { title: "Teensy GPIO 6", detail: "Not an I2C pin. Firmware has to drive it." },
      {
        title: "PCA9685 OE",
        detail: "Active low. Until this pin is enabled, the outputs stay off.",
      },
    ],
    specs: [
      "I2C",
      "16-channel, 12-bit PWM",
      "50 Hz servo control",
      "Register read and write",
      "Output enable on GPIO 6",
    ],
    powerPath: [
      { title: "Input", detail: "A yellow XT60 is on the power board. I am not reading a pack voltage off that connector." },
      { title: "Fuses", detail: "The power board photo shows blade fuses marked 15 and 5. I haven't assigned either one to a rail." },
      {
        title: "DC-DC",
        detail:
          "The power board carries ATAZ UMD40 modules marked for 12 V and 5 V outputs. The logic board has its own module. I have not assigned each converter to a load.",
      },
      { title: "Rails", detail: "12 V and 6 V, checked with a multimeter. Logic inputs are marked 12 V, 5 V, and ground." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/logic-pcb/teensy-i2c.jpg",
      alt: "Teensy 4.1 on the logic board, with SDA and SCL marked beside the green connectors",
      fit: "contain",
      label: "Teensy I2C",
      caption:
        "Teensy 4.1 on the logic board. The silkscreen by the green connectors is marked SDA and SCL. This is the connector, not a bus capture.",
    },
  },
  disciplines: [
    {
      id: "power",
      discipline: "Power",
      goal: "Feed actuators that can draw 5–20 A without letting a fault take the control board.",
      design:
        "Fused circuits in that current range, and DC-DC regulation, on the power and logic boards I modified. The power board in hand has the yellow XT60, green terminal blocks, and blade fuses marked 15 and 5. A closer photo shows ATAZ UMD40 modules marked for 12 V and 5 V outputs. I looked at those modules for distribution and for adding a rail later, and at keeping the power routing off the signal routing, plus reverse-current protection. I check 12 V and 6 V with a multimeter before I trust an actuator channel. Those meter checks are not a fuse map, and they are not an EMI or protection test.",
      challenges: [
        "The grip-test cascade, including the failed control board, is written under When it broke.",
        "The brushed-to-BLDC saw change is unfinished. The reason for trying it, and what is still missing, is in that same fault note.",
      ],
      iterations: [
        "Rail and connector checks with a multimeter when a channel doesn't come up.",
      ],
      finalImplementation:
        "The fused power board and the logic board are in hand. The control board from the grip test has not been replaced in a bring-up note.",
      media: [
        {
          kind: "image",
          src: "/experiences/serpent/power-board.jpg",
          alt: "Power board held on a clear plate, with a yellow XT60 and blade fuses",
          label: "Power board",
          fit: "contain",
          caption:
            "An earlier power board: yellow XT60, green terminal blocks, and blade fuses marked 15 and 5. This is not the V2 board I tested, and I haven't mapped those fuses to rails.",
        },
        {
          kind: "image",
          src: "/projects/logic-pcb/power-modules.jpg",
          alt: "Power board with two black ATAZ DC-DC modules and green terminal blocks",
          label: "DC-DC modules",
          fit: "contain",
          caption:
            "V2 power board. ATAZ UMD40 modules marked for 12 V and 5 V outputs. The labels are what the parts say. This photo is not a load test.",
        },
      ],
    },
  ],
  contribution: {
    summary:
      "I modified the power and logic boards, checked the rails with a meter, and brought up the Teensy servo path on the logic board. The grip-test cascade is still the earlier failure on record. I don't have a photo of a replacement control board.",
    mine: [
      "Fused paths, DC-DC regulation, and RS-485 and I2C, as one set of changes on the two boards.",
      "Meter checks of the 12 V and 6 V rails and the actuator interfaces.",
      "Diagnostic firmware on the Teensy: bus scan, register readback, 50 Hz PWM, and the GPIO 6 enable that let the servo move.",
    ],
    alreadyThere: [
      "The SR-01 logic and power boards, including V1 on the homework sheet and the later V2 pair I tested. I did not draw a new schematic for this page, and I did not design the chassis.",
      "The climbing robot the boards belong to. I modified these two boards. I did not design the chassis.",
    ],
  },
  rootCauseAnalyses: [
    {
      id: "grip-test",
      title: "The grip test took the control board",
      symptoms:
        "During a branch-grip test the printed link broke while grabbing the branch. Stepper current dropped suddenly and fed back. Signals were delayed by about 5 seconds. Half the actuators and the control board failed. One signal kept getting sent, the saw went past a full turn, and a Hall-sensor wire came out.",
      alsoConsidered:
        "A stalled motor, a broken mechanical stop, and a driver that never limits current can all end at a dead control board. The link breaking is what this test recorded. I am not treating the brushed-to-BLDC saw change as finished. That change was started because the brushless saw draws less current and the old one often got stuck.",
      method:
        "The checks I have done on the boards in hand are meter readings of the 12 V and 6 V rails and the actuator interfaces, including when a channel stays down. I don't have a measurement from the moment the link broke.",
      rootCause:
        "The printed link was in the electrical path. When it broke, the current spike killed the control board and half the actuators, not just the plastic.",
      improvement:
        "There is no replacement-board photo and no bring-up note for a new control board. Fusing was the change meant to give that fault current a place to stop. The fuse sheet is on the power board. I still have not mapped the marked ratings to a branch.",
      notYet:
        "Bring the rails back up on a replacement control board. Map the fuse markings to the branches on the power sheet. Finish the saw motor change only with a current measurement.",
    },
  ],
  designDecisions: [
    {
      id: "fused-path",
      title: "Fuse the actuator path",
      problem:
        "A stalled or suddenly unloaded stepper can push current back into the control electronics. The grip test did that.",
      alternatives: [
        "Leave the actuator supply unprotected and hope the driver limits current.",
        "Fuse the 5–20 A paths and regulate the logic rails separately.",
      ],
      tradeoffs:
        "Fuses and a DC-DC stage add parts and a voltage drop. They also give a place for the fault current to stop. The fuse sheet is on the power board. I still have not mapped the 15, the 5, or the later 30 A markings to a branch.",
      choice:
        "I put 5–20 A fused circuits, DC-DC regulation, and RS-485 and I2C onto the power and logic boards as one set of changes.",
    },
  ],
  evolution: [
    {
      id: "boards",
      phase: "Boards",
      title: "Power and logic in the SR-01 set",
      description:
        "V1 is the pair on the homework sheet. The boards went through more than one revision after that. Rail bring-up, 12 V and 6 V, was on V2.",
    },
    {
      id: "grip",
      phase: "Failure",
      title: "The grip test",
      description:
        "The printed link broke while grabbing a branch. Stepper current fed back, signals were delayed by about 5 seconds, and the control board and half the actuators failed. A rotating base was added because the machine was hard to place in the tree. I don't have a separate design note for that mechanism.",
    },
    {
      id: "servo-path",
      phase: "Bring-up",
      title: "I2C to a servo",
      description:
        "Diagnosed and cleared an active-low output-enable fault on the PCA9685. Driving GPIO 6 low moved a servo through the V2 logic board at 50 Hz. Endurance, current logging, and a long voltage check are still open.",
    },
  ],
  results: {
    items: [
      {
        title: "Servo path",
        body: "One channel moved after output enable was driven. The checks, and what is still open, are in the bring-up above.",
      },
      {
        title: "Rails I have checked",
        body: "12 V and 6 V, and the actuator interfaces, with a multimeter during bring-up. That is not a stability run.",
      },
      {
        title: "What failed earlier",
        body: "The grip test took out the control board and half the actuators. That replacement is still open. It is a different fault from the servo that sat still.",
      },
    ],
    limitations: [
      "Fuse markings are not mapped to a branch. CURRENT_S and VOLTAGE_S are on the power schematic and have not been logged.",
      "No photo of a replacement control board after the grip test.",
      "A power cycle was not tested, so turn-on and turn-off behavior is unknown.",
      "Extended actuator endurance, current-consumption logging, and voltage stability over a long run have not been done.",
    ],
  },
  reflection: {
    surprises: [
      "The plastic link was part of the electrical path. When it broke, the current spike killed the control board.",
    ],
    redesign: [
      "Finish the brushed-to-BLDC saw change only after there is a current measurement, not just the reason for trying it.",
    ],
    future: [
      "Replace the failed control board and bring the rails back up on the new board.",
      "Map the fuse markings to the branches on the power sheet.",
      "Run the servo long enough to log current and watch the rail. That test has not started.",
    ],
    questions: [
      "Which of the 5–20 A fuses is the one marked 15 on the power board, and what are the others?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "OE is active low. A controller that accepts a register write can still hold every output off.",
    },
    {
      kind: "engineering-note",
      text: "Check 12 V and 6 V before rewriting a driver that might just be unpowered.",
    },
    {
      kind: "observation",
      text: "The numbers written under the boards in one photo are homework, not rail measurements.",
    },
  ],
};
