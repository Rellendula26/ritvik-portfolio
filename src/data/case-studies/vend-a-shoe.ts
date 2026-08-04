import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

/**
 * Vend-A-Shoe case study. Media: public/projects/vend-a-shoe/
 *
 * Timeline note (confirmed):
 * - June 18–25 = fullvideoinitialdemo.mp4 demo/bring-up window (not travel).
 * - July 18–25 = only travel interruption.
 */
export const VEND_A_SHOE_CASE_STUDY: EngineeringCaseStudy = {
  slug: "vend-a-shoe",
  motivation: {
    why: "I built this at BrainChild Engineering for a client who needed a unit that could leave the lab. A breadboard demo was never the finish line.",
    interest:
      "BloomBot got me comfortable with servos on Arduino. This one stacked packaging, a dense harness, power distribution for motors plus eight LEDs and a fan, and a Pi that had to stay alive on a wall adapter; that mix is what pulled me in.",
    learning:
      "I wanted sharper instincts for debugging across systems, not inside one tidy layer. Mechanical clearance, rail voltage, GPIO maps, and queue state fail together; the useful skill is deciding which system to trust first, then proving it with a supply and a meter instead of rewriting code on a guess.",
  },
  systemOverview: {
    summary:
      "A Next.js dashboard drops bin dispense commands into Supabase. A Raspberry Pi worker claims each row, drives MG996R servos off a soldered protoboard that also feeds eight LEDs and a cooling fan, then writes completed or failed. The harness was the product as much as the queue was; enclosure, power, and dozens of connections were in the loop from the start.",
    subsystems: [
      {
        name: "Enclosure & mounts",
        role: "Onshape assembly with printed mounts, wire covers, and a laser-cut rear panel you can actually open again.",
      },
      {
        name: "Power & protoboard",
        role: "Wall AC to DC / USB-C PD into a soldered protoboard with common ground; one outlet path feeds servos, eight LEDs, the fan, and the Pi.",
      },
      {
        name: "Harness",
        role: "Forty-plus wires for motors, LED runs, fan, and control; lengths and service loops were design constraints, not cleanup.",
      },
      {
        name: "Pi worker",
        role: "Python process claims pending commands, maps bin to GPIO, runs PWM sweeps, persists status.",
      },
      {
        name: "Command queue",
        role: "Supabase device_commands with pending to running to completed or failed; the Pi never needs a public port.",
      },
      {
        name: "Dashboard",
        role: "Existing frontend kept in place; the new backend had to meet its API shape and show queue state clearly.",
      },
    ],
    dataFlow:
      "UI insert; Supabase queue; Pi claim; GPIO and PWM; servos plus eight LEDs plus fan; status write-back.",
    controlFlow:
      "Only the worker owns actuation. The browser never talks to GPIO; claiming by status update keeps two polls from firing the same dispense.",
    diagram: {
      kind: "image",
      src: "/projects/gallery/vend-a-shoe-architecture.svg",
      alt: "Vend-A-Shoe system architecture",
      label: "Control path",
      caption: "Dashboard to queue to Pi to protoboard to servos, LEDs, and fan.",
    },
  },
  timeline: [
    {
      period: "June 11–17",
      work: "Pi bring-up, GPIO/PWM learning, first motor experiments, breadboard and bench-supply basics.",
      friction: "New platform, unknown whether the motors were even good, no EE mentor in the room.",
    },
    {
      period: "June 18–25",
      work: "Early end-to-end path that became fullvideoinitialdemo.mp4: one-motor / two-LED app demo, then more motors as replacements came online.",
      friction: "Several motors were already dead. I kept rebuilding the circuit before a swap test proved the hardware was the problem.",
    },
    {
      period: "June 23–30",
      work: "All four motors working with the app on breadboard; fan in the loop; started moving toward protoboard and wire-length planning.",
      friction: "No protoboard in stock at first. Soldering tools were rough: dull iron, paste instead of wire, no fume extraction.",
    },
    {
      period: "July 1–7",
      work: "Most wiring soldered and labeled; protoboard mounted; diagnosed SSH loss after a Wi-Fi reset changed the Pi's DHCP address; isolated a bad fan joint by substitution.",
      friction: "Dynamic IP, borrowed-monitor dependency, dense harness rework.",
    },
    {
      period: "July 8–15",
      work: "Wire bundling, CAD rear cover, wire covers, mounting, Pi screw-terminal connector, packaging for transport and service.",
      friction: "I had already cut wire lengths before the layout fully froze, so the enclosure had to adapt to the harness.",
    },
    {
      period: "July 18–25",
      work: "Only travel week. While I was away, a 24 V connection likely damaged motors. The team chased faults, including a failed alligator clip; replacements arrived.",
      friction: "That overvoltage mistake was mine. Recovery was slower because there was almost no power-review process or spare-qualified actuators ready.",
    },
    {
      period: "July 27–28",
      work: "Finalized USB-C PD / wall power, corrected LED color mismatch, cleaned up soldering and wire management, got all four motors / eight LEDs / fan running for the client demo.",
      friction: "Too much of the last validation still sat at the deadline.",
    },
  ],
  disciplines: [
    {
      id: "mechanical",
      discipline: "Mechanical",
      goal: "Fit the dispense mechanism, Pi, protoboard, fan, and a dense harness in a compact box that still opens for service.",
      design:
        "Custom Onshape enclosure; printed mounts and extenders; laser-cut rear panel. Clearances and harness paths for motors, eight LEDs, and the fan drove the layout more than the outer silhouette did.",
      challenges: [
        "Four servo positions plus LED runs and a fan left almost no slack once the harness existed.",
        "Eight LEDs needed unique lengths; four per side at different heights.",
        "Wire lengths got cut before the mounting layout froze, so service access and cover clearance became a fight with a forty-plus-wire bundle.",
      ],
      iterations: [
        "CAD packing against real component envelopes, including fan clearance.",
        "Print, fit, remount cycles on brackets, covers, and extenders.",
        "Rear panel cut so cables and rework did not mean a full teardown.",
      ],
      finalImplementation:
        "Integrated mounts, organized routing, removable rear panel. It shipped as one assembly, not a pile of boards in a shell.",
      media: [
        {
          kind: "image",
          src: "/projects/vend-a-shoe/ENTIRECAD.jpg",
          alt: "Full Vend-A-Shoe CAD assembly",
          label: "Full enclosure CAD",
          caption: "Packaging built around servos, LEDs, fan, Pi, and harness; not a generic box.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/3dprintedextenders.jpg",
          alt: "3D-printed mechanical extenders",
          label: "Printed extenders",
          caption: "Printed parts that made the dispense geometry and mounts fit the real box.",
        },
        {
          kind: "video",
          src: "/projects/vend-a-shoe/CAD.mp4",
          alt: "CAD enclosure walkthrough during packaging",
          label: "CAD iteration",
          caption: "Mounts designed around the harness, not the other way around.",
        },
      ],
    },
    {
      id: "electrical",
      discipline: "Electrical",
      goal: "Take a normal AC wall outlet, convert it to usable DC, and power the protoboard, 4 MG996R servos, 8 LEDs, the fan, and the Raspberry Pi from that one path without brownouts or sketchy grounds.",
      design:
        "Bench supply for bring-up; multimeter checks on rails and grounds before trusting a channel. Then a wall AC to DC / USB-C PD path into a soldered protoboard with common ground so the whole unit can leave the bench. This was one of the clearest electrical lessons from the internship: wall power is not just plugging something in; it is conversion, distribution, and load budgeting. Actuator and accessory current stay off the Pi GPIO path; GPIO only signals.",
      challenges: [
        "We planned for four motors; a few were already fried and just sat dead. Later I connected the system to 24 V during a power mix-up and likely damaged more. Sorting wiring versus software versus dead hardware became its own debug loop.",
        "Eight LEDs and a fan added continuous load on top of the servo harness; the wall converter and protoboard had to feed all of that plus the Pi.",
        "Shared Pi power sagged under multi-servo moves; breadboard contacts lied; forty-plus wires made routing a design problem, not a cleanup task.",
        "No experienced EE mentor, dull soldering iron, solder paste instead of proper wire, and no fume extraction. I was also teaching a teammate basic circuits while trying to bring the board up.",
      ],
      iterations: [
        "Bench PSU for controlled bring-up; multimeter on voltage drop, continuity, and common ground before rewriting PWM code.",
        "Swap-test motors and channels; watch LED and fan rails while servos move.",
        "Soldered protoboard for permanence; wall AC to DC path so the packaged unit runs from a basic outlet.",
      ],
      finalImplementation:
        "One wall outlet path into DC distribution on the protoboard. That rail powers the motors, eight LEDs, the fan, and the Raspberry Pi in the shipped assembly.",
      media: [
        {
          kind: "image",
          src: "/projects/vend-a-shoe/wall-ac-dc.jpg",
          alt: "Wall AC to DC power converter for Vend-A-Shoe",
          label: "Wall AC to DC",
          caption:
            "AC wall outlet into DC for the protoboard. Same path feeds the motors, 8 LEDs, fan, and Pi.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/solderedprotoboardfront.jpg",
          alt: "Soldered protoboard front",
          label: "Protoboard front",
          caption: "Soldered permanence after the breadboard stopped being trustworthy.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/solderedprotoboardback.jpg",
          alt: "Soldered protoboard back",
          label: "Protoboard back",
          caption: "Common-ground distribution for servos, LEDs, fan, and Pi power; GPIO stays signal-only.",
        },
        {
          kind: "image",
          src: "/projects/vend-a-shoe/raspberrypiconnector.jpg",
          alt: "Raspberry Pi screw-terminal connector for the harness",
          label: "Pi screw terminals",
          caption: "Screw terminals so harness rework was not another Dupont nest.",
        },
        {
          kind: "video",
          src: "/projects/vend-a-shoe/fanprotoboard-wiresbundled.mp4",
          alt: "Fan on protoboard with bundled harness wires",
          label: "Fan + bundled harness",
          caption: "Fan branch after joints and routing had to become permanent.",
        },
      ],
    },
    {
      id: "embedded",
      discipline: "Embedded",
      goal: "Turn a queued cloud command into one clean dispense motion and a status you can trust.",
      design:
        "Raspberry Pi 4; Python worker; RPi.GPIO PWM. Parses dispense_bin_n, applies per-bin target duty, returns home. systemd keeps the worker up across reboot.",
      challenges: [
        "A silent motor looks identical to a bad pin map until you meter the rail, swap hardware, and prove which layer failed.",
        "SSH disappeared after a Wi-Fi restart because DHCP handed out a new IP. It looked like a deeper OS failure until the address changed.",
        "One shared motion profile over-rotated Bin 3.",
        "Crashes mid-run left ambiguous state until running existed.",
      ],
      iterations: [
        "Standalone scripts on the bench; channel swap tests before blaming software.",
        "Polling worker with a single dispense action.",
        "Four-bin map, duty overrides, systemd unit.",
      ],
      finalImplementation:
        "Claim-by-status worker with bin to GPIO mapping and calibration hooks. The unit wakes into a working loop without a laptop attached.",
      media: [
        {
          kind: "video",
          src: "/projects/vend-a-shoe/firstworkingmotor.mp4",
          alt: "First known-good motor moving under Pi control",
          label: "First working motor",
          caption: "Known-good channel proof before scaling to four lanes.",
        },
        {
          kind: "video",
          src: "/projects/vend-a-shoe/raspberrypimotormove.mp4",
          alt: "Raspberry Pi driving servo motion",
          label: "Pi motor bring-up",
          caption: "GPIO and PWM on the Pi once the channel and the motor were both known-good.",
        },
      ],
    },
    {
      id: "cloud",
      discipline: "Cloud & Integration",
      goal: "Remote dispense without exposing the Pi, while keeping the frontend that already existed.",
      design:
        "Supabase queue as the boundary. New backend bent to the existing Next.js UI instead of rewriting the client.",
      challenges: [
        "API shape had to match an independently built frontend.",
        "Polling delay versus double-fire under concurrent claims.",
        "Cross-stack failures only showed up end to end.",
      ],
      iterations: [
        "Local-only GPIO scripts.",
        "Cloud-connected single action.",
        "Multi-bin queue plus UI status badges.",
      ],
      finalImplementation:
        "Browser click to durable row to physical dispense; completed and failed show up where you already look. The cloud path is software and queueing; wall AC to DC power lives in the electrical section.",
    },
  ],
  designDecisions: [
    {
      id: "controller",
      title: "Raspberry Pi 4 over Arduino / ESP32",
      problem: "Need networking, a real OS, Python worker logic, and GPIO on one board.",
      alternatives: ["Arduino plus a separate network module", "ESP32", "Raspberry Pi 4"],
      tradeoffs:
        "MCU boards win on cost and boot time. Pi wins when the control path is a long-lived worker talking to Postgres.",
      choice:
        "Pi 4. One platform for queue client, GPIO, and systemd; fewer failure domains during client demos.",
    },
    {
      id: "power",
      title: "Wall AC to DC into a shared protoboard rail",
      problem:
        "MG996Rs, eight LEDs, a fan, and the Pi need honest DC from a client-site wall outlet; a Pi USB cable cannot carry that load.",
      alternatives: [
        "Power everything from the Pi",
        "Separate supplies without a shared ground",
        "Wall AC to DC into a common-ground protoboard",
      ],
      tradeoffs:
        "Pi-powered looks tidy until the first multi-servo move plus LED and fan load. Split grounds make GPIO references nasty. Wall conversion adds a part; it is what makes the unit shippable.",
      choice:
        "Wall AC to DC feeding the protoboard, motors, LEDs, fan, and Pi together. Bench PSU and multimeter first; outlet path second. Internship takeaway: conversion and distribution are the product, not an afterthought.",
    },
    {
      id: "assembly",
      title: "Soldered protoboard instead of breadboard or PCB",
      problem: "Need reliability past Duponts without freezing a PCB while mounts were still moving.",
      alternatives: ["Breadboard", "Soldered protoboard", "Custom KiCad PCB"],
      tradeoffs:
        "Breadboard is fast and lies. PCB is right and slow when connectors still drift daily.",
      choice:
        "Protoboard as temporary permanence. Next revision should be a PCB once connector positions stop moving.",
    },
    {
      id: "enclosure",
      title: "Custom enclosure over a generic box",
      problem: "Off-the-shelf cases fight servo geometry and harness exits.",
      alternatives: ["Generic project box", "Custom Onshape enclosure plus printed mounts"],
      tradeoffs:
        "Generic is faster day one. Custom costs CAD time; it buys serviceability.",
      choice:
        "Custom box, printed mounts, laser-cut rear panel. Packaging was a design constraint, not a shell.",
    },
    {
      id: "frontend",
      title: "Adapt backend to existing frontend",
      problem: "UI already existed; backend and hardware were new.",
      alternatives: ["Rewrite the frontend", "Shape the backend to the existing app"],
      tradeoffs:
        "Rewrite cleans the API. Adaptation keeps working UX and forces the interface to stay honest.",
      choice:
        "Keep the frontend. Integration bugs beat a second UI rewrite on an internship clock.",
    },
  ],
  rootCauseAnalyses: [
    {
      id: "silent-servos",
      title: "Silent servos",
      symptoms:
        "Motors sat quiet or barely twitched even when the wiring and code looked right.",
      rootCause:
        "Some motors were already damaged before I got them. Later, the 24 V mistake likely took out more. Bad contacts, weak supply current, wrong PWM, and dead hardware all look the same from the outside.",
      method:
        "Swap in a known-good motor, swap channels, meter the rail, change one variable at a time.",
      improvement:
        "Burn in every actuator before it hits the harness. Keep one golden motor and one golden channel.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/firstworkingmotor.mp4",
        alt: "First working motor after isolating a known-good channel",
        label: "Known-good proof",
        caption: "Substitution beat another full rebuild of a maybe-dead lane.",
      },
    },
    {
      id: "overvoltage",
      title: "24 V on a low-voltage servo system",
      symptoms:
        "Motors that had been working failed around the July 18–25 travel week after a bad power connection.",
      rootCause:
        "I connected the system to 24 V. An MG996R is not just a motor; it has a control board and driver electronics. Excess voltage can kill the electronics immediately and overheat the winding. At stall, current rises with voltage and heating rises with I²R.",
      method:
        "Own the mistake, stop guessing about firmware, replace the damaged units, and bring the system back up on a known rail with a meter.",
      improvement:
        "Keyed low-voltage connector, fuse or PTC per branch, reverse-polarity / overvoltage protection, labeled rails, and a short pre-power checklist before anyone energizes the harness.",
    },
    {
      id: "ssh-dhcp",
      title: "SSH disappeared after Wi-Fi reset",
      symptoms:
        "Could not SSH into the Pi after a network restart. It felt like the machine was dead.",
      rootCause:
        "DHCP gave it a new IP. SSH was fine; I was knocking on the old address. A borrowed monitor dependency made that take longer than it should have.",
      method:
        "Get a local display, read the new address, reconnect, then confirm how hostname access should work next time.",
      improvement:
        "Reserve a static DHCP lease, use mDNS / hostname, and document the fallback monitor path.",
    },
    {
      id: "fan-joint",
      title: "Fan branch that looked like a bigger failure",
      symptoms:
        "Fan or a branch connection dropped out after soldering and packaging.",
      rootCause:
        "A bad solder joint, and separately a failed alligator clip, looked like a wider electrical problem until substitution narrowed it.",
      method:
        "Swap known-good wires, continuity-check the branch, reflow or replace the joint instead of rebuilding the whole board.",
      improvement:
        "Continuity-test each harness branch as it is finished. Temporary clips do not belong in the permanent path.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fanprotoboard-wiresbundled.mp4",
        alt: "Fan on protoboard with bundled harness",
        label: "Fan + harness",
        caption: "Permanent fan branch after the joint and routing had to hold.",
      },
    },
  ],
  evolution: [
    {
      id: "e1",
      phase: "Bring-up",
      title: "Breadboard, four motors, and a bad assumption",
      description:
        "We started with four motors on a floating harness. A few would not move at all; the unanticipated part was that they had already been cooked elsewhere. Wiring, software, and dead hardware all produce the same quiet servo. Proving which one it was became a microcosm of debugging across systems later.",
      media: {
        kind: "image",
        src: "/projects/vend-a-shoe/initialbreadboardwiring.jpg",
        alt: "Initial breadboard wiring during bring-up",
        label: "Initial breadboard wiring",
        caption: "Early architecture proof before anyone trusted a channel.",
      },
    },
    {
      id: "e2",
      phase: "Bench chaos",
      title: "Fan, LEDs, supply, and meter",
      description:
        "Eight LEDs and a cooling fan joined the servo load while the harness grew past forty wires. Bench power supply and multimeter work made sagging rails and bad grounds visible; without that, every flake looked like a software bug.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fanandbreadboard.mp4",
        alt: "Breadboard bring-up with cooling fan",
        label: "Bench bring-up",
        caption: "Fan in the loop; meter on the rail before rewriting code.",
      },
    },
    {
      id: "e3",
      phase: "First demo",
      title: "June 18–25 demo window",
      description:
        "fullvideoinitialdemo.mp4 sits here: early app-triggered path once a known-good motor and channel lined up, then more motors as replacements arrived. This window is demo progress, not travel.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fullvideoinitialdemo.mp4",
        alt: "Full initial Vend-A-Shoe demo from the June 18–25 window",
        label: "Full initial demo",
        caption: "June 18–25 footage of the early end-to-end path.",
      },
    },
    {
      id: "e4",
      phase: "Permanence",
      title: "Soldered protoboard and screw terminals",
      description:
        "Moved signal and power for servos, LEDs, and fan onto soldered joints and Pi screw terminals so the harness survived transport and demos.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/soldering.mp4",
        alt: "Soldering the protoboard",
        label: "Protoboard build",
        caption: "Breadboard habits do not survive a dense harness and a client handoff.",
      },
    },
    {
      id: "e5",
      phase: "Packaging",
      title: "CAD enclosure and printed mounts",
      description:
        "Enclosure revisions tracked real clearances once harness lengths for motors, eight LEDs, and the fan were known; mounts, covers, rear panel. Bundling and wire covers were part of making the unit shippable.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/fanprotoboard-wiresbundled.mp4",
        alt: "Protoboard with fan and bundled wires during packaging",
        label: "Bundled harness",
        caption: "Routing became a designed subsystem once lengths were committed.",
      },
    },
    {
      id: "e6",
      phase: "Ship",
      title: "Wall power and end-to-end dispense",
      description:
        "After the July 18–25 travel week and motor replacements, wall AC to DC cut the bench supply once the meter said the rails were honest. LED color mismatch got corrected. Multi-bin calibration and UI status closed the loop for delivery.",
      media: {
        kind: "video",
        src: "/projects/vend-a-shoe/seconddemo.mp4",
        alt: "Vend-A-Shoe dispense demo",
        label: "Dispense demo",
        caption: "Queued command to physical dispense on the assembled unit.",
      },
    },
  ],
  version2Plan: {
    target:
      "If I built the next unit with what I know now, I would aim for roughly 3–4 calendar weeks of part-time work instead of rediscovering the same failure modes. That only works if parts are available and the connector map freezes early.",
    phases: [
      {
        name: "Freeze the requirements",
        body: "Actuator count, LED behavior, fan, wall input, connector locations, service access, software interface, acceptance tests. One-page diagram and a power budget before cutting wire.",
      },
      {
        name: "Qualify every actuator first",
        body: "Bench-test every servo, LED pair, fan, and converter. Label PASS/FAIL. Keep one golden channel.",
      },
      {
        name: "Prove one complete lane",
        body: "Protected bench supply with current limit. One servo + LED + queue + status write-back for dozens of cycles before scaling to four bins.",
      },
      {
        name: "Freeze power, then build the board",
        body: "Rails, fusing, ground, connectors, gauges. Power review before energizing everything. Prefer a KiCad distribution PCB once the map is stable.",
      },
      {
        name: "Harness, package, validate",
        body: "Cut list, labels both ends, continuity as you go, then mounts and covers. Written test matrix: each bin, reboot, Wi-Fi reconnect, tug test, thermal check.",
      },
    ],
    upgrades: [
      {
        area: "Power",
        change: "Regulated low-voltage supply sized for stall current; fuse/PTC per branch; reverse-polarity and overvoltage protection.",
        benefit: "One bad connection should not kill every actuator.",
      },
      {
        area: "PCB",
        change: "Custom KiCad distribution board with keyed connectors, test points, and clear silk.",
        benefit: "Less hand soldering, fewer polarity mistakes, faster assembly.",
      },
      {
        area: "Networking",
        change: "Static DHCP reservation and mDNS hostname.",
        benefit: "SSH does not disappear every time Wi-Fi resets.",
      },
      {
        area: "Sensing",
        change: "Optical, load, or limit sensing on the dispense path.",
        benefit: "“Servo moved” stops pretending to mean “shoe dispensed.”",
      },
      {
        area: "Build docs",
        change: "Harness drawing, cut list, and a simple test traveler.",
        benefit: "Someone else can build and check the next unit.",
      },
    ],
  },
  transferableSkills: [
    {
      context: "Low-voltage systems",
      evidence:
        "Brought actuators up on a bench supply, then moved to wall-powered distribution with a shared ground, load budgeting, and a harness that had to survive transport.",
      phrasing:
        "Useful anywhere a small mistake on a rail can take out a whole actuator set.",
    },
    {
      context: "Dense packaging",
      evidence:
        "Co-designed enclosure clearances, connector placement, wire covers, and service access so the final box was not just closed, but openable again.",
      phrasing:
        "Useful when the CAD model and the harness disagree and both still have to ship.",
    },
    {
      context: "Cross-layer debugging",
      evidence:
        "Silent motors, DHCP/SSH loss, bad joints, and cloud queue bugs all presented as “it does not work” until meters, substitution, and status transitions isolated the layer.",
      phrasing:
        "Useful when hardware, firmware, and networking fail with the same external symptom.",
    },
    {
      context: "Verification mindset",
      evidence:
        "Commanded motion is not verified delivery. I would add sensing and a written acceptance matrix before calling the next unit done.",
      phrasing:
        "Useful when the cost of a false “success” is higher than the cost of another sensor.",
    },
  ],
  results: {
    items: [
      {
        title: "Client delivery",
        body: "Assembled unit left as a working product; enclosure, dense harness, power, and cloud-triggered dispense included.",
        evidence: "Shipped",
      },
      {
        title: "Multi-bin actuation",
        body: "Each bin maps to its own GPIO path and motion profile; Bin 3 uses a reduced target duty after over-travel showed up in testing. Dead motors got swap-tested out before we trusted the map.",
        evidence: "Calibrated lanes",
      },
      {
        title: "Wall-powered stability",
        body: "Wall AC to DC into a common-ground protoboard carried servos, eight LEDs, the fan, and the Pi without brownouts after bench PSU and multimeter bring-up.",
        evidence: "Wall AC to DC",
      },
      {
        title: "Remote command path",
        body: "Dashboard enqueue; worker claim; status write-back. The Pi stays off the public internet.",
        evidence: "Queue loop",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/vend-a-shoe/entireworkingmodel.mp4",
        alt: "Fully working Vend-A-Shoe model",
        label: "Working model",
        caption: "Assembled system running the full dispense path.",
      },
      {
        kind: "video",
        src: "/projects/vend-a-shoe/seconddemo.mp4",
        alt: "Dispense demonstration",
        label: "Validation demo",
        caption: "End-to-end dispense on the packaged unit.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/wrongLEDsonfinalized.jpg",
        alt: "Finalized assembly where LED color mismatch was caught",
        label: "LED mismatch catch",
        caption: "Late mismatch corrected before handoff, not ignored.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/demo1.jpg",
        alt: "Assembled Vend-A-Shoe",
        label: "Assembled unit",
        caption: "Final mechanical and electrical packaging.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/coverCAD.jpg",
        alt: "Enclosure CAD cover view",
        label: "Enclosure cover",
        caption: "CAD that matches what shipped.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/stage1.jpg",
        alt: "Early Vend-A-Shoe assembly stage",
        label: "Stage 1 assembly",
        caption: "Mid-build packaging before the harness settled.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/motivation1.jpg",
        alt: "Early Vend-A-Shoe bring-up still",
        label: "Early still",
        caption: "Bench state before permanence.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/raspberrypi.jpg",
        alt: "Raspberry Pi in the assembly",
        label: "Pi in place",
        caption: "Screw-terminal harness into the Pi; reworkable, not a Dupont nest.",
      },
    ],
    limitations: [
      "No sensor confirmation of a successful drop; motion complete is not the same as item dispensed.",
      "Protoboard wiring will not scale cleanly past this unit count.",
      "Queue auth is still MVP-grade for a public multi-user deployment.",
      "Not production-ready: no formal safety certification or high-volume validation.",
    ],
  },
  reflection: {
    surprises: [
      "The biggest lesson was how to debug across numerous systems at once. Mechanical, electrical, embedded, and cloud failures share symptoms; the work is picking a layer, measuring it, and only then moving.",
      "Some of the four motors were already fried; the quiet failure looked like bad wiring or bad code until a swap test and a meter reading forced the assumption to break.",
      "I also made a real power mistake: connecting the system to 24 V. I own that. The slow recovery around it also showed how little protection, review, and spare qualification existed in the environment.",
      "Eight LEDs, a fan, and forty-plus wires ate more calendar than the PWM math; harness planning was the real schedule risk.",
      "Bench power supply and multimeter work caught sag and ground issues that software logs never would have named correctly.",
      "Breadboard success did not transfer; permanence changed the failure modes.",
    ],
    redesign: [
      "KiCad PCB with keyed servo, LED, and fan connectors plus onboard regulation and branch protection.",
      "Closed-loop dispense sensing with an optical or limit switch.",
      "Standardized connectors so a failed servo is a module swap, not a re-solder.",
      "Incoming actuator burn-in so dead hardware does not masquerade as a software bug.",
      "Static DHCP reservation / mDNS so SSH does not vanish after every Wi-Fi reset.",
      "Harness drawing and cut list before the first wire length gets committed.",
    ],
    future: [
      "Build the next unit on the Version 2 sequence instead of rediscovering the same blockers.",
      "Injection-aware enclosure consolidation once the connector map freezes.",
      "OTA updates and basic device health.",
      "DFM pass once packaging stops moving daily.",
    ],
    questions: [
      "When does protoboard stop being honesty and start being technical debt?",
      "How should power topology change when every unit also carries LEDs, fans, and dozens of harness branches?",
      "What does maintainability look like when the first owner is not the builder?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "Debugging across systems beats debugging inside one. Pick a layer, measure it, then move.",
    },
    {
      kind: "engineering-note",
      text: "A quiet servo is not a diagnosis. Wiring, software, and fried hardware all look the same until you challenge the assumption.",
    },
    {
      kind: "engineering-note",
      text: "I own the 24 V mistake. Missing protection and review made the recovery more expensive than it needed to be.",
    },
    {
      kind: "observation",
      text: "Bench PSU and multimeter first; rewrite the worker second.",
    },
    {
      kind: "design-insight",
      text: "June 18–25 is the full initial demo window. The only travel week was July 18–25.",
    },
    {
      kind: "design-insight",
      text: "Enclosure design started from harness and service access, not from outer dimensions.",
    },
    {
      kind: "design-insight",
      text: "Protoboard was the right bridge between Duponts and a PCB; it was not the destination.",
    },
  ],
};
