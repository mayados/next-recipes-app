import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Asynchrone : waits for a promise
export async function DELETE(req: NextRequest, {params}: {params: {categoryId: string}})
{
    const { categoryId } = params;

    try{

        // Retrieve the tag to delete
        const category = await db.category.delete({
            where: {
                id: categoryId
            }
        })

        return new NextResponse(JSON.stringify({ success: true, message: 'Category deleted with success' }), {
            status: 200,
        });

    } catch (error) {
        // servor side : SSR
        console.log("[CATEGORY]", error)

        return new NextResponse("Internal error, {status: 500}")
    }


}