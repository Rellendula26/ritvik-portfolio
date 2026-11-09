import type { ProjectBrief } from "@/data/project-brief";

/**
 * Recruiter brief for each project page.
 * Copy has to match the case study. Do not add a slug here that the page does not support.
 */
export const PROJECT_BRIEFS: Record<string, ProjectBrief> = {
  "c-compiler": {
    context: "Following Nora Sandler's roadmap",
    what: "An OCaml compiler for a small C subset, turning source into x86-64 I can actually run.",
    contribution: [
      "I wrote the passes: lexer and parser, TACKY to flatten nested expressions, then stack-backed x86 with a fixup when a memory-to-memory move is illegal.",
      "The programs it accepts today are returns of constants, including nested unaries such as return ~(-2);.",
    ],
    results: [
      "Those programs compile. Broader C is the next pass, and it is not in this compiler yet.",
    ],
    tech: ["OCaml", "TACKY IR", "x86-64", "Recursive descent"],
    visuals: [
      {
        kind: "image",
        src: "/projects/gallery/c-compiler-pipeline.svg",
        alt: "Diagram of the compiler passes from source through TACKY to x86-64",
        caption: "The passes I wrote. Each stage has to stay correct before the next one grows.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/gallery/c-compiler-asm.svg",
        alt: "Diagram of generated assembly for a small return program",
        caption: "Assembly for the subset that compiles today, not a full C program.",
        fit: "contain",
      },
    ],
  },
  "minitorch-ocaml": {
    what: "A reverse-mode autodiff library in OCaml, so a gradient is something I can check instead of trust.",
    contribution: [
      "Forward builds a graph of values, parents, and ops. Backward walks it and accumulates grads, including on a node that is shared.",
      "Finite-difference gradcheck is the test I trust when a gradient looks plausible and is wrong.",
    ],
    results: [
      "A tiny MLP with SGD and Adam is only a smoke test that the pieces still connect. The gradcheck is the result.",
    ],
    tech: ["OCaml", "Reverse-mode autodiff", "Gradcheck"],
    visuals: [
      {
        kind: "image",
        src: "/projects/gallery/minitorch-backprop.svg",
        alt: "Diagram of the backward pass accumulating gradients",
        caption: "Backward walk. Shared nodes are where a silent accumulation bug shows up.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/gallery/minitorch-gradcheck.svg",
        alt: "Diagram comparing an analytic gradient to a finite difference",
        caption: "Gradcheck against a finite difference, which is the check I use.",
        fit: "contain",
      },
    ],
  },
  bloombot: {
    what: "A desk flower for people who are far apart. Getting close opens it, and a remote message blinks out in Morse.",
    contribution: [
      "I built it on an Arduino UNO R4 WiFi. An ultrasonic reading drives the servos that open the flower, and a Blynk message drives the LED heart.",
      "Servo current peaks were browning the rail. The public demo is the build after that power and timing work.",
    ],
    results: [
      "Proximity opens the flower and the heart blinks Morse. A later hardware revision is not built.",
    ],
    tech: ["Arduino UNO R4 WiFi", "Blynk", "Ultrasonic", "Servos"],
    visuals: [
      {
        kind: "image",
        src: "/projects/bloombot-poster.jpg",
        alt: "BloomBot poster showing the flower and the LED heart",
        caption: "The flower is the enclosure. The hard part was Wi-Fi, Morse timing, and servo current on one board.",
        fit: "contain",
      },
    ],
  },
  saber: {
    context: "Detkin Lab",
    what: "A handheld saber with a discrete sound circuit and an LED blade on a switched 9 V pack.",
    contribution: [
      "I designed the printed hilt, emitter, and battery carrier, and soldered an NE555, an RC network, and a PN2222A onto perfboard.",
      "The polycarbonate blade broke the printed hilt twice at the root. I changed the hilt geometry instead of gluing it.",
    ],
    results: [
      "It runs off the breadboard. Textbook RC math predicted a longer frequency sweep than the hardware produced.",
    ],
    tech: ["NE555", "PN2222A", "Fusion 360", "9 V"],
    visuals: [
      {
        kind: "image",
        src: "/projects/lightsaber/saberwhite.png",
        alt: "Assembled saber with a white blade and printed hilt",
        caption: "Assembled saber. The blade is the lever that broke the first two hilts.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/lightsaber/perfboardaudiocircuit.png",
        alt: "Soldered perfboard with the NE555 audio circuit",
        caption: "The sound circuit after it left the breadboard.",
        fit: "contain",
      },
    ],
  },
  "tennis-ball-shooter": {
    context: "BrainChild",
    what: "A ball feeder for a client demo. An ESP32 sequences two flywheels and a stepper that indexes the balls.",
    contribution: [
      "I moved sequencing off an Arduino Mega onto the ESP32. MOSFET modules PWM-switch two RS-775 flywheels, and a NEMA 17 on an A4988 indexes the balls.",
      "A fused 12 V pack feeds the motors. A buck makes about 5 V for the ESP32 board's VIN. The chip itself runs at 3.3 V.",
    ],
    results: [
      "The bench demo runs from the Replit app. A later PWM test left a flywheel much faster than commanded, the fuse did not open, pack-side joints detached, and a wire's insulation melted. I did not measure the current.",
    ],
    tech: ["ESP32", "MOSFET PWM", "A4988", "RS-775"],
    visuals: [
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/circuit-and-chassis.jpg",
        alt: "Ball feeder chassis with the flywheel motors and control wiring",
        caption: "Bench feeder. Duty cycle changes the voltage waveform. Speed still depends on the motor and the load.",
        fit: "cover",
      },
      {
        kind: "image",
        src: "/projects/tennis-ball-shooter/connection-diagram.jpg",
        alt: "Connection diagram for the ESP32, motor drivers, and power rails",
        caption: "12 V for the motors, about 5 V into the ESP32 board, 3.3 V on the chip.",
        fit: "contain",
      },
    ],
    slides: [
      {
        id: "validation",
        label: "What the PWM test left",
        note: "During a PWM test a flywheel ran much faster than commanded. The fuse did not open. Afterward, solder joints on the pack side were detached and a wire's insulation had melted. I did not measure the current, and I have not established which of those happened first.",
        visuals: [
          {
            kind: "image",
            src: "/projects/tennis-ball-shooter/burned-wire.jpg",
            alt: "Wire with melted insulation beside the motor wiring",
            caption: "Melted insulation from that test. The photo does not show the current or the order of the failure.",
            fit: "cover",
          },
        ],
      },
    ],
  },
  "ultrasonic-pcb": {
    what: "A board that connects an Arduino Nano to an HC-SR04 and a status LED, taken through Gerbers.",
    contribution: [
      "I drew the schematic and the layout in KiCad, including the Nano, the sensor header, and the LED.",
      "I exported Gerbers aimed at PCBWay. That is a fabrication package, not a board I have in hand.",
    ],
    results: [
      "The layout and the Gerbers are the result. These files do not show an assembled PCB.",
    ],
    tech: ["KiCad", "Arduino Nano", "HC-SR04", "Gerber"],
    visuals: [
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/final-3d-render.png",
        alt: "3D render of the ultrasonic sensor board layout",
        caption: "Layout render. No assembled board is in this project.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/ultrasonic-pcb/schematic.png",
        alt: "KiCad schematic of the Nano, HC-SR04, and status LED",
        caption: "Schematic for the Nano, the HC-SR04, and the status LED.",
        fit: "contain",
      },
    ],
  },
  "per-power-electronics": {
    context: "Penn Electric Racing, recruiting challenge",
    what: "A recruiting circuit where brake and current both have to cross a threshold before an indicator trips. It is not hardware on the car.",
    contribution: [
      "I first read 0.5 s as a minimum delay. The written requirement is a maximum response time, so a delay that looks fine can still miss the window.",
      "For the 12–17 V to 5 V rail I compared the LM5164 and the LMR33630 from their datasheets. That comparison is not a board I built.",
    ],
    results: [
      "There is no pass or fail number for the revised timing. Datasheet cells that were blank stay blank.",
    ],
    tech: ["Comparators", "LM5164", "LMR33630", "Buck converter"],
    visuals: [
      {
        kind: "image",
        src: "/projects/per-power-electronics/schematic.jpg",
        alt: "Schematic of the recruiting indicator circuit",
        caption: "The recruiting circuit. Analysis, not a module on the car.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/per-power-electronics/notes-task-a-preview.jpg",
        alt: "Handwritten notes for the timing requirement",
        caption: "Notes from the timing task. 0.5 s is a maximum response time.",
        fit: "contain",
      },
    ],
  },
  "hyperloop-vfd": {
    context: "Penn Hyperloop, recruiting analysis",
    what: "An analysis of a 480 V variable-frequency drive, from the AC line to the motor frequency. It is not hardware on a vehicle.",
    contribution: [
      "I traced three-phase AC through a diode rectifier, a DC link, and a PWM inverter.",
      "The PWM carrier stays distinct from the fundamental. The switching demo is a teaching tool, not a full drive simulator.",
    ],
    results: [
      "The chain of conversions is the result. I did not install a drive.",
    ],
    tech: ["480 V three-phase", "Diode rectifier", "DC link", "PWM inverter"],
    visuals: [
      {
        kind: "image",
        src: "/projects/hyperloop-vfd/pages/diagram-480v-p01.jpg",
        alt: "Diagram of the 480 V rectifier, DC link, and inverter path",
        caption: "480 V path from the write-up: rectifier, DC link, PWM inverter.",
        fit: "contain",
      },
    ],
  },
  afterthought: {
    what: "A personal media archive that keeps a film score separate from why the film stayed with you.",
    contribution: [
      "I built a Next.js archive with two ratings, Overall and Personal Impact, and a capture meant to stay inside two or three minutes.",
      "The running store is a seeded Zustand demo, with Supabase as the other persistence path. AI may suggest themes. It does not overwrite the note.",
    ],
    results: [
      "The archive runs, including the public link on this page. I am still calling it a working prototype.",
    ],
    tech: ["Next.js", "Zustand", "Supabase", "TMDB"],
    visuals: [
      {
        kind: "image",
        src: "/projects/afterthought/reflection.jpg",
        alt: "Afterthought reflection screen with a short post-watch note",
        caption: "The capture screen. One prompt, then themes, without replacing the original note.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/afterthought/themes.jpg",
        alt: "Afterthought themes view grouping saved notes",
        caption: "Notes grouped into themes after they are written.",
        fit: "contain",
      },
    ],
  },
  "cis5450-loan-default": {
    context: "CIS 5450",
    what: "A course model of Lending Club default risk, after columns that leak the outcome are removed.",
    contribution: [
      "I filtered to paid versus charged-off on about a million loans and dropped post-outcome columns such as recoveries and total_pymnt.",
      "Transforms were fit only after the train/test split. I tuned XGBoost to about 0.7175 AUC.",
    ],
    results: [
      "Accuracy looked acceptable on an 80/20 split and was the wrong score. The AUC is the number I am using. This is a course analysis, not a lending product.",
    ],
    tech: ["Python", "Pandas", "XGBoost", "AUC"],
    visuals: [
      {
        kind: "image",
        src: "/projects/gallery/cis5450-pipeline.svg",
        alt: "Diagram of the loan-default cleaning and model pipeline",
        caption: "Clean, drop leakage, split, then fit. Tuning barely moved the score once the columns were honest.",
        fit: "contain",
      },
    ],
  },
  "labreach-ai": {
    what: "A command-line helper that drafts faculty outreach and will not send until I review it.",
    contribution: [
      "I built the scrape, including department pages that need a browser, and a local Ollama draft so the notes can stay off a cloud API.",
      "A review artifact is required before Gmail is allowed to send.",
    ],
    results: [
      "The CLI produces a draft. Sending is still a step I take by hand.",
    ],
    tech: ["Python", "Playwright", "Ollama", "Gmail API"],
    visuals: [
      {
        kind: "diagram",
        id: "outreach-review",
        caption: "The gate is the point. A draft is not a sent email.",
      },
    ],
  },
  "count-coach": {
    what: "A dance practice tool. You select a region of a song and get a tempo for that section.",
    contribution: [
      "I built the waveform selection in Next.js and the Python tempo analysis behind it, starting from a Colab notebook.",
      "The number is only as good as the region. A sloppy selection looks like a bad model.",
    ],
    results: [
      "The app is deployed. Sync between the selection and the analysis mattered more than a fancier tempo method.",
    ],
    tech: ["Next.js", "WaveSurfer", "Librosa", "Python"],
    visuals: [
      {
        kind: "image",
        src: "/projects/count-coach-1.png",
        alt: "Count Coach waveform with a selected region",
        caption: "The region on the waveform is what gets sent for a tempo.",
        fit: "contain",
      },
    ],
  },
  "arduino-tetris": {
    what: "Handheld Tetris on an Arduino Nano, with the game loop, the display, the buttons, and the sound all on the board.",
    contribution: [
      "I wrote the loop on the Nano: gravity, collision, scoring, SPI redraw to an ST7735, and piezo cues.",
      "A lot of what looked like sprite corruption was a solder joint on the display. I staged the controls on a two-button harness before packing them in.",
    ],
    results: [
      "The game runs on the Nano. Rotation polish, difficulty ramps, and an enclosure are not in this build.",
    ],
    tech: ["Arduino Nano", "ST7735", "SPI", "Piezo"],
    visuals: [
      {
        kind: "image",
        src: "/projects/tetrissettup.jpg",
        alt: "Arduino Nano Tetris on the bench with the color display wired",
        caption: "Bench setup. Display bugs and game bugs were the same debugging session.",
        fit: "cover",
      },
    ],
  },
  "bhangra-coach": {
    what: "A coach that compares a dance clip to a reference and tries to say where the form differs.",
    contribution: [
      "I built the upload, MediaPipe landmarks, and an alignment step for when the two clips are not the same tempo.",
      "The Next.js page shows those deltas. Raw joint error is not a coaching cue, and the wording is still the open part.",
    ],
    results: [
      "A demo is up. Alignment and the cue text both still need work.",
    ],
    tech: ["MediaPipe", "FastAPI", "Next.js", "Supabase"],
    visuals: [
      {
        kind: "image",
        src: "/projects/bcfeedback.png",
        alt: "Bhangra Coach feedback screen comparing a clip to a reference",
        caption: "Feedback screen. The useful part is the cue, not the raw joint error.",
        fit: "contain",
      },
    ],
  },
  pennplates: {
    context: "Penn SPARK",
    what: "A student dining app so a small group can coordinate a meal without a large feature list.",
    contribution: [
      "We built auth, profiles, and one dining loop on Next.js and Supabase.",
      "Auth and row-level security had to be right before that loop was worth demoing. Extra screens were cut to keep the demo.",
    ],
    results: [
      "One dining loop was demo-ready. It is a working prototype, not a campus-wide launch.",
    ],
    tech: ["Next.js", "Supabase", "Auth"],
    visuals: [],
  },
  website: {
    what: "This site. A place to read the decision, the measurement, and what is still open on each build.",
    contribution: [
      "I designed the typed project model, the case-study layout, and the media handling, and I write the pages from the lab notes.",
      "Featured work and smaller builds share one system so a new project is a record, not a new page design.",
    ],
    results: [
      "The site is deployed. Pages stay in progress when the hardware is still in progress.",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    visuals: [
      {
        kind: "image",
        src: "/projects/portfoliosite/homesite.jpg",
        alt: "Homepage of this portfolio",
        caption: "The homepage. Project pages are generated from the same typed records.",
        fit: "contain",
      },
    ],
  },
  brain: {
    what: "A brain model I cleaned up in Maya and printed as a labeled study piece.",
    contribution: [
      "I modeled the cortical surface with FDM limits in mind: overhangs and wall thickness, not just the screenshot.",
      "I printed it and labeled it.",
    ],
    results: [
      "The physical model exists. It is an early build, not a research atlas.",
    ],
    tech: ["Maya", "FDM", "Labeling"],
    visuals: [
      {
        kind: "image",
        src: "/projects/brain-1.png",
        alt: "3D printed brain model",
        caption: "Printed study piece. Detail that will not print was the constraint.",
        fit: "contain",
      },
    ],
  },
  OIDD: {
    context: "Course analysis",
    what: "A course analysis of socioeconomic factors and health outcomes, kept to models I could explain.",
    contribution: [
      "I cleaned the table, plotted the relationships that mattered, and tried interpretable trees.",
      "The assumptions sit next to the charts. The data is observational.",
    ],
    results: [
      "The analysis was submitted for the course. It does not support a causal claim.",
    ],
    tech: ["Python", "Pandas", "Decision trees"],
    visuals: [
      {
        kind: "image",
        src: "/projects/OIDD.png",
        alt: "Chart from the health-outcomes course analysis",
        caption: "One figure from the course write-up. Observational, not causal.",
        fit: "contain",
      },
    ],
  },
  "drift-balancer": {
    context: "Page template",
    what: "A sample project page. The balancer, the loop rate, and the hold numbers elsewhere on this page are placeholders.",
    contribution: [
      "I used this layout to see how a future write-up would read. I did not build the machine it describes.",
    ],
    results: [
      "Treat the rest of the page as a template. The measurements are not mine.",
    ],
    tech: ["Page template"],
    visuals: [],
  },
  "vend-a-shoe": {
    context: "Client build",
    what: "A shoe dispenser for a client. A Next.js command lands in Supabase, a Pi polls about once a second, and four MG996R servos move the shoe.",
    contribution: [
      "I built that path and integrated the enclosure, the harness, and the power distribution in the same box.",
      "Bin 3 over-rotated on one shared motion profile, so that bin got its own PWM duty.",
    ],
    results: [
      "The unit was delivered to the client. Early faults that looked like software were often a servo or the supply.",
    ],
    tech: ["Raspberry Pi", "MG996R", "Next.js", "Supabase"],
    visuals: [
      {
        kind: "image",
        src: "/projects/intake/vend-a-shoe/images/demo1.jpg",
        alt: "Vend-A-Shoe unit during a dispense demo",
        caption: "The client unit. Four servos, LEDs, and a fan share the box.",
        fit: "cover",
      },
      {
        kind: "image",
        src: "/projects/intake/vend-a-shoe/images/ENTIRECAD.jpg",
        alt: "CAD of the Vend-A-Shoe enclosure",
        caption: "Enclosure CAD for the same mechanism.",
        fit: "contain",
      },
    ],
  },
  "leader-follower-robotic-arm": {
    context: "Serpent Robotics",
    what: "A small leader arm on the ground and a follower arm for the cut, so the operator does not have to climb with the robot.",
    contribution: [
      "I wrote the bridge. Pi 1 sends leader joint angles. Pi 2 drives six Feetech STS3215 servos. Silence for 300 ms holds, and a step is limited to 15°. I did not write LeRobot.",
      "Shop Wi-Fi used a fixed follower address. The sender now looks up serpentpi-follower.local every 15 seconds.",
    ],
    results: [
      "On one Pi, the six motors tracked the leader within about 2°. Across the two Pis the motion still jitters. The bench pair is not mounted on SR-01.",
      "The motor pack was dead on the meter. After it was replaced, the board read 12 V.",
    ],
    tech: ["Raspberry Pi", "STS3215", "UDP", "LeRobot"],
    visuals: [
      {
        kind: "image",
        src: "/projects/leader-follower-robotic-arm/bench.jpg",
        alt: "Blue leader arm and white follower arm on a bench",
        caption: "Bench pair, blue leader and white follower. Not mounted on SR-01.",
        fit: "cover",
      },
    ],
  },
  "logic-pcb": {
    context: "Serpent Robotics",
    what: "Bench validation and debugging of SR-01's power and logic PCBs, for power distribution, regulation, and the actuator interfaces.",
    contribution: [
      "I focused on testing the boards already in the system and on how they behaved during bring-up.",
      "I used a multimeter to check the 12 V and 6 V rails, and whether power reached the points it should.",
      "When a rail or an actuator did not come up, I followed the supply path and the connections to see whether the problem was power delivery, wiring, or the hardware on the end.",
    ],
    results: [
      "The 12 V and 6 V rails checked out on the bench.",
      "A later grip test broke a printed link and damaged the control board and several actuators. The cause of that electrical damage has not been confirmed. Bring-up of a replacement board is still open.",
    ],
    tech: ["Power PCB", "Logic PCB", "12 V", "6 V"],
    visuals: [
      {
        kind: "image",
        src: "/projects/logic-pcb/both-boards.jpg",
        alt: "Logic board and power board side by side on the bench",
        caption: "The two boards from bring-up. The 12 V and 6 V checks were meter readings, not something this photo shows.",
        fit: "contain",
      },
    ],
  },
  "multimodal-3d-printer": {
    context: "AddLab, GRASP",
    what: "The rotating toolhead on an AddLab Aerotech printer, so someone at the machine can set a nozzle angle and read the angle the shaft reached.",
    contribution: [
      "I have been reassembling that axis and splitting the Arduino sketch. A potentiometer on A0 sets the move. An AS5600 is what the LCD is supposed to show.",
      "STEP is on D3 and DIR is on D2, into an A4988, on a 24 V motor supply. The blue and yellow encoder wires still need a pinout check against the AS5600.",
    ],
    results: [
      "The toolhead is mounted. In one clip the tube carousel has moved, and no angle was written down. The LCD still does not show degrees.",
    ],
    tech: ["Arduino Uno", "A4988", "AS5600", "NEMA 17"],
    visuals: [
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/toolhead.jpg",
        alt: "Aerotech toolhead with the tube carousel and motor housing",
        caption: "The axis on the machine. I have not matched the 5:1 NEMA 17 name to the blue housing or the gray motor.",
        fit: "cover",
      },
      {
        kind: "image",
        src: "/projects/multimodal-3d-printer/control-schematic.jpg",
        alt: "Schematic of the Uno, A4988, potentiometer, encoder, and LCD",
        caption: "Command from the potentiometer. Shaft angle is the encoder, which the LCD does not display yet.",
        fit: "contain",
      },
    ],
  },
  "3d-imaging-uav": {
    context: "ModLab, GRASP",
    what: "A line sensor meant to build a panorama from one row of pixels, light enough to fly on a UAV.",
    contribution: [
      "I am integrating a TSL1401 with a Nordic nRF54L15. Samples come in through the ADC and GPIO timing, not SPI. AO is P1.11, SI is P1.12, and CLK is P1.08.",
      "The readout and BLE in the source have not been run on this board. The external J-Link is also the 3.3 V supply, so I am not powering the board a second way.",
    ],
    results: [
      "An earlier still scene, with the sensor not rotating, showed 0.8% line-to-line jitter and 1.2% drift over 60 seconds. Those figures are not a run of the readout on this board. Next is one live scan on the board's own 3.3 V.",
    ],
    tech: ["TSL1401", "nRF54L15", "ADC", "GPIO"],
    visuals: [
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/finger-test.png",
        alt: "Time-stacked brightness lines from a finger passing the TSL1401",
        caption: "Finger test. Lines stacked in time, not a stitched panorama.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/over-spinner.jpg",
        alt: "Spinning assembly on the bench without the line sensor mounted",
        caption: "The spinner turns. The sensor is not on it in this photo.",
        fit: "cover",
      },
    ],
    slides: [
      {
        id: "validation",
        label: "Earlier still-scene check",
        note: "An earlier check, with the sensor held still, reported 0.8% line-to-line jitter and 1.2% drift over 60 seconds. Those figures are not a run of the readout on this board. The flicker plots below are from that earlier work.",
        visuals: [
          {
            kind: "image",
            src: "/projects/3d-imaging-uav/flicker-before.png",
            alt: "Line-sensor trace before the flicker timing change",
            caption: "Before the timing change. Sensor not rotating.",
            fit: "contain",
          },
          {
            kind: "image",
            src: "/projects/3d-imaging-uav/flicker-after.png",
            alt: "Line-sensor trace after averaging a second pair inside 12.5 milliseconds",
            caption: "After averaging a second pair when it fits in 12.5 ms. Still not a panorama.",
            fit: "contain",
          },
        ],
      },
    ],
  },
  "bionic-arm": {
    context: "Penn ADAPT",
    what: "Sensor and main boards for a prosthetic arm, so one differential EMG channel can be acquired on the arm.",
    contribution: [
      "I design the sensor PCB, the main PCB, and the mounts. The sensor board in hand is one differential pair, two electrodes into one ADS1291 channel, with protection and filtering ahead of the amplifier.",
      "The sensing supply in my note is a 7.2 V pack, a buck to 4 V, then an LDO, for the sensing circuitry. The electrodes are the signal inputs, not loads on that rail.",
    ],
    results: [
      "The team tested the main board and started the first fixture. Firmware reads raw EMG from one ADS1291 and can run a fixed motor test. It does not map EMG to motion.",
      "Eight sensor modules are the architecture. The current prototype is one sensor board.",
    ],
    tech: ["ADS1291", "STM32", "EMG", "PCB"],
    visuals: [
      {
        kind: "image",
        src: "/projects/bionic-arm/sensor-normal.jpg",
        alt: "Schematic of one sensor board with a differential electrode pair and an ADS1291",
        caption: "One sensor board: two electrodes, one ADS1291 channel.",
        fit: "contain",
      },
      {
        kind: "image",
        src: "/projects/bionic-arm/main-board.jpg",
        alt: "Main acquisition board on the bench",
        caption: "Main board on the bench. The team tested this board and started the first fixture.",
        fit: "cover",
      },
    ],
    slides: [
      {
        id: "system",
        label: "Eight-module plan",
        note: "The cover drawing is the expansion: eight of those sensor modules, servos, and a linear actuator. That is the architecture. The prototype today is the one sensor board plus the main board.",
        visuals: [
          {
            kind: "image",
            src: "/projects/bionic-arm/cover.jpg",
            alt: "Architecture drawing of an eight-module EMG armband on the prosthetic arm",
            caption: "Eight modules are the plan, not the board count in hand.",
            fit: "contain",
          },
        ],
      },
    ],
  },
};
