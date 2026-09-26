import type { MetadataRoute } from "next";
import { site, categoryToSlug } from "@/lib/content";
import { getAllProducts, getCategoryShowcases } from "@/lib/data/products";
import { getPublishedPosts } from "@/lib/data/posts";
import { getAllProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

const staticRoutes = ["", "/about", "/portfolio", "/shop", "/blog", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, projects, categories] = await Promise.all([
    getAllProducts(),
    getPublishedPosts(),
    getAllProjects(),
    getCategoryShowcases(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map(({ category }) => ({
    url: `${site.url}/shop/category/${categoryToSlug(category)}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/portfolio/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...postEntries, ...projectEntries];
}
