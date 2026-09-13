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
  const title = "Redlining & Health Outcomes Research";
  const subtitle =
    "Literature and evidence review on how historic HOLC redlining patterns relate to present-day chronic health outcomes.";
  const coverSrc = "/research/redlining.png";

  const badges = ["Independent", "Public Health", "Data Analysis", "Causal Inference"];

  const paperUrl = "/research/red.pdf";
  const paperEmbedUrl = `${paperUrl}#view=FitH&page=1&toolbar=1`;
  const galleryImages = ["/research/redlining-1.png", "/research/redlining-2.png"];

  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "PAPER PREVIEW", href: "#paper" },
    { label: "OPEN PDF", href: paperUrl },
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
            {/* Overview */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                OVERVIEW
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                This project asks a direct question: when neighborhoods were graded
                as higher-risk under historic redlining maps, did that correlate
                with worse health outcomes decades later? I focused on tracing
                evidence quality across studies, separating descriptive correlation
                from causal claims, and identifying where methods were strong
                versus where confounders were under-controlled.
              </p>
            </div>

            {/* What I Did */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Reviewed public-health and epidemiology studies linking HOLC grade patterns to chronic disease outcomes.</li>
                <li>Documented dataset scope, modeling choices, and control-variable strategies across papers.</li>
                <li>Compared how different studies handled validation and confounders before drawing conclusions.</li>
                <li>Wrote a synthesis that highlights agreement zones and high-uncertainty claims.</li>
              </ul>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Most reviewed studies show directionally worse health outcomes in historically redlined areas.</li>
                <li>The strongest claims came from papers that explicitly modeled socioeconomic confounders.</li>
                <li>Result quality depends heavily on study design; not every observed disparity supports a causal statement.</li>
                <li>TODO: add paper-specific effect sizes where available from the final write-up.</li>
              </ul>
            </div>

            {/* Lessons */}
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Inference discipline matters: policy-relevant writing should distinguish correlation from causation line-by-line.</li>
                <li>Next step is a tighter evidence table with methods, controls, and effect-size comparability across studies.</li>
              </ul>
            </div>

            {/* Paper Preview */}
            <div id="paper" className="scroll-mt-24">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                  RESEARCH PAPER
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <ActionLink label="OPEN PDF" href={paperUrl} />
                </div>
              </div>

              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                Scroll through the full paper directly below.
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="h-[70vh] min-h-[520px] w-full">
                  <iframe
                    title="Research Paper Preview"
                    src={paperEmbedUrl}
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>

                <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                  If the preview doesn&apos;t load,{" "}
                  <a
                    href={paperUrl}
                    className="font-medium text-amber-800 hover:text-amber-900 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    open the PDF
                  </a>{" "}
                  .
                </div>
              </div>
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
                <dd className="font-medium">Researcher</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">4 to 8 Weeks</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {badges.map((t) => (
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
          {galleryImages.map((src) => (
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
