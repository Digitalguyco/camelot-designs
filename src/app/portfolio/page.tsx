import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/content";
import { getAllProjects } from "@/lib/data/projects";
import Reveal from "@/components/Reveal";

// Project data lives in the database and changes from /admin — always render fresh.
export const dynamic = "force-dynamic";

const description = `A selection of recent interior design projects by ${site.name}.`;

export const metadata: Metadata = {
  title: "Portfolio",
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: `Portfolio — ${site.name}`, description, url: "/portfolio" },
};

export default async function Portfolio() {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="eyebrow">Portfolio</p>
      <h1 className="font-serif text-4xl sm:text-5xl mt-2">Selected Projects</h1>
      <p className="mt-4 max-w-xl text-ink/65 leading-relaxed">
        A look at a few of the spaces we&apos;ve helped bring to life.
      </p>

      {projects.length === 0 ? (
        <p className="mt-14 text-ink/60">Nothing published yet — check back soon.</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 80}>
              <Link href={`/portfolio/${project.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-stone">
                  {/* Admin-uploaded content — plain <img>, see ProductCard. */}
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-0 top-4 bg-ink text-card px-3 py-1 tag">
                    {project.projectType}
                  </span>
                </div>
                <p className="tag text-ink/60 mt-3">{project.location}</p>
                <h3 className="font-serif text-lg mt-1">{project.name}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
