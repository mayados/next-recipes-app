"use client";

import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils'



const Articles = () =>{

    const [articles, setArticles] = useState<ArticleWithTagsAndUser[]>([])


    useEffect(() => {
        const fetchArticles = async () => {
          const response = await fetch(`/api/admin/blog`)
          // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
          const data: ArticleWithTagsAndUser[] =  await response.json()
          // J'hydrate mon objet article avec les datas récupérés
          setArticles(data)
    
        }
    
        fetchArticles()
      },[]);

      articles.map((article) => (
        
      console.log(article)
    ))

  return (

    <>
    <div className="flex w-screen">
      {/* Navigation menu for admin */}
      <AdminNav />
      <section className="border-2 border-green-800 flex-[8]">
        <h1 className="text-3xl text-white text-center">Blog articles</h1>
        <table className="table-auto">
        <thead>
            <tr>
                <th>Title</th>
                <th>Creation date</th>
                <th>Author</th>
                <th>Details</th>
            </tr>  
        </thead>
        <tbody>
        {
            articles.map((article) => {
            const articleSlug = article.slug;

            
            return (
                <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>{formatDate(article.createdAt)}</td>
                    <td>{article.user.pseudo}</td>
                    <td>
                      <Link href={`/admin/articles/${articleSlug}`}>
                      <Eye />
                      </Link>
                    </td>
                </tr>
            );
            })
        }
        </tbody>
        </table>   
      </section>     
    </div>
    </>

  )
}

export default Articles

