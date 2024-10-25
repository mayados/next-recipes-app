"use client";

import RecipeCard from "@/components/RecipeCard";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';



const Search = ({params}: {params: {query: string}}) =>{
  
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const searchParams = useSearchParams();
    const parametersUrl = new URLSearchParams(searchParams);
    const query = parametersUrl.get('query')

    useEffect(() => {
      const fetchRecipes = async () => {
        // Query is a dynamic parameter
        const response = await fetch(`/api/search/${query}`)
        const data: RecipeType[] =  await response.json()
        console.log(data)

        setRecipes(data)
      }
  
      fetchRecipes()
    }, [query])


  return (

    <>
        <h1 className="text-3xl text-white">Recipe's search</h1>
        <SearchInput placeholder="Search a recipe here.." />
        {
            recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} />         
            ))}   
    </>

  )
}

export default Search

