import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data/projects";
import ProjectForm from "../ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const boundAction = updateProject.bind(null, project.id);

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit Project</h1>
      <div className="mt-8">
        <ProjectForm action={boundAction} project={project} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
