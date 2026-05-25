import WorkInProgressPage from "@/components/project-page/WorkInProgressPage";
import { CASE_STUDIES } from "@/data/case-studies";

const study = CASE_STUDIES.snapfuel;

export const metadata = {
  title: "SnapFuel | Ritvik Ellendula",
  description: study.positioning,
};

export default function SnapFuelPage() {
  return (
    <WorkInProgressPage
      title="SnapFuel"
      description={study.positioning}
      github={study.github}
    />
  );
}
