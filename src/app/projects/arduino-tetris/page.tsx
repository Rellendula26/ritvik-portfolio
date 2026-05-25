import ProductCaseStudyLayout from "@/components/project-page/ProductCaseStudyLayout";
import type { SystemSection } from "@/components/project-page/SystemBlock";
import { CASE_STUDIES } from "@/data/case-studies";

export const metadata = {
  title: "Arduino TFT Tetris | Ritvik Ellendula",
  description:
    "Handheld Tetris on Arduino Nano and Adafruit ST7735 TFT — SPI graphics, game engine, and tactile controls.",
};

const systems: SystemSection[] = [
  {
    id: "materials",
    step: "01",
    title: "Initial materials",
    subtitle: "Parts before assembly",
    summary:
      "Breadboard, Arduino Nano, ST7735 TFT module, tactile buttons, jumper wire, and discrete components laid out before the handheld build started.",
    responsibilities: [
      "Component inventory",
      "Display module selection",
      "Button + power planning",
    ],
    tools: ["Arduino Nano", "ST7735", "Breadboard"],
    media: {
      kind: "image",
      src: "/projects/initialmaterials.jpg",
      alt: "Initial Tetris project materials on desk",
    },
  },
  {
    id: "setup",
    step: "02",
    title: "Fully wired setup",
    subtitle: "Handheld prototype",
    summary:
      "Completed breadboard build: Nano, TFT with live Tetris gameplay, tactile buttons, and piezo buzzer on a portable perfboard layout.",
    responsibilities: [
      "Full wiring pass",
      "Display + input integration",
      "Playable handheld form",
    ],
    tools: ["Breadboard", "Jumper wires", "Piezo buzzer"],
    media: {
      kind: "image",
      src: "/projects/tetrissettup.jpg",
      alt: "Fully assembled Arduino Tetris handheld",
    },
  },
  {
    id: "gameplay",
    step: "03",
    title: "Gameplay demo",
    subtitle: "Tetris on the TFT",
    summary:
      "Falling-piece engine on the microcontroller: SPI rendering, collision detection, line clears, score tracking, and piezo beeps — no OS.",
    responsibilities: [
      "Falling tetromino engine",
      "Line clear + score",
      "Piezo tone() SFX",
    ],
    tools: ["Arduino C++", "Adafruit GFX", "ST7735"],
    media: {
      kind: "video",
      src: "/projects/arduinotetris.mp4",
      alt: "Tetris gameplay on handheld TFT",
    },
  },
  {
    id: "display",
    step: "04",
    title: "Display bring-up",
    subtitle: "Soldering the ST7735",
    summary:
      "Hands-on solder rework on the TFT leads to stabilize SPI connections when the display was intermittent.",
    responsibilities: [
      "SPI wiring debug",
      "ST7735 init / tab offsets",
      "Physical display repair",
    ],
    tools: ["Arduino Nano", "ST7735", "SPI"],
    media: {
      kind: "video",
      src: "/projects/fixingtetrissolder.mp4",
      alt: "Soldering the Tetris TFT display",
    },
  },
  {
    id: "controls",
    step: "05",
    title: "Controls & dev test",
    subtitle: "Two buttons + laptop",
    summary:
      "Early two-button prototype through the laptop to validate debouncing and game logic before the final handheld controls.",
    responsibilities: [
      "Button debouncing",
      "Input → game state",
      "Serial / dev iteration",
    ],
    tools: ["GPIO", "C++", "Breadboard"],
    media: {
      kind: "video",
      src: "/projects/twobuttonandcomputertetrist.mp4",
      alt: "Two-button Tetris control test with computer",
    },
  },
];

export default function ArduinoTetrisPage() {
  return (
    <ProductCaseStudyLayout
      study={CASE_STUDIES["arduino-tetris"]}
      systems={systems}
    />
  );
}
