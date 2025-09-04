"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createUser(formdata : FormData): Promise<void>{
    const email = formdata.get("email") as string;
    const firstName = formdata.get("firstName") as string;
    const lastName = formdata.get("lastName") as string;
    const username = formdata.get("username") as string;
    const password = formdata.get("password") as string;
    if(!email || !firstName || !lastName || !username || !password) {
        throw new Error("Email, first name, last name, username and password are required");
    }
    try {
        await prisma.user.create({ data: { email, firstName, lastName, username, password} });
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
    redirect("/login");
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