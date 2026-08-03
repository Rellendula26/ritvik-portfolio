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
    title: "Dance",
    blurb:
      "Penn Dhamaka competitive fusion (2026 national champs), summer training with Furteelay / D2G, plus dance TikToks.",
    href: "/life/dance",
    tags: ["Penn Dhamaka", "D2G", "TikTok"],
    media: { kind: "image", src: "/life/atl.jpg", alt: "Penn Dhamaka" },
  },
  {
    id: "003",
    eyebrow: "Video Editing",
    title: "Edits",
    blurb:
      "Learning editing and videography for my YouTube channel and HJA event recaps. Gear experiments include the DJI Osmo Pocket 3 and Sony ZV-1.",
    href: "/life/edits",
    tags: ["YouTube", "HJA", "DaVinci Resolve"],
    media: { kind: "image", src: "/life/mich.jpg", alt: "Michigan vs Ohio State edit" },
  },
];

export default function LifePage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Life"
          subtitle="Some hobbies that add some spice to life."
          items={LIFE}
          columns={2}
        />
      </main>
    </div>
  );
}
