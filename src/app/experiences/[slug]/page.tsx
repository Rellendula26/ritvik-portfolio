import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExperiencePage from "@/components/experience/ExperiencePage";
import { EXPERIENCES, getExperience } from "@/data/experiences";
import { getProjectsForExperience } from "@/data/projects";

export function generateStaticParams() {
  return EXPERIENCES.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return {};
  return {
    title: `${experience.org} | Ritvik Ellendula`,
    description: experience.oneLiner,
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) notFound();

  return (
    <ExperiencePage
      experience={experience}
      projects={getProjectsForExperience(experience.slug)}
    />
  );
}
