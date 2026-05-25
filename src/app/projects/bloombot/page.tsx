import ProductCaseStudyLayout from "@/components/project-page/ProductCaseStudyLayout";
import type { SystemSection } from "@/components/project-page/SystemBlock";
import type { LinkItem } from "@/components/project-page/shared";
import { CASE_STUDIES } from "@/data/case-studies";

export const metadata = {
  title: "BloomBot IoT | Ritvik Ellendula",
  description:
    "IoT robotic flower — Blynk, servos, LCD, LEDs, ultrasonic sensing on Arduino UNO R4 WiFi.",
};

const systems: SystemSection[] = [
  {
    id: "build",
    step: "01",
    title: "Making BloomBot",
    subtitle: "Physical assembly",
    summary:
      "Hands-on build of the flower chassis: mounting servos, wiring petals, and iterating the mechanical structure before IoT control was layered on.",
    responsibilities: [
      "Mechanical assembly",
      "Servo mounting",
      "Wiring layout",
    ],
    tools: ["Servos", "Breadboard", "Hand tools"],
    media: {
      kind: "video",
      src: "/projects/makingbloombot.mp4",
      poster: "/projects/saberwhite.png",
      alt: "Building the BloomBot flower robot",
    },
  },
  {
    id: "setup",
    step: "02",
    title: "Hardware setup",
    subtitle: "LCD + microcontroller",
    summary:
      "Breadboard bring-up with the I2C LCD, power routing, and actuator wiring — the foundation before Blynk commands could drive petal motion reliably.",
    responsibilities: [
      "LCD I2C bring-up",
      "Power distribution",
      "Actuator wiring",
    ],
    tools: ["Arduino UNO R4 WiFi", "I2C LCD", "External PSU"],
    media: {
      kind: "video",
      src: "/projects/bloombotsetup.mp4",
      alt: "BloomBot hardware setup with LCD",
    },
  },
  {
    id: "blynk",
    step: "03",
    title: "Blynk control",
    subtitle: "Remote IoT interaction",
    summary:
      "WiFi-enabled control through Blynk: virtual pins trigger petal animations, LCD updates, and LED patterns from a phone or laptop dashboard.",
    responsibilities: [
      "Blynk virtual pins",
      "WiFiS3 connectivity",
      "Remote command handling",
    ],
    tools: ["Blynk", "WiFiS3", "C++"],
    media: {
      kind: "video",
      src: "/projects/bloombotblynk.mp4",
      alt: "BloomBot controlled via Blynk app",
    },
  },
  {
    id: "demo",
    step: "04",
    title: "Product demo",
    subtitle: "Unified interaction",
    summary:
      "End-to-end demo: servos, Morse LEDs, LCD status, and proximity sensing responding together as one expressive robotic flower experience.",
    responsibilities: [
      "Multi-servo sync",
      "LED + LCD feedback",
      "Live demo polish",
    ],
    tools: ["Blynk", "Ultrasonic", "Servos"],
    media: {
      kind: "video",
      src: "/projects/bloombot-web.mp4",
      poster: "/projects/saberwhite.png",
      alt: "BloomBot product interaction demo",
    },
  },
];

const actions: LinkItem[] = [
  { label: "DEVPOST", href: "https://devpost.com/software/bloombot-8syfva" },
  { label: "PERFORMANCE SKIT", href: "https://www.youtube.com/watch?v=D3Kk4IFN1ps" },
  { label: "SOURCE CODE", href: "https://github.com/Rellendula26/bloombot-iot" },
  { label: "SYSTEMS", href: "#systems" },
  { label: "GALLERY", href: "#gallery" },
];

export default function BloomBotPage() {
  return (
    <ProductCaseStudyLayout
      study={CASE_STUDIES.bloombot}
      systems={systems}
      actions={actions}
      extraTags={["Arduino", "Blynk", "Servos", "IoT", "Embedded C++"]}
    />
  );
}
