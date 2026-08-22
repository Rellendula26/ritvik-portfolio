import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ExperiencesList from "@/components/ExperiencesList";
import { Reveal } from "@/components/motion/Reveal";

export default function ExperiencesPage() {
  return (
    <div className="bg-speckle min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-amber-800">Roles & clubs</p>
            <h1 className="text-display mt-2 text-4xl text-stone-950 md:text-5xl">
              Experiences
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Places I&apos;ve worked and clubs I&apos;ve been part of. Open a
              card for the summary, photos, and links.
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
