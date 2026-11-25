import Link from "next/link";
import { CLASS_YEAR, INTERNSHIP_SEEKING, RESUME_URL } from "@/data/site";

type Segment = {
  text: string;
  accent?: boolean;
  href?: string;
};

const PARAGRAPHS: Segment[][] = [
  [
    { text: "I'm an electrical engineering student at Penn. I bring up boards and the firmware on them: " },
    { text: "PCB design", accent: true },
    { text: ", " },
    { text: "embedded systems", accent: true },
    { text: ", " },
    { text: "robotics", accent: true },
    { text: ", and the measurement that shows the hardware moved." },
  ],
  [
    { text: "At " },
    { text: "Serpent Robotics", href: "/experiences/serpent-robotics" },
    { text: " I modified the power and logic boards and brought a servo path up. At " },
    { text: "BrainChild", href: "/experiences/brainchild-engineering" },
    { text: " I delivered a client shoe dispenser. At " },
    { text: "Penn ADAPT", href: "/experiences/penn-adapt" },
    { text: " one EMG sensor board is built. At " },
    { text: "GRASP", href: "/experiences/grasp-laboratory" },
    { text: " I work on a printer toolhead and a line sensor. At " },
    { text: "Quantum Opus", href: "/experiences/quantum-opus" },
    { text: " I set up SNSPD benches and read the detector pulse on a scope." },
  ],
  [
    { text: "I like walking into a field I don't know yet and figuring it out on the bench. The " },
    { text: "projects", href: "/projects" },
    { text: " keep the decisions and the setbacks with the result." },
  ],
];

const FLAGSHIPS = [
  { href: "/projects/logic-pcb", label: "Logic and power boards" },
  { href: "/projects/leader-follower-robotic-arm", label: "Leader-follower arm" },
  { href: "/projects/vend-a-shoe", label: "Vend-A-Shoe" },
  { href: "/projects/bionic-arm", label: "Bionic arm" },
];

const actionClass =
  "btn-lift inline-flex h-11 items-center rounded-full border border-stone-200 bg-white px-4 text-xs font-medium uppercase tracking-[0.14em] text-stone-700 transition hover:border-amber-400 hover:text-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

function AccentText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-amber-800 underline decoration-amber-300/80 underline-offset-4">
      {children}
    </span>
  );
}

function renderSegment(segment: Segment, key: string) {
  if (segment.href) {
    return (
      <Link
        key={key}
        href={segment.href}
        className="font-medium text-amber-800 underline decoration-amber-300/80 underline-offset-4 hover:text-amber-900"
      >
        {segment.text}
      </Link>
    );
  }

  if (segment.accent) {
    return <AccentText key={key}>{segment.text}</AccentText>;
  }

  return <span key={key}>{segment.text}</span>;
}

export default function HomeHeroIntro() {
  return (
    <div>
      <h1 className="text-display text-5xl font-semibold tracking-tight text-stone-950 md:text-6xl lg:text-[3.35rem] lg:leading-[1.08]">
        Hey, I&apos;m Ritvik!
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-8 text-stone-700">
        {PARAGRAPHS.map((segments, paragraphIndex) => (
          <p key={paragraphIndex}>
            {segments.map((segment, segmentIndex) =>
              renderSegment(segment, `${paragraphIndex}-${segmentIndex}`)
            )}
          </p>
        ))}
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

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-amber-800">
        {FLAGSHIPS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="underline decoration-amber-300/80 underline-offset-4 hover:text-amber-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
