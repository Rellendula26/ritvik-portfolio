import { MetadataRoute } from "next";
import { COURSES } from "@/data/coursework";
import { EXPERIENCES } from "@/data/experiences";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ritvik-portfolio-eta.vercel.app";
  const now = new Date();

  const staticRoutes = ["/", "/projects", "/experiences", "/coursework", "/research", "/life"];
  const projectRoutes = PROJECTS.map((p) => p.href);
  const experienceRoutes = EXPERIENCES.map((e) => `/experiences/${e.slug}`);
  const courseRoutes = COURSES.map((course) => `/coursework/${course.slug}`);

  return [...staticRoutes, ...projectRoutes, ...experienceRoutes, ...courseRoutes].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
    })
  );
}
