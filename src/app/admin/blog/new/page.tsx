import PostForm from "../PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl">New Post</h1>
      <div className="mt-8">
        <PostForm action={createPost} submitLabel="Create Post" />
      </div>
    </div>
  );
}
