import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");  

    try {
        if (!query || query.trim().length === 0) {
            return NextResponse.json([]); 
        }

        const ingredients = await db.ingredient.findMany({
            where: {
                label: {
                    contains: query,
                    mode: "insensitive",
                }
            },
        });

        return NextResponse.json(ingredients);  
    } catch (error) {
        console.log("[API ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
