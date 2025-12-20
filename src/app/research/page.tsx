import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const RESEARCH: MediaCardItem[] = [
  {
    id: "001",
    type: "independent",
    eyebrow: "Neuro / Signals",
    title: "DreamDiffusion Pipeline Notes",
    blurb: "EEG → image generation experiments + debugging notes.",
    href: "/research/dreamdiffusion",
    tags: ["EEG", "ML", "experiments"],
    media: { kind: "image", src: "/research/dreamdiffusion.jpg", alt: "DreamDiffusion preview" },
  },

  // Example affiliated entry later:
  // {
  //   id:"002",
  //   type:"affiliated",
  //   eyebrow:"Penn — Litt Lab",
  //   title:"Seizure forecasting ...",
  //   ...
  // }
];

export default function ResearchPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Research"
          subtitle="Questions I’m chasing and the systems I’m learning to build."
          items={RESEARCH}
          columns={2}
          filters={[
            { label: "All", value: "all" },
            { label: "Affiliated", value: "affiliated" },
            { label: "Independent", value: "independent" },
          ]}
          defaultFilter="all"
          showTypePill={true}
        />
      </main>
    </div>
  );
}
