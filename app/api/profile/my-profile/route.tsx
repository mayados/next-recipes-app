import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest)
{
    const { userId } = getAuth(req)


    try{

        let dbUser = await db.user.findUnique({
            where: { 
                clerkUserId: userId,
            },
          });

        const recipes = await db.recipe.findMany({
            where: {
                userId: dbUser?.id
            },
            include: {
                category: true,
            }   ,
            orderBy: {
                createdAt: 'desc'
            }        
        })


        // Retrieve an array of objects
        const favoritesRecipesId = await db.favorite.findMany({
            where: {
                userId: dbUser?.id
            },
            select: {
                recipeId: true
            }
        })

        const comments = await db.comment.findMany({
            where: {
                userId: dbUser?.id
            }
        })

        // To have an array from values, usable with the IN operator
        const favoriteRecipes = favoritesRecipesId.map(fav => fav.recipeId);


        const favorites = await db.recipe.findMany({
            where: {
                id: {
                    // operator use to increase database performances and not have to do a loop
                    in: favoriteRecipes
                }
            },
            include: {
                category: true,
            }   ,
            orderBy: {
                createdAt: 'desc'
            }     
        });

        return NextResponse.json({
            success: true,
            recipes: recipes,
            favorites: favorites,
            comments: comments,
        });

    } catch (error) {
        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}