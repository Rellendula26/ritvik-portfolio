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
  const title = "Machine Learning for Muscular Dystrophy Diagnosis";
  const subtitle =
    "This project utilized the NCBI Gene Expression Omnibus (GEO) as a dataset for assessing the diagnostic power of various classic machine learning methods towards Muscular Dystrophy.";
  const coverSrc = "/research/muscular-dystrophy.png"; // must exist in /public

  const badges = ["Independent", "Bioinformatics","Data Pre-Processing","Machine Learning","Numpy","Gene Expression Omnibus(GEO)"];
  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
    { label: "RESEARCH PAPER", href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4905776" },
    { label: "GITHUB", href: "https://github.com/Rellendula26/PersonalPortfolio-RitvikEllendula-/blob/Highlights/Muscular%20Dystrophy%20Prediction.ipynb"}
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
                This project utilized classical machine learning (along with other associated steps such as pre-processing and training) with analysis and extraction of specific data from GEO. During this research project, I assessed which classical machine learning methods are best suitable for diagnosing Duchenne’s Muscular Dystrophy using the NCBI Gene Expression Omnibus (GEO). One thing I found interesting in particular was the use of biological biomarkers as inputs for computational analysis. In my work, I treated differentially expressed genes as molecular biomarkers, using statistical filtering and feature selection to isolate genes whose expression patterns were most strongly associated with pathological status, using these biomarkers to train the machine-learning model.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Identified and curated two compatible gene expression microarray datasets (GSE3307, GSE6011) from GEO, ensuring overlap in gene features to enable valid dataset merging.</li>
                <li>Trained and evaluated multiple supervised ML models—Logistic Regression, Naive Bayes, K-Nearest Neighbors, and Random Forest—using an 80/20 train-test split.</li>
                <li>Implemented a reusable evaluation function to compute accuracy, precision, recall, and F1 score for each model, enabling systematic comparison.</li>
                <li>Authored the full research manuscript, documenting both model performance and methodological limitations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Achieved over 90% accuracy using Logistic Regression and Random Forest models, with Random Forest yielding the strongest balance of precision, recall, and F1 score.</li>
                <li>Identified a subset of genes with statistically significant associations to muscular dystrophy status, reinforcing known biological pathways while highlighting candidates for further study.</li>
                <li>Produced a fully reproducible ML pipeline that can be adapted to other genetically driven neuromuscular disorders through utilizing GEO</li>
                <li>Published the work as a public preprint, contributing an accessible, end-to-end example of applied machine learning in genomic diagnostics</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                LESSONS + NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Learned how data preprocessing and feature selection are used in biological ML problems, along with extracting genomic data from external datasets such as GEO</li>
                <li>Extend the pipeline to RNA-seq data and explore modern deep learning architectures in their diagnosis efficacy.</li>
                <li>Explore other genetic disorders that may have publicly accessible genomic data.</li>
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
                <dd className="font-medium">Bioinformatics Machine Learning Researcher</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">4-5 Weeks</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Bioinformatics","Data Pre-Processing","Machine Learning","Numpy","Gene Expression Omnibus(GEO)"].map((t) => (
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
