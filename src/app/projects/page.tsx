import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const PROJECTS: MediaCardItem[] = [
  {
    id: "001",
    type: "independent",
    eyebrow: "Featured",
    title: "Personal Portfolio Website",
    blurb:
      "A custom-built personal website designed to showcase my projects and interests. Focused on interactive UI, reusable components, and production deployment using modern web tools.",
    href: "/projects/website",
    tags: ["React", "Next.js", "Frontend","UI/UX","Git","Deployment"],
    media: { kind: "image", src: "/projects/website.png", alt: "Website" },
  },
  {
    id: "002",
    type: "independent",
    eyebrow: "CAD",
    title: "3D Printed Interactive Brain Model",
    blurb: "A high school personal project, where I designed an accurate model of the brain, including the various gyri and sulci through Maya, and added physical labels as well.",
    href: "/projects/brain",
    tags: ["CAD", "Maya", "Neuroscience","Anatomical Modeling"],
    media: {
      kind: "image",
      src: "/projects/brain.png",
      alt: "Brain Model",
    },
  },
  // Example of a course project later:
  // { id:"003", type:"course", ... }
];

export default function ProjectsPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Projects"
          subtitle="Useful tools, playful experiments, and polished builds."
          items={PROJECTS}
          columns={2}
          filters={[
            { label: "All", value: "all" },
            { label: "Independent", value: "independent" },
            { label: "Course", value: "course" },
          ]}
          defaultFilter="all"
          showTypePill={true}
        />
      </main>
    </div>
  );
}
