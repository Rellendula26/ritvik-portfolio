import Link from "next/link";
import { CLASS_YEAR, INTERNSHIP_SEEKING, RESUME_URL } from "@/data/site";

const actionClass =
  "btn-lift inline-flex h-11 items-center rounded-full border border-stone-200 bg-white px-4 text-xs font-medium uppercase tracking-[0.14em] text-stone-700 transition hover:border-amber-400 hover:text-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

export default function HomeHeroIntro() {
  return (
    <div>
      <h1 className="text-display text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl lg:text-[3.35rem] lg:leading-[1.08]">
        Hey, I&apos;m Ritvik!
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-8 text-stone-700">
        <p>
          I&apos;m an electrical engineering student at Penn. I build embedded systems, PCBs, and
          robots, especially for medical and surgical work.
        </p>
        <p>
          Right now that work is in three places: Serpent Robotics, the GRASP Lab, and Penn ADAPT.
        </p>
        <p>I made this site so the decisions and the setbacks stay with the finished version.</p>
        {CLASS_YEAR ? <p>{CLASS_YEAR}</p> : null}
        {INTERNSHIP_SEEKING ? <p>{INTERNSHIP_SEEKING}</p> : null}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2 lg:mt-12">
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className={actionClass}>
          Résumé
        </a>
        <Link href="/projects" className={actionClass}>
          Projects
        </Link>
        <a href="mailto:rellen26@seas.upenn.edu" className={actionClass}>
          Email
        </a>
        <a
          href="https://www.linkedin.com/in/ritvik-ellendula-a74b67226/"
          target="_blank"
          rel="noreferrer"
          className={actionClass}
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/Rellendula26"
          target="_blank"
          rel="noreferrer"
          className={actionClass}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
