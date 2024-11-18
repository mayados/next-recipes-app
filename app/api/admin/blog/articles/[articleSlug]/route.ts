import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {articleSlug: string}})
{
    const { articleSlug } = params;

    try{

        const article = await db.article.findUnique({
            where: {
                slug: articleSlug
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                user: true,
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
            
        })


        return NextResponse.json(article)

    } catch (error) {
        console.log("[ARTICLE]", error)

        return new NextResponse("Internal error, {status: 500}")
    }
}