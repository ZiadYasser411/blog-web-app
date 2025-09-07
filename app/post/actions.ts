"use server";
import { Tag } from "@prisma/client";
import { createPost, deletePost, editPost, toggleLike } from "@/lib/service/postService";
import { editComment, toggleLike as toggleCommentLike } from "@/lib/service/commentService";
import { requireSession } from "@/lib/auth/require-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TAG_OPTIONS } from "@/lib/constants/tags";
import { createComment, deleteComment } from "@/lib/service/commentService";

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

export async function handleDeleteComment(commentId: string, commenterId: string, slug?: string) {
  const { user } = await requireSession();
  const res = await deleteComment(commentId, commenterId, user.id);
  if (slug) revalidatePath(`/post/${slug}`);
  return res;
}

export async function handleDeletePost(postId: string, authorId: string, slug?: string) {
  const { user } = await requireSession();
  const res = await deletePost(postId, authorId, user.id);
  if (slug) revalidatePath(`/post/${slug}`);
  return res;
}

export async function handleEditPost(postId: string, formData: FormData){
  const { user } = await requireSession();
  const id = user.id;
  const post = postId;
  const authorId = formData.get("authorId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await editPost(post, authorId, id, title, content);
  revalidatePath(`/post/${formData.get("slug")}`);
}

export async function handleEditComment(commentId: string, formData: FormData){
  const { user } = await requireSession();
  const id = user.id;
  const comment = commentId;
  const commenterId = formData.get("commenterId") as string;
  const content = formData.get("content") as string;
  await editComment(comment, commenterId, id, content);
  revalidatePath(`/post/${formData.get("slug")}`);
}