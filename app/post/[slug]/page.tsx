import { getPostBySlug } from "@/lib/service/postService";
import { notFound } from "next/navigation";
import PostHeader from "@/components/posts/postheader";
import TagChips from "@/components/posts/tags";
import PostEngagement from "@/components/posts/postengagement";
import CommentForm from "@/components/comments/commentsform";
import CommentItem from "@/components/comments/commentitem";
import { handleCreateComment } from "../actions";
import { toggleLikeAction, toggleCommentLikeAction } from "@/app/post/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, session] = await Promise.all([
    getPostBySlug(slug),
    getServerSession(authOptions),
  ]);
  if (!post) notFound();

  const userId = session?.user?.id as string | undefined;
  const postLiked = userId ? post.likedBy.includes(userId) : false;
  const onTogglePost = toggleLikeAction.bind(null, post.id, post.slug);
  const userLink = `/user/${post.author.id}`;
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const createdAt = new Date(post.createdAt).toLocaleString();

  return (
    <div className="pt-6 md:pt-10">
      <article className="bg-background mx-auto max-w-3xl space-y-4 rounded-lg border p-4 md:p-6 shadow-sm">
        <PostHeader authorName={authorName} authorImage={post.author.image} createdAt={createdAt} userLink={userLink}/>

        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h2>

        <TagChips tags={post.tags ?? []} />

        <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>

        <PostEngagement
          initialLiked={postLiked}
          likeCount={post.likedBy.length}
          commentCount={post._count?.comments ?? post.comments?.length ?? 0}
          onToggle={onTogglePost}
        />

        <CommentForm postId={post.id} slug={post.slug} action={handleCreateComment} />

        {post.comments?.length ? (
          <div className="space-y-6">
            {post.comments.map((c) => {
              const onToggleComment = toggleCommentLikeAction.bind(null, c.id, post.slug);
              return (
                <CommentItem
                  key={c.id}
                  id={c.id}
                  content={c.content}
                  createdAt={c.createdAt}
                  commenter={{
                    id: c.commenter.id,
                    firstName: c.commenter.firstName,
                    lastName: c.commenter.lastName,
                    image: c.commenter.image,
                  }}
                  currentUserId={userId}
                  likedBy={(c as any).likedBy}
                  onToggleLike={onToggleComment}
                />
              );
            })}
          </div>
        ) : null}
      </article>
    </div>
  );
}
