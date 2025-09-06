import prisma from "../prisma";

export const commentRepository = {
  createComment: (content: string, postId: string, commenterId: string) => {
    return prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        commenter: { connect: { id: commenterId } },
      },
      select: { id: true , content: true, createdAt: true, updatedAt: true },
    });
  },

  getCommentsByPostId: (postId: string) => {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: { commenter: true },
    });
  },

  deleteComment: (id: string) => {
    return prisma.comment.delete({ where: { id }, select: { id: true } });
  },

  editComment: (id: string, content: string) => {
    return prisma.comment.update({
      where: { id },
      data: { content },
      select: { id: true, content: true },
    });
  },

  toggleLike: async (commentId: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({ where: { id: commentId }, select: { likedBy: true } });
      if (!comment) throw Object.assign(new Error("Comment not found"), { status: 404 });
      const liked = comment.likedBy.includes(userId);
      const next = liked ? comment.likedBy.filter((id) => id !== userId) : [...new Set([...comment.likedBy, userId])];
      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { likedBy: { set: next } },
        select: { id: true, likedBy: true },
      });
      return { liked: !liked, likeCount: updated.likedBy.length };
    });
  },
};
