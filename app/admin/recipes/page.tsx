"use client";

import AdminNav from "@/components/AdminNav";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils'



const Recipes = () =>{

    const [recipes, setRecipes] = useState<RecipeType[]>([])


    useEffect(() => {
        const fetchRecipes = async () => {
          const response = await fetch(`/api/recipes`)
          // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
          const data: RecipeType[] =  await response.json()
          // J'hydrate mon objet article avec les datas récupérés
          setRecipes(data['recipes'])
    
        }
    
        fetchRecipes()
    },[]);

      recipes.map((recipe) => (
        
      console.log(recipe)
    ))

  return (

    <>
    <div className="flex w-screen">
      {/* Navigation menu for admin */}
      <AdminNav />
      <section className="border-2 border-green-800 flex-[8]">
        <h1 className="text-3xl text-white text-center">Recipes</h1>
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
            recipes.map((recipe) => {
            const recipeSlug = recipe.slug;

            
            return (
                <tr key={recipe.id}>
                    <td>{recipe.title}</td>
                    <td>{formatDate(recipe.createdAt)}</td>
                    <td>{recipe?.user?.pseudo}</td>
                    <td>
                    <Link href={`/admin/recipes/${recipeSlug}`}>
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

export default Recipes

