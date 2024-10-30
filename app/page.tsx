"use client";

import RecipeCard from "@/components/RecipeCard";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper.css';
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function Home() {

  const [recipes, setRecipes] = useState<RecipeType[]>([])

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes/latest')
      // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
      const data: RecipeType[] =  await response.json()
      // J'hydrate mon objet article avec les datas récupérés
      setRecipes(data)
    }

    fetchRecipes()
  })
 

  return (
    <>
        <h1 className="text-3xl text-white text-center">Latest Recipes</h1>
        <Swiper
                slidesPerView={3}
                spaceBetween={30}
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="swiperLatest md:mt-10"
            >        
          {
            recipes.map((recipe) => (
              <SwiperSlide>
                <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} difficultyLevel={recipe.difficulty} isHealthy={recipe.isHealthy} IsVegan={recipe.IsVegan} />         
            </SwiperSlide>
           ))}          
        </Swiper>
    </>
  )
}
