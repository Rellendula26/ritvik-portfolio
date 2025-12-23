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
  const title = "3D Printed Interactive Brain Model";
  const subtitle =
    "A CAD + fabrication project exploring anatomical modeling and physical interaction.";
  const coverSrc = "/projects/bin.png"; // must exist in /public

  const badges = ["Independent", "CAD", "Maya"];
  const actions: LinkItem[] = [
    { label: "GALLERY", href: "#gallery" },
    { label: "WRITEUP", href: "#overview" },
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
                This project focused on creating a 3D physical render of the human brain, and incorporating some sort of labelling device/feature in order to offer more interactive resources for neuroscience education. 
                I personally believe this matters a lot, as the brain is one of the parts of the body that is very abstract -- especially given the dense amount of information and processes that occur within it. For that reason, I strove to build a simplified, inexpensive model -- one that could potentially even be recreated for dispersion at local schools to promote more interest in neuroscience as a field. 
                In order to accomplish this objective, I built a CAD Model of the brain in Maya, then I painted over the specific hemispheres and lobes to offer an easy-to-understand idea of what each represent, and finally added numbers and labelling with flashcards to describe each part in depth. 
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                WHAT I DID
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Prior to developing the brain model, studied the anatomy of the brain intensely, learning about the different lobes' specific functions, the spatial locations of different parts used for sensory processing, and more (stored in a research journal). </li>
                <li>Manually modeled highly irregular, organic geometry such as gyri and sulci in Maya with respect to realistic proportions.</li>
                <li>Optimizing mesh topology, reducing non-manifold edges, and balancing surface fidelity with printability.</li>
                <li>Exported Maya meshes to STL, validated files with slicer software, and iterated through numerous designs.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                RESULTS / IMPACT
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Improved spatial understanding of brain anatomy especially with translation from 2D to 3D.</li>
                <li>Developed strong skills in CAD-to-print pipelines with Maya, and explored other CAD softwares.</li>
                <li>Created a low-cost, scalable approach to improving access to anatomical education using additive manufacturing </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-900">
                NEXT STEPS
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-zinc-700">
                <li>Expanding to other more specific parts of the brain, or even human body.</li>
                <li>Capitalizing on scalability to produce more copies and provide them to school teachers.</li>
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
                <dd className="font-medium">Builder</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Timeline</dt>
                <dd className="font-medium">6–8 weeks</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tools</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {["Maya", "3D Printing", "Slicing", "Iteration"].map((t) => (
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
