"use client";

import RecipeCard from "@/components/RecipeCard";
import LinkButton from "@/components/LinkButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { BadgePlus } from 'lucide-react';
import Pagination from "@/components/Pagination";


export default function Recipes() {

  // current page (for pagination)
  const [page, setPage] = useState(1);
  const resultsPerPage = 10; 
  const [recipes, setRecipes] = useState<RecipeType[]>([])
  const [starters, setStarters] = useState<RecipeType[]>([])
  const [mains, setMains] = useState<RecipeType[]>([])
  const [desserts, setDesserts] = useState<RecipeType[]>([])
  const [totalRecipes, setTotalRecipes] = useState()
  const [totalStarters, setTotalStarters] = useState()
  const [totalMains, setTotalMains] = useState()
  const [totalDesserts, setTotalDesserts] = useState()
  const [currentCategory, setCurrentCategory] = useState("all");
 

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`/api/recipes?page=${page}&resultsPerPage=${resultsPerPage}`)
      // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
      const data: RecipeType[] =  await response.json()
      // J'hydrate mon objet article avec les datas récupérés
      setRecipes(data['recipes'])
      setStarters(data['starters'])
      setMains(data['mains'])
      setDesserts(data['desserts'])

      setTotalRecipes(data['totalRecipes'] || 0)
      setTotalStarters(data['totalStarters'] || 0)
      setTotalMains(data['totalMains'] || 0)
      setTotalDesserts(data['totalDesserts'] || 0)
    }

    fetchRecipes()
  }, [page, currentCategory]);

  // Définir `maxPages` selon la catégorie active
const maxPages = Math.ceil(
  (currentCategory === "all" ? totalRecipes :
  currentCategory === "starter" ? totalStarters :
  currentCategory === "main" ? totalMains :
  totalDesserts) / resultsPerPage
);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= maxPages) {
      setPage(newPage);
    }
  };

  return (

    <>
      <h1 className="text-3xl text-white ml-3">Recipes</h1>

      <LinkButton label="Create a recipe" icon={BadgePlus} path="/recipes/create" dynamicPath=""   />
        
      <TabGroup className="ml-3 my-3">
        <TabList className="ml-3 my-3 flex gap-3">
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md" onClick={() => { setCurrentCategory("all"); setPage(1); }}>All</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md" onClick={() => { setCurrentCategory("starter"); setPage(1); }}>Starter</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md" onClick={() => { setCurrentCategory("main"); setPage(1); }}>Main</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md" onClick={() => { setCurrentCategory("dessert"); setPage(1); }}>Dessert</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="flex flex-row gap-5 px-3">
            {
              recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} isHealthy={recipe.isHealthy} IsVegan={recipe.IsVegan} difficultyLevel={recipe.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex flex-row gap-5 px-3">
            {
              starters.map((starter) => (
              <RecipeCard key={starter.id} recipe={starter} categoryName={starter.category.title} isHealthy={starter.isHealthy} IsVegan={starter.IsVegan} difficultyLevel={starter.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex flex-row gap-5 px-3">
            {
              mains.map((main) => (
              <RecipeCard key={main.id} recipe={main} categoryName={main.category.title} isHealthy={main.isHealthy} IsVegan={main.IsVegan} difficultyLevel={main.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex flex-row gap-5 px-3">
            {
              desserts.map((dessert) => (
              <RecipeCard key={dessert.id} recipe={dessert} categoryName={dessert.category.title} isHealthy={dessert.isHealthy} IsVegan={dessert.IsVegan} difficultyLevel={dessert.difficulty} />         
            ))}   
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Pagination previousAction={() => handlePageChange(page - 1)} nextAction={() => handlePageChange(page + 1)} page={page} maxPages={maxPages} />
    </>

  )
}
