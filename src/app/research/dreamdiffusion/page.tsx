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
    "Research mentorship with Harvard Medical School on EEG-to-image generation, reproducibility, and model comparison. Preprint on arXiv.";
  const coverSrc = "/research/dreamdiffusion.png"; // must exist in /public

  const badges = ["Affiliated", "Harvard Medical School", "EEG Signal Processing", "Deep Learning"];

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
                I worked on getting the DreamDiffusion pipeline into a state that others could actually run.
                The original repository had dependency conflicts and environment drift, so I helped migrate
                the workflow to Google Colab and debug architecture-level failures. We also compared
                approaches across SVMs, feedforward networks, CNN encoders, GANs, and VAEs for EEG-to-image
                reconstruction. The central technical issue stayed the same: EEG is noisy, nonlinear, and
                temporally complex, so naive mappings from signal to image collapse quickly. That is why the
                CLIP-aligned diffusion approach mattered in this project.
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
                  Implemented EEG preprocessing and representation pipelines, dealing with EEG&apos;s low
                  signal-to-noise ratio and temporal structure
                </li>
                <li>
                  Evaluated multiple ML and deep-learning paradigms, and explored CLIP&apos;s multimodal
                  latent space, enabling Stable Diffusion to generate images via EEG-derived data.
                </li>
                <li>
                  Worked with a team of 3 other peers to write a 13-page research paper, exploring our
                  findings and documenting the methodologies and insights we made.
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
                  Demonstrated diffusion-based latent-space generation is more effective for EEG-to-image
                  generation than CNNs, GANs, VAEs, or SVM models.
                </li>
                <li>Wrote a paper published to ArXiv as a pre-print.</li>
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
            <div id="paper" className="scroll-mt-24">
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
                <dd className="font-medium">Machine Learning Research Engineer</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">One Year (July 2023 to July 2024)</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Harvard Medical School",
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
