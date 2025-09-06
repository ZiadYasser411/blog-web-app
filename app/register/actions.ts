"use server";

import { redirect } from "next/navigation";
import { createUser } from "@/lib/service/userService";

export async function registerAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("username") as string;
    await createUser(email, password, firstName, lastName, username);
    redirect("/login");
}