import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const LIFE: MediaCardItem[] = [
  {
    id: "001",
    eyebrow: "Gift-Giving",
    title: "CADded/Personalized Gifts",
    blurb:
      "I'm someone who loves making personalized gifts, and once I found out Penn had free 3D printing, I started learning everything about it in order to make my friends stellar presents.",
    href: "/life/gift-giving",
    tags: ["CAD", "Friends", "Design"],
    media: { kind: "image", src: "/life/gift-giving.jpg", alt: "Gift-Giving" },

  },
];

export default function LifePage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Life"
          subtitle="Everyday projects and random experiments."
          items={LIFE}
          columns={2}
        />
      </main>
    </div>
  );
}
