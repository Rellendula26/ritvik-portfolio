import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Penn ModLab, ongoing. TSL1401 on an HJ-N54L-SIP_EVB (nRF54L15).
 * Bluetooth-branch source, revision r3. The hardware readout and the
 * BLE path are in that source and have not been run on this board.
 * Personal credit stays at the sensor integration.
 */
export const UAV_IMAGER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "3d-imaging-uav",
  motivation: {
    why: "A panorama does not have to start as a camera. One row of photodiodes can collect a scene a line at a time, if each line is kept with the angle it saw.",
    interest:
      "The interesting step is the sample. Before that, the pixel is a voltage. After that, it is a number a laptop can plot.",
    learning:
      "A second supply on the J-Link's Vcc clip is a short, not a backup. The probe is the 3.3 V source until it is unplugged.",
    narrative:
      "The objective is a panoramic image from one line of pixels, light enough for a UAV. I am integrating a TSL1401, 128 photodiodes in one row, with an nRF54L15. Earlier bench figures show a finger crossing the row and a still scene after a flicker test. The next milestone is one live scan, pixel index against brightness, with the board on its own 3.3 V.\n\nA photon the silicon absorbs makes an electron-hole pair. The junction field separates those charges, and the pixel's current follows the light. The sensor integrates that current for the exposure. All 128 pixels expose together, then AO steps through the analog voltages. The ADC sample is where the line becomes 128 numbers. Stacking those lines against time is not a panorama, and a rotating line sensor does not measure depth. A panorama needs each line tagged with angle. That tag is not in the data yet.",
    requirements: [
      "One scan is 128 brightness values, from one shared exposure.",
      "Sample AO after it settles, once per pixel, and keep the CPU out of the clock burst.",
      "Subtract a dark frame so offset and light collected during the flush do not sit in the line.",
      "Stream a finished scan to a laptop only after the line is complete. That stream has not been run.",
      "Pair each scan with a viewing angle once the sensor is actually turning. That pairing is not in the data.",
    ],
  },
  systemOverview: {
    summary:
      "The board is an HJ-N54L-SIP_EVB with an nRF54L15. It has no debugger of its own. An external J-Link on SWD programs it, and that probe also supplies 3.3 V today. Do not connect that Vcc clip and another supply at the same time. The source is the bluetooth branch, revision r3, built for nrf54l15dk/nrf54l15/cpuapp with nRF Connect SDK v3.4.1. The bench photo is still the breadboard and the J-Link, not a sensor spinning on its own supply.",
    subsystems: [
      {
        name: "TSL1401",
        role: "128 photodiodes in one row. They expose together, then AO steps through the analog voltages.",
      },
      {
        name: "nRF54L15",
        role: "SI, CLK, and one ADC sample per pixel. Full scale is 3.6 V, 12 bits. The board target is nrf54l15dk/nrf54l15/cpuapp.",
      },
      {
        name: "J-Link",
        role: "SWD, and the only 3.3 V supply on the bench right now. Unplugging it removes power, flashing, and the text log.",
      },
      {
        name: "Laptop",
        role: "Planned. A finished scan would show up as pixel index against brightness. That plot has not been run.",
      },
    ],
    dataFlow:
      "Light, photocurrent, a held voltage on AO, one ADC sample, then pix[128]. The laptop is the step after that, and it is not connected yet. A panorama needs one more number, the angle, which is also not recorded.",
    controlFlow:
      "The source loops every 25 ms, about 40 lines a second. Each output line is not one raw ADC burst. expose() flushes, waits, reads a lit frame, flushes, and reads a dark frame. Lit minus dark takes out offset, fixed pattern, and light collected during the flush. When that pair fits in 12.5 ms, it takes a second pair and averages, which is how 120 Hz flicker is supposed to cancel. The result is pix[128], clamped to 12 bits. Auto-exposure starts at 1000 us and aims the brightest raw pixel at 1000 to 2000 counts. This path has not been run on this board.",
    signalPath: [
      {
        title: "Light",
        detail: "A narrow strip of the scene lands on 128 photodiodes. Absorbed photons make electron-hole pairs.",
      },
      {
        title: "Charge",
        detail: "The junction field collects that charge as a photocurrent. The pixel integrates it for the exposure.",
      },
      {
        title: "AO",
        detail: "All 128 expose together. The sensor then holds the readings and outputs the analog voltages one at a time.",
      },
      {
        title: "ADC",
        detail: "The nRF samples AO once per pixel after the voltage settles. This is where the line becomes numbers. Full scale is 3.6 V, 12 bits.",
      },
      {
        title: "pix[128]",
        detail: "Dark frame subtracted, and a second pair averaged when it fits in 12.5 ms. Written. Not run on this board.",
      },
      {
        title: "Laptop",
        detail: "Planned over BLE. The first plot is pixel index against brightness. A panorama needs the angle, which is later.",
      },
    ],
    diagram: {
      kind: "image",
      src: "/projects/3d-imaging-uav/setup.jpg",
      alt: "nRF board on a breadboard, wired to a J-Link, with a handwritten note that says TSL1401 imager",
      fit: "contain",
      label: "Bench",
      caption:
        "Bring-up on the bench. The note on the photo says TSL1401 imager. The black box is a J-Link, and it is also the 3.3 V supply.",
    },
  },
  contribution: {
    summary:
      "I am integrating the TSL1401 with the nRF54L15. Samples come in on the ADC and the GPIO timing pins, not SPI. The hardware readout and the Bluetooth path are in the bluetooth-branch source and have not been run on this board.",
    mine: [
      "TSL1401 on the nRF54L15. The samples come in through the ADC and the GPIOs.",
    ],
    alreadyThere: [
      "The HJ-N54L-SIP_EVB and the TSL1401.",
      "The readout and BLE source on the bluetooth branch, revision r3. No build output in the tree, and neither path has been run on this board.",
      "Earlier bench figures of a finger and of room-light flicker. Those figures are not a run of this hardware readout.",
    ],
  },
  disciplines: [
    {
      id: "acquisition",
      discipline: "Acquisition",
      goal: "Turn one exposure of 128 photodiodes into pix[128], with the analog-to-digital step on the ADC.",
      design:
        "Pins, from the overlay: AO on P1.11 (AIN4), SI on P1.12, CLK on P1.08. READOUT_HW is 1. TIMER21 and GPIOTE make CLK. SI is a CPU pulse, high only across rising edge 1. The falling edge triggers an SAADC sample through DPPI, and EasyDMA writes the buffer in pixel order. TIMER22 stops the burst on rising edge 129. Pixel clock is 125 kHz. The flush clock is 4 MHz. Acquisition is 2 us. The CPU must not bit-bang CLK, and it must not send Bluetooth from inside the readout. Pixels 0 through 3 are copies of pixel 4. The hardware path programs the SAADC directly and hardcodes AO as P1.11. The overlay channel is only used if READOUT_HW is 0. This readout has not been run on this board.",
      challenges: [
        "The J-Link is power, programming, and the text log. Unplugging it removes all three.",
        "A blocking RTT print will stall the scanner when no debugger is reading, and the BLE image still prints every line.",
        "If the log stops after the readout line, the board may have no 32.768 kHz crystal. The BLE config would then have to use the internal RC. That has not been tried here.",
      ],
      iterations: [
        "Bench photo: breadboard, sensor note, J-Link on the left.",
        "Hardware-timed readout written, with a dark frame and a 25 ms loop.",
        "Not run on this board. There is no build output in the tree.",
      ],
      finalImplementation:
        "The source describes a 128-value scan. I am not calling that scan done. The finger-test figure is an earlier check, with no lens: 128 pixels on the vertical axis, time on the horizontal.",
    },
    {
      id: "flicker",
      discipline: "Light",
      goal: "Keep 120 Hz room light from looking like structure in the line.",
      design:
        "The source takes a lit frame and a dark frame, subtracts, and when that pair fits in 12.5 ms it takes a second pair and averages. One cycle of 120 Hz is about 8.3 ms, so 12.5 ms is 1.5 cycles. For an ideal sine, that lands the second lit frame on the opposite phase. It is not half a cycle, and it does not cancel an arbitrary lamp waveform. A log line that says \"dark 0\" means the values are already subtracted. Earlier still-scene figures, from before this readout, report 0.8% line-to-line jitter and 1.2% drift over 60 seconds, with the sensor sitting still.",
      challenges: [
        "Locking the line rate to 120 Hz took out the sharp stripes and left slow waves, on the order of 15 seconds, because the lamps do not hold 120 Hz perfectly.",
        "The pair mixes two angles if the sensor moves between the shots. The sensor is not turning yet.",
        "Auto-exposure, aimed at 1000 to 2000 counts, can still change the brightness from line to line.",
      ],
      iterations: [
        "Stripes, before the timing change. Earlier figure.",
        "Line rate locked to 120 Hz. Sharp stripes gone, slow waves left.",
        "Paired exposures 12.5 ms apart, written into the current source and not run on this board.",
      ],
      finalImplementation:
        "The cancellation is in the source. The pictures on this page are earlier still-scene figures, and the horizontal axis on them is still time.",
      media: [
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-before.png",
          alt: "Grayscale image of tight vertical stripes from room-light flicker",
          fit: "contain",
          label: "Before",
          caption:
            "Earlier figure, before the timing change. Vertical stripes are the 120 Hz room lights, sampled at a different phase on each line.",
        },
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-locked.png",
          alt: "Grayscale image with the sharp stripes gone and broad slow brightness waves remaining",
          fit: "contain",
          label: "Locked to 120 Hz",
          caption:
            "Earlier figure. Line rate locked to 120 Hz. The sharp stripes are gone. Slow waves remain.",
        },
        {
          kind: "image",
          src: "/projects/3d-imaging-uav/flicker-after.png",
          alt: "Grayscale image of a stationary scene after paired exposures, without the sharp flicker stripes",
          fit: "contain",
          label: "Paired exposures",
          caption:
            "Earlier still-scene figure. Two exposures 12.5 ms apart, averaged. The notes on it report 0.8% line-to-line jitter and 1.2% drift over 60 seconds. The sensor was not rotating.",
        },
      ],
    },
    {
      id: "mechanics",
      discipline: "Off the probe",
      goal: "Run the board and the sensor on their own 3.3 V, with the J-Link gone, and plot one live scan.",
      design:
        "Two images are in the source. The plain build has no Bluetooth. It prints text over SEGGER RTT, which the J-Link reads out of RAM: \"dark 0\" every 40 lines, the exposure, and one CSV of pix[]. The BLE build advertises as 360imager. After pix[] is complete it queues a 206-byte packet and a lower-priority thread sends it on the Nordic UART Service TX characteristic. The packet is little-endian: sync A5 5A, version 1, line number, exposure, 128 pixels packed at 12 bits, and a checksum. Splits follow the MTU. Nothing is retransmitted, so a drop is a gap in the line number. The receiver script already knows this packet, and today it draws a scrolling image. The plot we want is the latest valid line, index against brightness. Wireless firmware update is not on this image.",
      challenges: [
        "The J-Link Vcc clip and a second 3.3 V supply must not be connected at the same time.",
        "Legacy advertising is 31 bytes. A later update image would have to advertise the name and the SMP UUID, and the plot script would find the UART service after it connects.",
        "MCUboot can run on this chip in this SDK. It is not enabled, it cannot install itself, and secure boot stays off. An application that never starts Bluetooth still needs the probe.",
        "The lens has to get smaller and then stay fixed. If it moves, the picture changes, and the row does not collect enough light. It is on the bench. It is not on the sensor.",
      ],
      iterations: [
        "J-Link attached. That is the earlier bench photo.",
        "A spinner turns on the bench, as a stand-in for the flyer. The line sensor is not mounted on it, and no speed is written down.",
        "BLE image written. A later try never got a flash through. The wires had come loose.",
        "Own 3.3 V supply, probe disconnected, one plotted scan. Not done. Angle and a panorama come after that.",
      ],
      finalImplementation:
        "The acquisition source is written. The rotating panoramic imager is not, and neither is a live plot with the probe unplugged.",
    },
  ],
  designDecisions: [
    {
      id: "dark-pair",
      title: "Subtract a dark frame, then average a second pair when it fits",
      problem:
        "A raw burst still carries offset, fixed pattern, and light collected while the sensor is flushing. Room light at 120 Hz can also land on a different phase every line.",
      alternatives: [
        "Plot the raw ADC burst and treat the offset as part of the scene.",
        "Subtract one dark frame and stop there.",
        "Subtract the dark frame, and if the pair fits in 12.5 ms, take a second pair and average.",
      ],
      tradeoffs:
        "The second pair cancels one cycle of 120 Hz flicker and costs another integration. It mixes two views if the sensor has moved. A log line that says \"dark 0\" only means the subtraction already happened.",
      choice:
        "The source does the dark subtraction every line, and the second pair when it fits. That code has not been run on this board. The still-scene figures above are earlier, with the sensor sitting still.",
    },
    {
      id: "hw-readout",
      title: "Clock the pixels in hardware, and finish the line before any radio",
      problem:
        "Bit-banging CLK, or sending Bluetooth from inside the readout, stretches the pixel timing and the exposure.",
      alternatives: [
        "Toggle CLK in a CPU loop and read the ADC from that same loop.",
        "Let a timer and the GPIO make CLK, and have the ADC sample on the falling edge.",
        "Start the radio as soon as the first pixel arrives.",
      ],
      tradeoffs:
        "The hardware path is less flexible, and it hardcodes AO as P1.11. It also keeps the CPU out of the burst. The radio waits until pix[] is complete, then a lower-priority thread sends a copy. Dropped packets are not retried.",
      choice:
        "READOUT_HW is 1. CLK is hardware-timed at 125 kHz, the sample is triggered through DPPI, and Bluetooth is not sent from inside the readout. This has not been run on this board.",
    },
    {
      id: "power",
      title: "Leave the J-Link as the only supply until the probe comes off",
      problem:
        "The goal is a board and sensor on their own 3.3 V, with no J-Link, streaming scans. Today the probe is also the supply.",
      alternatives: [
        "Clip a second 3.3 V supply onto VCC while the J-Link Vcc lead is still attached.",
        "Flash and check the log with the probe on, then move power and disconnect the probe completely.",
      ],
      tradeoffs:
        "Two supplies on that rail at once can fight. Taking the probe off also takes away RTT and the ability to flash. The BLE image has to already be advertising before that unplug means anything.",
      choice:
        "One flash with the J-Link, confirm \"bluetooth advertising as 360imager (0)\" while the probe is still on, then a separate 3.3 V supply and the probe disconnected. That sequence has not been run.",
    },
  ],
  rootCauseAnalyses: [
    {
      id: "flicker",
      title: "The stripes were the lights",
      symptoms:
        "An earlier stationary scene came out as vertical stripes. The spacing followed the line rate, not an edge in the room.",
      rootCause:
        "Room lighting flickers at 120 Hz. Lines taken at different phases recorded that flicker as if it were the image.",
      method:
        "Those earlier figures compare a free-running line rate, a rate locked to 120 Hz, and two exposures 12.5 ms apart. The locked rate cleared the stripes and left slow waves. The 12.5 ms spacing is 1.5 cycles of an ideal 120 Hz sine.",
      improvement:
        "On the earlier still scene, the notes report 0.8% from line to line and 1.2% of drift over 60 seconds. That sensor was not rotating.",
      alsoConsidered:
        "A dead pixel column or a loose analog wire can also make a vertical feature. Those would not move when the line rate changes. Pixels 0 through 3 in the current source are copies of pixel 4, which is a different edge effect.",
      notYet:
        "The same pair on this board, and the same pair during rotation. If the sensor moves between the two exposures, the average mixes two angles.",
    },
    {
      id: "no-flash",
      title: "The flash never took",
      symptoms:
        "Everything looked plugged in, and there was no sign the board was taking a program. I couldn't tell whether it even had power.",
      rootCause:
        "The note from that session: the wires had come loose, and one attachment passed power and not data. I didn't write down which connector that was.",
      method:
        "I checked the board with a multimeter. There is no voltage written down from that check, and the meter in the photo is not a number I'm quoting.",
      improvement:
        "Not fixed. I don't have a later log that shows a successful flash, or a line that says the board is advertising.",
      alsoConsidered:
        "A missing toolchain path can look like a board that never answers. The laptop log says it can't detect the toolchain path from the build. The note, separately, says the wires had come loose.",
      notYet:
        "A flash that actually lands, with the probe still on, before any second supply is connected.",
      media: {
        kind: "image",
        src: "/projects/3d-imaging-uav/meter.jpg",
        alt: "Handheld multimeter on the bench, probes held on a wired board, display not a recorded reading",
        portrait: true,
        fit: "contain",
        label: "Meter check",
        caption:
          "Probes on the wired board. The display is not a voltage I wrote down.",
      },
    },
  ],
  evolution: [
    {
      id: "finger",
      phase: "Bench",
      title: "An earlier pipeline check",
      description:
        "A finger across the sensor, no lens. The figure shows broad dark bars. That checked an earlier acquisition, not this hardware readout, and not the focus.",
    },
    {
      id: "stripes",
      phase: "Light",
      title: "Stripes, then a timed pair",
      description:
        "120 Hz room light drew vertical stripes on a still sensor. The current source subtracts a dark frame and averages a second pair 12.5 ms later when the first pair fits. That source has not been run here.",
    },
    {
      id: "readout",
      phase: "Readout",
      title: "Hardware clock, not a CPU loop",
      description:
        "CLK on P1.08 is timer-driven at 125 kHz. The ADC samples on the falling edge. The loop is 25 ms. Pixels 0 through 3 copy pixel 4. No build of this path is in the tree.",
    },
    {
      id: "flash",
      phase: "Bench",
      title: "The wires, then no program",
      description:
        "The boards on the bench are tied with magnet wire. The note says those wires had come loose, and one attachment passed power without data. The laptop in the lab is open to nRF Connect, and the log repeats that it can't detect the toolchain path from the build. I'm not reading a version number off that screen. The source notes still target nRF Connect SDK v3.4.1. Neither the screen nor the note is a successful program of this board.",
      media: {
        kind: "image",
        src: "/projects/3d-imaging-uav/magnet-wire.jpg",
        alt: "Green board wired to a perfboard with magnet wire, held over the bench",
        portrait: true,
        fit: "contain",
        label: "Magnet wire",
        caption:
          "Magnet wire between the green board and the perfboard. The note says the wires had come loose.",
      },
    },
    {
      id: "spin",
      phase: "Mechanics",
      title: "A spinner, without the row",
      description:
        "The plan is to put the line sensor on a slip ring, on a motor that already spins, so the bench can stand in for the flyer. Then the speed gets controlled, and the lens has to sit on the row and stay there. The clip is that assembly turning. The sensor is not on it, and I didn't write down a speed.",
      media: {
        kind: "video",
        src: "/projects/3d-imaging-uav/spin.mp4",
        poster: "/projects/3d-imaging-uav/spin-poster.jpg",
        alt: "A small assembly spinning on the bench, with a ribbon cable off the center",
        portrait: true,
        fit: "contain",
        label: "Spinner",
        caption:
          "The assembly turning. The line sensor is not mounted on it. No speed is written down.",
      },
    },
    {
      id: "radio",
      phase: "Next",
      title: "One scan, off the probe",
      description:
        "Flash the BLE image once with the J-Link, read \"bluetooth advertising as 360imager (0)\", then power the board from its own 3.3 V and unplug the probe. The plot is index against brightness. Angle, a panorama, and a wireless firmware update come after a live scan.",
    },
  ],
  results: {
    items: [
      {
        title: "Earlier lines, not this readout",
        body: "The finger test shows a sensor responding, with no lens. Vertically, 128 pixels. Horizontally, time. It is not a run of the hardware-timed readout, and it is not a panorama.",
      },
      {
        title: "No live scan yet",
        body: "The BLE packet is specified: 206 bytes, sync A5 5A, version 1, line number, exposure, 128 pixels at 12 bits, checksum, no retransmission. Nothing on this board has advertised as 360imager, and nothing has been plotted from that packet.",
      },
      {
        title: "The spinner is not the imager",
        body: "A motor that already spins is the stand-in for the flyer. The clip shows that assembly turning. The line sensor is not on it, the lens is still on the bench, and no angle is paired with a scan.",
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
          "Earlier figure. Vertically, the sensor's 128 pixels. Horizontally, successive acquisitions over time. No lens. Not a run of the current readout, and not a panoramic image.",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/over-spinner.jpg",
        alt: "A wired perfboard and green board held over a black spinner on the lab bench",
        portrait: true,
        fit: "contain",
        label: "Over the spinner",
        caption:
          "The wired board held over the spinner. The row is not mounted, and this is not a scan.",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/lens.jpg",
        alt: "A black lens sitting on the bench, not mounted on a sensor",
        portrait: true,
        fit: "contain",
        label: "Lens",
        caption:
          "The lens on the bench. It still has to get smaller, and it has to stay fixed. It is not on the row.",
      },
      {
        kind: "image",
        src: "/projects/3d-imaging-uav/round-board.jpg",
        alt: "A small round purple board held in a white printed ring",
        portrait: true,
        fit: "contain",
        label: "Round board",
        caption:
          "A round board in a printed ring. The notes don't give this part a name, so this is not the TSL1401.",
      },
    ],
    limitations: [
      "The hardware readout and the Bluetooth path have not been run on this board. There is no build output in the tree.",
      "No live plot of pixel index against brightness. The receiver script, as it stands, draws a scrolling image.",
      "No 360° reconstruction. Lines are not tagged with angle, and the sensor is not rotating.",
      "The J-Link is the 3.3 V supply, the programmer, and the text log. Wireless flashing is not enabled.",
      "No UAV flight. The spinner is a bench stand-in. The line sensor is not mounted on it.",
      "The lens is not on the row. It still has to be made smaller and then held fixed.",
      "The latest flash didn't land. The meter check has no number written down.",
    ],
  },
  reflection: {
    surprises: [
      "The pixel is still an analog voltage on AO. The image does not start until the ADC samples it, and a stack of those lines is still not a panorama.",
    ],
    redesign: [
      "Plot the latest valid pix[] as index against brightness, instead of a scrolling image, once a packet actually arrives.",
      "Record angle with the line, instead of assuming a constant spin after the fact.",
    ],
    future: [
      "Flash the BLE image once over the J-Link and confirm the advertising log before touching the supply.",
      "If that log dies after the readout line, switch the BLE clock source to the internal RC and flash again.",
      "Only then connect a separate 3.3 V supply and disconnect the J-Link.",
      "After a live scan, one more probe flash can add MCUboot for later updates. Secure boot stays off. That bootloader is not on this image.",
    ],
    questions: [
      "Once the sensor is turning, does the 12.5 ms pair still cancel flicker, or does it blend two angles?",
      "How short does the exposure have to be before one pixel smears by one angular step?",
      "After the lens is smaller, what holds it in one place so the picture and the light on the row stay the same?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Charge is the brightness, until the converter. The photodiode integrates current for exp_us. The voltage on AO is that charge, still analog. The SAADC sample, 12 bits across 3.6 V, is the first digital value. pix[128] is a line. It becomes a column of a panorama only after it has an angle.",
    },
    {
      kind: "observation",
      text: "Forty lines a second is a time base. It becomes an angular step only while the rotation speed is known. A stall, or a spin that is not constant, would pack those lines into the wrong angles. The spinner in the clip is turning. The line sensor is not on it, and no speed is written down.",
    },
  ],
};
