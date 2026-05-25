import type { ProjectMedia } from "@/data/projects";

/**
 * Project card / hero videos live in public/projects/.
 * Add an entry here, drop the video in public/projects/ (.mp4 or .MOV), and set an optional poster .png.
 */
export const PROJECT_CARD_VIDEOS = {
  saber: {
    src: "/projects/fullsaber-web.mp4",
    poster: "/projects/saberwhite.png",
    alt: "Lightsaber build demo",
  },
  bloombot: {
    src: "/projects/makingbloombot.mp4",
    poster: "/projects/saberwhite.png",
    alt: "BloomBot IoT build and demo",
  },
  "arduino-tetris": {
    src: "/projects/arduinotetris.mp4",
    alt: "Arduino Tetris handheld demo",
  },
  pennplates: {
    src: "/projects/pennplates.mp4",
    poster: "/projects/website-1.png",
    alt: "Penn Plates app demo",
  },
  "bhangra-coach": {
    src: "/projects/coverbhangraform.mp4",
    poster: "/projects/bc1.png",
    alt: "Bhangra Coach demo",
  },
  "count-coach": {
    src: "/projects/count-coach-demo.mp4",
    poster: "/projects/count-coach-poster.png",
    alt: "Count Coach demo",
  },
} as const satisfies Record<
  string,
  { src: string; poster?: string; alt: string }
>;

export type ProjectVideoKey = keyof typeof PROJECT_CARD_VIDEOS;

/** Use in projects.ts: media: projectVideo("saber") */
export function projectVideo(key: ProjectVideoKey): ProjectMedia {
  const item = PROJECT_CARD_VIDEOS[key];
  return {
    kind: "video",
    src: item.src,
    ...("poster" in item && item.poster ? { poster: item.poster } : {}),
    alt: item.alt,
  };
}
