"use client";

import RecipeCard from "@/components/RecipeCard";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Pagination from "@/components/Pagination";



const Search = ({params}: {params: {query: string}}) =>{
  
    // current page (for pagination)
    const [page, setPage] = useState(1);
    const resultsPerPage = 10; 
    const [totalRecipes, setTotalRecipes] = useState()
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const searchParams = useSearchParams();
    const parametersUrl = new URLSearchParams(searchParams);
    const query = parametersUrl.get('query')

    useEffect(() => {
      const fetchRecipes = async () => {
        // Query is a dynamic parameter
        const response = await fetch(`/api/search/${query}?page=${page}&resultsPerPage=${resultsPerPage}`)
        const data: RecipeType[] =  await response.json()
        console.log(data)

        setRecipes(data)
        const countRecipes = data.length
        setTotalRecipes(countRecipes)

      }
  
      fetchRecipes()
    }, [query])

        const maxPages = Math.ceil(totalRecipes/ resultsPerPage);
    
      const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= maxPages) {
          setPage(newPage);
        }
      };

  return (

    <>
        <h1 className="text-3xl text-white">Recipe's search</h1>
        <SearchInput placeholder="Search a recipe here.." />
        <section className="flex flex-row gap-5 px-3">
          {
              recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} isHealthy={recipe.isHealthy} IsVegan={recipe.IsVegan} difficultyLevel={recipe.difficulty}  />         
          ))}            
        </section>
        {query && (
            <Pagination 
                previousAction={() => handlePageChange(page - 1)} 
                nextAction={() => handlePageChange(page + 1)} 
                page={page} 
                maxPages={maxPages} 
            />
        )}
    </>

  )
}

export default Search

