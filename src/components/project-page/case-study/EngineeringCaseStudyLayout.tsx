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
import {
  EngineeringTimelineSection,
  ExecutiveAssessmentSection,
  RootCauseAnalysesSection,
  ScheduleAnalysisSection,
  TransferableSkillsSection,
  Version2PlanSection,
} from "@/components/project-page/case-study/RetrospectiveExtrasSection";
import DesignChallengeExtrasSection from "@/components/project-page/case-study/DesignChallengeExtrasSection";
import type { EngineeringCaseStudy } from "@/data/engineering-case-study";
import type { Project } from "@/data/projects";

function buildCaseStudyNav(caseStudy: EngineeringCaseStudy) {
  const items = [
    { id: "motivation", label: "Motivation" },
    { id: "system-overview", label: "System" },
    caseStudy.designChallenge
      ? { id: "design-challenge", label: "Deep dive" }
      : null,
    caseStudy.executiveAssessment
      ? { id: "executive-assessment", label: "At a glance" }
      : null,
    caseStudy.timeline?.length
      ? { id: "engineering-timeline", label: "Timeline" }
      : null,
    { id: "engineering-breakdown", label: "Breakdown" },
    { id: "design-decisions", label: "Decisions" },
    caseStudy.rootCauseAnalyses?.length
      ? { id: "root-cause", label: "When it broke" }
      : null,
    { id: "evolution", label: "Evolution" },
    caseStudy.scheduleAnalysis
      ? { id: "schedule-analysis", label: "Schedule" }
      : null,
    caseStudy.version2Plan ? { id: "version-2", label: "Version 2" } : null,
    { id: "results", label: "Results" },
    caseStudy.transferableSkills?.length
      ? { id: "transferable-skills", label: "What this built" }
      : null,
    { id: "reflection", label: "Reflection" },
  ];

  return items.filter((item): item is { id: string; label: string } => item !== null);
}

/**
 * Canonical engineering case-study layout.
 *
 * Hero (Executive Summary) stays first and visually unchanged.
 * Optional retrospective blocks render when present on the case study.
 */
export default function EngineeringCaseStudyLayout({
  project,
  caseStudy,
}: {
  project: Project;
  caseStudy: EngineeringCaseStudy;
}) {
  const nav = buildCaseStudyNav(caseStudy);

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

      <AnchorNav items={nav} />

      <div className="mt-14 space-y-16 md:space-y-20">
        <MotivationSection content={caseStudy.motivation} />
        <SystemOverviewSection content={caseStudy.systemOverview} />
        {caseStudy.designChallenge ? (
          <DesignChallengeExtrasSection content={caseStudy.designChallenge} />
        ) : null}
        {caseStudy.executiveAssessment ? (
          <ExecutiveAssessmentSection content={caseStudy.executiveAssessment} />
        ) : null}
        {caseStudy.timeline?.length ? (
          <EngineeringTimelineSection
            entries={caseStudy.timeline}
            copy={caseStudy.timelineCopy}
          />
        ) : null}
        <EngineeringBreakdownSection disciplines={caseStudy.disciplines} />
        <DesignDecisionsSection decisions={caseStudy.designDecisions} />
        {caseStudy.rootCauseAnalyses?.length ? (
          <RootCauseAnalysesSection items={caseStudy.rootCauseAnalyses} />
        ) : null}
        <EvolutionSection milestones={caseStudy.evolution} />
        {caseStudy.scheduleAnalysis ? (
          <ScheduleAnalysisSection content={caseStudy.scheduleAnalysis} />
        ) : null}
        {caseStudy.version2Plan ? (
          <Version2PlanSection content={caseStudy.version2Plan} />
        ) : null}
        <ResultsValidationSection content={caseStudy.results} />
        {caseStudy.transferableSkills?.length ? (
          <TransferableSkillsSection skills={caseStudy.transferableSkills} />
        ) : null}
        <ReflectionSection content={caseStudy.reflection} />
      </div>
    </ProjectPageShell>
  );
}
