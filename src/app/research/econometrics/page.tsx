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
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {label}
    </a>
  );
}

export default function Page() {
  const title = "Econometrics Labor Market Research";
  const subtitle =
    "This research project uses R in order to answer the research question: how does the relationship between remote work and salary vary by company size in the global tech workforce. Publication on SSRN. ";
  const coverSrc = "/research/econometrics.png"; // must exist in /public

  const badges = ["Independent", "Econometrics", "R", "Data Analysis"];
  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "RESEARCH PAPER", href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5374800" },
    { label: "GITHUB", href: "https://github.com/Rellendula26/PersonalPortfolio-RitvikEllendula-/blob/Highlights/Econometrics_Project.ipynb" },
    // { label: "DEMO", href: "https://..." },
    // { label: "GITHUB", href: "https://..." },
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
            {actions.map((a) => (
              <ActionLink key={a.label} {...a} />
            ))}
          </div>
        </div>
      </header>

      {/* Content grid */}
      <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: sections */}
        <div className="lg:col-span-2">
          <div id="overview" className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                In this project, I worked on an econometric analysis using the software R in order to investigate how remote work arrangements relate to salary outcomes in the global data science and artificial intelligence workforce, and whether this relationship varies by company size. Using over 130,000 survey responses from AI Jobs’ Data Science Salary Index, we examined whether remote, hybrid, and in-person roles are associated with meaningful wage differences across small, medium, and large firms. This question matters as remote work becomes a permanent feature of the post-pandemic labor market and challenges classical economic theories around compensating wage differentials. Rather than relying on anecdotal claims, this study uses large-scale empirical evidence to assess whether remote work meaningfully alters compensation structures in modern tech labor markets
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Helped clean, subset, and structure a large-scale salary dataset (132k+ observations), filtering data to 2024–2025 to control for inflationary effects.</li>
                <li>Created operational definitions for key categorical variables, including remote work ratio (in-person, hybrid, remote) and company size (small, medium, large).</li>
                <li>Implemented Welch’s ANOVA in R to test for differences in mean salary across multiple groups while relaxing the homogeneity-of-variance assumption.</li>
                <li>Interpreted F-statistics, p-values, and partial eta squared effect sizes, distinguishing statistical significance from practical significance.</li>
                <li>Collaborated with coauthors to write and revise the full research paper, with emphasis on clear interpretation of results and economic implications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Found that remote work status, company size, and their interaction are statistically significant predictors of salary, based on Welch’s ANOVA results.</li>
                <li>Challenged classical interpretations of compensating wage differentials, suggesting the modern tech labor market has largely equilibrated around remote work.</li>
                <li>Contributed to a completed academic pre-print published in SSRN that contextualizes remote work within modern labor efficiency and wage equity discussions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Gained hands-on experience applying econometric reasoning to real-world labor data, rather than idealized textbook scenarios.</li>
                <li>Extend the analysis using longitudinal or panel data to study within-individual salary changes over time and/or apply advanced econometric analysis.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: sticky meta card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-widest text-zinc-900">
              DETAILS
            </h3>

            <dl className="mt-4 space-y-4 text-sm text-zinc-700">
              <div>
                <dt className="text-zinc-500">Role</dt>
                <dd className="font-medium">Econometrics Researcher</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">5-7 Weeks</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Econometrics", "R", "Data Analysis"].map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <a
                href="/research"
                className="text-sm font-medium text-amber-800 hover:text-amber-900 hover:underline"
              >
                ← Back to Research
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
