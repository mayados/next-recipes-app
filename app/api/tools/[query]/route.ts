import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");  

    try {
        // If query is empty, return an array null
        if (!query || query.trim().length === 0) {
            return NextResponse.json([]); 
        }

        const tools = await db.tool.findMany({
            where: {
                label: {
                    contains: query,
                    mode: "insensitive",
                }
            },
        });

        return NextResponse.json(tools);  
    } catch (error) {
        console.log("[API ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
