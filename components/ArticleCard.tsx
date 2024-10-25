import React from 'react'
import { formatDate } from '@/lib/utils'
import Tag from './Tag'
import CustomedLink from './CustomedLink';

interface ArticleCardProps{
  article: ArticleWithTagsAndComments
}

const ArticleCard:React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className='group border border-slate-700 p-6 rounded-md hover:bg-gray-600 cursor-pointer w-[400px] h-[350px]'>
        <h2 className='text-xl font-bold'>{article.title}</h2>
        <p className='text-sm text-slate-300'>{formatDate(article.createdAt)}</p>
        <div className='flex flex-wrap gap-2 my-4'>
        {
            article.tags.map((tagArticle) => (
              <Tag key={tagArticle.tag.id} name={tagArticle.tag.name} />              
            ))}                  
        </div>

        <p className='line-clamp-4'>{article.text}</p>

        <CustomedLink label="Read more..." textColor='text-pink-600' fontSize='text-base' href={`/blog/${article.slug}`} />
    </div>
  )
}

export default ArticleCard