"use client";

import RecipeCard from "@/components/RecipeCard";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Recipes() {

  const [recipes, setRecipes] = useState<RecipeType[]>([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes')
      // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
      const data: RecipeType[] =  await response.json()
      // J'hydrate mon objet article avec les datas récupérés
      setRecipes(data)
    }

    fetchRecipes()
  })

  return (

    <>
        <h1 className="text-3xl text-white">Recipes</h1>
        
        <div className="flex gap-5 justify-around px-3">
        {
            recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} />         
            ))}          
        </div>
    </>

  )
}
