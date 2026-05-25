import HardwareBuildLayout from "@/components/project-page/HardwareBuildLayout";
import { CASE_STUDIES } from "@/data/case-studies";

export const metadata = {
  title: "Lightsaber | Ritvik Ellendula",
  description: "Hardware build, Fusion 360 CAD, circuits, soldering, integration.",
};

export default function SaberPage() {
  const study = CASE_STUDIES.saber;

  return (
    <HardwareBuildLayout
      config={{
        title: "Saber Build",
        subtitle: study.positioning,
        topicTags: ["Hardware Build", "Physical Computing", "Circuit Design"],
        meta: [
          { label: "Role", value: study.role },
          { label: "Focus", value: "Interactive saber electronics" },
          { label: "Stack", value: study.stack.join(", ") },
          { label: "Outcome", value: study.impact[0] },
        ],
        actions: study.github
          ? [
              { label: "GALLERY", href: "#gallery" },
              { label: "FINAL PRODUCT", href: "#final" },
            ]
          : undefined,
        heroMedia: {
          kind: "video",
          src: "/projects/fullsaber-web.mp4",
          poster: "/projects/saberwhite.png",
          alt: "Finished lightsaber demo",
        },
        ideas: [
          {
            title: "First demo",
            description:
              "Early handheld test before the final hilt finish — validating switch, LEDs, and basic ergonomics.",
            media: {
              kind: "video",
              src: "/projects/saberfirstdemo.MOV",
              alt: "First lightsaber demo",
            },
          },
          {
            title: "Fusion 360 CAD",
            description:
              "Modeled hilt, emitter, and battery carrier in Fusion 360 — iterating tolerances for press-fit parts before printing.",
            media: {
              kind: "video",
              src: "/projects/sabercadp1.mov",
              alt: "Fusion 360 CAD session for saber hilt",
            },
          },
          {
            title: "Whiteboard circuit plan",
            description:
              "Mapped power paths, LED segments, and switch routing on a whiteboard before the first solder joint.",
            media: {
              kind: "image",
              src: "/projects/saberwhite.png",
              alt: "Whiteboard circuit and hilt planning",
            },
          },
        ],
        skills: [
          {
            title: "Soldering",
            description:
              "40+ joints across power, signal, and LED paths — flux, heat control, and rework when pads bridged.",
            media: {
              kind: "video",
              src: "/projects/sabersauder1.MOV",
              alt: "Soldering the lightsaber circuit",
            },
          },
          {
            title: "Lab testing",
            description:
              "Checkout and safety testing in Detkin Lab before calling the build demo-ready.",
            media: {
              kind: "video",
              src: "/projects/sabersecurity.MOV",
              alt: "Detkin lab security and testing",
            },
          },
          {
            title: "Blade integration",
            description:
              "LED strip segmentation and mechanical fit so the blade glows evenly inside the printed emitter.",
            media: {
              kind: "video",
              src: "/projects/saber.mp4",
              alt: "Lightsaber blade glow test",
            },
          },
        ],
        finalTitle: "The finished saber",
        finalDescription:
          "A handheld build with working switch, segmented LEDs, and a CAD-fitted hilt — demoable outside the bench.",
        finalBullets: study.results.bullets ?? [],
        finalMedia: {
          kind: "video",
          src: "/projects/fullsaber-web.mp4",
          poster: "/projects/saberwhite.png",
          alt: "Final lightsaber build video",
        },
        gallery: study.gallery,
      }}
    />
  );
}
