import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const LIFE: MediaCardItem[] = [
  {
    id: "001",
    eyebrow: "Running",
    title: "Training Logs",
    blurb: "What I’m working on + what the miles are teaching me.",
    href: "/life/running",
    tags: ["running", "consistency"],
    media: { kind: "image", src: "/life/running.jpg", alt: "Running" },
  },
  {
    id: "002",
    eyebrow: "Dance",
    title: "Dhamaka Moments",
    blurb: "Rehearsals, comps, and tiny wins.",
    href: "/life/dance",
    tags: ["dance", "team"],
    media: { kind: "video", src: "/life/dance.mp4", poster: "/life/dance-poster.jpg" },
  },
];

export default function LifePage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Life"
          subtitle="A small collection of things that keep me curious."
          items={LIFE}
          columns={2}
        />
      </main>
    </div>
  );
}
