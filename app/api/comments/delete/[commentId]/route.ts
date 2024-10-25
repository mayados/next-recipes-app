import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {commentId: string}})
{
    const { commentId } = params;

    try{

        // Retrieve the comment to delete
        const comment = await db.comment.delete({
            where: {
                id: commentId
            }
        })

        return new NextResponse(JSON.stringify({ success: true, message: 'Commentaire supprimé avec succès' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[COMMENT]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}