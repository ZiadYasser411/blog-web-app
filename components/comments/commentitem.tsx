import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LikeToggle from "@/components/ui/likebutton";
import Link from "next/link";
import { DropdownMenuComment } from "../ui/dropdownComment";

type ToggleResult = { liked: boolean; likeCount: number };

export default function CommentItem({
  id,
  content,
  createdAt,
  commenter,
  currentUserId,
  likedBy,
  onToggleLike,
}: {
  id: string;
  content: string;
  createdAt: string | Date;
  commenter: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  currentUserId?: string;
  likedBy?: string[];
  onToggleLike?: () => Promise<ToggleResult>;
}) {
  const name = `${commenter.firstName} ${commenter.lastName}`;
  const initials = `${commenter.firstName?.[0] ?? ""}${
    commenter.lastName?.[0] ?? ""
  }`.toUpperCase();
  const ts = new Date(createdAt).toLocaleString();

  const initialLiked = currentUserId
    ? !!likedBy?.includes(currentUserId)
    : false;
  const likeCount = likedBy?.length ?? 0;

  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8">
        {commenter.image ? (
          <AvatarImage src={commenter.image} alt={name} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <Link
            href={`/user/${commenter.id}`}
            className="text-sm font-semibold leading-none"
          >
            {name}
          </Link>
          <p className="text-xs text-muted-foreground">{ts}</p>
        </div>
        <p className="text-sm text-foreground">{content}</p>

        {onToggleLike ? (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <LikeToggle initialLiked={initialLiked} onToggle={onToggleLike} />
            <span>
              {likeCount
                ? `${likeCount} ${likeCount === 1 ? "like" : "likes"}`
                : "No likes yet"}
            </span>
          </div>
        ) : null}
      </div>
      {currentUserId === commenter.id ? (
        <DropdownMenuComment
          commentId={id as string}
          commenterId={commenter.id as string}
          sessionId={currentUserId as string}
        />
      ) : null}
    </div>
  );
}
