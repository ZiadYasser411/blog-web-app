"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/app/post/actions";
import { cn } from "@/lib/utils";

type Props = {
  postId: string;
  slug?: string;
  initialLiked: boolean;
  initialCount: number;
  className?: string;
};

export default function LikeButton({
  postId,
  slug,
  initialLiked,
  initialCount,
  className,
}: Props) {
  const [liked, setLiked]   = useState(initialLiked);
  const [count, setCount]   = useState(initialCount);
  const [isPending, start]  = useTransition();

  async function onToggle() {
    // optimistic update
    setLiked((v) => !v);
    setCount((c) => c + (liked ? -1 : 1));

    start(async () => {
      try {
        const res = await toggleLikeAction(postId, slug);
        // sync with server truth in case of races
        setLiked(res.liked);
        setCount(res.likeCount);
      } catch (err: any) {
        // rollback on error
        setLiked(initialLiked);
        setCount(initialCount);

        // if not authenticated, send to login
        if (typeof window !== "undefined" && /Unauthorized/i.test(String(err?.message))) {
          const target = slug ? `/login?callbackUrl=/post/${encodeURIComponent(slug)}` : "/login";
          window.location.href = target;
        } else {
          console.error("Like failed:", err);
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm",
        "transition-opacity disabled:opacity-60",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-transform",
          liked ? "text-rose-500 fill-current" : "text-foreground"
        )}
      />
    </button>
  );
}
