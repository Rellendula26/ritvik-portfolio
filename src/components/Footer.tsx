import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-zinc-200/80">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-display text-2xl text-zinc-950">Ritvik Ellendula</p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Thanks for stopping by, always happy to talk about a project,
              idea, or something half-built on my desk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://www.linkedin.com/in/ritvik-ellendula-a74b67226/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-amber-400 hover:text-amber-700"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/Rellendula26"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-amber-400 hover:text-amber-700"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:rellen26@seas.upenn.edu"
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-amber-400 hover:text-amber-700"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Ritvik Ellendula
        </p>
      </div>
    </footer>
  );
}
