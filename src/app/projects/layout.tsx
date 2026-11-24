import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects · Ritvik Ellendula",
  description:
    "The first group is the electrical and robotics work: Serpent boards and teleoperation, the ADAPT arm, Vend-A-Shoe, and the GRASP printer and imager.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
