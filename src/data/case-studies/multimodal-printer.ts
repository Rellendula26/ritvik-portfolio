import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

export const MULTIMODAL_PRINTER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "multimodal-3d-printer",
  motivation: {
    why: "AddLab's printer has a rotating toolhead so the nozzle can place more than one material. I have been reassembling that toolhead and splitting the Arduino sketch that turns the nozzle.",
    interest:
      "The nozzle has to hold a speed while the mechanism fights back. Counting steps is not the same as knowing the angle.",
    learning:
      "I wanted the shaft angle as a measurement I could put next to the command, not as a number the driver assumes.",
    narrative:
      "This is a multimodal printer in AddLab. The Aerotech's rotating toolhead is how one machine places more than one material, and this axis is headed for a demo to the military. For that demo, a person at the machine sets how far the nozzle turns, and the display has to show the angle the shaft actually reached.\n\nI have been reassembling that toolhead and pulling the Arduino sketch out of one file. The axis that turns the nozzle is a 5:1 geared NEMA 17. An A4988 takes step and direction from an Uno. A potentiometer on A0 tells the Uno, from its wiper voltage, how far to drive the motor. A magnetic encoder reads where the shaft actually went, and that reading is what the LCD is supposed to show. The breadboard screen still isn't showing degrees.\n\nThe gantry column reads PRO115SL on a wider frame. A blue housing marked 5, 3, and 1 sits over the tube carousel, with a gray motor above it. I have not matched the NEMA 17 name to either of those parts.",
    requirements: [
      "Demo the rotating nozzle to the military, with the command set at the machine and the measured angle on the screen.",
      "Turn the nozzle while the rotating assembly can stall, jerk, or miss steps.",
      "Use the potentiometer voltage on A0 as the command for how far to spin.",
      "Read the shaft with the magnetic encoder and show that angle on the LCD.",
      "Keep 24 V on the motor and 5 V on the logic, the encoder, the potentiometer, and the LCD.",
    ],
  },
  systemOverview: {
    summary:
      "The gantry is an Aerotech. One frame of the column reads PRO115SL. A blue housing marked 5, 3, and 1 sits over a white tube carousel, with a gray motor above it in a printed bracket. The nozzle motor in this axis is a 5:1 geared NEMA 17. I have not matched that name to the blue housing or the gray motor in the photo. The drawing below is the modification: a potentiometer sets how far to spin, and the magnetic encoder is what the LCD is supposed to display. The role calls the machine a 4-axis, 6-material printer. These photos show the rotating carousel, not the other axes, and not six loaded tubes.",
    subsystems: [
      { name: "Gantry", role: "Aerotech PRO115SL. The toolhead hangs on this column." },
      { name: "Command", role: "Potentiometer on A0. The wiper voltage is how far to spin." },
      { name: "Nozzle drive", role: "5:1 geared NEMA 17, A4988, 24 V on VMOT." },
      { name: "Angle", role: "Magnetic encoder on the shaft, read over I2C by an Arduino Uno." },
      { name: "Display", role: "Character LCD meant to show the encoder angle. It doesn't yet." },
    ],
    dataFlow:
      "Potentiometer voltage on A0, then STEP and DIR into the A4988. Encoder angle back over I2C, and that angle is what the LCD is supposed to show.",
    controlFlow:
      "A mode button and a go button are on the same sheet. I haven't written down what each one does. 5 V feeds the potentiometer, the LCD, the encoder, and the driver logic. The motor supply stays 24 V.",
    signalPath: [
      { title: "Potentiometer", detail: "Wiper on A0. That voltage is how far to drive the motor." },
      { title: "Uno", detail: "Turns the voltage into STEP and DIR. The sketch is split into stepper, encoder, PID, and robot files." },
      { title: "A4988", detail: "STEP on D3, DIR on D2. The motor supply is 24 V on VMOT." },
      { title: "Encoder", detail: "Shaft angle back over I2C. Blue wire on A4, yellow on A5, still unchecked against the pinout." },
      { title: "LCD", detail: "Supposed to show that angle. The drawing puts 220 Ω on the backlight and 1.5 kΩ on the contrast pin." },
    ],
    powerPath: [
      { title: "24 V", detail: "Motor supply on VMOT. This is not the logic rail." },
      { title: "A4988", detail: "The driver between that supply and the NEMA 17." },
      { title: "5 V", detail: "Uno, driver logic, encoder, potentiometer, and LCD." },
      { title: "LCD", detail: "Backlight can be on while the screen shows no degrees." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/multimodal-3d-printer/control-schematic.jpg",
      alt: "Wiring drawing of an Arduino Uno with a potentiometer, two buttons, an LCD, an A4988, a 24 volt supply, and a magnetic encoder",
      fit: "contain",
      label: "Command and angle",
      caption:
        "Potentiometer on A0, mode and go buttons, LCD, A4988 on 24 V, encoder on A4 and A5. The LCD is supposed to show the encoder angle.",
    },
  },
  disciplines: [
    {
      id: "controls",
      discipline: "Motion",
      goal: "Turn the nozzle at a set speed and know whether the shaft actually went there.",
      design:
        "The potentiometer voltage is the command for how far to drive. I split the sketch into ToolheadRefactor.ino, Config.h, StepperDriver, MagneticEncoder for the AS5600, PIDController, and RobotController. The Arduino turns that command into steps. The driver turns the motor. The encoder reads the shaft, and the code compares that with the goal. STEP is D3, DIR is D2, the encoder's blue wire is A4, and the yellow wire is A5. The drawing also shows MS1 through MS3 connected, but it doesn't number which Uno pin each one lands on, so I don't have a microstep map.",
      challenges: [
        "The rotating assembly can stall the motor, jerk it, or make it miss steps. The 5:1 gearbox is there so the NEMA 17 can turn the nozzle more slowly with more torque. If the code only counts pulses it sent, a stall still looks like a successful move.",
        "Current limit, microstepping, acceleration, and a different motor or driver are still open questions. I don't have a logged stall, and I haven't matched the NEMA 17 name to the blue housing or the gray motor above it.",
      ],
      iterations: [
        "Reassembled the toolhead on the gantry.",
        "Drew the Uno, the A4988, and the encoder, then added the potentiometer, the LCD, and the two buttons.",
        "Wired a character LCD for the angle. The screen isn't showing degrees.",
      ],
      finalImplementation:
        "The toolhead is on the Aerotech. In the carousel clip the tubes are in a different place at the end than at the start, and no angle was written down.",
      media: [
        {
          kind: "image",
          src: "/projects/multimodal-3d-printer/toolhead.jpg",
          alt: "Blue motor housing marked 5, 3, and 1",
          label: "Toolhead",
          caption: "Housing marked 5, 3, and 1. I don't know what those marks mean.",
        },
        {
          kind: "video",
          src: "/projects/multimodal-3d-printer/carousel.mp4",
          poster: "/projects/multimodal-3d-printer/carousel-poster.jpg",
          alt: "Tube carousel under the blue motor",
          label: "Carousel",
          caption:
            "The carousel sits in a different position at the end of the clip than at the start. No angle is recorded.",
          portrait: true,
        },
      ],
    },
    {
      id: "display",
      discipline: "Display",
      goal: "Read the shaft's change in degrees on a character LCD.",
      design:
        "The number on the screen is supposed to be the encoder angle, not the potentiometer voltage. The drawing wires that LCD to the Uno, with 220 Ω on the backlight and 1.5 kΩ on the contrast pin. The breadboard has the display connected. The backlight can be on while the characters are not a degree reading.",
      challenges: [
        "A lit screen is not an angle. Until the display shows degrees, I can't use it to check the encoder against the step command.",
      ],
      iterations: ["Wired the LCD. The screen still isn't showing degrees."],
      finalImplementation:
        "The display is on the bench. The degree readout is not.",
      media: {
        kind: "image",
        src: "/projects/multimodal-3d-printer/breadboard.jpg",
        alt: "Character LCD on a breadboard wired to an Arduino",
        label: "LCD",
        caption:
          "LCD wired to the Arduino. The backlight is on. The screen is not showing degrees.",
        portrait: true,
      },
    },
  ],
  contribution: {
    summary:
      "I reassembled the toolhead, drew the nozzle axis, and split the sketch so the encoder reading can be compared with the goal. I don't have a tuned gain or a logged stall.",
    mine: [
      "Reassembly of the toolhead on the Aerotech.",
      "The newer drawing: potentiometer on A0, LCD, mode and go buttons, A4988 on 24 V, encoder on A4 and A5.",
      "The file split: ToolheadRefactor, Config, StepperDriver, MagneticEncoder, PIDController, RobotController.",
    ],
    alreadyThere: [
      "The Aerotech gantry. A wider frame of the column reads PRO115SL.",
      "The 5:1 geared NEMA 17 as the nozzle motor in the notes. The photo does not say which housing that is.",
    ],
  },
  designDecisions: [
    {
      id: "encoder",
      title: "Read the shaft instead of trusting the step count",
      problem:
        "The A4988 will advance on every STEP edge even if the motor stalled. The Arduino then thinks the nozzle is at the goal.",
      alternatives: [
        "Run open-loop and treat the pulse count as the angle.",
        "Put an AS5600 on the shaft and compare that reading with the goal.",
      ],
      tradeoffs:
        "The encoder adds an I2C device and a magnet on the shaft. Without it, a stall looks like a successful move. The drawing alone doesn't close the loop. The sketch has to use the reading.",
      choice:
        "I wired the AS5600 and split out a PID file so the error is the goal minus the measured angle.",
    },
    {
      id: "pot-command",
      title: "Set the move from the potentiometer voltage",
      problem:
        "The toolhead has to spin by an amount I can set at the machine, and the screen has to show where the shaft actually is.",
      alternatives: [
        "Type an angle into the sketch and hope the step count matches.",
        "Read the potentiometer on A0 and use that voltage as how far to drive the motor.",
      ],
      tradeoffs:
        "A wiper is easy to turn at the bench, and easy to misread if the voltage isn't scaled into an angle. The encoder is the check. The LCD is supposed to show the measured position, not the pot voltage.",
      choice:
        "That's the path on the new drawing. The pot voltage commands the move. The encoder reports the shaft. The LCD is supposed to display that report.",
    },
  ],
  evolution: [
    {
      id: "reassemble",
      phase: "Week 2",
      title: "Toolhead back on the gantry",
      description:
        "The task was to reassemble the printer and take the sketch out of one file. A stepper sat on the bench while the toolhead was apart.",
      media: {
        kind: "image",
        src: "/projects/multimodal-3d-printer/bench-stepper.jpg",
        alt: "Stepper on the bench next to a small green board",
        label: "Off the gantry",
        caption: "Stepper on the bench during reassembly. Not a mounted measurement.",
      },
    },
    {
      id: "lcd",
      phase: "Week 4",
      title: "An LCD for the angle",
      description:
        "The goal is a screen that reads the change in degrees. The breadboard photo is next to that problem above. The display still isn't showing the angle.",
    },
  ],
  results: {
    items: [
      {
        title: "On the machine",
        body: "The toolhead is mounted. In one clip the carousel has moved. I didn't record how far.",
      },
      {
        title: "Not yet",
        body: "No degree on the LCD, no logged stall, and no tuned gains.",
      },
    ],
    limitations: [
      "The potentiometer is the command on the drawing. I haven't logged a move whose distance came from that voltage.",
      "The mode and go buttons are drawn. I haven't written what each one does.",
      "Wire colors on the encoder are from the drawing and still need a pinout check.",
      "The 5, 3, and 1 marks are unlabeled.",
      "Six materials is the machine's description, not a count of tubes in these photos.",
    ],
  },
  reflection: {
    surprises: [
      "A light-looking mechanism can still stall a geared stepper once the nozzle is in the assembly.",
    ],
    redesign: ["Use the encoder reading in the loop before changing current limit or microstepping."],
    future: [
      "Get the encoder angle on the LCD, then drive one move from the potentiometer voltage and read that angle back.",
      "Write down one stall, or one current-limit and microstepping trial, when either happens.",
    ],
    questions: ["Which housing in the photo is the 5:1 NEMA 17?"],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "24 V is the motor supply. 5 V is the Uno, the driver logic, the encoder, the potentiometer, and the LCD. They are not the same rail.",
    },
  ],
};
