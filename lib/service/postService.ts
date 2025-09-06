import { Tag } from "@prisma/client";
import { postRepository } from "../repository/postRepository";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

async function makeUniqueSlug(base: string, excludeId?: string) {
  let candidate = base || "post";
  let n = 2;
  while (await postRepository.slugExists(candidate, excludeId)) {
    candidate = `${base}-${n++}`;
  }
  return candidate;
}

export async function getAllPosts() {
  return postRepository.listAllPosts();
}

export async function getPost(id: string) {
  return postRepository.getPostById(id);
}

export async function getPostBySlug(slug: string) {
  return postRepository.getPostBySlug(slug);
}

export async function createPost(title: string, content: string, authorId: string, tags: Tag[]) {
  if (!title || !content || !authorId) {
    throw Object.assign(new Error("Title, content and authorId are required"));
  }
  const base = slugify(title);
  const slug = await makeUniqueSlug(base);
  //push sessionId to authorId
  return postRepository.createPost(title, slug, content, authorId, tags);
}

export async function editPost(id: string, authorId: string, sessionId: string, title: string, content: string) {
  if (!id)
    throw Object.assign(new Error("Post id is required"), { status: 400 });
  if(sessionId !== authorId) throw Object.assign(new Error("Unauthorized"), { status: 403 });
  const base = slugify(title);
  const slug = await makeUniqueSlug(base);
  return postRepository.editPost(id, title, slug, content);
}

export async function deletePost(id: string, authorId: string, sessionId: string) {
  if (!id)
    throw Object.assign(new Error("Post id is required"), { status: 400 });
  if(!authorId) throw Object.assign(new Error("Author id is required"), { status: 400 });
  if (sessionId !== authorId)
    throw Object.assign(new Error("Unauthorized"), { status: 403 });
  postRepository.deletePost(id);
  return { deleted: true };
}


