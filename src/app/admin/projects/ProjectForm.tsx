"use client";

import { useActionState, useState } from "react";
import type { Project } from "@/lib/data/projects";
import type { ProjectFormState } from "./actions";

const initialState: ProjectFormState = {};

export default function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (prev: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  project?: Project;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [keepImages, setKeepImages] = useState<string[]>(project?.images ?? []);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Project Name" name="name" defaultValue={project?.name} required />
        <Field label="Location" name="location" defaultValue={project?.location} required />
        <Field
          label="Project Type"
          name="projectType"
          defaultValue={project?.projectType}
          required
          placeholder="Residential, Commercial, Hospitality…"
        />
        <Field label="Our Role" name="role" defaultValue={project?.role} required />
      </div>

      <div>
        <label htmlFor="scope" className="tag text-ink/60">
          Scope of Work
        </label>
        <textarea
          id="scope"
          name="scope"
          rows={2}
          defaultValue={project?.scope}
          required
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="concept" className="tag text-ink/60">
          Design Concept — full write-up
        </label>
        <p className="mt-1 text-xs text-ink/45">
          Leave a blank line between paragraphs — each one is shown as its own paragraph on the
          project page.
        </p>
        <textarea
          id="concept"
          name="concept"
          rows={12}
          defaultValue={project?.concept}
          required
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="materials" className="tag text-ink/60">
          Materials
        </label>
        <textarea
          id="materials"
          name="materials"
          rows={3}
          defaultValue={project?.materials}
          required
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      <div>
        <label htmlFor="customFurniture" className="tag text-ink/60">
          Custom Furniture — optional
        </label>
        <textarea
          id="customFurniture"
          name="customFurniture"
          rows={3}
          defaultValue={project?.customFurniture ?? ""}
          className="field mt-2 w-full px-4 py-3 text-sm leading-relaxed"
        />
      </div>

      {project && keepImages.length > 0 && (
        <div>
          <p className="tag text-ink/60">Current images (first is the cover)</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {keepImages.map((src) => (
              <div key={src} className="relative">
                <input type="hidden" name="keepImages" value={src} />
                {/* Uploaded images are user content, not a bundled asset — plain <img> avoids next/image's remote-pattern setup. */}
                <img src={src} alt="" className="h-24 w-24 object-cover bg-stone" />
                <button
                  type="button"
                  onClick={() => setKeepImages((imgs) => imgs.filter((i) => i !== src))}
                  className="absolute -right-2 -top-2 bg-ink text-card w-6 h-6 text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="images" className="tag text-ink/60">
          {project ? "Add more images" : "Images"}
        </label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="field mt-2 w-full px-4 py-3 text-sm"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-6 py-3 text-sm tracking-wide disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="tag text-ink/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="field mt-2 w-full px-4 py-3 text-sm"
      />
    </div>
  );
}
