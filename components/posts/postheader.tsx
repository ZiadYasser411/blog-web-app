import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PostHeader({
  authorName,
  authorImage,
  createdAt,
}: {
  authorName: string;
  authorImage?: string | null;
  createdAt: string;
}) {
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        {authorImage ? <AvatarImage src={authorImage} alt={authorName} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-none">{authorName}</h1>
        <p className="text-muted-foreground text-xs">{createdAt}</p>
      </div>
    </header>
  );
}
