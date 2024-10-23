"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock9, Key } from 'lucide-react';
import { Gauge } from 'lucide-react';
import CategoryTag from "@/components/CategoryTag";
import Button from "@/components/Button";
import Step from "@/components/Step";
import { Download } from 'lucide-react';
import { Heart } from 'lucide-react';
import {CldImage} from "next-cloudinary";
import Title from "@/components/Title";
import { ListChecks } from 'lucide-react';
import { CookingPot } from 'lucide-react';
import { GitFork } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../swiper.css';
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';


const Recipe = ({params}: {params: {recipeSlug: string}}) => {


    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [recipetools, setTools] = useState<RecipeToolType[]>([]);
    const [compositions, setIngredients] = useState<CompositionType[]>([]);
    const [steps, setSteps] = useState<StepType[]>([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            // Back quotes because dynamical parameter
            const response = await fetch(`/api/recipes/${params.recipeSlug}`)
            const data: RecipeType = await response.json()
            // Hydrating the recipe with retrieved datas
            setRecipe(data)
            // We set ingredients and tools
            setIngredients(data.compositions)
            setTools(data.recipetools)
            setSteps(data.steps)

        }
        // We call the function
        fetchRecipe()
        // useEffect re-called if the recipeSlug changes
    }, [params.recipeSlug])

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
                {/* Tabs to choose to display ingredients or tools */}
                <TabGroup className="rounded-md border-2 border-gray-600">
                    <TabList className="bg-gray-600 p-2 flex gap-3">
                        <Tab className="flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">
                            <Gauge /> Ingrédients
                        </Tab>
                        <Tab className="flex data-[selected]:bg-pink-600  data-[hover]:bg-pink-500 p-2 rounded-md">
                            <Gauge /> Tools
                        </Tab>
                    </TabList>
                    <TabPanels>
                        {/* Content of Tab1 => Ingredients */}
                        <TabPanel className="flex flex-wrap gap-3">
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
                        </TabPanel>
                        {/* Content of Tab2 => Tools */}
                        <TabPanel className="flex flex-wrap gap-3">
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
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </section>
        {/* Steps of the recipe => with a swiper and steps count on the title */}
        <section>
            <Title label={`Steps (${steps.length})`} icon={GitFork} />
            <Swiper
                slidesPerView={2}
                spaceBetween={30}
                cssMode={true}
                navigation={true}
                pagination={true}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                className="mySwiper"
            >
                {
                steps.map((step) => (
                    <SwiperSlide>
                        <Step text={step.text} number={step.number} />
                    </SwiperSlide>
                    ))                      
                }  
            </Swiper>

        </section>
        {/* Comments about the recipe */}
        <section>

        </section>
    </div>

  )
}

export default Recipe
