import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const {ingredientSlug, ingredientPicture} = await req.json();

  try {
        if (!ingredientPicture) {
            return NextResponse.json({ error: "Picture is required" }, { status: 400 });
        }

        const updatedIngredient = await db.ingredient.update({
            where: { slug: ingredientSlug },
            // Use data to specify fields to modify
            data: { picture: ingredientPicture }, 
        });

        return NextResponse.json({
          success: true,
          ingredient: updatedIngredient,
      });


  } catch (error) {
    console.error("Error with ingredient's update:", error);
    return NextResponse.json({ message: "Error updating the ingredient", error: error.message }, { status: 500 });
  }
}
