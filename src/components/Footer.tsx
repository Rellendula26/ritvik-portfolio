import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200/60 bg-white/70 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center">
        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.linkedin.com/in/ritvik-ellendula-a74b67226/"
            target="_blank"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-amber-400 hover:text-amber-700"
          >
            in
          </Link>

          <Link
            href="https://github.com/Rellendula26"
            target="_blank"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-amber-400 hover:text-amber-700"
          >
            GH
          </Link>

          <Link
            href="mailto:rellen26@seas.upenn.edu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:border-amber-400 hover:text-amber-700"
          >
            @
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-zinc-500">
          all work made by Ritvik © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
