import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {tagId: string}})
{
    const { tagId } = params;

    try{

        // Retrieve the tag to delete
        const tag = await db.tag.delete({
            where: {
                id: tagId
            }
        })

        // Retrieve tagArticles to delete
        const tagArticles = await db.tagArticle.deleteMany({
            where: {
                tagId: tagId
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