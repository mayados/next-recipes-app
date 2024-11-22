'use client'

import RecipeCard from "@/components/RecipeCard";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Pagination from "@/components/Pagination";

const Search = () => {
  // current page (for pagination)
  const [page, setPage] = useState(1);
  const resultsPerPage = 10;
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const searchParams = useSearchParams();
  const parametersUrl = new URLSearchParams(searchParams);
  const query = parametersUrl.get('query');

  useEffect(() => {
    const fetchRecipes = async () => {
      if (query) {
        const response = await fetch(`/api/search/${query}?page=${page}&resultsPerPage=${resultsPerPage}`);
        const data: RecipeType[] = await response.json();

        setRecipes(data);
        setTotalRecipes(data.length);
      }
    };

    fetchRecipes();
  }, [query, page]);

  const maxPages = Math.ceil(totalRecipes / resultsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= maxPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="text-center min-h-[92vh]">
      <h1 className="text-3xl text-white mb-4">Recipe's search</h1>
      <SearchInput placeholder="Search a recipe here.." />

      {/* Message when no query is provided */}
      {!query && (
        <div className="flex items-center justify-center h-[100vh] mt-5">
          <p className="text-white mt-4">Please enter a search query to find recipes.</p>
        </div>
      )}

      {/* Recipes display when there's a query */}
      {query && (
        <section className="flex flex-row gap-5 flex-wrap justify-center lg:justify-between mt-5">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                categoryName={recipe.category.title}
                isHealthy={recipe.isHealthy}
                IsVegan={recipe.IsVegan}
                difficultyLevel={recipe.difficulty}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-[100vh] mt-5">
              <p className="text-white">No recipes found for "{query}".</p>
            </div>
          )}
        </section>
      )}

      {/* Pagination if there are results and query */}
      {query && totalRecipes > 0 && (
        <Pagination
          previousAction={() => handlePageChange(page - 1)}
          nextAction={() => handlePageChange(page + 1)}
          page={page}
          maxPages={maxPages}
        />
      )}
    </div>
  );
};

export default Search;
