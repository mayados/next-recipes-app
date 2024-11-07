import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function POST(req: NextRequest)
{

    // specific method to retrieve body (with NextRequest)
    const data = await req.json();  
    const { text, clerkUserId, recipeId, createdAt, email, userPseudo } = data;

    try{

        console.log("Les données reçues en back sont : "+data)
        // We search if the user already exists in the database (beacause we use Clerk to manage users, but we have a local table User in the database)
        let dbUser = await db.user.findUnique({
            where: { 
                clerkUserId: clerkUserId,
            },
        });
                      
        // If the user doesn't exist in the database, we create him (because the authentication is made with clerk ,and we have to be sure to link a user of the database to the current user)
        if (!dbUser) {
            dbUser = await db.user.create({
                data: {
                    clerkUserId: clerkUserId,
                    mail: email,
                    pseudo: userPseudo,
                    picture: "",
                },
            });
        }

        const comment = await db.comment.create({
            data: {
                text: String(text),
                userId: dbUser.id,
                recipeId: String(recipeId),
                createdAt: createdAt,
            }
        })

        return NextResponse.json({
            success: true,
            comment: { 
                id: comment.id,
                text: comment.text,
                createdAt: comment.createdAt,
                userId: comment.userId,
                user: {
                    pseudo: dbUser.pseudo,
                    picture: dbUser?.picture
                },
                recipeId: comment.recipeId,
            },
        });

    } catch (error) {
        // servor side : SSR
        console.log("[DATA]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}