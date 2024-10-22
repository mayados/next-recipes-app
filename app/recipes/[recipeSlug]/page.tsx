"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock9 } from 'lucide-react';
import { Gauge } from 'lucide-react';
import CategoryTag from "@/components/CategoryTag";
import Button from "@/components/Button";
import { Download } from 'lucide-react';
import { Heart } from 'lucide-react';
import {CldImage} from "next-cloudinary";


const Recipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)


    useEffect(() => {
        const fetchRecipe = async () => {
            // Ici on utilise les back quotes ``, et non les quotes normales, car on récupère quelque chose de dynamique
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: RecipeType = await response.json()
            // On hydrate la recette avec les données récupérées
            setRecipe(data)
            // Car on a un use state pour les commentaire, on gérera leur état à part

        }
        // On appelle la fonction
        fetchRecipe()
        // Le useEffect va être redéclenché si l'articleId change
    }, [params.recipeSlug])

  return (

    <>
        <section className="lg:w-screen lg:flex h-[50vh] bg-gray-800 mt-5 ml-5 mr-5">
            {/* Basic informations */}
            <div className="lg:flex-1 flex flex-col items-center justify-center h-full">
                <h1 className="text-center mb-3 text-4xl">{recipe?.title}</h1>
                <div className="flex justify-center mb-3 gap-2">
                    <CategoryTag categoryName={recipe?.category.title} />
                    <Clock9 />{recipe?.timePreparation} min.
                    <ul className='flex justify-center'>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                        <li><Gauge /></li>
                    </ul>
                </div>
                <div className="flex gap-2 justify-center">
                    <Button icon={Download} label="Download" />
                    <Button icon={Heart} label="Favorite" />
                </div>
            </div>
            <div className="border-2 border-green-600 lg:flex-1">
                <CldImage
                    alt=""
                    src="cld-sample-5"
                    width="250"
                    height="300"
                    crop={{
                        type: 'auto',
                        source: true
                    }}
                />
            </div>
        </section>
        {/* Main instructions about the recipe */}
        <section className="mt-10 flex mr-5 ml-5">
            {/* Instructions */}
            <div className="flex-1">
                <h2>Instructions</h2>
                <p>{recipe?.instructions}</p>
            </div>
            {/* Ingredients and tools */}
            <div className="flex-1">
                <h2>Ingredients and tools</h2>
                {/* Tabs buttons to choose to display ingredients or tools */}
                <div className="bg-gray-600 p-2 flex gap-3 rounded-md">
                    <Button label="Ingredients" icon={Gauge} />
                    <Button label="Tools" icon={Gauge} />
                </div>
            </div>
        </section>
        {/* Comments about the recipe */}
        <section>

        </section>
    </>

  )
}

export default Recipe
