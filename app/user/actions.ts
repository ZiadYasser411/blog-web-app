"use server";
import { requireSession } from "@/lib/auth/require-session";
import { deleteUser, updateUser as editUser } from "@/lib/service/userService";

export async function handleDeleteUser(id: string, sessionId: string) {
    const user =sessionId;
    const res = await deleteUser(id, user);
    return res;
}

export async function handleEditUser(formData: FormData) {
    const { user } = await requireSession();
    const id = user.id;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("username") as string;
    const patch: Record<string, string> = {
        firstName,
        lastName,
        username,
    };
    await editUser(id, patch, id);
}