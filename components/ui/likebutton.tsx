// components/like/LikeToggle.tsx
"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type ToggleResult = { liked: boolean; likeCount?: number };

export default function LikeToggle({
  initialLiked,
  onToggle,               // server action pre-bound with ids
  className,
  size = 20,
  onResult,               // optional: parent can react to server result
}: {
  initialLiked: boolean;
  onToggle: () => Promise<ToggleResult>;
  className?: string;
  size?: number;
  onResult?: (r: ToggleResult) => void;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, start] = useTransition();

  function handleClick() {
    // optimistic fill/unfill
    setLiked((v) => !v);

    start(async () => {
      try {
        const res = await onToggle();
        setLiked(res.liked);       // sync to server truth
        onResult?.(res);
      } catch (e: any) {
        // rollback on error
        setLiked(initialLiked);
        if (/Unauthorized|401/.test(String(e?.message))) {
          window.location.href = "/login";
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "inline-flex items-center rounded-md p-1 transition-opacity disabled:opacity-60",
        className
      )}
    >
      <Heart
        width={size}
        height={size}
        className={cn(liked ? "text-rose-500 fill-current" : "text-foreground")}
      />
      <span className="sr-only">{liked ? "Unlike" : "Like"}</span>
    </button>
  );
}
