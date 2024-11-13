
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest, {params}: {params: {clerkUserId: string}}) {

    const { clerkUserId } = params;

    try {
        // call to Clerk API to get the users and limit the results to 10 users by page
        const response = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}/ban`, {
            headers: {
                // We have to use our API Key here
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, 
            },
        });

        if (!response.ok) {
            throw new Error("Error when retrieving the user");
        }

        const user = await response.json();
        console.log(user)
            return NextResponse.json(user)
        } catch (error) {
            console.log("[RESPONSE]", error)

            return new NextResponse("Internal error, {status: 500}")
        }

}
