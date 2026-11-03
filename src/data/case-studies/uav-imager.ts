import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Penn ModLab, ongoing. TSL1401 line sensor on an nRF54L15.
 * Team results come from the Oct 28, 2026 repository notes and the
 * project synopsis. Personal credit stays at the integration already
 * stated on the GRASP page.
 */
export const UAV_IMAGER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "3d-imaging-uav",
  motivation: {
    why: "A UAV that needs a wide view does not have to carry a heavy camera. A short line of pixels, turned through a circle, can build that view one line at a time.",
    interest:
      "The hard part is keeping the line, the light, and the angle in agreement while the sensor is moving.",
    learning:
      "A stripe in the picture can be the room lights, not the scene. Timing has to be part of the image.",
    narrative:
      "This is an ongoing project in Penn ModLab, inside GRASP. The aim is a compact imager for a UAV. A TSL1401, a 128-pixel line sensor, sits on an nRF54L15. Each acquisition is one line of light intensity. The intended next step is to tag each line with the sensor's rotational angle and assemble a 360° view.\n\nThat view does not exist yet. The bench has a working acquisition path. I'm integrating the sensor on Zephyr: the ADC and GPIOs bring the samples in. The live view, the 120 Hz timing fix, and the mount are the team's. Rotation, a battery, and wireless operation are still ahead. The repository is https://github.com/rkparikh77/360imager.",
    requirements: [
      "Read 128 pixels as one line, on a repeatable interval.",
      "Keep exposure short enough that rotation will not smear a line, and long enough to collect light.",
      "Stop 120 Hz room light from looking like structure in the image.",
      "Associate each line with angle once the sensor is actually turning. That association is not in the data yet.",
    ],
  },
  systemOverview: {
    summary:
      "The prototype is a TSL1401 wired to an nRF54L15, programmed and debugged with a J-Link. Python scripts draw each line as it arrives. The sensor's analog output, the start pulse, and the clock are the pins the repository assigns (analog on P1.11, SI on P1.12, clock on P1.08). A lens and a mount have been collected. The bench photo is still the breadboard and the J-Link, not a sensor spinning on a vehicle.",
    subsystems: [
      { name: "TSL1401", role: "128 photodiodes in a line. One readout is one column of intensity, not a picture." },
      { name: "nRF54L15", role: "Zephyr on the Nordic chip. The ADC and GPIOs take the line. J-Link programs it." },
      { name: "Live view", role: "Python builds an image from successive lines, from the J-Link stream or a log." },
      { name: "Rotation", role: "Not running. Lines are not yet paired with an angle." },
    ],
    dataFlow:
      "Light on the line, analog sample for each of 128 pixels, a row of numbers, then the next row. Horizontal in the plots is time. It becomes angle only after the rotation is measured.",
    controlFlow:
      "A nominal 25 ms line, about 40 lines a second. Each line is an exposure and a dark frame. Two of those pairs, 12.5 ms apart, are averaged so 120 Hz flicker lands on opposite phases.",
    signalPath: [
      { title: "Scene", detail: "Light across 128 pixels. Early tests had no lens, so a finger was a broad shadow." },
      { title: "TSL1401", detail: "Integrates that light, then clocks the pixels out." },
      { title: "ADC", detail: "One sample per pixel. An earlier software readout took about 9 ms." },
      { title: "Line", detail: "128 numbers, dark-subtracted. The live view stacks lines in time." },
      { title: "Angle", detail: "Not recorded. A 360° image needs this, and the rig is not turning yet." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/3d-imaging-uav/setup.jpg",
      alt: "nRF board on a breadboard, wired to a J-Link, with a handwritten note that says TSL1401 imager",
      fit: "contain",
      label: "Bench",
      caption:
        "Bring-up on the bench. The note says TSL1401 imager. The black box is a J-Link. This is not the rotating mount, and it is not on a UAV.",
    },
  },
  contribution: {
    summary:
      "I am integrating the TSL1401 with an nRF54L15 on Zephyr. The ADC and GPIOs bring the samples in. The flicker timing, the mount, and the repository are the team's, and these notes do not split that work any finer.",
    mine: [
      "TSL1401 on the nRF54L15, Zephyr, with the ADC and GPIOs bringing the samples in.",
    ],
    alreadyThere: [
      "The TSL1401 and the nRF54L15 board.",
      "J-Link programming, the build and flash scripts, and the Python live view.",
      "The repository, github.com/rkparikh77/360imager. Bluetooth streaming is on a branch and is not yet tested.",
    ],
  },
  disciplines: [
    {
      id: "acquisition",
      discipline: "Acquisition",
      goal: "Turn 128 pixels into a line, often enough that a later rotation has something even to map.",
      design:
        "The team clocks the sensor out and samples each pixel on the ADC. A measured dark frame is subtracted from the exposure. The schedule they are using is nominally 25 ms, about 40 lines a second. Build, flash, and live-view scripts make that setup repeatable. An earlier readout, one ADC call per pixel, took about 9 ms and was the bottleneck. A hardware-timed path in the repository aims at about 1 ms. The test notes say that path still needs a check on the board, so I am not counting it as done.",
      challenges: [
        "Light that leaks into the dark measurement leaves a faint band after the subtraction.",
        "Automatic exposure changes the brightness from line to line, so a still scene can pick up a step that is not in the room.",
        "Faster rotation will demand a shorter exposure. ADC gain, or a lower reference voltage, was proposed for that. Neither one has been tried.",
      ],
      iterations: [
        "A finger across the sensor, with no lens, to see that the pipeline moved when the light did.",
        "Dark subtraction on each line, and a 25 ms schedule.",
        "Hardware-timed readout written, and not yet confirmed on the board.",
      ],
      finalImplementation:
        "The bench reads lines and draws them. It does not yet place those lines around a circle. The finger-test figure is with the results: 128 pixels on the vertical axis, time on the horizontal, no lens.",
    },
    {
      id: "flicker",
      discipline: "Light",
      goal: "Stop room lighting from drawing stripes that are not in the scene.",
      design:
        "Room lights flicker at 120 Hz. If each line is taken at a different point in that cycle, the stack shows vertical stripes. The team takes two exposures 12.5 ms apart, opposite phases of that flicker, and averages them. On a stationary scene held for 60 seconds, the repository reports 0.8% line-to-line jitter and 1.2% total drift.",
      challenges: [
        "Locking the line rate to 120 Hz removed the sharp stripes and left slow waves, on the order of 15 seconds, because the light's frequency drifts.",
        "The averaged pair is a timing fix for a still sensor. It does not measure rotation.",
      ],
      iterations: [
        "Stripes, before the timing change.",
        "Line rate locked to 120 Hz. Stripes gone, slow waves left.",
        "Paired exposures 12.5 ms apart.",
      ],
      finalImplementation:
        "For a sensor that is sitting still, the paired exposures take the 120 Hz stripes out. The picture is still a stack of lines in time.",
      media: [
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-before.png",
          alt: "Grayscale image of tight vertical stripes from room-light flicker",
          fit: "contain",
          label: "Before",
          caption:
            "Before the timing change. Vertical stripes are the 120 Hz room lights, sampled at a different phase on each line.",
        },
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-locked.png",
          alt: "Grayscale image with the sharp stripes gone and broad slow brightness waves remaining",
          fit: "contain",
          label: "Locked to 120 Hz",
          caption:
            "Line rate locked to 120 Hz. The sharp stripes are gone. Slow waves remain, over a few minutes.",
        },
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-after.png",
          alt: "Grayscale image of a stationary scene after paired exposures, without the sharp flicker stripes",
          fit: "contain",
          label: "Paired exposures",
          caption:
            "Two exposures 12.5 ms apart, averaged. Stationary scene, 60 seconds. The repository reports 0.8% line-to-line jitter and 1.2% drift. Horizontal is still time.",
        },
      ],
    },
    {
      id: "mechanics",
      discipline: "Mechanics",
      goal: "Put the line on a rotating mount, with power and a link that do not need the bench tether.",
      design:
        "The updates describe a 3D-printed mount and a move of the sensor wiring onto perfboard. A lens and a mount were collected. A later note said vague hand outlines were visible with that setup. I don't have that frame here. Battery mounting, a wireless test, and a rotation test are the steps those notes still list.",
      challenges: [
        "Evenly timed lines only give even angles if the rotation speed is constant, and the speed still has to be measured.",
        "A shorter exposure, which a faster spin needs, collects less light.",
        "Optics, the battery, the mount, and the radio have to work at the same time before an untethered spin means anything.",
      ],
      iterations: [
        "Breadboard and J-Link, which is the photo on this page.",
        "Printed mount and perfboard, described in the updates, not photographed here.",
        "Lens and mount in hand. Rotation not run.",
      ],
      finalImplementation:
        "The acquisition prototype is real. The rotating panoramic imager is not.",
    },
  ],
  designDecisions: [
    {
      id: "flicker-pair",
      title: "Average two exposures half a flicker cycle apart",
      problem:
        "120 Hz room light was showing up as vertical stripes. Each line caught a different brightness, and that looked like scene structure.",
      alternatives: [
        "Leave the line timing alone and treat the stripes as part of the picture.",
        "Lock the line rate to 120 Hz so every line sees the same phase.",
        "Take two exposures 12.5 ms apart and average them.",
      ],
      tradeoffs:
        "Locking the rate removed the sharp stripes and left slow waves, because the lamps do not hold 120 Hz perfectly. A pair of exposures cancels one cycle of that flicker and costs a second integration. It does not help if the sensor has moved between the two shots.",
      choice:
        "The team uses the 12.5 ms pair. On a still scene the repository reports 0.8% line-to-line jitter and 1.2% drift over 60 seconds. That number is for a sensor that is not rotating.",
    },
    {
      id: "readout",
      title: "Treat the 9 ms readout as a limit, not as a finished speedup",
      problem:
        "A faster spin needs a shorter exposure, and the readout has to finish inside the line time. The earlier software path took about 9 ms for 128 pixels.",
      alternatives: [
        "Stay on one ADC read per pixel.",
        "Clock the pixels and the ADC in hardware so the readout is closer to 1 ms.",
        "Raise ADC gain, or lower the reference voltage, so a short exposure still fills the converter.",
      ],
      tradeoffs:
        "The hardware-timed path is in the repository and the test plan says it still needs a check on the board. Gain and the reference voltage were only proposed. A short exposure that is not checked can look fast and be dark, or it can be bright and blurred.",
      choice:
        "The page keeps the about-9 ms figure as the readout that was measured in the earlier path. The 1 ms path, the gain, and the reference change are open.",
    },
  ],
  rootCauseAnalyses: [
    {
      id: "flicker",
      title: "The stripes were the lights",
      symptoms:
        "A stationary scene came out as vertical stripes. The spacing followed the line rate, not an edge in the room.",
      rootCause:
        "Room lighting flickers at 120 Hz. Lines taken at different phases recorded that flicker as if it were the image.",
      method:
        "The team compared a free-running line rate with a rate locked to 120 Hz, then with two exposures half a cycle apart. The locked rate cleared the stripes and left slow waves. The pair is what the still-scene figure uses.",
      improvement:
        "Paired exposures, 12.5 ms apart, averaged. Reported variation on a 60 second still scene is 0.8% from line to line and 1.2% of drift.",
      alsoConsidered:
        "A dead pixel column or a loose analog wire can also make a vertical feature. Those would not move when the line rate changes.",
      notYet:
        "The same pair during rotation. If the sensor moves between the two exposures, the average mixes two angles.",
    },
  ],
  evolution: [
    {
      id: "finger",
      phase: "Bench",
      title: "The pipeline answers",
      description:
        "A finger across the sensor, no lens. The live view showed broad dark bars. That checked the acquisition, not the focus.",
    },
    {
      id: "stripes",
      phase: "Light",
      title: "Stripes, then a timed pair",
      description:
        "120 Hz room light drew vertical stripes. Two exposures 12.5 ms apart, averaged, are the fix the still-scene test uses.",
    },
    {
      id: "rate",
      phase: "Timing",
      title: "About 40 lines a second",
      description:
        "A nominal 25 ms line, with a dark frame subtracted. The earlier readout was about 9 ms. A faster hardware path is written and not confirmed on the board.",
    },
    {
      id: "mount",
      phase: "Hardware",
      title: "Toward a rotating head",
      description:
        "The updates describe a 3D-printed mount, sensor wiring moving onto perfboard, and a lens and mount collected. A later note mentioned vague hand outlines. Battery, wireless, and rotation are still listed as next.",
    },
  ],
  results: {
    items: [
      {
        title: "Lines, not a panorama",
        body: "The finger test shows the sensor responding. Vertically, 128 pixels. Horizontally, time. Without a lens the bars are soft. A later update mentioned vague hand outlines on a revised setup. That frame is not the one on this page.",
      },
      {
        title: "Flicker on a still scene",
        body: "Paired exposures took the 120 Hz stripes out of a stationary scene. The repository reports 0.8% line-to-line jitter and 1.2% drift over 60 seconds. The sensor was not rotating.",
      },
    ],
    media: [
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/finger-test.png",
        alt: "Finger-test plot: dark bars across time, 128 pixels along the other axis",
        fit: "contain",
        label: "Finger test",
        caption:
          "Vertically, the sensor's 128 pixels. Horizontally, successive acquisitions over time. The bars are broad because there was no lens. Not a calibrated panoramic image.",
      },
    ],
    limitations: [
      "No 360° reconstruction. Lines are not tagged with angle.",
      "No rotation test, no battery-mounted run, and no wireless test. The Bluetooth branch is in the repository and is marked not yet tested.",
      "No UAV flight, and no claim that this has been deployed.",
      "The hardware-timed readout, near 1 ms, is not confirmed on the board. ADC gain and a lower reference are proposals.",
      "There is no photo here of the printed mount. The bench photo is the breadboard and the J-Link.",
    ],
  },
  reflection: {
    surprises: [
      "A fluorescent or LED ballast can write a pattern that looks like an edge. The line rate decides whether you see it.",
    ],
    redesign: [
      "Time the exposure with the same timer as the readout, so an interrupt cannot stretch one line.",
      "Record angle with the line, instead of assuming a constant spin after the fact.",
    ],
    future: [
      "Check the hardware-timed readout on the board before calling the 9 ms path retired.",
      "Mount the lens, the battery, and the sensor, then run one measured rotation.",
      "Test the wireless branch on the bench before anyone puts it on a vehicle.",
    ],
    questions: [
      "At the spin rate they actually want, how short does the exposure have to be before a pixel smears by one angular step?",
      "Does the 12.5 ms pair still cancel flicker once the sensor moves between the two shots?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Exposure and spin pull against each other. A faster rotation needs a shorter integration or the line blurs in angle. A shorter integration collects fewer photons, so the same scene gets noisier unless the optics or the ADC gain change. Gain and the reference voltage are still proposals.",
    },
    {
      kind: "observation",
      text: "Forty lines a second is a time base. It becomes an angular step only while the rotation speed is known. A stall, or a spin that is not constant, packs those lines into the wrong angles.",
    },
  ],
};
