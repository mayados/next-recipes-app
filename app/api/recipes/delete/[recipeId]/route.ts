import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {recipeId: string}})
{
    const { recipeId } = params;

    try{


        const recipeToolToDelete = await db.recipeTool.deleteMany({
            where: {
                recipeId: recipeId
            }
        });

        const compositionsToDelete = await db.composition.deleteMany({
            where: {
                recipeId: recipeId
            }
        });

        const stepsToDelete = await db.step.deleteMany({
            where: {
                recipeId: recipeId
            }
        });

        const recipeToDelete = await db.recipe.delete({
            where: {
                id: recipeId
            }
        });

        return new NextResponse(JSON.stringify({ success: true, message: 'Recipe successfully deleted' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[Recipe]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}