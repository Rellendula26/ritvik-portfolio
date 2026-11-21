import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-zinc-200/80">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-display text-2xl text-zinc-950">Ritvik Ellendula</p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              If you want to talk about a project, or something still on the bench, email me.
            </p>
          </div>

          <SocialLinks />
        </div>

        <p className="mt-10 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Ritvik Ellendula
        </p>
      </div>
    </footer>
  );
}
