import { Github, Linkedin } from "lucide-react";

const iconButton =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-amber-400 hover:text-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700";

const iconButtonOnDark =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:border-amber-300 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300";

/** Verified profiles only. Instagram is omitted until a personal URL is supplied. */
export const SOCIAL_LINKS = [
  {
    id: "email",
    href: "mailto:rellen26@seas.upenn.edu",
    label: "Email Ritvik at rellen26@seas.upenn.edu",
    external: false,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/ritvik-ellendula-a74b67226/",
    label: "LinkedIn",
    external: true,
  },
  {
    id: "github",
    href: "https://github.com/Rellendula26",
    label: "GitHub",
    external: true,
  },
] as const;

function GmailIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path
        fill="#4caf50"
        d="M45 16.2 40 18.95 35 23.7 35 40h7c1.657 0 3-1.343 3-3V16.2z"
      />
      <path
        fill="#1e88e5"
        d="M3 16.2 6.614 17.91 13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"
      />
      <polygon
        fill="#e53935"
        points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
      />
      <path
        fill="#c62828"
        d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8h0C4.924 8 3 9.924 3 12.298z"
      />
      <path
        fill="#fbc02d"
        d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8h0C43.076 8 45 9.924 45 12.298z"
      />
    </svg>
  );
}

function SocialIcon({ id }: { id: (typeof SOCIAL_LINKS)[number]["id"] }) {
  if (id === "email") return <GmailIcon />;
  if (id === "linkedin") return <Linkedin className="h-4 w-4" aria-hidden />;
  return <Github className="h-4 w-4" aria-hidden />;
}

export default function SocialLinks({
  tone = "light",
}: {
  tone?: "light" | "onDark";
}) {
  const button = tone === "onDark" ? iconButtonOnDark : iconButton;
  const labelClass =
    tone === "onDark" ? "text-sm font-medium text-zinc-200" : "text-sm font-medium text-stone-700";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className={labelClass}>Let&apos;s connect</p>
      <ul className="flex items-center gap-2">
        {SOCIAL_LINKS.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              aria-label={item.label}
              {...(item.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className={button}
            >
              <SocialIcon id={item.id} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
