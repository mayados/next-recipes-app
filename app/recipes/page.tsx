"use client";

import RecipeCard from "@/components/RecipeCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'


export default function Recipes() {

  const [recipes, setRecipes] = useState<RecipeType[]>([])
  const [starters, setStarters] = useState<RecipeType[]>([])
  const [mains, setMains] = useState<RecipeType[]>([])
  const [desserts, setDesserts] = useState<RecipeType[]>([])
 

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes')
      // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
      const data: RecipeType[] =  await response.json()
      // J'hydrate mon objet article avec les datas récupérés
      setRecipes(data['recipes'])
      setStarters(data['starters'])
      setMains(data['mains'])
      setDesserts(data['desserts'])
    }

    fetchRecipes()
  })

  return (

    <>
        <h1 className="text-3xl text-white ml-3">Recipes</h1>
        
      <TabGroup className="ml-3 my-3">
        <TabList className="ml-3 my-3 flex gap-3">
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">All</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">Starter</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">Main</Tab>
          <Tab className="text-lg lg:text-base flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">Dessert</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="flex-row md:flex-row gap-5 px-3">
            {
              recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} isHealthy={recipe.isHealthy} IsVegan={recipe.IsVegan} difficultyLevel={recipe.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex-row md:flex gap-5 px-3">
            {
              starters.map((starter) => (
              <RecipeCard key={starter.id} recipe={starter} categoryName={starter.category.title} isHealthy={starter.isHealthy} IsVegan={starter.IsVegan} difficultyLevel={starter.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex-row md:flex gap-5 px-3">
            {
              mains.map((main) => (
              <RecipeCard key={main.id} recipe={main} categoryName={main.category.title} isHealthy={main.isHealthy} IsVegan={main.IsVegan} difficultyLevel={main.difficulty} />         
            ))}   
          </TabPanel>
          <TabPanel className="flex-row md:flex gap-5 px-3">
            {
              desserts.map((dessert) => (
              <RecipeCard key={dessert.id} recipe={dessert} categoryName={dessert.category.title} isHealthy={dessert.isHealthy} IsVegan={dessert.IsVegan} difficultyLevel={dessert.difficulty} />         
            ))}   
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>

  )
}
