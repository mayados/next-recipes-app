import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { title, slug } = await req.json();

    try {
        // Verifying if the tool already exists
        const existingCategory = await db.tool.findFirst({
            where: {
                title: title*
            }
        });

        // We return an error message if the tool already exists
        if (existingCategory) {
            return NextResponse.json({
                success: false,
                message: "A category with this title already exists.",
            }, { status: 409 });
        }

        // Creation of the new tool if it doesn't exists
        const newCategory = await db.tool.create({
            data: {
                title: title,
                slug: slug,
            },
        });

        return NextResponse.json({
            success: true,
            category: newCategory,
        });

    } catch (error) {
        console.error("[Category]", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred while creating the category.",
        }, { status: 500 });
    }
}
