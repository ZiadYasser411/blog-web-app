"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({ 
            where: { id }, 
            include: { 
                posts: {
                    orderBy: { createdAt: "desc" },
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                },
                _count: {
                    select: { posts: true, comments: true },
                },
            } });
        return user;
    } catch (error) {
        console.error("Error getting user by id:", error);
        throw new Error("Failed to get user by id");
    }
}

export async function createUser(email: string, name: string, username: string) {
    if(!email || !name || !username) {
        throw new Error("Email, name, and username are required");
    }
    try {
        const user = await prisma.user.create({ data: { email, name, username } });
        revalidatePath("/");
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath("/");
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}

export async function editUser(id: string, name: string, username: string) {
    try {
        const user = await prisma.user.update({ where: { id }, data: { name, username } });
        revalidatePath("/");
        return user;
    } catch (error) {
        console.error("Error editing user:", error);
        throw new Error("Failed to edit user");
    }
}