import type { ProjectMedia } from "@/data/projects";

/**
 * Project card / hero videos live in public/projects/.
 * Prefer compressed *-web.mp4 (720p H.264 + faststart). Raw 4K camera exports
 * work locally but often fail or show the poster forever on Vercel.
 */
export const PROJECT_CARD_VIDEOS = {
  saber: {
    src: "/projects/lightsaber/fullsaber-web.mp4",
    poster: "/projects/lightsaber/saberwhite.png",
    alt: "Lightsaber build demo",
  },
  bloombot: {
    src: "/projects/bloombot-web.mp4",
    poster: "/projects/bloombot-poster.jpg",
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

/** Use in projects.ts: media: [projectVideo("saber")] */
export function projectVideo(key: ProjectVideoKey): ProjectMedia {
  const item = PROJECT_CARD_VIDEOS[key];
  return {
    kind: "video",
    src: item.src,
    ...("poster" in item && item.poster ? { poster: item.poster } : {}),
    alt: item.alt,
    label: "Demo",
    mediaType: "demo",
    featured: true,
    priority: 20,
  };
}
