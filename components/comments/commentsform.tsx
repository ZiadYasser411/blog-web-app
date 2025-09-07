import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";

export default function CommentForm({
  postId,
  slug,
  action,
}: {
  postId: string;
  slug: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form className="flex w-full items-center gap-2" action={action}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      <Input id="content" name="content" placeholder="Leave a comment..." required />
      <Button type="submit">
      <MessageCircleIcon className="h-4 w-4" />
        Comment</Button>
    </form>
  );
}
