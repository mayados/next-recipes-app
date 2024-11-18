import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, slug, picture } = await req.json();

    try {
        // Verifying if the tool already exists
        const existingTool = await db.tool.findFirst({
            where: {
                OR: [
                    { label: name },
                    { slug: slug },
                ],
            },
        });

        // We return an error message if the tool already exists
        if (existingTool) {
            return NextResponse.json({
                success: false,
                message: "A tool with this name or slug already exists.",
            }, { status: 409 });
        }

        // Creation of the new tool if it doesn't exists
        const newTool = await db.tool.create({
            data: {
                label: name,
                slug: slug,
                picture: picture || "",
            },
        });

        return NextResponse.json({
            success: true,
            tool: newTool,
        });

    } catch (error) {
        console.error("[Tool]", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred while creating the tool.",
        }, { status: 500 });
    }
}
