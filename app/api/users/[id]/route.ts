import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser } from "@/lib/service/userService";
import { requireSession } from "@/lib/auth/require-session";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const user = await getUser(params.id);
    if(!user) return NextResponse.json({error: "User not found"}, {status: 404});
    return NextResponse.json({ user });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try{
    const session = await requireSession();
    const sessionId = (session.user as any).id as string;
    const data = await request.json();
    const updatedUser = await updateUser(params.id, data, sessionId);
    return NextResponse.json({ updatedUser });
    }catch(error: any){
        const status = error.status ?? 400;
        return NextResponse.json({error: error.message ?? "Something went wrong"}, {status});
    }
}