import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {recipeSlug: string}})
{
    const { recipeSlug } = params;

    try{

        const recipe = await db.recipe.findUnique({
            where: {
                slug: recipeSlug
            },
            include: {
                compositions: {
                    include: {
                        ingredient: true,
                    }
                },
                steps: true,
                category: true,
                recipetools: {
                    include: {
                        tool: true,
                    }
                },
                comment: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }, 
            }
            
        })

        const suggestions = await db.recipe.findMany({
            where: {
                id: {not: recipe?.id},
                category: recipe?.category
            },
            orderBy: {
            createdAt: 'desc'
            },
            take: 3,
        })

        // On return l'article trouvé
        return NextResponse.json({
            success: true,
            recipe: recipe,
            suggestions: suggestions 
        });

    } catch (error) {
        // Comme on exécute le console.log sur le serveur, on ne le retrouvera pas dans la console du navigateur, mais dans le terminall où on exécute le projet.
        // Nous sommes côté serveur : SSR
        console.log("[RECIPE]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}