"use server";
import prisma from "@/lib/prisma";
import { Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        comments: {
          include: {
            commenter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function createPost(
  title: string,
  content: string,
  authorId: string,
  tags: Tag[]
) {
  if (!title || !authorId) {
    throw new Error("Title and authorId are required");
  }
  try {
    const userExists = await prisma.user.findUnique({ where: { id: authorId } });
    if (!userExists) {
      throw new Error("User does not exist");
    }
    const slug = generateSlug(title);
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        author: {connect: {id: authorId} },
        tags,
      },
      include: { author: true }
    });
    revalidatePath("/");
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

export async function editPost(id: string, title: string, content: string) {
  try {
    const slug = generateSlug(title);
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        slug,
      },
    });
    return true;
  } catch (error) {
    console.error("Error editing post:", error);
    throw new Error("Failed to edit post");
  }
}

export async function toggleLike(PostId: string, userId: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id: PostId } });
    if(!post) throw new Error("Post not found");
    const isLiked = post.likedBy.includes(userId);
    await prisma.post.update({
      where: {
        id: PostId,
      },
      data: {
        likedBy: isLiked 
        ? post.likedBy.filter((id) => id !== userId) 
        : [...post.likedBy, userId],
        }
    });
    revalidatePath(`/posts/${PostId}`);
    return {success: true, isLiked: !isLiked, likeCount: post.likedBy.length};
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Failed to like post");
  }
}

export async function isPostLikedByUser(PostId: string, userId: string) {
  try {
    const post = await prisma.post.findUnique({ 
      where: { id: PostId },
      select: { likedBy: true }, 
    });

    return post? post.likedBy.includes(userId) : false;
  } catch (error) {
    console.error("Error checking if post is liked by user:", error);
    throw new Error("Failed to check if post is liked by user");
  }
}