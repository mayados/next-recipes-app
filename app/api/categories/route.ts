import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET()
{

    try{

        const categories = await db.category.findMany({})

        return NextResponse.json(categories)

    } catch (error) {

        console.log("[RECIPES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}