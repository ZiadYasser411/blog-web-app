// Server component
import PostHeader from "@/components/posts/PostHeader";
import TagChips from "@/components/posts/Tags";
import PostEngagement from "@/components/posts/PostEngagement";
import CommentForm from "@/components/comments/CommentsForm";
import CommentItem from "@/components/comments/CommentItem";
import {
  handleCreateComment,
  toggleCommentLikeAction,
  toggleLikeAction,
} from "@/app/post/actions";

type Post = Awaited<ReturnType<typeof import("@/lib/service/postService").getAllPosts>>[number];

export default function PostList({
  posts,
  currentUserId,
}: {
  posts: Post[];
  currentUserId?: string;
  revalidateExtraPaths?: string[];
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
      {posts.map((post) => {
        const postLiked = currentUserId ? post.likedBy.includes(currentUserId) : false;
        const onTogglePost = toggleLikeAction.bind(null, post.id, post.slug);
        const userLink = `/user/${post.author.id}`;
        const authorName = `${post.author.firstName} ${post.author.lastName}`;
        const createdAt = new Date(post.createdAt).toLocaleString();

        return (
          <article
            key={post.id}
            className="bg-background mx-auto max-w-3xl space-y-4 rounded-lg border p-4 md:p-6 shadow-sm"
          >
            <PostHeader
              authorName={authorName}
              authorImage={post.author.image}
              createdAt={createdAt}
              userLink={userLink}
              postId={post.id}
              authorId={post.author.id}
              sessionId={currentUserId}
            />

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
                      currentUserId={currentUserId}
                      likedBy={c.likedBy}
                      onToggleLike={onToggleComment}
                    />
                  );
                })}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
