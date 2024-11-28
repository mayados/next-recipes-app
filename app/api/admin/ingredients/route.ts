import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const resultsPerPage = parseInt(searchParams.get("resultsPerPage") || "10", 10);
    // Allows to skip recipes from previous pages, good for performances
    const skipPreviousResults = (page - 1) * resultsPerPage;

    try{
        const ingredients = await db.ingredient.findMany({
            skip: skipPreviousResults,
            take: resultsPerPage,
        })

        const totalIngredients = await db.ingredient.count(); 


        return NextResponse.json({
            ingredients: ingredients,
            totalIngredients: totalIngredients,
        })

    } catch (error) {
        console.log("[INGREDIENTS]", error)

        return new NextResponse("Internal error, {status: 500}")
    }

}