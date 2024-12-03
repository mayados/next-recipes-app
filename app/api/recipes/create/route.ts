import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function POST(req: NextRequest) {
    const data = await req.json();
    const { title, instructions, preparationTime, isHealthy, isVegan, picture, createdAt, difficulty, slug, categoryTitle, ingredients,  clerkUserId, email, pseudo, steps, tools } = data;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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


        const recipeSteps = steps.map(async (step: StepType) => {
            await db.step.create({
                data: {
                    text: String(step.text),
                    number: step.number,
                    recipeId: recipe.id,
                },
            });
        });


        const ingredientEntries = await Promise.all(
            ingredients.map(async (ingredient: IngredientType) => {
                if (!ingredient.label) {
                    throw new Error("Ingredient label is missing."+ingredient.slug+"label "+ingredient.label);
                }
        
                let existingIngredient = await db.ingredient.findUnique({
                    where: { label: ingredient.label },
                });
        
                if (!existingIngredient) {
                    existingIngredient = await db.ingredient.create({
                        data: {
                            label: String(ingredient.label),
                            slug: ingredient.slug || "slug-default",
                            picture: ingredient.picture || `https://res.cloudinary.com/${cloudName}/image/upload/v1732096009/food-court-4587749_640_yjfuop.jpg`,
                        },
                    });
                }
        
                return {
                    ingredientId: existingIngredient.id,
                    unit: String(ingredient.unit),
                    quantity: ingredient.quantity,
                };
            })
        );
        

        // create compositions after creating ingredients
        const compositionPromises = ingredientEntries.map(async (entry) => {
            await db.composition.create({
                data: {
                    unit: entry.unit,
                    quantity: parseInt(entry.quantity),
                    recipeId: recipe.id,
                    ingredientId: entry.ingredientId,
                },
            });
        });

        const toolPromises = tools.map(async (tool: ToolType) => {
            let existingTool = await db.tool.findUnique({
                where: { label: tool.label }
            });
        
            // if the tool doesn't exist, we create it
            if (!existingTool) {
                existingTool = await db.tool.create({
                    data: {
                        label: String(tool.label),
                        slug: tool.slug || 'slug-pas-unique',
                        picture: tool.picture || `https://res.cloudinary.com/${cloudName}/image/upload/v1732096009/food-court-4587749_640_yjfuop.jpg`,
                    },
                });
            }
        
            // Associate the tool with the recipe
            await db.recipeTool.create({
                data: {
                    recipeId: recipe.id,
                    toolId: existingTool.id,
                },
            });
        
            return {
                toolId: existingTool.id,
                slug: existingTool.slug
            };
        });
        
        

        console.log("Les outils : "+toolPromises)
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
