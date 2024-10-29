import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try{
        const recipes = await db.recipe.findMany({
            orderBy: {
            createdAt: 'desc'
            },
            include: {
                category: true
            }
        })


        const starters = await db.recipe.findMany({
            where: {
                category: {
                    title: {
                        contains: "starter",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
                }
        })

        const mains = await db.recipe.findMany({
            where: {
                category: {
                    title: {
                        contains: "main",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
                }
        })

        const desserts = await db.recipe.findMany({
            where: {
                category: {
                    title: {
                        contains: "dessert",
                        mode: 'insensitive',
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
                }
        })

        return NextResponse.json({
            success: true,
            recipes: recipes,
            starters: starters,
            mains: mains,
            desserts: desserts,
        });

    } catch (error) {

        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }

}