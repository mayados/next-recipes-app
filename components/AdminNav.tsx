import React from 'react'
import Link from "next/link";

const AdminNav:React.FC = () => {
  return (
    <aside className="flex-4 h-screen rounded-md bg-slate-600">
        <ul className="flex flex-col gap-5">
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/users`}>Users</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/recipes`}>Recipes</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/articles`}>Articles</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/comments-recipes`}>Comments recipes</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/comments-articles`}>Comments articles</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/tags`}>Tags</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/ingredients`}>Ingredients</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/tools`}>Tools</Link></li>
        <li className="hover:bg-slate-800 p-2 hover:cursor-pointer"><Link href={`/admin/categories`}>Categories</Link></li>
        </ul>
    </aside>
  )
}

export default AdminNav