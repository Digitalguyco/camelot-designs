import { notFound } from "next/navigation";
import { getPostById } from "@/lib/data/posts";
import PostForm from "../PostForm";
import { updatePost } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const boundAction = updatePost.bind(null, post.id);

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit Post</h1>
      <div className="mt-8">
        <PostForm action={boundAction} post={post} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
