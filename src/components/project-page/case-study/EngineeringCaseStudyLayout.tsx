import {
  AnchorNav,
  BackToProjects,
  ProjectPageShell,
} from "@/components/project-page/shared";
import ProjectHero from "@/components/project-page/ProjectHero";
import PageSummary from "@/components/project-page/PageSummary";
import { projectSummary } from "@/data/page-summaries";
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
import BoardArchitecture from "@/components/project-page/case-study/BoardArchitecture";
import ServoBringUpStory from "@/components/project-page/case-study/ServoBringUpStory";
import ProjectBrief from "@/components/project-page/ProjectBrief";
import BenchNotes from "@/components/project-page/case-study/BenchNotes";
import type { EngineeringCaseStudy } from "@/data/engineering-case-study";
import type { Project } from "@/data/projects";
import { getExperience } from "@/data/experiences";
import { getProjectsForExperience } from "@/data/projects";
import Link from "next/link";

function buildCaseStudyNav(caseStudy: EngineeringCaseStudy) {
  if (caseStudy.servoBringUp) {
    return [
      { id: "board-architecture", label: "Boards" },
      { id: "system-overview", label: "Bring-up" },
      { id: "root-cause", label: "The fault" },
      { id: "results", label: "Status" },
      { id: "record", label: "Notes" },
    ];
  }

  return [
    { id: "motivation", label: "Overview" },
    { id: "system-overview", label: "Architecture" },
    caseStudy.contribution
      ? { id: "contribution", label: "My work" }
      : { id: "engineering-breakdown", label: "My work" },
    caseStudy.rootCauseAnalyses?.length
      ? { id: "root-cause", label: "Challenges" }
      : { id: "design-decisions", label: "Decisions" },
    { id: "results", label: "Results" },
    { id: "record", label: "Notes" },
  ];
}

function RelatedProjects({ project }: { project: Project }) {
  if (!project.experienceSlug) return null;
  const related = getProjectsForExperience(project.experienceSlug).filter(
    (item) => item.slug !== project.slug && item.writeUp !== "coming-soon"
  );
  if (related.length === 0) return null;

  return (
    <section className="scroll-mt-36" aria-labelledby="related-work">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
        Same work
      </p>
      <h2 id="related-work" className="text-display mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
        Other projects from this role
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              className="block h-full rounded-[1.25rem] border border-zinc-200 bg-white px-4 py-4 transition-colors hover:border-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
                {item.buildStage}
              </p>
              <p className="mt-1 text-base font-semibold text-zinc-950">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">{item.oneLine}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
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
      <div className="mx-auto mt-8 max-w-3xl px-6">
        <PageSummary {...projectSummary(project)} />
      </div>

      <AnchorNav items={nav} />

      <div className="mt-10 space-y-12 md:space-y-14">
        {caseStudy.servoBringUp ? <BoardArchitecture /> : null}
        {caseStudy.servoBringUp ? <ServoBringUpStory /> : null}
        {caseStudy.servoBringUp ? null : (
          <MotivationSection content={caseStudy.motivation} />
        )}
        {caseStudy.servoBringUp ? null : (
          <SystemOverviewSection content={caseStudy.systemOverview} />
        )}
        {caseStudy.servoBringUp || !caseStudy.contribution ? null : (
          <ContributionSection content={caseStudy.contribution} />
        )}
        {caseStudy.servoBringUp || !caseStudy.designChallenge ? null : (
          <DesignChallengeExtrasSection content={caseStudy.designChallenge} />
        )}
        {caseStudy.servoBringUp ? null : (
          <EngineeringBreakdownSection disciplines={caseStudy.disciplines} />
        )}
        {caseStudy.servoBringUp ? null : (
          <DesignDecisionsSection decisions={caseStudy.designDecisions} />
        )}
        {caseStudy.rootCauseAnalyses?.length ? (
          <RootCauseAnalysesSection items={caseStudy.rootCauseAnalyses} />
        ) : null}
        <ResultsValidationSection content={caseStudy.results} />
        <BenchNotes>
          {caseStudy.servoBringUp ? (
            <>
              <MotivationSection content={caseStudy.motivation} />
              {caseStudy.contribution ? (
                <ContributionSection content={caseStudy.contribution} />
              ) : null}
              {caseStudy.designChallenge ? (
                <DesignChallengeExtrasSection content={caseStudy.designChallenge} />
              ) : null}
              <EngineeringBreakdownSection disciplines={caseStudy.disciplines} />
              <DesignDecisionsSection decisions={caseStudy.designDecisions} />
            </>
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
          <EvolutionSection milestones={caseStudy.evolution} />
          {caseStudy.scheduleAnalysis ? (
            <ScheduleAnalysisSection content={caseStudy.scheduleAnalysis} />
          ) : null}
          {caseStudy.version2Plan ? (
            <Version2PlanSection content={caseStudy.version2Plan} />
          ) : null}
          {caseStudy.transferableSkills?.length ? (
            <TransferableSkillsSection skills={caseStudy.transferableSkills} />
          ) : null}
          <ReflectionSection content={caseStudy.reflection} />
        </BenchNotes>
        <ProjectBrief project={project} className="mt-2" />
        <RelatedProjects project={project} />
      </div>
    </ProjectPageShell>
  );
}
