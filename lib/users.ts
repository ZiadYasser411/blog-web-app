"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { posts: true, comments: true },
                },
            }
        });
        return users;
    } catch (error) {
        console.error("Error getting all users:", error);
        throw new Error("Failed to get all users");
    }
}

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

export async function createUser(email: string, firstName: string, lastName: string, username: string, password: string) {
    if(!email || !firstName || !lastName || !username || !password) {
        throw new Error("Email, first name, last name, username and password are required");
    }
    try {
        const user = await prisma.user.create({ data: { email, firstName, lastName, username, password} });
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

export async function editUser(id: string, firstName: string, lastName: string, username: string) {
    try {
        const user = await prisma.user.update({ where: { id }, data: { firstName, lastName, username } });
        revalidatePath("/");
        return user;
    } catch (error) {
        console.error("Error editing user:", error);
        throw new Error("Failed to edit user");
    }
}