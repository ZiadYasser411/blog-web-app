import LikeToggle from "@/components/ui/likebutton";

type ToggleResult = { liked: boolean; likeCount: number };

export default function PostEngagement({
  initialLiked,
  likeCount,
  commentCount,
  onToggle,
}: {
  initialLiked: boolean;
  likeCount: number;
  commentCount: number;
  onToggle: () => Promise<ToggleResult>;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <LikeToggle initialLiked={initialLiked} onToggle={onToggle} />
      <span>{likeCount ? `${likeCount} ${likeCount === 1 ? "like" : "likes"}` : "No likes yet"}</span>
      <span>•</span>
      <span>
        {commentCount ? `${commentCount} ${commentCount === 1 ? "comment" : "comments"}` : "No comments yet"}
      </span>
    </div>
  );
}
