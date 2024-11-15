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
    slugRecipe, 
    newSlug,
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
        slug: newSlug,
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

    if (ingredients.length > 0) {
        // delete former compositions
        await db.composition.deleteMany({ where: { recipeId: updatedRecipe.id } });
      
        // Prepare each ingredient
        for (const composition of ingredients) {
          await db.ingredient.upsert({
            where: { slug: composition.ingredient.slug },
            update: {},
            create: {
              label: composition.ingredient.label,
              slug: composition.ingredient.slug,
              picture: composition.ingredient.picture,
            },
          });
        }
      
        // prepare datas for createMany
        const newCompositions = ingredients.map((composition) => ({
          quantity: parseFloat(composition.quantity),
          unit: composition.unit,
          recipeId: updatedRecipe.id,
          ingredientId: composition.ingredientId,
        }));
      
        await db.composition.createMany({ data: newCompositions });
      }
      
      if (tools && tools.length > 0) {
        await db.recipeTool.deleteMany({ where: { recipeId: updatedRecipe.id } });
      
        for (const recipeTool of tools) {
        // upsert allows to update or create elements in function of their existence
          await db.tool.upsert({
            where: { slug: recipeTool.tool.slug },
            update: {},
            create: {
              label: recipeTool.tool.label,
              slug: recipeTool.tool.slug,
              picture: recipeTool.tool.picture,
            },
          });
        }
      
        const newTools = tools.map((recipeTool) => ({
          recipeId: updatedRecipe.id,
          toolId: recipeTool.toolId, 
        }));
      
        await db.recipeTool.createMany({ data: newTools });
      }
      

    return NextResponse.json({ message: "Recipe updated successfully", updatedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Error with recipe's update:", error);
    return NextResponse.json({ message: "Error updating the recipe", error: error.message }, { status: 500 });
  }
}
