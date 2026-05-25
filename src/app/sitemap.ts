import { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ritvik-portfolio-eta.vercel.app";
  const now = new Date();

  const staticRoutes = ["/", "/projects", "/research", "/life"];
  const projectRoutes = PROJECTS.map((p) => p.href);

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));
}
