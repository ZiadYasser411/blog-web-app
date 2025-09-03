"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string, commenterId: string) {
    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                commenterId,
            },
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