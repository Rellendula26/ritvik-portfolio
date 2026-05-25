import WorkInProgressPage from "@/components/project-page/WorkInProgressPage";
import { CASE_STUDIES } from "@/data/case-studies";

const study = CASE_STUDIES["labreach-ai"];

export const metadata = {
  title: "LabReach AI | Ritvik Ellendula",
  description: study.positioning,
};

export default function LabReachPage() {
  return (
    <WorkInProgressPage
      title="LabReach AI"
      description={study.positioning}
      github={study.github}
    />
  );
}
