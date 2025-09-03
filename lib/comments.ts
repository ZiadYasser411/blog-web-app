"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string, commenterId: string) {
    if (!postId || !content || !commenterId) {
        throw new Error("PostId, content, and commenterId are required");
    }
    try {
        const postExists = await prisma.post.findUnique({ where: { id: postId } });
        const commenterExists = await prisma.user.findUnique({ where: { id: commenterId } });
        if (!postExists) {
            throw new Error("Post does not exist");
        }
        if (!commenterExists) {
            throw new Error("Commenter does not exist");
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                post: { connect: { id: postId } },
                commenter: { connect: { id: commenterId } },
            },
            include: { commenter: true, post: true },
        });
        revalidatePath(`/posts/${postId}`);
        return comment;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to create comment");
    }
}

export async function deleteComment(id: string) {
    try {
        await prisma.comment.delete({
            where: {
                id,
            },
        });
        return true;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }
}

export async function editComment(id: string, content: string) {
    try {
        const comment = await prisma.comment.update({
            where: {
                id,
            },
            data: {
                content,
            },
        });
        revalidatePath(`/posts/${comment.postId}`);
        return comment;
    } catch (error) {
        console.error("Error editing comment:", error);
        throw new Error("Failed to edit comment");
    }
}