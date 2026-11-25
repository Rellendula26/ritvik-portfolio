/**
 * Status words on the recruiter card.
 * Unmapped stages stay off the card so a template or an analysis is not called shipped.
 */
const STATUS_BY_BUILD_STAGE: Record<string, string> = {
  "In development": "In progress",
  "Working prototype": "Working prototype",
  "Ready for fabrication": "Design complete",
  Delivered: "Shipped",
  Archived: "Archived",
};

export function recruiterStatus(buildStage: string): string | undefined {
  return STATUS_BY_BUILD_STAGE[buildStage];
}
