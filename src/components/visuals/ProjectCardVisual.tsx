import type { ProjectVisualId } from "@/data/projects";
import CompilerPipelineVisual from "@/components/visuals/CompilerPipelineVisual";
import LabReachPreviewVisual from "@/components/visuals/LabReachPreviewVisual";
import MiniTorchAutodiffVisual from "@/components/visuals/MiniTorchAutodiffVisual";
import PortfolioPreviewVisual from "@/components/visuals/PortfolioPreviewVisual";
import SnapFuelPreviewVisual from "@/components/visuals/SnapFuelPreviewVisual";

export default function ProjectCardVisual({
  visualId,
  className = "",
}: {
  visualId: ProjectVisualId;
  className?: string;
}) {
  switch (visualId) {
    case "compiler-pipeline":
      return <CompilerPipelineVisual className={className} />;
    case "minitorch-autodiff":
      return <MiniTorchAutodiffVisual className={className} />;
    case "snapfuel-preview":
      return <SnapFuelPreviewVisual className={className} />;
    case "labreach-preview":
      return <LabReachPreviewVisual className={className} />;
    case "portfolio-preview":
      return <PortfolioPreviewVisual className={className} />;
    default:
      return null;
  }
}
