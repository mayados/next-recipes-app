import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name } = await req.json();

    try {
        // Verifying if the tool already exists
        const existingTag = await db.tag.findFirst({
            where: {
                name: name
            }
        });

        // We return an error message if the tool already exists
        if (existingTag) {
            return NextResponse.json({
                success: false,
                message: "A tag with this name already exists.",
            }, { status: 409 });
        }

        // Creation of the new tool if it doesn't exists
        const newTag = await db.tag.create({
            data: {
                name: name,
            },
        });

        return NextResponse.json({
            success: true,
            tag: newTag,
        });

    } catch (error) {
        console.error("[Tag]", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred while creating the tag.",
        }, { status: 500 });
    }
}
