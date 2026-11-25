import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ExperiencesList from "@/components/ExperiencesList";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Experience · Ritvik Ellendula",
  description:
    "Serpent builds rope-climbing robots. GRASP is the printer and imaging work. ADAPT is the EMG arm. BrainChild is client hardware.",
};

export default function ExperiencesPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h1 className="text-display text-4xl text-stone-950 md:text-5xl">
              Experience
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Most of my experience is in robotics labs and small hardware teams. At Serpent Robotics, I work on the electronics for a rope-climbing robot; at GRASP, on a multi-axis 3D printer and an imaging system; at Penn ADAPT, on EMG sensing for a bionic arm. At BrainChild, I built hardware for clients. Each role links to the projects behind it.
            </p>
          </div>
        </Reveal>

        <ExperiencesList />

        <Reveal delay={0.06} className="mt-14">
          <Link
            href="/projects"
            className="btn-lift inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900"
          >
            See related project work
            <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
        </Reveal>
      </main>
    </div>
  );
}
