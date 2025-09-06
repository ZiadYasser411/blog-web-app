"use server";
import { Tag } from "@prisma/client";
import { createPost, toggleLike } from "@/lib/service/postService";
import { toggleLike as toggleCommentLike } from "@/lib/service/commentService";
import { requireSession } from "@/lib/auth/require-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TAG_OPTIONS } from "@/lib/constants/tags";
import { createComment } from "@/lib/service/commentService";

const allowedTags = new Set(TAG_OPTIONS);

export async function handleCreatePost(formdata: FormData) {
  const session = await requireSession();
  const authorId = session.user.id;
  const title = formdata.get("title") as string;
  const content = formdata.get("content") as string;
  const formTags = formdata.getAll("tags") as string[];
  const selectedTags = formTags.filter((tag) =>
    allowedTags.has(tag as any)
  ) as Tag[];
  if (title && content) {
    const post = await createPost(title, content, authorId, selectedTags);
    redirect(`/post/${post.slug}`);
  }
}

export async function handleCreateComment(formdata: FormData) {
  const session = await requireSession();
  const commenterId = session.user.id;
  const postId = formdata.get("postId") as string;
  const slug = formdata.get("slug") as string;
  const content = formdata.get("content") as string;
  if (postId && content) {
    await createComment(postId, content, commenterId);
    revalidatePath(`/post/${slug}`);
  }
}

export async function toggleLikeAction(postId: string, slug?: string) {
  const { user } = await requireSession();
  const res = await toggleLike(postId, user.id);
  if (slug) revalidatePath(`/post/${slug}`);
  return res;
}

export async function toggleCommentLikeAction(commentId: string, slug?: string) {
  const { user } = await requireSession();
  const res = await toggleCommentLike(commentId, user.id);
  if (slug) revalidatePath(`/post/${slug}`);
  return res;
}