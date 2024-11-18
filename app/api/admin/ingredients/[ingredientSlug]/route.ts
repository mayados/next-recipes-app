import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {ingredientSlug: string}})
{
    const { ingredientSlug } = params;


    try{

        const ingredient = await db.ingredient.findUnique({
            where: {
                slug: ingredientSlug
            },            
        })


        return NextResponse.json({
            success: true,
            ingredient: ingredient,
        });

    } catch (error) {
        console.log("[INGREDIENT]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}