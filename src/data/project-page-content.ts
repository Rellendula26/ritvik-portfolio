import type { CaseStudyMedia, EngineeringCaseStudy } from "@/data/engineering-case-study";
import { getExperience } from "@/data/experiences";
import { capWords, wordCount } from "@/data/experience-summary";
import { pickProjectPrimaryMedia, type Project, type ProjectMedia } from "@/data/projects";
import { recruiterStatus } from "@/data/recruiter-status";

export type PageLink = { label: string; href: string };

export type ProjectPageContent = {
  slug: string;
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
  subsystems: { name: string; role: string }[];
  dataFlow?: string;
  contribution?: string;
  depthNote?: string;
  decisions: string[];
  decisionRows: { decision: string; alternative: string; why: string }[];
  broke: string[];
  failures: {
    title: string;
    problem: string;
    diagnosis: string;
    fix: string;
    media?: CaseStudyMedia;
  }[];
  stats: { value: string; label: string }[];
  figures: ProjectMedia[];
  results?: string;
  limitations?: string;
  resultsMedia?: ProjectMedia;
  nextSteps: string[];
};

export type ProjectPageTodo = {
  slug: string;
  field: string;
  note: string;
};

function clipWords(text: string, max: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= max) return words.join(" ");
  return words.slice(0, max).join(" ");
}

function withoutTrailingLimit(text: string) {
  const parts = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  if (parts.length < 2) return text.replace(/\s+/g, " ").trim();
  const last = parts[parts.length - 1];
  if (/\b(still|have not|not yet|not finished|open)\b/i.test(last)) {
    return parts.slice(0, -1).join(" ");
  }
  return parts.join(" ");
}

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

const STAT_SOURCES: Record<string, { value: string; label: string; source: string }[]> = {
  "vend-a-shoe": [
    { value: "4", label: "MG996R servos", source: "4 MG996R servos" },
    { value: "8", label: "LEDs on the board", source: "eight LEDs" },
    { value: "40+", label: "Wires in the harness", source: "forty-plus wires" },
    { value: "Delivered", label: "Shipped to the client", source: "delivered to the client" },
  ],
  "logic-pcb": [
    { value: "50 Hz", label: "Servo PWM", source: "50 Hz" },
    { value: "12 V", label: "Metered rail", source: "12 V" },
    { value: "6 V", label: "Metered rail", source: "6 V" },
  ],
  "bionic-arm": [
    { value: "1", label: "Sensor board built", source: "One sensor board is built" },
    { value: "8", label: "Channels in the plan", source: "eight channels" },
    { value: "2000", label: "Samples per second", source: "2000 samples per second" },
  ],
};

function statsFor(project: Project, caseStudy?: EngineeringCaseStudy) {
  const haystack = [
    project.overview,
    project.contribution,
    project.finalOutcome,
    ...(project.keyHighlights ?? []),
    caseStudy?.systemOverview.summary,
    JSON.stringify(caseStudy?.executiveAssessment ?? {}),
    JSON.stringify(caseStudy?.results ?? {}),
    JSON.stringify(caseStudy?.disciplines ?? []),
    JSON.stringify(caseStudy?.rootCauseAnalyses ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (STAT_SOURCES[project.slug] ?? []).filter((item) => haystack.includes(item.source.toLowerCase()));
}

function supportingFigures(project: Project, hero?: ProjectMedia): ProjectMedia[] {
  const used = new Set<string>();
  const heroSource = heroSrc(hero);
  if (heroSource) used.add(heroSource);
  const figures: ProjectMedia[] = [];

  project.media.forEach((item) => {
    if (item.kind !== "image" || used.has(item.src)) return;
    used.add(item.src);
    figures.push(item);
  });

  (project.images ?? []).forEach((src) => {
    if (used.has(src)) return;
    used.add(src);
    figures.push({ kind: "image", src, alt: project.title });
  });

  return figures.slice(0, 3);
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
  const descriptionSource = project.pageLead || project.oneLine || "";
  const description = descriptionSource ? firstSentence(descriptionSource) : undefined;
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
  const overview = overviewSource ? capWords(withoutTrailingLimit(overviewSource), 120) : undefined;
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
  const results = resultsSource ? clipWords(resultsSource, 80) : undefined;
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

  const decisionRows = (caseStudy?.designDecisions ?? [])
    .slice(0, 4)
    .map((decision) => ({
      decision: capWords(decision.title, 20),
      alternative: capWords(decision.alternatives[0] || decision.problem, 20),
      why: capWords(firstSentence(decision.choice || decision.tradeoffs), 20),
    }))
    .filter((row) => row.decision && row.why);

  const failures = (caseStudy?.rootCauseAnalyses ?? []).slice(0, 3).map((item) => ({
    title: item.title,
    problem: capWords(firstSentence(item.symptoms), 20),
    diagnosis: capWords(firstSentence(item.rootCause), 20),
    fix: capWords(firstSentence(item.improvement), 20),
    media: item.media,
  }));

  const stats = statsFor(project, caseStudy);
  let figures = supportingFigures(project, hero);
  let pageHero = hero;
  let resultsMedia: ProjectMedia | undefined;

  if (project.slug === "vend-a-shoe") {
    pageHero = {
      kind: "image",
      src: "/projects/vend-a-shoe/demo1.jpg",
      alt: "Assembled Vend-A-Shoe",
      caption: "Final mechanical and electrical packaging.",
    };
    figures = [
      {
        kind: "image",
        src: "/projects/vend-a-shoe/wall-ac-dc.jpg",
        alt: "Wall AC to DC power converter for Vend-A-Shoe",
        caption: "AC wall outlet into DC for the protoboard. Same path feeds the motors, 8 LEDs, fan, and Pi.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/solderedprotoboardfront.jpg",
        alt: "Soldered protoboard front",
        caption: "Soldered permanence after the breadboard stopped being trustworthy.",
      },
      {
        kind: "image",
        src: "/projects/vend-a-shoe/coverCAD.jpg",
        alt: "Enclosure CAD cover view",
        caption: "CAD of the enclosure, matched to the unit I built.",
      },
    ];
    resultsMedia = {
      kind: "image",
      src: "/projects/vend-a-shoe/wrongLEDsonfinalized.jpg",
      alt: "Finalized assembly where LED color mismatch was caught",
      caption: "Late mismatch corrected before handoff, not ignored.",
    };
  }

  if (project.slug === "logic-pcb") {
    figures = [
      {
        kind: "image",
        src: "/projects/logic-pcb/logic-board.jpg",
        alt: "Green logic PCB with white connectors, labeled for stepper, encoder, and RS-485",
      },
      {
        kind: "image",
        src: "/projects/logic-pcb/power-modules.jpg",
        alt: "V2 power board with an XT60, ATAZ converter modules, and terminal blocks",
      },
    ];
  }

  if (project.slug === "bionic-arm") {
    resultsMedia = {
      kind: "image",
      src: "/projects/bionic-arm/electrical-team-slide.jpg",
      alt: "Photo of an Electrical Team progress slide",
      caption: "The slide says SPI daisy-chain. The schematics use CS1 through CS8. Those two don't match.",
    };
  }
  if (figures.length === 0 && !showDiagram && hero?.kind !== "image" && hero?.kind !== "visual") {
    gap("figure", "No still image besides the hero. A photo of the bench would break up the text.");
  }

  const subsystems = (caseStudy?.systemOverview.subsystems ?? []).slice(0, 4).map((item) => ({
    name: item.name,
    role: capWords(item.role, 24),
  }));
  const dataFlow = caseStudy?.systemOverview.dataFlow
    ? capWords(caseStudy.systemOverview.dataFlow, 40)
    : undefined;
  const depthNote = project.technicalNotes?.find((note) => /isolator/i.test(note));

  return {
    content: {
      slug: project.slug,
      title: project.title,
      description,
      role,
      dates,
      status,
      org,
      stack,
      bullets,
      hero: pageHero,
      links: pageLinks(project),
      overview,
      diagram: showDiagram ? diagram : undefined,
      subsystems,
      dataFlow,
      contribution,
      depthNote,
      decisions,
      decisionRows,
      broke: brokeItems,
      failures,
      stats,
      figures,
      results,
      resultsMedia,
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
