"use server";
import { Tag } from "@prisma/client";
import { createPost } from "@/lib/service/postService";
import { requireSession } from "@/lib/auth/require-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TAG_OPTIONS } from "@/lib/constants/tags";

const allowedTags = new Set(TAG_OPTIONS);

export async function handleCreatePost(formdata: FormData) {
    const session = await requireSession();
    const authorId = session.user.id;
    const title = formdata.get("title") as string;
    const content = formdata.get("content") as string;
    const formTags = formdata.getAll("tags") as string[];
    const selectedTags = formTags.filter((tag) => allowedTags.has(tag as any)) as Tag[];
    if (title && content) {
      await createPost(title, content, authorId, selectedTags);
    }
    redirect("/posts");
  }