import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {toolSlug: string}})
{
    const { toolSlug } = params;


    try{

        const tool = await db.tool.findUnique({
            where: {
                slug: toolSlug
            },            
        })


        return NextResponse.json({
            success: true,
            tool: tool,
        });

    } catch (error) {
        console.log("[TOOL]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}