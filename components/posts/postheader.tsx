import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { DropdownMenuPost } from "../ui/dropdownPost";

export default function PostHeader({
  authorName,
  authorImage,
  createdAt,
  userLink,
  sessionId,
  postId,
  authorId,
}: {
  authorName: string;
  authorImage?: string | null;
  createdAt: string;
  userLink?: string;
  sessionId?: string;
  postId?: string;
  authorId?: string;
}) {
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex">
      <header className="flex items-center flex-1 gap-3">
        <Avatar className="h-10 w-10">
          {authorImage ? (
            <AvatarImage src={authorImage} alt={authorName} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <Link
            href={userLink as string}
            className="text-lg font-semibold leading-none"
          >
            {authorName}
          </Link>
          <p className="text-muted-foreground text-xs">{createdAt}</p>
        </div>
      </header>
      {sessionId === authorId ? (
        <DropdownMenuPost
          postId={postId as string}
          authorId={authorId as string}
          sessionId={sessionId as string}
        />
      ) : null}
    </div>
  );
}
