import React from 'react'
import Link from "next/link";

const AdminNav:React.FC = () => {
  return (
  <aside className="w-[20vw] h-screen rounded-md bg-slate-600 p-2">
        <ul className="flex flex-col gap-5">
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/recipes`}>Recipes</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/articles`}>Articles</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/comments-recipes`}>Comments recipes</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/comments-articles`}>Comments articles</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/tags`}>Tags</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/ingredients`}>Ingredients</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/tools`}>Tools</Link>
          <Link className='hover:bg-slate-800 p-2 hover:cursor-pointer' href={`/admin/categories`}>Categories</Link>
        </ul>
    </aside>
  )
}

export default AdminNav