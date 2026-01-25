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
  const title = "Econometrics Labor Market Research";
  const subtitle =
    "An empirical econometrics project analyzing how remote work and company size interact to shape salary outcomes in the global tech workforce. Pre-print publication.";

  const coverSrc = "/research/econometrics.png";

  // PDF (local)
  const paperUrl = "/research/ecnm.pdf";
  const paperEmbedUrl = `${paperUrl}#view=FitH&page=1&toolbar=1`;

  // External links
  const fullPaperLink =
    "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5374800";

  const badges = ["Independent", "Econometrics", "R", "Data Analysis"];

  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "PAPER PREVIEW", href: "#paper" },
    { label: "FULL PAPER", href: fullPaperLink },
    {
      label: "GITHUB",
      href: "https://github.com/Rellendula26/PersonalPortfolio-RitvikEllendula-/blob/Highlights/Econometrics_Project.ipynb",
    },
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

        {/* Hero image */}
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
        {/* Left column */}
        <div className="lg:col-span-2">
          <div id="overview" className="space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                This project applies econometric methods in R to study how remote
                work arrangements relate to salary outcomes in the global data
                science and AI labor market, and whether this relationship varies
                by company size. Using over 130,000 observations from AI Jobs’
                Data Science Salary Index, we evaluate whether remote, hybrid, and
                in-person roles are associated with meaningful wage differences
                across firms of different scales. The analysis contributes
                empirical evidence to ongoing debates about compensating wage
                differentials in the post-pandemic labor market.
              </p>
            </div>

            {/* What I Did */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Cleaned and structured a large-scale salary dataset (132k+
                  observations), filtering to 2024–2025 to control for inflation.
                </li>
                <li>
                  Defined key categorical variables, including remote work ratio
                  (in-person, hybrid, remote) and company size.
                </li>
                <li>
                  Implemented Welch’s ANOVA in R to test salary differences while
                  relaxing homogeneity-of-variance assumptions.
                </li>
                <li>
                  Interpreted F-statistics, p-values, and effect sizes to separate
                  statistical from practical significance.
                </li>
                <li>
                  Co-authored and revised the research paper with emphasis on
                  economic interpretation and clarity.
                </li>
              </ul>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Found that remote work status, company size, and their
                  interaction are statistically significant predictors of
                  salary.
                </li>
                <li>
                  Challenged classical compensating wage differential models in
                  the context of modern tech labor markets.
                </li>
                <li>
                  Contributed to a completed academic pre-print publication.
                </li>
              </ul>
            </div>

            {/* Lessons */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Developed hands-on intuition for applying econometric reasoning
                  to real-world labor data.
                </li>
                <li>
                  Extend analysis using panel data or advanced causal inference
                  methods.
                </li>
              </ul>
            </div>

            {/* Paper Preview */}
            <div id="paper" className="scroll-mt-24">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                  RESEARCH PAPER
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <ActionLink label="VIEW FULL PAPER" href={fullPaperLink} />
                  <ActionLink label="OPEN PDF" href={paperUrl} />
                </div>
              </div>

              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                Scroll through the full paper directly below.
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="h-[70vh] min-h-[520px] w-full">
                  <iframe
                    title="ArXiv Paper Preview"
                    src="/research/ecnm.pdf"
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
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
                <dd className="font-medium">5–7 Weeks</dd>
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
          {["/research/econ-1.png", "/research/econ-2.png"].map((src) => (
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
