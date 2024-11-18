import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const {toolSlug, toolPicture} = await req.json();

  try {
        if (!toolPicture) {
            return NextResponse.json({ error: "Picture is required" }, { status: 400 });
        }

        const updatedTool = await db.tool.update({
            where: { slug: toolSlug },
            // Use data to specify fields to modify
            data: { picture: toolPicture }, 
        });

        return NextResponse.json({
            success: true,
            tool: updatedTool,
        });

  } catch (error) {
    console.error("Error with tool's update:", error);
    return NextResponse.json({ message: "Error updating the tool", error: error.message }, { status: 500 });
  }
}
