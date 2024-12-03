"use client";

import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper.css';
// import required modules
import { Navigation, EffectCoverflow } from 'swiper/modules';

export default function Home() {

  const [recipes, setRecipes] = useState<RecipeType[]>([])
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/latest')
        // On type la constante data. De cette façon, si nous récupérons autre chose que la structure établie au départ, il y aura une erreur
        const data: RecipeType[] =  await response.json()
        // J'hydrate mon objet article avec les datas récupérés
        setRecipes(data)
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
      // stop the loading when the informations are retrieved
      setLoading(false); 
  }
    }


    fetchRecipes()
  },[])
 
  if (loading) return <p>Loading profile...</p>;


  return (
    <>
      <h1 className="text-3xl text-black dark:text-white">Latest Recipes</h1>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Swiper
          className = "swiper-container"
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          initialSlide={3} // Start at the 4th card
          slidesPerView={5} // Show 5 slides at a time
          spaceBetween={-50} // Adjust spacing between slides for the overlapping effect
          coverflowEffect={{
            rotate: 0,
            stretch: -10, // Adjust to control overlap
            depth: 150, // Controls the 3D depth effect
            modifier: 1,
            slideShadows: true,
          }}
          navigation={true}
          modules={[Navigation, EffectCoverflow]}
          breakpoints={{
            // Display fewer slides on smaller screens
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 5, spaceBetween: -50 },
          }}
        >
          {recipes.map((recipe, index) => (
            <SwiperSlide key={index} className="w-80 h-[400px] overflow-hidden">
                  <RecipeCard key={recipe.id} recipe={recipe} categoryName={recipe.category.title} difficultyLevel={recipe.difficulty} isHealthy={recipe.isHealthy} IsVegan={recipe.IsVegan} />         

            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </>
  )
}
