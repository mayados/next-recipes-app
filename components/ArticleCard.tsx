import React from 'react'
import { formatDate } from '@/lib/utils'
import Button from './Button'
import Tag from './Tag'
import { Eye } from 'lucide-react';

interface ArticleCardProps{
  article: ArticleWithTagsAndComments
}

const ArticleCard:React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className='group border border-slate-700 p-6 rounded-md hover:bg-gray-600 cursor-pointer hover:-translate-y-2 duration-500'>
        <h2 className='text-xl font-bold'>{article.title}</h2>
        <p className='text-sm text-slate-300'>{formatDate(article.createdAt)}</p>
        <div className='flex flex-wrap gap-2 my-4'>
        {
            article.tags.map((tagArticle) => (
              <Tag key={tagArticle.tag.id} name={tagArticle.tag.name} />              
            ))}                  
        </div>

        <p className='line-clamp-4'>{article.text}</p>

        <Button label="Lire plus..." icon={Eye} specifyBackground=''  />              

    </div>
  )
}

export default ArticleCard