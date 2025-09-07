import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TagSelector from "@/components/posts/TagSelector";
import { handleCreatePost } from "../../app/post/actions";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

function PostForm() {
  return (
    <div className="w-sm sm:w-3xl">
      <form action={handleCreatePost} className="space-y-4 rounded-lg">
        <h1 className="text-4xl font-bold mb-6 tracking-tight text-balance">
          Share what's on your mind.
        </h1>
        <div className="grid gap-1">
          <Label htmlFor="title">Title<a className="text-red-500">*</a></Label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Content (Optional)"
            required
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="tags">Tags</Label>
          <TagSelector />
        </div>
        <Button className="w-full" type="submit">
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Button>
      </form>
    </div>
  );
}

export default PostForm;
