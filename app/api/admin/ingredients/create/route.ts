import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, slug, picture } = await req.json();

    try {
        // Verifying if the ingredient already exists
        const existingIngredient = await db.ingredient.findFirst({
            where: {
                OR: [
                    { label: name },
                    { slug: slug },
                ],
            },
        });

        // We return an error message if the ingredient already exists
        if (existingIngredient) {
            return NextResponse.json({
                success: false,
                message: "An ingredient with this name or slug already exists.",
            }, { status: 409 });
        }

        // Creation of the new ingredient if it doesn't exists
        const newIngredient = await db.ingredient.create({
            data: {
                label: name,
                slug: slug,
                picture: picture || "",
            },
        });

        return NextResponse.json({
            success: true,
            ingredient: newIngredient,
        });

    } catch (error) {
        console.error("[INGREDIENT]", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred while creating the ingredient.",
        }, { status: 500 });
    }
}
