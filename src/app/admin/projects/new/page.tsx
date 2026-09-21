import ProjectForm from "../ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">New Project</h1>
      <div className="mt-8">
        <ProjectForm action={createProject} submitLabel="Create Project" />
      </div>
    </div>
  );
}
