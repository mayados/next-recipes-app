// On transforme notre page en composant client et non plus serveur. Il faut faire ainsi car nous importons un composant qui a besoin de useEffect, il faut donc que l'un de ses parents soit marqué avec "use client"
"use client"
import ArticleCard from '@/components/ArticleCard'
import CustomedLink from '@/components/CustomedLink'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Blog = () =>  {

  const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([])
    // current page (for pagination)
    const [page, setPage] = useState(1);
    const resultsPerPage = 10; 
    const [totalArticles, setTotalArticles] = useState()


  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(`/api/blog?page=${page}&resultsPerPage=${resultsPerPage}`)
      const data: ArticleWithTagsAndComments[] =  await response.json()
      setArticles(data)
      setTotalArticles(data.length)
    }

    fetchArticles()
  },[page]);

  const maxPages = Math.ceil(totalArticles/ resultsPerPage);
  console.log("Le nombre de pages est : "+maxPages)

const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= maxPages) {
    setPage(newPage);
  }
};

  return (
    <>
        <h1 className='mb-3 text-center text-2xl my-5'>Blog</h1>
        <section className='px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[90vh]'>
          {/* Liste des articles */}
          {
            articles.map((article) => (
              <Link href={`/blog/${article.slug}`}>
                <ArticleCard key={article.id} article={article} />                
              </Link>
            ))}          
        </section>
        <Pagination previousAction={() => handlePageChange(page - 1)} nextAction={() => handlePageChange(page + 1)} page={page} maxPages={maxPages} />

    </>
  )
}

export default Blog