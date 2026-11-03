import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

export const LOGIC_PCB_CASE_STUDY: EngineeringCaseStudy = {
  slug: "logic-pcb",
  motivation: {
    why: "SR-01 climbs and cuts on a rope. The actuators pull real current, and the control board has to survive that. I modified the power and logic boards so the robot can switch that current and still talk to the actuators.",
    interest:
      "The interesting part is that a mechanical failure becomes an electrical one. A grip link that breaks can dump stepper current back into the board.",
    learning:
      "I wanted the rails and the connectors to be something I could check with a meter before I blamed the firmware.",
    narrative:
      "SR-01 climbs a rope and cuts a branch while the arborist stays on the ground. The actuators pull real current, and the control board has to survive a fault in that current. I modified the power and logic boards for that job: fused paths in the 5–20 A range, DC-DC regulation, and RS-485 and I2C, kept as one set of changes. I don't have a sheet that puts each of those on only one board.\n\nBring-up so far is the 12 V and 6 V rails and the actuator connectors, checked with a multimeter. A later grip test is the failure this page has to account for. A printed link broke, stepper current fed back, and the control board and half the actuators were fried. That board has not been replaced in a bring-up note.",
    requirements: [
      "Switch actuator current in the 5–20 A range without taking the control board with it.",
      "Keep a fused path and a regulated rail, even though the photos don't assign each part to one board.",
      "Talk to the actuators over RS-485 and I2C.",
      "Be able to check 12 V and 6 V with a meter before blaming firmware.",
    ],
  },
  systemOverview: {
    summary:
      "Two boards from the SR-01 set. The logic board carries connectors for the stepper, encoder, RS-485, I2C, and proximity sensors, with power inputs marked 12 V, 5 V, and ground. The power board has terminal blocks, blade fuses, and a yellow XT60. I changed them together: 5–20 A fused paths, DC-DC regulation, and RS-485 and I2C. I don't have a schematic that puts each of those on only one board.",
    subsystems: [
      {
        name: "Power board",
        role: "Fused distribution into the actuators. Blade fuses are installed, including one marked 15.",
      },
      {
        name: "Logic board",
        role: "Stepper, encoder, RS-485, I2C, and proximity connectors, plus the marked 12 V, 5 V, and ground inputs.",
      },
      {
        name: "Bring-up",
        role: "12 V and 6 V rails and the actuator interfaces, checked with a multimeter.",
      },
    ],
    dataFlow: "Commands over RS-485 and I2C, actuator power through the fused path.",
    controlFlow:
      "The logic board is the control side. Actuator current stays on the power path, not on the signal pins.",
    signalPath: [
      { title: "Command", detail: "The controller talks to the actuators." },
      { title: "RS-485 and I2C", detail: "Both buses are in the same set of board changes." },
      { title: "Logic connectors", detail: "Stepper, encoder, proximity, and the bus labels are on the silkscreen." },
      { title: "Actuator", detail: "The command side. Current for the motor is the other path." },
    ],
    powerPath: [
      { title: "Input", detail: "A yellow XT60 is on the power board. I am not reading a pack voltage off that connector." },
      { title: "Fuses", detail: "The power board photo shows blade fuses marked 15 and 5. I haven't assigned either one to a rail." },
      { title: "DC-DC", detail: "Regulation is part of the same change set. The photos don't show which board it sits on." },
      { title: "Rails", detail: "12 V and 6 V, checked with a multimeter. Logic inputs are marked 12 V, 5 V, and ground." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/logic-pcb/both-boards.jpg",
      alt: "Logic board and power board lying on a homework page",
      fit: "contain",
      label: "Both boards",
      caption:
        "Logic board on top, power board below. The handwriting under them is ESE 2150 homework, not a measurement from these boards.",
    },
  },
  disciplines: [
    {
      id: "power",
      discipline: "Power",
      goal: "Feed actuators that can draw 5–20 A without letting a fault take the control board.",
      design:
        "Fused circuits in that current range, and DC-DC regulation, on the power and logic boards I modified. The power board in hand has the yellow XT60, green terminal blocks, and blade fuses marked 15 and 5. I check 12 V and 6 V with a multimeter before I trust an actuator channel. Those meter checks are not the same thing as knowing which fuse feeds which motor.",
      challenges: [
        "A grip test broke a printed link while it was grabbing a branch. The stepper current dropped suddenly and fed back into the electrical system. Signals were delayed by about 5 seconds. Half the actuators and the control board were fried.",
        "In that same cascade one signal kept getting sent, the saw traveled past a full turn, and a Hall-sensor wire came out. The saw was being changed from a brushed DC motor to a BLDC because the brushless saw draws less current and the old one often got stuck. That change is not finished.",
      ],
      iterations: [
        "Rail and connector checks with a multimeter when a channel doesn't come up.",
      ],
      finalImplementation:
        "The fused power board and the logic board are in hand. The control board from the grip test has not been replaced in a bring-up note.",
      media: [
        {
          kind: "image",
          src: "/projects/logic-pcb/logic-board.jpg",
          alt: "Green logic PCB with connectors for stepper, encoder, and RS-485",
          label: "Logic board",
          fit: "contain",
          caption:
            "Bare logic board. Silkscreen includes stepper, encoder, RS-485, and power inputs marked 12 V, 5 V, and ground. This is not a powered measurement.",
        },
        {
          kind: "image",
          src: "/experiences/serpent/power-board.jpg",
          alt: "Power board held on a clear plate, with a yellow XT60 and blade fuses",
          label: "Power board",
          fit: "contain",
          caption:
            "Power board. Yellow XT60, green terminal blocks, and blade fuses marked 15 and 5. I haven't mapped those fuses to rails.",
        },
        {
          kind: "image",
          src: "/projects/logic-pcb/driver-bench.jpg",
          alt: "Logic board, power hardware, a brushless driver, and a motor on a blue bench mat",
          label: "On the bench",
          fit: "cover",
          caption:
            "Logic board, power hardware, a brushless driver marked BLD-30, and a motor, with a soldering iron in the frame. This is not a finished channel, and it is not a meter reading.",
        },
      ],
    },
  ],
  contribution: {
    summary:
      "I modified the power and logic boards and checked the rails with a meter. The grip-test cascade is the failure on record. I don't have a photo of a replacement control board.",
    mine: [
      "Fused paths, DC-DC regulation, and RS-485 and I2C, as one set of changes on the two boards.",
      "Meter checks of the 12 V and 6 V rails and the actuator interfaces.",
    ],
    alreadyThere: [
      "The SR-01 logic board and power board in the photos, including the connectors, blade fuses, and XT60.",
      "The climbing robot the boards belong to. I modified these two boards. I did not design the chassis.",
    ],
  },
  rootCauseAnalyses: [
    {
      id: "grip-test",
      title: "The grip test took the control board",
      symptoms:
        "During a branch-grip test the printed link broke while grabbing the branch. Stepper current dropped suddenly and fed back. Signals were delayed by about 5 seconds. Half the actuators and the control board were fried. One signal kept getting sent, the saw went past a full turn, and a Hall-sensor wire came out.",
      alsoConsidered:
        "A stalled motor, a broken mechanical stop, and a driver that never limits current can all end at a dead control board. The link breaking is what this test recorded. I am not treating the brushed-to-BLDC saw change as finished. That change was started because the brushless saw draws less current and the old one often got stuck.",
      method:
        "The checks I have done on the boards in hand are meter readings of the 12 V and 6 V rails and the actuator interfaces, including when a channel stays down. I don't have a measurement from the moment the link broke.",
      rootCause:
        "The printed link was in the electrical path. When it broke, the current spike killed the control board and half the actuators, not just the plastic.",
      improvement:
        "There is no replacement-board photo and no bring-up note for a new control board. Fusing was the change meant to give that fault current a place to stop. I still can't point to which fuse sits on which board.",
      notYet:
        "Bring the rails back up on a replacement control board. Mark which 5–20 A fuse, which DC-DC stage, and which bus live on the power board versus the logic board. Finish the saw motor change only with a current measurement.",
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
        "Fuses and a DC-DC stage add parts and a voltage drop. They also give a place for the fault current to stop. I still don't have the sheet that says which fuse sits on which board.",
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
        "The photos show both boards. Bring-up so far is the 12 V and 6 V rails and the actuator interfaces.",
    },
    {
      id: "grip",
      phase: "Failure",
      title: "The grip test",
      description:
        "The printed link broke while grabbing a branch. Stepper current fed back, signals were delayed by about 5 seconds, and the control board and half the actuators were fried. A rotating base was added because the machine was hard to place in the tree. I don't have a separate design note for that mechanism.",
    },
  ],
  results: {
    items: [
      {
        title: "Rails I have checked",
        body: "12 V and 6 V, and the actuator interfaces, with a multimeter.",
      },
      {
        title: "What failed",
        body: "The grip test took out the control board and half the actuators. That is the current state, not a finished redesign.",
      },
    ],
    limitations: [
      "Fusing, DC-DC, and the buses are not yet assigned to a single board.",
      "No photo of a replacement control board after the grip test.",
      "A power cycle was not tested, so turn-on and turn-off behavior is unknown.",
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
      "Replace the fried control board and bring the rails back up on the new board.",
      "Mark which fused path and which bus live on the power board versus the logic board.",
    ],
    questions: [
      "Which of the 5–20 A fuses is the one marked 15 on the power board, and what are the others?",
    ],
  },
  engineeringNotes: [
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
