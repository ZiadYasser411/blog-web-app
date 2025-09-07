"use server";

import { requireSession } from "@/lib/auth/require-session";
import { deleteUser } from "@/lib/service/userService";

export async function handleDeleteUser(id: string, sessionId: string) {
    const { user } = await requireSession();
    const res = await deleteUser(id, user.id);
    return res;
}