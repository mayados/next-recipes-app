import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try{
        const articles = await db.article.findMany({
            orderBy: {
            createdAt: 'desc'
            },
            include: {
            tags: {
                include: {
                tag: true
                }
            }
            }
        })

        return NextResponse.json(articles)

    } catch (error) {
        console.log("[ARTICLES]", error)

        return new NextResponse("Internal error, {status: 500}")
    }

}