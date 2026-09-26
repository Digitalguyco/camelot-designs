import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { getAllProjects, getProjectBySlug } from "@/lib/data/projects";
import JsonLd from "@/components/JsonLd";
import ProjectGallery from "@/components/ProjectGallery";

// Project data lives in the database and changes from /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Portfolio" };

  const description = `${project.projectType} project in ${project.location} — ${project.scope}`.slice(
    0,
    155,
  );
  return {
    title: project.name,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${site.name}`,
      description,
      url: `/portfolio/${project.slug}`,
      images: project.images,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const more = allProjects.filter((p) => p.slug !== project.slug).slice(0, 2);

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.concept,
    image: project.images,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "Organization", name: site.name },
  };

  return (
    <article>
      <JsonLd data={projectJsonLd} />
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <Link href="/portfolio" className="tag text-ink/60 hover:text-gold transition-colors">
          ← Portfolio
        </Link>
      </div>

      <ProjectGallery project={project} />

      <div className="mx-auto max-w-3xl px-6 py-16 space-y-10">
        <section>
          <p className="eyebrow">Design Concept</p>
          <div className="mt-3 space-y-5 text-ink/75 leading-relaxed text-lg">
            {project.concept.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
        <section>
          <p className="eyebrow">Materials</p>
          <p className="mt-3 text-ink/75 leading-relaxed">{project.materials}</p>
        </section>
        {project.customFurniture && (
          <section>
            <p className="eyebrow">Custom Furniture</p>
            <p className="mt-3 text-ink/75 leading-relaxed">{project.customFurniture}</p>
          </section>
        )}
      </div>

      {more.length > 0 && (
        <div className="border-t hairline">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <p className="eyebrow mb-8">More Projects</p>
            <div className="grid gap-10 sm:grid-cols-2">
              {more.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="tag text-ink/60 mt-4">{p.location}</p>
                  <h3 className="font-serif text-xl mt-1">{p.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
