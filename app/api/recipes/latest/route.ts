import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// The goal is to get the latest recipes published (I choose five)
export async function GET() {

    try{
        const recipes = await db.recipe.findMany({
            orderBy: {
            createdAt: 'desc'
            },
            include: {
                category: true
            },
            // Retrieve the number of recipes wanted
            take: 5,
        })

        return NextResponse.json(recipes)

    } catch (error) {

        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }

}