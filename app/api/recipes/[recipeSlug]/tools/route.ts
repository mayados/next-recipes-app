import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// Asynchrone : il attend une promesse
export async function GET(req: NextRequest, {params}: {params: {recipeId: string}})
{
    const { recipeId } = params;

    try{

        const recipeTools = await db.recipeTool.findMany({
            where: {
                recipeId: recipeId
            },
            include: {
                tool: true
            }
        })

        return NextResponse.json(recipeTools)


    } catch (error) {
        // Comme on exécute le console.log sur le serveur, on ne le retrouvera pas dans la console du navigateur, mais dans le terminall où on exécute le projet.
        // Nous sommes côté serveur : SSR
        console.log("[TOOLS]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}