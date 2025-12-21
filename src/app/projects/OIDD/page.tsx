import Image from "next/image";

type LinkItem = { label: string; href: string };

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function ActionLink({ label, href }: LinkItem) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

export default function Page() {
  const title =
    "A Data Analysis Exploration into Environmental & Socioeconomic Factors on Poor Health Outcomes";
  const subtitle =
    "A course capstone project exploring how environmental and socioeconomic variables relate to public health outcomes, combining machine learning with data visualization in Python.";
  const coverSrc = "/projects/OIDD.png";

  const repoUrl =
    "https://github.com/Rellendula26/PersonalPortfolio-RitvikEllendula-/blob/Highlights/Ritvik_Ellendula%20OIDD%204770%20Final%20Project%20(2).ipynb";
  const presentationPath = "/presentations/oiddfinal.html";

  const badges = ["Course", "Python", "Machine Learning"];
  const actions: LinkItem[] = [
    { label: "PRESENTATION", href: "#presentation" },
    { label: "SOURCE CODE", href: repoUrl },
    { label: "WRITEUP", href: "#overview" },
    { label: "GALLERY", href: "#gallery" },
  ];

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

        {/* Hero */}
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

        {/* Action strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-900">
            PROJECT CASE STUDY
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {actions.map((a) => (
              <ActionLink key={a.label} {...a} />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div id="overview" className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                This project focused on analyzing how environmental and
                socioeconomic factors correlate with health outcomes. I used
                Python-based data pipelines, machine learning models, and
                visualization tools to build a clear, presentation-driven
                narrative from real datasets.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Cleaned and engineered features from multiple datasets.</li>
                <li>Trained and evaluated models to identify meaningful trends.</li>
                <li>Translated technical results into a business-style presentation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Identified key variables associated with adverse health outcomes.</li>
                <li>Delivered a polished, insight-driven presentation grounded in data.</li>
              </ul>
            </div>

            {/* Presentation */}
            <section id="presentation">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                PRESENTATION
              </h2>

              <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <iframe
                  src={presentationPath}
                  title="OIDD Final Presentation"
                  className="h-[650px] w-full"
                />
              </div>

              <div className="mt-3 flex gap-2">
                <ActionLink label="OPEN FULLSCREEN" href={presentationPath} />
                <ActionLink label="SOURCE CODE" href={repoUrl} />
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
              DETAILS
            </h3>

            <dl className="mt-4 space-y-4 text-sm text-zinc-700">
              <div>
                <dt className="text-zinc-500">Role</dt>
                <dd className="font-medium">Data Analyst</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Context</dt>
                <dd className="font-medium">Course Capstone</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Python", "Pandas", "NumPy", "Seaborn", "Matplotlib"].map(
                    (t) => (
                      <Badge key={t}>{t}</Badge>
                    )
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2">
              <a
                href="/projects"
                className="block text-sm font-medium text-amber-800 hover:underline"
              >
                ← Back to Projects
              </a>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-medium text-zinc-700 hover:underline"
              >
                View on GitHub →
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
          {["/projects/OIDD.png"].map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative h-64 w-full">
                <Image src={src} alt="Project image" fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

