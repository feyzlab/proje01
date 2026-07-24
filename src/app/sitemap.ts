import type { MetadataRoute } from "next";
import {
  getBlogSlugs,
  getProjectSlugs,
  getServiceSlugs,
  getTeamSlugs,
} from "@cms/lib/fetch";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, projectSlugs, blogSlugs, teamSlugs] = await Promise.all([
    getServiceSlugs(),
    getProjectSlugs(),
    getBlogSlugs(),
    getTeamSlugs(),
  ]);

  const now = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/hizmetler", priority: 0.9 },
    { path: "/projeler", priority: 0.9 },
    { path: "/hakkinda", priority: 0.7 },
    { path: "/ekibimiz", priority: 0.6 },
    { path: "/memnuniyet", priority: 0.6 },
    { path: "/sik-sorulan-sorular", priority: 0.6 },
    { path: "/iletisim", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));

  for (const slug of serviceSlugs) {
    entries.push({
      url: `${SITE_URL}/hizmetler/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  for (const slug of projectSlugs) {
    entries.push({
      url: `${SITE_URL}/projeler/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of blogSlugs) {
    entries.push({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  for (const slug of teamSlugs) {
    entries.push({
      url: `${SITE_URL}/ekip/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  return entries;
}
