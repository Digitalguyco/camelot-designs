"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

/**
 * A minimal rich-text editor for blog body copy (headings, bold/italic,
 * lists, links). Mirrors its HTML into a hidden `contentHtml` input on every
 * change so it submits like any other field in the surrounding <form>.
 */
export default function RichTextEditor({
  name = "contentHtml",
  initialHtml = "",
}: {
  name?: string;
  initialHtml?: string;
}) {
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": "Post body",
        "aria-multiline": "true",
      },
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div>
      <input type="hidden" name={name} value={html} readOnly />
      <div className="field px-4 py-3 text-sm leading-relaxed prose-editor min-h-[240px]">
        <EditorContent editor={editor} />
      </div>
      <p className="tag text-ink/60 mt-2">Bold, italic, headings, lists, and links.</p>
    </div>
  );
}
