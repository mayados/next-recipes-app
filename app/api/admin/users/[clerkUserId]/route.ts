
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest, {params}: {params: {clerkUserId: string}}) {

    const { clerkUserId } = params;

    try {
        // call to Clerk API to get the users and limit the results to 10 users by page
        const response = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
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

        // we retrieve the id of the clerkUser in the database
        const dbUser = await db.user.findUnique({
            where: {
                clerkUserId: clerkUserId
            }
        })

        const dbUserId = dbUser?.id;
        const countRecipes = await db.recipe.count({
            where: {
                userId: dbUserId,
            }
        })

        const countComments = await db.comment.count({
            where: {
                userId: dbUserId,
            }
        })

         
            // We return the user (from clerk), but also the number of recipes and comments he created
            return NextResponse.json({
                user,
                countRecipes,
                countComments, 
            })
        } catch (error) {
            console.log("[RESPONSE]", error)

            return new NextResponse("Internal error, {status: 500}")
        }

}
