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


  {
    id: "002",
    eyebrow: "Dance",
    title: "Penn Dhamaka & Dance",
    blurb:
      "In college, I have become extremely involved in the University of Pennsylvania's Fusion Dance Team: Penn Dhamaka. And, just overall more interested in dance as a whole..",
    href: "/life/dance",
    tags: ["Physical Activity", "Friends", "Competitive"],
    media: { kind: "image", src: "/life/atl.jpg", alt: "Tamasha" },

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
