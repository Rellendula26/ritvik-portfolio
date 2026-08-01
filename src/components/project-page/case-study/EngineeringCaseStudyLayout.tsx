import {
  AnchorNav,
  BackToProjects,
  ProjectPageShell,
} from "@/components/project-page/shared";
import ProjectHero from "@/components/project-page/ProjectHero";
import MotivationSection from "@/components/project-page/case-study/MotivationSection";
import SystemOverviewSection from "@/components/project-page/case-study/SystemOverviewSection";
import EngineeringBreakdownSection from "@/components/project-page/case-study/EngineeringBreakdownSection";
import DesignDecisionsSection from "@/components/project-page/case-study/DesignDecisionsSection";
import EvolutionSection from "@/components/project-page/case-study/EvolutionSection";
import ResultsValidationSection from "@/components/project-page/case-study/ResultsValidationSection";
import ReflectionSection from "@/components/project-page/case-study/ReflectionSection";
import FloatingEngineeringNotes from "@/components/project-page/case-study/FloatingEngineeringNotes";
import type { EngineeringCaseStudy } from "@/data/engineering-case-study";
import type { Project } from "@/data/projects";

const CASE_STUDY_NAV = [
  { id: "motivation", label: "Motivation" },
  { id: "system-overview", label: "System" },
  { id: "engineering-breakdown", label: "Breakdown" },
  { id: "design-decisions", label: "Decisions" },
  { id: "evolution", label: "Evolution" },
  { id: "results", label: "Results" },
  { id: "reflection", label: "Reflection" },
];

/**
 * Canonical engineering case-study layout.
 *
 * Hero (Executive Summary) stays first and visually unchanged.
 * Everything below is a cohesive narrative of engineering thinking.
 */
export default function EngineeringCaseStudyLayout({
  project,
  caseStudy,
}: {
  project: Project;
  caseStudy: EngineeringCaseStudy;
}) {
  return (
    <ProjectPageShell>
      <FloatingEngineeringNotes notes={caseStudy.engineeringNotes} />

      <BackToProjects />
      <ProjectHero project={project} />

      <div className="mt-4 rounded-[1.5rem] border border-orange-200/70 bg-orange-50/50 px-4 py-3 text-sm text-orange-950/90">
        <span className="font-semibold">Full write-up below.</span>{" "}
        The hero is the short version. This is the build story: what I designed, what
        broke, and why I made the calls I did.
      </div>

      <AnchorNav items={CASE_STUDY_NAV} />

      <div className="mt-14 space-y-16 md:space-y-20">
        <MotivationSection content={caseStudy.motivation} />
        <SystemOverviewSection content={caseStudy.systemOverview} />
        <EngineeringBreakdownSection disciplines={caseStudy.disciplines} />
        <DesignDecisionsSection decisions={caseStudy.designDecisions} />
        <EvolutionSection milestones={caseStudy.evolution} />
        <ResultsValidationSection content={caseStudy.results} />
        <ReflectionSection content={caseStudy.reflection} />
      </div>
    </ProjectPageShell>
  );
}
