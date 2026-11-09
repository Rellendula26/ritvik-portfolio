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
  const title = "EEG-to-Image Generation for Brain Injury Rehabilitation (ArXiv)";
  const subtitle =
    "Mentored student project on adapting DreamDiffusion so EEG can drive image generation. The write-up is an arXiv preprint.";
  const coverSrc = "/research/dreamdiffusion.png"; // must exist in /public

  const badges = ["Mentored project", "arXiv preprint", "EEG", "DreamDiffusion"];

  // arXiv
  const arxivAbs = "https://arxiv.org/abs/2407.02673";
  const arxivPdf = "https://arxiv.org/pdf/2407.02673.pdf";

  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "PAPER PREVIEW", href: "#paper" },
    { label: "RESEARCH PAPER", href: arxivAbs },
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
                DreamDiffusion is an existing model that turns EEG features into images through Stable Diffusion.
                I did not design that architecture. With two teammates I modified the public codebase so it
                would run in Google Colab without the original setup, and so it could take other inputs such
                as sleep EEG. Dr. Carlos Ponce at Harvard Medical School and Dr. Suayb Arslan at MIT mentored
                the project. Clinical rehabilitation is the motivation in the preprint. We did not test it
                with patients.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Refactored and debugged the DreamDiffusion codebase into a reproducible Google Colab
                  pipeline, resolving dependencies, setup errors, and environment incompatibilities.
                </li>
                <li>
                  Adapted the notebook so the same pipeline could generate images from other inputs, including sleep EEG.
                </li>
                <li>
                  Coauthored the 13-page preprint. It describes the Colab port and that input change. It does
                  not benchmark DreamDiffusion against SVMs, CNNs, GANs, or VAEs.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>
                  Produced a reproducible Colab workflow with setup fixes, cleaner docs, and runnable notebooks.
                </li>
                <li>
                  Posted the write-up on arXiv (2407.02673, July 2024). arXiv is a preprint server. This version is not peer reviewed.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Keep this as a research workflow; avoid over-claiming product readiness.</li>
                <li>Integrate wavelet-based and time-frequency features to better capture transient EEG dynamics</li>
              </ul>
            </div>

            {/* Paper Preview */}
            <div id="paper" className="scroll-mt-40">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                  PAPER PREVIEW
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <ActionLink label="OPEN ON ARXIV" href={arxivAbs} />
                  <ActionLink label="DOWNLOAD PDF" href={arxivPdf} />
                </div>
              </div>

              <p className="mt-3 text-base leading-relaxed text-zinc-700">
                Scroll through the preprint directly here. For citation / sharing, use the arXiv link above.
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                {/* Responsive-ish height: tall on desktop, still usable on mobile */}
                <div className="h-[70vh] min-h-[520px] w-full">
                  <iframe
                    title="ArXiv Paper Preview"
                    src="/research/dreamdiff.pdf"
                    className="h-full w-full"
                    loading="lazy"
                  />
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
                <dd className="font-medium">Mentored student researcher</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">One Year (July 2023 to July 2024)</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Mentored by Dr. Carlos Ponce, Harvard Medical School",
                    "EEG Signal Processing",
                    "Deep Learning",
                    "Machine Learning",
                    "Diffusion Models",
                  ].map((t) => (
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
          {["/research/dream-1.png", "/research/dream-2.png"].map((src) => (
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
