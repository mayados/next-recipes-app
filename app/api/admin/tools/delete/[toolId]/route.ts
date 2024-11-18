import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {toolId: string}})
{
    const { toolId } = params;

    try{

        // Retrieve the tool to delete
        const tool = await db.tool.delete({
            where: {
                id: toolId
            }
        })

        // recipeTools to delete
        const recipeTools = await db.recipeTool.deleteMany({
            where: {
                toolId: toolId
            }
        })

        return new NextResponse(JSON.stringify({ success: true, message: 'Outil supprimé avec succès' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[TOOL]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}