import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function POST(req: NextRequest)
{

    // specific method to retrieve body (with NextRequest)
    const data = await req.json();  
    const { text, userId, articleId, createdAt } = data;

    try{

        // Retrieve the comment to delete
        const comment = await db.comment.create({
            data: {
                text: String(text),
                userId: String(userId),
                articleId: String(articleId),
                createdAt: createdAt,
            }
        })

        const user = await db.user.findUnique({ where: { id: userId } }); 
        const pseudo = user ? user.pseudo : "Unknown User" ;


        return NextResponse.json({
            success: true,
            comment: { 
                id: comment.id,
                text: comment.text,
                createdAt: comment.createdAt,
                userId: comment.userId,
                user: {
                    pseudo: pseudo,
                    picture: user?.picture
                },
                articleId: comment.articleId,
            },
        });

    } catch (error) {
        // servor side : SSR
        console.log("[DATA]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}