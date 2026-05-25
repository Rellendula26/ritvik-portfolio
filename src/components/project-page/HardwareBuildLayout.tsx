import CaseStudyVideo from "@/components/project-page/CaseStudyVideo";
import ProjectMediaImage from "@/components/project-page/ProjectMediaImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ActionLink,
  AnchorNav,
  BackToProjects,
  BrowserFrame,
  ProjectBadge,
  ProjectPageShell,
  SectionLabel,
  type LinkItem,
  type ProjectMedia,
} from "@/components/project-page/shared";

export type IdeaCard = {
  title: string;
  description: string;
  media: ProjectMedia;
};

export type SkillCard = {
  title: string;
  description: string;
  media: ProjectMedia;
};

export type HardwareBuildConfig = {
  title: string;
  subtitle: string;
  topicTags: string[];
  meta: { label: string; value: string }[];
  actions?: LinkItem[];
  heroMedia: ProjectMedia;
  ideas: IdeaCard[];
  skills: SkillCard[];
  finalTitle: string;
  finalDescription: string;
  finalBullets: string[];
  finalMedia: ProjectMedia;
  gallery?: {
    src: string;
    alt: string;
    label?: string;
    kind?: "image" | "video";
  }[];
};

export default function HardwareBuildLayout({ config }: { config: HardwareBuildConfig }) {
  const actions: LinkItem[] = config.actions ?? [
    { label: "IDEAS", href: "#ideas" },
    { label: "SKILLS", href: "#skills" },
    { label: "FINAL PRODUCT", href: "#final" },
    { label: "GALLERY", href: "#gallery" },
  ];

  return (
    <ProjectPageShell>
      <BackToProjects />

      <header className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.07)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(253,186,116,0.10),transparent_28%)]" />
        <div className="relative grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <div className="flex flex-wrap gap-2">
              {config.topicTags.map((tag) => (
                <ProjectBadge key={tag}>{tag}</ProjectBadge>
              ))}
            </div>

            <div className="mt-4">
              <ProjectBadge tone="yellow">HARDWARE PROJECT CASE STUDY</ProjectBadge>
            </div>

            <h1 className="text-display mt-5 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              {config.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
              {config.subtitle}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {config.meta.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/90 px-4 py-3"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-zinc-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="#final"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              View final build
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-5 flex flex-wrap gap-3">
              {actions.map((action) => (
                <ActionLink key={action.label} {...action} />
              ))}
            </div>

            <AnchorNav
              items={[
                { id: "ideas", label: "Ideas" },
                { id: "skills", label: "Skills" },
                { id: "final", label: "Final product" },
              ]}
            />
          </div>

          <BrowserFrame label="Hero visual / Final product preview" media={config.heroMedia} />
        </div>
      </header>

      <section id="ideas" className="mt-14 scroll-mt-28">
        <SectionLabel>Original ideas</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold text-zinc-950 md:text-4xl">
          Where the build started
        </h2>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          Early sketches and planning before soldering and CAD iteration.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {config.ideas.map((idea) => (
            <article
              key={idea.title}
              className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="relative h-[220px] w-full md:h-[260px]">
                {idea.media.kind === "image" ? (
                  <ProjectMediaImage
                    src={idea.media.src}
                    alt={idea.media.alt}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                ) : (
                  <CaseStudyVideo src={idea.media.src} poster={idea.media.poster} />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-zinc-900">{idea.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {idea.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="mt-14 scroll-mt-28">
        <SectionLabel>Major skills</SectionLabel>
        <h2 className="text-display mt-3 text-3xl font-semibold text-zinc-950 md:text-4xl">
          What the build required
        </h2>
        <p className="mt-3 max-w-2xl text-base text-zinc-600">
          The hands-on skills that turned the concept into a working object.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {config.skills.map((skill) => (
            <article
              key={skill.title}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="p-5 pb-0">
                <h3 className="text-lg font-semibold text-zinc-900">{skill.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {skill.description}
                </p>
              </div>
              <div className="relative mt-4 h-[200px] w-full">
                {skill.media.kind === "image" ? (
                  <ProjectMediaImage
                    src={skill.media.src}
                    alt={skill.media.alt}
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                ) : (
                  <CaseStudyVideo
                    src={skill.media.src}
                    poster={skill.media.poster}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="final" className="mt-14 scroll-mt-28">
        <SectionLabel>Final product</SectionLabel>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <h2 className="text-display text-3xl font-semibold text-zinc-950 md:text-4xl">
              {config.finalTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              {config.finalDescription}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-zinc-700">
              {config.finalBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Final media / Videos and images
            </div>
            <div className="relative aspect-video w-full">
              {config.finalMedia.kind === "image" ? (
                <ProjectMediaImage
                  src={config.finalMedia.src}
                  alt={config.finalMedia.alt}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 640px"
                />
              ) : (
                <CaseStudyVideo
                  src={config.finalMedia.src}
                  poster={config.finalMedia.poster}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {config.gallery && config.gallery.length > 0 && (
        <section id="gallery" className="mt-16 scroll-mt-28">
          <SectionLabel>Gallery</SectionLabel>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {config.gallery.map((item, index) => {
              const isVideo =
                item.kind === "video" ||
                item.src.endsWith(".mp4") ||
                item.src.endsWith(".MP4") ||
                item.src.endsWith(".mov") ||
                item.src.endsWith(".MOV");
              return (
                <div
                  key={item.src}
                  className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="border-b border-zinc-200 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 py-3 text-xs font-medium text-zinc-500">
                    {item.label ?? `Gallery ${index + 1}`}
                  </div>
                  <div className="relative h-[280px] w-full bg-[#070707] md:h-[320px]">
                    {isVideo ? (
                      <video
                        src={item.src}
                        className="h-full w-full object-cover object-top"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <ProjectMediaImage
                        src={item.src}
                        alt={item.alt}
                        sizes="(max-width: 768px) 100vw, 480px"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </ProjectPageShell>
  );
}
