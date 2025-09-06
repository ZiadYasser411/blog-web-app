import { getPostBySlug } from "@/lib/service/postService";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { handleCreateComment } from "../actions";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/ui/likebutton";

export default async function PostPage({ params }: { params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const authorFullName = `${post.author.firstName} ${post.author.lastName}`;
  const initials = `${post.author.firstName?.[0] ?? ""}${post.author.lastName?.[0] ?? ""}`.toUpperCase();
  const createdAt = post.createdAt ? new Date(post.createdAt).toUTCString() : "";
  const likeCount = post.likedBy.length;
  const commentCount = post._count?.comments ?? post.comments?.length ?? 0;

  return (
    <div className="pt-6 md:pt-10">
      <article className="bg-background mx-auto max-w-3xl space-y-4 rounded-lg border p-4 md:p-6 shadow-sm">
        <header className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {post.author.image ? (
              <AvatarImage src={post.author.image} alt={authorFullName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-none">{authorFullName}</h1>
            <p className="text-muted-foreground text-xs">{createdAt}</p>
          </div>
        </header>

        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h2>

        {post.tags?.length ? (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="prose max-w-none whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <LikeButton postId={post.id} slug={post.slug} initialLiked={post.likedBy.length > 0} initialCount={likeCount} />
          <span>
            {likeCount ? `${likeCount} ${likeCount === 1 ? "like" : "likes"}` : "No likes yet"}
          </span>
          <span>•</span>
          <span>
            {commentCount ? `${commentCount} ${commentCount === 1 ? "comment" : "comments"}` : "No comments yet"}
          </span>
        </div>
        <form className="flex flex-1 gap-2" action={handleCreateComment} >
            <Input type="hidden" name="postId" value={post.id} />
            <Input type="hidden" name="slug" value={post.slug} />
            <Input id="content" name="content" placeholder="Leave a comment..."/>
            <Button type="submit">Comment</Button>
        </form>
        {post.comments?.length ? (
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  {comment.commenter.image ? (
                    <AvatarImage src={comment.commenter.image} alt={comment.commenter.firstName} />
                  ) : null}
                  <AvatarFallback>{comment.commenter.firstName?.[0] ?? ""}{comment.commenter.lastName?.[0] ?? ""}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="flex items-baseline-last gap-2">
                        <p className="text-md font-semibold leading-none">{comment.commenter.firstName} {comment.commenter.lastName}</p>
                        <p className="text-xs text-muted-foreground"> {new Date(comment.createdAt).toUTCString()}</p>
                    </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </article>
    </div>
  );
}
