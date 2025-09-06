import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const err = new Error("Unauthorized") as any;
    err.status = 401;
    throw err;
  }
  return session;
}