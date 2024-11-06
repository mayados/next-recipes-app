import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function POST(req: NextRequest)
{

    // specific method to retrieve body (with NextRequest)
    const data = await req.json();  
    const { title, instructions, preparationTime, isHealthy, isVegan, picture, createdAt, difficulty, slug, categoryTitle, ingredients,  clerkUserId, email, pseudo, steps, tools } = data;
    try{
        // console.log("données reçues api : "+data);

        // We search if the user already exists in the database (beacause we use Clerk to manage users, but we have a local table User in the database)
        let dbUser = await db.user.findUnique({
            where: { 
                clerkUserId: clerkUserId,
            },
          });
      
        //   If the user doesn't exist in the database, we create him (because the authentication is made with clerk ,and we have to be sure to link a user of the database to the current user)
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
            where: { 
                title: categoryTitle,
            },
          });

          const categoryId = category?.id

        // Retrieve the comment to delete
        const recipe = await db.recipe.create({
            data: {
                title: String(title),
                // the user we found or the user we just created
                userId: dbUser.id,
                instructions: String(instructions),
                createdAt: createdAt,
                timePreparation: parseInt(preparationTime),
                isHealthy: Boolean(isVegan),
                IsVegan: Boolean(isHealthy),
                picture: String(picture),
                difficulty: parseInt(difficulty),
                slug: String(slug),
                categoryId: categoryId,
            }
        })

        const recipeSteps = steps.map(async (step) => {

            await db.step.create({
                data: {
                    text: String(step.text),
                    number: parseInt(step.number),
                    recipeId: recipe.id,
                }
            });

        
        await Promise.all(recipeSteps);


        });

        // create query to post ingredients
        // Each function is async, so we have to put await
        const ingredientPromises = ingredients.map(async (ingredient) => {
            // We have to verify if the ingredient exists. We don't want to stock it multiple times in the database
            let existingIngredient = await db.ingredient.findUnique({
                where: { 
                    label: ingredient.name
                 }
            });

            if (!existingIngredient) {
                existingIngredient = await db.ingredient.create({
                    data: {
                        label: String(ingredient.name),
                        slug: ingredient.slug,
                        picture: ingredient.picture || "pictureIngredient",
                    }
                });
            }

            // Create query to post composition of the recipe
            await db.composition.create({
                data: {
                    unit: String(ingredient.unity),
                    quantity: parseInt(ingredient.quantity),
                    recipeId: recipe.id,
                    ingredientId: existingIngredient.id, 
                }
            });

        // create query to post Steps


        });

        await Promise.all(ingredientPromises);

        const toolPromises = tools.map(async (tool) => {
            let existingTool = await db.tool.findUnique({
                where: { 
                    label: tool.label
                 }
            });

            if (!existingTool) {
                existingTool = await db.tool.create({
                    data: {
                        label: String(tool.label),
                        slug: tool.slug,
                        picture: tool.picture || "pictureIngredient",
                    }
                });
            }

            await db.recipeTool.create({
                data: {
                    recipeId: recipe.id,
                    toolId: existingTool.id, 
                }
            });



        });

        await Promise.all(toolPromises);

        
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