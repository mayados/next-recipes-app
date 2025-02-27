import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest, {params}: {params: {recipeSlug: string}})
{
    const { recipeSlug } = params;
    const { userId } = getAuth(req)


    try{

        const recipe = await db.recipe.findUnique({
            where: {
                slug: recipeSlug
            },
            include: {
                compositions: {
                    include: {
                        ingredient: true,
                    }
                },
                steps: {
                    orderBy: {
                        number: 'asc' 
                    }
                },
                category: true,
                recipetools: {
                    include: {
                        tool: true,
                    }
                },
                comment: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }, 
            }
            
        })

        const suggestions = await db.recipe.findMany({
            where: {
                id: {not: recipe?.id},
                category: recipe?.category
            },
            orderBy: {
            createdAt: 'desc'
            },
            take: 3,
        })

        let favorite = null; // Déclaration de favorite en dehors du bloc if

        if (userId) {
            // On recherche l'utilisateur en base
            const dbUser = await db.user.findUnique({
                where: { clerkUserId: userId },
            });

            console.log("L'id de l'utilisateur : " + dbUser?.id);

            if (dbUser) { // Vérifier que l'utilisateur existe
                favorite = await db.favorite.findFirst({
                    where: {
                        AND: [
                            { userId: { equals: dbUser.id } },
                            { recipeId: { equals: recipe?.id } },
                        ],
                    }
                });
            }
        }

              
                //   If the user doesn't exist in the database, we create him (because the authentication is made with clerk ,and we have to be sure to link a user of the database to the current user)
                //   if (!dbUser) {
                //     dbUser = await db.user.create({
                //       data: {
                //         clerkUserId: userId,
                //         mail: email,
                //         pseudo: getAuth(pseudo),
                //         picture: "",
                //       },
                //     });
                //   }




        return NextResponse.json({
            success: true,
            recipe: recipe,
            suggestions: suggestions,
            favorite: favorite,
        });

    } catch (error) {
        // Comme on exécute le console.log sur le serveur, on ne le retrouvera pas dans la console du navigateur, mais dans le terminall où on exécute le projet.
        // Nous sommes côté serveur : SSR
        console.log("[RECIPE]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}