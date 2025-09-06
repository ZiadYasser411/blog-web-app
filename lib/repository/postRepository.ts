import prisma from "../prisma";
import { Tag } from "@prisma/client";

const basePostSelect = {
  id: true,
  title: true,
  slug: true,
  content: true,
  tags: true,
  likedBy: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      image: true,
    },
  },
};

export const postRepository = {
  listAllPosts: () => {
    return prisma.post.findMany({
      select: {
        ...basePostSelect,
        _count: { select: { comments: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            commenter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getPostById: (id: string) => {
    return prisma.post.findUnique({
      where: { id },
      select: {
        ...basePostSelect,
        _count: { select: { comments: true } },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            commenter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });
  },

  createPost: (
    title: string,
    slug: string,
    content: string,
    authorId: string,
    tags: Tag[]
  ) => {
    return prisma.post.create({
      data: {
        title,
        slug,
        content,
        tags,
        author: { connect: { id: authorId } },
      },
      select: basePostSelect
    });
  },

  editPost: (id: string, title: string, slug: string, content: string) => {
    return prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
      },
      select: basePostSelect
    });
  },

  deletePost: (id: string) => {
    return prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);
  },

  toggleLike: async (postId: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({ where: { id: postId }, select: { likedBy: true } });
    if (!post) throw Object.assign(new Error("Post not found"), { status: 404 });
    const liked = post.likedBy.includes(userId);
    const next = liked ? post.likedBy.filter((id) => id !== userId) : [...new Set([...post.likedBy, userId])];
    const updated = await tx.post.update({
      where: { id: postId },
      data: { likedBy: { set: next } },
      select: { id: true, likedBy: true },
    });
    return { liked: !liked, likeCount: updated.likedBy.length };
  });
  },

  slugExists: async (slug: string, excludeId?: string): Promise<boolean> => {
    const existing = await prisma.post.findFirst({
      where: excludeId ? { slug, NOT: { id: excludeId } } : { slug },
      select: { id: true },
    });
    return !!existing;
  },
};
