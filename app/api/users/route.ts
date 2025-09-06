import { NextRequest, NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/lib/service/userService";

export async function GET() {
    const users = await getAllUsers();
    return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
    const {email, password, firstName, lastName, username} = await request.json();
    try{
        const user = await createUser(email, password, firstName, lastName, username);
        return NextResponse.json({user}, {status: 201});
    }catch(error: any){
        const status = error.status ?? 400;
        return NextResponse.json({error: error.message ?? "Something went wrong"}, {status});
    }
}