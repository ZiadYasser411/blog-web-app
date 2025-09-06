import { createPost } from "@/lib/posts";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function PostForm() {
  async function handleCreatePost(formdata: FormData) {
    "use server";
    const title = formdata.get("title") as string;
    const content = formdata.get("content") as string;
    const authorId = formdata.get("authorId") as string;
    const tags = formdata.getAll("tags") as string[];
    if (title && content) {
      await createPost(title, content, authorId, tags);
    }
  }
  return (
    <div className="w-xl">
      <form 
      action={handleCreatePost}
      className="space-y-4 rounded-lg p-6">
        <h1 className='text-4xl font-bold mb-6 tracking-tight text-balance'>Share what's on your mind with us.</h1>
        <Input className="pb-2"
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          required
        />
        <Textarea className="pb-2"
          id="content"
          name="content"
          placeholder="Content (Optional)"
          required
        />
        <Button className="w-full" type="submit">+ Create Post</Button>
      </form>
    </div>
  );
}

export default PostForm;
