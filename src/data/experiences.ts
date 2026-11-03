export type ExperienceTrack = "industry" | "club";

export type ExperienceKind =
  | "internship"
  | "leadership"
  | "role";

/** Percentages, 0–100. 50, 50 is the center of the crop. */
export type FocalPoint = { x: number; y: number };

export type ExperienceMedia =
  | { kind: "image"; src: string; alt: string;       caption?: string;
      focal?: FocalPoint;
      fit?: "cover" | "contain";
    }
  | {
      kind: "video";
      src: string;
      alt: string;
      poster?: string;
      caption?: string;
      focal?: FocalPoint;
      fit?: "cover" | "contain";
    };

/** A sentence fragment. Project slugs become links to the shared project record. */
export type TextRun =
  | string
  | { projectSlug: string }
  | { href: string; label: string };

/**
 * One piece of the role. On desktop the text sits left and a project card
 * or captioned figure sits right. Omit both when the section is text only.
 */
export type ExperienceWork = {
  title: string;
  body: TextRun[];
  projectSlug?: string;
  media?: ExperienceMedia;
};

export type ExperienceExample = {
  title: string;
  problem: string;
  approach: TextRun[];
  outcome: TextRun[];
  /** Shown beside this example and omitted from the page gallery. */
  media?: ExperienceMedia;
};

/** One engineering story, longer than a workstream blurb. */
export type ExperienceDeepDive = {
  title: string;
  paragraphs: TextRun[][];
  media?: ExperienceMedia;
};

export type Experience = {
  slug: string;
  org: string;
  /** Short name for headings, e.g. "About Serpent". */
  shortName?: string;
  role: string;
  kind: ExperienceKind;
  /** Internships/orgs vs school clubs — used by the list filter */
  track: ExperienceTrack;
  /** Display range, e.g. "Summer 2026" */
  dates: string;
  location?: string;
  /** ~2 second skim under the role title */
  oneLiner: string;
  /** 60–90 word executive overview */
  overview: string;
  /** Concrete ownership / outcomes for the exec block */
  highlights: string[];
  /** Skimmable focus tags */
  focus?: string[];
  /** Card image. Also the page hero unless `hero` is set. Omit when no photo exists. */
  cover?: ExperienceMedia;
  /** Page banner when it should differ from the card. Falls back to `cover`. */
  hero?: ExperienceMedia;
  /** Proof gallery on the detail page — prefer /experiences/<org>/… */
  gallery?: ExperienceMedia[];
  /** Optional related portfolio work */
  relatedProjects?: Array<{ label: string; href: string }>;
  /** Optional external org link */
  externalHref?: string;
  /** Which noun the header button uses. Omitted when there is no verified URL. */
  websiteKind?: "company" | "lab" | "organization";
  /** What the organization is. Not a description of my job. Shown in the opening. */
  about?: TextRun[];
  /** Equipment and techniques actually used. Omit models that are only in a photo. */
  tools?: string[];
  /**
   * My work, as short subsections. When set, these replace roleParagraphs
   * and roleBullets, and any projectSlug here is not repeated in a later grid.
   */
  work?: ExperienceWork[];
  /** Short paragraphs under My role. */
  roleParagraphs?: TextRun[][];
  /** Focused bullets under those paragraphs. */
  roleBullets?: TextRun[][];
  /** Two or three concrete episodes, only when the source material supports them. */
  examples?: ExperienceExample[];
  /** One longer debugging or design story. */
  deepDive?: ExperienceDeepDive;
};

export const EXPERIENCE_KIND_LABELS: Record<ExperienceKind, string> = {
  internship: "Internship",
  leadership: "Leadership",
  role: "Role",
};

export const EXPERIENCE_TRACK_LABELS: Record<ExperienceTrack, string> = {
  industry: "Internships",
  club: "School clubs",
};

/**
 * Official roles + school clubs.
 * Newest first. Detail lives at /experiences/[slug].
 * Media: web-safe files under public/experiences/<folder>/.
 */
export const EXPERIENCES: Experience[] = [
  {
    slug: "serpent-robotics",
    org: "Serpent Robotics",
    shortName: "Serpent",
    role: "Robotics & Controls Intern",
    kind: "internship",
    track: "industry",
    dates: "Sep. 2026 – Present",
    location: "Philadelphia, PA",
    oneLiner:
      "Teleoperated rope-climbing robots for tree work. I work on the logic and power boards, and on the leader-follower bench.",
    overview:
      "Serpent builds teleoperated rope-climbing robots for tree work. My pieces are the power and logic boards, and the leader-follower bench. I have not designed the SR-01 chassis.",
    highlights: [
      "Power and logic boards: I modified them as one set, 5–20 A fusing, DC-DC, and RS-485 and I2C. Bring-up so far is the 12 V and 6 V rails on a multimeter. A grip test later fried the control board. That replacement is not in a bring-up note.",
      "I have not split the fuses, the DC-DC stage, or the buses onto one board. The photos show both boards. They don't assign each part.",
      "I wrote the leader-follower bridge. The bench pair is a blue leader and a white follower, not mounted on SR-01. A fixed follower IP worked on shop Wi-Fi and broke on the next hotspot.",
    ],
    focus: ["SR-01", "SR-02", "Power and logic PCBs", "Leader-follower"],
    externalHref: "https://serpentrobotics.com/",
    websiteKind: "company",
    cover: {
      kind: "image",
      src: "/experiences/serpent/sr01-chassis.jpg",
      alt: "SR-01 aluminum chassis on a workbench, with belts, gears, and an orange beam",
      focal: { x: 52, y: 38 },
      caption: "SR-01 chassis: aluminum linkage, belts, gears, and the orange beam.",
    },
    about: [
      "Serpent Robotics builds rope-climbing robots for tree care. SR-01 is a ground-controlled robot that cuts, holds, and lowers a branch so the arborist can stay on the ground. The company is a 2026 President's Innovation Prize project at Penn. The site is ",
      { href: "https://serpentrobotics.com/", label: "serpentrobotics.com" },
      ".",
    ],
    work: [
      {
        title: "Logic and power boards",
        body: [
          "SR-01 has to switch actuator current without taking the control board with it. I modified the two boards as one set: 5–20 A fused paths, DC-DC regulation, and RS-485 and I2C. The logic board is the connector side, marked for stepper, encoder, RS-485, 12 V, 5 V, and ground. The power board is the XT60, the terminal blocks, and the blade fuses. In that photo the readable fuse markings are 15 and 5. I haven't assigned either fuse, the DC-DC stage, or either bus to only one board. Bring-up so far is the 12 V and 6 V rails, checked with a multimeter. A grip test later broke a printed link while it was grabbing a branch. Stepper current fed back, signals lagged by about 5 seconds, the saw went past a full turn, a Hall-sensor wire came out, and the control board and half the actuators were fried. The brushed-to-BLDC saw change that was supposed to draw less current is not finished, and I don't have a photo of a replacement board. The write-up is ",
          { projectSlug: "logic-pcb" },
          ".",
        ],
        projectSlug: "logic-pcb",
        media: {
          kind: "image",
          src: "/experiences/serpent/power-board.jpg",
          alt: "Power board held on a clear plate, with a yellow XT60 and blade fuses",
          caption: "Power board. XT60, terminal blocks, and fuses marked 15 and 5.",
          fit: "contain",
        },
      },
      {
        title: "Leader-follower arms",
        body: [
          "The reason for the pair is a cut with the operator still on the ground. A small leader stays down here. The follower is meant to sit up on the climbing robot. I wrote the bridge that sends the leader's joint angles to six STS3215 servos on the follower. LeRobot is what that bridge runs on. On the bench the leader is blue and the follower is white, and they are not on SR-01 yet. Shop Wi-Fi used a fixed follower address. An iPhone hotspot and then a Razr hotspot each gave Pi 2 a new one, so the sender looks serpentpi-follower.local up every 15 seconds. A 300 ms silence holds, and a step is limited to 15°. When the follower sat still, a multimeter showed the motor pack was dead. After it was replaced, the board read 12 V, and I checked each motor connection for a voltage drop. The motion that runs still jitters, and the servos' reported 4.8 to 5.0 V is not a meter reading at the plug. The write-up is ",
          { projectSlug: "leader-follower-robotic-arm" },
          ".",
        ],
        projectSlug: "leader-follower-robotic-arm",
        media: {
          kind: "image",
          src: "/projects/leader-follower-robotic-arm/bench.jpg",
          alt: "Blue leader arm and white follower arm on a shop bench",
          caption: "Blue leader, white follower. Not the SR-01 chassis.",
        },
      },
    ],
    deepDive: {
      title: "The follower looked broken. The battery was empty.",
      paragraphs: [
        [
          "The follower sat still while the leader moved. That can be a dead serial port, a process that already holds the port, a wrong address, or no voltage at the motors. I started with the supply. The Pi and the motors were on one battery, and a multimeter showed that battery was dead. They were competing for current the pack could no longer hold.",
        ],
        [
          "A sender that is logging on time still doesn't prove the follower received the packet. After the battery, the open problem is jitter in the follower motion, and a servo voltage reading around 5 V that I have not confirmed with the meter. I have not power-cycled the pair.",
        ],
      ],
    },
  },
  {
    slug: "grasp-laboratory",
    org: "GRASP Laboratory",
    shortName: "GRASP",
    role: "Robotics, Sensing, & Controls Research Intern",
    kind: "internship",
    track: "industry",
    dates: "August 2026 – Present",
    location: "Philadelphia, PA · ModLab & AddLab",
    oneLiner:
      "AddLab printer toolhead: a rotating nozzle, an encoder on the shaft, and the sketch split out of one file.",
    overview:
      "Research intern in GRASP, across ModLab and AddLab. On the AddLab printer I'm reassembling the rotating toolhead and closing the nozzle axis with an encoder, because a step command is not a measured angle.",
    highlights: [
      "AddLab printer: reassemble the Aerotech toolhead and split the Arduino sketch into stepper, encoder, and PID files.",
      "Nozzle axis: a 5:1 geared NEMA 17, an A4988, an AS5600, and an Arduino Uno on a 24 V motor supply.",
      "ModLab imager: a TSL1401 line sensor on an nRF54L15. Lines come off the bench. The rotation is still ahead.",
    ],
    focus: ["AddLab", "Nozzle rotation", "AS5600", "UAV imaging"],
    externalHref: "https://www.grasp.upenn.edu/",
    websiteKind: "lab",
    cover: {
      kind: "image",
      src: "/experiences/grasp-laboratory/cover.jpg",
      alt: "Blue motor housing marked 5, 3, and 1 on a white printed bracket, with an Aerotech column behind it",
      caption:
        "AddLab printer toolhead. The blue housing is marked 5, 3, and 1. A gray motor sits above it. Another frame of this column reads Aerotech PRO115SL.",
      focal: { x: 48, y: 58 },
    },
    about: [
      "The General Robotics, Automation, Sensing and Perception Laboratory is Penn's robotics lab. ",
      { href: "https://www.grasp.upenn.edu/research-groups/modlab/", label: "ModLab" },
      " is one of its groups, in Mechanical Engineering and Applied Mechanics, directed by Mark Yim. It works on modular robots, and also on small aerial vehicles and other electromechanical systems. ",
      { href: "https://meamlabs.engineering.upenn.edu/addlab/", label: "AddLab" },
      " is a different room: the department's Additive Manufacturing Laboratory in Towne 187. It runs the experimental and high-performance printers, mainly stereolithography and fused deposition, for courses, research, and outside groups.",
    ],
    work: [
      {
        title: "The printer nozzle",
        body: [
          "On the AddLab Aerotech I am reassembling the rotating toolhead and pulling the Arduino sketch out of one file. The nozzle motor in the notes is a 5:1 geared NEMA 17. The gearbox is there so it can turn more slowly with more torque, and friction in the rotating assembly can still stall it, jerk it, or make it miss steps. An A4988 takes STEP on D3 and DIR on D2 from an Uno, on a 24 V motor supply. The newer drawing adds the command. A potentiometer on A0 tells the Uno, from the wiper voltage, how far to drive that motor. An AS5600 reads the shaft over I2C, because a pulse the Arduino sent is not a measured angle, and that reading is what the LCD is supposed to show. The blue encoder wire is on A4 and the yellow wire is on A5, and those colors still need a pinout check. The sheet also has a mode button and a go button. I split the sketch into stepper, encoder, and PID files so the error can be the goal minus that reading. The backlight comes on and the screen isn't showing degrees. In one clip the tube carousel ends in a different position than it started, and I didn't record the angle. The blue housing is marked 5, 3, and 1. I don't know what those marks mean, or which part in the photo is the NEMA 17. The drawing, the clip, and the file split are on the ",
          { projectSlug: "multimodal-3d-printer" },
          ".",
        ],
        projectSlug: "multimodal-3d-printer",
        media: {
          kind: "video",
          src: "/projects/multimodal-3d-printer/carousel.mp4",
          poster: "/projects/multimodal-3d-printer/carousel-poster.jpg",
          alt: "Tube carousel under the blue motor housing",
          caption: "The carousel moves in this clip. No angle was recorded.",
        },
      },
      {
        title: "The imager",
        body: [
          "The other system is a line imager for a UAV, in ModLab. A TSL1401 reads 128 pixels at a time on an nRF54L15. I'm integrating that sensor on Zephyr. The ADC and GPIOs bring the samples in. The team has a live view and a timing fix for 120 Hz room light. The lines are not paired with an angle yet, so it is not a 360° image. Notes and the bench photo are on the ",
          { projectSlug: "3d-imaging-uav" },
          ".",
        ],
        projectSlug: "3d-imaging-uav",
        media: {
          kind: "image",
          src: "/projects/3d-imaging-uav/setup.jpg",
          alt: "nRF board and J-Link on the bench for the TSL1401 imager",
          caption: "Bench bring-up. Not the rotating mount.",
          fit: "contain",
        },
      },
    ],
    deepDive: {
      title: "Steps are not the shaft angle",
      paragraphs: [
        [
          "The nozzle has to turn at a set speed while the rotating assembly fights back. A 5:1 gearbox is there so a NEMA 17 can do that more slowly, with more torque. Friction can still stall the motor, jerk it, or make it miss steps. If the Arduino only counts the pulses it sent, it will believe the nozzle moved.",
        ],
        [
          "I put an AS5600 on the shaft and drew the rest of the axis: an Uno, a potentiometer on A0, an LCD, an A4988, 24 V on the motor supply, STEP on D3, DIR on D2, and the encoder on the I2C pins. The wiper voltage is how far to drive the motor. The sketch is split into stepper, encoder, and PID files so that reading can be compared with the goal, and the LCD is supposed to show the encoder angle rather than the pot voltage. It isn't showing degrees yet. Current limit, microstepping, and acceleration are still open.",
        ],
      ],
      media: {
        kind: "image",
        src: "/projects/multimodal-3d-printer/control-schematic.jpg",
        alt: "Wiring drawing of an Arduino Uno with a potentiometer, two buttons, an LCD, an A4988, a 24 volt supply, and a magnetic encoder",
        caption:
          "Potentiometer on A0, LCD for the encoder angle, A4988 on 24 V, encoder on A4 and A5.",
        fit: "contain",
      },
    },
  },
  {
    slug: "brainchild-engineering",
    org: "BrainChild Engineering",
    shortName: "BrainChild",
    role: "Hardware Engineering Intern",
    kind: "internship",
    track: "industry",
    dates: "May 2026 – Aug. 2026",
    location: "Novi, MI",
    oneLiner:
      "I built client hardware at BrainChild: the Vend-A-Shoe enclosure and power path, and a tennis-ball launcher with an ESP32, flywheels, and a stepper feed.",
    overview:
      "At BrainChild I built hardware that clients used. The work sat across the enclosure, the power rails, the embedded control, and the path from a cloud command to an actuator.",
    highlights: [
      "Vend-A-Shoe: a web command queue, a Raspberry Pi worker, and servo actuation in a packaged client unit.",
      "Built a tennis-ball launcher prototype on ESP32 with dual RS-775 flywheels, NEMA 17 feed, and PWM-switched MOSFET drive.",
      "On the launcher, a PWM test oversped a motor. The fuse did not open, a solder joint came off, and a wire melted.",
    ],
    focus: [
      "Electromechanical",
      "Embedded",
      "Power distribution",
      "Client delivery",
      "Raspberry Pi",
      "ESP32",
    ],
    cover: {
      kind: "image",
      src: "/experiences/brainchild/IMG_7410.jpeg",
      alt: "BrainChild Engineering team in the workshop",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/brainchild/IMG_7417.jpeg",
        alt: "BrainChild Engineering internship team",
        caption: "The internship team in the Novi shop. This is the group, not one of the machines.",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/unit.jpg",
        alt: "Assembled client hardware unit",
        caption: "Assembled unit off the breadboard",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/wall-power.jpg",
        alt: "Wall AC to DC power path",
        caption: "Wall AC to DC for the client hardware, the supply side of Vend-A-Shoe.",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/protoboard.jpg",
        alt: "Soldered protoboard",
        caption: "Soldered distribution board for the Vend-A-Shoe actuators.",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/raspberry-pi.jpg",
        alt: "Raspberry Pi control setup",
        caption: "Raspberry Pi that polled the Vend-A-Shoe command queue.",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/tennis-chassis.jpg",
        alt: "Tennis ball shooter chassis",
        caption: "Chassis for the tennis-ball launcher prototype.",
      },
      {
        kind: "image",
        src: "/experiences/brainchild/tennis-circuit.jpg",
        alt: "Launcher circuit and chassis",
        caption: "ESP32 launcher power and drive electronics",
      },
    ],
    relatedProjects: [
      { label: "Vend-A-Shoe", href: "/projects/vend-a-shoe" },
      { label: "Tennis Ball Shooter", href: "/projects/tennis-ball-shooter" },
    ],
    externalHref: "https://brainchildengineering.com/",
    websiteKind: "company",
    about: [
      "BrainChild Engineering is a hardware firm in Novi, Michigan. Since 2016 it has designed prototypes for outside clients, across mechanical design, electrical design, and the integration between them, with an in-house prototyping shop. That client business is the company's.",
    ],
    roleParagraphs: [
      [
        "I was a hardware engineering intern from May 2026 through August 2026. The internship is finished. The job was client hardware that had to work outside the shop: an enclosure, a power path, embedded control, and, on one machine, a command that started in a web app.",
      ],
      [
        "The client unit is ",
        { projectSlug: "vend-a-shoe" },
        ". A web command landed in a queue, a Raspberry Pi worker picked it up, and servos dispensed the shoe on a packaged unit. The other build is the ",
        { projectSlug: "tennis-ball-shooter" },
        ", a prototype launcher: ESP32 control, dual RS-775 flywheels, a NEMA 17 feed, and MOSFET drive under PWM.",
      ],
      [
        "When something failed, the cause was often the rail, the fit, or the software state, not the subsystem I happened to be staring at.",
      ],
    ],
    roleBullets: [
      [
        "Shipped: ",
        { projectSlug: "vend-a-shoe" },
        ", web command to a Pi worker to servo actuation on a client unit.",
      ],
      [
        "Prototype: ",
        { projectSlug: "tennis-ball-shooter" },
        ", ESP32, dual RS-775 flywheels, NEMA 17 feed, PWM-switched MOSFETs.",
      ],
      ["Debugging crossed power, mechanical fit, and software state."],
    ],
    examples: [
      {
        title: "A web command had to become a dispense",
        problem:
          "The shoe vending machine had to run as a client unit. A request from the web app had to become motion, not a breadboard demo.",
        approach: [
          "I built the path from the web command queue to a Raspberry Pi worker to the servos, including the soldered distribution for the actuators and the power path off the wall.",
        ],
        outcome: [
          "Shipped with the internship. The build story is ",
          { projectSlug: "vend-a-shoe" },
          ".",
        ],
        media: {
          kind: "image",
          src: "/experiences/brainchild/unit.jpg",
          alt: "Assembled client hardware unit",
          caption: "Vend-A-Shoe, assembled and off the breadboard.",
        },
      },
      {
        title: "Flywheels, a feed, and one controller",
        problem:
          "The launcher needed two flywheel motors and a feed stepper to run from one embedded controller without the drive stage dumping the supply.",
        approach: [
          "ESP32 control, dual RS-775 flywheels, a NEMA 17 feed, and MOSFETs switched by PWM so speed is a duty cycle.",
        ],
        outcome: [
          "Prototype, finished with the internship. The project page is the ",
          { projectSlug: "tennis-ball-shooter" },
          ".",
        ],
        media: {
          kind: "image",
          src: "/experiences/brainchild/tennis-circuit.jpg",
          alt: "Launcher circuit and chassis",
          caption: "Drive electronics for the tennis-ball launcher.",
        },
      },
    ],
  },
  {
    slug: "quantum-opus",
    org: "Quantum Opus",
    shortName: "Quantum Opus",
    role: "Electrical & Photonics Engineering Lab Assistant",
    kind: "internship",
    track: "industry",
    dates: "May 2026 – Aug. 2026",
    location: "Plymouth, MI",
    oneLiner:
      "SNSPD test benches: fiber paths, optical attenuation, and the detector pulse on a scope.",
    overview:
      "I was looking at the pulse from a superconducting nanowire detector. The timing bench was a 1 GHz fiber laser, a TimeTagger, and a 500 MHz scope. The detector was saturating because one laser pulse carried too many photons. Attenuation in the fiber path, and the waveform on that scope, is what separated a light-level problem from a bad detector. I don't have a saved trace from that check.",
    highlights: [
      "I set up the fiber path and the attenuation, then looked at the electrical pulse.",
      "The detector was saturating because one laser pulse carried too many photons. Attenuating the light is how I separated that from a bad detector.",
      "The photo of that path is three OA 5002 attenuators. One reads 30.91 dB at 1600 nm. Two display FAIL. I don't have the waveform from that check.",
    ],
    focus: ["SNSPD", "Fiber", "Optical attenuation", "Oscilloscope", "TimeTagger"],
    cover: {
      kind: "image",
      src: "/experiences/quantum-opus/IMG_6360.jpg",
      alt: "LeCroy WaveMaster 8600A oscilloscope on a lab bench, bezel marked 6 GHz",
      fit: "contain",
      caption:
        "LeCroy WaveMaster 8600A. The bezel says 6 GHz, dual 20 GS/s. This is a different oscilloscope from the 500 MHz instrument in the timing setup.",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/quantum-opus/IMG_6352.jpg",
        alt: "Tektronix TDS3034B oscilloscope, powered off, on a white bench",
        fit: "contain",
        caption:
          "A Tektronix TDS3034B, off, with the probe lead on top. Another scope in the lab, not the WaveMaster and not identified as the 500 MHz instrument.",
      },
    ],
    externalHref: "https://www.quantumopus.com/",
    websiteKind: "company",
    about: [
      "Quantum Opus builds superconducting nanowire single-photon detectors, and the cryostats that hold them cold. An SNSPD is a nanowire biased just below the current where it stops superconducting. One photon can kick a short piece of that wire into a normal state, and the readout turns that into a voltage pulse. That is how you time light that is only a few photons. The company site describes these detectors on the Artemis II optical downlink.",
    ],
    tools: [
      "TimeTagger",
      "1 GHz fiber laser",
      "500 MHz oscilloscope",
      "Optical attenuation",
      "Waveform analysis",
    ],
    work: [
      {
        title: "The bench",
        body: [
          "I worked on the setups used to characterize these detectors. I prepared the fiber connections and the optical path, set the attenuation, and captured the electrical pulse. A reading only hangs together if you keep three things in view at once: the light going in, the detector and its readout, and the scope that drew the waveform.",
        ],
      },
      {
        title: "The timing setup",
        body: [
          "That setup used a 1 GHz fiber laser, a TimeTagger for the photon arrivals, and a 500 MHz oscilloscope for the electrical waveform. 1 GHz is how often the laser pulses. 500 MHz is that scope's bandwidth. The WaveMaster in the opening photo is marked 6 GHz, so it is a different instrument.",
        ],
      },
      {
        title: "Too many photons in one pulse",
        body: [
          "The detector was saturating because too many photons were arriving in one pulse. I found that by attenuating the light and looking at the waveform. I don't have a retest after a change. Extra photons in the pulse change the waveform you are trying to read, so a light-level problem can look like a detector problem until you check the optical path.",
        ],
        media: {
          kind: "image",
          src: "/experiences/quantum-opus/IMG_5990.jpg",
          alt: "Three Tektronix OA 5002 optical attenuators in a TM 5003 frame, with fiber connected",
          fit: "contain",
          caption:
            "Tektronix OA 5002 attenuators in a TM 5003 frame, fiber on the optical inputs. One module reads 30.91 dB at 1600 nm. Two modules display FAIL.",
        },
      },
    ],
  },
  {
    slug: "stealth-startup",
    org: "Stealth Startup",
    shortName: "Stealth Startup",
    role: "AI Engineering Intern",
    kind: "internship",
    track: "industry",
    dates: "Apr. 2026 – Jun. 2026",
    location: "Remote",
    oneLiner:
      "I worked on a live interview avatar, mostly how long it took to start. Next.js, WebRTC, Pipecat, and Tavus. Startup went from 30 seconds to 7.",
    overview:
      "AI engineering intern at a stealth startup. The product was a live conversational avatar. I profiled startup across Next.js, Pipecat Cloud, Daily WebRTC, Tavus, and the LLM and TTS services, then changed session init so the avatar and first speech came up faster.",
    highlights: [
      "Instrumented and profiled a latency-sensitive conversational AI pipeline spanning Next.js, Pipecat Cloud, Daily WebRTC, Tavus, and LLM/TTS services to isolate critical-path startup bottlenecks.",
      "Redesigned session initialization through asynchronous preconnection, connection-state synchronization, and WebRTC sequencing.",
      "Debugged WebRTC race conditions across avatar, LLM, and TTS services, reducing startup latency 77% (30 s to 7 s).",
    ],
    focus: [
      "Next.js",
      "Pipecat Cloud",
      "Daily WebRTC",
      "Tavus",
      "LLM/TTS",
      "Latency",
    ],
    about: [
      "A stealth startup. The product was a live conversational avatar.",
    ],
    roleParagraphs: [
      [
        "I was an AI engineering intern from April 2026 through June 2026, remote. The internship is finished. The product was a live conversational avatar. Startup time mattered, because the avatar, the language model, and the speech service had to be up before the session was usable.",
      ],
      [
        "I instrumented that path across Next.js, Pipecat, WebRTC, Tavus, and the LLM and TTS services. The failure mode was ordering: a race across the avatar, the model, and speech. I changed session start so the connections came up ahead of time and the session waited on connection state before it continued.",
      ],
    ],
    roleBullets: [
      ["Finished internship. Stack: Next.js, Pipecat, WebRTC, Tavus, LLM/TTS."],
      ["My change was session startup: preconnection, connection state, and WebRTC sequencing."],
      ["Result from that debugging: startup latency from 30 s to 7 s, a 77% reduction."],
    ],
    examples: [
      {
        title: "The session started in the wrong order",
        problem:
          "The avatar, the language model, and text-to-speech could come up out of order, so the session sat there or started late.",
        approach: [
          "I profiled the path, then moved session init to asynchronous preconnection and explicit connection-state sequencing over WebRTC.",
        ],
        outcome: [
          "Startup went from 30 seconds to 7 seconds. That internship ended in June 2026. There is no separate project page.",
        ],
      },
    ],
  },
  {
    slug: "penn-adapt",
    org: "Penn ADAPT xLab",
    shortName: "ADAPT",
    role: "Hardware Engineer · ADAPTLab",
    kind: "role",
    track: "club",
    dates: "Current",
    location: "Assistive tech · HMS collaboration",
    oneLiner:
      "An assistive button that turns one press into space or tab, and the bionic arm's boards and mounts.",
    overview:
      "Hardware work on an assistive button for an HMS collaboration, and on the bionic arm's PCBs and mounts.",
    highlights: [
      "Button: one press becomes space or tab. Debounce keeps switch chatter from counting twice.",
      "Bionic arm: PCBs and mounts. Two longer wires still block the CAD fit.",
    ],
    focus: [
      "Assistive hardware",
      "Accessibility",
      "Embedded input",
      "Human-centered design",
      "ADAPTLab",
    ],
    cover: {
      kind: "image",
      src: "/experiences/penn-adapt/cover.jpg",
      alt: "Penn ADAPT website homepage",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/penn-adapt/cover.jpg",
        alt: "Penn ADAPT website",
        caption: "pennadapt.com",
      },
    ],
    externalHref: "https://www.pennadapt.com/",
    websiteKind: "organization",
    about: [
      "Penn ADAPT, Assistive Devices and Prosthetic Technologies, is a student organization at Penn, founded in 2015. Members design assistive devices and prosthetic technology. The club's public project list includes a bionic arm.",
    ],
    work: [
      {
        title: "Assistive button",
        body: [
          "This button is for an HMS collaboration, separate from the arm. One press has to come out as space or tab. The switch chatters, so debounce has to keep a second key from firing.",
        ],
      },
      {
        title: "Bionic arm electronics",
        body: [
          "On the arm I'm drawing the PCBs and the mounts. The armband is eight modules, each a differential pair into an ADS1291, tied with a 20-pin flex and meant to drive servos and a linear actuator. The September 2026 main sheet marks a 2-cell pack from 6.0 V to 8.4 V, plus 12 V, 6 V, and 3.3 V. My electrode plan is a 7.2 V pack, a buck down to 4 V, then an LDO. Those two descriptions are not the same battery, and a buck cannot make the labeled 12 V from 8.4 V. The schematics give each ADS1291 its own chip select. A progress slide still says SPI daisy-chain. Bring-up reads one channel, gain 6, 2000 samples per second, with the motors compiled off. Nathan Zhang tested the main board. Rubi Wu started the first fixture. Two longer wires still keep a board out of the CAD mount. There is no measured EMG. The write-up is the ",
          { projectSlug: "bionic-arm" },
          ".",
        ],
        projectSlug: "bionic-arm",
        media: {
          kind: "image",
          src: "/projects/bionic-arm/cover.jpg",
          alt: "Block diagram of an electrode pair into an ADS1291, marked times eight, then SPI to an MCU",
          caption: "One channel, marked x8. Differential pair, ADS1291, SPI to the MCU.",
          fit: "contain",
        },
      },
    ],
    deepDive: {
      title: "One press has to stay one press",
      paragraphs: [
        [
          "A mechanical switch doesn't close once. The contacts bounce, and a naive read turns that bounce into two key events. For someone using this button as space or tab, a second key is the failure.",
        ],
        [
          "I worked the switch, the debounce, and the firmware that emits the key. The button is still in progress.",
        ],
      ],
    },
  },
  {
    slug: "penn-spark",
    org: "Penn SPARK",
    shortName: "SPARK",
    role: "Software Engineer",
    kind: "role",
    track: "club",
    dates: "Current",
    location: "Student engineering · product builds",
    oneLiner:
      "I write software with Penn SPARK. The piece I can point to is Penn Plates, a campus dining app with student accounts and a loop people can use.",
    overview:
      "Penn SPARK is a student product group. My main piece is Penn Plates, a Next.js and Supabase app for coordinating around campus dining. Auth and row-level security had to be right. We cut scope so there was a working demo instead of a pile of half-finished screens.",
    highlights: [
      "Software engineer on Penn SPARK product teams.",
      "Built Penn Plates (Next.js + Supabase) with student auth, profiles, and a dining coordination loop.",
      "Cut scope to protect one usable flow under the SPARK timeline instead of chasing feature density.",
    ],
    focus: ["Next.js", "Supabase", "Product", "Auth", "Student apps"],
    cover: {
      kind: "image",
      src: "/experiences/penn-spark/cover.jpg",
      alt: "Penn SPARK website homepage",
    },
    gallery: [
      {
        kind: "image",
        src: "/experiences/penn-spark/cover.jpg",
        alt: "Penn SPARK website",
        caption: "pennspark.org",
      },
      {
        kind: "video",
        src: "/projects/pennplates.mp4",
        alt: "Penn Plates demo",
        caption: "Penn Plates demo from the SPARK build",
      },
    ],
    relatedProjects: [
      { label: "Penn Plates (case study)", href: "/projects/pennplates" },
      { label: "Penn Plates (live)", href: "https://www.pennplates.org/" },
    ],
    externalHref: "https://pennspark.org/",
    websiteKind: "organization",
    about: [
      "Penn Spark is a student community at Penn, started in Spring 2021. Members build client work and their own products, with developers and designers on the same teams. The group's project list is the organization's.",
    ],
    roleParagraphs: [
      [
        "I am a software engineer in Penn Spark. The role is ongoing. The piece I built is ",
        { projectSlug: "pennplates" },
        ", a campus dining app. Students sign in, keep a profile, and use one dining loop. The live app is at ",
        { href: "https://www.pennplates.org/", label: "pennplates.org" },
        ".",
      ],
      [
        "The constraint was the Spark timeline. Auth had to be real, including row-level access on Supabase, and extra screens had to go so the one loop could be used.",
      ],
    ],
    roleBullets: [
      [
        "Shipped: ",
        { projectSlug: "pennplates" },
        ", Next.js and Supabase.",
      ],
      ["My scope choice: one dining loop, with auth and profiles, instead of a longer feature list."],
    ],
    examples: [
      {
        title: "Auth first, then the extra screens",
        problem:
          "A dining app that students actually open needs accounts that hold. A long feature list on an eight-to-twelve week student timeline does not.",
        approach: [
          "I built Penn Plates on Next.js and Supabase, with sign-in, profiles, and row-level access, and cut screens that were not the dining loop.",
        ],
        outcome: [
          "Shipped. The project page is ",
          { projectSlug: "pennplates" },
          ", and the app is at ",
          { href: "https://www.pennplates.org/", label: "pennplates.org" },
          ".",
        ],
      },
    ],
  },
];

export const FEATURED_EXPERIENCES = EXPERIENCES.filter(
  (experience) => experience.track === "industry"
).slice(0, 3);

export function getExperience(slug: string): Experience | undefined {
  return EXPERIENCES.find((experience) => experience.slug === slug);
}

export function experienceHref(slug: string) {
  return `/experiences/${slug}`;
}
