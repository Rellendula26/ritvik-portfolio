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
  const title = "Epidemiology Research";
  const subtitle =
    "A research project done under the mentorship of a Wayne State University epidemiology professor, exploring a neighborhood's HOLC(Home Owner's Loan Corporation) status and relevant adverse public health impacts. Publication on Journal of Public Health.";
  const coverSrc = "/research/redlining.png"; // must exist in /public

  const badges = ["Affiliate", "Wayne State University", "Data Analysis", "Meta-Analysis", "Redlining", "Health Equity", "Public Health"];
  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "RESEARCH PAPER", href: "https://www.sciencedirect.com/science/article/pii/S0033350624004335?via%3Dihub" }

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
                During my epidemiology research at Wayne State University, I contributed to a systematic review examining how historic neighborhood redlining practices continue to shape contemporary health outcomes in the United States. The project investigated whether neighborhoods graded as “hazardous” by the Home Owners’ Loan Corporation (HOLC) in the 1930s experience worse health outcomes today, decades after overtly discriminatory lending practices were outlawed. By synthesizing evidence across dozens of observational studies, this work sought to determine which associations have been consistently replicated and where methodological gaps remain. The research matters because redlining represents a concrete, mappable policy mechanism through which structural racism may translate into persistent health disparities. Our final product was a rigorously documented systematic review that contextualizes modern public health outcomes within historical policy decisions .
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Conducted structured literature review work following PRISMA-style systematic review guidelines, extracting data from 50+ studies linking HOLC grades to adverse health outcomes.</li>
                <li>Extracted and organized study-level details including study design, sample size, exposure definitions, outcome measures, and regression model types (e.g., logistic, Cox proportional hazards, Poisson, negative binomial).</li>
                <li>Collaborated with a multidisciplinary team spanning epidemiology, public health, and medicine to produce a peer-reviewed manuscript.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Published findings in Public Health (Elsevier), contributing to evidence that historic housing policy may exert durable effects on population health decades later.</li>
                <li>Demonstrated substantial methodological heterogeneity across the literature, including the use of 18+ different regression strategies and varied exposure comparisons, limiting direct meta-analysis.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Integrate more data types -- spatial, environmental, and longitudinal data -- to better understand mechanisms linking redlining to adverse, systemic health outcomes.</li>
                <li>Explore opportunities to translate research findings into genuine policy changes and meaningful public health interventions.</li>
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
                <dd className="font-medium">Public Health Research Assistant</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">1.5 Years (June 2023 - January 2025)</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Data Analysis", "Meta-Analysis", "Redlining", "Health Equity", "Public Health"].map((t) => (
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
