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
import {
  EngineeringTimelineSection,
  ExecutiveAssessmentSection,
  RootCauseAnalysesSection,
  ScheduleAnalysisSection,
  TransferableSkillsSection,
  Version2PlanSection,
} from "@/components/project-page/case-study/RetrospectiveExtrasSection";
import DesignChallengeExtrasSection from "@/components/project-page/case-study/DesignChallengeExtrasSection";
import ContributionSection from "@/components/project-page/case-study/ContributionSection";
import ProjectBrief from "@/components/project-page/ProjectBrief";
import type { EngineeringCaseStudy } from "@/data/engineering-case-study";
import type { Project } from "@/data/projects";
import { getExperience } from "@/data/experiences";
import Link from "next/link";

function buildCaseStudyNav(caseStudy: EngineeringCaseStudy) {
  const items = [
    { id: "motivation", label: "Motivation" },
    { id: "system-overview", label: "System" },
    caseStudy.contribution ? { id: "contribution", label: "My part" } : null,
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

function ExperienceLink({ slug }: { slug?: string }) {
  if (!slug) return null;
  const experience = getExperience(slug);
  if (!experience) return null;
  return (
    <p className="mt-4 text-sm text-stone-600">
      Part of{" "}
      <Link
        href={`/experiences/${experience.slug}`}
        className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        {experience.org}
      </Link>
      , {experience.role}.
    </p>
  );
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
      <BackToProjects />
      <ProjectHero project={project} />
      <ExperienceLink slug={project.experienceSlug} />

      <AnchorNav items={nav} />

      <div className="mt-10 space-y-12 md:space-y-14">
        <MotivationSection content={caseStudy.motivation} />
        <SystemOverviewSection content={caseStudy.systemOverview} />
        {caseStudy.contribution ? (
          <ContributionSection content={caseStudy.contribution} />
        ) : null}
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
        <ProjectBrief project={project} className="mt-2" />
      </div>
    </ProjectPageShell>
  );
}
