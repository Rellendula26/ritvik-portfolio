import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const RESEARCH: MediaCardItem[] = [
  {
    id: "001",
    type: "affiliated",
    eyebrow: "Brain-Computer Interfaces",
    title: "EEG-to-Image Generation for Brain Injury Communication (ArXiv)",
    blurb:
      "Mentored student project on EEG-to-image generation. I helped move an existing DreamDiffusion repository into a Colab notebook others could run. The write-up is an arXiv preprint, not a peer-reviewed paper.",
    href: "/research/dreamdiffusion",
    tags: ["EEG Signal Processing", "Diffusion Models", "PyTorch", "Machine Learning", "NumPy","Deep Learning"],
    media: { kind: "image", src: "/research/dreamdiffusion.png", alt: "DreamDiffusion preview" },
  },
  {
    id: "002",
    type: "affiliated",
    eyebrow: "Epidemiology Research",
    title: "Neighborhood Redlining and Health Outcomes (Public Health, 2025)",
    blurb:
      "I am a coauthor on a Wayne State systematic review of how historic HOLC grades relate to later health outcomes. The review scores study quality. It does not pool the papers into one effect size.",
    href: "/research/redlining",
    tags: ["Systematic Review", "Statistical Analysis", "Health Equity", "Epidemiology","Redlining"],
    media: { kind: "image", src: "/research/redlining.png", alt: "Redlining Image" },
  },
  {
    id: "003",
    type: "independent",
    eyebrow: "Muscular Dystrophy & Machine Learning",
    title: "Machine Learning for Muscular Dystrophy Diagnosis (SSRN)",
    blurb:
      "Independent project on GEO gene-expression data to test which supervised models best separate dystrophy from control samples. I built a clean preprocessing and evaluation pipeline and reported model limits directly.",
    href: "/research/muscular-dystrophy",
    tags: ["Bioinformatics", "Machine Learning", "Data Pre-Processing & Normalization", "NumPy", "Scikit-learn"],
    media: { kind: "image", src: "/research/muscular-dystrophy.png", alt: "Muscular Dystrophy Image" },
  },
  {
    id: "004",
    type: "independent",
    eyebrow: "Econometrics Research",
    title: "How does the relationship between remote work and salary vary by company size in the global tech workforce? (SSRN)",
    blurb:
      "Econometrics project on 130,000+ tech salary records to test how remote-work status and company size relate to wages. Focus was model specification, ANOVA assumptions, and interpretation discipline.",
    href: "/research/econometrics",
    tags: ["R", "ANOVA Test", "Data Visualization", "Economics"],
    media: { kind: "image", src: "/research/econometrics.png", alt: "Econometrics" },
  },
];

export default function ResearchPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-8 py-14">
        <MediaCardGrid
          title="Research"
          subtitle="Research work across EEG modeling, public-health evidence review, genomics ML, and labor-market econometrics."
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
