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
    tags: ["React", "Next.js", "Frontend", "UI/UX", "Git", "Deployment"],
    media: {
      kind: "video",
      src: "/projects/website.mp4",
      poster: "/projects/website.jpg",
    },
  },

  {
    id: "002",
    type: "course",
    eyebrow: "CAD",
    title: "3D Printed Interactive Brain Model",
    blurb:
      "A high school personal project, where I designed an accurate model of the brain, including the various gyri and sulci through Maya, and added physical labels as well.",
    href: "/projects/brain",
    tags: ["CAD", "Maya", "Neuroscience", "Anatomical Modeling"],
    media: {
      kind: "image",
      src: "/projects/bin.png",
      alt: "3D printed brain model",
    },
  },

  {
    id: "003",
    type: "course",
    eyebrow: "Data Analysis",
    title:
      "A Data Analysis Exploration into Environmental & Socioeconomic Factors on Poor Health Outcomes",
    blurb:
      "A final presentation for my STAT 7770 course, where we analyzed the influence of various socioeconomic factors on health, utilizing numerous python libraries such as pandas, seaborn, numpy, etc.",
    href: "/projects/OIDD",
    tags: ["Python", "NumPy", "Pandas", "Data Pre-Processing", "Decision Trees"],
    media: {
      kind: "image",
      src: "/projects/OIDD.png",
      alt: "OIDD Model",
    },
  },

  {
    id: "004",
    type: "independent",
    eyebrow: "Audio + Signal Processing",
    title: "Count Coach",
    blurb:
      "A full-stack Next.js audio analysis tool that visualizes waveforms and performs tempo inference via server-side API routes, helping dancers improve their ability to stay on beat with the music.",
    href: "/projects/count-coach",
    tags: [
      "Signal Processing",
      "Audio Analysis",
      "Next.js",
      "React",
      "Full-Stack",
      "Time-Series Data",
    ],
    media: {
      kind: "video",
      src: "/projects/count-coach-demo.mp4",
      poster: "/projects/count-coach-poster.jpg",
    },
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Projects"
          subtitle="Everyday projects and random experiments."
          items={PROJECTS}
          columns={2}
          filters={[
            { label: "All", value: "all" },
            { label: "Independent", value: "independent" },
            { label: "Courses", value: "course" },
          ]}
          defaultFilter="all"
          showTypePill={true}
        />
      </main>
    </div>
  );
}
