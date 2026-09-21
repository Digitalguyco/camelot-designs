import Link from "next/link";
import { getAllProjects } from "@/lib/data/projects";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { deleteProject } from "./actions";

export default async function AdminProjectsPage() {
  const items = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Projects</h1>
        <Link href="/admin/projects/new" className="btn-primary px-5 py-2.5 text-sm tracking-wide">
          New Project
        </Link>
      </div>

      <div className="mt-8 divide-y hairline border-t border-b hairline">
        {items.length === 0 && <p className="py-6 text-ink/60 text-sm">No projects yet.</p>}
        {items.map((project) => (
          <div key={project.id} className="flex items-center gap-4 py-4">
            <img
              src={project.images[0]}
              alt=""
              className="h-16 w-16 object-cover bg-stone flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg truncate">
                {project.name} {project.featured && <span className="tag text-gold ml-2">Featured</span>}
              </p>
              <p className="tag text-ink/55 mt-0.5">
                {project.location} · {project.projectType}
              </p>
            </div>
            <Link href={`/admin/projects/${project.id}`} className="tag text-ink/70 hover:text-gold transition-colors">
              Edit
            </Link>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={project.id} />
              <ConfirmSubmit
                message={`Delete "${project.name}"? This can't be undone.`}
                className="tag text-red-400/80 hover:text-red-400 transition-colors"
              >
                Delete
              </ConfirmSubmit>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
