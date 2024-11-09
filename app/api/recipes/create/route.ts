import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function POST(req: NextRequest) {
    const data = await req.json();
    const { title, instructions, preparationTime, isHealthy, isVegan, picture, createdAt, difficulty, slug, categoryTitle, ingredients,  clerkUserId, email, pseudo, steps, tools } = data;

    try {
        let dbUser = await db.user.findUnique({
            where: { clerkUserId: clerkUserId },
        });

        if (!dbUser) {
            dbUser = await db.user.create({
                data: {
                    clerkUserId: clerkUserId,
                    mail: email,
                    pseudo: pseudo,
                    picture: "",
                },
            });
        }
        const category = await db.category.findUnique({
            where: { title: categoryTitle },
        });
        const categoryId = category?.id;

        const recipe = await db.recipe.create({
            data: {
                title: String(title),
                userId: dbUser.id,
                instructions: String(instructions),
                createdAt: createdAt,
                timePreparation: parseInt(preparationTime),
                isHealthy: Boolean(isHealthy ?? false),
                IsVegan: Boolean(isVegan ?? false),
                picture: String(picture),
                difficulty: parseInt(difficulty),
                slug: String(slug),
                categoryId: categoryId,
            },
        });

        const ingredientEntries = await Promise.all(
            ingredients.map(async (ingredient) => {
                let existingIngredient = await db.ingredient.findUnique({
                    where: { label: ingredient.name }
                });

                // Create ingredient if it doesn't exist
                if (!existingIngredient) {
                    existingIngredient = await db.ingredient.create({
                        data: {
                            label: String(ingredient.name),
                            slug: ingredient.slug,  // Enregistre le slug sans vérification d'unicité
                            picture: ingredient.picture || "pictureIngredient",
                        },
                    });
                }
                
                return {
                    ingredientId: existingIngredient.id,
                    unit: String(ingredient.unity),
                    quantity: parseInt(ingredient.quantity),
                };
            })
        );

        // create compositions after creating ingredients
        const compositionPromises = ingredientEntries.map(async (entry) => {
            await db.composition.create({
                data: {
                    unit: entry.unit,
                    quantity: entry.quantity,
                    recipeId: recipe.id,
                    ingredientId: entry.ingredientId,
                },
            });
        });

        const recipeSteps = steps.map(async (step) => {
            await db.step.create({
                data: {
                    text: String(step.text),
                    number: parseInt(step.number),
                    recipeId: recipe.id,
                },
            });
        });

        const toolPromises = tools.map(async (tool) => {
            let existingTool = await db.tool.findUnique({
                where: { label: tool.label }
            });

            // if the tool doesn't exist, we create it
            if (!existingTool) {
                existingTool = await db.tool.create({
                    data: {
                        label: String(tool.label),
                        slug: tool.slug,
                        picture: tool.picture || "pictureIngredient",
                    },
                });
            }

            await db.recipeTool.create({
                data: {
                    recipeId: recipe.id,
                    toolId: existingTool.id, 
                },
            });
        });

        // Wait for all the promises to be resolved
        await Promise.all([...compositionPromises, ...recipeSteps, ...toolPromises]);

        return NextResponse.json({
            success: true,
            // We return the slug because we need to redirect to the new recipe's page
            recipeSlug: recipe.slug,
        });

    } catch (error) {
        console.log("[DATA]", error);
        return NextResponse.json({
            success: false,
            error: error
        }, { status: 500 });
    }
}
