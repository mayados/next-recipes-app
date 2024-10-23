"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock9, Key } from 'lucide-react';
import { Gauge } from 'lucide-react';
import CategoryTag from "@/components/CategoryTag";
import Button from "@/components/Button";
import { Download } from 'lucide-react';
import { Heart } from 'lucide-react';
import {CldImage} from "next-cloudinary";
import Title from "@/components/Title";
import { ListChecks } from 'lucide-react';
import { CookingPot } from 'lucide-react';


const Recipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [recipetools, setTools] = useState<RecipeToolType[]>([]);
    const [compositions, setIngredients] = useState<CompositionType[]>([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            // Ici on utilise les back quotes ``, et non les quotes normales, car on récupère quelque chose de dynamique
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: RecipeType = await response.json()
            // On hydrate la recette avec les données récupérées
            setRecipe(data)
            // setTools(data.recipetools);
            setIngredients(data.compositions)

        }
        // On appelle la fonction
        fetchRecipe()
        // Le useEffect va être redéclenché si l'articleId change
    }, [params.recipeSlug])

    // We create a function to display the tools of the recipe on the event click on the right button
    // Undisplay the ingredients
    const displayTools = async (recipeId: string) => {
        try {
            const response = await fetch(`/api/recipes/${recipe?.id}/tools`, {
                method: "GET",
            });
            if (response.ok) {
                setTools(recipetools)
                // Si l'appel à l'API fonctionne, on undisplay la composition (=les ingrédients) localement
                setIngredients([]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des outils :", error);
        }
      }

    const displayIngredients = async (recipeId: string) => {
        try {
            const response = await fetch(`/api/recipes/${recipe?.id}/ingredients`, {
                method: "GET",
            });
            if (response.ok) {
                // Si l'appel à l'API fonctionne, on undisplay la recipetools (=les outils) localement
                setTools([]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des outils :", error);
        }
      }

  return (

    
    <div className="p-5">
        <section className="lg:w-screen lg:flex h-[50vh] bg-gray-800 mt-5">
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
            <div className="lg:flex-1">
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
        <section className="mt-10 flex">
            {/* Instructions */}
            <div className="flex-1">
                <Title label="Instructions" icon={ListChecks} />
                <p>{recipe?.instructions}</p>
            </div>
            {/* Ingredients and tools */}
            <div className="flex-1">
                <Title label="Ingredients and Tools" icon={CookingPot} />
                {/* Tabs buttons to choose to display ingredients or tools */}
                <div className="bg-gray-600 p-2 flex gap-3 rounded-md">
                    <Button key={recipe?.id} label="Ingredients" icon={Gauge} specifyBackground="" />
                    <Button key={recipe?.slug} label="Tools" icon={Gauge} specifyBackground="none" action={() => displayTools(`${recipe?.id}`)} />
                </div>
                <section className="flex flex-wrap gap-3 border-2 border-gray-600 rounded-md">
                    {
                        compositions.map((composition) => (
                            <div key={composition.ingredient.id} className="mt-4 flex flex-col items-center text-center w-2/12">
                                <CldImage
                                    className="rounded-md"
                                    alt=""
                                    src="cld-sample-5"
                                    width="100"
                                    height="100"
                                    crop={{
                                        type: 'auto',
                                        source: true
                                    }}
                                />                           
                                <p>{composition.ingredient.label}</p>                            
                            </div>
    
                    ))                      
                    }                    
                    {
                        recipetools.map((tools) => (
                            <div className="mt-4 flex flex-col items-center text-center w-2/12">
                                <CldImage
                                    className="rounded-md"
                                    alt=""
                                    src="cld-sample-5"
                                    width="100"
                                    height="100"
                                    crop={{
                                        type: 'auto',
                                        source: true
                                    }}
                                />                           
                                <p>{tools.tool.label}</p>                            
                            </div>
    
                    ))                      
                    }                    
                </section>

 
            </div>
        </section>
        {/* Comments about the recipe */}
        <section>

        </section>
    </div>

  )
}

export default Recipe
