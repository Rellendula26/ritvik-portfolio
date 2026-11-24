import { MetadataRoute } from "next";
import { COURSES, LABS, labHref } from "@/data/coursework";
import { EXPERIENCES } from "@/data/experiences";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ritvikellendula.dev";
  const now = new Date();

  const staticRoutes = [
    "/",
    "/projects",
    "/experiences",
    "/coursework",
    "/research",
    "/research/dreamdiffusion",
    "/research/redlining",
    "/research/muscular-dystrophy",
    "/research/econometrics",
    "/life",
    "/life/gift-giving",
    "/life/dance",
    "/life/edits",
    "/life/endurance",
  ];
  const projectRoutes = PROJECTS.map((p) => p.href);
  const experienceRoutes = EXPERIENCES.map((e) => `/experiences/${e.slug}`);
  const courseRoutes = COURSES.map((course) => `/coursework/${course.slug}`);
  const labRoutes = LABS.map((lab) => labHref(lab.courseSlug, lab.slug));

  return [...staticRoutes, ...projectRoutes, ...experienceRoutes, ...courseRoutes, ...labRoutes].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
    })
  );
}
