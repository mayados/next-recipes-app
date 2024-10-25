import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {query: string}})
{
    // const query = req.nextUrl.searchParams.get('query'); // Récupère `query` depuis les paramètres de recherche

    const { query } = params;

    try{

        const recipes = await db.recipe.findMany({
            where: {
                title: {
                    contains: `${query}`,
                    mode: "insensitive",
                }
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

        if (!query || query.trim().length === 0) {
            return NextResponse.json("la query est vide");  // Retourner un tableau vide si `query` est vide
        }

        return NextResponse.json(recipes)

    } catch (error) {
        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }
}