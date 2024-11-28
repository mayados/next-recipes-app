import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { title, text, tags, slugArticle, newSlug } = data;

  try {
    // Vérifier si l'article existe
    const existingArticle = await db.article.findUnique({
      where: { slug: slugArticle },
    });
    if (!existingArticle) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    // Mettre à jour l'article
    const updatedArticle = await db.article.update({
      where: { slug: slugArticle },
      data: {
        title,
        slug: newSlug,
        text,
      },
    });

    // Suppression des tagArticle associés avant d'ajouter de nouveaux tags
    await db.tagArticle.deleteMany({
      where: { articleId: updatedArticle.id },
    });

    // Log pour confirmer la suppression
    console.log(`All tagArticle entries for article ID ${updatedArticle.id} deleted successfully`);

    // Gestion des nouveaux tags à associer
    if (tags && tags.length > 0) {
      const newTagArticles = [];

      for (const tagArticle of tags) {
        let tagId;

        if (tagArticle.tag.id) {
          // Utilisation de upsert pour les tags avec un ID existant
          const tag = await db.tag.upsert({
            where: { id: tagArticle.tag.id },
            update: {},
            create: {
              name: tagArticle.tag.name,
            },
          });
          tagId = tag.id;
        } else {
          // Création d'un nouveau tag s'il n'a pas d'ID
          const tag = await db.tag.create({
            data: {
              name: tagArticle.tag.name,
            },
          });
          tagId = tag.id;
        }

        // Préparer les données pour les nouvelles associations article-tag
        newTagArticles.push({
          articleId: updatedArticle.id,
          tagId: tagId,
        });
      }

      // Ajout des nouvelles associations dans tagArticle
      await db.tagArticle.createMany({ data: newTagArticles });
    }

    return NextResponse.json({ message: "Article updated successfully", updatedArticle }, { status: 200 });
  } catch (error) {
    console.error("Error with article's update:", error);
    return new NextResponse("Error updating the article, {status: 500}")

  }
}
