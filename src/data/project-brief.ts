/** Visual summary attached to a project. Slide 1 is always the full brief. */
export type ProjectBriefVisual =
  | {
      kind: "image";
      src: string;
      alt: string;
      caption: string;
      /** contain keeps schematics and plots whole. cover is for photos. */
      fit?: "contain" | "cover";
    }
  | {
      kind: "diagram";
      id: "outreach-review";
      caption: string;
    };

/** Extra slide. The overview slide is built from the brief itself. */
export type ProjectBriefSlide = {
  id: string;
  label: string;
  note: string;
  visuals: ProjectBriefVisual[];
};

export type ProjectBrief = {
  /** Organization or setting, when the title does not already say it. */
  context?: string;
  /** One sentence: what the system does, and who or what it is for. */
  what: string;
  contribution: string[];
  results: string[];
  /** Three to five labels. Not a dump of the full stack. */
  tech: string[];
  visuals: ProjectBriefVisual[];
  slides?: ProjectBriefSlide[];
};
