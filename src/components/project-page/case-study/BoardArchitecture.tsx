"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/project-page/shared";

type Standing = "sheet" | "checked" | "mixed" | "open";

type Block = {
  id: string;
  title: string;
  sheet: string;
  standing: Standing;
  does: string;
  why: string;
  principle: string;
  system: string;
  more?: { href: string; label: string };
};

type Region = {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  where: string;
};

type BoardView = {
  id: string;
  label: string;
  src: string;
  alt: string;
  caption: string;
  regions: Region[];
};

const STANDING: Record<Standing, string> = {
  sheet: "In the design",
  checked: "Checked on V2",
  mixed: "Partly checked on V2",
  open: "Not brought up",
};

const POWER: Block[] = [
  {
    id: "battery",
    title: "Battery input",
    sheet: "Battery_Input.SchDoc",
    standing: "sheet",
    does: "Takes the pack in through an XT60 and splits that voltage into separate branches, with bulk capacitance on the input.",
    why: "A servo, a sensor, and the controller do not want the same voltage or the same current. Handing every load the raw pack is not a distribution scheme.",
    principle:
      "The sheet is drawn around a nominal 24 V pack. Bulk capacitance holds the input up when a load steps, so one actuator turning on does not drag every other rail down with it. I have not read 24 V off the XT60 in a bring-up note.",
    system:
      "This is the start of the energy path. Everything downstream, including the logic board, is fed from these branches. Top_Level.SchDoc is the sheet that ties them together.",
  },
  {
    id: "fuses",
    title: "Fuse protection",
    sheet: "Fuses.SchDoc",
    standing: "sheet",
    does: "Puts the pack onto dedicated fused branches. One is fused 24 V distribution. Another is the protected feed into the regulators.",
    why: "A short or a stalled actuator should open its own branch. The rest of the robot should still have a supply to come back on.",
    principle:
      "A fuse opens when its branch carries too much current for too long. It does not isolate the robot. A shared ground, a fault that stays under the fuse rating, or a fast spike can still reach another branch. One photo shows blade fuses marked 15 and 5. A later photo shows holders marked 30. I have not mapped either set of markings onto these branches.",
    system:
      "The fused 24 V branch is distribution. The other fused branch is what the regulators are allowed to draw from. The grip test is why this split exists, and it is still an open fault. I do not have a measurement from the moment the link broke.",
  },
  {
    id: "regulation",
    title: "DC-DC regulation",
    sheet: "ISO_Reg.SchDoc, SERVO_Reg.SchDoc",
    standing: "sheet",
    does: "Makes isolated 12 V and 5 V domains, and a dedicated servo rail, V_SERVO. Filtering and bulk capacitors sit around the modules.",
    why: "The logic, the sensors, and the servos cannot share one unregulated 24 V node. A servo rail that is its own domain also means a servo stall is not automatically a brownout of the controller.",
    principle:
      "The sheets use modules: TDK10-series converters, and a KUB-series module for V_SERVO. A module arrives with its layout already done, which is less to get wrong, and it spends board area. The switching noise and the heat still land on this board. A discrete stage can be smaller and matched to one current limit, and it is another power circuit to debug while the rest of the robot is unknown.",
    system:
      "The later power-board photo shows ATAZ UMD40 modules marked 12 V and 5 V, plus a shielded converter I am not naming from the shield. I am not calling those UMD40 modules the KUB, and I am not calling them the TDK10 parts on the sheets. The TDK10-12S3V3 I can read is on the populated logic board. That is a 12 V to 3.3 V module, so it belongs with the logic supply, not with this board's 12 V output.",
  },
  {
    id: "monitor",
    title: "Current and voltage monitoring",
    sheet: "Power sensing",
    standing: "open",
    does: "Produces two analog signals, CURRENT_S and VOLTAGE_S. The parts on the sheet are an ACS770 Hall-effect current sensor, an AMC3311 isolated voltage-sense amplifier, a TLV9001 for conditioning, and an LP5907 3.3 V regulator for that circuitry.",
    why: "Distributing power without watching it means a stall, a sagging pack, or a rail that has already collapsed only shows up as a dead actuator.",
    principle:
      "The ACS770 reads current with a Hall element, so the sense path is not a shunt dropped into the high-current conductor. The AMC3311 measures voltage across an isolation barrier, so the sense circuit does not have to share a ground with the pack. The TLV9001 scales that analog level. The LP5907 is a quiet 3.3 V rail for the sensing parts, separate from a noisy switcher output.",
    system:
      "These signals are how the power board could tell the rest of the robot what the pack and the loads are doing. They are designed. I have not logged CURRENT_S or VOLTAGE_S, and I have not checked them against a meter.",
  },
  {
    id: "expand",
    title: "Connectors and spare rails",
    sheet: "Connectors.SchDoc",
    standing: "sheet",
    does: "Brings the branches and the regulated rails out on connectors, and leaves modular stages and extra rails for a subsystem that is not on the robot yet.",
    why: "A climbing robot gains sensors and actuators. A new load should land on a connector and a rail that already exist, not on a respin.",
    principle:
      "A connector is a current and a voltage you have already decided to expose. The protection and the regulation still have to be sized for whatever gets plugged in later. An empty connector is not a finished feature.",
    system:
      "This is the edge of the power board. The logic board, the servos, and the 12 V sensors are downstream of these connectors. I have checked 12 V and 6 V with a meter. I have not assigned each terminal to a load.",
  },
];

const LOGIC: Block[] = [
  {
    id: "supply",
    title: "Logic supply",
    sheet: "Input_power.SchDoc, 3V3.SchDoc",
    standing: "mixed",
    does: "Takes a rail from the power board and makes the local 3.3 V the controller and the chips run on.",
    why: "The Teensy and the bus chips cannot run from 12 V or from the pack. Their supply has to exist before a scan can find anything.",
    principle:
      "The populated logic board has a TDK10-12S3V3 at the top: 12 V in, 3.3 V out. That is a module again, with the same area, noise, and heat tradeoff as the power-board converters, on a much smaller current.",
    system:
      "During the servo bring-up the communication parts wanted their own power connection before the scan found the multiplexer. The meter checks I have written down are 12 V and 6 V. I have not logged this 3.3 V rail over time.",
  },
  {
    id: "teensy",
    title: "Teensy 4.1",
    sheet: "Top_schematics.SchDoc",
    standing: "checked",
    does: "The controller on this board. It talks to the peripherals, takes sensor inputs, commands the actuators, and drives the enable pins.",
    why: "Something has to turn a sensor reading and a command into a pulse, a bus message, or a pin. That is this chip. It is not the source of motor current.",
    principle:
      "One controller with a few buses scales further than a pin per actuator. The cost is that a successful message is not the same thing as a pin moving. The output-enable bug was that difference.",
    system:
      "Top_schematics.SchDoc is the sheet that connects this controller to the blocks below. The path I have shown is Wire2 to the multiplexer, and GPIO 6 to output enable. The full check sequence is in the bring-up below.",
    more: { href: "#debug-path", label: "The seven checks" },
  },
  {
    id: "mux",
    title: "I2C multiplexer",
    sheet: "I2C_mux.SchDoc",
    standing: "checked",
    does: "A TCA9548A splits one I2C port into eight downstream channels. The controller talks to one channel at a time.",
    why: "Servos, sensors, and a later board will collide if they all have to share one address on one bus. Eight channels let two parts keep the same address, and they leave branches for parts that are not installed yet.",
    principle:
      "The multiplexer is a switch, not a second controller. A command sent down the wrong channel looks exactly like a chip that is ignoring you. Selecting the channel is part of the message.",
    system:
      "The path I validated is the Teensy, the TCA9548A at 0x70, channel 7, and the PCA9685 at 0x40. I have not brought up a device on the other seven channels.",
  },
  {
    id: "isolation",
    title: "I2C isolation",
    sheet: "ISO1540",
    standing: "mixed",
    does: "The schematic uses ISO1540 bidirectional I2C isolators between communication domains.",
    why: "This robot has motors and switching regulators next to a microcontroller. A shared ground is a path for noise, and it is a path for a fault. Isolation lets the conversation cross without tying those grounds together.",
    principle:
      "I2C is not a one-way bus. SDA has to come back, because a device acknowledges and returns data. The clock can need a return too, when a device holds it to ask for more time. A one-way barrier deletes the reply, so a chip can look dead when the command arrived. During bring-up I compared that one-way case with a bidirectional isolator. I also looked at the Si8600 while I was on that question. I am not calling the Si8600 the installed part. The isolator does not limit motor current. That is still the power board.",
    system:
      "The register checks that passed are Teensy, multiplexer, PCA9685. I have not written a test that names the ISO1540 as the part that path crossed. The stepper sheet uses an ISO1540 as well, on its own link.",
  },
  {
    id: "servo",
    title: "Servo control",
    sheet: "Servo.SchDoc",
    standing: "checked",
    does: "A PCA9685 makes 16 channels of 12-bit PWM from I2C commands. The Teensy sends a width. The chip repeats the pulse.",
    why: "Bit-banging sixteen servo frames on the Teensy would spend the controller on timing. A pulse chip holds that timing so the Teensy can keep talking to everything else. The pulses still do nothing until the power board is feeding the servo.",
    principle:
      "The chip I reached is at 0x40, behind multiplexer channel 7, framed at about 50 Hz. Output enable is a separate pin, active low, on Teensy GPIO 6. The servo sheet also has an ADuM1201, a digital isolator for signals that are already one direction, and SS54 Schottky diodes in the protection around that circuitry. A Schottky gives a reverse or a flyback current somewhere to go that is not a driver pin. I have not traced which net the ADuM1201 or each diode sits on.",
    system:
      "This is the bring-up. The chip stored 0x55 and 0xAA, and it stored pulse widths, and the horn stayed still until firmware drove GPIO 6 low. One servo moved. That is not sixteen servos, and it is not an endurance run.",
    more: { href: "#signal-chain", label: "The chain and the enable pin" },
  },
  {
    id: "stepper",
    title: "Stepper interface",
    sheet: "Stepper.SchDoc",
    standing: "sheet",
    does: "A separate I2C link from the Teensy, through an ISO1540, out to more than one connector, with protection on the signals.",
    why: "The climber's steppers need commands. Those commands have to survive the same motors that make the bus noisy.",
    principle:
      "This sheet is a communication interface to external stepper electronics. It does not supply winding current. The current that moves a stepper comes from a driver off this board, fed from the power board. Isolation here is the same idea as the other I2C barrier: the message crosses, the grounds do not have to.",
    system:
      "The grip test was winding current feeding back into a control board. That current is not this connector. Treating this sheet as the motor supply would aim the protection at the wrong circuit.",
  },
  {
    id: "rs485",
    title: "RS-485",
    sheet: "RS485.SchDoc",
    standing: "sheet",
    does: "An isolated RS-485 port on a CA-IS3092W. The sheet includes termination, common-mode filtering, and transient protection.",
    why: "Some of the robot's electronics are not on this board, and the cable between them runs through a machine full of motors. A single-ended line gives that noise a wire straight into the receiver.",
    principle:
      "RS-485 is differential. The receiver uses the voltage between the pair, so a spike that hits both wires is mostly ignored. Termination damps the reflection on a long pair. Common-mode filtering and transient parts are there because the pair can still be pulled outside the range the transceiver wants. I have not measured that margin, and I am not quoting one.",
    system:
      "This is the long-haul command port on the logic board. It is a different bus from the I2C that runs the servo chip. I have not brought this link up in the note below.",
  },
  {
    id: "imu",
    title: "IMU",
    sheet: "IMU.SchDoc",
    standing: "open",
    does: "A BNO055 inertial sensor: orientation and motion, on the board instead of inferred from the commands.",
    why: "A climber that only plays open-loop commands does not know if the rope moved it, or if it is still where it thinks it is.",
    principle:
      "An IMU integrates acceleration and rotation into an orientation. It drifts, and it needs a quiet enough supply and a bus that can actually read it. The part being on the sheet is not a calibrated pose.",
    system:
      "This is one of the ways the logic board can observe the robot. I have not shown the BNO055 answering on SR-01.",
  },
  {
    id: "encoder",
    title: "Encoders",
    sheet: "Encoder.SchDoc",
    standing: "open",
    does: "Interfaces for rotational or positional feedback from a joint or a drum.",
    why: "A pulse sent to a servo is a request. An encoder is how you would know whether the joint did it.",
    principle:
      "A closed loop subtracts the measured position from the command. The connector makes that possible. I have not closed that loop, and I am not claiming the actuators are running closed-loop.",
    system:
      "The silkscreen on the bare logic board marks an encoder region. The bring-up below does not include an encoder reading.",
  },
  {
    id: "proximity",
    title: "Proximity sensors",
    sheet: "Proximity.SchDoc",
    standing: "open",
    does: "Interfaces for sensors that report a nearby object or a mechanical position. The circuitry includes a 12 V sensor supply and LTV-8141 optocouplers.",
    why: "A grip, a stop, or a branch is a physical fact. The controller should be able to read it instead of assuming the command finished.",
    principle:
      "A 12 V sensor cannot drive a 3.3 V pin. The LTV-8141 is an optocoupler, so the sensor side can switch the logic side with light instead of a shared electrical connection. The 12 V for those sensors still comes from the power board.",
    system:
      "The populated board and the bare board both show a Proximity Sensors label. I have not brought those channels up.",
  },
  {
    id: "status",
    title: "Buzzer, LEDs, test points",
    sheet: "Buzzer.SchDoc, LED.SchDoc",
    standing: "sheet",
    does: "A MOSFET-driven buzzer, LED status outputs, logic-level translation, and test points on the sheets.",
    why: "Bring-up is mostly 'which net is dead.' A test point and a status LED answer that without lifting a chip. A buzzer that the pin drives directly just loads the pin.",
    principle:
      "The MOSFET lets the Teensy switch the buzzer current instead of sourcing it. Level translation is there because a 5 V or 12 V signal and a 3.3 V pin are not the same voltage. A test point is a place the layout decided you should be able to reach with a probe.",
    system:
      "I used a meter and a scope on the servo path. I am not claiming I used the buzzer or the LEDs in that debug. The bare board's silkscreen does mark a buzzer.",
  },
];

const TRADEOFFS: Array<{ title: string; body: string }> = [
  {
    title: "Two boards",
    body: "High current stays on the power board. The Teensy, the sensors, and the buses stay on the logic board. A fault in a motor branch then has a fuse and a rail between it and the controller. I can bring up a bus without the actuator supply on, and I can replace one board without relaying out the other. The cost is a connector between them, and a ground scheme that has to be chosen on purpose. The grip test is the case where that separation was not enough. The control board from that test is still not replaced in a note.",
  },
  {
    title: "Four-layer planes",
    body: "These boards are four-layer, so a ground plane and a power plane exist under the signals. Return current can spread in the plane instead of traveling a long trace beside the bus. That is the reason for the stackup. I have not measured the plane impedance, and I am not claiming an emissions number from it.",
  },
  {
    title: "Switcher noise",
    body: "Every module on these boards still switches. The loop from the switch node to its input capacitor wants to be short, and it wants to be away from SDA, SCL, and the analog sense lines. Placement is the control I actually have. I have not run an emissions test.",
  },
  {
    title: "Decoupling and filtering",
    body: "Bulk capacitors hold a rail up when a load steps. Smaller capacitors next to a chip cover the fast edges the bulk part is too far away to see. The sheets put both around the converters. A capacitor value on a schematic is not a measurement of ripple.",
  },
  {
    title: "Transients and reverse current",
    body: "A motor that stalls, or a linkage that breaks, can push current backward. Fuses, the Schottky parts, and the isolated domains are the places that current is supposed to stop. A fuse is slow relative to a spike, and isolation does not clamp winding current. I have not characterized that transient.",
  },
  {
    title: "Where parts sit",
    body: "Connectors go to the edge so a harness can leave the board. Test points go on nets I have to probe during bring-up. On the V2 photos, the modules sit off the Teensy. I am not pinning the current sensor or the isolators, because I cannot pick those chips out of the pictures.",
  },
];

const VIEWS: BoardView[] = [
  {
    id: "power",
    label: "V2 power",
    src: "/projects/logic-pcb/power-modules.jpg",
    alt: "V2 power board with an XT60, two ATAZ converter modules, a shielded module, blade fuses, and green terminal blocks",
    caption:
      "V2 power board, the revision I tested. Boxes sit on the XT60, the fuse holders, the two modules whose labels I can read, the shielded converter, and the output terminals.",
    regions: [
      {
        id: "xt60",
        title: "Battery input",
        x: 31,
        y: 69,
        w: 11,
        h: 10,
        where: "The yellow XT60, low on the left of the board. That is the pack connector on Battery_Input. I am not reading a pack voltage off it.",
      },
      {
        id: "fuses",
        title: "Fuses",
        x: 58,
        y: 76,
        w: 16,
        h: 8,
        where: "Blade fuse holders along the bottom edge of the V2 board. This photo shows markings of 30. The V1 power board shows 15 and 5. I have not mapped either set to a branch.",
      },
      {
        id: "modules",
        title: "12 V and 5 V modules",
        x: 22,
        y: 33,
        w: 30,
        h: 16,
        where: "Two ATAZ UMD40 modules. The labels say 12 V and 5 V out. These are the marked converters in the photo. The sheets also name TDK10-series modules and a KUB-series module for V_SERVO. I am not merging those names onto these labels.",
      },
      {
        id: "shield",
        title: "Shielded converter",
        x: 56,
        y: 29,
        w: 20,
        h: 22,
        where: "The large shielded block beside the UMD40 modules. I cannot read a KUB part number on the shield, so it stays an unnamed converter in this photo.",
      },
      {
        id: "terminals",
        title: "Output connectors",
        x: 81,
        y: 33,
        w: 11,
        h: 40,
        where: "Green terminal blocks down the right edge, and more along the top. These are the power leaves. I have not assigned each one to a load.",
      },
    ],
  },
  {
    id: "logic-pop",
    label: "V2 logic",
    src: "/projects/logic-pcb/logic-populated.jpg",
    alt: "V2 logic board on a blue mat, with a Teensy 4.1, a TDK10 module, and white connectors",
    caption:
      "V2 logic board, the one from the servo bring-up. Boxes sit on the Teensy, the TDK10 module, the proximity label, the white connectors, and the screw terminals. I cannot see the multiplexer or the pulse chip clearly enough to box them.",
    regions: [
      {
        id: "tdk",
        title: "3.3 V module",
        x: 35,
        y: 12,
        w: 18,
        h: 13,
        where: "The black TDK10-12S3V3 at the top of the board. The label is a 12 V to 3.3 V module. That is the logic supply, not the power board's 12 V output.",
      },
      {
        id: "logic-in",
        title: "Power into the logic board",
        x: 51,
        y: 14,
        w: 9,
        h: 9,
        where: "Green screw terminals beside the module. This is where a rail from the power board lands. I have not labeled each terminal from this photo.",
      },
      {
        id: "prox",
        title: "Proximity connectors",
        x: 31,
        y: 42,
        w: 11,
        h: 16,
        where: "The left edge is silkscreened Proximity Sensors, next to a row of white connectors. The LTV-8141 interfaces are the schematic for this region. I have not brought the channels up.",
      },
      {
        id: "headers",
        title: "Other connectors",
        x: 56,
        y: 34,
        w: 10,
        h: 18,
        where: "White connectors down the right side. Sensor and actuator harnesses leave through connectors like these. This photo does not tell me which row is the servo and which is the stepper.",
      },
      {
        id: "teensy",
        title: "Teensy 4.1",
        x: 41,
        y: 52,
        w: 16,
        h: 18,
        where: "The Teensy module in the lower middle of the V2 board, USB at its bottom edge. This is the controller I ran the servo bring-up on.",
      },
    ],
  },
  {
    id: "logic-silk",
    label: "V1",
    src: "/projects/logic-pcb/both-boards.jpg",
    alt: "V1 logic board above a V1 power board, on notebook paper, with silkscreen labels for RS-485, I2C, encoder, buzzer, and proximity",
    caption:
      "V1 of both boards, on an ESE 2150 homework page. The handwriting is homework. I did not bring this pair up. The boxes are silkscreen words on the V1 logic board. The power board here is the one with fuses marked 15 and 5.",
    regions: [
      {
        id: "rs485",
        title: "RS-485",
        x: 5,
        y: 29,
        w: 12,
        h: 9,
        where: "The RS-485 silkscreen on the V1 logic board. I have not brought that link up on V2.",
      },
      {
        id: "i2c",
        title: "I2C",
        x: 18,
        y: 28,
        w: 12,
        h: 8,
        where: "The I2C silkscreen on V1. The path I actually ran, Teensy to TCA9548A to PCA9685, was on V2. This photo does not show which connector that path used.",
      },
      {
        id: "encoder",
        title: "Encoder",
        x: 28,
        y: 13,
        w: 16,
        h: 9,
        where: "The encoder silkscreen on V1. Feedback for a joint, not a closed loop I have run on V2.",
      },
      {
        id: "buzzer",
        title: "Buzzer",
        x: 36,
        y: 22,
        w: 14,
        h: 9,
        where: "The buzzer silkscreen on V1. I did not use a buzzer in the V2 servo debug.",
      },
      {
        id: "prox-silk",
        title: "Proximity",
        x: 52,
        y: 30,
        w: 16,
        h: 8,
        where: "The Proximity Sensors silkscreen on V1. V2 has the same label, photographed from another side. I have not brought those channels up.",
      },
    ],
  },
];

const FLOW_POWER = [
  { title: "24 V pack", detail: "XT60 into the power board" },
  { title: "Fused branches", detail: "24 V distribution, and a feed for the regulators" },
  { title: "Regulated rails", detail: "Isolated 12 V, 5 V, and V_SERVO" },
  { title: "Loads", detail: "Actuators, 12 V sensors, and the logic board" },
];

const FLOW_INFO = [
  { title: "Sensors", detail: "IMU, encoders, proximity" },
  { title: "Teensy 4.1", detail: "Reads, decides, enables" },
  { title: "Buses", detail: "I2C mux, RS-485, stepper link" },
  { title: "Commands", detail: "Pulses and messages, not winding current" },
];

function StandingChip({ standing }: { standing: Standing }) {
  const on = standing === "checked" || standing === "mixed";
  return (
    <span
      className={[
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        on ? "bg-orange-100 text-orange-950" : "bg-zinc-100 text-zinc-600",
      ].join(" ")}
    >
      {STANDING[standing]}
    </span>
  );
}

function Flow({
  title,
  steps,
  tone,
}: {
  title: string;
  steps: Array<{ title: string; detail: string }>;
  tone: "power" | "info";
}) {
  const card =
    tone === "power"
      ? "border-amber-300 bg-amber-50/80"
      : "border-zinc-300 bg-white";
  return (
    <figure>
      <figcaption className="text-sm font-semibold text-zinc-950">{title}</figcaption>
      <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-stretch">
        {steps.map((step, index) => (
          <li key={step.title} className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-stretch">
            <div className={`min-w-0 flex-1 rounded-xl border px-3 py-3 ${card}`}>
              <p className="text-sm font-semibold text-zinc-950">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-700">{step.detail}</p>
            </div>
            {index < steps.length - 1 ? (
              <span aria-hidden className="self-center px-0.5 font-medium text-amber-800">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}

function BlockButton({
  block,
  pressed,
  onSelect,
}: {
  block: Block;
  pressed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={[
        "w-full rounded-xl border px-3 py-3 text-left transition-colors",
        pressed
          ? "border-orange-300 bg-orange-50"
          : "border-zinc-200 bg-white hover:border-orange-200",
      ].join(" ")}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-zinc-950">{block.title}</span>
        <StandingChip standing={block.standing} />
      </span>
      <span className="mt-1 block font-mono text-[11px] text-zinc-500">{block.sheet}</span>
    </button>
  );
}

function BlockDetail({ block }: { block: Block }) {
  const fields = [
    ["What it does", block.does],
    ["Why the robot needs it", block.why],
    ["The electrical idea", block.principle],
    ["Where it sits", block.system],
  ];
  return (
    <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-lg font-semibold text-zinc-950">{block.title}</h4>
        <StandingChip standing={block.standing} />
      </div>
      <p className="mt-1 font-mono text-[11px] text-zinc-500">{block.sheet}</p>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {fields.map(([label, text]) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{label}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-zinc-800">{text}</dd>
          </div>
        ))}
      </dl>
      {block.more ? (
        <a
          href={block.more.href}
          className="mt-4 inline-flex text-sm font-semibold text-amber-900 underline decoration-amber-300 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          {block.more.label}
        </a>
      ) : null}
    </div>
  );
}

function BlockPicker({
  blocks,
  active,
  onSelect,
  label,
}: {
  blocks: Block[];
  active: string | null;
  onSelect: (id: string) => void;
  label: string;
}) {
  const selected = blocks.find((block) => block.id === active);
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[18rem_1fr] lg:items-start">
      <div role="group" aria-label={label} className="grid gap-2">
        {blocks.map((block) => (
          <BlockButton
            key={block.id}
            block={block}
            pressed={block.id === active}
            onSelect={() => onSelect(block.id)}
          />
        ))}
      </div>
      {selected ? (
        <BlockDetail block={selected} />
      ) : (
        <p className="rounded-[1.25rem] border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm leading-relaxed text-zinc-600">
          Pick a block. The short list is the whole board. The four notes are that one circuit.
        </p>
      )}
    </div>
  );
}

function BoardMap() {
  const [viewId, setViewId] = useState(VIEWS[0].id);
  const [regionId, setRegionId] = useState<string | null>(VIEWS[0].regions[0].id);
  const view = VIEWS.find((item) => item.id === viewId) ?? VIEWS[0];
  const region = view.regions.find((item) => item.id === regionId) ?? null;

  function selectView(id: string) {
    const next = VIEWS.find((item) => item.id === id) ?? VIEWS[0];
    setViewId(next.id);
    setRegionId(next.regions[0]?.id ?? null);
  }

  return (
    <div className="mt-6">
      <div role="tablist" aria-label="Board photos" className="flex flex-wrap gap-2">
        {VIEWS.map((item) => {
          const selected = item.id === view.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectView(item.id)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
                selected
                  ? "border-orange-300 bg-orange-50 text-orange-950"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_18rem] lg:items-start">
        <figure>
          <div className="relative">
            {/* Plain img so the boxes are percentages of the photograph, not of a cropped frame. */}
            <img src={view.src} alt={view.alt} className="h-auto w-full rounded-[1.25rem]" />
            {view.regions.map((item) => {
              const selected = item.id === region?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.title}
                  aria-pressed={selected}
                  onClick={() => setRegionId(item.id)}
                  onMouseEnter={() => setRegionId(item.id)}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.h}%` }}
                  className={[
                    "absolute rounded-md border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700",
                    selected
                      ? "border-orange-500 bg-orange-400/35"
                      : "border-white/80 bg-zinc-950/15 hover:bg-orange-300/30",
                  ].join(" ")}
                />
              );
            })}
          </div>
          <figcaption className="mt-2 text-sm leading-relaxed text-zinc-600">{view.caption}</figcaption>
        </figure>
        <div className="grid gap-2">
          {view.regions.map((item) => {
            const selected = item.id === region?.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setRegionId(item.id)}
                className={[
                  "rounded-xl border px-3 py-3 text-left text-sm font-semibold",
                  selected
                    ? "border-orange-300 bg-orange-50 text-zinc-950"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-orange-200",
                ].join(" ")}
              >
                {item.title}
              </button>
            );
          })}
          {region ? (
            <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm leading-relaxed text-zinc-700">
              {region.where}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function BoardArchitecture() {
  const [powerId, setPowerId] = useState<string | null>("monitor");
  const [logicId, setLogicId] = useState<string | null>(null);

  return (
    <div className="space-y-12 md:space-y-14">
      <section id="board-architecture" className="scroll-mt-36">
        <SectionLabel>The two boards</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          One board feeds the robot. The other tells it what to do.
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          SR-01 climbs a rope and cuts a branch. The actuators need current at more than one voltage. The controller needs a clean conversation with sensors and with the chips that make pulses. Those are different electrical jobs, so they are different boards.
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          The pair on the homework sheet is V1. The boards went through more than one revision after that. The meter checks and the servo bring-up were on V2. The Altium project is in a .rar, and I am not redrawing that schematic here.
        </p>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-amber-300 bg-amber-50/70 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">Power PCB</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
              Power distribution, regulation, and electrical protection
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-800">
              Takes the pack and hands it out as branches that are not the same voltage and not the same current. Fuses sit on those branches. Converters make the rails the rest of the robot can actually use. Sensing is on this board so the distribution can be watched, not only switched.
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-zinc-300 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Logic PCB</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
              Embedded control, sensor integration, and actuator interfaces
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-800">
              The Teensy coordinates the peripherals. Sensors come in. Commands go out as pulses, bus messages, and enable pins. Those commands are not motor current. The current still comes from the power board.
            </p>
          </article>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["In the design", "The blocks below are how the two boards are divided. They are not a schematic export from the .rar."],
            ["What I changed", "Fused paths in the 5–20 A range, DC-DC, and RS-485 and I2C, as one set of modifications on the boards I had. I did not design the chassis."],
            ["What I have shown", "On V2: Teensy to the mux at 0x70, channel 7, PCA9685 at 0x40. Register readback, 50 Hz widths stored, GPIO 6 driven low, one servo moved. 12 V and 6 V on a meter."],
            ["Still open", "CURRENT_S and VOLTAGE_S are not logged. The sensors are not brought up. Fuse markings are not mapped to branches. No emissions number. The grip-test board is not replaced."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-[1.25rem] border border-zinc-200 bg-white p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-zinc-200 bg-[#faf8f5] p-4 md:p-6">
          <Flow title="Power flow" steps={FLOW_POWER} tone="power" />
          <div className="mt-6">
            <Flow title="Information flow" steps={FLOW_INFO} tone="info" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">
            The top row is energy. The bottom row is information. They meet at an actuator, and they are not the same wire. A valid command with a dead rail sits still. A healthy rail with output enable held off sits still too.
          </p>
        </div>
      </section>

      <section id="power-board" className="scroll-mt-36">
        <SectionLabel>Power PCB</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          From a 24 V pack to rails the robot can use
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          The sensing block is the one to open if you only open one. Those parts are in the design. I have not validated the readings on V2, and I have not unpacked the Altium .rar.
        </p>
        <BlockPicker blocks={POWER} active={powerId} onSelect={setPowerId} label="Power board blocks" />
      </section>

      <section id="logic-board" className="scroll-mt-36">
        <SectionLabel>Logic PCB</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Commands, sensors, and the pins that let them out
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          The servo block is the path I ran on V2. The sensor blocks are interfaces in the design, not measurements I have taken.
        </p>
        <BlockPicker blocks={LOGIC} active={logicId} onSelect={setLogicId} label="Logic board blocks" />
      </section>

      <section id="architecture-tradeoffs" className="scroll-mt-36">
        <SectionLabel>Why it is built this way</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          What the split is buying, and what it is not
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TRADEOFFS.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="board-map" className="scroll-mt-36">
        <SectionLabel>On the boards</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Only the regions I can see
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-700">
          The first two photos are V2, which is what I tested. The third is V1. Hover or select a box. I am not drawing a part onto a photo where I cannot see it, and I am not drawing a schematic from the .rar.
        </p>
        <BoardMap />
      </section>
    </div>
  );
}
