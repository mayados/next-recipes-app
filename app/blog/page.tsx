// On transforme notre page en composant client et non plus serveur. Il faut faire ainsi car nous importons un composant qui a besoin de useEffect, il faut donc que l'un de ses parents soit marqué avec "use client"
"use client"
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Blog = () =>  {

  const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/blog')
      const data: ArticleWithTagsAndComments[] =  await response.json()
      setArticles(data)
    }

    fetchArticles()
  })



  return (
    <>
        <h1 className='mb-3'>Blog</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {/* Liste des articles */}
          {
            articles.map((article) => (
                <Link href={`/article/${article.id}`}>
                  <ArticleCard key={article.id} article={article} />                
                </Link>

            ))}          
        </div>
    </>
  )
}

export default Blog