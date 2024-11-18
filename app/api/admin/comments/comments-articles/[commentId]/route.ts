import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {commentId: string}})
{
    const { commentId } = params;

    try{

        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            },
            include: {
                    user: true,
                    article: true,
                },
        })


        return NextResponse.json(comment)

    } catch (error) {
        console.log("[COMMENT]", error)

        return new NextResponse("Internal error, {status: 500}")
    }
}