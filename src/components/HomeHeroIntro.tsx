import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

type Segment = {
  text: string;
  accent?: boolean;
  href?: string;
};

const PARAGRAPHS: Segment[][] = [
  [
    { text: "I'm an electrical engineering student at Penn. I'm interested in " },
    { text: "embedded systems", accent: true },
    { text: ", " },
    { text: "electronics", accent: true },
    { text: ", and " },
    { text: "robotics", accent: true },
    { text: ", especially " },
    { text: "medical and surgical robotics", accent: true },
    { text: "." },
  ],
  [
    {
      text: "Persistence is one of my strongest skills. I like walking into a field I don't know and figuring it out as I go. If the path is super easy, there isn't much substance behind the success. That's why I love endurance sports, and why engineering feels the same.",
    },
  ],
  [
    {
      text: "I made this site so the decisions and the setbacks stay with the finished version. The ",
    },
    { text: "projects", href: "/projects" },
    {
      text: " include the decisions and the setbacks.",
    },
  ],
];

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
      </div>

      <div className="mt-10 lg:mt-12">
        <SocialLinks />
      </div>
    </div>
  );
}
