import ProductCaseStudyLayout from "@/components/project-page/ProductCaseStudyLayout";
import type { SystemSection } from "@/components/project-page/SystemBlock";
import MiniTorchAutodiffVisual from "@/components/visuals/MiniTorchAutodiffVisual";
import { CASE_STUDIES } from "@/data/case-studies";

export const metadata = {
  title: "MiniTorch-OCaml | Ritvik Ellendula",
  description:
    "Automatic differentiation engine in OCaml, computational graphs and neural network training.",
};

/** System blocks use distinct gallery SVGs; hero alone uses the animated visual. */
const systems: SystemSection[] = [
  {
    id: "problem",
    step: "01",
    title: "Frameworks hide the graph",
    subtitle: "Problem",
    summary:
      "Calling torch.backward() teaches the API, not the mechanism. I implemented the graph, reverse-mode gradients, and training loop in OCaml with strong types.",
    responsibilities: [
      "Graph nodes with value + grad",
      "Numerical gradient checking",
      "Training loops that actually decrease loss",
    ],
    tools: ["OCaml", "Autodiff", "ML Systems"],
    media: {
      kind: "image",
      src: "/projects/gallery/minitorch-graph.svg",
      alt: "Computation graph with tensor nodes and edges",
    },
  },
  {
    id: "technical",
    step: "02",
    title: "Subsystems",
    subtitle: "Technical deep dive",
    summary:
      "Reverse-mode AD over custom tensor ops: forward pass builds the tape, backward pass propagates gradients to parameters.",
    responsibilities: [
      "Tensor ops → graph nodes",
      "Reverse traversal (backprop)",
      "Model layer + shape checks",
    ],
    tools: ["OCaml", "Computational Graphs", "Gradient Checking"],
    media: {
      kind: "image",
      src: "/projects/gallery/minitorch-forward.svg",
      alt: "Forward pass — y = x * w + b and loss",
    },
  },
  {
    id: "build",
    step: "03",
    title: "Gradient verification",
    subtitle: "Build process",
    summary:
      "Numerical gradcheck validates every op before stacking layers — the fastest way to catch subtle autodiff bugs.",
    responsibilities: [
      "Gradcheck harness per op",
      "Loss curves over training steps",
      "Small networks to prove learning",
    ],
    tools: ["OCaml", "Autodiff", "ML Systems"],
    media: {
      kind: "image",
      src: "/projects/gallery/minitorch-backprop.svg",
      alt: "Reverse-mode backpropagation through the graph",
    },
  },
  {
    id: "gradcheck",
    step: "04",
    title: "Training & gradcheck",
    subtitle: "Verified learning",
    summary:
      "Gradient checks against finite differences, then training loops that show loss decreasing — proof the engine learns, not just runs.",
    responsibilities: [
      "Numeric vs analytic gradients",
      "Loss curve monitoring",
      "Small network training",
    ],
    tools: ["Gradient Checking", "OCaml", "ML Systems"],
    media: {
      kind: "image",
      src: "/projects/gallery/minitorch-gradcheck.svg",
      alt: "Gradient check and training loss curve",
    },
  },
];

export default function MiniTorchPage() {
  return (
    <ProductCaseStudyLayout
      study={CASE_STUDIES["minitorch-ocaml"]}
      systems={systems}
      heroVisual={<MiniTorchAutodiffVisual className="h-full w-full" mode="full" />}
    />
  );
}
