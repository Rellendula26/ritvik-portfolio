import Image from "next/image";

/* ---------- Small UI helpers ---------- */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

type ActionLinkProps = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
};

function ActionLink({ label, href, variant = "ghost" }: ActionLinkProps) {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition";
  const primary =
    "border-amber-300 bg-amber-200 text-zinc-900 hover:bg-amber-300";
  const ghost =
    "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50";

  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className={`${base} ${variant === "primary" ? primary : ghost}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

/* ---------- Page ---------- */

export default function Page() {
  const title = "Personal Portfolio Website";
  const subtitle =
    "A project designed to strengthen my web development skills in React, Next.js, Node.js, Git, and cloud deployment, while offering a clean way to showcase other projects.";
  const coverSrc = "/projects/website.png"; // must exist in /public

  const badges = ["Independent", "React", "Next.js", "TypeScript"];

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-14">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        </div>

        {/* Hero media */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[320px] w-full md:h-[420px]">
            <Image
              src={coverSrc}
              alt={`${title} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1000px"
              priority
            />
          </div>
        </div>

        {/* Info strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-900">
            PROJECT CASE STUDY
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <ActionLink
              label="WEB EXPERIENCE"
              href="https://ritvik-portfolio-eta.vercel.app/"
              variant="primary"
            />

            <span className="mx-1 h-4 w-px bg-zinc-200" />

            <ActionLink
              label="SOURCE CODE"
              href="https://github.com/Rellendula26/ritvik-portfolio"
            />

            <ActionLink label="GALLERY" href="#gallery" />
            <ActionLink label="WRITEUP" href="#overview" />
          </div>
        </div>
      </header>

      {/* Content grid */}
      <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2">
          <div id="overview" className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
               This project originated after seeing other well-designed portfolio websites and wanting to understand how they were built, while constructing something similar for myself. This year, I have gained a deeper interest in conducting hardware and software engineering projects, so a portfolio site is the perfect way to document all of those creations: past and present. I designed this site from scratch, learning more about frontend engineering, react’s framework, and application deployment. This site became both a technical learning experience, and hopefully will serve as a record of all my future creations. 
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
  <li>Built the site in React and TypeScript, which forced me to think carefully about reusability, layout consistency, and how different parts of the site should scale as more projects are added.</li>
                <li>Structured the site using Next.js’s file-based routing system, making it easy to add new project and research pages without needing to rewrite or overconfigure anything.</li>
                <li>Used Git and the terminal to push changes, debug broken builds, and resolve deployment issues between local and production.</li>
                <li>Managed version control and iterative development through Git/Github.</li>
                <li>Deployed the site through Vercel and learned how repository updates, build processes, and live deployments interact, which helped me understand how real web projects are maintained beyond just writing code.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>This project deepened my understanding of production-level web architecture using React and Next.js, particularly component-based design, the App Router, and static asset handling. Debugging routing issues, image loading failures, and deployment behavior clarified how framework-level decisions propagate through the build and CI/CD pipeline. The site now serves as an extensible Next.js codebase that I can iteratively expand as my projects and technical scope grow.</li>
                <li>Successfully created a strong front-end project portfolio website to display future engineering and research based creations and insights.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Add more purposeful animations and transitions using tools like Framer Motion, focusing on improving flow and making interactions feel more intuitive rather than purely decorative.</li>
                <li>Experiment with hero videos in place of static images for certain projects, exploring video optimization and playback handling in Next.js to keep performance reasonable.</li>
                <li>Explore adding interactive elements or small browser-based games, starting with client-side logic in React, and gradually learning lightweight backend approaches (e.g., Next.js API routes or serverless functions) if persistence or scoring becomes necessary.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
              DETAILS
            </h3>

            <dl className="mt-4 space-y-4 text-sm text-zinc-700">
              <div>
                <dt className="text-zinc-500">Role</dt>
                <dd className="font-medium">Front-End Developer</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">Ongoing</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Git",
                    "Vercel",
                    "UI/UX",
                  ].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <a
                href="/projects"
                className="text-sm font-medium text-amber-800 hover:text-amber-900 hover:underline"
              >
                ← Back to Projects
              </a>
            </div>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mt-16">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
          GALLERY
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {["/projects/bin.png", "/projects/website.png"].map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={src}
                  alt="Project image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
