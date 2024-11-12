import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Récupération des données depuis le corps de la requête
  const data = await req.json();
  const { 
    title,
    instructions,
    ingredients,
    tools,
    steps, 
    recipePicture, 
    preparationTime, 
    selectedCategory, 
    isVegan, 
    isHealthy, 
    difficulty, 
    slugRecipe 
  } = data;

  try {
    // Verify if the recipe exists
    const existingRecipe = await db.recipe.findUnique({
      where: { slug: slugRecipe },
    });
    if (!existingRecipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    // Update recipe
    const updatedRecipe = await db.recipe.update({
      where: { slug: slugRecipe },
      data: {
        title,
        instructions,
        picture: recipePicture || existingRecipe.picture,
        timePreparation: parseInt(preparationTime),
        category: {
          connect: { title: selectedCategory },
        },
        IsVegan: isVegan === "Yes",
        isHealthy: isHealthy === "Yes",
        difficulty: parseInt(difficulty),
      },
    });

    
    if (steps) {
      await db.step.deleteMany({ where: { recipeId: updatedRecipe.id } });
      const newSteps = steps.map((step) => ({
        text: step.text,
        number: step.number,
        recipeId: updatedRecipe.id,
      }));
      await db.step.createMany({ data: newSteps });
    }

    if (ingredients) {
      await db.composition.deleteMany({ where: { recipeId: updatedRecipe.id } });
      const newIngredients = ingredients.map((ingredient) => ({
        ingredient: {
          connectOrCreate: {
            where: { slug: ingredient.slug },
            create: { label: ingredient.name, slug: ingredient.slug, picture: ingredient.picture },
          },
        },
        quantity: parseFloat(ingredient.quantity),
        unit: ingredient.unit,
        recipeId: updatedRecipe.id,
      }));
      await db.composition.createMany({ data: newIngredients });
    }

    if (tools) {
      await db.recipeTool.deleteMany({ where: { recipeId: updatedRecipe.id } });
      const newTools = tools.map((tool) => ({
        tool: {
          connectOrCreate: {
            where: { slug: tool.slug },
            create: { label: tool.label, slug: tool.slug, picture: tool.picture },
          },
        },
        recipeId: updatedRecipe.id,
      }));
      await db.recipeTool.createMany({ data: newTools });
    }

    return NextResponse.json({ message: "Recipe updated successfully", updatedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Error with recipe's update:", error);
    return NextResponse.json({ message: "Error updating the recipe", error: error.message }, { status: 500 });
  }
}
