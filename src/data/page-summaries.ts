import type { Project } from "@/data/projects";

/** Where it stands, from facts already on the page. */
const STANDS: Record<string, string> = {
  "logic-pcb":
    "One servo moved at 50 Hz on the V2 logic board after GPIO 6 went low. The grip-test control board still needs a replacement.",
  "leader-follower-robotic-arm":
    "Teleoperation runs on shop Wi-Fi and two hotspots. The bench pair is not on SR-01, and the motion still jitters.",
  "bionic-arm":
    "Firmware reads one channel and can run a fixed motor test. It does not classify a gesture, and eight channels are still the plan.",
  "vend-a-shoe":
    "The assembled unit was delivered to the client. Closed-loop sensing is still open.",
  "multimodal-3d-printer":
    "The LCD is supposed to show the encoder angle. The screen in the photo is not showing one.",
  "3d-imaging-uav":
    "The readout and the Bluetooth stream are in the source and have not been run on this board.",
  "ecg-signal-conditioning":
    "The schematic validates and the Gerbers are ready. The board is not built, so the Bode numbers are calculations.",
};

export function projectSummary(project: Project) {
  return {
    what: project.oneLine,
    did: project.contribution || project.keyHighlights[0] || "",
    stands: STANDS[project.slug] ?? project.buildStage,
  };
}

export const EXPERIENCE_SUMMARIES: Record<string, { what: string; did: string; stands: string }> = {
  "serpent-robotics": {
    what: "Teleoperated rope-climbing robots for tree work.",
    did: "I work on the logic and power boards, a BLDC bench bring-up, and the leader-follower bench.",
    stands:
      "The servo path moves on the V2 logic board. The bench arms are not on SR-01, and the saw change is unfinished.",
  },
  "grasp-laboratory": {
    what: "A printer toolhead and a line-sensor imager at GRASP.",
    did: "I am working on the toolhead so the display can show shaft angle, and integrating the line sensor.",
    stands: "The LCD is not showing an angle yet, and the imager readout has not been run on the board.",
  },
  "penn-adapt": {
    what: "Boards and mounts for an assistive arm, plus a one-button keyboard switch.",
    did: "I design the EMG boards and the mounts. One sensor board is built.",
    stands: "Eight channels and gesture control are still the plan.",
  },
  "brainchild-engineering": {
    what: "Client hardware: a shoe dispenser and a tennis-ball launcher.",
    did: "I built the Vend-A-Shoe enclosure and power path, and a tennis-ball launcher with an ESP32, flywheels, and a stepper feed.",
    stands: "Vend-A-Shoe was delivered. The 24 V power mistake is written on that project page.",
  },
  "quantum-opus": {
    what: "SNSPD test benches: fiber paths, attenuation, and a detector pulse on a scope.",
    did: "I set the attenuation and captured the detector pulse.",
    stands: "The pulse is a bench capture. I don't have a saved trace from that check.",
  },
  "stealth-startup": {
    what: "A live interview avatar, and how long it took to start.",
    did: "I traced startup through Next.js, WebRTC, Pipecat, and Tavus, then changed the order the connections came up.",
    stands: "Startup went from 30 seconds to 7 seconds.",
  },
  "penn-spark": {
    what: "Software with Penn SPARK. The piece I can point to is Penn Plates.",
    did: "I built the dining app with student accounts and a loop people can use.",
    stands: "The live app is at pennplates.org.",
  },
};
