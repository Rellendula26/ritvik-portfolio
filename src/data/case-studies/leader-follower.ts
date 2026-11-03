import type { EngineeringCaseStudy } from "@/data/engineering-case-study";

export const LEADER_FOLLOWER_CASE_STUDY: EngineeringCaseStudy = {
  slug: "leader-follower-robotic-arm",
  motivation: {
    why: "Serpent wants one arm to follow another so an operator can move a leader and have the follower copy it.",
    interest: "A still follower can be power, a held serial port, or a packet that never arrived.",
    learning: "I wanted a check that separates a missing packet from a motor with no voltage.",
    narrative:
      "The point is a cut with the operator still on the ground. A small leader arm stays down here. The follower arm is meant to sit up on the climbing robot and do the cutting. I wrote the bridge that turns the leader's joint angles into follower motion, so nobody has to type a command for every move.\n\nGetting that off the shop network took a fixed address out of the path. On Wi-Fi the sender aimed at 10.177.7.163. On an iPhone hotspot the follower was 172.20.10.8, and on a Razr hotspot it was 192.168.118.37. The sender now looks up serpentpi-follower.local and checks again every 15 seconds. The blue and white bench pair is not mounted on SR-01. In the shop the white follower sits on an extrusion frame.\n\nA still follower was not one fault. The first motor pack was dead on a multimeter. After it was replaced, the board read 12 V, and I checked each motor connection for a voltage drop. The servos still report about 4.8 to 5.0 V. The motion that runs still jitters.",
    requirements: [
      "Keep a small leader with the operator on the ground.",
      "Drive a follower up on the robot so the robot can cut.",
      "Hold position if the link is quiet for 300 ms, and limit a step to 15°.",
      "Work on Wi-Fi, and on a hotspot both Pis can join when that network changes.",
    ],
  },
  systemOverview: {
    summary:
      "Pi 1 reads the leader. Pi 2 drives the follower. The network carries joint angles, not a video of the arm. Six Feetech STS3215 servos sit on the white arm, on a 12 V battery. Both Pis have to be up. A process that already holds the follower's serial port looks exactly like a follower that is ignoring new commands.",
    subsystems: [
      { name: "Leader sensing", role: "Smaller blue arm. Servo feedback is the pose." },
      { name: "Computing", role: "Two Raspberry Pis. Pi 1 sends angles. Pi 2 makes the follower commands." },
      { name: "Actuation", role: "Six STS3215 servos. Different torque motors were placed in different joints when the arm was built." },
      { name: "Power", role: "A 12 V motor pack on the follower board. Pi 2's 5 V supply is a separate fault." },
    ],
    dataFlow: "Leader joint angles, then the network, then follower servo commands.",
    controlFlow:
      "A 300 ms silence holds position. A step is limited to 15°. The USB-C controller address has to be set again after the cable is unplugged.",
    signalPath: [
      { title: "Leader sensing", detail: "Servo feedback on the blue arm is the pose." },
      { title: "Pi 1", detail: "Reads the joints and sends the angles." },
      { title: "Network", detail: "UDP angles. A fixed IP broke on each hotspot. Lookup by name, every 15 s." },
      { title: "Pi 2", detail: "The bridge I wrote turns those angles into follower commands." },
      { title: "STS3215", detail: "Six servos on the white arm." },
    ],
    powerPath: [
      { title: "Motor pack", detail: "Dead on the meter. Replaced. The board then read 12 V." },
      { title: "Each joint", detail: "I checked the motor connections one at a time for a drop. No per-joint number is written down." },
      { title: "Servo report", detail: "The servos report 4.8 to 5.0 V. That is not a meter reading at the plug." },
      { title: "Pi 2", detail: "Separate undervoltage on its 5 V supply. Not fixed. It needs 5.1 V at 3 A." },
      { title: "USB-C", detail: "Follower controller. The port address is set again after an unplug." },
    ],
    diagram: {
      kind: "image",
      src: "/projects/leader-follower-robotic-arm/frame-bench.jpg",
      alt: "White follower arm on an aluminum extrusion, with a multimeter on the bench",
      label: "Follower on the frame",
      caption:
        "The white follower on the shop frame during the hotspot session. A meter is on the bench. This is not SR-01, and the probes are not on a joint in this photo.",
      fit: "cover",
    },
  },
  contribution: {
    summary:
      "I wrote the bridge. The Oct 29 session took it off a fixed IP: the sender looks Pi 2 up by name every 15 seconds. When the follower sat still, I metered a dead motor pack, then checked each motor connection for a drop.",
    mine: [
      "The bridge between the two Pis: leader joint angles in, follower servo commands out.",
      "The network path: Wi-Fi, then one hotspot, then a hotspot that can change if both Pis join it.",
      "A multimeter on the dead motor pack, then each motor connection, looking for a voltage drop.",
    ],
    alreadyThere: [
      "The blue leader, the white follower, and the six STS3215 servos.",
      "LeRobot, which the bridge runs on.",
      "The 300 ms hold, the 15° step limit, and single-Pi tracking within about 2° before the second Pi.",
    ],
  },
  disciplines: [
    {
      id: "sensing",
      discipline: "Sensing",
      goal: "Get a leader pose without asking the operator to type a joint.",
      design:
        "The leader servos report their own angles. That feedback is the pose Pi 1 sends. I am not adding a separate camera or encoder for this bench.",
      challenges: [
        "Servo feedback only helps if the leader is powered and the bus answers. A quiet leader and a quiet follower are different faults.",
      ],
      iterations: ["Used the servo feedback the arm already had, rather than a new sensor."],
      finalImplementation:
        "The pose source is the leader's own servos. I have not logged a separate check that each leader joint is reporting.",
    },
    {
      id: "link",
      discipline: "Communication",
      goal: "Get angles from Pi 1 to Pi 2 without a typed command on every move.",
      design:
        "I wrote the bridge. Joint angles go from Pi 1 to Pi 2 over UDP, because teleop wants the newest command, not a backlog of old ones. Silence for 300 ms holds the last position, and a commanded step is limited to 15°. On shop Wi-Fi that sender used a fixed follower address, 10.177.7.163. The iPhone hotspot moved Pi 2 to 172.20.10.8, and the Razr hotspot moved it to 192.168.118.37. The sender now looks up serpentpi-follower.local and checks again every 15 seconds, so a new hotspot does not need an edit. Pi 1 as its own access point was written down and not used.",
      challenges: [
        "A sender that logs on time can still be talking to nobody. UDP does not complain when the receiver is gone.",
        "On the iPhone hotspot, pings ran about 26 to 72 ms with a 449 ms spike. The 300 ms hold then froze the arm. The Razr hotspot measured about 3 to 27 ms. Wi-Fi power saving made the slow link worse, so it is off.",
      ],
      iterations: [
        "Single-Pi teleop came before the second Pi. That tracking was within about 2°.",
        "Wi-Fi with a fixed IP, then one hotspot with the address edited by hand, then a name lookup that follows the hotspot.",
      ],
      finalImplementation:
        "Teleoperation runs without a typed command on those three networks. The clip at the top is that session: I move the blue leader, and the white follower is on the shop frame. It is not the follower up on SR-01. The motion still jitters.",
    },
    {
      id: "actuation",
      discipline: "Actuation",
      goal: "Turn those angles into motion on six joints that were not built with the same motor.",
      design:
        "Pi 2 drives six Feetech STS3215 servos. Motors with different torques were placed in different joints when the arm was built. The controller is USB-C, and the port address has to be set again after the cable comes out.",
      challenges: [
        "A stale address and a process that already holds the serial port both look like servos that refuse new commands.",
        "The motion that does run is still jittery. Raising the rate to 60 Hz and turning smoothing on in the same change stopped teleop, so that pair was rolled back. The next pass is one change at a time.",
      ],
      iterations: [
        "The printed arm and gripper in the clips were moved by hand so the housings and the linkage could be seen.",
        "On the frame, the motor leads land on the driver board's screw terminals, with USB-C into that board.",
      ],
      finalImplementation:
        "The six-servo follower can mirror on known hotspots. Jitter is still the open motion problem.",
      media: [
        {
          kind: "video",
          src: "/projects/leader-follower-robotic-arm/printed-arm.mp4",
          poster: "/projects/leader-follower-robotic-arm/printed-arm-poster.jpg",
          alt: "Printed arm held up so the joint housings are visible",
          label: "Printed arm",
          caption:
            "Joint housings and wiring, with a person moving the arm. This clip is not the follower tracking the leader.",
          portrait: true,
        },
        {
          kind: "image",
          src: "/projects/leader-follower-robotic-arm/driver-board.jpg",
          alt: "Follower driver board with a USB-C cable and motor wires on a terminal block",
          label: "Driver board",
          caption:
            "USB-C into the follower driver, and the motor leads on the screw terminals. A red LED on this board is lit. This photo is not a voltage reading.",
          fit: "cover",
        },
      ],
    },
    {
      id: "power",
      discipline: "Power",
      goal: "Keep the Pi and the six servos up on the follower side.",
      design:
        "The follower motors sit on a 12 V pack through the driver board. Pi 2's 5 V supply is a different fault: it logs undervoltage and needs 5.1 V at 3 A. The servos report 4.8 to 5.0 V while the board, after the pack was replaced, measured 12 V. I am not calling the servo report the rail.",
      challenges: [
        "A drained pack parks the motors and looks like a dead link. A drop on one motor lead can do the same thing to one joint.",
      ],
      iterations: [
        "Metered the first pack and found it dead, before treating the silence as a bridge bug.",
        "With the board at 12 V, checked each motor connection for a voltage drop. I don't have a per-joint number from that pass.",
      ],
      finalImplementation:
        "The dead pack is established, and the board read 12 V after it was replaced. The servo-plug meter check, and a fix for Pi 2's undervoltage, are not.",
      media: {
        kind: "image",
        src: "/projects/leader-follower-robotic-arm/probing-driver.jpg",
        alt: "Multimeter probes on the follower driver board",
        label: "Meter on the driver",
        caption:
          "Probing the follower driver while a red LED is on. This frame does not show the number on the meter.",
        fit: "cover",
      },
    },
  ],
  designDecisions: [
    {
      id: "measure-first",
      title: "Meter the battery before rewriting the bridge",
      problem: "A still follower can be power, a held serial port, a stale USB-C address, or a packet that never arrived.",
      alternatives: [
        "Rewrite the bridge because the sender log looks fine.",
        "Measure the shared battery first.",
      ],
      tradeoffs:
        "A sender log is fast to trust and does not prove the follower got the packet. The meter takes a minute and only answers the supply.",
      choice:
        "I measured the motor pack with a multimeter. It was dead. After it was replaced and the board read 12 V, I checked each motor connection for a drop.",
    },
    {
      id: "bridge",
      title: "Write a bridge instead of typing each move",
      problem: "An operator on the ground cannot type a joint command for every cut.",
      alternatives: [
        "Type or click a command for each follower move.",
        "Read the leader servos and send those angles continuously.",
      ],
      tradeoffs:
        "A bridge has to stay up on both Pis. A typed command is slower, and it makes a dropped packet obvious because nothing else is moving.",
      choice:
        "I wrote the bridge. Pi 1 sends leader angles. Pi 2 drives the six STS3215 servos. A 300 ms silence holds, and a step stops at 15°.",
    },
    {
      id: "hotspots",
      title: "Leave shop Wi-Fi without losing the pair",
      problem: "The robot will not be on the shop network when it cuts.",
      alternatives: [
        "Keep the hard-coded follower IP that worked on shop Wi-Fi.",
        "Edit that address by hand for each hotspot.",
        "Look the follower up by name every 15 seconds.",
        "Make Pi 1 its own access point, at a fixed 10.42.0.1. Those scripts were written and not used.",
      ],
      tradeoffs:
        "A fixed IP is simple until DHCP moves. The iPhone subnet was 172.20.10.x and the Razr was 192.168.118.x, so one static address cannot fit both. A name lookup moves with the hotspot, and it fails if that hotspot blocks multicast. An access point on Pi 1 would skip the phone, and it would also take the radio off any other network.",
      choice:
        "The sender looks up serpentpi-follower.local and rechecks every 15 seconds. Wi-Fi power saving is off. The access-point scripts stayed unused.",
    },
  ],
  rootCauseAnalyses: [
    {
      id: "dead-pack",
      title: "The follower sat still",
      symptoms:
        "The leader moved and the follower did not. From across the bench that is one symptom. It does not say which layer stopped.",
      alsoConsidered:
        "Missing power, a disconnected path, and a software hold all park the arm. A process that already owns the follower's serial port will ignore new commands. A USB-C address that was not set again after an unplug will too. A sender that is logging on time can still be sending angles that never arrive. I treated those as open until a measurement closed one of them.",
      method:
        "One layer at a time. A sender log at a steady rate only proves the sender is running, so the next check was whether the destination address was still Pi 2. With the network set aside, I metered the motor pack and found it drained. After that pack was replaced, the board read 12 V. The servos still reported 4.8 to 5.0 V, so I checked each motor connection for a drop between the board and the joint. A scan with Wi-Fi off failed the same way, which put the fault on the servo side rather than the hotspot. I don't have a per-joint drop written down, and I have not metered the voltage at a servo plug.",
      rootCause:
        "The first motor pack could not hold voltage, so the servos stalled and dropped off the bus. That is separate from Pi 2 browning out on its own 5 V supply. The meter closes the dead-pack question. It does not close the serial port, the per-joint drop, or the jitter.",
      improvement:
        "I do not have a note that says I installed a fresh pack and then retested. Teleoperation does run: Wi-Fi, then one hotspot, then a hotspot both Pis join. The clip at the top is the bench pair, with a hand on the blue leader and the white gripper changing pose. The motion still jitters. The printed-arm and gripper clips are a hand on the parts, not that teleop.",
      notYet:
        "Meter the reported 5 V. Power-cycle the pair and see whether that clears a held port, a stale address, or neither. Mount the follower up on SR-01 and run the same bridge there. A motor supply the Pi does not share is a build change, not a test I have run.",
    },
  ],
  evolution: [
    {
      id: "single",
      phase: "One Pi",
      title: "Tracking on a single Pi",
      description:
        "With leader and follower on one Pi, the follower motors tracked the leader within about 2°. The next step was a second Pi over the network.",
    },
    {
      id: "wifi",
      phase: "Wi-Fi",
      title: "Teleoperation on the shop network",
      description:
        "I wrote the bridge. Leader angles went to the follower over Wi-Fi, without a typed command on each move.",
    },
    {
      id: "one-hotspot",
      phase: "One hotspot",
      title: "Off the shop network",
      description:
        "On the iPhone hotspot Pi 2 was 172.20.10.8, not the shop address. The sender had to be pointed at that new address or the follower stayed quiet.",
    },
    {
      id: "either-hotspot",
      phase: "Changing hotspot",
      title: "Both Pis join whichever hotspot is up",
      description:
        "A Razr hotspot moved Pi 2 again, to 192.168.118.37. The sender now looks the follower up by name every 15 seconds, so that change does not need an edit.",
    },
    {
      id: "battery",
      phase: "Supply",
      title: "Dead motor pack",
      description:
        "The motor pack was dead on the meter. After it was replaced, the board read 12 V, and I checked each motor connection for a drop.",
    },
    {
      id: "open",
      phase: "Open",
      title: "Mirroring, with jitter",
      description:
        "On known hotspots the follower mirrors the leader without typed commands. The motion is jittery. The 4.8 to 5.0 V servo report is still not a meter reading, Pi 2's undervoltage is not fixed, and I have not power-cycled the pair.",
    },
  ],
  results: {
    items: [
      {
        title: "Supply",
        body: "The motor pack was dead on the meter. After it was replaced, the board read 12 V. I then checked each motor connection for a voltage drop, and I don't have a per-joint number from that pass.",
      },
      {
        title: "Motion",
        body: "Single-Pi teleop tracked within about 2°. Over the network it works on shop Wi-Fi, on one hotspot, and on a hotspot the sender finds by name. The clip here is that session: I move the blue leader, and the white follower is on the shop frame. It is not the arm on SR-01. The motion jitters.",
      },
    ],
    media: [
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/with-me.mp4",
        poster: "/projects/leader-follower-robotic-arm/with-me-poster.jpg",
        alt: "Ritvik moving the blue leader while the white follower sits on an aluminum frame",
        label: "Hotspot teleop",
        caption:
          "I move the blue leader for 20 seconds. The white follower is on the shop frame, not on SR-01. This is the session where the hotspot path was running.",
      },
      {
        kind: "video",
        src: "/projects/leader-follower-robotic-arm/gripper.mp4",
        poster: "/projects/leader-follower-robotic-arm/gripper-poster.jpg",
        alt: "Hand moving a printed gripper linkage",
        label: "Gripper",
        caption:
          "Printed gripper, moved by hand. A Feetech box is in the background. This is not a teleop recording.",
        portrait: true,
      },
    ],
    limitations: [
      "The bench clip is not the follower mounted up on SR-01.",
      "The 4.8 to 5.0 V figure is a servo report. I have not metered it at a servo plug.",
      "Pi 2's undervoltage is separate from the motor pack, and it is not fixed.",
      "A power cycle was not tested, so I don't know if it clears the port, the address, or neither.",
      "Jitter is still there. I have not established which joint or which packet causes it.",
    ],
  },
  reflection: {
    surprises: [
      "A drained motor pack looks like a network failure until the meter says otherwise. Pi 2 can brown out on its own 5 V supply at the same time.",
    ],
    redesign: [
      "Meter the servo plug before trusting the 4.8 to 5.0 V report, and give Pi 2 its own 5.1 V supply.",
    ],
    future: [
      "Meter the 4.8 to 5.0 V servo report at a plug before raising that rail. The servo labels matter: 12 V on a 7.4 V servo can damage it.",
      "Give Pi 2 a 5.1 V, 3 A supply.",
      "Power-cycle once and write down what comes back: port, address, or both.",
      "Run this bridge with the follower up on the climbing robot.",
    ],
    questions: [
      "Does the jitter show up on one joint, or on every packet?",
      "After a power cycle, is the stuck piece the serial port or the USB-C address?",
    ],
  },
  engineeringNotes: [
    {
      kind: "engineering-note",
      text: "A log line on the sender is not evidence the follower received the packet.",
    },
  ],
};
