import type { CaseStudyMedia, EngineeringCaseStudy } from "@/data/engineering-case-study";
import { getExperience } from "@/data/experiences";
import { capWords, wordCount } from "@/data/experience-summary";
import { pickProjectPrimaryMedia, type Project, type ProjectMedia } from "@/data/projects";
import { recruiterStatus } from "@/data/recruiter-status";

export type PageLink = { label: string; href: string };

export type ProjectPageContent = {
  title: string;
  description?: string;
  role?: string;
  dates?: string;
  status?: string;
  org?: string;
  stack: string[];
  bullets: string[];
  hero?: ProjectMedia;
  links: PageLink[];
  overview?: string;
  diagram?: CaseStudyMedia;
  contribution?: string;
  decisions: string[];
  broke: string[];
  results?: string;
  limitations?: string;
  nextSteps: string[];
};

export type ProjectPageTodo = {
  slug: string;
  field: string;
  note: string;
};

function firstSentence(text: string) {
  return capWords(text, 10_000).split(/(?<=[.!?])\s+/)[0]?.trim() ?? "";
}

function pageLinks(project: Project): PageLink[] {
  const links: PageLink[] = [];
  if (project.githubUrl) links.push({ label: "GitHub", href: project.githubUrl });
  const liveIsVideo = project.liveUrl ? /youtu\.?be/i.test(project.liveUrl) : false;
  if (project.liveUrl && !liveIsVideo) links.push({ label: "Demo", href: project.liveUrl });
  if (project.documentLink) {
    links.push({
      label: project.documentLink.cardLabel,
      href: project.documentLink.href,
    });
  }
  if (project.youtubeUrl) links.push({ label: "Video", href: project.youtubeUrl });
  else if (project.liveUrl && liveIsVideo) links.push({ label: "Video", href: project.liveUrl });
  if (project.demoVideoUrl) links.push({ label: "Video", href: project.demoVideoUrl });
  return links;
}

function heroSrc(media: ProjectMedia | undefined) {
  if (!media || media.kind === "visual") return undefined;
  return media.src;
}

/**
 * TODO(ritvik): these recruiter fields are left off the page when the source has no matching record.
 * - role and org: any project with no experience link.
 * - status: "Analysis complete" on per-power-electronics, hyperloop-vfd, and cis5450-loan-default. "Page template" on drift-balancer. Neither phrase is Shipped, Working prototype, In progress, Design complete, or Archived.
 * - decisions: ecg-signal-conditioning, latticelab, and nodelab have no design-decision records.
 * - broke: no root-cause record and no debugging notes. The long log still has the original challenge text.
 * - limitations: a results paragraph with no limitations line on the case study.
 * - dates: Penn ADAPT and Penn SPARK are on the experience records, not here. See experiences.ts.
 * - employment type: not stored on any experience. See experiences.ts.
 *
 * Short page, built only from fields that already exist.
 * A missing field is omitted and recorded in `todos`.
 */
export function buildProjectPageContent(
  project: Project,
  caseStudy?: EngineeringCaseStudy
): { content: ProjectPageContent; todos: ProjectPageTodo[] } {
  const todos: ProjectPageTodo[] = [];
  const gap = (field: string, note: string) => {
    todos.push({ slug: project.slug, field, note });
  };

  const experience = project.experienceSlug ? getExperience(project.experienceSlug) : undefined;
  const descriptionSource = project.oneLine || project.pageLead || "";
  const description = descriptionSource ? capWords(descriptionSource, 25) : undefined;
  if (!description) gap("description", "No one-line description on the project.");

  const role = experience?.role;
  if (!role) gap("role", "No role is stored for this project.");

  const dates = project.date?.trim() || undefined;
  if (!dates) gap("dates", "No date string on the project.");

  const status = recruiterStatus(project.buildStage);
  if (!status) {
    gap(
      "status",
      `Build stage "${project.buildStage}" is not one of Shipped, Working prototype, In progress, Design complete, or Archived.`
    );
  }

  const org = experience?.org;
  if (!org) gap("org", "No organization is linked from this project.");

  const stack = project.techStack.slice(0, 6);
  if (stack.length === 0) gap("stack", "No stack entries on the project.");

  const bullets = (project.keyHighlights.length ? project.keyHighlights : project.contribution ? [project.contribution] : [])
    .slice(0, 3)
    .map((item) => capWords(item, 25))
    .filter(Boolean);
  if (bullets.length === 0) gap("bullets", "No highlights or contribution sentence on the project.");

  const hero = pickProjectPrimaryMedia(project);

  const overviewSource =
    caseStudy?.systemOverview.summary || project.overview || caseStudy?.motivation.narrative || caseStudy?.motivation.why || "";
  const overview = overviewSource ? capWords(overviewSource, 120) : undefined;
  if (!overview) gap("overview", "No overview text on the project or case study.");

  const diagram = caseStudy?.systemOverview.diagram;
  const diagramSrc = diagram && "src" in diagram ? diagram.src : undefined;
  const showDiagram = Boolean(diagram && diagramSrc && diagramSrc !== heroSrc(hero));

  const contributionParts = [
    caseStudy?.contribution?.summary,
    caseStudy?.contribution?.alreadyThere[0],
    !caseStudy?.contribution ? project.contribution : undefined,
  ].filter((part): part is string => Boolean(part));
  const contribution = contributionParts.length ? capWords(contributionParts.join(" "), 100) : undefined;
  if (!contribution) gap("contribution", "No contribution sentence on the project or case study.");

  const decisions = (caseStudy?.designDecisions ?? [])
    .slice(0, 3)
    .map((decision) => {
      const pieces = [firstSentence(decision.choice), firstSentence(decision.tradeoffs || decision.problem)].filter(Boolean);
      return capWords(pieces.join(" "), 50);
    })
    .filter(Boolean);
  if (decisions.length === 0) {
    gap("decisions", "No design-decision records on the case study.");
  }

  const broke = caseStudy?.rootCauseAnalyses?.length
    ? caseStudy.rootCauseAnalyses.slice(0, 3).map((item) =>
        capWords(
          [firstSentence(item.symptoms), firstSentence(item.rootCause), firstSentence(item.improvement)]
            .filter(Boolean)
            .join(" "),
          50
        )
      )
    : (project.debuggingNotes ?? []).slice(0, 3).map((note) => capWords(note, 50));
  const brokeItems = broke.filter(Boolean);
  if (brokeItems.length === 0) {
    gap("broke", "No root-cause write-up or debugging notes on this project.");
  }

  const resultItems = caseStudy?.results.items ?? [];
  const resultsSource = resultItems.length
    ? resultItems.map((item) => `${item.title}. ${item.body}`).join(" ")
    : project.finalOutcome;
  const results = resultsSource ? capWords(resultsSource, 100) : undefined;
  if (!results) gap("results", "No results write-up or final outcome on this project.");

  const limitations = caseStudy?.results.limitations[0]
    ? capWords(caseStudy.results.limitations[0], 40)
    : undefined;
  if (results && !limitations) {
    gap("limitations", "Results exist, and the case study has no limitations line.");
  }

  const nextSource = caseStudy?.reflection.future?.length
    ? caseStudy.reflection.future
    : project.nextImprovements ?? [];
  const nextSteps = nextSource.slice(0, 3).map((item) => capWords(item, 25)).filter(Boolean);
  if (nextSteps.length === 0) gap("nextSteps", "No future-work or next-improvement lines on this project.");

  return {
    content: {
      title: project.title,
      description,
      role,
      dates,
      status,
      org,
      stack,
      bullets,
      hero,
      links: pageLinks(project),
      overview,
      diagram: showDiagram ? diagram : undefined,
      contribution,
      decisions,
      broke: brokeItems,
      results,
      limitations,
      nextSteps,
    },
    todos,
  };
}

export function visibleWordCount(content: ProjectPageContent) {
  const parts = [
    content.title,
    content.description,
    content.role,
    content.dates,
    content.status,
    content.org,
    ...content.stack,
    ...content.bullets,
    content.overview,
    content.contribution,
    ...content.decisions,
    ...content.broke,
    content.results,
    content.limitations,
    ...content.nextSteps,
  ];
  return parts.reduce((sum, part) => sum + (part ? wordCount(part) : 0), 0);
}
