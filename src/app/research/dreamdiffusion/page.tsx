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
  const title = "EEG-to-Image Generation for Brain Injury Rehabilitation (ArXiv)";
  const subtitle =
    "A research mentorship project under professors at Harvard Medical School with the purpose of image generation from EEG data & signals. Pre-print on ArXiv";
  const coverSrc = "/research/dreamdiffusion.png"; // must exist in /public

  const badges = ["Affiliated", "Harvard Medical School", "EEG Signal Processing", "Deep Learning"];
  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "RESEARCH PAPER", href: "https://arxiv.org/abs/2407.02673" }

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
                 During my EEG computer-vision research internship at Harvard Medical School, I helped refine DreamDiffusion, a model designed to convert EEG signals into images. Our team resolved major environment and dependency issues that made the original GitHub version nearly impossible to run, migrating the entire pipeline into Google Colab and debugging model-architecture and computer-vision components to ensure reproducibility. This process taught me how to systematically diagnose errors within complex deep-learning systems. We also evaluated a variety of classical and deep learning approaches—including SVMs, feedforward DNNs, CNN-based encoders, and generative models such as GANs and VAEs—for EEG-to-image reconstruction. While each model captured limited aspects of the signal, they struggled to robustly map EEG data to meaningful visual representations due to EEG’s low signal-to-noise ratio, nonlinearity, and complex temporal dynamics. Understanding these limitations, and why DreamDiffusion instead leverages masked-signal pretraining and alignment within CLIP’s latent space, deeply shaped my understanding of how to design models that translate noisy biological signals into meaningful visual outputs.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Refactored and debugged the DreamDiffusion codebase into a reproducible Google Colab pipeline, resolving dependencies, setup errors, and environment incompatibilities.</li>
                <li>Implemented EEG preprocessing and representation pipelines, dealing with EEG's low signal-to-noise ratio and temporal structure </li>
                <li>Evaluated numerous ML and Deep Learning Paradigms, and explored CLIP's multimodal latent space, enabling Stable Diffusion to generate images via EEG-Derived data. </li>
                <li>Worked with a team of 3 other peers to write a 13-page research paper, exploring our findings and documenting the methodologies and insights we made. </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Lowered the barrier to entry for EEG Generative Modeling via providing clean documentation, executable notebooks, and preloaded data, enabling easier experimentation for future studies.</li>
                <li>Demonstrated diffusion-based latent-space generation is more effective for EEG-to-image generation than CNNs, GANs, VAEs, or SVM models.</li>
                <li>Wrote a paper published to ArXiv as a pre-print.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Utilize University of Pennsylvania Venture Labs and other entrepreneurial sources to make this a hospital-utilized product.</li>
                <li>Integrate wavelet-based and time-frequency features to better capture transient EEG dynamics</li>
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
                <dd className="font-medium">Machine Learning Research Engineer</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">One Year (July 2023-July 2024) </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Harvard Medical School", "EEG Signal Processing", "Deep Learning","Machine Learning", "Diffusion Models"].map((t) => (
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
