import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {ingredientId: string}})
{
    const { ingredientId } = params;

    try{

        // Retrieve the tag to delete
        const ingredient = await db.ingredient.delete({
            where: {
                id: ingredientId
            }
        })

        // Retrieve tagArticles to delete
        const compositions = await db.composition.deleteMany({
            where: {
                ingredientId: ingredientId
            }
        })

        return new NextResponse(JSON.stringify({ success: true, message: 'Ingrédient supprimé avec succès' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[COMMENT]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}