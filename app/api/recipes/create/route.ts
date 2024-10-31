import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// Asynchrone : waits for a promise
export async function POST(req: NextRequest)
{

    // specific method to retrieve body (with NextRequest)
    const data = await req.json();  
    const { title, instructions, preparationTime, isHealthy, isVegan, picture, userId, createdAt, difficulty, slug, categoryId, user } = data;
    try{
        console.log("données reçues api : "+data);

        // Retrieve the comment to delete
        const recipe = await db.recipe.create({
            data: {
                title: String(title),
                userId: "6718be46cbfe3064f8998c23",
                instructions: String(instructions),
                createdAt: createdAt,
                timePreparation: parseInt(preparationTime),
                isHealthy: Boolean(isVegan),
                IsVegan: Boolean(isHealthy),
                picture: String(picture),
                difficulty: parseInt(difficulty),
                slug: String(slug),
                categoryId: "671752197bbc414450065a78",
            }
        })

        
        return NextResponse.json({
            success: true,
            recipeSlug: recipe.slug,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[DATA]", error)

        return NextResponse.json({
            success: false,
            error: error
        }, { status: 500 });
    }


}