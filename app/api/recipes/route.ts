import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const resultsPerPage = parseInt(searchParams.get("resultsPerPage") || "10", 10);
    // Allows to skip recipes from previous pages, good for performances
    const skipPreviousResults = (page - 1) * resultsPerPage;
    

    try{
        const recipes = await db.recipe.findMany({
            skip: skipPreviousResults,
            take: resultsPerPage,
            orderBy: {
            createdAt: 'desc'
            },
            include: {
                category: true,
                user: true,
            },
        })


        const starters = await db.recipe.findMany({
            skip: skipPreviousResults,
            take: resultsPerPage,
            where: {
                category: {
                    title: {
                        contains: "starter",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
            },
        })

        const mains = await db.recipe.findMany({
            skip: skipPreviousResults,
            take: resultsPerPage,
            where: {
                category: {
                    title: {
                        contains: "main",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
            },
        })

        const desserts = await db.recipe.findMany({
            skip: skipPreviousResults,
            take: resultsPerPage,
            where: {
                category: {
                    title: {
                        contains: "dessert",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
            },
        })

        const totalRecipes = await db.recipe.count(); // Total recettes
        
        const totalStarters = await db.recipe.count({ 
                where: { category: { title: { contains: "starter", mode: 'insensitive' } } }
        });

        const totalMains = await db.recipe.count({ 
            where: { category: { title: { contains: "main", mode: 'insensitive' } } }
        });

        const totalDesserts = await db.recipe.count({ 
            where: { category: { title: { contains: "dessert", mode: 'insensitive' } } }
        });

   

        return NextResponse.json({
            success: true,
            recipes: recipes,
            starters: starters,
            mains: mains,
            desserts: desserts,
            totalRecipes : totalRecipes,
            totalStarters : totalStarters,
            totalMains : totalMains,
            totalDesserts : totalDesserts,

        });

    } catch (error) {

        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }

}