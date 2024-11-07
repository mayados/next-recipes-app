import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {favoriteId: string}})
{
    const { favoriteId } = params;

    try{

        // Retrieve the comment to delete
        const favorite = await db.favorite.delete({
            where: {
                id: favoriteId
            }
        })

        return new NextResponse(JSON.stringify({ success: true, message: 'Favorite removed with success' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[FAVORITE]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}