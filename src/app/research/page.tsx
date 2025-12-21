import MediaCardGrid, { type MediaCardItem } from "@/components/MediaCardGrid";

const RESEARCH: MediaCardItem[] = [
  {
    id: "001",
    type: "affiliated",
    eyebrow: "Brain-Computer Interfaces",
    title: "EEG-to-Image Generation for Brain Injury Communication (ArXiv)",
    blurb:
      "I conducted a group research project under the Harvard Medical School. To summarize, we assessed different machine and deep learning methods of generating images via EEG signals, building off of StableDiffusion and DreamDiffusion and utilizing methods such as CLIP (Contrastive Language Image Pre-Training).",
    href: "/research/dreamdiffusion",
    tags: ["EEG Signal Processing", "Diffusion Models", "PyTorch", "Machine Learning", "NumPy","Deep Learning"],
    media: { kind: "image", src: "/research/dreamdiffusion.png", alt: "DreamDiffusion preview" },
  },
  {
    id: "002",
    type: "affiliated",
    eyebrow: "Epidemiology Research",
    title: "A Literature Review of Neighborhood Redlining & Health Outcomes (Journal of Public Health)",
    blurb:
      "I worked under a professor at Wayne State University, assessing numerous studies on historic redlining and analyzing adverse health outcomes associated with different HOLC grading levels.",
    href: "/research/redlining",
    tags: ["Meta Analysis", "Statistical Analysis", "Health Equity", "Epidemiology","Redlining"],
    media: { kind: "image", src: "/research/redlining.png", alt: "Redlining Image" },
  },
  {
    id: "003",
    type: "independent",
    eyebrow: "Muscular Dystrophy & Machine Learning",
    title: "Comprehensive Analysis, Utilizing Advanced Machine Learning to Diagnose Muscular Dystrophy (SSRN)",
    blurb:
      "Muscular Dystrophy and other similar genetic disorders have always been extremely interesting to me. As a result, I was wondering which machine learning methodologies are the best for diagnosis of muscular dystrophy, as this is feasible to assess using publicly available genetic datasets.",
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
      "I have always been extremely interested in economics, and econometrics in particularly is a unique combination of economics and quantitative analysis. This project in particular analyzes the labor market and different types of jobs through a quantitative, statistical, econometrics-backed perspective.",
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
          subtitle="Deep-Dives into fields that interest me."
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
